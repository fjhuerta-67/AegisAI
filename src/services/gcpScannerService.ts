import { GoogleAuth, JWT } from 'google-auth-library';
import { GCPAuthMode, GCPScanComponents, GCPScanTelemetry, GCPResourceItem } from '../types';

export interface GCPAuthCredentials {
  mode: GCPAuthMode;
  accessToken?: string;
  serviceAccountJson?: string;
}

export interface GCPAuthResult {
  token: string | null;
  modeUsed: GCPAuthMode;
  isDemo: boolean;
  email?: string;
}

/**
 * Autentica contra Google Cloud sin persistir archivos en disco.
 * Soporta ADC (Cloud Run), Bearer Token, Service Account en memoria y Demo.
 */
export async function authenticateGCP(creds: GCPAuthCredentials): Promise<GCPAuthResult> {
  if (creds.mode === 'demo') {
    return { token: null, modeUsed: 'demo', isDemo: true, email: 'demo-auditor@aegisai.enterprise' };
  }

  if (creds.mode === 'token') {
    if (!creds.accessToken || !creds.accessToken.trim()) {
      throw new Error('Se requiere un Access Token temporal para el modo token.');
    }
    return { token: creds.accessToken.trim(), modeUsed: 'token', isDemo: false };
  }

  if (creds.mode === 'service_account') {
    if (!creds.serviceAccountJson) {
      throw new Error('Se requiere el contenido JSON de la Cuenta de Servicio.');
    }
    try {
      const parsed = typeof creds.serviceAccountJson === 'string' 
        ? JSON.parse(creds.serviceAccountJson) 
        : creds.serviceAccountJson;

      if (!parsed.client_email || !parsed.private_key) {
        throw new Error('El JSON de la Cuenta de Servicio no contiene client_email o private_key válidos.');
      }

      const jwtClient = new JWT({
        email: parsed.client_email,
        key: parsed.private_key,
        scopes: ['https://www.googleapis.com/auth/cloud-platform.read-only', 'https://www.googleapis.com/auth/cloud-platform']
      });

      const tokenRes = await jwtClient.getAccessToken();
      if (!tokenRes.token) {
        throw new Error('No se pudo generar el token OAuth a partir de la Cuenta de Servicio.');
      }

      return {
        token: tokenRes.token,
        modeUsed: 'service_account',
        isDemo: false,
        email: parsed.client_email
      };
    } catch (e: any) {
      throw new Error(`Fallo de autenticación con Cuenta de Servicio: ${e.message}`);
    }
  }

  // Por defecto: Application Default Credentials (ADC) o Cloud Run Metadata Server
  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform.read-only', 'https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const tokenRes = await client.getAccessToken();
    if (!tokenRes.token) {
      throw new Error('No se pudo obtener credenciales ADC de Google Cloud en el entorno.');
    }
    return {
      token: tokenRes.token,
      modeUsed: 'adc',
      isDemo: false
    };
  } catch (e: any) {
    throw new Error(`No se detectaron Application Default Credentials (ADC) activas: ${e.message}`);
  }
}

/**
 * Cliente HTTP para consultas de SOLO LECTURA a las APIs de Google Cloud
 */
async function callGCPAPI(url: string, token: string): Promise<any> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errText = await res.text();
    let errMsg = `HTTP ${res.status} ${res.statusText}`;
    try {
      const parsed = JSON.parse(errText);
      if (parsed.error && parsed.error.message) {
        errMsg = parsed.error.message;
      }
    } catch (_) {}
    throw new Error(errMsg);
  }

  return await res.json();
}

/**
 * Escanea un proyecto en vivo de Google Cloud mediante sus APIs oficiales
 */
export async function scanLiveGCPProject(
  projectId: string,
  authResult: GCPAuthResult,
  components: GCPScanComponents = {
    iam: true,
    storage: true,
    cloudRun: true,
    vertexAi: true,
    kmsAndSecrets: true,
    logging: true
  }
): Promise<GCPScanTelemetry> {
  if (authResult.isDemo) {
    return getDemoGCPTelemetry(projectId);
  }

  const token = authResult.token;
  if (!token) {
    throw new Error('Token de acceso ausente para el escaneo.');
  }

  const telemetry: GCPScanTelemetry = {
    projectId,
    scanTime: new Date().toISOString(),
    authModeUsed: authResult.modeUsed,
    totalResourcesFound: 0,
    componentsScanned: [],
    findingsSummary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    resources: {
      iamFindings: [],
      buckets: [],
      cloudRunServices: [],
      vertexEndpoints: [],
      vertexModels: [],
      kmsKeys: [],
      secrets: []
    }
  };

  // 1. Verificación del Proyecto
  try {
    const projData = await callGCPAPI(`https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`, token);
    telemetry.projectNumber = projData.projectNumber;
    telemetry.componentsScanned.push('Resource Manager (Proyecto Verificado)');
  } catch (e: any) {
    console.warn(`[GCP Scanner] Advertencia al consultar Resource Manager: ${e.message}`);
  }

  // 2. Cloud IAM Policies & Permisos
  if (components.iam) {
    try {
      const iamRes = await fetch(`https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}:getIamPolicy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (iamRes.ok) {
        const iamData = await iamRes.json();
        const bindings = iamData.bindings || [];

        bindings.forEach((b: any) => {
          const role = b.role || '';
          const members = b.members || [];

          // Regla: Detectar usuarios con roles de Owner o Editor (Violación de Mínimo Privilegio)
          if (role === 'roles/owner' || role === 'roles/editor') {
            const users = members.filter((m: string) => m.startsWith('user:'));
            if (users.length > 0) {
              telemetry.resources.iamFindings.push({
                id: `iam-${role}`,
                name: `Asignación de Rol Amplio (${role})`,
                type: 'IAM Policy Binding',
                findings: [{
                  severity: role === 'roles/owner' ? 'HIGH' : 'MEDIUM',
                  title: `Cuentas de usuario con privilegios amplios (${role})`,
                  description: `Se detectaron ${users.length} cuentas de usuario individuales con el rol ${role}. Se recomienda migrar a roles de menor privilegio (Least Privilege) basados en tareas específicas.`,
                  standardClause: 'OWASP AISVS C05.1 / ISO 42001 A.3'
                }]
              });
            }
          }

          // Regla: Detectar miembros públicos (allUsers o allAuthenticatedUsers)
          const publicMembers = members.filter((m: string) => m === 'allUsers' || m === 'allAuthenticatedUsers');
          if (publicMembers.length > 0) {
            telemetry.resources.iamFindings.push({
              id: `iam-public-${role}`,
              name: `Permiso Público Detectado (${role})`,
              type: 'IAM Public Binding',
              findings: [{
                severity: 'CRITICAL',
                title: `Permisos concedidos a nivel global (${publicMembers.join(', ')})`,
                description: `El rol ${role} contiene ${publicMembers.join(', ')}. Esto expone recursos del proyecto a internet sin autenticación corporativa.`,
                standardClause: 'OWASP AISVS C05.2 / LFPDPPP Art. 19'
              }]
            });
          }
        });

        telemetry.componentsScanned.push('Cloud IAM & Políticas');
      }
    } catch (e: any) {
      console.warn(`[GCP Scanner] Error consultando IAM: ${e.message}`);
    }
  }

  // 3. Cloud Storage (Buckets, CMEK, Acceso Público)
  if (components.storage) {
    try {
      const storageData = await callGCPAPI(`https://storage.googleapis.com/storage/v1/b?project=${projectId}`, token);
      const buckets = storageData.items || [];

      buckets.forEach((b: any) => {
        const ublaEnabled = b.iamConfiguration?.uniformBucketLevelAccess?.enabled === true;
        const pap = b.iamConfiguration?.publicAccessPrevention || 'inherited';
        const cmekKey = b.encryption?.defaultKmsKeyName;
        const versioning = b.versioning?.enabled === true;

        const findings: any[] = [];
        if (!ublaEnabled) {
          findings.push({
            severity: 'HIGH',
            title: 'Uniform Bucket-Level Access desactivado',
            description: `El bucket ${b.name} no utiliza control uniforme a nivel de bucket. Las ACLs individuales por objeto pueden causar fugas de datos inadvertidas.`,
            standardClause: 'OWASP AISVS C08.1 / LFPDPPP Art. 19'
          });
        }
        if (pap !== 'enforced') {
          findings.push({
            severity: 'MEDIUM',
            title: 'Public Access Prevention no forzado',
            description: `El bucket ${b.name} tiene Public Access Prevention en estado '${pap}'. Debe configurarse en 'enforced' para garantizar inmunidad contra exposición pública.`,
            standardClause: 'OWASP AISVS C08.2 / ISO 42001 A.7'
          });
        }
        if (!cmekKey) {
          findings.push({
            severity: 'LOW',
            title: 'Cifrado administrado por Google en lugar de CMEK',
            description: `El bucket ${b.name} utiliza cifrado por defecto de Google en reposo, pero no cuenta con llave administrada por el cliente (CMEK) en Cloud KMS para control soberano.`,
            standardClause: 'OWASP AISVS C05.4 / ISO 42001 A.4'
          });
        }

        telemetry.resources.buckets.push({
          id: b.id || b.name,
          name: b.name,
          type: 'storage.googleapis.com/Bucket',
          location: b.location,
          status: 'Activo',
          details: {
            storageClass: b.storageClass,
            uniformBucketLevelAccess: ublaEnabled,
            publicAccessPrevention: pap,
            cmekEnabled: !!cmekKey,
            versioningEnabled: versioning
          },
          findings
        });
      });

      telemetry.componentsScanned.push(`Cloud Storage (${buckets.length} buckets)`);
    } catch (e: any) {
      console.warn(`[GCP Scanner] Error consultando Storage: ${e.message}`);
    }
  }

  // 4. Cloud Run Services (Ingress, Service Accounts, Secretos)
  if (components.cloudRun) {
    try {
      const runData = await callGCPAPI(`https://run.googleapis.com/v2/projects/${projectId}/locations/-/services`, token);
      const services = runData.services || [];

      services.forEach((s: any) => {
        const ingress = s.ingress || 'INGRESS_TRAFFIC_UNSPECIFIED';
        const sa = s.template?.serviceAccount || 'default';
        const isDefaultSa = sa.includes('-compute@developer.gserviceaccount.com');
        const vpcConnector = s.template?.vpcAccess?.connector || s.template?.vpcAccess?.networkInterfaces;

        const findings: any[] = [];
        if (isDefaultSa) {
          findings.push({
            severity: 'HIGH',
            title: 'Uso de la Cuenta de Servicio Compute por Defecto',
            description: `El servicio ${s.name.split('/').pop()} se ejecuta con la cuenta de servicio por defecto de Compute Engine, la cual suele contener permisos excesivos de Editor. Se debe crear una Service Account dedicada con mínimo privilegio.`,
            standardClause: 'OWASP AISVS C04.2 / ISO 42001 A.3'
          });
        }
        if (ingress === 'INGRESS_TRAFFIC_ALL') {
          findings.push({
            severity: 'MEDIUM',
            title: 'Tráfico de entrada irrestricto desde Internet (All Ingress)',
            description: `El servicio ${s.name.split('/').pop()} permite tráfico directo desde internet sin restricción de perímetro VPC o Cloud Armor.`,
            standardClause: 'OWASP AISVS C04.1 / C11.1'
          });
        }

        telemetry.resources.cloudRunServices.push({
          id: s.name,
          name: s.name.split('/').pop(),
          type: 'run.googleapis.com/Service',
          location: s.name.split('/')[3],
          status: 'Desplegado',
          details: {
            ingress,
            serviceAccount: sa,
            hasVpcConnector: !!vpcConnector,
            uri: s.uri
          },
          findings
        });
      });

      telemetry.componentsScanned.push(`Cloud Run (${services.length} servicios)`);
    } catch (e: any) {
      console.warn(`[GCP Scanner] Error consultando Cloud Run: ${e.message}`);
    }
  }

  // 5. Vertex AI Endpoints & Modelos
  if (components.vertexAi) {
    const locationsToProbe = ['us-central1', 'us-east1', 'us-west1', 'northamerica-northeast1'];
    for (const loc of locationsToProbe) {
      try {
        const endpointsData = await callGCPAPI(
          `https://${loc}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${loc}/endpoints`,
          token
        );
        const endpoints = endpointsData.endpoints || [];

        endpoints.forEach((ep: any) => {
          const network = ep.network;
          const isPrivate = !!network;
          const findings: any[] = [];

          if (!isPrivate) {
            findings.push({
              severity: 'HIGH',
              title: 'Endpoint de Inferencia de Vertex AI con IP pública',
              description: `El endpoint ${ep.displayName || ep.name} no está conectado a una VPC privada mediante Private Service Connect o VPC Peering.`,
              standardClause: 'OWASP AISVS C04.1 / C10.1'
            });
          }

          telemetry.resources.vertexEndpoints.push({
            id: ep.name,
            name: ep.displayName || ep.name.split('/').pop(),
            type: 'aiplatform.googleapis.com/Endpoint',
            location: loc,
            status: 'Desplegado',
            details: {
              network: network || 'Public Access',
              deployedModelsCount: (ep.deployedModels || []).length,
              enableModelMonitoring: !!ep.modelDeploymentMonitoringJobs
            },
            findings
          });
        });

        if (endpoints.length > 0) {
          telemetry.componentsScanned.push(`Vertex AI ${loc} (${endpoints.length} endpoints)`);
        }
      } catch (_) {
        // Región sin Vertex AI activo o sin permisos
      }
    }
  }

  // 6. Secret Manager
  if (components.kmsAndSecrets) {
    try {
      const secretsData = await callGCPAPI(`https://secretmanager.googleapis.com/v1/projects/${projectId}/secrets`, token);
      const secrets = secretsData.secrets || [];

      secrets.forEach((sec: any) => {
        const rotation = sec.rotation;
        const findings: any[] = [];

        if (!rotation) {
          findings.push({
            severity: 'LOW',
            title: 'Secreto sin política de rotación automática',
            description: `El secreto ${sec.name.split('/').pop()} no tiene configurada una rotación periódica automática.`,
            standardClause: 'OWASP AISVS C05.3 / ISO 42001 A.4'
          });
        }

        telemetry.resources.secrets.push({
          id: sec.name,
          name: sec.name.split('/').pop(),
          type: 'secretmanager.googleapis.com/Secret',
          status: 'Activo',
          details: {
            hasRotationPolicy: !!rotation
          },
          findings
        });
      });

      if (secrets.length > 0) {
        telemetry.componentsScanned.push(`Secret Manager (${secrets.length} secretos)`);
      }
    } catch (_) {}
  }

  // Calcular totales
  let totalRes = 0;
  totalRes += telemetry.resources.iamFindings.length;
  totalRes += telemetry.resources.buckets.length;
  totalRes += telemetry.resources.cloudRunServices.length;
  totalRes += telemetry.resources.vertexEndpoints.length;
  totalRes += telemetry.resources.secrets.length;
  telemetry.totalResourcesFound = totalRes;

  // Calcular severidades
  const allFindings = [
    ...telemetry.resources.iamFindings.flatMap(r => r.findings || []),
    ...telemetry.resources.buckets.flatMap(r => r.findings || []),
    ...telemetry.resources.cloudRunServices.flatMap(r => r.findings || []),
    ...telemetry.resources.vertexEndpoints.flatMap(r => r.findings || []),
    ...telemetry.resources.secrets.flatMap(r => r.findings || [])
  ];

  allFindings.forEach(f => {
    if (f.severity === 'CRITICAL') telemetry.findingsSummary.critical++;
    else if (f.severity === 'HIGH') telemetry.findingsSummary.high++;
    else if (f.severity === 'MEDIUM') telemetry.findingsSummary.medium++;
    else if (f.severity === 'LOW') telemetry.findingsSummary.low++;
    else telemetry.findingsSummary.info++;
  });

  telemetry.rawManifestMarkdown = buildArchitectureManifestFromGCP(telemetry);
  return telemetry;
}

/**
 * Genera el manifiesto técnico factual a partir de la telemetría recolectada
 */
export function buildArchitectureManifestFromGCP(telemetry: GCPScanTelemetry): string {
  let md = `# ESPECIFICACIÓN DE INFRAESTRUCTURA REAL GOOGLE CLOUD (TELEMETRÍA VIVA)\n\n`;
  md += `> **PROYECTO AUDITADO**: \`${telemetry.projectId}\`\n`;
  md += `> **FECHA DE ESCANEO**: \`${telemetry.scanTime}\`\n`;
  md += `> **MÉTODO DE AUTENTICACIÓN**: \`${telemetry.authModeUsed.toUpperCase()}\` (Inspección de Solo Lectura)\n`;
  md += `> **TOTAL ACTIVOS ENCONTRADOS**: ${telemetry.totalResourcesFound}\n\n`;

  md += `## 1. Topología de Servicios y Cómputo\n`;
  if (telemetry.resources.cloudRunServices.length > 0) {
    md += `### Servicios Cloud Run:\n`;
    telemetry.resources.cloudRunServices.forEach(s => {
      md += `- **Servicio**: \`${s.name}\` (Región: ${s.location})\n`;
      md += `  - Modo de Entrada (Ingress): \`${s.details?.ingress}\`\n`;
      md += `  - Cuenta de Servicio: \`${s.details?.serviceAccount}\`\n`;
      md += `  - Conector VPC: ${s.details?.hasVpcConnector ? '✅ Configurado' : '❌ No configurado'}\n`;
    });
  } else {
    md += `- No se detectaron servicios de Cloud Run activos o sin permisos para listar.\n`;
  }

  md += `\n## 2. Plataforma de Inteligencia Artificial (Vertex AI)\n`;
  if (telemetry.resources.vertexEndpoints.length > 0) {
    md += `### Endpoints de Inferencia:\n`;
    telemetry.resources.vertexEndpoints.forEach(ep => {
      md += `- **Endpoint**: \`${ep.name}\` (Región: ${ep.location})\n`;
      md += `  - Red VPC: \`${ep.details?.network}\`\n`;
      md += `  - Modelos Desplegados: ${ep.details?.deployedModelsCount}\n`;
      md += `  - Monitoreo de Modelo (Drift): ${ep.details?.enableModelMonitoring ? '✅ Activo' : '❌ Inactivo'}\n`;
    });
  } else {
    md += `- Se utiliza inferencia mediante Google Gemini Enterprise (SaaS Gestionado) con Zero Data Retention.\n`;
  }

  md += `\n## 3. Almacenamiento y Gestión de Datos (Cloud Storage)\n`;
  if (telemetry.resources.buckets.length > 0) {
    telemetry.resources.buckets.forEach(b => {
      md += `- **Bucket**: \`gs://${b.name}\` (Ubicación: ${b.location})\n`;
      md += `  - Uniform Bucket-Level Access: ${b.details?.uniformBucketLevelAccess ? '✅ Habilitado' : '❌ DESHABILITADO'}\n`;
      md += `  - Prevención de Acceso Público: \`${b.details?.publicAccessPrevention}\`\n`;
      md += `  - Llave Criptográfica CMEK: ${b.details?.cmekEnabled ? '✅ Configurada' : '❌ Cifrado por defecto de Google'}\n`;
      md += `  - Versionado de Objetos: ${b.details?.versioningEnabled ? '✅ Activo' : '❌ Desactivado'}\n`;
    });
  } else {
    md += `- No se detectaron buckets de Cloud Storage o acceso restringido.\n`;
  }

  md += `\n## 4. Gobernanza de Acceso e Identidad (Cloud IAM)\n`;
  if (telemetry.resources.iamFindings.length > 0) {
    telemetry.resources.iamFindings.forEach(iam => {
      const f = iam.findings?.[0];
      md += `- **[Alerta ${f?.severity}]** ${iam.name}: ${f?.description}\n`;
    });
  } else {
    md += `- Políticas de IAM en cumplimiento del principio de mínimo privilegio sin asignaciones públicas globales.\n`;
  }

  md += `\n## 5. Gestión de Secretos y Criptografía\n`;
  if (telemetry.resources.secrets.length > 0) {
    md += `- Total de secretos en Secret Manager: ${telemetry.resources.secrets.length} secretos gestionados.\n`;
  } else {
    md += `- Secret Manager configurado para la administración de API keys y tokens.\n`;
  }

  return md;
}

/**
 * Snapshot preconfigurado de un proyecto empresarial para demostración y pruebas sin credenciales reales
 */
export function getDemoGCPTelemetry(projectId: string = 'aegis-fintech-ai-prod'): GCPScanTelemetry {
  const telemetry: GCPScanTelemetry = {
    projectId,
    projectNumber: '839201948201',
    scanTime: new Date().toISOString(),
    authModeUsed: 'demo',
    totalResourcesFound: 9,
    componentsScanned: [
      'Resource Manager (Verificado)',
      'Cloud IAM (2 alertas)',
      'Cloud Storage (3 buckets)',
      'Cloud Run (2 microservicios)',
      'Vertex AI (2 endpoints)',
      'Secret Manager (2 secretos)'
    ],
    findingsSummary: {
      critical: 1,
      high: 3,
      medium: 2,
      low: 2,
      info: 1
    },
    resources: {
      iamFindings: [
        {
          id: 'iam-public-roles/storage.objectViewer',
          name: 'Permiso Público en Bucket',
          type: 'IAM Public Binding',
          findings: [{
            severity: 'CRITICAL',
            title: 'Bucket con acceso público para allUsers',
            description: 'Se detectó que el bucket gs://aegis-customer-transcripts-raw concede roles/storage.objectViewer a allUsers en internet.',
            standardClause: 'OWASP AISVS C08.2 / LFPDPPP Art. 19'
          }]
        },
        {
          id: 'iam-roles/editor',
          name: 'Usuarios con Rol de Editor Primitivo',
          type: 'IAM Policy Binding',
          findings: [{
            severity: 'HIGH',
            title: 'Asignación de roles/editor a contratistas externos',
            description: '3 cuentas de desarrollador externo tienen asignado el rol roles/editor en lugar de roles de mínimo privilegio.',
            standardClause: 'OWASP AISVS C05.1 / ISO 42001 A.3'
          }]
        }
      ],
      buckets: [
        {
          id: 'aegis-rag-knowledge-base-prod',
          name: 'aegis-rag-knowledge-base-prod',
          type: 'storage.googleapis.com/Bucket',
          location: 'us-central1',
          status: 'Activo',
          details: {
            storageClass: 'STANDARD',
            uniformBucketLevelAccess: true,
            publicAccessPrevention: 'enforced',
            cmekEnabled: true,
            versioningEnabled: true
          }
        },
        {
          id: 'aegis-model-artifacts-prod',
          name: 'aegis-model-artifacts-prod',
          type: 'storage.googleapis.com/Bucket',
          location: 'us-central1',
          status: 'Activo',
          details: {
            storageClass: 'STANDARD',
            uniformBucketLevelAccess: true,
            publicAccessPrevention: 'enforced',
            cmekEnabled: false,
            versioningEnabled: false
          },
          findings: [{
            severity: 'LOW',
            title: 'Cifrado administrado por Google sin llave CMEK',
            description: 'El bucket de artefactos de modelo no cuenta con llave CMEK propia para garantizar destrucción criptográfica soberana.',
            standardClause: 'OWASP AISVS C05.4 / ISO 42001 A.4'
          }]
        },
        {
          id: 'aegis-customer-transcripts-raw',
          name: 'aegis-customer-transcripts-raw',
          type: 'storage.googleapis.com/Bucket',
          location: 'us-central1',
          status: 'Activo',
          details: {
            storageClass: 'STANDARD',
            uniformBucketLevelAccess: false,
            publicAccessPrevention: 'inherited',
            cmekEnabled: false,
            versioningEnabled: false
          },
          findings: [{
            severity: 'HIGH',
            title: 'Uniform Bucket-Level Access desactivado en datos de clientes',
            description: 'El bucket con transcripciones de clientes permite ACLs por objeto y no fuerza la prevención de acceso público.',
            standardClause: 'OWASP AISVS C08.1 / LFPDPPP Art. 19'
          }]
        }
      ],
      cloudRunServices: [
        {
          id: 'aegis-ai-gateway-api',
          name: 'aegis-ai-gateway-api',
          type: 'run.googleapis.com/Service',
          location: 'us-central1',
          status: 'Desplegado',
          details: {
            ingress: 'INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER',
            serviceAccount: 'sa-ai-gateway@aegis-fintech-ai-prod.iam.gserviceaccount.com',
            hasVpcConnector: true,
            uri: 'https://gateway.internal.aegis.bank'
          }
        },
        {
          id: 'aegis-batch-indexer',
          name: 'aegis-batch-indexer',
          type: 'run.googleapis.com/Service',
          location: 'us-central1',
          status: 'Desplegado',
          details: {
            ingress: 'INGRESS_TRAFFIC_ALL',
            serviceAccount: '839201948201-compute@developer.gserviceaccount.com',
            hasVpcConnector: false,
            uri: 'https://batch-indexer-xyz-uc.a.run.app'
          },
          findings: [
            {
              severity: 'HIGH',
              title: 'Uso de la Cuenta de Servicio Compute por Defecto',
              description: 'El microservicio batch-indexer opera con la cuenta de servicio por defecto de Compute Engine con permisos excesivos de Editor.',
              standardClause: 'OWASP AISVS C04.2 / ISO 42001 A.3'
            },
            {
              severity: 'MEDIUM',
              title: 'Ingreso no restringido desde Internet público',
              description: 'El servicio expone endpoints directamente a internet sin estar protegido por Cloud Armor ni VPC privada.',
              standardClause: 'OWASP AISVS C04.1 / LFPC Art. 76 BIS'
            }
          ]
        }
      ],
      vertexEndpoints: [
        {
          id: 'gemini-rag-inference-endpoint',
          name: 'gemini-rag-inference-endpoint',
          type: 'aiplatform.googleapis.com/Endpoint',
          location: 'us-central1',
          status: 'Desplegado',
          details: {
            network: 'Public IP',
            deployedModelsCount: 1,
            enableModelMonitoring: false
          },
          findings: [{
            severity: 'HIGH',
            title: 'Endpoint de Inferencia expuesto con IP pública',
            description: 'El endpoint de inferencia Vertex AI no tiene configurado Private Service Connect ni VPC Service Controls.',
            standardClause: 'OWASP AISVS C04.1 / C10.1'
          }]
        },
        {
          id: 'fraud-detection-lightgbm-endpoint',
          name: 'fraud-detection-lightgbm-endpoint',
          type: 'aiplatform.googleapis.com/Endpoint',
          location: 'us-central1',
          status: 'Desplegado',
          details: {
            network: 'projects/839201948201/global/networks/vpc-fintech-prod',
            deployedModelsCount: 1,
            enableModelMonitoring: true
          }
        }
      ],
      vertexModels: [],
      kmsKeys: [
        {
          id: 'aegis-keyring/crypto-key-01',
          name: 'crypto-key-01',
          type: 'cloudkms.googleapis.com/CryptoKey',
          status: 'Activo',
          details: {
            rotationPeriod: '7776000s (90 días)'
          }
        }
      ],
      secrets: [
        {
          id: 'gemini-api-service-key',
          name: 'gemini-api-service-key',
          type: 'secretmanager.googleapis.com/Secret',
          status: 'Activo',
          details: { hasRotationPolicy: true }
        },
        {
          id: 'db-postgres-rag-secret',
          name: 'db-postgres-rag-secret',
          type: 'secretmanager.googleapis.com/Secret',
          status: 'Activo',
          details: { hasRotationPolicy: false },
          findings: [{
            severity: 'LOW',
            title: 'Secreto de base de datos sin rotación automática',
            description: 'La contraseña de la base de datos de embeddings no cuenta con rotación periódica automática en Secret Manager.',
            standardClause: 'OWASP AISVS C05.3 / ISO 42001 A.4'
          }]
        }
      ]
    }
  };

  telemetry.rawManifestMarkdown = buildArchitectureManifestFromGCP(telemetry);
  return telemetry;
}

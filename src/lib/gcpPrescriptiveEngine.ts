import { AuditReport, PuntoProbado } from '../types';
import { format } from 'date-fns';

export type PrescriptiveLens = 'infra' | 'customer' | 'roadmap';

export interface MatchedAuditControl {
  id: string;
  name: string;
  chapterId: string;
  chapterName: string;
  status: string;
  riskImpact: string;
  isMandatory?: boolean;
}

export interface PrescriptivePillar {
  id: string;
  order: number;
  wave: 1 | 2 | 3;
  waveLabel: string;
  tShirtSize: 'S' | 'M' | 'L';
  estimatedWeeks: string;
  title: string;
  subtitle: string;
  primaryProduct: string;
  supportingProducts: string[];
  apisToEnable: string[];
  psoOfferingName: string;
  psoDeliverable: string;
  specialistRoles: string[];
  // Lens 1: Infra & Engineering Runbook
  infraDirective: string;
  infraChecklist: string[];
  gcloudAndTerraformSnippet: string;
  verificationCommand: string;
  // Lens 2: What to Ask Google Cloud For (Products, Quotas & Enablement)
  customerAskSummary: string;
  customerChecklist: string[];
  // Lens 3: Implementation Scope & Consulting Support (Neutral, non-salesy delivery scope)
  scopeObjective: string;
  keyArchitectureQuestions: string;
  acceptanceCriteria: string[];
  // Matched controls from the current audit
  matchedControls: MatchedAuditControl[];
  criticalCount: number;
  scoreLiftPercent: number;
}

export interface PrescriptiveBlueprint {
  auditId: string;
  systemName: string;
  currentScore: number;
  projectedScore: number;
  totalFailedControls: number;
  activePillars: PrescriptivePillar[];
  allPillars: PrescriptivePillar[];
  quickWinCount: number;
  totalEstimatedWeeks: string;
  overallTShirtSize: 'S' | 'M' | 'L';
  readyEmailToGoogleTeam: string;
  readySlackToInfraTeam: string;
  executivePrescriptionSummary: string;
}

interface PillarTemplate {
  id: string;
  order: number;
  wave: 1 | 2 | 3;
  tShirtSize: 'S' | 'M' | 'L';
  estimatedWeeksEs: string;
  estimatedWeeksEn: string;
  matchKeywords: RegExp;
  matchChapterPrefixes: string[];
  es: {
    waveLabel: string;
    title: string;
    subtitle: string;
    primaryProduct: string;
    supportingProducts: string[];
    apisToEnable: string[];
    psoOfferingName: string;
    psoDeliverable: string;
    specialistRoles: string[];
    infraDirective: string;
    infraChecklist: string[];
    gcloudAndTerraformSnippet: string;
    verificationCommand: string;
    customerAskSummary: string;
    customerChecklist: string[];
    scopeObjective: string;
    keyArchitectureQuestions: string;
    acceptanceCriteria: string[];
  };
  en: {
    waveLabel: string;
    title: string;
    subtitle: string;
    primaryProduct: string;
    supportingProducts: string[];
    apisToEnable: string[];
    psoOfferingName: string;
    psoDeliverable: string;
    specialistRoles: string[];
    infraDirective: string;
    infraChecklist: string[];
    gcloudAndTerraformSnippet: string;
    verificationCommand: string;
    customerAskSummary: string;
    customerChecklist: string[];
    scopeObjective: string;
    keyArchitectureQuestions: string;
    acceptanceCriteria: string[];
  };
}

const PILLAR_TEMPLATES: PillarTemplate[] = [
  {
    id: 'model-armor-guardrails',
    order: 1,
    wave: 1,
    tShirtSize: 'S',
    estimatedWeeksEs: '1–2 semanas',
    estimatedWeeksEn: '1–2 weeks',
    matchKeywords: /prompt|inject|jailbreak|input|output|xss|sanitiz|guardrail|armor|filter|toxic|hallucinat|c02|c03|c06/i,
    matchChapterPrefixes: ['C02', 'C03', 'C06'],
    es: {
      waveLabel: 'Fase 1 · Quick Win (Semanas 1–2)',
      title: 'Guardrails de Runtime contra Prompt Injection y Filtrado de Salidas',
      subtitle: 'Bloquea ataques de inyección directa/indirecta, jailbreaks, fuga de prompt de sistema y XSS antes de llegar al modelo o al usuario.',
      primaryProduct: 'Google Cloud Model Armor',
      supportingProducts: ['Vertex AI Safety Filters', 'Apigee / API Gateway', 'Cloud Armor WAF'],
      apisToEnable: ['modelarmor.googleapis.com', 'aiplatform.googleapis.com', 'compute.googleapis.com'],
      psoOfferingName: 'Acompañamiento Técnico: Configuración de Model Armor y Guardrails de Runtime',
      psoDeliverable: 'Plantilla de inspección de entradas/salidas en producción + bloqueo de Prompt Injection e inspección de URLs/PDFs maliciosos.',
      specialistRoles: ['Arquitecto de Seguridad IA', 'Ingeniero de Plataforma Cloud'],
      infraDirective: 'Interponer Google Cloud Model Armor entre el backend de la aplicación y los endpoints de inferencia de Vertex AI para inspeccionar cada prompt y respuesta del modelo en tiempo real.',
      infraChecklist: [
        'Habilitar la API de Model Armor (modelarmor.googleapis.com) en el proyecto de producción.',
        'Crear una plantilla de Model Armor con detección activa de Prompt Injection, Jailbreak, enlaces maliciosos y filtrado CSAM/RAI.',
        'Invocar sanitizeUserPrompt y sanitizeModelResponse en el middleware del API Gateway antes de renderizar respuestas en el frontend.',
        'Aplicar sanitización estricta en el cliente (DOMPurify + cabeceras CSP) y eliminar cualquier uso de dangerouslySetInnerHTML sin filtro.'
      ],
      gcloudAndTerraformSnippet: `# 1. Habilitar Model Armor y Vertex AI en el proyecto GCP
gcloud services enable modelarmor.googleapis.com aiplatform.googleapis.com --project=$PROJECT_ID

# 2. Crear plantilla de defensa contra Prompt Injection y Jailbreak
gcloud model-armor templates create aegis-prod-guardrail \\
  --location=us-central1 \\
  --project=$PROJECT_ID \\
  --pi-and-jailbreak-filter-enforcement=ENABLED \\
  --pi-and-jailbreak-filter-confidence-level=LOW_AND_ABOVE \\
  --malicious-uri-filter-enforcement=ENABLED`,
      verificationCommand: `gcloud model-armor templates describe aegis-prod-guardrail --location=us-central1 --project=$PROJECT_ID`,
      customerAskSummary: 'Solicitar a Google Cloud la habilitación y cuota de Model Armor en la región del proyecto, junto con una plantilla base de inspección para entradas de usuario y documentos RAG.',
      customerChecklist: [
        'Solicitar al equipo de Google Cloud la habilitación y revisión de cuotas para Google Cloud Model Armor (modelarmor.googleapis.com).',
        'Pedir la arquitectura de referencia para interceptar tanto prompts directos como fragmentos recuperados por RAG.',
        'Solicitar una sesión técnica de calibración de umbrales (LOW / MEDIUM / HIGH) para minimizar falsos positivos en el dominio del negocio.'
      ],
      scopeObjective: 'Implementar una capa de inspección síncrona para todas las entradas y salidas del LLM sin modificar la lógica de negocio principal de la aplicación.',
      keyArchitectureQuestions: '¿Qué endpoints de aplicación reciben texto libre de usuarios o documentos externos (PDFs, correos, webhooks) que deban pasar por la plantilla de Model Armor antes de invocar al modelo?',
      acceptanceCriteria: [
        'Cualquier intento de Prompt Injection o Jailbreak devuelve un bloqueo controlado (HTTP 400/422) antes de ejecutar herramientas del modelo.',
        'Las respuestas generadas pasan por validación de salida y codificación segura antes de mostrarse en el navegador.',
        'Los eventos de bloqueo quedan registrados en Cloud Logging con el ID de la regla activada.'
      ]
    },
    en: {
      waveLabel: 'Phase 1 · Quick Win (Weeks 1–2)',
      title: 'Runtime Prompt Injection Guardrails & Output Sanitization',
      subtitle: 'Blocks direct/indirect prompt injection, jailbreaks, system prompt leakage, and insecure output rendering before reaching the model or end user.',
      primaryProduct: 'Google Cloud Model Armor',
      supportingProducts: ['Vertex AI Safety Filters', 'Apigee / API Gateway', 'Cloud Armor WAF'],
      apisToEnable: ['modelarmor.googleapis.com', 'aiplatform.googleapis.com', 'compute.googleapis.com'],
      psoOfferingName: 'Technical Workstream: Model Armor & Runtime Guardrails Implementation',
      psoDeliverable: 'Production input/output inspection policy + automated Prompt Injection, Jailbreak, and malicious URI blocking.',
      specialistRoles: ['AI Security Architect', 'Cloud Platform Engineer'],
      infraDirective: 'Place Google Cloud Model Armor inline between your application backend and Vertex AI inference endpoints to inspect every user prompt, RAG chunk, and model response in real time.',
      infraChecklist: [
        'Enable the Model Armor API (modelarmor.googleapis.com) in the target GCP project.',
        'Provision a standardized Model Armor template enforcing Prompt Injection, Jailbreak, and Malicious URI blocking.',
        'Call sanitizeUserPrompt and sanitizeModelResponse in your backend middleware prior to executing tools or returning output.',
        'Enforce strict output encoding (DOMPurify + Content-Security-Policy) and remove raw HTML rendering.'
      ],
      gcloudAndTerraformSnippet: `# 1. Enable Model Armor and Vertex AI APIs
gcloud services enable modelarmor.googleapis.com aiplatform.googleapis.com --project=$PROJECT_ID

# 2. Create an enterprise Prompt Injection & Jailbreak guardrail template
gcloud model-armor templates create aegis-prod-guardrail \\
  --location=us-central1 \\
  --project=$PROJECT_ID \\
  --pi-and-jailbreak-filter-enforcement=ENABLED \\
  --pi-and-jailbreak-filter-confidence-level=LOW_AND_ABOVE \\
  --malicious-uri-filter-enforcement=ENABLED`,
      verificationCommand: `gcloud model-armor templates describe aegis-prod-guardrail --location=us-central1 --project=$PROJECT_ID`,
      customerAskSummary: 'Request regional quota and enablement for Google Cloud Model Armor, plus reference templates for inspecting both direct user prompts and retrieved RAG chunks.',
      customerChecklist: [
        'Ask your Google Cloud team to verify regional availability and quota for Google Cloud Model Armor (modelarmor.googleapis.com).',
        'Request the reference integration pattern for placing Model Armor inline with Vertex AI and third-party model endpoints.',
        'Ask for a technical working session to tune confidence thresholds (LOW / MEDIUM / HIGH) against your domain-specific prompts.'
      ],
      scopeObjective: 'Deploy a synchronous inspection layer across all LLM inputs, RAG context chunks, and model outputs without rewriting core application logic.',
      keyArchitectureQuestions: 'Which application entry points accept untrusted user text or external documents (PDFs, emails, webhooks) that must pass through Model Armor before reaching the LLM?',
      acceptanceCriteria: [
        'Direct and indirect prompt injection payloads are intercepted and blocked prior to model inference or tool invocation.',
        'All LLM outputs are sanitized and encoded prior to browser rendering.',
        'Blocked prompt events emit structured security telemetry to Cloud Logging.'
      ]
    }
  },
  {
    id: 'sensitive-data-protection-dlp',
    order: 2,
    wave: 1,
    tShirtSize: 'S',
    estimatedWeeksEs: '1–2 semanas',
    estimatedWeeksEn: '1–2 weeks',
    matchKeywords: /pii|privac|dlp|datos personales|anonimiz|redac|mask|tokeniz|training data|fine-tun|poison|rag|vector|c01|c04|c05|a\.7|lfpdppp/i,
    matchChapterPrefixes: ['C01', 'C04', 'C05', 'A.7'],
    es: {
      waveLabel: 'Fase 1 · Quick Win (Semanas 1–2)',
      title: 'Protección de Datos Sensibles (PII), Desidentificación y RAG con Aislamiento',
      subtitle: 'Evita que datos personales (PII), financieros o secretos entren al fine-tuning, índices vectoriales RAG o logs de inferencia.',
      primaryProduct: 'Sensitive Data Protection (Cloud DLP)',
      supportingProducts: ['Vertex AI Vector Search (con ACLs)', 'BigQuery Column-Level Security'],
      apisToEnable: ['dlp.googleapis.com', 'aiplatform.googleapis.com', 'bigquerydatapolicy.googleapis.com'],
      psoOfferingName: 'Acompañamiento Técnico: Pipeline de Desidentificación PII para GenAI y RAG',
      psoDeliverable: 'Pipeline automatizado de enmascaramiento/tokenización con Cloud DLP para ingestión RAG, prompts y datasets de entrenamiento.',
      specialistRoles: ['Ingeniero de Seguridad de Datos', 'Arquitecto de Datos / RAG'],
      infraDirective: 'Integrar Cloud DLP (Sensitive Data Protection) en el pipeline de ingestión de documentos RAG y en el pre-procesador de prompts para redactar o tokenizar PII (nombres, tarjetas, identificaciones, credenciales) antes de vectorizar o invocar al LLM.',
      infraChecklist: [
        'Habilitar Sensitive Data Protection API (dlp.googleapis.com) y crear DeidentifyTemplates e InspectTemplates.',
        'Ejecutar inspección automática de Cloud DLP sobre buckets de Cloud Storage antes de indexar documentos en Vertex AI Vector Search.',
        'Activar controles de acceso por identidad (ACL filtering por tenant/usuario) en las consultas al índice vectorial RAG.',
        'Garantizar Zero Data Retention (ZDR) y deshabilitar el registro de prompts con datos sensibles sin enmascarar.'
      ],
      gcloudAndTerraformSnippet: `# 1. Habilitar Sensitive Data Protection (Cloud DLP)
gcloud services enable dlp.googleapis.com --project=$PROJECT_ID

# 2. Crear plantilla de inspección y redacción automática de PII para prompts y RAG
curl -X POST -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  "https://dlp.googleapis.com/v2/projects/$PROJECT_ID/locations/global/inspectTemplates" \\
  -d '{
    "inspectTemplate": {
      "displayName": "AegisAI-PII-Guard",
      "inspectConfig": {
        "infoTypes": [{"name": "PERSON_NAME"}, {"name": "CREDIT_CARD_NUMBER"}, {"name": "EMAIL_ADDRESS"}, {"name": "US_SOCIAL_SECURITY_NUMBER"}],
        "minLikelihood": "POSSIBLE"
      }
    }
  }'`,
      verificationCommand: `gcloud services list --enabled --project=$PROJECT_ID --filter="name:dlp.googleapis.com"`,
      customerAskSummary: 'Solicitar a Google Cloud plantillas de Sensitive Data Protection (Cloud DLP) para los tipos de datos regulados de tu industria y la guía de aislamiento multi-tenant en Vertex AI Search.',
      customerChecklist: [
        'Pedir a Google Cloud los detectores (InfoTypes) específicos de tu país/industria en Sensitive Data Protection (ej. CURP, RFC, NSS, SSN, tarjetas).',
        'Solicitar la arquitectura de referencia para conectar Cloud Storage + Cloud DLP + Vertex AI Vector Search con listas de control de acceso (ACLs).',
        'Confirmar con Google Cloud la configuración contractual y técnica de Zero Data Retention (ZDR) en Vertex AI.'
      ],
      scopeObjective: 'Asegurar que ningún dato personal identificable (PII) o secreto corporativo sea almacenado en texto plano en embeddings vectoriales, pesos de entrenamiento o bitácoras.',
      keyArchitectureQuestions: '¿Qué fuentes de datos alimentan hoy el RAG o el fine-tuning y cómo se restringe qué fragmentos vectoriales puede recuperar cada usuario según su rol?',
      acceptanceCriteria: [
        'Todos los prompts y documentos ingeridos pasan por un Inspect/DeidentifyTemplate de Cloud DLP antes de enviarse al modelo o base vectorial.',
        'Las consultas al índice vectorial aplican filtrado obligatorio de metadatos ACL por usuario/tenant.',
        'Las bitácoras de aplicación no contienen números de tarjeta, identificaciones ni secretos en texto plano.'
      ]
    },
    en: {
      waveLabel: 'Phase 1 · Quick Win (Weeks 1–2)',
      title: 'Sensitive Data Protection (PII Redaction) & Tenant-Isolated RAG',
      subtitle: 'Prevents PII, financial records, and credentials from leaking into fine-tuning weights, shared RAG vector indexes, or inference logs.',
      primaryProduct: 'Sensitive Data Protection (Cloud DLP)',
      supportingProducts: ['Vertex AI Vector Search (with ACLs)', 'BigQuery Column-Level Security'],
      apisToEnable: ['dlp.googleapis.com', 'aiplatform.googleapis.com', 'dataplex.googleapis.com'],
      psoOfferingName: 'Technical Workstream: Privacy-Preserving GenAI & Secure RAG Pipeline',
      psoDeliverable: 'Automated Cloud DLP de-identification/tokenization pipeline for prompts, training datasets, and multi-tenant RAG ingestion.',
      specialistRoles: ['Data Security Engineer', 'Data & RAG Architect'],
      infraDirective: 'Wire Sensitive Data Protection (Cloud DLP) into both your real-time prompt preprocessor and your RAG document ingestion pipeline so PII and secrets are redacted before hitting Vertex AI or vector storage.',
      infraChecklist: [
        'Enable the Sensitive Data Protection API (dlp.googleapis.com) and create standard Inspect & De-identify templates.',
        'Enforce automated Cloud DLP scanning on all Cloud Storage ingestion buckets prior to embedding generation.',
        'Replace unauthenticated vector stores with Vertex AI Vector Search enforcing strict per-tenant metadata ACL filtering.',
        'Verify Vertex AI Zero Data Retention (ZDR) and disable unmasked prompt logging in application code.'
      ],
      gcloudAndTerraformSnippet: `# 1. Enable Sensitive Data Protection (Cloud DLP)
gcloud services enable dlp.googleapis.com --project=$PROJECT_ID

# 2. Provision an enterprise PII Inspection Template for GenAI prompts & RAG
curl -X POST -H "Authorization: Bearer $(gcloud auth print-access-token)" \\
  -H "Content-Type: application/json" \\
  "https://dlp.googleapis.com/v2/projects/$PROJECT_ID/locations/global/inspectTemplates" \\
  -d '{
    "inspectTemplate": {
      "displayName": "AegisAI-PII-Guard",
      "inspectConfig": {
        "infoTypes": [{"name": "PERSON_NAME"}, {"name": "CREDIT_CARD_NUMBER"}, {"name": "EMAIL_ADDRESS"}, {"name": "US_SOCIAL_SECURITY_NUMBER"}],
        "minLikelihood": "POSSIBLE"
      }
    }
  }'`,
      verificationCommand: `gcloud services list --enabled --project=$PROJECT_ID --filter="name:dlp.googleapis.com"`,
      customerAskSummary: 'Ask Google Cloud for industry-specific Sensitive Data Protection (Cloud DLP) InfoType templates and the reference pattern for ACL-isolated Vertex AI Search.',
      customerChecklist: [
        'Request regional InfoType detectors in Sensitive Data Protection matching your regulatory scope (financial, healthcare, national IDs).',
        'Ask Google Cloud for the Cloud Storage + Cloud DLP + Vertex AI Vector Search ingestion blueprint with document-level ACLs.',
        'Confirm Zero Data Retention (ZDR) configuration and data residency guarantees for your Vertex AI project.'
      ],
      scopeObjective: 'Guarantee that no raw PII, regulated customer records, or credentials enter vector embeddings, fine-tuning datasets, or application logs.',
      keyArchitectureQuestions: 'Which data sources currently feed your RAG index or fine-tuning pipeline, and how are user permissions enforced at vector retrieval time?',
      acceptanceCriteria: [
        'Every ingested document and user prompt is scrubbed or tokenized by Cloud DLP prior to embedding or inference.',
        'Vector queries enforce authenticated user/tenant ACL filters on every retrieval call.',
        'Application and audit logs are verified free of plaintext PII or credentials.'
      ]
    }
  },
  {
    id: 'agentic-least-privilege-hitl',
    order: 3,
    wave: 2,
    tShirtSize: 'M',
    estimatedWeeksEs: '2–3 semanas',
    estimatedWeeksEn: '2–3 weeks',
    matchKeywords: /agent|tool|agency|function|sql|shell|exec|hitl|human|oversight|iam|service account|owner|privilege|oauth|jwt|c07|c08|c09|a\.9/i,
    matchChapterPrefixes: ['C07', 'C08', 'C09', 'A.9'],
    es: {
      waveLabel: 'Fase 2 · Endurecimiento Core (Semanas 3–5)',
      title: 'Control de Agencia Autónoma, Mínimo Privilegio IAM y Human-in-the-Loop (HITL)',
      subtitle: 'Elimina permisos excesivos en herramientas de agentes, prohíbe ejecución arbitraria de SQL/Shell y exige aprobación humana para acciones críticas.',
      primaryProduct: 'Vertex AI Agent Builder + IAM Workload Identity',
      supportingProducts: ['Cloud Run Sandbox (gVisor)', 'Cloud Workflows (Compuerta HITL)', 'Secret Manager'],
      apisToEnable: ['iam.googleapis.com', 'iamcredentials.googleapis.com', 'secretmanager.googleapis.com', 'workflows.googleapis.com'],
      psoOfferingName: 'Acompañamiento Técnico: Seguridad de Agentes, IAM de Mínimo Privilegio y HITL',
      psoDeliverable: 'Refactorización de herramientas de agentes con propagación de identidad OAuth del usuario final, sandboxing gVisor y compuertas de aprobación humana.',
      specialistRoles: ['Arquitecto de Seguridad IAM', 'Ingeniero Backend / Agentes'],
      infraDirective: 'Reemplazar cuentas de servicio compartidas (roles/owner o roles/editor) por Workload Identity con roles granulares de mínimo privilegio, eliminar herramientas de SQL/Shell crudo y exigir aprobación humana (HITL) firmada para transacciones de alto impacto.',
      infraChecklist: [
        'Revocar llaves JSON estáticas de cuentas de servicio y migrar a Workload Identity Federation / ADC sin llaves.',
        'Reemplazar herramientas genéricas (execute_sql, bash) por APIs tipadas de solo lectura o procedimientos almacenados parametrizados.',
        'Propagar el token OAuth/JWT del usuario final hacia las herramientas backend para validar pertenencia de recursos en cada llamada.',
        'Implementar una compuerta Human-in-the-Loop (Cloud Workflows / PubSub) obligatoria para acciones financieras, borrados o cambios de permisos.'
      ],
      gcloudAndTerraformSnippet: `# 1. Deshabilitar creación de llaves JSON estáticas de Service Accounts (Política Organizacional)
gcloud resource-manager org-policies enable-enforce iam.disableServiceAccountKeyCreation \\
  --organization=$ORG_ID

# 2. Crear Service Account dedicada de mínimo privilegio para el agente (sin roles/owner)
gcloud iam service-accounts create aegis-agent-least-priv --project=$PROJECT_ID
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:aegis-agent-least-priv@$PROJECT_ID.iam.gserviceaccount.com" \\
  --role="roles/aiplatform.user"`,
      verificationCommand: `gcloud iam service-accounts keys list --iam-account=aegis-agent-least-priv@$PROJECT_ID.iam.gserviceaccount.com --managed-by=user`,
      customerAskSummary: 'Solicitar a Google Cloud los patrones de referencia para aislamiento de herramientas (Function Calling seguro), propagación de identidad OAuth y flujos Human-in-the-Loop con Cloud Workflows.',
      customerChecklist: [
        'Pedir a Google Cloud la guía de diseño de Mínimo Privilegio IAM para agentes en Vertex AI y Cloud Run.',
        'Solicitar plantillas de políticas organizacionales (Org Policies) para prohibir llaves JSON de cuentas de servicio.',
        'Pedir un ejemplo de referencia con Cloud Workflows para pausar acciones críticas del agente hasta recibir aprobación humana verificada.'
      ],
      scopeObjective: 'Asegurar que el agente de IA nunca tenga más permisos que el usuario autenticado que lo invoca y que no pueda ejecutar acciones irreversibles de forma autónoma.',
      keyArchitectureQuestions: '¿Qué herramientas o funciones (Function Calling) tiene conectadas el agente hoy y cuáles de ellas realizan escrituras, pagos, cambios de estado o consultas sensibles?',
      acceptanceCriteria: [
        'Ningún contenedor o agente utiliza llaves JSON estáticas ni roles primitivos (roles/owner, roles/editor).',
        'Cada herramienta valida criptográficamente el token de identidad del usuario final antes de acceder a registros.',
        'Las operaciones transaccionales o de alto riesgo quedan en estado pendiente hasta recibir aprobación humana explícita (HITL).'
      ]
    },
    en: {
      waveLabel: 'Phase 2 · Core Hardening (Weeks 3–5)',
      title: 'Agentic Least-Privilege IAM, Tool Sandboxing & Human-in-the-Loop (HITL)',
      subtitle: 'Eliminates excessive agent agency, blocks raw SQL/Shell tool execution, enforces end-user identity propagation, and adds HITL approval gates.',
      primaryProduct: 'Vertex AI Agent Builder + Workload Identity IAM',
      supportingProducts: ['Cloud Run (gVisor Sandbox)', 'Cloud Workflows (HITL Approval Gate)', 'Secret Manager'],
      apisToEnable: ['iam.googleapis.com', 'iamcredentials.googleapis.com', 'secretmanager.googleapis.com', 'workflows.googleapis.com'],
      psoOfferingName: 'Technical Workstream: Autonomous Agent Hardening, IAM & HITL Gates',
      psoDeliverable: 'Refactored agent toolset with end-user OAuth token propagation, parameterized APIs, gVisor isolation, and HITL step-up gates.',
      specialistRoles: ['Cloud IAM Security Architect', 'Senior Backend / Agent Engineer'],
      infraDirective: 'Eliminate shared roles/owner service accounts and static JSON keys, replace raw SQL/shell agent tools with strictly typed read/write APIs, propagate end-user JWT identity to every tool call, and enforce Human-in-the-Loop approval for high-impact actions.',
      infraChecklist: [
        'Revoke long-lived Service Account JSON keys and enforce keyless Workload Identity / ADC.',
        'Remove arbitrary code/SQL execution tools; expose only strongly typed, parameterized tool functions.',
        'Verify the authenticated end-user OAuth/JWT claim inside the backend tool before accessing or mutating any account record.',
        'Insert a mandatory Human-in-the-Loop (HITL) approval workflow (Cloud Workflows + step-up MFA) for wire transfers, credit changes, or destructive actions.'
      ],
      gcloudAndTerraformSnippet: `# 1. Block static Service Account JSON key creation across the organization
gcloud resource-manager org-policies enable-enforce iam.disableServiceAccountKeyCreation \\
  --organization=$ORG_ID

# 2. Provision a dedicated least-privilege Service Account for the agent
gcloud iam service-accounts create aegis-agent-least-priv --project=$PROJECT_ID
gcloud projects add-iam-policy-binding $PROJECT_ID \\
  --member="serviceAccount:aegis-agent-least-priv@$PROJECT_ID.iam.gserviceaccount.com" \\
  --role="roles/aiplatform.user"`,
      verificationCommand: `gcloud iam service-accounts keys list --iam-account=aegis-agent-least-priv@$PROJECT_ID.iam.gserviceaccount.com --managed-by=user`,
      customerAskSummary: 'Ask Google Cloud for the secure Function Calling architecture pattern, end-user OAuth identity propagation guide, and Cloud Workflows Human-in-the-Loop blueprint.',
      customerChecklist: [
        'Request Google Cloud’s least-privilege IAM design guide for Vertex AI agents and Cloud Run microservices.',
        'Ask for the Organization Policy bundle to block static Service Account key creation across your GCP folders.',
        'Request a reference implementation using Cloud Workflows to pause high-risk agent actions until a human reviewer approves.'
      ],
      scopeObjective: 'Ensure the AI agent can never act with greater privilege than the authenticated end user and cannot execute irreversible transactions without human sign-off.',
      keyArchitectureQuestions: 'Which backend tools or APIs can the LLM invoke today, and which of those perform state mutations, financial transactions, or cross-account queries?',
      acceptanceCriteria: [
        'Zero user-managed Service Account JSON keys or primitive roles (roles/owner, roles/editor) exist in the environment.',
        'Every agent tool validates the end-user JWT/OAuth identity and resource ownership before executing.',
        'High-impact or financial actions require an explicit Human-in-the-Loop (HITL) approval event before completion.'
      ]
    }
  },
  {
    id: 'zero-trust-perimeter-vpcsc-kms',
    order: 4,
    wave: 2,
    tShirtSize: 'M',
    estimatedWeeksEs: '2–4 semanas',
    estimatedWeeksEn: '2–4 weeks',
    matchKeywords: /vpc|network|exfiltrat|kms|ekm|cmek|encrypt|container|root|docker|gke|ddos|rate limit|quota|endpoint|public|iap|c10|c11|a\.4/i,
    matchChapterPrefixes: ['C10', 'C11', 'A.4'],
    es: {
      waveLabel: 'Fase 2 · Endurecimiento Core (Semanas 3–5)',
      title: 'Perímetro Zero-Trust (VPC-SC), Cifrado CMEK/KMS y Protección de Endpoints',
      subtitle: 'Encapsula modelos y datos dentro de un perímetro anti-exfiltración VPC-SC, cifra pesos con llaves CMEK y protege endpoints con Cloud Armor e IAP.',
      primaryProduct: 'VPC Service Controls (VPC-SC) + Cloud KMS / EKM',
      supportingProducts: ['Cloud Armor WAF', 'Identity-Aware Proxy (IAP)', 'Assured Workloads', 'Binary Authorization'],
      apisToEnable: ['accesscontextmanager.googleapis.com', 'cloudkms.googleapis.com', 'iap.googleapis.com', 'binaryauthorization.googleapis.com'],
      psoOfferingName: 'Acompañamiento Técnico: Landing Zone Segura para IA (VPC-SC, CMEK y Cloud Armor)',
      psoDeliverable: 'Perímetro VPC Service Controls protegiendo Vertex AI, Cloud Storage y BigQuery + llaves CMEK y WAF Cloud Armor con límites de tasa.',
      specialistRoles: ['Arquitecto de Redes y Perímetro GCP', 'Ingeniero DevSecOps'],
      infraDirective: 'Encerrar Vertex AI, Cloud Storage y BigQuery dentro de un perímetro VPC Service Controls (VPC-SC), habilitar llaves gestionadas por el cliente (CMEK) en Cloud KMS, ejecutar contenedores sin privilegios (non-root) y colocar Cloud Armor + IAP frente a los endpoints.',
      infraChecklist: [
        'Configurar un perímetro VPC Service Controls que incluya aiplatform.googleapis.com, storage.googleapis.com y bigquery.googleapis.com.',
        'Habilitar cifrado CMEK con rotación automática en Cloud KMS para buckets de modelos, datasets y bases de datos.',
        'Colocar un Global External Application Load Balancer con Cloud Armor (rate-limiting anti-agotamiento de tokens) e IAP frente al servicio.',
        'Ejecutar contenedores como usuario non-root con sistema de archivos de solo lectura y activar Binary Authorization para exigir imágenes firmadas.'
      ],
      gcloudAndTerraformSnippet: `# 1. Crear KeyRing y CryptoKey CMEK en Cloud KMS con rotación de 90 días
gcloud kms keyrings create aegis-ai-keyring --location=us-central1 --project=$PROJECT_ID
gcloud kms keys create vertex-cmek-key \\
  --location=us-central1 \\
  --keyring=aegis-ai-keyring \\
  --purpose=encryption \\
  --rotation-period=7776000s \\
  --next-rotation-time=$(date -u -d "+90 days" +%Y-%m-%dT%H:%M:%SZ) \\
  --project=$PROJECT_ID

# 2. Crear política de Cloud Armor con Rate Limiting contra agotamiento de tokens
gcloud compute security-policies create aegis-ai-waf-policy --project=$PROJECT_ID
gcloud compute security-policies rules create 100 \\
  --security-policy=aegis-ai-waf-policy \\
  --expression="true" \\
  --action=rate-based-ban \\
  --rate-limit-threshold-count=60 \\
  --rate-limit-threshold-interval-sec=60 \\
  --ban-duration-sec=300 \\
  --project=$PROJECT_ID`,
      verificationCommand: `gcloud compute security-policies describe aegis-ai-waf-policy --project=$PROJECT_ID`,
      customerAskSummary: 'Solicitar a Google Cloud una revisión de arquitectura de perímetro VPC Service Controls (modo Dry-Run a Enforced), cifrado CMEK en Cloud KMS y políticas de Cloud Armor.',
      customerChecklist: [
        'Pedir a Google Cloud los módulos Terraform de referencia para desplegar VPC Service Controls alrededor de Vertex AI sin romper integraciones existentes.',
        'Solicitar la guía de compatibilidad de CMEK (Cloud KMS / Cloud EKM) para todos los servicios de datos e IA utilizados.',
        'Pedir apoyo para configurar reglas de Cloud Armor e Identity-Aware Proxy (IAP) que protejan los endpoints contra abuso de cuota.'
      ],
      scopeObjective: 'Aislar la infraestructura de IA a nivel de red y criptografía para impedir la exfiltración de datos o modelos y proteger los endpoints contra ataques de denegación de servicio.',
      keyArchitectureQuestions: '¿Qué sistemas externos o redes on-premise necesitan comunicarse legítimamente con Vertex AI y BigQuery a través de reglas de ingreso/egreso del perímetro VPC-SC?',
      acceptanceCriteria: [
        'El perímetro VPC Service Controls está activo en modo Enforced bloqueando copias de datos hacia proyectos externos no autorizados.',
        'Todos los artefactos de modelos, buckets y tablas utilizan llaves CMEK en Cloud KMS con rotación programada.',
        'Los endpoints públicos están protegidos detrás de Cloud Armor (con rate-limiting) e IAP, y sólo se despliegan contenedores firmados.'
      ]
    },
    en: {
      waveLabel: 'Phase 2 · Core Hardening (Weeks 3–5)',
      title: 'Zero-Trust Perimeter (VPC-SC), CMEK Encryption & Endpoint Protection',
      subtitle: 'Encloses Vertex AI and data inside an anti-exfiltration VPC-SC perimeter, encrypts artifacts with Cloud KMS (CMEK), and shields endpoints with Cloud Armor & IAP.',
      primaryProduct: 'VPC Service Controls (VPC-SC) + Cloud KMS / EKM',
      supportingProducts: ['Cloud Armor WAF', 'Identity-Aware Proxy (IAP)', 'Assured Workloads', 'Binary Authorization'],
      apisToEnable: ['accesscontextmanager.googleapis.com', 'cloudkms.googleapis.com', 'iap.googleapis.com', 'binaryauthorization.googleapis.com'],
      psoOfferingName: 'Technical Workstream: Secure AI Landing Zone (VPC-SC, CMEK & Cloud Armor)',
      psoDeliverable: 'Enforced VPC-SC perimeter around Vertex AI/Storage/BigQuery, CMEK key hierarchy, and Cloud Armor rate-limiting WAF.',
      specialistRoles: ['GCP Network & Perimeter Security Architect', 'DevSecOps Platform Engineer'],
      infraDirective: 'Wrap Vertex AI, Cloud Storage, and BigQuery inside a VPC Service Controls (VPC-SC) perimeter, enforce Customer-Managed Encryption Keys (CMEK) via Cloud KMS, run non-root containers with Binary Authorization, and front all public endpoints with Cloud Armor rate limiting and IAP.',
      infraChecklist: [
        'Place aiplatform.googleapis.com, storage.googleapis.com, and bigquery.googleapis.com inside an enforced VPC-SC service perimeter.',
        'Configure Cloud KMS CMEK keys with 90-day automated rotation for Vertex AI endpoints, buckets, and databases.',
        'Attach a Cloud Armor security policy with per-IP/user rate-based throttling to prevent Denial-of-Wallet token exhaustion.',
        'Enforce non-root container execution and Binary Authorization cryptographic image signing in Cloud Run / GKE.'
      ],
      gcloudAndTerraformSnippet: `# 1. Provision a Cloud KMS KeyRing and CMEK key with 90-day rotation
gcloud kms keyrings create aegis-ai-keyring --location=us-central1 --project=$PROJECT_ID
gcloud kms keys create vertex-cmek-key \\
  --location=us-central1 \\
  --keyring=aegis-ai-keyring \\
  --purpose=encryption \\
  --rotation-period=7776000s \\
  --next-rotation-time=$(date -u -d "+90 days" +%Y-%m-%dT%H:%M:%SZ) \\
  --project=$PROJECT_ID

# 2. Create a Cloud Armor WAF policy with rate-limiting to stop token exhaustion
gcloud compute security-policies create aegis-ai-waf-policy --project=$PROJECT_ID
gcloud compute security-policies rules create 100 \\
  --security-policy=aegis-ai-waf-policy \\
  --expression="true" \\
  --action=rate-based-ban \\
  --rate-limit-threshold-count=60 \\
  --rate-limit-threshold-interval-sec=60 \\
  --ban-duration-sec=300 \\
  --project=$PROJECT_ID`,
      verificationCommand: `gcloud compute security-policies describe aegis-ai-waf-policy --project=$PROJECT_ID`,
      customerAskSummary: 'Ask Google Cloud for VPC Service Controls Dry-Run-to-Enforced migration support, Cloud KMS CMEK configuration guidance, and Cloud Armor rate-limiting templates.',
      customerChecklist: [
        'Request Google Cloud’s reference Terraform modules for wrapping Vertex AI, BigQuery, and Cloud Storage in a VPC-SC perimeter.',
        'Ask for the CMEK (Cloud KMS / EKM) service coverage checklist for your Vertex AI models, vector indexes, and storage buckets.',
        'Request assistance configuring Cloud Armor rate-limiting rules and Identity-Aware Proxy (IAP) in front of your inference endpoints.'
      ],
      scopeObjective: 'Isolate AI workloads at the network and cryptographic layers to prevent data/model exfiltration and protect inference endpoints against quota exhaustion.',
      keyArchitectureQuestions: 'Which internal networks, CI/CD pipelines, or partner systems require explicit ingress/egress rules across the VPC Service Controls perimeter?',
      acceptanceCriteria: [
        'VPC Service Controls perimeter is active in Enforced mode, blocking unauthorized cross-project data movement.',
        'All model artifacts, storage buckets, and datasets are encrypted with customer-managed keys (CMEK) in Cloud KMS.',
        'Public endpoints are shielded by Cloud Armor rate limits and IAP, and Binary Authorization blocks unsigned container images.'
      ]
    }
  },
  {
    id: 'scc-observability-governance',
    order: 5,
    wave: 3,
    tShirtSize: 'M',
    estimatedWeeksEs: '2–3 semanas',
    estimatedWeeksEn: '2–3 weeks',
    matchKeywords: /log|audit|monitor|scc|drift|siem|incident|kill-switch|governance|policy|iso|aims|bias|fairness|impact|explainab|c12|c13|clause|a\.2|a\.3|a\.5|a\.6|a\.8|a\.10/i,
    matchChapterPrefixes: ['C12', 'C13', 'Clause', 'A.2', 'A.3', 'A.5', 'A.6', 'A.8', 'A.10'],
    es: {
      waveLabel: 'Fase 3 · Gobernanza Continua y Operación (Semanas 6–8)',
      title: 'Observabilidad Inmutable, SCC AI Protection y Gobernanza ISO 42001 (AIMS)',
      subtitle: 'Monitoreo continuo de postura y amenazas de IA, bitácoras inmutables WORM, detección de sesgo/deriva y controles organizacionales ISO/IEC 42001.',
      primaryProduct: 'Security Command Center (SCC) AI Protection + Vertex AI Model Monitoring',
      supportingProducts: ['Cloud Audit Logs (Locked Buckets)', 'Cloud Monitoring (Kill-Switch)', 'Vertex AI Model Evaluation'],
      apisToEnable: ['securitycenter.googleapis.com', 'logging.googleapis.com', 'monitoring.googleapis.com'],
      psoOfferingName: 'Acompañamiento Técnico: Operacionalización de Monitoreo IA y Gobernanza ISO 42001',
      psoDeliverable: 'Postura de IA activa en Security Command Center, bitácoras de auditoría bloqueadas (WORM), kill-switch automatizado y plantillas operativas ISO 42001.',
      specialistRoles: ['Especialista en Gobernanza y Riesgo de IA', 'Ingeniero SecOps / Observabilidad'],
      infraDirective: 'Activar Security Command Center (SCC) AI Protection, enrutar todas las bitácoras de auditoría hacia un bucket de Cloud Logging con retención bloqueada (inmutable), configurar alertas de deriva/alucinación en Vertex AI Model Monitoring y habilitar un circuit-breaker (kill-switch) automático.',
      infraChecklist: [
        'Activar Data Access Audit Logs para aiplatform.googleapis.com y almacenarlos en un Log Bucket con retención bloqueada (--locked).',
        'Habilitar Security Command Center (SCC) con detección de postura y amenazas para cargas de trabajo de Vertex AI.',
        'Configurar evaluaciones periódicas de equidad/sesgo y monitoreo de deriva en Vertex AI Model Evaluation & Monitoring.',
        'Documentar la Política de IA (ISO 42001 A.2), Matriz de Responsabilidad (A.3), Evaluación de Impacto (A.5) y canal de apelación humana.'
      ],
      gcloudAndTerraformSnippet: `# 1. Crear un Log Bucket inmutable (WORM) de 365 días para auditoría regulatoria de IA
gcloud logging buckets create aegis-immutable-ai-audit-logs \\
  --location=global \\
  --retention-days=365 \\
  --project=$PROJECT_ID

# 2. Bloquear permanentemente la política de retención contra borrado o modificación
gcloud logging buckets update aegis-immutable-ai-audit-logs \\
  --location=global \\
  --locked \\
  --project=$PROJECT_ID`,
      verificationCommand: `gcloud logging buckets describe aegis-immutable-ai-audit-logs --location=global --project=$PROJECT_ID`,
      customerAskSummary: 'Solicitar a Google Cloud la habilitación de Security Command Center (SCC) AI Protection, la guía de bitácoras inmutables (WORM) y las plantillas de gobernanza para ISO/IEC 42001.',
      customerChecklist: [
        'Pedir a Google Cloud activar los detectores de Security Command Center (SCC) AI Protection sobre tu organización o proyecto.',
        'Solicitar la configuración recomendada de Cloud Audit Logs con retención bloqueada (--locked) para cumplir requisitos de auditoría externa.',
        'Pedir las guías y plantillas del Google Cloud Secure AI Framework (SAIF) para documentar Evaluaciones de Impacto y Model Cards.'
      ],
      scopeObjective: 'Establecer visibilidad continua sobre la seguridad y calidad del modelo en producción, junto con la evidencia documental requerida por auditores internos y reguladores (ISO 42001).',
      keyArchitectureQuestions: '¿Cuál es el procedimiento operativo actual para detectar una degradación o ataque en el modelo en producción y desactivar (kill-switch) sus acciones autónomas en menos de 5 minutos?',
      acceptanceCriteria: [
        'Las bitácoras de acceso y decisiones de IA se almacenan en un bucket de Cloud Logging bloqueado (WORM) por al menos 365 días.',
        'Security Command Center monitorea continuamente desconfiguraciones y amenazas sobre los recursos de Vertex AI.',
        'Existen alertas automatizadas de deriva/error y un procedimiento probado de Kill-Switch y revisión humana (ISO 42001).'
      ]
    },
    en: {
      waveLabel: 'Phase 3 · Continuous Governance & Operations (Weeks 6–8)',
      title: 'Immutable Audit Trail, SCC AI Protection & ISO 42001 Governance (AIMS)',
      subtitle: 'Continuous AI posture & threat detection, WORM-locked audit logs, model drift/fairness monitoring, automated kill-switch, and ISO 42001 AIMS controls.',
      primaryProduct: 'Security Command Center (SCC) AI Protection + Vertex AI Model Monitoring',
      supportingProducts: ['Cloud Audit Logs (Locked WORM Buckets)', 'Cloud Monitoring (Kill-Switch)', 'Vertex AI Model Evaluation'],
      apisToEnable: ['securitycenter.googleapis.com', 'logging.googleapis.com', 'monitoring.googleapis.com'],
      psoOfferingName: 'Technical Workstream: AI Observability, SCC AI Protection & ISO 42001 Readiness',
      psoDeliverable: 'SCC AI Protection posture dashboard, immutable WORM audit log sink, automated anomaly kill-switch, and ISO 42001 AIMS documentation kit.',
      specialistRoles: ['AI Governance & Risk Specialist (ISO 42001)', 'SecOps / Observability Engineer'],
      infraDirective: 'Enable Security Command Center (SCC) AI Protection, route redacted Vertex AI & application audit logs to a retention-locked Cloud Logging bucket, configure Vertex AI Model Monitoring & Evaluation for drift/bias, and wire an automated Cloud Monitoring circuit-breaker (kill-switch).',
      infraChecklist: [
        'Enable Data Access Audit Logs for aiplatform.googleapis.com and sink them to a retention-locked (--locked) Cloud Logging bucket.',
        'Activate Security Command Center (SCC) AI Protection to continuously monitor AI asset inventory, misconfigurations, and runtime threats.',
        'Configure Vertex AI Model Evaluation & Monitoring jobs to track output drift, hallucination rates, and demographic fairness.',
        'Establish the formal ISO/IEC 42001 AI Policy (A.2), Risk Owner accountability matrix (A.3), AI Impact Assessment (A.5), and human appeals workflow.'
      ],
      gcloudAndTerraformSnippet: `# 1. Create a 365-day retention-locked (WORM) Cloud Logging bucket for AI compliance
gcloud logging buckets create aegis-immutable-ai-audit-logs \\
  --location=global \\
  --retention-days=365 \\
  --project=$PROJECT_ID

# 2. Permanently lock the bucket so even project admins cannot delete audit trails
gcloud logging buckets update aegis-immutable-ai-audit-logs \\
  --location=global \\
  --locked \\
  --project=$PROJECT_ID`,
      verificationCommand: `gcloud logging buckets describe aegis-immutable-ai-audit-logs --location=global --project=$PROJECT_ID`,
      customerAskSummary: 'Request Security Command Center (SCC) AI Protection enablement, locked WORM audit log templates, and Google Cloud Secure AI Framework (SAIF) governance artifacts.',
      customerChecklist: [
        'Ask your Google Cloud team to enable Security Command Center (SCC) AI Protection detectors for your project or organization.',
        'Request the reference configuration for retention-locked (--locked) Cloud Audit Logs to satisfy regulatory audit-trail mandates.',
        'Ask for Google Cloud’s Secure AI Framework (SAIF) and ISO/IEC 42001 templates for AI Impact Assessments, Model Cards, and incident response.'
      ],
      scopeObjective: 'Establish continuous runtime monitoring, tamper-proof auditability, an emergency kill-switch, and the formal governance artifacts required for ISO/IEC 42001 sign-off.',
      keyArchitectureQuestions: 'What is your current operational runbook to detect anomalous model behavior in production and trigger an emergency circuit-breaker (kill-switch) within 5 minutes?',
      acceptanceCriteria: [
        'All Vertex AI and agent audit logs are routed to a retention-locked (WORM) Cloud Logging bucket with >=365-day retention.',
        'Security Command Center AI Protection is actively monitoring AI inventory and runtime threat detectors.',
        'Automated drift alerts, a tested kill-switch procedure, and ISO 42001 governance records (Policy, Risk Matrix, Impact Assessment) are in place.'
      ]
    }
  }
];

function classifyControlToPillarId(chapterId: string, punto: PuntoProbado): string {
  const chUpper = (chapterId || '').toUpperCase().trim();
  const combinedText = `${chUpper} ${punto.id || ''} ${punto.name || ''} ${punto.comoFallo || ''} ${punto.remediation || ''}`;

  if (chUpper.startsWith('C02') || chUpper.startsWith('C03') || chUpper.startsWith('C06')) {
    return 'model-armor-guardrails';
  }
  if (chUpper.startsWith('C01') || chUpper.startsWith('C04') || chUpper.startsWith('C05') || chUpper.startsWith('A.7')) {
    return 'sensitive-data-protection-dlp';
  }
  if (chUpper.startsWith('C07') || chUpper.startsWith('C08') || chUpper.startsWith('C09') || chUpper.startsWith('A.9')) {
    return 'agentic-least-privilege-hitl';
  }
  if (chUpper.startsWith('C10') || chUpper.startsWith('C11') || chUpper.startsWith('A.4')) {
    return 'zero-trust-perimeter-vpcsc-kms';
  }
  if (
    chUpper.startsWith('C12') ||
    chUpper.startsWith('C13') ||
    chUpper.startsWith('CLAUSE') ||
    chUpper.startsWith('A.2') ||
    chUpper.startsWith('A.3') ||
    chUpper.startsWith('A.5') ||
    chUpper.startsWith('A.6') ||
    chUpper.startsWith('A.8') ||
    chUpper.startsWith('A.10')
  ) {
    return 'scc-observability-governance';
  }

  for (const tpl of PILLAR_TEMPLATES) {
    if (tpl.matchKeywords.test(combinedText)) {
      return tpl.id;
    }
  }

  return 'scc-observability-governance';
}

export function generatePrescriptiveBlueprint(audit: AuditReport, lang: string = 'es'): PrescriptiveBlueprint {
  const isEs = lang === 'es';
  const groupedControls = new Map<string, MatchedAuditControl[]>();
  for (const tpl of PILLAR_TEMPLATES) {
    groupedControls.set(tpl.id, []);
  }

  let totalFailedControls = 0;

  for (const ch of audit.chapters || []) {
    const puntos: PuntoProbado[] = ch.puntosProbados || (ch as any).evaluatedPoints || (ch as any).controls || [];
    for (const p of puntos) {
      if (p.status !== 'Aprobado') {
        totalFailedControls++;
        const pillarId = classifyControlToPillarId(ch.chapterId || '', p);
        const list = groupedControls.get(pillarId) || [];
        list.push({
          id: p.id,
          name: p.name,
          chapterId: ch.chapterId,
          chapterName: ch.chapterName,
          status: p.status,
          riskImpact: p.riskImpact || 'Alto',
          isMandatory: p.isMandatoryForTargetLevel
        });
        groupedControls.set(pillarId, list);
      }
    }
  }

  const remainingGap = Math.max(0, 100 - (audit.overallScore || 0));

  const allPillars: PrescriptivePillar[] = PILLAR_TEMPLATES.map((tpl) => {
    const copy = isEs ? tpl.es : tpl.en;
    const matched = groupedControls.get(tpl.id) || [];
    const criticalCount = matched.filter((m) => {
      const r = (m.riskImpact || '').toLowerCase();
      return r.includes('alto') || r.includes('crít') || r.includes('crit') || r.includes('high');
    }).length;

    const rawShare = totalFailedControls > 0 ? matched.length / totalFailedControls : 1 / PILLAR_TEMPLATES.length;
    const scoreLiftPercent = Math.round(remainingGap * rawShare * 10) / 10;

    return {
      id: tpl.id,
      order: tpl.order,
      wave: tpl.wave,
      waveLabel: copy.waveLabel,
      tShirtSize: tpl.tShirtSize,
      estimatedWeeks: isEs ? tpl.estimatedWeeksEs : tpl.estimatedWeeksEn,
      title: copy.title,
      subtitle: copy.subtitle,
      primaryProduct: copy.primaryProduct,
      supportingProducts: copy.supportingProducts,
      apisToEnable: copy.apisToEnable,
      psoOfferingName: copy.psoOfferingName,
      psoDeliverable: copy.psoDeliverable,
      specialistRoles: copy.specialistRoles,
      infraDirective: copy.infraDirective,
      infraChecklist: copy.infraChecklist,
      gcloudAndTerraformSnippet: copy.gcloudAndTerraformSnippet,
      verificationCommand: copy.verificationCommand,
      customerAskSummary: copy.customerAskSummary,
      customerChecklist: copy.customerChecklist,
      scopeObjective: copy.scopeObjective,
      keyArchitectureQuestions: copy.keyArchitectureQuestions,
      acceptanceCriteria: copy.acceptanceCriteria,
      matchedControls: matched,
      criticalCount,
      scoreLiftPercent
    };
  });

  const activePillars =
    totalFailedControls > 0
      ? allPillars.filter((p) => p.matchedControls.length > 0).sort((a, b) => a.wave - b.wave || b.matchedControls.length - a.matchedControls.length)
      : allPillars;

  const projectedScore = totalFailedControls > 0 ? Math.min(99.2, Math.max(96.5, Math.round((audit.overallScore + remainingGap * 0.96) * 10) / 10)) : 100;
  const quickWinCount = activePillars.filter((p) => p.wave === 1).length;
  const overallTShirtSize: 'S' | 'M' | 'L' =
    totalFailedControls <= 6 ? 'S' : totalFailedControls <= 22 ? 'M' : 'L';
  const totalEstimatedWeeks =
    overallTShirtSize === 'S'
      ? (isEs ? '2–3 semanas' : '2–3 weeks')
      : overallTShirtSize === 'M'
      ? (isEs ? '4–6 semanas' : '4–6 weeks')
      : (isEs ? '6–8 semanas' : '6–8 weeks');

  const productBulletList = activePillars
    .map((p, i) => `${i + 1}. ${p.primaryProduct} (${p.supportingProducts.slice(0, 2).join(', ')}) -> ${isEs ? `Resuelve ${p.matchedControls.length} hallazgos` : `Resolves ${p.matchedControls.length} findings`}`)
    .join('\n');

  const psoBulletList = activePillars
    .map((p) => `- ${p.psoOfferingName} (${p.estimatedWeeks}) — ${p.psoDeliverable}`)
    .join('\n');

  const readyEmailToGoogleTeam = isEs
    ? `Asunto: Solicitud de Servicios Google Cloud y Acompañamiento Técnico para "${audit.systemName}"

Hola equipo de Google Cloud,

Acabamos de ejecutar una evaluación normativa de seguridad y gobernanza de IA sobre nuestro sistema "${audit.systemName}" (Cumplimiento actual: ${audit.overallScore.toFixed(1)}%, ${totalFailedControls} controles por remediar).

Consolidamos nuestra remediación en ${activePillars.length} frentes técnicos sobre Google Cloud para alcanzar ~${projectedScore.toFixed(1)}% de cumplimiento:

1. PRODUCTOS Y SERVICIOS DE GOOGLE CLOUD QUE REQUERIMOS HABILITAR / DIMENSIONAR:
${productBulletList}

2. FRENTES DE IMPLEMENTACIÓN Y ACOMPAÑAMIENTO TÉCNICO A REVISAR:
${psoBulletList}

¿Podemos agendar una sesión técnica esta semana con nuestro equipo de Infraestructura y Seguridad para revisar estos requerimientos y arrancar la Fase 1?

Saludos,
${audit.technicalLead || 'Equipo de Arquitectura e Ingeniería'}
${audit.email || ''}`
    : `Subject: Request for Google Cloud Services & Technical Enablement — "${audit.systemName}"

Hi Google Cloud Team,

We completed an AI Security & Governance evaluation for "${audit.systemName}" (Current Compliance: ${audit.overallScore.toFixed(1)}%, ${totalFailedControls} controls requiring remediation).

We consolidated all ${totalFailedControls} compliance gaps into ${activePillars.length} Google Cloud implementation workstreams to reach ~${projectedScore.toFixed(1)}% compliance:

1. GOOGLE CLOUD PRODUCTS & APIS WE NEED TO ENABLE / SIZE:
${productBulletList}

2. IMPLEMENTATION WORKSTREAMS & TECHNICAL GUIDANCE REQUESTED:
${psoBulletList}

Could we schedule a technical working session this week with our Infrastructure and Security leads to review these requirements and kick off Phase 1?

Best regards,
${audit.technicalLead || 'AI Architecture & Engineering Lead'}
${audit.email || ''}`;

  const readySlackToInfraTeam = isEs
    ? `🛠️ *Plan Prescriptivo de Infraestructura GCP — ${audit.systemName}*\n` +
      `• *Estado actual:* ${audit.overallScore.toFixed(1)}% (${totalFailedControls} controles abiertos) → *Meta tras remediación:* ~${projectedScore.toFixed(1)}%\n` +
      `• *Resumen ejecutivo:* En vez de revisar todo el reporte de auditoría, solo necesitamos implementar estos *${activePillars.length} paquetes en Google Cloud*:\n\n` +
      activePillars
        .map(
          (p, i) =>
            `*${i + 1}. [${p.waveLabel}] ${p.primaryProduct}* — _Cierra ${p.matchedControls.length} controles (${p.matchedControls.slice(0, 4).map((c) => c.id).join(', ')}${p.matchedControls.length > 4 ? '...' : ''})_\n` +
            `   • Acción: ${p.infraDirective}\n` +
            `   • APIs a habilitar: \`${p.apisToEnable.join(' ')}\``
        )
        .join('\n\n')
    : `🛠️ *Google Cloud Infra & SecOps Prescriptive Runbook — ${audit.systemName}*\n` +
      `• *Current Score:* ${audit.overallScore.toFixed(1)}% (${totalFailedControls} open controls) → *Projected Score:* ~${projectedScore.toFixed(1)}%\n` +
      `• *TL;DR for Engineering:* No need to read the full audit report. Deploying these *${activePillars.length} Google Cloud workstreams* resolves all ${totalFailedControls} findings:\n\n` +
      activePillars
        .map(
          (p, i) =>
            `*${i + 1}. [${p.waveLabel}] ${p.primaryProduct}* — _Closes ${p.matchedControls.length} controls (${p.matchedControls.slice(0, 4).map((c) => c.id).join(', ')}${p.matchedControls.length > 4 ? '...' : ''})_\n` +
            `   • Action: ${p.infraDirective}\n` +
            `   • APIs to enable: \`${p.apisToEnable.join(' ')}\``
        )
        .join('\n\n');

  const executivePrescriptionSummary = isEs
    ? `El sistema "${audit.systemName}" registra actualmente un cumplimiento de ${audit.overallScore.toFixed(1)}% con ${totalFailedControls} controles pendientes. En lugar de abordar cada hallazgo por separado, la implementación de estos ${activePillars.length} bloques arquitectónicos de Google Cloud (${activePillars.map((p) => p.primaryProduct).join(', ')}) resuelve las brechas detectadas, eleva el cumplimiento proyectado a ~${projectedScore.toFixed(1)}% y puede ejecutarse en ${totalEstimatedWeeks} (Esfuerzo ${overallTShirtSize}).`
    : `Workload "${audit.systemName}" is currently at ${audit.overallScore.toFixed(1)}% compliance with ${totalFailedControls} open controls. Rather than addressing each finding in isolation, implementing these ${activePillars.length} Google Cloud architectural building blocks (${activePillars.map((p) => p.primaryProduct).join(', ')}) resolves the identified gaps, lifts projected compliance to ~${projectedScore.toFixed(1)}%, and can be executed in ${totalEstimatedWeeks} (Size ${overallTShirtSize}).`;

  return {
    auditId: audit.id,
    systemName: audit.systemName,
    currentScore: audit.overallScore,
    projectedScore,
    totalFailedControls,
    activePillars,
    allPillars,
    quickWinCount,
    totalEstimatedWeeks,
    overallTShirtSize,
    readyEmailToGoogleTeam,
    readySlackToInfraTeam,
    executivePrescriptionSummary
  };
}

export function generatePrescriptiveBlueprintMarkdown(audit: AuditReport, lang: string = 'es'): string {
  const isEs = lang === 'es';
  const bp = generatePrescriptiveBlueprint(audit, lang);

  if (isEs) {
    let md = `# AegisAI · Hoja de Ruta Prescriptiva Google Cloud y Remediación Técnica\n\n`;
    md += `> **Sistema:** ${bp.systemName} (\`${bp.auditId}\`)  \n`;
    md += `> **Fecha:** ${format(new Date(), 'yyyy-MM-dd HH:mm')}  \n`;
    md += `> **Cumplimiento Actual:** **${bp.currentScore.toFixed(1)}%** (${bp.totalFailedControls} hallazgos abiertos) → **Cumplimiento Proyectado:** **~${bp.projectedScore.toFixed(1)}%**  \n`;
    md += `> **Esfuerzo Estimado de Implementación:** Talla **${bp.overallTShirtSize}** (${bp.totalEstimatedWeeks})\n\n`;
    md += `---\n\n`;
    md += `## 1. Resumen Ejecutivo (Prescripción Consolidada)\n\n`;
    md += `${bp.executivePrescriptionSummary}\n\n`;
    md += `| Fase | Producto Principal Google Cloud | Servicios Complementarios | Hallazgos que Resuelve | Impacto en Score | Tiempo Estimado |\n`;
    md += `| :--- | :--- | :--- | :---: | :---: | :---: |\n`;
    for (const p of bp.activePillars) {
      md += `| **${p.waveLabel}** | **${p.primaryProduct}** | ${p.supportingProducts.join(', ')} | **${p.matchedControls.length}** controles | **+${p.scoreLiftPercent.toFixed(1)}%** | ${p.tShirtSize} (${p.estimatedWeeks}) |\n`;
    }
    md += `\n---\n\n`;
    md += `## 2. Guía Prescriptiva por Pilar (Infraestructura, Qué Pedir a Google Cloud y Alcance de Entrega)\n\n`;
    for (const p of bp.activePillars) {
      md += `### ${p.order}. ${p.title}\n`;
      md += `- **Servicio Principal Google Cloud:** \`${p.primaryProduct}\`\n`;
      md += `- **APIs a Habilitar:** \`${p.apisToEnable.join('`, `')}\`\n`;
      md += `- **Frente de Trabajo / Acompañamiento:** ${p.psoOfferingName} (${p.estimatedWeeks})\n`;
      md += `- **Controles Normativos que Cierra (${p.matchedControls.length}):** ${p.matchedControls.map((c) => `\`${c.id}\``).join(', ') || 'Validación preventiva'}\n\n`;
      md += `#### A. Directiva para el Equipo de Tecnología e Infraestructura\n`;
      md += `${p.infraDirective}\n\n`;
      for (const step of p.infraChecklist) {
        md += `- [ ] ${step}\n`;
      }
      md += `\n\`\`\`bash\n${p.gcloudAndTerraformSnippet}\n\`\`\`\n\n`;
      md += `#### B. Qué Solicitar a Google Cloud (Productos, Cuotas y Arquitectura)\n`;
      for (const item of p.customerChecklist) {
        md += `- ${item}\n`;
      }
      md += `\n#### C. Alcance de Implementación y Criterios de Aceptación\n`;
      md += `- **Objetivo del Frente:** ${p.scopeObjective}\n`;
      md += `- **Entregable Esperado:** ${p.psoDeliverable}\n`;
      md += `- **Criterios de Aceptación:**\n`;
      for (const ac of p.acceptanceCriteria) {
        md += `  - [ ] ${ac}\n`;
      }
      md += `\n---\n\n`;
    }
    md += `## 3. Nota Lista para Enviar a tu Equipo de Google Cloud\n\n\`\`\`text\n${bp.readyEmailToGoogleTeam}\n\`\`\`\n`;
    return md;
  }

  let md = `# AegisAI · Google Cloud Prescriptive Blueprint & Tech Remediation Plan\n\n`;
  md += `> **System:** ${bp.systemName} (\`${bp.auditId}\`)  \n`;
  md += `> **Date:** ${format(new Date(), 'yyyy-MM-dd HH:mm')}  \n`;
  md += `> **Current Compliance:** **${bp.currentScore.toFixed(1)}%** (${bp.totalFailedControls} open findings) → **Projected Score:** **~${bp.projectedScore.toFixed(1)}%**  \n`;
  md += `> **Estimated Implementation Effort:** Size **${bp.overallTShirtSize}** (${bp.totalEstimatedWeeks})\n\n`;
  md += `---\n\n`;
  md += `## 1. Executive Summary (Consolidated Prescription)\n\n`;
  md += `${bp.executivePrescriptionSummary}\n\n`;
  md += `| Wave | Primary Google Cloud Product | Supporting Services | Findings Resolved | Score Lift | Estimated Effort |\n`;
  md += `| :--- | :--- | :--- | :---: | :---: | :---: |\n`;
  for (const p of bp.activePillars) {
    md += `| **${p.waveLabel}** | **${p.primaryProduct}** | ${p.supportingProducts.join(', ')} | **${p.matchedControls.length}** controls | **+${p.scoreLiftPercent.toFixed(1)}%** | ${p.tShirtSize} (${p.estimatedWeeks}) |\n`;
  }
  md += `\n---\n\n`;
  md += `## 2. Prescriptive Workstreams (Infra Runbook, What to Request from Google Cloud & Delivery Scope)\n\n`;
  for (const p of bp.activePillars) {
    md += `### ${p.order}. ${p.title}\n`;
    md += `- **Primary Google Cloud Service:** \`${p.primaryProduct}\`\n`;
    md += `- **APIs to Enable:** \`${p.apisToEnable.join('`, `')}\`\n`;
    md += `- **Implementation Workstream:** ${p.psoOfferingName} (${p.estimatedWeeks})\n`;
    md += `- **Audit Controls Resolved (${p.matchedControls.length}):** ${p.matchedControls.map((c) => `\`${c.id}\``).join(', ') || 'Preventive Hardening'}\n\n`;
    md += `#### A. Directive for Tech & Infrastructure Teams\n`;
    md += `${p.infraDirective}\n\n`;
    for (const step of p.infraChecklist) {
      md += `- [ ] ${step}\n`;
    }
    md += `\n\`\`\`bash\n${p.gcloudAndTerraformSnippet}\n\`\`\`\n\n`;
    md += `#### B. What to Request from Google Cloud (Products, Quotas & Blueprints)\n`;
    for (const item of p.customerChecklist) {
      md += `- ${item}\n`;
    }
    md += `\n#### C. Implementation Scope & Acceptance Criteria\n`;
    md += `- **Workstream Objective:** ${p.scopeObjective}\n`;
    md += `- **Expected Deliverable:** ${p.psoDeliverable}\n`;
    md += `- **Acceptance Criteria (Definition of Done):**\n`;
    for (const ac of p.acceptanceCriteria) {
      md += `  - [ ] ${ac}\n`;
    }
    md += `\n---\n\n`;
  }
  md += `## 3. Ready-to-Send Note to Your Google Cloud Team\n\n\`\`\`text\n${bp.readyEmailToGoogleTeam}\n\`\`\`\n`;
  return md;
}

export async function generatePrescriptiveBlueprintPDF(audit: AuditReport, lang: string = 'es'): Promise<void> {
  const isEs = lang === 'es';
  const bp = generatePrescriptiveBlueprint(audit, lang);
  const { default: jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = (autoTableModule as any).default || autoTableModule;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const ensureSpace = (currentY: number, neededHeight: number): number => {
    if (currentY + neededHeight > pageHeight - 18) {
      doc.addPage();
      return 18;
    }
    return currentY;
  };

  // 1. Top Dark Navy Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setTextColor(251, 224, 23); // Accent Yellow
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(
    isEs
      ? 'AEGIS AI · PASO 2 POST-AUDITORIA · GUIA PRESCRIPTIVA GOOGLE CLOUD'
      : 'AEGIS AI · POST-AUDIT STEP 2 · GOOGLE CLOUD PRESCRIPTIVE BLUEPRINT',
    margin,
    11
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text(
    isEs
      ? 'Plano Prescriptivo Google Cloud y Proceso de Remediacion Tecnica'
      : 'Google Cloud Prescriptive Blueprint & Technical Remediation Process',
    margin,
    20
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text(
    isEs
      ? `Sistema: ${bp.systemName}  |  ID: ${bp.auditId}  |  Fecha: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`
      : `System: ${bp.systemName}  |  ID: ${bp.auditId}  |  Date: ${format(new Date(), 'yyyy-MM-dd HH:mm')}`,
    margin,
    28
  );

  let y = 40;

  // 2. Executive KPI Summary Table
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      isEs
        ? ['Consolidacion de Hallazgos', 'Salto de Cumplimiento', 'Quick Wins (Fase 1)', 'Esfuerzo Estimado']
        : ['Finding Consolidation', 'Compliance Score Lift', 'Quick Wins (Phase 1)', 'Estimated Effort']
    ],
    body: [
      [
        isEs
          ? `${bp.totalFailedControls} controles -> ${bp.activePillars.length} Frentes GCP`
          : `${bp.totalFailedControls} controls -> ${bp.activePillars.length} GCP Pillars`,
        `${bp.currentScore.toFixed(1)}% -> ~${bp.projectedScore.toFixed(1)}%`,
        isEs
          ? `${bp.quickWinCount} servicios (Semanas 1-2)`
          : `${bp.quickWinCount} services (Weeks 1-2)`,
        isEs
          ? `Talla ${bp.overallTShirtSize} (${bp.totalEstimatedWeeks})`
          : `Size ${bp.overallTShirtSize} (${bp.totalEstimatedWeeks})`
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [27, 95, 166], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9.5, fontStyle: 'bold', textColor: [26, 26, 26] }
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 20) + 7;

  // 3. Section 1: Explanation of the End-to-End Remediation Process
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 95, 166);
  doc.text(
    isEs
      ? '1. Como Funciona el Proceso de Remediacion Prescriptiva en 4 Etapas'
      : '1. How the 4-Stage Prescriptive Remediation Process Works',
    margin,
    y
  );
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(40, 40, 40);
  const summaryLines = doc.splitTextToSize(bp.executivePrescriptionSummary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.2 + 3;

  const processRows = isEs
    ? [
        [
          'Etapa 1: Consolidacion Arquitectonica',
          `En lugar de parchear ${bp.totalFailedControls} controles aislados uno por uno, AegisAI agrupa todas las no conformidades en ${bp.activePillars.length} bloques tecnologicos nativos de Google Cloud.`
        ],
        [
          'Etapa 2: Fase 1 - Quick Wins (Semanas 1-2)',
          'Activacion inmediata de guardrails de runtime (Google Cloud Model Armor) y desidentificacion de datos sensibles (Cloud DLP) sin necesidad de reescribir la aplicacion.'
        ],
        [
          'Etapa 3: Fase 2 - Endurecimiento Core (Semanas 3-5)',
          'Aislamiento de permisos de agentes con IAM de minimo privilegio, compuertas Human-in-the-Loop (Cloud Workflows) y perimetro anti-exfiltracion VPC Service Controls + Cloud KMS (CMEK).'
        ],
        [
          'Etapa 4: Fase 3 - Gobernanza y Re-Auditoria (Semanas 6-8)',
          'Monitoreo continuo con Security Command Center (SCC) AI Protection, bitacoras inmutables WORM en Cloud Logging y re-evaluacion en AegisAI para certificar ~' +
            bp.projectedScore.toFixed(1) +
            '% de cumplimiento.'
        ]
      ]
    : [
        [
          'Stage 1: Architectural Consolidation',
          `Instead of patching ${bp.totalFailedControls} isolated findings one by one, AegisAI deduplicates all gaps into ${bp.activePillars.length} native Google Cloud architectural building blocks.`
        ],
        [
          'Stage 2: Phase 1 - Quick Wins (Weeks 1-2)',
          'Immediate activation of runtime prompt/output guardrails (Google Cloud Model Armor) and PII de-identification (Sensitive Data Protection / Cloud DLP) without rewriting core app logic.'
        ],
        [
          'Stage 3: Phase 2 - Core Hardening (Weeks 3-5)',
          'Agent least-privilege IAM, Human-in-the-Loop approval gates (Cloud Workflows), and zero-trust VPC Service Controls (VPC-SC) perimeter with Cloud KMS (CMEK) encryption.'
        ],
        [
          'Stage 4: Phase 3 - Continuous Governance & Re-Audit (Weeks 6-8)',
          'Continuous posture monitoring via Security Command Center (SCC) AI Protection, locked WORM audit logs, and final AegisAI re-audit to verify ~' +
            bp.projectedScore.toFixed(1) +
            '% compliance.'
        ]
      ];

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [isEs ? ['Etapa del Proceso', 'Descripcion Operativa y Resultado'] : ['Process Stage', 'Operational Description & Outcome']],
    body: processRows,
    theme: 'striped',
    headStyles: { fillColor: [26, 26, 26], textColor: 255, fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 30, 30] },
    columnStyles: {
      0: { cellWidth: 52, fontStyle: 'bold' },
      1: { cellWidth: contentWidth - 52 }
    }
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 35) + 7;

  // 4. Section 2: Consolidated Google Cloud Solution Matrix
  y = ensureSpace(y, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 95, 166);
  doc.text(
    isEs
      ? '2. Matriz Consolidada de Soluciones Google Cloud y Esfuerzo'
      : '2. Consolidated Google Cloud Solution & Effort Matrix',
    margin,
    y
  );
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      isEs
        ? ['Fase', 'Servicio Principal Google Cloud', 'Servicios Complementarios y APIs', 'Controles que Cierra', 'Impacto', 'Esfuerzo']
        : ['Wave', 'Primary Google Cloud Service', 'Supporting Services & APIs', 'Controls Resolved', 'Score Lift', 'Effort']
    ],
    body: bp.activePillars.map((p) => [
      p.waveLabel,
      p.primaryProduct,
      `${p.supportingProducts.join(', ')}\nAPIs: ${p.apisToEnable.join(', ')}`,
      `${p.matchedControls.length} (${p.matchedControls.slice(0, 5).map((c) => c.id).join(', ')}${p.matchedControls.length > 5 ? '...' : ''})`,
      `+${p.scoreLiftPercent.toFixed(1)}%`,
      `${p.tShirtSize} (${p.estimatedWeeks})`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [27, 95, 166], textColor: 255, fontSize: 7.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.5, textColor: [26, 26, 26] },
    columnStyles: {
      0: { cellWidth: 28, fontStyle: 'bold' },
      1: { cellWidth: 36, fontStyle: 'bold' },
      2: { cellWidth: 56 },
      3: { cellWidth: 28 },
      4: { cellWidth: 16, halign: 'center', fontStyle: 'bold' },
      5: { cellWidth: 18, halign: 'center' }
    }
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 40) + 8;

  // 5. Section 3: Detailed Breakdown of Each Pillar (All 3 Lenses + Matched Controls)
  y = ensureSpace(y, 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 95, 166);
  doc.text(
    isEs
      ? '3. Guia Detallada por Frente (Infraestructura, Que Pedir a GCP y Criterios de Aceptacion)'
      : '3. Detailed Workstream Guide (Infra Runbook, What to Ask GCP & Acceptance Criteria)',
    margin,
    y
  );
  y += 5;

  for (let i = 0; i < bp.activePillars.length; i++) {
    const p = bp.activePillars[i];
    y = ensureSpace(y, 45);

    // Pillar Title Banner
    doc.setFillColor(217, 235, 247);
    doc.setDrawColor(26, 26, 26);
    doc.rect(margin, y, contentWidth, 9, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 26, 26);
    doc.text(
      `#${i + 1} [${p.waveLabel}] ${p.title} — ${p.primaryProduct} (+${p.scoreLiftPercent.toFixed(1)}%)`,
      margin + 3,
      y + 6
    );
    y += 12;

    const resolvedControlsList =
      p.matchedControls.length > 0
        ? p.matchedControls.map((c) => `${c.id} (${c.name})`).join('  |  ')
        : isEs
        ? 'Validacion preventiva (controles aprobados)'
        : 'Preventive hardening (controls passed)';

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      body: [
        [
          isEs ? 'Servicio Principal y APIs' : 'Primary Service & APIs',
          `${p.primaryProduct}  |  ${p.supportingProducts.join(', ')}\nAPIs: ${p.apisToEnable.join(', ')}`
        ],
        [
          isEs ? '1. Directiva para Tech e Infra' : '1. Tech & Infra Directive',
          `${p.infraDirective}\n\nChecklist:\n${p.infraChecklist.map((s) => `• ${s}`).join('\n')}`
        ],
        [
          isEs ? 'Comandos gcloud / Quickstart' : 'gcloud CLI Quickstart',
          `${p.gcloudAndTerraformSnippet}\n\nQA Verify: ${p.verificationCommand}`
        ],
        [
          isEs ? '2. Que Pedir a Google Cloud' : '2. What to Ask Google Cloud For',
          `${p.customerAskSummary}\n\n${p.customerChecklist.map((c) => `• ${c}`).join('\n')}`
        ],
        [
          isEs ? '3. Alcance, Entregable y Criterios de Aceptacion (DoD)' : '3. Scope, Deliverable & Acceptance Criteria (DoD)',
          `${isEs ? 'Frente:' : 'Workstream:'} ${p.psoOfferingName} (${p.tShirtSize} · ${p.estimatedWeeks})\n` +
            `${isEs ? 'Objetivo:' : 'Objective:'} ${p.scopeObjective}\n` +
            `${isEs ? 'Entregable:' : 'Deliverable:'} ${p.psoDeliverable}\n` +
            `${isEs ? 'Perfiles Requeridos:' : 'Roles Needed:'} ${p.specialistRoles.join(', ')}\n\n` +
            `${isEs ? 'Criterios de Aceptacion:' : 'Acceptance Criteria:'}\n${p.acceptanceCriteria.map((a) => `[ ] ${a}`).join('\n')}`
        ],
        [
          isEs ? `Controles que Resuelve (${p.matchedControls.length})` : `Audit Controls Resolved (${p.matchedControls.length})`,
          resolvedControlsList
        ]
      ],
      theme: 'grid',
      bodyStyles: { fontSize: 7.8, textColor: [26, 26, 26], cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 44, fontStyle: 'bold', fillColor: [247, 247, 245] },
        1: { cellWidth: contentWidth - 44 }
      }
    });

    y = ((doc as any).lastAutoTable?.finalY || y + 50) + 7;
  }

  // 6. Section 4: Ready-to-Send Communication Templates
  y = ensureSpace(y, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 95, 166);
  doc.text(
    isEs
      ? '4. Plantillas de Comunicacion Listas para Enviar (Infraestructura y Google Cloud)'
      : '4. Ready-to-Send Communication Templates (Infra Team & Google Cloud)',
    margin,
    y
  );
  y += 3;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        isEs
          ? 'Plantilla A: Resumen Directo para tu Equipo de Tecnologia e Infraestructura'
          : 'Template A: Direct Brief for Your Tech & Infrastructure Team'
      ]
    ],
    body: [[bp.readySlackToInfraTeam.replace(/\*/g, '')]],
    theme: 'grid',
    headStyles: { fillColor: [26, 26, 26], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.8, font: 'courier', textColor: [26, 26, 26] }
  });

  y = ((doc as any).lastAutoTable?.finalY || y + 35) + 5;
  y = ensureSpace(y, 45);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [
      [
        isEs
          ? 'Plantilla B: Correo para Solicitar Productos, Cuotas y Acompanamiento a Google Cloud'
          : 'Template B: Email to Request Products, Quotas & Guidance from Google Cloud'
      ]
    ],
    body: [[bp.readyEmailToGoogleTeam]],
    theme: 'grid',
    headStyles: { fillColor: [27, 95, 166], textColor: 255, fontSize: 8.5, fontStyle: 'bold' },
    bodyStyles: { fontSize: 7.8, font: 'courier', textColor: [26, 26, 26] }
  });

  // Page numbers footer
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let pIdx = 1; pIdx <= totalPages; pIdx++) {
    doc.setPage(pIdx);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text(
      isEs
        ? `AegisAI · Plano Prescriptivo Google Cloud y Proceso de Remediacion · Pagina ${pIdx} de ${totalPages}`
        : `AegisAI · Google Cloud Prescriptive Blueprint & Remediation Process · Page ${pIdx} of ${totalPages}`,
      margin,
      pageHeight - 8
    );
  }

  const safeName = (audit.systemName || 'sistema').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`aegis-gcp-prescriptive-blueprint-${safeName}.pdf`);
}


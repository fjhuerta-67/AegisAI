import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { DivisionHeader } from '../layout/BrandAssets';
import { 
  Server, 
  Database, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  Activity, 
  Key, 
  Cloud, 
  ArrowRight, 
  CheckCircle2, 
  Maximize2,
  ExternalLink,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import gcpArchImg from '../../assets/images/gcp_architecture_gemini_enterprise_1787247263301.jpg';

interface GCPService {
  id: string;
  name: string;
  category: 'Compute' | 'AI & ML' | 'Databases' | 'Security & Identity' | 'DevOps & Observability';
  icon: React.ElementType;
  color: string;
  role: string;
  specs: string[];
  securityControls: string[];
}

export function ArchitectureView() {
  const [selectedService, setSelectedService] = useState<string>('cloud-run');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const gcpServices: GCPService[] = [
    {
      id: 'model-garden-registry',
      name: 'Vertex AI Model Garden & Model Registry',
      category: 'AI & ML',
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      role: 'Fase 3 (Desarrollo y Protecciones): Asegura la cadena de suministro de modelos de IA. Model Garden provee una librería de modelos revisados, firmados y verificados por Google y socios estratégicos, mientras que Model Registry gobierna el versionado y linaje de modelos propios, evitando pesos de internet con posibles puertas traseras.',
      specs: [
        'Model Garden: Catálogo curado de modelos fundacionales firmados y verificados por Google y socios',
        'Model Registry: Repositorio centralizado de modelos privados con control de versiones, linaje y artefactos verificados',
        'Eliminación del riesgo de aprovisionamiento desde repositorios públicos no confiables con backdoors o pesos envenenados',
        'Integración directa con pipelines de validación previos al despliegue en endpoints productivos'
      ],
      securityControls: [
        'OWASP AI-SVS C01.4 & C13.1: Integridad criptográfica y aseguramiento de cadena de suministro de modelos',
        'ISO/IEC 42001 Anexo A.6.1.2 & A.7.3: Proveniencia verificada y gobernanza del inventario de modelos',
        'Verificación de firmas y hashes SHA-256 antes de autorizar cualquier consumo en producción'
      ]
    },
    {
      id: 'model-armor',
      name: 'Google Cloud Model Armor',
      category: 'Security & Identity',
      icon: ShieldCheck,
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      role: 'Fase 3 (Desarrollo y Protecciones): Proxy de seguridad inline posicionado delante de los LLMs. Sanitiza entradas y salidas en tiempo real, detecta y bloquea ataques de inyección de prompts y jailbreaks, y filtra contenido tóxico tanto del usuario como de las respuestas del modelo.',
      specs: [
        'Inspección bidireccional en tiempo real (`sanitizeUserPrompt` y `sanitizeModelResponse`)',
        'Detección avanzada de Prompt Injection directo, indirecto (RAG/PDF) y escalamiento multi-turno (Jailbreaks)',
        'Filtrado simétrico de contenido tóxico, dañino o inseguro en prompts de usuario y respuestas generadas',
        'Integración nativa con Sensitive Data Protection (Cloud DLP) para redacción de PII y secretos'
      ],
      securityControls: [
        'OWASP AI-SVS C02.10 & C07.1: Defensa activa contra inyección de instrucciones y sanitización de salida',
        'ISO/IEC 42001 Anexo A.6.2.6: Salvaguardas operacionales en tiempo de inferencia',
        'Bloqueo determinista previo al consumo de tokens del LLM ante intentos de evasión de guardarraíles'
      ]
    },
    {
      id: 'vertex-evaluation',
      name: 'Vertex AI Evaluation Service (AutoSxS)',
      category: 'AI & ML',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      role: 'Fase 4 (Evaluación y Revisión de Controles): Framework integrado en Vertex AI que utiliza AutoSxS y métricas cuantitativas para evaluar la seguridad del modelo (lenguaje de odio, acoso, contenido sexualmente explícito y contenido peligroso), proveyendo el rastro de auditoría exigido por ISO/IEC 42001.',
      specs: [
        'AutoSxS (Automated Side-by-Side): Modelo evaluador que auto-categoriza y califica las respuestas como un profesor calificando la tarea de un alumno',
        'Métricas nativas de seguridad: Lenguaje de odio, acoso, contenido sexualmente explícito y contenido peligroso',
        'Revisión automatizada más rápida, consistente y económica que una evaluación manual por equipos especializados',
        'Generación automática del rastro de auditoría (Audit Trail) reproducible para certificación ISO/IEC 42001'
      ],
      securityControls: [
        'ISO/IEC 42001 Cláusula 9.1 & Anexo A.6.2.4: Verificación, validación y registro de evidencia de evaluación',
        'OWASP AI-SVS C08.4: Evaluación continua de fidelidad, anclaje (groundedness) y seguridad antes de producción',
        'Compuerta de calidad (Quality Gate) obligatoria antes de promover cualquier versión de modelo'
      ]
    },
    {
      id: 'vertex-model-monitoring',
      name: 'Vertex AI Model Monitoring',
      category: 'DevOps & Observability',
      icon: Activity,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      role: 'Fase 5 (Despliegue Controlado en Producción): Servicio que evalúa continuamente en producción el desempeño del modelo, detectando desviaciones entre entrenamiento y producción (Training-serving skew) y deriva conceptual (Drift) cuando el entorno cambia y el modelo queda obsoleto.',
      specs: [
        'Detección de Training-Serving Skew: Alerta cuando la distribución de datos en producción diverge de los datos de entrenamiento',
        'Detección de Prediction & Feature Drift: Identifica cuando el mundo cambia y el comportamiento del modelo se degrada o vuelve inseguro',
        'Monitoreo continuo de entropía, logprobs y tasas de citación de evidencia normativa',
        'Alertamiento inmediato a los equipos de MLOps y Gobernanza cuando un modelo deja de operar de forma segura'
      ],
      securityControls: [
        'ISO/IEC 42001 Cláusula 9.1 & Anexo A.6.2.6: Monitoreo continuo del desempeño y seguridad post-despliegue',
        'OWASP AI-SVS C08.4 & C09.4: Detección temprana de degradación cognitiva y activación de reversión segura',
        'Umbrales automáticos de alerta por desviación estadística (Jensen-Shannon / L-infinity)'
      ]
    },
    {
      id: 'scc-ai-protection',
      name: 'Security Command Center (Protección AI)',
      category: 'Security & Identity',
      icon: Key,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      role: 'Fase 5 (Despliegue Controlado en Producción): Plataforma centralizada de detección de amenazas y vulnerabilidades en Google Cloud, integrada con Vertex AI y Model Armor para descubrir riesgos de postura y alertar al SOC en tiempo real ante ataques de inyección de prompt.',
      specs: [
        'Detección de amenazas en tiempo real integrada con Vertex AI, Model Armor y Cloud Audit Logs',
        'Visibilidad inmediata para el SOC: cualquier intento de ataque de inyección de prompt se eleva como alerta de seguridad accionable',
        'Escaneo continuo de vulnerabilidades de configuración en endpoints, buckets RAG y cuentas de servicio IAM',
        'Correlación de eventos de seguridad con severidad estandarizada e indicadores forenses'
      ],
      securityControls: [
        'OWASP AI-SVS C12.2: Alertamiento en tiempo real a operaciones de seguridad (SOC / SIEM)',
        'ISO/IEC 42001 Anexo A.6.2.8 & Cláusula 10.1: Gestión de incidentes de IA y respuesta oportuna ante amenazas',
        'Trazabilidad forense inmutable sin exposición de PII en los payloads de alerta'
      ]
    },
    {
      id: 'gemini-enterprise',
      name: 'Google Cloud Vertex AI (Gemini 3.8 Flash / 3.1 Pro)',
      category: 'AI & ML',
      icon: Cpu,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      role: 'Motor cognitivo empresarial en Vertex AI autenticado sin llaves vía IAM / ADC que evalúa arquitecturas y documentos contra OWASP AI-SVS v1.0 e ISO/IEC 42001:2023 y genera mapas visuales de brechas basados en evidencia.',
      specs: [
        'Modelo primario en producción: Gemini 3.8 Flash (vía Vertex AI IAM / ADC sin API Keys)',
        'Soporte multi-modelo: Gemini 3.1 Pro, Gemini 4.0 Argon y conectores para Claude Opus 5.5 / OpenRouter',
        'Generación de mapa visual y basado en evidencia de las brechas entre el estado actual y el deseado (L1/L2/L3)',
        'Salida estructurada garantizada mediante `responseSchema` JSON estricto con telemetría `logprobs`'
      ],
      securityControls: [
        'Autenticación Keyless mediante Application Default Credentials (ADC) y cuenta de servicio de mínimo privilegio',
        'Directiva anti-alucinación: regla de estado estricto ("Falta Evidencia" por defecto) y citas textuales obligatorias',
        'Zero Data Retention (ZDR) empresarial garantizado en el perímetro de Google Cloud Vertex AI'
      ]
    },
    {
      id: 'cloud-run',
      name: 'Google Cloud Run & Cloud IAP',
      category: 'Compute',
      icon: Server,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      role: 'Hospeda el backend Express + React 19 SPA en contenedores serverless protegidos por Identity-Aware Proxy (IAP) y sistema de archivos de solo lectura.',
      specs: [
        'Protección perimetral Zero-Trust con Cloud Identity-Aware Proxy (IAP) restringido a dominios autorizados',
        'Contenedor endurecido con usuario no-root (`aegis`) y `/app` en modo estricto de solo lectura (`chmod a-w`)',
        'Validación de endpoints salientes contra SSRF y bloqueo de servidor de metadatos (`169.254.169.254`)',
        'Cuotas Anti-DoW (Denial of Wallet) por usuario, concurrencia y presupuesto horario de tokens'
      ],
      securityControls: [
        'OWASP AI-SVS C04.1 & C04.3: Inmutabilidad en tiempo de ejecución y prevención de exfiltración SSRF',
        'OWASP AI-SVS C05.3 & C11.1: Verificación de tokens en tiempo constante (`crypto.timingSafeEqual`) y protección DoW',
        'Aislamiento de contenedores gVisor a nivel de kernel'
      ]
    },
    {
      id: 'firestore',
      name: 'Google Cloud Firestore',
      category: 'Databases',
      icon: Database,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      role: 'Base de datos documental NoSQL serverless(`aegis-ai-db`) para persistencia inmutable de auditorías, configuración en caliente y aislamiento multitenant.',
      specs: [
        'Colección `/audits`: Reportes completos, matrices de brechas y documentos de arquitectura remediada',
        'Colección `/system_config`: Configuración dinámica del motor IA persistida desde el servidor',
        'Colecciones `/asyncAudits` y `/apiKeys`: Trabajos CI/CD asíncronos y llaves programáticas',
        'Sagas de compensación transaccional (`C09.4`) para revertir estados parciales ante fallos'
      ],
      securityControls: [
        'OWASP AI-SVS C05.4: Aislamiento por propietario (`ownerUid`) y dominio (`tenantDomain`) en `firestore.rules`',
        'Inmutabilidad de la pista de auditoría (`allow delete: if false` en `/audits`)',
        'Cifrado en reposo (AES-256) y en tránsito automático'
      ]
    },
    {
      id: 'cloud-build',
      name: 'Cloud Build & CI/CD Quality Gates',
      category: 'DevOps & Observability',
      icon: GitBranch,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      role: 'Integración continua automatizada con cuenta de servicio dedicada (`aegis-build-sa`) y compuertas de calidad previas al despliegue.',
      specs: [
        'Compilación aislada mediante `cloudbuild.yaml` con cuenta de servicio de construcción de mínimo privilegio',
        'Endpoint asíncrono no bloqueante: `POST /api/v1/audits` (HTTP 202 Accepted) con Keep-Alive SSE',
        'Verificación criptográfica SHA-256 al arranque de los 6 snapshots normativos (`C01.4`)'
      ],
      securityControls: [
        'Quality Gates automáticos que detienen el pipeline si el cumplimiento es inferior al umbral objetivo',
        'Trazabilidad completa desde el commit hasta la revisión desplegada en Cloud Run'
      ]
    }
  ];

  const currentService = gcpServices.find(s => s.id === selectedService) || gcpServices[0];

  const loadImageAsBase64 = (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.95);
          resolve(dataURL);
        } catch (e) {
          resolve(src);
        }
      };
      img.onerror = () => {
        resolve(src);
      };
      img.src = src;
    });
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const primaryColor: [number, number, number] = [26, 115, 232]; // Google Blue
      const darkColor: [number, number, number] = [32, 33, 36];
      const grayColor: [number, number, number] = [95, 99, 104];
      const currentDate = format(new Date(), 'dd/MM/yyyy HH:mm');

      // Page 1 Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 22, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('DOCUMENTO DE ARQUITECTURA DE LA SOLUCIÓN', 14, 11);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Plataforma de Auditoría de Seguridad IA (OWASP AI-SVS v1.0 & ISO/IEC 42001:2023)', 14, 17);

      // Metadata Block
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Ficha Técnica de Infraestructura Cloud', 14, 29);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text(`Fecha de Emisión: ${currentDate}  |  Plataforma: Google Cloud Platform (GCP)  |  Motor: Gemini Enterprise Platform (Gemini 3.7 Flash)`, 14, 34);
      doc.text('Cómputo Serverless: Google Cloud Run  |  Base de Datos: Google Cloud Firestore (NoSQL Multi-Región)', 14, 38);

      // Section: Architecture Diagram Embed
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('DIAGRAMA TOPOLÓGICO DE ARQUITECTURA GOOGLE CLOUD', 14, 46);

      try {
        const imgData = await loadImageAsBase64(gcpArchImg);
        // Draw diagram frame & image (16:9 ratio: 182mm wide x 102.375mm high)
        doc.setDrawColor(220, 225, 230);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(13.5, 49.5, 183, 103.5, 2, 2, 'FD');
        doc.addImage(imgData, 'JPEG', 14, 50, 182, 102.375);
      } catch (imgErr) {
        console.error('Error adding diagram to PDF:', imgErr);
      }

      // Section 1: Executive Summary & Topology
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('1. RESUMEN EJECUTIVO & TOPOLOGÍA DE 3 CAPAS', 14, 162);

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const summaryText = 
        'La plataforma opera como un sistema integral de verificación de seguridad y gobernanza para aplicaciones de inteligencia artificial, modelos de lenguaje (LLMs) y arquitecturas RAG. ' +
        'La infraestructura está diseñada sobre servicios administrados serverless de Google Cloud Platform para garantizar alta disponibilidad, elasticidad instantánea, aislamiento criptográfico y cero mantenimiento de servidores.';
      doc.text(doc.splitTextToSize(summaryText, 182), 14, 168);

      const layer1 = '• Capa 1 (Ingress & Clientes): SPA React 19 para interacción web y clientes de integración continua CI/CD (GitHub Actions, GitLab CI) mediante API Keys seguras.';
      const layer2 = '• Capa 2 (Servidor & Orquestación): Google Cloud Run ejecutando Express.js para autenticación, procesamiento multipart de PDFs con Multer y orquestación de colas asíncronas.';
      const layer3 = '• Capa 3 (IA Cognitiva & Persistencia): Gemini Enterprise Platform (Gemini 3.7 Flash) para inferencia estructurada de 12 capítulos de AISVS y persistencia en Google Cloud Firestore.';
      doc.text(doc.splitTextToSize(layer1, 182), 14, 182);
      doc.text(doc.splitTextToSize(layer2, 182), 14, 191);
      doc.text(doc.splitTextToSize(layer3, 182), 14, 200);

      // Section 2: Detailed Components Table (Page 2)
      doc.addPage();

      // Page 2 Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 16, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('2. CATÁLOGO DETALLADO DE COMPONENTES GOOGLE CLOUD', 14, 11);

      const tableRows = gcpServices.map(srv => [
        srv.name,
        srv.category,
        srv.role,
        srv.specs.join('\n• '),
        srv.securityControls.join('\n• ')
      ]);

      autoTable(doc, {
        startY: 22,
        head: [['Servicio GCP', 'Categoría', 'Rol en la Arquitectura', 'Especificaciones Clave', 'Seguridad & Controles']],
        body: tableRows,
        theme: 'grid',
        headStyles: {
          fillColor: [26, 115, 232],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 7.5
        },
        styles: {
          fontSize: 7,
          cellPadding: 2,
          valign: 'top',
          textColor: [32, 33, 36]
        },
        columnStyles: {
          0: { cellWidth: 28, fontStyle: 'bold' },
          1: { cellWidth: 22 },
          2: { cellWidth: 42 },
          3: { cellWidth: 46 },
          4: { cellWidth: 44 }
        },
        margin: { left: 14, right: 14 }
      });

      // Section 3 & 4
      let finalY = (doc as any).lastAutoTable?.finalY || 160;
      if (finalY > 210) {
        doc.addPage();
        finalY = 20;
      } else {
        finalY += 8;
      }

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('3. FLUJO DE DATOS Y MODELO DE SEGURIDAD', 14, finalY);

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const flowText = 
        '1. Flujo Síncrono (Web UI): El usuario somete la arquitectura o sube un PDF (hasta 10MB) -> Ingress en Cloud Run procesa el buffer en memoria -> Llamada a Gemini 3.7 Flash con schema JSON estricto -> Guardado en Firestore (/audits) -> Retorno y renderizado inmediato.\n\n' +
        '2. Flujo Asíncrono (CI/CD Gates): Pipeline ejecuta POST /api/v1/audits con Bearer Token -> Cloud Run valida la API Key y retorna HTTP 202 con jobId -> Gemini evalúa en segundo plano -> Pipeline sondea GET /api/v1/audits/:jobId hasta estado COMPLETED -> Validación automática del Score (Quality Gate).\n\n' +
        '3. Política Anti-Alucinación: La evaluación impone un estado estricto por defecto ("Falta Evidencia") a menos que exista cita textual explícita en la documentación o capacidad nativa demostrable de la plataforma.';
      doc.text(doc.splitTextToSize(flowText, 182), 14, finalY + 5);

      const nextY = finalY + 42;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('4. ACUERDOS DE NIVEL DE SERVICIO (SLAs & SLOs)', 14, nextY);

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const sloText = 
        '• Disponibilidad de API: 99.9% de uptime garantizado por la infraestructura serverless de Cloud Run y Firestore.\n' +
        '• Latencia de Inferencia P95 (Texto): < 8 segundos para especificaciones completas de 12 capítulos.\n' +
        '• Latencia de Inferencia P95 (PDFs): < 25 segundos para documentos técnicos de diseño de hasta 10MB.\n' +
        '• Resiliencia de IA: Fallback multi-nivel automatizado (Gemini 3.7 Flash -> Gemini 3.5 Flash -> Gemini 3.1 Pro).';
      doc.text(doc.splitTextToSize(sloText, 182), 14, nextY + 5);

      // Footers on all pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7.5);
        doc.setTextColor(150, 150, 150);
        doc.text(`Documento de Arquitectura de la Solución | Google Cloud Platform | Página ${i} de ${totalPages}`, 14, 290);
        doc.text('AegisAI Architecture Specification', 140, 290);
      }

      doc.save('Arquitectura_Solucion_Google_Cloud_AISVS.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex-1 overflow-y-auto font-sans">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <DivisionHeader
          title="Arquitectura de la Solución"
          subtitle="Topología técnica y flujo de datos de la plataforma de auditoría AI basada en servicios nativos de Google Cloud."
        />
        
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            variant="primary"
            className="flex items-center gap-2 rounded-none font-bold bg-[#1B5FA6] text-white hover:bg-[#164F86] border-[1.5px] border-[#1A1A1A]"
          >
            <FileDown size={16} />
            {isExportingPDF ? 'Generando PDF...' : 'Exportar a PDF'}
          </Button>

          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            className="flex items-center gap-2 rounded-none font-bold border-[1.5px] border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#ECECEC]"
          >
            <Maximize2 size={16} />
            Ver Diagrama Completo
          </Button>
        </div>
      </div>

      {/* Main Architecture Diagram Display */}
      <Card className="mb-8 overflow-hidden border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
        <CardHeader className="bg-[#ECECEC]/30 border-b border-[#1A1A1A] pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="text-[#1B5FA6]" size={20} />
              <CardTitle className="text-base font-bold text-[#1A1A1A]">
                Diagrama Topológico Google Cloud
              </CardTitle>
            </div>
            <span className="text-xs font-bold text-gray-600">Renderizado en Alta Resolución</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-slate-900 flex items-center justify-center relative group">
          <img 
            src={gcpArchImg} 
            alt="Google Cloud Solution Architecture Diagram" 
            className="w-full h-auto max-h-[460px] object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
            onClick={() => setIsModalOpen(true)}
          />
          <div 
            onClick={() => setIsModalOpen(true)}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <span className="px-4 py-2 bg-white text-[#1A1A1A] text-xs font-bold rounded-none border-[1.5px] border-[#1A1A1A] shadow-none flex items-center gap-1.5">
              <Maximize2 size={14} /> Clic para ampliar diagrama
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Layer Flow Architecture Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <Layers size={18} className="text-[#1B5FA6]" />
          Capas de la Arquitectura & Flujo de Datos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-4 bg-white border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-none bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-sm">Capa de Ingress & Clientes</h3>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              SPA React 19 para interacción de auditores y clientes externos CI/CD (GitHub Actions / GitLab) autenticados por API Key.
            </p>
            <div className="text-[11px] font-mono font-bold bg-[#ECECEC]/40 p-2 rounded-none text-[#1A1A1A] border border-[#1A1A1A] flex items-center justify-between">
              <span>HTTPS / REST JSON + PDF</span>
              <ArrowRight size={12} className="text-gray-500" />
            </div>
          </div>

          <div className="p-4 bg-white border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-none bg-[#FBF3C9] text-[#1A1A1A] border border-[#1A1A1A] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-sm">Servidor & Orquestación</h3>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Google Cloud Run con Express ejecuta la validación de tokens, buffer de archivos Multer y cola de auditoría asíncrona.
            </p>
            <div className="text-[11px] font-mono font-bold bg-[#ECECEC]/40 p-2 rounded-none text-[#1A1A1A] border border-[#1A1A1A] flex items-center justify-between">
              <span>Async Queue & Dispatcher</span>
              <ArrowRight size={12} className="text-gray-500" />
            </div>
          </div>

          <div className="p-4 bg-white border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-none bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A] flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-[#1A1A1A] text-sm">IA Cognitiva & Persistencia</h3>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Gemini evalúa los capítulos normativos de AISVS e ISO 42001. Los resultados y estados se persisten en Cloud Firestore.
            </p>
            <div className="text-[11px] font-mono font-bold bg-[#ECECEC]/40 p-2 rounded-none text-[#1A1A1A] border border-[#1A1A1A] flex items-center justify-between">
              <span>Structured JSON Schema</span>
              <CheckCircle2 size={12} className="text-[#1B5FA6]" />
            </div>
          </div>

        </div>
      </div>

      {/* ISO/IEC 42001 3-Phase Google Cloud AI Protection Lifecycle */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#1B5FA6]" />
          Ciclo de Vida de Protección IA en Google Cloud (ISO/IEC 42001 & OWASP AI-SVS)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phase 3: Development & Protection */}
          <div className="p-4 bg-white border-[1.5px] border-[#1A1A1A] rounded-none shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#D9EBF7] text-[#1B5FA6] border border-[#1A1A1A] text-[11px] font-bold uppercase">
                  Fase 3: Desarrollo y Protecciones
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-600">Diseño de Sistemas IA</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                Genera un mapa visual y basado en evidencia de las brechas entre el estado actual y el deseado, asegurando la cadena de suministro y sanitizando el tráfico hacia los LLMs.
              </p>
              <ul className="space-y-2 text-xs text-gray-800 mb-3">
                <li className="p-2 bg-[#ECECEC]/40 border border-[#1A1A1A]">
                  <strong className="text-[#1B5FA6] block">Model Garden / Model Registry:</strong>
                  Librería de modelos revisados, firmados y verificados por Google y socios (Model Garden) y repositorio de modelos propios (Registry). Asegura la cadena de suministro evitando modelos de internet con posibles puertas traseras.
                </li>
                <li className="p-2 bg-[#ECECEC]/40 border border-[#1A1A1A]">
                  <strong className="text-[#1B5FA6] block">Google Cloud Model Armor:</strong>
                  Se posiciona delante de los LLMs. Sanitiza entradas y salidas en tiempo real, detecta y bloquea ataques de inyección de prompts y jailbreaks, y filtra contenido tóxico del usuario y de las respuestas por igual.
                </li>
              </ul>
            </div>
            <div className="text-[11px] font-mono font-bold bg-[#D9EBF7]/60 p-2 rounded-none text-[#1A1A1A] border border-[#1A1A1A]">
              ISO 42001 A.6.1.2 / A.6.2.6 • OWASP C01.4 / C02.10
            </div>
          </div>

          {/* Phase 4: Evaluation */}
          <div className="p-4 bg-white border-[1.5px] border-[#1A1A1A] rounded-none shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#FBF3C9] text-[#1A1A1A] border border-[#1A1A1A] text-[11px] font-bold uppercase">
                  Fase 4: Evaluación
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-600">Revisión de Controles</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                Revisión sistemática y cuantitativa de los controles aplicados antes del paso a producción con trazabilidad de auditoría certificable.
              </p>
              <ul className="space-y-2 text-xs text-gray-800 mb-3">
                <li className="p-2 bg-[#ECECEC]/40 border border-[#1A1A1A]">
                  <strong className="text-[#1B5FA6] block">Vertex Evaluation Service (AutoSxS):</strong>
                  Framework integrado en Vertex AI que utiliza <strong>AutoSxS</strong> (un modelo que auto-categoriza las respuestas como un profesor calificando la tarea de un alumno) y métricas de seguridad: lenguaje de odio, acoso, contenido sexualmente explícito y contenido peligroso.
                </li>
                <li className="p-2 bg-[#ECECEC]/40 border border-[#1A1A1A]">
                  <strong className="text-[#1B5FA6] block">Rastro de Auditoría ISO 42001:</strong>
                  Revisión más rápida y económica que un equipo especializado manual, generando evidencia inmutable para cumplimiento normativo.
                </li>
              </ul>
            </div>
            <div className="text-[11px] font-mono font-bold bg-[#FBF3C9]/70 p-2 rounded-none text-[#1A1A1A] border border-[#1A1A1A]">
              ISO 42001 Cláusula 9.1 / A.6.2.4 • OWASP C08.4
            </div>
          </div>

          {/* Phase 5: Deployment */}
          <div className="p-4 bg-white border-[1.5px] border-[#1A1A1A] rounded-none shadow-none flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#ECECEC] text-[#1A1A1A] border border-[#1A1A1A] text-[11px] font-bold uppercase">
                  Fase 5: Despliegue
                </span>
                <span className="text-[11px] font-mono font-bold text-gray-600">Producción Controlada</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                Despliegue controlado de aplicaciones en producción con vigilancia continua de deriva estadística y respuesta a incidentes para el SOC.
              </p>
              <ul className="space-y-2 text-xs text-gray-800 mb-3">
                <li className="p-2 bg-[#ECECEC]/40 border border-[#1A1A1A]">
                  <strong className="text-[#1B5FA6] block">Vertex AI Model Monitoring:</strong>
                  Evalúa en producción el desempeño del modelo. Detecta desviaciones (<em>Training-serving skew</em>: cuando la data en producción difiere del entrenamiento) y <em>drift</em> (cuando el mundo cambia y el modelo queda obsoleto), alertando de inmediato si deja de operar de forma segura.
                </li>
                <li className="p-2 bg-[#ECECEC]/40 border border-[#1A1A1A]">
                  <strong className="text-[#1B5FA6] block">Security Command Center con Protección AI:</strong>
                  Detección de amenazas y vulnerabilidades integrada con Vertex AI. Si alguien envía un ataque de inyección de prompt, se muestra como alerta de seguridad permitiendo al SOC responder a tiempo.
                </li>
              </ul>
            </div>
            <div className="text-[11px] font-mono font-bold bg-[#ECECEC] p-2 rounded-none text-[#1A1A1A] border border-[#1A1A1A]">
              ISO 42001 A.6.2.8 / Cláusula 10.1 • OWASP C12.2
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Google Cloud Service Directory */}
      <div>
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#1B5FA6]" />
          Componentes de Google Cloud
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Selector List */}
          <div className="space-y-2">
            {gcpServices.map((service) => {
              const Icon = service.icon;
              const isSelected = service.id === selectedService;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`w-full text-left p-3.5 rounded-none border-[1.5px] transition-all flex items-center justify-between
                    ${isSelected 
                      ? 'bg-[#D9EBF7] border-[#1A1A1A] ring-2 ring-[#1B5FA6]' 
                      : 'bg-white border-[#1A1A1A]/40 hover:border-[#1A1A1A]'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-none border border-[#1A1A1A] bg-white text-[#1B5FA6]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1A1A1A]">{service.name}</h4>
                      <span className="text-[11px] font-medium text-gray-600">{service.category}</span>
                    </div>
                  </div>
                  <ArrowRight size={14} className={isSelected ? 'text-[#1B5FA6]' : 'text-gray-400'} />
                </button>
              );
            })}
          </div>

          {/* Detailed Service Inspector Card */}
          <div className="lg:col-span-2">
            <Card className="h-full border-[1.5px] border-[#1A1A1A] rounded-none shadow-none">
              <CardHeader className="bg-[#ECECEC]/30 border-b border-[#1A1A1A] pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-none border border-[#1A1A1A] bg-[#D9EBF7] text-[#1B5FA6]">
                      <currentService.icon size={22} />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-[#1A1A1A]">{currentService.name}</CardTitle>
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">{currentService.category}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5 text-sm pt-6">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-1.5">Función en la Arquitectura</h4>
                  <p className="text-gray-800 leading-relaxed bg-[#ECECEC]/30 p-3 rounded-none border border-[#1A1A1A]">
                    {currentService.role}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Especificaciones Técnicas</h4>
                  <ul className="space-y-2">
                    {currentService.specs.map((spec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1B5FA6] mt-1.5 shrink-0" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2">Controles de Seguridad & Resiliencia</h4>
                  <ul className="space-y-2">
                    {currentService.securityControls.map((sec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#1A1A1A] bg-[#D9EBF7] p-2.5 rounded-none border border-[#1A1A1A]">
                        <CheckCircle2 size={14} className="text-[#1B5FA6] shrink-0 mt-0.5" />
                        <span>{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative max-w-6xl w-full bg-white rounded-none border-[2px] border-[#1A1A1A] p-4 overflow-hidden shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1A1A1A]">
              <h3 className="font-bold text-[#1A1A1A] text-lg">Google Cloud Solution Architecture - Vista Completa</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-[#1A1A1A] bg-[#ECECEC] hover:bg-[#FBF3C9] border border-[#1A1A1A] rounded-none transition-colors"
              >
                Cerrar ✕
              </button>
            </div>
            <div className="bg-slate-950 rounded-none border border-[#1A1A1A] overflow-hidden flex items-center justify-center max-h-[80vh]">
              <img 
                src={gcpArchImg} 
                alt="Google Cloud Architecture Diagram Expanded" 
                className="w-full h-auto object-contain max-h-[78vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

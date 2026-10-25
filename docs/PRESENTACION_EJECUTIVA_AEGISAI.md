# AEGIS AI ASSURANCE PLATFORM — PRESENTACIÓN EJECUTIVA Y TÉCNICA

**Versión:** 2.5.0 Enterprise Edition (Release 2026)  
**Clasificación:** Presentación Ejecutiva / C-Level & Technical Deck  
**Formato PDF Descargable:** [`docs/manuales_pdf/AegisAI_Presentacion_Ejecutiva.pdf`](manuales_pdf/AegisAI_Presentacion_Ejecutiva.pdf)  
**English Version:** [`docs/Manuals_english/AEGISAI_EXECUTIVE_PRESENTATION.md`](Manuals_english/AEGISAI_EXECUTIVE_PRESENTATION.md) / [`pdf/AegisAI_Executive_Presentation.pdf`](Manuals_english/pdf/AegisAI_Executive_Presentation.pdf)  

---

## Índice de Diapositivas

### Diapositiva 1: Portada y Declaración de Misión
* **Título:** AegisAI Enterprise — Aseguramiento, Gobernanza y Auditoría Continua de IA
* **Subtítulo:** Google Cloud AI Security & Governance Platform
* **Declaración:** Plataforma integral para evaluar, auditar y blindar arquitecturas de Inteligencia Artificial Empresarial (GenAI, LLMs, Agentes Autónomos y RAG) bajo estándares mundiales **OWASP AISVS v1.0** e **ISO/IEC 42001**.
* **Credenciales:** Licencia Apache 2.0 • Open Source • Edición Empresarial 2026.

---

### Diapositiva 2: El Problema a Resolver
* **Tema:** El Punto Ciego de Seguridad en la Adopción de GenAI en la Industria.
* **Diagnóstico Crítico:**
  1. **Despliegue Acelerado sin Gobierno:** El 13% de las organizaciones ya reportó brechas en modelos o aplicaciones de IA, y el 97% de ellas carecía de controles de acceso adecuados para IA (IBM, 2025).
  2. **Superficie de Ataque Inédita:** Pipelines RAG y agentes autónomos introducen riesgos críticos como Prompt Injection Indirecta, Envenenamiento de Embeddings y fuga de memoria de contexto.
  3. **Vacío entre CISO y Científicos de Datos:** Los equipos de seguridad carecen de herramientas para auditar grafos de agentes; los desarrolladores desconocen los marcos normativos.
  4. **Falta de Estándares Aplicados:** Cientos de controles teóricos en papel sin software automatizado que los valide en la nube.
  5. **Proliferación de Shadow AI:** APIs externas sin cuotas, claves en código fuente y bases vectoriales con PII sin cifrar.

---

### Diapositiva 3: Impacto de la No Prevención
* **Tema:** El Costo Real de Ignorar la Auditoría Preventiva.
* **Métricas de Impacto:**
  * **€35,000,000 o 7% de facturación:** Multas estatutarias bajo la ley europea *EU AI Act*.
  * **$4.88M USD:** Costo promedio de una filtración de datos corporativa (IBM Security 2024).
  * **13% / 97%:** Organizaciones con brechas en modelos o apps de IA / de ellas, sin controles de acceso adecuados para IA (IBM 2025).
  * **148 controles:** evaluables antes de producción en 5 marcos normativos integrados.
* **Consecuencias:**
  * Exfiltración de secretos corporativos y datos personales (PII).
  * Parálisis regulatoria, litigios civiles y suspensión de operaciones (LFPDPPP, LFPC, GDPR).
  * Pérdida irreversible de confianza de clientes y destrucción de valor de marca por sesgos o alucinaciones tóxicas.

---

### Diapositiva 4: Nuestra Solución: AegisAI Enterprise
* **Tema:** Aseguramiento Integral, Proactivo y Automatizado de Inteligencia Artificial.
* **Diferenciadores Clave:**
  * **Enfoque Shift-Left & Preventivo:** Análisis exhaustivo de diagramas, microservicios, prompts y cloud infra en minutos, no meses.
  * **Remediación Automatizada & Código Listo:** Generación automática de planes de acción técnicos, arquitecturas blindadas y recetas de código (TypeScript, Python, Google Cloud CLI).
  * **Diagnóstico Multi-Estándar:** Contraste simultáneo contra OWASP AISVS, ISO 42001 y leyes locales.
  * **Escáner en Vivo de Google Cloud:** Verificación en tiempo real de modelos de Vertex AI, Cloud Run, IAM y Secret Manager.
  * **Trazabilidad C-Level:** Paneles ejecutivos con porcentajes de cumplimiento y auditorías históricas.

---

### Diapositiva 5: Matriz Normativa y Cumplimiento Multi-Estándar
* **Tema:** Gobernanza Global y Cobertura Exhaustiva de Marcos de Seguridad.
* **Marcos Soportados:**
  1. **OWASP AI-SVS v1.0:** 12 capítulos y 56 controles (Gobernanza, Cadena de Suministro, Datos, Arquitectura, Modelos, RAG, Pruebas y Despliegue).
  2. **ISO/IEC 42001:2023:** Sistema de Gestión de Inteligencia Artificial (AIMS), Cláusulas 4 a 10 y controles del Anexo A (54 controles).
  3. **Regulación Mexicana (2026):** Cumplimiento estricto de la Ley Federal de Protección al Consumidor (LFPC) y Ley Federal de Protección de Datos Personales (LFPDPPP) respecto a algoritmos e IA.
  4. **Motor BYOF (Bring Your Own Framework):** Permite a cualquier empresa cargar sus políticas internas de seguridad en JSON con ponderaciones personalizadas.

---

### Diapositiva 6: Arquitectura de Software y Flujo de Datos
* **Tema:** Arquitectura Desacoplada, Resiliente y Segura.
* **Capas del Sistema:**
  * **Capa 1: Frontend & Presentación:** React 19, TypeScript, Vite, Tailwind CSS v4 (Aegis Dark System), gráficos interactivos en Recharts y exportador PDF en cliente (jsPDF).
  * **Capa 2: Backend & Middleware de Seguridad:** Node.js, Express, TypeScript, control de acceso RBAC (`x-admin-token`, `x-api-key`), cabeceras HTTP de seguridad y enmascaramiento de credenciales en respuestas de la API.
  * **Capa 3: Motor de Inferencia & GCP Scanner:** Google Gemini API (gemini-3.5-flash-lite / gemini-3.8-flash) desacoplado mediante proxy router universal (OpenAI/OpenRouter) y escáner de telemetría de Google Cloud.
  * **Capa 4: Almacenamiento Dual:** Persistencia local en JSON para ejecución autónoma y Cloud Firestore para entornos empresariales distribuidos.
  * **Privacidad y Control de Datos:** Credenciales enmascaradas en respuestas de la API y modelo a elección (Gemini / Vertex AI, endpoints compatibles con OpenAI o modelos locales).

---

### Diapositiva 7: Cómo Soluciona el Problema en la Práctica
* **Tema:** El Flujo Operativo del Auditor (Ciclo de 6 Fases en minutos).
* **Flujo Paso a Paso:**
  1. **Ingesta y Contextualización:** Carga de diagramas de arquitectura, especificaciones o prompts.
  2. **Escaneo de Nube en Vivo:** Detección automática de recursos en Google Cloud (Vertex AI, buckets, secretos).
  3. **Evaluación Algorítmica con IA:** Contraste minucioso de cada sub-control y cálculo de puntaje global de cumplimiento (0 - 100).
  4. **Informe Ejecutivo Interactivo:** Gráficos radar de madurez, desglose de controles aprobados vs. áreas de oportunidad críticas.
  5. **Generador de Planes de Acción y Recetas:** Fragmentos de código y configuración como guía para mitigar cada brecha detectada.
  6. **Exportación Formal en PDF:** Descarga inmediata de informes periciales listos para auditorías regulatorias o comités directivos.

---

### Diapositiva 8: Datos Técnicos, Rendimiento y DevSecOps
* **Tema:** Especificaciones Técnicas y Métricas de Calidad de Código.
* **Métricas Comprobadas:**
  * **Cobertura Normativa:** 148 controles evaluables en 5 marcos normativos integrados.
  * **Pruebas de Seguridad:** 10/10 verificaciones automatizadas OWASP LLM Top 10 aprobadas.
  * **Fugas de Secretos:** 0 credenciales expuestas (auditoría automatizada con `git-secrets`).
  * **Despliegue Serverless:** Compatible con Google Cloud Run, autoescalado de 0 a N, puerto 8080.
  * **Resiliencia Operativa:** Modelo de respaldo configurable y modo demo sin dependencias de red.

---

### Diapositiva 9: Siguientes Pasos (Roadmap de Desarrollo)
* **Tema:** Visión Estratégica y Futuro de AegisAI.
* **Hitos Planificados:**
  * **Q4 2026 (Corto Plazo):** Integración nativa en CI/CD mediante **GitHub Actions** y **GitLab CI** para bloquear PRs con vulnerabilidades en prompts o RAG antes de llegar a producción.
  * **Q1 2027 (Mediano Plazo):** Módulo de auditoría de agentes multi-etapa y workflows complejos (LangGraph, CrewAI, AutoGen), validando fronteras de autorización y sandboxing de herramientas.
  * **Q2 2027 (Largo Plazo):** Auto-remediación con Infraestructura como Código (IaC), sintetizando módulos de **Terraform** y **Helm Charts** listos para aplicar los parches en la nube en un clic.
* **Conclusión:** Seguridad que habilita y acelera la innovación con certeza técnica y gobernanza.

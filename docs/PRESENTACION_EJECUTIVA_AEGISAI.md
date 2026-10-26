# AEGIS AI ASSURANCE PLATFORM — PRESENTACIÓN EJECUTIVA Y TÉCNICA

**Versión:** 2.5.0 Enterprise Edition (Edición Endurecida 2026)  
**Clasificación:** Presentación Ejecutiva C-Level, Arquitectura de Seguridad & Gobernanza ISO/IEC 42001 AIMS  
**Formato PDF Descargable:** [`docs/manuales_pdf/AegisAI_Presentacion_Ejecutiva.pdf`](manuales_pdf/AegisAI_Presentacion_Ejecutiva.pdf)  
**English Version:** [`docs/Manuals_english/AEGISAI_EXECUTIVE_PRESENTATION.md`](Manuals_english/AEGISAI_EXECUTIVE_PRESENTATION.md) / [`pdf/AegisAI_Executive_Presentation.pdf`](Manuals_english/pdf/AegisAI_Executive_Presentation.pdf)  

---

## Índice de Diapositivas (10 Diapositivas Panorámicas)

### Diapositiva 1: Portada y Declaración de Misión
* **Título:** AegisAI Enterprise — Aseguramiento, Gobernanza y Auditoría Continua de IA
* **Subtítulo:** Google Cloud AI Security & ISO/IEC 42001 AIMS Governance Platform
* **Declaración:** Plataforma integral para evaluar, auditar y blindar arquitecturas de Inteligencia Artificial Empresarial (GenAI, LLMs, Agentes Autónomos, MCP y RAG) bajo estándares mundiales **OWASP AI-SVS v1.0** (Nivel L2/L3) e **ISO/IEC 42001:2023**.
* **Pilares:** Perímetro Zero-Trust con Cloud IAP (`--no-allow-unauthenticated`), Vertex AI (`gemini-3.8-flash` vía ADC sin llaves), Integridad Normativa SHA-256 (`C01.4`), Defensa Multi-Turno Crescendo (`C02.10`) y Gobernanza AIMS ISO 42001.

---

### Diapositiva 2: El Problema a Resolver
* **Tema:** El Punto Ciego de Seguridad en la Adopción de GenAI en la Industria.
* **Diagnóstico Crítico:**
  1. **Despliegue Acelerado sin Gobierno:** El 13% de las organizaciones ya reportó brechas en modelos o aplicaciones de IA, y el 97% de ellas carecía de controles de acceso adecuados para IA (IBM, 2025).
  2. **Superficie de Ataque Inédita:** Pipelines RAG, servidores MCP y agentes autónomos introducen vectores críticos: Inyección de Prompts Multi-Turno Crescendo (`C02.10`), Envenenamiento Normativo/Vectorial (`C01.4`), exfiltración SSRF/IMDS (`C04.3`) y Denegación de Billetera (`C11.1`).
  3. **Vacío entre CISO y Científicos de Datos:** Los equipos de seguridad carecen de herramientas para auditar grafos de agentes, manifiestos MCP (`C10.1`) y ACLs vectoriales (`C08.1`); los desarrolladores desconocen los marcos normativos.
  4. **Falta de Estándares Aplicados:** Cientos de cláusulas teóricas en papel sin software automatizado que las valide en entornos cloud reales.
  5. **Proliferación de Shadow AI:** Invocaciones externas sin cuotas, comparación insegura de tokens (`C05.3`), cuentas de servicio sobre-privilegiadas (`C05.2`) y almacenamiento multi-inquilino sin aislamiento.

---

### Diapositiva 3: Impacto de la No Prevención
* **Tema:** El Costo Real de Ignorar la Auditoría Preventiva.
* **Métricas de Impacto:**
  * **€35,000,000 o 7% de facturación:** Multas estatutarias bajo la ley europea *EU AI Act*.
  * **$4.88M USD:** Costo promedio de una filtración de datos corporativa (IBM Security).
  * **13% / 97%:** Organizaciones con brechas en modelos o apps de IA / de ellas, sin controles de acceso adecuados para IA (IBM 2025).
  * **148 controles:** evaluables antes de producción en 5 marcos normativos integrados.
* **Consecuencias:**
  * Exfiltración de propiedad intelectual, metadatos de nube (`169.254.169.254`) y datos personales (PII).
  * Parálisis regulatoria, litigios civiles y suspensión de operaciones (LFPDPPP, LFPC, GDPR).
  * Decisiones algorítmicas inapelables sin supervisión humana (`ISO 42001 A.5.2`) ni canal ético de denuncias (`ISO 42001 A.3.3`).

---

### Diapositiva 4: Nuestra Solución: AegisAI Enterprise
* **Tema:** Aseguramiento Integral, Proactivo y Automatizado de Inteligencia Artificial.
* **Diferenciadores Clave:**
  * **Enfoque Shift-Left & Preventivo:** Análisis exhaustivo de diagramas, PDFs, paquetes ZIP, microservicios, prompts e infraestructura cloud en segundos.
  * **Generador de Arquitectura Remediada al 100% y Recetario Completo:** Síntesis automática de especificaciones de arquitectura corregida (Sección 3) y recetario técnico completo de parches `1..N` (Sección 4) en TypeScript, HCL/Terraform, YAML, Python y Bash sin truncamiento y con resúmenes de oración completa.
  * **Motor Map-Reduce Multi-Estándar:** Verificación simultánea contra OWASP AI-SVS v1.0, ISO/IEC 42001:2023 y leyes locales mediante esquemas estrictos por lote (`buildBatchChaptersSchema`).
  * **Escáner en Vivo de Google Cloud Sin Llaves Persistentes:** Inspección de solo lectura sobre Vertex AI, Cloud Run, Secret Manager e IAM usando credenciales efímeras del auditor (`C05.2`).
  * **Telemetría Continua AIMS (`C08.4` / `Cláusula 9.1`):** Medición en tiempo real de cobertura de citación, fidelidad de esquema JSON, latencia y distribución de controles.

---

### Diapositiva 5: Matriz Normativa y Gobernanza AIMS ISO/IEC 42001
* **Tema:** Gobernanza Global y Cobertura Exhaustiva de Marcos de Seguridad.
* **Marcos Soportados:**
  1. **OWASP AI-SVS v1.0:** Los 12 Capítulos (`C01`–`C12`) verificados en niveles L1/L2/L3 (Cadena de Suministro `C01.4`, Inyección Multi-Turno `C02.10`, Contenedor Read-Only e IAP `C04.1`/`C04.3`, Auth en Tiempo Constante e IAM `C05.2`–`C05.4`, ACLs RAG y Grounding `C08.1`/`C08.4`, Sagas Compensatorias `C09.4`, Seguridad MCP `C10.1`–`C10.5`, Cuotas Anti-DoW y Anti-Destilación `C11.1`/`C11.4`, Alertas Cloud Logging `C12.2`).
  2. **ISO/IEC 42001:2023 (AIMS):** Cláusulas 4–10 y Anexo A (`Cláusula 4.1`/`4.2` Contexto y Partes Interesadas, `Cláusula 5.1`/`5.2` y `A.2.1`/`A.2.3` Política Corporativa de IA, `Cláusula 7.2`/`7.3` y `A.3.3` Competencia y Canal Ético Confidencial `ai-ethics-whistleblower@aegisai.enterprise`, `A.4.1` Inventario de Activos IA, `A.5.1`–`A.5.3` Evaluación de Impacto Algorítmico y Apelación Humana `ai-appeals@aegisai.enterprise`, `Cláusula 9.1`–`9.3` KPIs, Auditoría Interna y Revisión por la Dirección, `A.9.1`/`A.9.2` Uso Aceptable y Transparencia).
  3. **Regulación Mexicana (2026):** Cumplimiento de LFPC (Art. 56 retracto y transparencia algorítmica) y LFPDPPP (derechos ARCO y enmascaramiento DLP).
  4. **Motor BYOF (Bring Your Own Framework):** Ingesta normativa personalizada protegida por verificación SHA-256 (`C01.4`) y aislamiento por dominio de inquilino (`C08.1`).

---

### Diapositiva 6: Arquitectura Técnica Zero-Trust de 4 Capas
* **Tema:** Arquitectura Desacoplada, Inmutable y con Defensa en Profundidad.
* **Capas del Sistema:**
  * **Capa 1: Perímetro Zero-Trust y Presentación:** Cloud Identity-Aware Proxy (IAP) aplicando `--no-allow-unauthenticated`, SPA en React 19 + TypeScript + Vite, lista blanca de dominios OAuth 2.0 en Firebase Auth (`google.com`, `example.com`) y avisos visibles de Gobernanza/Apelación/Canal Ético ISO 42001 (`A.2.1`, `A.3.3`, `A.5.2`, `A.9.1`).
  * **Capa 2: Backend Endurecido y Seguridad API:** Node.js + Express ejecutándose como `aegisuser` sobre sistema de archivos `/app` estrictamente de solo lectura (`chmod -R a-w /app`, `C04.1`), comparación de tokens en tiempo constante (`crypto.timingSafeEqual`, `C05.3`), `verifyIdToken()` de Firebase Admin SDK, guardia DNS rebinding (`C10.5`), verificador criptográfico MCP (`C10.1`) y cuotas Anti-DoW (`C11.1`).
  * **Capa 3: Motor de Inferencia, Guardrails y Escáner:** Google Cloud Vertex AI (`gemini-3.8-flash`) vía ADC (`aegis-runner-sa` restringida exclusivamente a `roles/aiplatform.user` y `roles/datastore.user`, cero `roles/viewer`, `C05.2`), detector Multi-Turno Crescendo (`C02.10`), `responseLogprobs: false` (`C11.4`), bloqueo SSRF/IMDS (`validateOutboundEndpoint`, `C04.3`) y timeout resiliente de 180s.
  * **Capa 4: Persistencia, Integridad y Sagas:** Cloud Firestore (`aegis-ai-db`) vía Admin SDK y `firestore.rules` endurecidas (308/308 pruebas unitarias aprobadas, auditorías inmutables `allow delete: if false`, aislamiento por `ownerUid` y `tenantDomain` `C05.4`/`C08.1`), manifiesto SHA-256 (`C01.4`) y sagas compensatorias (`runCompensatingSaga`, `C09.4`).

---

### Diapositiva 7: Flujo Operativo del Auditor
* **Tema:** Ejecución Operativa desde la Ingesta hasta la Arquitectura Remediada al 100%.
* **Flujo Paso a Paso:**
  1. **Ingesta Autenticada y Escaneo Pre-Vuelo:** El auditor corporativo verificado carga PDFs/ZIPs/diagramas; `inspectPromptAndTrackSession` (`C02.10`) y el motor DLP desinfectan la entrada antes de la inferencia.
  2. **Ensamblado de Contexto Aislado por Inquilino:** Se verifican los snapshots normativos vía SHA-256 (`C01.4`) y se pre-filtran los marcos personalizados por `tenantDomain` (`C08.1`).
  3. **Evaluación Determinística Map-Reduce:** Vertex AI (`gemini-3.8-flash`, `temperature: 0.0`, `responseLogprobs: false`) evalúa cada lote bajo enums estrictos (`buildBatchChaptersSchema`).
  4. **Informe Ejecutivo Interactivo y Apelación Humana:** Gráficos radar, desglose por capítulo y enlace directo de Revisión Humana / Apelación de Dictamen (`ISO 42001 A.5.2`).
  5. **Arquitectura Remediada al 100% y Recetario Completo:** Sintetiza el reemplazo directo (Sección 3) y todos los parches `1..N` (Sección 4) con detección precisa de lenguaje (`typescript`, `hcl`, `yaml`, `python`, `bash`).
  6. **Pista de Auditoría Inmutable y Persistencia Saga:** Guardado en Firestore (`aegis-ai-db`) con atribución `ownerUid`/`tenantDomain` (`C05.4`) y reversión compensatoria (`C09.4`).

---

### Diapositiva 8: Especificaciones Técnicas, Benchmarks y Verificación DevSecOps
* **Tema:** Métricas Comprobadas de Seguridad, Integridad y Calidad de Código.
* **Benchmarks Verificados:**
  * **308 / 308 Aprobadas:** Suite de pruebas unitarias de Cloud Firestore Security Rules (`firestore.rules.test.ts` validada contra Firebase Rules API).
  * **6 / 6 SHA-256 Verificados:** Integridad criptográfica de todos los snapshots normativos (`config/frameworks/integrity-manifest.json`, `C01.4`).
  * **0 Roles IAM Amplios:** `aegis-runner-sa` restringida exclusivamente a `roles/aiplatform.user` + `roles/datastore.user` (`roles/viewer` revocado, `C05.2`).
  * **Contenedor Read-Only (`C04.1`) y Borde Zero-Trust (`C04.3`):** `chmod -R a-w /app`, Cloud IAP (`--no-allow-unauthenticated`), egreso privado VPC y bloqueo SSRF/IMDS.
  * **Alertas Cloud Logging (`C12.2`) y Telemetría AIMS (`C08.4`):** Emisión estructurada de alertas `WARNING`/`CRITICAL` (`aegis-security-alerting-c12-2`) y KPIs continuos (`/api/admin/aims-telemetry`).

---

### Diapositiva 9: Matriz de Defensa en Profundidad OWASP AI-SVS v1.0 & ISO/IEC 42001:2023
* **Tema:** Trazabilidad Completa de los Controles Endurecidos en AegisAI v2.5.
* **Familias de Controles Cubiertas:**
  * **Integridad Normativa, Datos y RAG (`C01.4`, `C08.1`, `C08.4`):** Verificación SHA-256 al arranque, pre-filtrado ACL por `tenantDomain` y telemetría de citación.
  * **Defensa contra Inyección, FinOps y Anti-Destilación (`C02.10`, `C11.1`, `C11.4`):** Detector multi-turno crescendo (bloqueo HTTP 422), cuotas por usuario de tasa/concurrencia/presupuesto de tokens 24h (`Retry-After`) y `responseLogprobs: false`.
  * **Infraestructura Zero-Trust, Auth y Sagas (`C04.1`, `C04.3`, `C05.2`–`C05.4`, `C09.4`, `C10.1`–`C10.5`, `C12.2`):** `/app` inmutable, Cloud IAP + filtro SSRF, `crypto.timingSafeEqual`, verificación de Firebase ID token, `ownerUid`, sagas compensatorias, guardia MCP/DNS rebinding y alertas Cloud Logging.
  * **Gobernanza AIMS ISO/IEC 42001:2023 (`Cláusulas 4–10`, `Anexo A`):** Política Corporativa de IA (`A.2.1`), Revisión Anual (`A.2.3`), Canal Ético (`A.3.3`), Inventario (`A.4.1`), Evaluación de Impacto y Apelación Humana (`A.5.1`–`A.5.3`), KPIs y Auditorías (`Cláusula 9.1`–`9.3`) y Uso Aceptable (`A.9.1`/`A.9.2`).

---

### Diapositiva 10: Siguientes Pasos (Roadmap Estratégico)
* **Tema:** Visión Estratégica y Futuro de AegisAI.
* **Hitos Planificados:**
  * **Q4 2026 (Corto Plazo):** Integración nativa en CI/CD mediante **GitHub Actions** y **GitLab CI** para bloquear PRs con vulnerabilidades de inyección, manifiestos MCP sin firma o almacenamiento vectorial sin cifrar.
  * **Q1 2027 (Mediano Plazo):** Módulo de auditoría de grafos multi-agente (LangGraph, CrewAI, AutoGen), validando fronteras de autorización, sagas compensatorias y sandboxing de memoria.
  * **Q2 2027 (Largo Plazo):** Auto-remediación con Infraestructura como Código (IaC), sintetizando módulos de **Terraform** y **Helm Charts** para aplicar políticas de Cloud IAP, VPC Service Controls y Cloud Armor en un clic.
* **Conclusión:** Seguridad y gobernanza ISO 42001 que habilitan y aceleran la innovación en IA con certeza criptográfica y arquitectónica.

# AegisAI / Auditor AISVS — Guía de Instalación y Operación

**Versión:** 1.0.0 (Producción)  
**Clasificación:** Código Abierto / Distribución Pública (Apache 2.0)  
**Arquitectura:** React 19 + TypeScript + Node.js Express + Google Gemini Multimodal Engine

---

## 1. Descripción General del Sistema

**AegisAI** es una plataforma empresarial para la auditoría, análisis y verificación automatizada de seguridad, gobernanza y cumplimiento normativo en sistemas y arquitecturas de Inteligencia Artificial (IA). 

La plataforma cuenta con motores de descomposición y evaluación contra los siguientes marcos normativos:
1. **OWASP AISVS v1.0** (*Artificial Intelligence Security Verification Standard*): 12 capítulos y 90 controles técnicos de ciberseguridad en IA.
2. **ISO/IEC 42001:2023** (*Artificial Intelligence Management System - AIMS*): Cláusulas 4 a 10 y Anexos A (38 controles) de gobernanza y gestión de riesgos éticos de IA.
3. **LFPDPPP (México / INAI)**: Ley Federal de Protección de Datos Personales en Posesión de los Particulares (Privacidad, consentimiento, transferencias transfronterizas, redacción DLP y derechos ARCO en IA).
4. **LFPC (México / PROFECO)**: Ley Federal de Protección al Consumidor (Transparencia en chatbots e IA, factual grounding en ofertas comerciales, derecho de retracto y escalamiento humano obligatorio).
5. **EU AI Act** (*Reglamento (UE) 2024/1689 de Inteligencia Artificial*): Evaluación de sistemas de alto riesgo, gobernanza de datos y ciberseguridad.

### Capacidades Clave de Aseguramiento y Remediación
- **Auditoría Simultánea Multi-Normativa (Compliance 360°):** Capacidad de seleccionar múltiples estándares técnicos y legales (e.g. OWASP AISVS + ISO 42001 + LFPDPPP + LFPC) para evaluarlos simultáneamente en una sola corrida Map-Reduce. El sistema calcula calificaciones ponderadas globales y entrega un desglose independiente por norma con filtrado interactivo.
- **Desglose y Puntuación Granular (L1 - L3):** Evaluación de controles atómicos con citas de evidencia técnica directa.
- **Herencia Técnica por Responsabilidad Compartida:** Acreditación nativa de salvaguardas provistas por Google Gemini Enterprise (ZDR, aislamiento microVM, chips Titan).
- **Generación y Descarga de Arquitectura Remediada (100% Cumplimiento):** Si la arquitectura auditada presenta áreas de oportunidad, el motor genera un archivo técnico descargable (`.md` / `.txt`) que integra la arquitectura original del usuario junto con todas las salvaguardas, middleware de sanitización, enmascaramiento DLP y parches de código necesarios para certificar el 100% de cumplimiento.
- **Exportación Ejecutiva Multiformato:** Reportes completos en PDF con tabla de desglose multi-normativo, checklists de mitigación en Markdown y planes de acción con matriz RACI.

---

## 2. Requisitos del Sistema

### A. Requisitos de Infraestructura
- **Sistema Operativo:** Linux (Ubuntu 20.04+, Debian 11+, RHEL 8+), macOS o Windows (con WSL2 / Docker Desktop).
- **CPU:** Mínimo 2 vCPUs (Recomendado: 4 vCPUs).
- **Memoria RAM:** Mínimo 2 GB (Recomendado: 4 GB o superior).
- **Almacenamiento:** Mínimo 5 GB de espacio disponible en disco.
- **Red:** Salida a Internet vía HTTPS (puerto 443) hacia `generativelanguage.googleapis.com` (API de Google Gemini).

### B. Opciones de Software Requerido
Tiene dos alternativas para instalar y ejecutar AegisAI:
- **Opción 1 (Directa con Node.js):** Requiere **Node.js v20.x o v22.x LTS** y **npm v10+**.
- **Opción 2 (Contenedor Docker):** Requiere **Docker Engine v24+** y **Docker Compose v2+**.

---

## 3. Despliegue en Producción (Google Cloud Run Serverless - Recomendado)

Para entornos empresariales y de producción corporativa en Google Cloud:

### Paso 1: Ejecutar el script automatizado
En **Google Cloud Shell** o terminal con `gcloud` autenticado:
```bash
# Otorgar permisos y ejecutar el orquestador
chmod +x deploy_cloud_run.sh
./deploy_cloud_run.sh ID_DE_TU_PROYECTO_GCP
```
El script habilitará las 8 APIs requeridas, configurará permisos IAM, aprovisionará Cloud Firestore en modo Nativo, compilará el contenedor Docker seguro (`--no-cache`) y desplegará el servicio en Cloud Run entregando la URL pública segura.

> [!IMPORTANT]
> - Para seguir el tutorial paso a paso con comandos manuales explicados, consulte la **[Guía de Instalación en Google Cloud Paso a Paso](docs/GUIA_DE_INSTALACION_GOOGLE_CLOUD_PASO_A_PASO.md)**.
> - Para detalles de arquitectura de infraestructura y resolución forense de problemas (Troubleshooting), consulte el **[Manual de Instalación y Despliegue](docs/MANUAL_DE_INSTALACION_Y_DESPLIEGUE.md)**.

---

## 4. Despliegue Alternativo en Contenedores (Docker / On-Premise)

Si su infraestructura cuenta con servidores Docker propios:

### Paso 1: Configurar las variables de entorno
Copie la plantilla de variables y edite con sus credenciales:
```bash
cp .env.example .env
nano .env  # O use vim / vscode
```

Asegúrese de establecer su clave de Google Gemini y su token de administrador:
```env
GEMINI_API_KEY="AIzaSy...Tu_Clave_Privada_Aqui"
ADMIN_API_TOKEN="Genere_Un_Token_Seguro_Aqui"
PORT=3000
NODE_ENV=production
```

> [!TIP]
> Puede generar una `GEMINI_API_KEY` gratuita o empresarial en [Google AI Studio](https://aistudio.google.com/) o mediante una cuenta de servicio de Google Cloud Vertex AI.

### Paso 2: Iniciar con Docker Compose
```bash
docker compose up -d --build
```

### Paso 3: Verificar el estado del contenedor
```bash
docker compose ps
curl http://localhost:3000/api/health
# Respuesta esperada: {"status":"ok"}
```

La interfaz web estará lista inmediatamente en `http://localhost:3000`.

---

## 5. Guía de Instalación Paso a Paso (Opción Node.js en Bare Metal / VM)

Si prefiere instalar directamente sobre un servidor Linux o en su entorno local de desarrollo:

### Paso 1: Preparar el archivo de entorno `.env`
```bash
cp .env.example .env
```
Edite `.env` con su editor preferido y configure:
- `GEMINI_API_KEY`: Clave de API de Google Gemini (obligatoria para ejecutar auditorías).
- `ADMIN_API_TOKEN`: Token de seguridad para acceder a `/api/admin/*` y cambiar configuraciones desde la interfaz web.
- `PORT`: Puerto de escucha (por defecto: `3000`).

### Paso 2: Configurar la persistencia de Firebase / Firestore
Si utiliza Cloud Firestore para la persistencia centralizada de auditorías, configure `firebase-applet-config.json` con los parámetros de su proyecto en Firebase Console:
```bash
cp firebase-applet-config.example.json firebase-applet-config.json
```
*(Si utiliza la plataforma en modo autónomo local, el archivo precargado con placeholders permite el funcionamiento y compilación inmediata).*

### Paso 3: Instalar las dependencias de Node.js
Ejecute una instalación limpia y determinista basada en el archivo de bloqueo `package-lock.json`:
```bash
npm ci
```

### Paso 4: Validar tipos y compilar para producción
```bash
# Validación estricta de TypeScript (0 errores)
npm run lint

# Compilación de bundles de frontend (Vite) y servidor backend (esbuild)
npm run build
```
Al finalizar, se creará la carpeta `dist/` con:
- `dist/index.html` y `dist/assets/`: Chunks optimizados y code-splitting del frontend React.
- `dist/server.cjs`: Bundle compilado del servidor Express para Node.js.

### Paso 5: Iniciar el servidor en producción
```bash
npm start
```
O de forma directa:
```bash
NODE_ENV=production node --dns-result-order=ipv4first dist/server.cjs
```

Abra su navegador web en `http://localhost:3000`.

---

## 5. Despliegue en la Nube con Google Cloud Platform (Cloud Run)

**Google Cloud Run** es el entorno de despliegue serverless recomendado para producción en GCP. Proporciona HTTPS automático, balanceo de carga global, aislamiento seguro de contenedores, soporte nativo de **Server-Sent Events (SSE)** y escalado flexible (incluso a cero instancias cuando no hay auditorías en curso).

### Requisitos Previos en GCP
1. Tener instalado y autenticado el SDK de Google Cloud (`gcloud` CLI):
   ```bash
   gcloud auth login
   gcloud config set project TU_PROYECTO_GCP
   ```
2. Habilitar las APIs de Cloud Run, Artifact Registry, Cloud Build y Secret Manager:
   ```bash
   gcloud services enable \
     run.googleapis.com \
     artifactregistry.googleapis.com \
     cloudbuild.googleapis.com \
     secretmanager.googleapis.com
   ```

---

### Paso 1: Almacenar Secretos en Google Cloud Secret Manager
Nunca exponga sus credenciales en texto plano ni en variables de entorno directas. Cree los secretos en Secret Manager:
```bash
# Guardar la API Key de Gemini
echo -n "TU_GEMINI_API_KEY" | gcloud secrets create aegis-gemini-key \
  --replication-policy="automatic" \
  --data-file=-

# Guardar el token de administración
echo -n "TU_ADMIN_API_TOKEN_SEGURO" | gcloud secrets create aegis-admin-token \
  --replication-policy="automatic" \
  --data-file=-
```

---

### Paso 2: Crear el Repositorio de Contenedores en Artifact Registry
```bash
gcloud artifacts repositories create aegisai-repo \
  --repository-format=docker \
  --location=us-central1 \
  --description="Repositorio de imágenes Docker para AegisAI"
```

---

### Paso 3: Construir y Subir la Imagen con Cloud Build
Ejecute la construcción remota directamente desde la raíz del código fuente utilizando el `Dockerfile` incluido:
```bash
PROJECT_ID=$(gcloud config get-value project)

gcloud builds submit --tag us-central1-docker.pkg.dev/$PROJECT_ID/aegisai-repo/aegisai:v1.0.0
```

---

### Paso 4: Desplegar el Servicio en Cloud Run
Ejecute el comando de despliegue configurando los recursos, el timeout para auditorías de IA y la inyección segura de secretos:

```bash
gcloud run deploy aegisai-auditor \
  --image us-central1-docker.pkg.dev/$PROJECT_ID/aegisai-repo/aegisai:v1.0.0 \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 2 \
  --timeout 600 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,PORT=3000" \
  --set-secrets "GEMINI_API_KEY=aegis-gemini-key:latest,ADMIN_API_TOKEN=aegis-admin-token:latest"
```

> [!IMPORTANT]
> **Parámetros Críticos para Cloud Run:**
> - `--timeout 600`: Las auditorías exhaustivas de IA (12 capítulos de AISVS o normativas LFPDPPP/LFPC completas) transmiten progreso en tiempo real mediante SSE. Un timeout de 10 minutos (600s) previene cortes prematuros de la conexión.
> - `--memory 2Gi` y `--cpu 2`: Garantizan rendimiento fluido para procesamiento de PDFs técnicos grandes y descompresión de esquemas normativos en memoria.
> - `--min-instances 0`: Permite reducir costos a \$0 cuando no hay evaluaciones activas (o puede establecerse en `1` si desea evitar tiempos de arranque en frío).

---

### Paso 5: Comprobar el Servicio en la Nube
Una vez completado el despliegue, Cloud Run le proporcionará una URL HTTPS única:
```bash
# Obtener la URL del servicio desplegado
SERVICE_URL=$(gcloud run services describe aegisai-auditor --region us-central1 --format 'value(status.url)')

# Comprobar el endpoint de salud
curl $SERVICE_URL/api/health
# {"status":"ok"}
```
Acceda a `$SERVICE_URL` desde cualquier navegador para comenzar a utilizar AegisAI.

---

## 6. Configuración del Motor de Inteligencia Artificial (Multi-Provider: Gemini, OpenRouter, OpenAI y Modelos Locales)

AegisAI incluye un motor desacoplado de inferencia que le permite operar con **Google Gemini**, enrutadores universales como **OpenRouter**, endpoints directos de **OpenAI**, o modelos auto-alojados compatibles con la especificación OpenAI (`/v1/chat/completions`) como **vLLM, Ollama, LiteLLM, OpenWebUI o LM Studio**.

### A. Configuración desde la Interfaz Web (Sin Reiniciar el Servidor)
1. Inicie sesión en la plataforma y diríjase a la pestaña **Administración**.
2. En la sección **Configuración del Motor LLM**, seleccione el proveedor deseado:
   - **Google Gemini**: Permite seleccionar entre `gemini-3.8-flash`, `gemini-3.1-flash-lite` y `gemini-3.5-pro`. Utiliza la API Key provista en `.env` o configurada en la pantalla.
   - **OpenRouter (Router Universal)**: Permite enrutar auditorías hacia cientos de modelos (Claude 3.7 Sonnet, GPT-4o, DeepSeek R1, Llama 3.3 70B, etc.). URL base predefinida: `https://openrouter.ai/api/v1`. Requiere su clave `sk-or-v1-...`.
   - **OpenAI Directo**: Conexión nativa a modelos de OpenAI (`gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini`). URL base predefinida: `https://api.openai.com/v1`.
   - **Local / Proxy Universal (OpenAI Compatible)**: Para inferencia privada on-premise mediante Ollama (`http://localhost:11434/v1`), vLLM (`http://localhost:8000/v1`), LiteLLM Proxy (`http://localhost:4000/v1`) u OpenWebUI.
3. **Parámetros Avanzados:**
   - **Temperatura:** Ajustable de 0.0 a 1.0 (Predeterminado: `0.0` para auditorías rigurosas, reproducibles y deterministas).
   - **Límite de Tokens (`max_tokens`):** Límite superior de generación por bloque (Predeterminado: `8192`).
   - **Modelo de Contingencia (`Fallback Model`):** Modelo alternativo que asumirá la carga si el modelo principal experimenta sobrecarga o agotamiento de cuota (HTTP 429/503).
   - **Cabeceras HTTP Personalizadas:** Permite inyectar cabeceras JSON adicionales (ej. `{"X-Routing-Group": "compliance"}`).
4. **Validación y Diagnóstico en Tiempo Real:**
   - Haga clic en **Probar Conexión**. La plataforma enviará una solicitud de verificación, medirá la **latencia en milisegundos (ms)** y mostrará una vista previa de la respuesta generada por el modelo seleccionado.
   - Haga clic en **Guardar Configuración**. Los cambios se aplican de inmediato en caliente (**hot-reload**) sin interrumpir el servicio.

### B. Configuración Estática por Archivo
Las preferencias se almacenan de forma segura en `config/admin-settings.json`. Si desea configurar el proveedor antes de iniciar el contenedor o servidor:
```json
{
  "provider": "openrouter",
  "openaiApiKey": "sk-or-v1-xxxxxxxxxxxx",
  "openaiBaseUrl": "https://openrouter.ai/api/v1",
  "openaiModel": "anthropic/claude-3.7-sonnet",
  "temperature": 0.0,
  "maxTokens": 8192,
  "fallbackModel": "google/gemini-2.5-flash"
}
```
*(Nota: En la interfaz gráfica y en las respuestas de API, las claves privadas son enmascaradas con formato `sk-or...xxxx` para prevenir fugas de secretos).*

---

## 6.1 Auditorías Multi-Normativas Simultáneas (Compliance 360°)

AegisAI permite seleccionar **múltiples marcos normativos simultáneos** para auditar un sistema de inteligencia artificial en una sola ejecución.

### A. Ejecución desde la Interfaz Web
1. Diríjase a **Nueva Auditoría**.
2. En la Sección 1 (**Selección de Normativas**), seleccione todas las normas aplicables mediante las tarjetas interactivas o utilice uno de los **Accesos Rápidos**:
   - 🌟 **Auditoría Integral 360° (4 Normas):** OWASP AISVS + ISO 42001 + LFPDPPP + LFPC.
   - 🇲🇽 **Leyes Mexicanas:** LFPDPPP (Privacidad) + LFPC (Protección al Consumidor).
   - 🛡️ **Técnico Dual:** OWASP AISVS (Seguridad Técnica) + ISO 42001 (Gobernanza y Gestión SGIA).
   - **Personalizado:** Añada marcos adicionales (como el *EU AI Act* o normativas internas corporativas).
3. Complete la información técnica, adjunte los diagramas o archivos de arquitectura y presione **Ejecutar Auditoría Multi-Normativa**.
4. En el reporte final:
   - Visualice la **Calificación Global Ponderada** y las tarjetas de **Compliance 360°** con la puntuación y controles aprobados de cada marco normativo individual.
   - Utilice las pestañas en la barra lateral (`Todas`, `AISVS`, `ISO`, `LFPDPPP`, `LFPC`) para filtrar y navegar los capítulos por estándar.
   - Descargue el **Reporte Completo en PDF**, el cual incluye una tabla ejecutiva con el desglose por marco normativo antes de los capítulos técnicos.

### B. Ejecución Automatizada vía API REST (cURL / CI/CD)
Puede integrar la auditoría multi-normativa en sus pipelines de DevSecOps:
```bash
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "standardType": "MULTI",
    "selectedStandards": [
      "AI-SVS",
      "ISO-42001",
      "fw-lfpdppp-mex-2026",
      "fw-lfpc-mex-2026"
    ],
    "systemName": "Agente Financiero Omnicanal",
    "technicalLead": "Ing. Sofía Martínez",
    "email": "sofia.martinez@empresa.com",
    "techPlatform": "gemini-enterprise",
    "targetLevel": "L2",
    "description": "Especificación técnica de la arquitectura..."
  }'
```

La respuesta en tiempo real utiliza Server-Sent Events (SSE) transmitiendo el progreso de cada etapa. Al finalizar, la estructura del reporte contiene el campo `standardsBreakdown` con el desglose independiente de cada norma, permitiendo auditorías forenses y dashboards de cumplimiento 360°.

---

## 6.2 Módulo de Auditoría en Vivo de Google Cloud (GCP Live Scanner)

AegisAI incluye el módulo **GCP Live Scanner**, el cual permite auditar **proyectos reales de Google Cloud en vivo** conectándose directamente a las APIs oficiales de administración (Cloud Control Plane), eliminando la necesidad de redactar o cargar documentación técnica manualmente.

### A. Garantía de Inviolabilidad y Cero Recursos (Zero-Footprint Invariant)
- **Cero Recursos Creados**: No se despliegan agentes, microservicios, Cloud Functions, máquinas virtuales, buckets ni bases de datos en el proyecto del cliente.
- **Consultas Estrictas de Solo Lectura**: Solo ejecuta llamadas `HTTP GET` de inspección de metadata a las APIs de Google Cloud (`cloudresourcemanager`, `storage`, `run`, `aiplatform`, `secretmanager`). Ninguna configuración, permiso IAM o recurso es modificado.
- **Procesamiento Aislado**: Toda la telemetría se procesa dentro de AegisAI y las credenciales temporales se manejan en memoria volátil sin persistirse en disco.

### B. Métodos de Conexión Soportados
1. **Modo Simulación / Demo Corporativo:** Prueba inmediata con la arquitectura preconfigurada de una institución financiera (`aegis-fintech-ai-prod`) con Vertex AI, Cloud Run y buckets GCS, sin necesidad de credenciales reales.
2. **Application Default Credentials (ADC / Cloud Run):** Si AegisAI se ejecuta en Cloud Run o en una estación de trabajo con ADC activo, la autenticación es 100% automática y nativa.
3. **Token de Acceso Temporal (Bearer):** Permite ingresar un token generado mediante `gcloud auth print-access-token` o desde la consola de Google Cloud.
4. **Cuenta de Servicio JSON en Memoria:** Permite ingresar las credenciales de una Service Account con rol de lectura; la firma JWT se procesa en memoria volátil.

### C. Componentes de Infraestructura Inspeccionados
- 🤖 **Vertex AI (Modelos y Endpoints):** Aislamiento de red VPC (Private Service Connect vs. IP pública), Model Armor y monitoreo continuo de drift.
- 🚀 **Cloud Run (Microservicios y Agentes):** Políticas de ingreso (*Ingress: Internal Only* vs. *All*), cuentas de servicio dedicadas de mínimo privilegio y ausencia de secretos planos en variables de entorno.
- 🗄️ **Cloud Storage (Buckets RAG y Datasets):** Activación forzada de *Uniform Bucket-Level Access*, prevención de acceso público (*Public Access Prevention: enforced*), cifrado soberano con llaves gestionadas por el cliente (CMEK) y versionado.
- 🔐 **Cloud IAM & Permisos:** Detección de cuentas con roles primitivos excesivos (`roles/owner`, `roles/editor`) y asignaciones a miembros públicos globales (`allUsers`, `allAuthenticatedUsers`).
- 🔑 **Secret Manager & Cloud KMS:** Políticas de rotación periódica automática de llaves criptográficas y almacenamiento seguro de API keys.

### D. Ejecución vía API REST con Streaming SSE
```bash
curl -N -X POST http://localhost:3000/api/gcp/audit \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "mi-proyecto-gcp-prod",
    "authMode": "demo",
    "selectedStandards": ["AI-SVS", "ISO-42001", "fw-lfpdppp-mex-2026", "fw-lfpc-mex-2026"],
    "systemName": "Infraestructura Producción GCP",
    "targetLevel": "L2"
  }'
```

---

## 7. Verificación Operativa y Batería de Pruebas

Para comprobar que la instalación se ejecutó de forma óptima y que la plataforma es resiliente frente a vulnerabilidades:

### 1. Comprobación de salud básica:
```bash
curl http://localhost:3000/api/health
# {"status":"ok"}
```

### 2. Pruebas del Escáner de Google Cloud (GCP Live Scanner):
```bash
npm run test:gcp
```
Verifica la conectividad con proyectos de Google Cloud, recolección de telemetría de activos (Buckets, Vertex AI, Cloud Run, IAM) y ejecución completa de la auditoría en tiempo real con SSE.

### 3. Pruebas de integración de servicios:
```bash
npm run test:integration
```
Verifica la disponibilidad de frameworks normativos (`/api/frameworks`), esquemas de LFPDPPP y LFPC, cabeceras de seguridad y conectividad del motor Gemini.

### 4. Batería de Seguridad OWASP AI Top 10:
```bash
npm run test:security
```
Ejecuta 10 vectores de prueba de ciberseguridad sobre el servidor en vivo:
- **LLM01**: Resistencia a inyecciones de prompts directas e indirectas.
- **LLM02**: Prevención de XSS y divulgación de scripts maliciosos.
- **LLM03**: Protección contra envenenamiento de contexto RAG.
- **LLM04**: Resiliencia ante DoS por tamaño de payloads excesivos (HTTP 413).
- **LLM05**: Integridad de la cadena de suministro de paquetes.
- **LLM06**: Blindaje contra fuga de secretos (`GEMINI_API_KEY` o tokens en respuestas).
- **LLM07**: Control estricto de acceso RBAC a endpoints administrativos.
- **LLM08**: Invariante 4 AISVS (inmutabilidad estricta de reportes de auditoría).
- **LLM09**: Grounding factual con citación obligatoria de evidencia técnica.
- **LLM10**: Denegación de acceso a dotfiles (`.env`, `.git`) y rutas sensibles del servidor.

### 4. Batería de Pruebas Multi-Proveedor LLM:
```bash
npm run test:llm
```
Ejecuta 6 pruebas de extremo a extremo para validar el ciclo de vida del motor de IA:
1. Comprobación del estado inicial y carga de proveedores.
2. Prueba de conectividad en vivo con Google Gemini (medición de latencia en ms).
3. Configuración y conmutación en caliente hacia OpenRouter / OpenAI.
4. Verificación de persistencia y ofuscación de seguridad en claves API.
5. Detección y manejo resiliente ante endpoints o modelos inexistentes.
6. Restauración segura y automática al motor predeterminado.

---

## 8. Configuración de Servicio en Servidor Linux (Systemd)

Para mantener AegisAI activo 24/7 en un servidor de producción:

1. Cree el archivo de servicio:
   ```bash
   sudo nano /etc/systemd/system/aegisai.service
   ```
2. Pegue la siguiente definición (ajustando la ruta a su directorio de instalación):
   ```ini
   [Unit]
   Description=AegisAI Assurance Platform Service
   After=network.target

   [Service]
   Type=simple
   User=www-data
   WorkingDirectory=/opt/aegisai
   ExecStart=/usr/bin/node --dns-result-order=ipv4first dist/server.cjs
   Restart=always
   RestartSec=5
   Environment=NODE_ENV=production
   EnvironmentFile=/opt/aegisai/.env

   LimitNOFILE=65536
   StandardOutput=journal
   StandardError=journal
   SyslogIdentifier=aegisai

   [Install]
   WantedBy=multi-user.target
   ```
3. Active e inicie el servicio:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable aegisai
   sudo systemctl start aegisai
   sudo systemctl status aegisai
   ```

---

## 9. Estructura del Código Fuente

```
AegisAI/
├── README.md                      # Esta guía de instalación y uso
├── .env.example                   # Plantilla de variables de entorno (sin secretos)
├── package.json                   # Definición de dependencias y scripts de construcción
├── package-lock.json              # Árbol de dependencias determinista
├── tsconfig.json                  # Configuración de compilación TypeScript estricta
├── vite.config.ts                 # Configuración de empaquetado de assets y code-splitting
├── Dockerfile                     # Construcción multi-etapa en contenedor Node.js 22
├── deploy_cloud_run.sh            # Script de orquestación y despliegue a Google Cloud Run
├── firestore.rules                # Reglas declarativas de seguridad de Cloud Firestore
├── server.ts                      # Backend Express: Motor Map-Reduce, Multi-Proveedor LLM y API REST
├── index.html                     # Punto de entrada HTML5 del frontend
├── config/                        # Configuraciones locales y catálogos
│   ├── admin-settings.json        # Preferencias administrativas locales
│   └── frameworks/                # Marcos normativos en formato JSON (AISVS, LFPDPPP, LFPC, etc.)
├── src/                           # Código fuente del cliente (React 19 + TypeScript)
│   ├── components/                # Componentes modulares (Admin, Dashboard, GCP Live Scanner, Reportes)
│   ├── lib/                       # Utilidades de datos, conexión Firebase y generadores
│   ├── services/                  # Servicios en la nube (GCP Live Scanner Service)
│   └── assets/                    # Imágenes y diagramas de arquitectura
├── docs/                          # Suite documental técnica oficial en Markdown y PDF
│   ├── GUIA_DE_INSTALACION_GOOGLE_CLOUD_PASO_A_PASO.md # Guía paso a paso para Google Cloud
│   ├── MANUAL_DE_INSTALACION_Y_DESPLIEGUE.md           # Manual de DevOps e Infraestructura
│   ├── DOCUMENTO_DE_ARQUITECTURA_DE_SOFTWARE.md        # Arquitectura SAD (Modelo 4+1)
│   ├── MANUAL_DE_USUARIO_FINAL.md                     # Guía operativa para auditores
│   ├── MANUAL_DE_ADMINISTRACION_Y_OPERACION.md         # Operaciones, logs y rotación
│   ├── PLAN_E_INFORME_DE_PRUEBAS.md                    # Reporte de QA y OWASP Top 10 for LLMs
│   └── GUIA_DE_DESARROLLO_Y_MANTENIMIENTO.md           # Normas de código y extensión BYOF
└── scripts/                       # Herramientas de automatización y baterías de pruebas
```

---

## 10. Documentación Oficial Incluida

Este paquete incluye la suite documental completa de ingeniería:

1. **Guía de Instalación en Google Cloud Paso a Paso** ([`GUIA_DE_INSTALACION_GOOGLE_CLOUD_PASO_A_PASO.md`](docs/GUIA_DE_INSTALACION_GOOGLE_CLOUD_PASO_A_PASO.md)): Tutorial ejecutable de 12 pasos para desplegar en Cloud Run y Firestore.
2. **Manual de Instalación y Despliegue** ([`MANUAL_DE_INSTALACION_Y_DESPLIEGUE.md`](docs/MANUAL_DE_INSTALACION_Y_DESPLIEGUE.md)): Arquitectura de red, Nginx con proxy inverso SSE, TLS/SSL, Docker, Kubernetes, Cloud Run y Troubleshooting forense.
3. **Manual de Usuario Final** ([`MANUAL_DE_USUARIO_FINAL.md`](docs/MANUAL_DE_USUARIO_FINAL.md)): Guía paso a paso para el personal auditor, uso de catálogos, ejecución de auditorías y lectura de dictámenes.
4. **Manual de Administración y Operación** ([`MANUAL_DE_ADMINISTRACION_Y_OPERACION.md`](docs/MANUAL_DE_ADMINISTRACION_Y_OPERACION.md)): Gestión de claves, monitoreo de cuotas de tokens, rotación de accesos y observabilidad.
5. **Documento de Arquitectura de Software - SAD** ([`DOCUMENTO_DE_ARQUITECTURA_DE_SOFTWARE.md`](docs/DOCUMENTO_DE_ARQUITECTURA_DE_SOFTWARE.md)): Modelo 4+1 vistas, diagramas de secuencia, streaming SSE, jerarquía de fallbacks de IA y modelo de amenazas.
6. **Guía de Desarrollo y Mantenimiento** ([`GUIA_DE_DESARROLLO_Y_MANTENIMIENTO.md`](docs/GUIA_DE_DESARROLLO_Y_MANTENIMIENTO.md)): Normas de codificación, extensión de frameworks BYOF y ciclo de vida de mantenimiento.
7. **Plan e Informe de Pruebas** ([`PLAN_E_INFORME_DE_PRUEBAS.md`](docs/PLAN_E_INFORME_DE_PRUEBAS.md)): Casos de prueba detallados, criterios de aceptación y actas de conformidad con 100% de aprobación.

---

## 11. Contacto y Soporte

Para aclaraciones técnicas, dudas sobre la integración con su infraestructura o solicitudes de soporte técnico sobre el código fuente, contacte al equipo de ingeniería responsable de la entrega.

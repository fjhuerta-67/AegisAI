# Guía de Instalación y Despliegue en Google Cloud Paso a Paso
## AegisAI — Enterprise AI Security & Governance Assurance Platform
**Versión:** 2.5.0 Enterprise (Edición 2026)  
**Clasificación:** Guía Técnica Oficial de Despliegue en Infraestructura Cloud  
**Plataforma de Despliegue:** Google Cloud Platform (Cloud Run, Firestore Nativo, Vertex AI, Artifact Registry, Firebase Auth)  
**Tiempo Estimado:** 10 a 15 minutos  

---

## 1. Arquitectura de Despliegue en Google Cloud

AegisAI se despliega bajo una arquitectura **Serverless Cloud-Native** en Google Cloud Platform. Esta arquitectura garantiza **alta disponibilidad (99.95%)**, escalabilidad automática de 0 a $N$ instancias, costo eficiente (pago por uso) y aislamiento estricto de seguridad:

```
                              [ AUDITOR / USUARIO FINAL ]
                                          │
                                          │ HTTPS (TLS 1.3)
                                          ▼
                       ┌─────────────────────────────────────┐
                       │       GOOGLE CLOUD RUN INGRESS      │
                       │     https://aegis-ai-xyz.run.app    │
                       └──────────────────┬──────────────────┘
                                          │
                 ┌────────────────────────┴────────────────────────┐
                 │                                                 │
                 ▼                                                 ▼
┌─────────────────────────────────┐               ┌─────────────────────────────────┐
│        FRONTEND SPA (VITE)      │               │       BACKEND API & RUNNER      │
│  • React 19 + Tailwind CSS v4   │               │  • Express REST + SSE Streaming │
│  • Firebase Client Auth (OAuth) │               │  • Motor Map-Reduce Multi-Norma │
│  • Exportadores PDF & Markdown  │               │  • GCP Live Scanner (Read-Only) │
└─────────────────────────────────┘               └────────────────┬────────────────┘
                                                                   │
                                                Identidad IAM      │ (aegis-runner-sa)
                                                Mínimo Privilegio  │
                                                                   ▼
       ┌───────────────────────────────┬───────────────────────────┴───────────────────────────┐
       ▼                               ▼                                                       ▼
┌───────────────┐               ┌───────────────┐                                       ┌───────────────┐
│CLOUD FIRESTORE│               │VERTEX AI /    │                                       │SECRET MANAGER │
│  MODO NATIVO  │               │GEMINI API     │                                       │  (OPCIONAL)   │
│• audits/      │               │• Modelos IA   │                                       │• API Keys     │
│• frameworks/  │               │• Telemetría   │                                       │• Admin Token  │
└───────────────┘               └───────────────┘                                       └───────────────┘
```

---

## 2. Requisitos Previos

Antes de comenzar, asegúrese de contar con:

1. **Cuenta y Proyecto de Google Cloud**:
   - Un proyecto de GCP activo con **Cuenta de Facturación (Cloud Billing)** vinculada.
   - Si no tiene uno, puede crearlo en [Google Cloud Console](https://console.cloud.google.com/).
2. **Permisos de IAM Necesarios**:
   - Rol `roles/owner` **o** la combinación de:
     - Administrador de IAM del proyecto (`roles/resourcemanager.projectIamAdmin`)
     - Administrador de Cloud Run (`roles/run.admin`)
     - Administrador de Artifact Registry (`roles/artifactregistry.admin`)
     - Editor de Cloud Build (`roles/cloudbuild.builds.editor`)
     - Propietario de Datastore / Firestore (`roles/datastore.owner`)
     - Administrador de Cuentas de Servicio (`roles/iam.serviceAccountAdmin`)
3. **Entorno de Ejecución Recomendado: Google Cloud Shell**:
   - Se recomienda ejecutar este despliegue directamente desde **[Google Cloud Shell](https://shell.cloud.google.com)**.
   - Cloud Shell incluye `gcloud`, `docker`, `git`, `node` y `npm` preinstalados y autenticados con sus credenciales de Google.
4. **Clave de API de Google Gemini (Opcional si usa Vertex AI directo)**:
   - Puede obtener una clave gratuita o empresarial en [Google AI Studio](https://aistudio.google.com/).

---

## 3. Guía de Despliegue Manual Paso a Paso

Siga estos 12 pasos secuenciales en la terminal de Google Cloud Shell o en su terminal local con `gcloud` autenticado.

---

### Paso 1: Configurar Variables de Entorno y Proyecto en `gcloud`

Defina las variables del despliegue y establezca el proyecto activo:

```bash
# 1. Defina el ID de su proyecto de Google Cloud
export PROJECT_ID="tu-proyecto-gcp-id"

# 2. Defina la región (us-central1 recomendada para Vertex AI y Cloud Run)
export REGION="us-central1"

# 3. Defina nombres del servicio y repositorio
export SERVICE_NAME="aegis-ai"
export REPO_NAME="cloud-run-source-deploy"

# 4. Dominios autorizados para inicio de sesión (* para permitir cualquier cuenta de Google)
export ALLOWED_DOMAINS="*"

# 5. (Opcional) Clave de Gemini si la tiene a la mano
export GEMINI_API_KEY="AIzaSyTuClaveDeGeminiAqui"

# 6. Configurar el contexto en gcloud
gcloud config set project "$PROJECT_ID"
```

> [!TIP]
> Si no conoce el ID exacto de su proyecto, ejecute `gcloud projects list` para verlo.

---

### Paso 2: Habilitar las APIs Requeridas de Google Cloud

AegisAI requiere 8 servicios administrados de Google Cloud. Habilítelos con un solo comando:

```bash
echo "Habilitando APIs requeridas de Google Cloud..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com \
  secretmanager.googleapis.com \
  --project="$PROJECT_ID"
```

*Verificación:* La terminal confirmará `Operation "operations/..." finished successfully`.

---

### Paso 3: Configurar Permisos IAM para el Pipeline de Cloud Build

Para que Google Cloud Build pueda compilar y subir imágenes a Artifact Registry sin bloqueos de permisos:

```bash
# Obtener el número de proyecto
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "Configurando permisos para Proyecto #${PROJECT_NUMBER}..."

# Otorgar roles a la cuenta de servicio Compute
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/cloudbuild.builds.builder" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/storage.admin" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/logging.logWriter" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/artifactregistry.admin" --quiet

# Otorgar roles a la cuenta de servicio Cloud Build
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/cloudbuild.builds.builder" --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/storage.admin" --quiet >/dev/null 2>&1 || true
```

---

### Paso 4: Crear la Cuenta de Servicio de Ejecución (`aegis-runner-sa`)

Siguiendo las mejores prácticas de **Mínimo Privilegio (Least Privilege)**, creamos una identidad dedicada para Cloud Run en lugar de usar la cuenta por defecto:

```bash
SA_NAME="aegis-runner-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# 1. Crear la cuenta de servicio si no existe
if ! gcloud iam service-accounts describe "${SA_EMAIL}" --project="$PROJECT_ID" &>/dev/null; then
    gcloud iam service-accounts create "${SA_NAME}" \
      --description="Identidad de ejecucion para AegisAI Cloud Run" \
      --display-name="AegisAI Runner" \
      --project="$PROJECT_ID"
    echo "Cuenta de servicio creada: ${SA_EMAIL}"
else
    echo "Cuenta de servicio ya existe: ${SA_EMAIL}"
fi

# 2. Asignar rol de Inferencia de Vertex AI
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user" --quiet

# 3. Asignar rol de acceso a Cloud Firestore
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/datastore.user" --quiet

# 4. Asignar rol de lectura (Viewer) para el GCP Live Scanner
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/viewer" --quiet
```

---

### Paso 5: Aprovisionar Cloud Firestore en Modo Nativo

AegisAI almacena los dictámenes de auditoría inmutables y los marcos regulatorios personalizados en Firestore:

```bash
# Verificar si la base de datos (default) ya existe; si no, crearla
if ! gcloud firestore databases list --project="$PROJECT_ID" --format="value(name)" 2>/dev/null | grep -q "(default)"; then
    echo "Creando base de datos Firestore (default) en modo Nativo..."
    gcloud firestore databases create \
      --location="nam5" \
      --type="firestore-native" \
      --project="$PROJECT_ID" --quiet
else
    echo "Base de datos Firestore ya inicializada y lista."
fi
```

> [!NOTE]
> `nam5` es la multirregión de Estados Unidos (alta disponibilidad geográfica). Si prefiere Europa, use `eur3`.

---

### Paso 6: Configurar Firebase Authentication y Google Sign-In

Para que los auditores y oficiales de cumplimiento puedan iniciar sesión mediante Google:

1. Abra la consola de Firebase: **[https://console.firebase.google.com/project/_/authentication/providers](https://console.firebase.google.com/project/_/authentication/providers)**.
2. Seleccione su proyecto (`$PROJECT_ID`).
3. En la pestaña **"Sign-in method"** (Método de acceso):
   - Haga clic en el proveedor **"Google"**.
   - Active el interruptor de habilitación.
   - Seleccione su correo de soporte del proyecto y haga clic en **Guardar**.
4. En **Project Settings > General** (Configuración del proyecto > General), baje a la sección **"Tus apps"**:
   - Si no tiene una app Web registrada, haga clic en el icono Web (`</>`), nómbrela `AegisAI` y haga clic en **Registrar app**.
5. Asegúrese de que el archivo `firebase-applet-config.json` en la raíz de su repositorio tenga los valores de su proyecto:

```json
{
  "projectId": "tu-proyecto-gcp-id",
  "appId": "1:123456789012:web:abcdef1234567890",
  "apiKey": "AIzaSyTuApiKeyDeFirebase",
  "authDomain": "tu-proyecto-gcp-id.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "tu-proyecto-gcp-id.firebasestorage.app",
  "messagingSenderId": "123456789012"
}
```

> [!TIP]
> Si usa el script automatizado `./deploy_cloud_run.sh`, este archivo se actualiza automáticamente con su `PROJECT_ID` y `PROJECT_NUMBER`.

---

### Paso 7: Crear Repositorio en Artifact Registry

Artifact Registry alojará la imagen de contenedor Docker compilada:

```bash
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    echo "Creando repositorio en Artifact Registry..."
    gcloud artifacts repositories create "$REPO_NAME" \
      --repository-format=docker \
      --location="$REGION" \
      --description="Repositorio Docker para AegisAI" \
      --project="$PROJECT_ID" --quiet
else
    echo "Repositorio ${REPO_NAME} ya existe en Artifact Registry."
fi
```

---

### Paso 8: Compilar la Imagen del Contenedor

Defina la URL completa de la imagen:
```bash
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
echo "Destino de la imagen: $IMAGE_URL"
```

#### Opción A: Compilación en la Nube con Google Cloud Build (Recomendado)
No requiere Docker instalado localmente:
```bash
gcloud builds submit --tag "$IMAGE_URL" --project="$PROJECT_ID" .
```

#### Opción B: Compilación Local con Docker
Si tiene Docker corriendo localmente:
```bash
docker build --no-cache -t "$IMAGE_URL" .
docker push "$IMAGE_URL"
```

---

### Paso 9: Desplegar el Servicio en Google Cloud Run

Despliegue el contenedor en Cloud Run con los recursos óptimos:

```bash
# Variables de entorno adicionales (ej. GEMINI_API_KEY si está disponible)
ENV_VARS_EXTRA=""
if [ -n "$GEMINI_API_KEY" ]; then
    ENV_VARS_EXTRA=",GEMINI_API_KEY=${GEMINI_API_KEY}"
fi

gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE_URL" \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --platform managed \
  --service-account "${SA_EMAIL}" \
  --min-instances 0 \
  --max-instances 10 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300s \
  --port 8080 \
  --set-env-vars "NODE_ENV=production,PORT=8080,PROJECT_ID=${PROJECT_ID},VITE_ALLOWED_DOMAINS=${ALLOWED_DOMAINS}${ENV_VARS_EXTRA}" \
  --allow-unauthenticated
```

> [!NOTE]
> Si la política de su organización bloquea `--allow-unauthenticated` (política `constraints/iam.allowedPolicyMemberDomains`), consulte el apartado de **Troubleshooting (Incidente 5)** para otorgar permisos a su dominio corporativo.

---

### Paso 10: Obtener la URL Asignada y Autorizar el Dominio en Firebase

Una vez finalizado el despliegue, obtenga la URL pública de su servicio:

```bash
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format="value(status.url)")
echo "=========================================================="
echo "🎉 URL PÚBLICA DE AEGIS-AI: $SERVICE_URL"
echo "=========================================================="
```

**Paso Obligatorio para OAuth de Google:**
1. Copie el dominio de Cloud Run sin `https://` (ej. `aegis-ai-607603788049.us-central1.run.app`).
2. Abra: **[Firebase Console > Authentication > Settings > Authorized domains](https://console.firebase.google.com/project/_/authentication/settings)**.
3. Haga clic en **"Add domain"** (Agregar dominio).
4. Pegue el dominio y presione **Guardar**.

---

### Paso 11: Verificación de Salud (Smoke Tests)

Compruebe que la plataforma esté respondiendo de inmediato:

```bash
# 1. Verificar endpoint de salud
curl -s "${SERVICE_URL}/api/health"
# Respuesta esperada: {"status":"ok"}

# 2. Verificar cabeceras de seguridad HTTP
curl -I "${SERVICE_URL}"
# Debe incluir: X-Content-Type-Options: nosniff, X-Frame-Options: SAMEORIGIN
```

---

## 4. Método Alternativo: Despliegue Automatizado en 1 Solo Paso

AegisAI incluye el script de orquestación `deploy_cloud_run.sh` que ejecuta automáticamente todos los pasos anteriores (1 al 10):

```bash
# 1. Dar permisos de ejecución
chmod +x deploy_cloud_run.sh

# 2. Ejecutar pasando el ID de su proyecto
./deploy_cloud_run.sh ID_DE_TU_PROYECTO_GCP
```

El script validará dependencias, habilitará las APIs, creará las cuentas de servicio, compilará el contenedor y desplegará en Cloud Run, imprimiendo al final la URL lista para usar.

---

## 5. Configuración Posterior al Despliegue

### 5.1 Configuración de Claves de IA desde la Interfaz Web
1. Abra la URL de su servicio en el navegador.
2. Inicie sesión con su cuenta de Google (o use el botón **"Modo Demo / Sandbox"**).
3. Diríjase a la vista de **Configuración / Administración** (icono de engranaje ⚙️ en el menú lateral).
4. En la pestaña **Google Gemini**, ingrese su API Key si no la configuró en el despliegue.
5. Pulse **"Probar Conexión"** para verificar latencia y modelo activo.

### 5.2 Configuración de Multi-Proveedor (Opcional)
Si su empresa prefiere enrutar peticiones a través de **OpenRouter**, **OpenAI** o un servidor local compatible con OpenAI (**vLLM**, **Ollama**, **LiteLLM**):
- Seleccione el proveedor en la pestaña correspondiente de Administración.
- Guarde la configuración. Se aplicará en caliente (**hot-reload**) sin reiniciar el contenedor.

---

## 6. Guía Forense de Solución de Problemas (Troubleshooting)

| Incidente | Causa Frecuente | Solución Rápida |
| :--- | :--- | :--- |
| **`PERMISSION_DENIED` en Cloud Storage al compilar** | La cuenta `{PROJECT_NUMBER}-compute@developer.gserviceaccount.com` no tiene permisos para escribir en el bucket de Cloud Build. | Ejecute:<br>`gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" --role="roles/storage.admin"` |
| **`auth/unauthorized-domain` al hacer login** | La URL de Cloud Run no está agregada en los Authorized Domains de Firebase Authentication. | Vaya a **Firebase Console > Authentication > Settings > Authorized domains** y agregue el dominio del servicio. |
| **`Identity Toolkit API has not been used`** | La API de Firebase Auth no se habilitó en el proyecto. | Ejecute:<br>`gcloud services enable identitytoolkit.googleapis.com --project="$PROJECT_ID"` |
| **`Container failed to start and listen on PORT=8080`** | Error en tiempo de ejecución de Node.js o falta de dependencias en el contenedor. | Verifique los logs con:<br>`gcloud run services logs read "$SERVICE_NAME" --region "$REGION" --limit 50` |
| **`FAILED_PRECONDITION: One or more users named in the policy do not belong to a permitted customer`** | La organización prohíbe `allUsers` por política organizacional (`iam.allowedPolicyMemberDomains`). | Asigne el rol al dominio corporativo:<br>`gcloud run services add-iam-policy-binding "$SERVICE_NAME" --member="domain:tuempresa.com" --role="roles/run.invoker" --region="$REGION"` |
| **`PERMISSION_DENIED` en Cloud Firestore** | La base de datos Firestore no ha sido creada en modo Nativo. | Ejecute el comando del Paso 5:<br>`gcloud firestore databases create --location="nam5" --type="firestore-native"` |

---

## 7. Mantenimiento, Actualizaciones y Monitoreo

### Actualizar a una Nueva Versión de AegisAI
Para desplegar parches o nuevas versiones de la plataforma con **Cero Tiempo de Inactividad (Zero-Downtime)**:

```bash
git pull origin main
./deploy_cloud_run.sh "$PROJECT_ID"
```

Cloud Run iniciará el nuevo contenedor, validará su disponibilidad mediante health checks y redirigirá el 100% del tráfico automáticamente.

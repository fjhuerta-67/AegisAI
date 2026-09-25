# AEGIS AI ASSURANCE PLATFORM
## Manual de Instalación y Despliegue en Producción
**Versión:** 2.5.0 Enterprise (Edición 2026)  
**Clasificación:** Guía Técnica de Infraestructura, Seguridad Cloud y DevOps  
**Plataformas Principales:** Google Cloud Platform (Cloud Run, Firestore Native, Vertex AI, Artifact Registry, Firebase Auth)  
**Plataformas Alternativas:** Docker Engine, Kubernetes, Servidores Linux Bare-Metal/VM  

---

## 1. Resumen Ejecutivo y Arquitectura de Despliegue

La plataforma **AegisAI** está diseñada bajo un paradigma **Cloud-Native Serverless** de alta resiliencia y escalabilidad elástica en Google Cloud Platform (GCP). Su arquitectura desacopla el cómputo de la persistencia de datos y el gobierno de identidades:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 CLIENTE WEB / AUDITOR                  │
                  │        (Navegador Chrome / Red Corporativa)            │
                  └───────────────────────────┬────────────────────────────┘
                                              │ HTTPS / TLS 1.3
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                   GOOGLE CLOUD RUN                     │
                  │                 Servicio: aegis-ai                     │
                  │   ┌────────────────────────────────────────────────┐   │
                  │   │        Container Runner (node:22-slim)         │   │
                  │   │  • Express REST & SSE Server (dist/server.cjs) │   │
                  │   │  • Frontend SPA Vite Assets (dist/)            │   │
                  │   │  • Motor de Auditoría AISVS 1.0 & ISO 42001    │   │
                  │   │  • Generador de Arquitecturas Remediadas       │   │
                  │   └───────────────┬─────────────────┬──────────────┘   │
                  └───────────────────┼─────────────────┼──────────────────┘
                                      │                 │
             Identidad de Ejecución   │                 │ Conexión IAM Nativa
               (aegis-runner-sa)      │                 │
                                      ▼                 ▼
          ┌───────────────────────────────┐ ┌───────────────────────────────┐
          │      CLOUD FIRESTORE NATIVO   │ │     GOOGLE VERTEX AI / GEMINI │
          │  • custom_frameworks/         │ │  • Modelos Gemini 2.5 / 3.x   │
          │  • audit_reports/             │ │  • Telemetría de Infraestructura│
          │  • Configuración y Catálogos  │ │  • Detección de Vulnerabilidades│
          └───────────────────────────────┘ └───────────────────────────────┘
```

---

## 2. Requisitos Previos y Herramientas

Para desplegar AegisAI en un proyecto corporativo de Google Cloud, el equipo de ingeniería debe contar con los siguientes elementos:

1. **Proyecto de Google Cloud**: Un proyecto activo con una cuenta de facturación (Cloud Billing) vinculada.
2. **Roles IAM Requeridos para el Desplegador**:
   - `roles/owner` o combinación de `roles/resourcemanager.projectIamAdmin`, `roles/run.admin`, `roles/artifactregistry.admin`, `roles/cloudbuild.builds.editor`, `roles/datastore.owner`.
3. **Google Cloud SDK (`gcloud` CLI)**:
   - Versión mínima: `gcloud >= 480.0.0`.
   - Se recomienda ejecutar el despliegue desde **Google Cloud Shell** (`https://shell.cloud.google.com`), el cual ya cuenta con `gcloud`, `docker`, `git` y `node` preconfigurados con autenticación nativa.
4. **Herramientas Locales (Opcional, si no se usa Cloud Shell)**:
   - `docker` >= 24.0.
   - `node` >= 20.10.0 y `npm` >= 10.0.0.

---

## 3. Método 1: Despliegue Rápido Automatizado (Recomendado)

AegisAI incluye el script de orquestación `deploy_cloud_run.sh` que automatiza la validación de dependencias, la habilitación de APIs, el aprovisionamiento de Service Accounts, la base de datos Firestore y la compilación del contenedor.

### Pasos de Ejecución:

1. Abra **Google Cloud Shell** o su terminal autenticada en GCP.
2. Clone el repositorio o diríjase a la carpeta del proyecto:
   ```bash
   git clone https://github.com/tu-organizacion/AegisAI.git
   cd AegisAI
   ```
3. Otorgue permisos de ejecución al script:
   ```bash
   chmod +x deploy_cloud_run.sh
   ```
4. Ejecute el script pasando el ID de su proyecto:
   ```bash
   ./deploy_cloud_run.sh ID_DE_TU_PROYECTO_GCP
   ```
5. El script ejecutará automáticamente las 12 fases de aprovisionamiento y devolverá la URL asignada:
   ```text
   🎉 ¡DESPLIEGUE EXITOSO EN GOOGLE CLOUD RUN!
   🔗 URL del Servicio Cloud Run: https://aegis-ai-xxxxx-uc.a.run.app
   ```

---

## 4. Método 2: Despliegue Manual Paso a Paso (Para DevOps y SysAdmins)

Si las políticas corporativas exigen que cada comando sea auditado o aprovisionado mediante pipelines CI/CD (Terraform, Cloud Build Triggers, Jenkins o GitHub Actions), siga este procedimiento secuencial:

### 4.1 Configurar el Contexto del Proyecto
```bash
export PROJECT_ID="your-gcp-project-id"
export REGION="us-central1"
export SERVICE_NAME="aegis-ai"
export REPO_NAME="cloud-run-source-deploy"

gcloud config set project "$PROJECT_ID"
```

### 4.2 Habilitar las 7 APIs Requeridas de Google Cloud
AegisAI interactúa con servicios de cómputo, IA, compilación y base de datos. Habilite las APIs indispensables:
```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com \
  --project="$PROJECT_ID"
```

### 4.3 Configuración de Permisos IAM del Pipeline de Compilación
Para que Cloud Build pueda almacenar fuentes y escribir imágenes en Artifact Registry sin errores de permisos:
```bash
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

# Asignar roles a Compute SA (utilizada por Cloud Build en entornos modernos)
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

# Asignar roles a Cloud Build Service Agent
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/cloudbuild.builds.builder" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/storage.admin" --quiet
```

### 4.4 Crear la Cuenta de Servicio de Ejecución (Runtime Service Account)
Por seguridad Zero-Trust, el contenedor en Cloud Run **no debe ejecutarse con la cuenta predeterminada de Compute**. Se crea una cuenta con mínimos privilegios:
```bash
SA_NAME="aegis-runner-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud iam service-accounts create "${SA_NAME}" \
  --description="Identidad de ejecucion para AegisAI Cloud Run" \
  --display-name="AegisAI Runner" \
  --project="$PROJECT_ID"

# Asignar roles de Vertex AI, lectura de telemetría y Firestore
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/viewer" --quiet

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/datastore.user" --quiet
```

### 4.5 Aprovisionar Cloud Firestore en Modo Nativo
AegisAI almacena catálogos regulatorios personalizados y reportes de auditoría en Firestore:
```bash
# Verificar o crear la base de datos en modo Nativo
gcloud firestore databases create \
  --location="nam5" \
  --type="firestore-native" \
  --project="$PROJECT_ID" --quiet || echo "Base de datos ya existe."
```

### 4.6 Configurar Firebase Authentication y Google Sign-In
Para que los usuarios inicien sesión de forma segura:

1. Ingrese a [Firebase Console](https://console.firebase.google.com/project/_/authentication/providers).
2. Seleccione su proyecto (`$PROJECT_ID`).
3. En la sección **Sign-in method** (Método de acceso), seleccione el proveedor **Google**:
   - Active el interruptor de habilitación.
   - Seleccione el correo de soporte corporativo del proyecto.
   - Haga clic en **Guardar**.
4. En [Firebase Console > Project Settings](https://console.firebase.google.com/project/_/settings/general), en la sección **Tus apps**, registre una app Web (`</>`) llamada `AegisAI`.
5. Guarde la configuración resultante en el archivo `firebase-applet-config.json`:
   ```json
   {
     "projectId": "your-gcp-project-id",
     "appId": "1:XXXXXXXXXX:web:XXXXXXXXXXXX",
     "apiKey": "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     "authDomain": "your-gcp-project-id.firebaseapp.com",
     "storageBucket": "your-gcp-project-id.firebasestorage.app",
     "messagingSenderId": "XXXXXXXXXX"
   }
   ```

### 4.7 Compilar la Imagen de Contenedor sin Capas Obsoletas
Asegúrese de compilar con la bandera `--no-cache` para garantizar que los artefactos TypeScript y Vite queden actualizados:
```bash
# 1. Crear repositorio en Artifact Registry si no existe
gcloud artifacts repositories create "$REPO_NAME" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Repositorio de imagenes AegisAI" \
  --project="$PROJECT_ID" --quiet || true

# 2. Compilar y subir la imagen
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

docker build --no-cache -t "$IMAGE_URL" .
docker push "$IMAGE_URL"
```
*(Si no dispone de Docker localmente, puede compilar directamente en la nube con: `gcloud builds submit --tag "$IMAGE_URL" .`)*.

### 4.8 Desplegar en Google Cloud Run
```bash
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
  --set-env-vars "NODE_ENV=production,PORT=8080,PROJECT_ID=${PROJECT_ID}" \
  --allow-unauthenticated
```

### 4.9 Registrar el Dominio Autorizado en Firebase
Una vez desplegado Cloud Run, obtenga la URL asignada:
```bash
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format="value(status.url)")
echo "URL asignada: $SERVICE_URL"
```
1. Vaya a [Firebase Console > Authentication > Settings > Authorized domains](https://console.firebase.google.com/project/_/authentication/settings).
2. Haga clic en **Add domain** (Agregar dominio).
3. Pegue el dominio de su servicio Cloud Run (ejemplo: `aegis-ai-607603788049.us-central1.run.app` o su dominio corporativo personalizado `aegisai.yourdomain.com`).

---

## 5. Control de Acceso y Filtro de Dominios Corporativos

AegisAI cuenta con una capa de control de acceso en frontend y backend:

- **Dominios Permitidos Configurable**: Puede definir los dominios permitidos mediante la variable de entorno `VITE_ALLOWED_DOMAINS` (por ejemplo `*` para permitir cualquier cuenta de Google, o `tu-empresa.com,aliado.com` para restringir a su organización).
- **Validación Criptográfica y de Acceso**:
  - En frontend, `Login.tsx` valida el dominio contra `VITE_ALLOWED_DOMAINS` al completar el flujo de Google OAuth.
  - En base de datos, `firestore.rules` comprueba que el usuario cuente con sesión válida y token firmado:
    ```javascript
    function isSignedIn() {
      return request.auth != null;
    }
    ```
- Si un usuario inicia sesión con una cuenta no autorizada, será notificado con la alerta: `Acceso Denegado: La cuenta no pertenece a los dominios autorizados`.

---

## 6. Verificación Operativa y Pruebas de Humo (Smoke Tests)

Una vez completado el despliegue, verifique el correcto funcionamiento del servicio:

### 1. Comprobación del Endpoint de Salud
```bash
curl -I "${SERVICE_URL}/api/health"
```
*Respuesta esperada:*
```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{"status":"ok"}
```

### 2. Comprobación de Cabeceras de Seguridad HTTP
```bash
curl -I "${SERVICE_URL}"
```
*Verifique la presencia de las cabeceras corporativas:*
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 3. Suite Automatizada de Pruebas de Integración
Desde la raíz del repositorio, puede ejecutar:
```bash
npm run test:integration
npm run test:gcp
npm run test:security
```
Todas las pruebas deben concluir con código de salida `0`.

---

## 7. Guía Forense de Solución de Problemas (Troubleshooting)

Esta sección documenta los incidentes más frecuentes encontrados en despliegues empresariales de GCP y su resolución paso a paso:

---

### Incidente 1: `PERMISSION_DENIED` en Cloud Storage durante Cloud Build
* **Síntoma:** Al ejecutar `gcloud run deploy --source .` o `gcloud builds submit`, la terminal muestra:
  ```text
  ERROR: (gcloud.run.deploy) PERMISSION_DENIED: Build failed because the default service account is missing required IAM permissions...
  could not resolve source: Get "https://storage.googleapis.com/...": Access denied.
  ```
* **Causa:** La cuenta de servicio predeterminada de Compute (`{PROJECT_NUMBER}-compute@developer.gserviceaccount.com`) carece del rol de administrador de almacenamiento en el bucket de staging de Cloud Build.
* **Solución:**
  ```bash
  PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/storage.admin"
  ```

---

### Incidente 2: `Firebase: Error (auth/the-service-is-currently-unavailable.)`
* **Síntoma:** Al hacer clic en "Iniciar sesión con Google", la interfaz muestra un error rojo de servicio no disponible.
* **Causa:** 
  1. La API **Identity Toolkit** (`identitytoolkit.googleapis.com`) no está habilitada en el proyecto de GCP.
  2. El archivo `firebase-applet-config.json` contiene llaves o identificadores de un proyecto sandbox antiguo que fue dado de baja.
* **Solución:**
  ```bash
  # 1. Habilitar la API
  gcloud services enable identitytoolkit.googleapis.com --project="$PROJECT_ID"

  # 2. Regenerar firebase-applet-config.json con los valores del proyecto activo
  npx -y firebase-tools apps:sdkconfig WEB --project="$PROJECT_ID"
  ```

---

### Incidente 3: `auth/unauthorized-domain` (Dominio no registrado)
* **Síntoma:** Al intentar autenticarse, aparece el mensaje:
  ```text
  El dominio de esta instancia aún no está registrado en los "Authorized Domains" de Firebase Authentication.
  ```
* **Causa:** El dominio generado por Cloud Run (`*.run.app`) no ha sido agregado a la lista blanca de OAuth en Firebase Authentication.
* **Solución:**
  1. Copie el dominio de Cloud Run sin protocolo (ejemplo: `aegis-ai-607603788049.us-central1.run.app`).
  2. Ingrese a **Firebase Console > Authentication > Settings > Authorized domains**.
  3. Haga clic en **Add domain**, pegue el valor y guarde.

---

### Incidente 4: `The user-provided container failed to start and listen on PORT=8080`
* **Síntoma:** El despliegue falla en la fase `Creating Revision...failed` y los registros del contenedor reportan `Container called exit(1)`.
* **Causa:** 
  1. En la etapa de producción del Dockerfile faltaba copiar `firebase-applet-config.json` o la carpeta `/config`.
  2. Se importaron dependencias de desarrollo (`dotenv/config` o `vite`) de forma estática en el servidor de producción.
* **Solución:**
  1. Verifique que `Dockerfile` contenga: `COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json`.
  2. Recompile obligando a Docker a no usar capas viejas en caché:
     ```bash
     docker build --no-cache -t "$IMAGE_URL" .
     docker push "$IMAGE_URL"
     ```

---

### Incidente 5: `FAILED_PRECONDITION: One or more users named in the policy do not belong to a permitted customer`
* **Síntoma:** Al asignar `allUsers` o un dominio externo, `gcloud` arroja un error de violación de política organizacional.
* **Causa:** En organizaciones con la política *Domain Restricted Sharing* (`constraints/iam.allowedPolicyMemberDomains`), está bloqueado otorgar permisos a cuentas anónimas o ajenas a la organización.
* **Solución:**
  Asigne el rol de invocador al dominio corporativo en lugar de `allUsers`:
  ```bash
  gcloud run services add-iam-policy-binding "$SERVICE_NAME" \
    --project "$PROJECT_ID" \
    --region "$REGION" \
    --member="domain:yourdomain.com" \
    --role="roles/run.invoker"
  ```

---

### Incidente 6: Error `403 Forbidden` al invocar `/api/evaluate` vía Firebase Hosting
* **Síntoma:** La página principal carga, pero al subir un archivo para evaluación la llamada a `/api/evaluate` falla con `403 Forbidden: Your client does not have permission to get URL /api/evaluate from this server`.
* **Causa:** Los rewrites de Firebase Hosting hacia Cloud Run solo transmiten peticiones a servicios públicos (`allUsers`). Si Cloud Run es privado, Firebase Hosting no inyecta tokens de identidad OIDC y la petición es denegada por Cloud IAM.
* **Solución:**
  Acceda al servicio directamente a través de la URL de Cloud Run (`https://<service>-<hash>-<region>.a.run.app`) o configure un **External Application Load Balancer con Cloud Run Backend** y certificados SSL corporativos.

---

## 8. Mantenimiento y Actualizaciones

Para desplegar nuevas versiones o actualizaciones de catálogos normativos:

```bash
# 1. Obtener los cambios del repositorio
git pull origin main

# 2. Validar tipos y ejecutar pruebas
npm run lint
npm run test:integration

# 3. Recompilar y desplegar nueva revisión
./deploy_cloud_run.sh "$PROJECT_ID"
```
Cloud Run gestionará la migración de tráfico de forma instantánea (**Zero-Downtime Deployment**) sin interrumpir las sesiones activas de los auditores.

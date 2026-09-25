#!/usr/bin/env bash
# ==============================================================================
# Script Integral y Automatizado de Aprovisionamiento y Despliegue en Google Cloud
# Plataforma: AegisAI (Auditor Técnico AISVS 1.0, ISO/IEC 42001, LFPDPPP, LFPC)
# Arquitectura Serverless Google Cloud Run + Firebase Firestore + Vertex AI
# ==============================================================================
set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BLUE}${BOLD}"
echo "======================================================================"
echo "  🚀 DESPLIEGUE EN GOOGLE CLOUD: AEGIS-AI"
echo "  Auditor Técnico de Seguridad en IA (AISVS 1.0 & ISO/IEC 42001)"
echo "======================================================================"
echo -e "${NC}"

# 1. Verificar herramienta gcloud
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: 'gcloud' no está instalado o no se encuentra en el PATH.${NC}"
    echo -e "${YELLOW}👉 Te recomendamos ejecutar este script directamente en Google Cloud Shell:${NC}"
    echo "   https://shell.cloud.google.com"
    exit 1
fi

# 2. Obtener o solicitar PROJECT_ID
PROJECT_ID="${1:-$PROJECT_ID}"
if [ -z "$PROJECT_ID" ]; then
    CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
    if [ -n "$CURRENT_PROJECT" ]; then
        read -p "ID del Proyecto Google Cloud [$CURRENT_PROJECT]: " INPUT_PROJECT
        PROJECT_ID="${INPUT_PROJECT:-$CURRENT_PROJECT}"
    else
        read -p "Ingresa el ID del Proyecto Google Cloud: " PROJECT_ID
    fi
fi

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: El ID del proyecto de Google Cloud es obligatorio.${NC}"
    exit 1
fi

REGION="${REGION:-us-central1}"
SERVICE_NAME="${SERVICE_NAME:-aegis-ai}"
ALLOWED_DOMAINS="${ALLOWED_DOMAINS:-*}"

echo -e "\n${BLUE}📋 Parámetros de Despliegue:${NC}"
echo "   • Proyecto: ${BOLD}$PROJECT_ID${NC}"
echo "   • Región:   ${BOLD}$REGION${NC}"
echo "   • Servicio: ${BOLD}$SERVICE_NAME${NC}"
echo "   • Dominios: ${BOLD}$ALLOWED_DOMAINS${NC}"

# 3. Configurar contexto en gcloud
echo -e "\n${YELLOW}⚙️  Configurando contexto en gcloud...${NC}"
gcloud config set project "$PROJECT_ID"

# 4. Habilitar APIs indispensables en Google Cloud
echo -e "\n${YELLOW}🔌 Habilitando APIs requeridas de Google Cloud (Run, Build, Artifact Registry, Vertex AI, Firestore, Firebase, Identity Toolkit)...${NC}"
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  firestore.googleapis.com \
  firebase.googleapis.com \
  identitytoolkit.googleapis.com \
  --project="$PROJECT_ID"

# 5. Obtener Número de Proyecto y Configurar Permisos IAM de Cloud Build
echo -e "\n${YELLOW}🔑 Configurando permisos IAM para el pipeline de compilación (Cloud Build & Storage)...${NC}"
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format="value(projectNumber)")
COMPUTE_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"
CLOUDBUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "   • Proyecto #${PROJECT_NUMBER}"
echo "   • Asignando roles Cloud Build, Storage y Artifact Registry a la Compute SA: ${COMPUTE_SA}..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/cloudbuild.builds.builder" --condition=None --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/storage.admin" --condition=None --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/logging.logWriter" --condition=None --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/artifactregistry.admin" --condition=None --quiet >/dev/null 2>&1 || true

echo "   • Asignando permisos a Cloud Build SA: ${CLOUDBUILD_SA}..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/cloudbuild.builds.builder" --condition=None --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/storage.admin" --condition=None --quiet >/dev/null 2>&1 || true

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUDBUILD_SA}" \
  --role="roles/logging.logWriter" --condition=None --quiet >/dev/null 2>&1 || true

# 6. Crear cuenta de servicio de ejecución dedicada (Runtime Service Account)
SA_NAME="aegis-runner-sa"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo -e "\n${YELLOW}👤 Configurando Identidad de Ejecución (Service Account: ${SA_NAME})...${NC}"
if ! gcloud iam service-accounts describe "${SA_EMAIL}" --project="$PROJECT_ID" &>/dev/null; then
    echo "   Creando cuenta de servicio ${SA_EMAIL}..."
    gcloud iam service-accounts create "${SA_NAME}" \
      --description="Identidad de ejecucion para AegisAI Cloud Run" \
      --display-name="AegisAI Runner" \
      --project="$PROJECT_ID"
else
    echo "   Cuenta de servicio ${SA_EMAIL} ya existe."
fi

# Asignar roles necesarios para Vertex AI, Firestore y telemetría
echo "   Asignando roles Vertex AI, Firestore y Viewer a la Service Account..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/aiplatform.user" --condition=None --quiet >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/viewer" --condition=None --quiet >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/datastore.user" --condition=None --quiet >/dev/null

# 7. Aprovisionar Cloud Firestore en Modo Nativo si no existe
echo -e "\n${YELLOW}🗄️  Verificando base de datos Cloud Firestore...${NC}"
if ! gcloud firestore databases list --project="$PROJECT_ID" --format="value(name)" 2>/dev/null | grep -q "(default)"; then
    echo "   Creando base de datos Firestore (default) en modo Nativo..."
    gcloud firestore databases create \
      --location="nam5" \
      --type="firestore-native" \
      --project="$PROJECT_ID" --quiet || echo "   (Base de datos Firestore ya inicializada o en proceso)"
else
    echo "   Base de datos Firestore (default) activa y lista."
fi

# 8. Verificar y configurar firebase-applet-config.json
echo -e "\n${YELLOW}⚙️  Verificando configuración de cliente Firebase (firebase-applet-config.json)...${NC}"
CONFIG_FILE="firebase-applet-config.json"
CURRENT_CFG_PROJECT=$(grep '"projectId"' "$CONFIG_FILE" 2>/dev/null | sed -E 's/.*"projectId": *"([^"]+)".*/\1/' || echo "")

if [ "$CURRENT_CFG_PROJECT" != "$PROJECT_ID" ]; then
    echo "   Actualizando projectId en $CONFIG_FILE hacia $PROJECT_ID..."
    cat << CFG_EOF > "$CONFIG_FILE"
{
  "projectId": "${PROJECT_ID}",
  "appId": "1:${PROJECT_NUMBER}:web:aegisai-${PROJECT_ID}",
  "apiKey": "${FIREBASE_API_KEY:-AIzaSyAegisAIEnterpriseKeyFallback}",
  "authDomain": "${PROJECT_ID}.firebaseapp.com",
  "storageBucket": "${PROJECT_ID}.firebasestorage.app",
  "messagingSenderId": "${PROJECT_NUMBER}"
}
CFG_EOF
fi

# 9. Crear repositorio en Artifact Registry si no existe
REPO_NAME="cloud-run-source-deploy"
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    echo "   Creando repositorio Artifact Registry: ${REPO_NAME} en ${REGION}..."
    gcloud artifacts repositories create "$REPO_NAME" \
      --repository-format=docker \
      --location="$REGION" \
      --description="Repositorio para imagenes de contenedor de Cloud Run" \
      --project="$PROJECT_ID" --quiet || true
fi

# 10. Compilar imagen de contenedor limpia sin capas rotas
IMAGE_URL="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
echo -e "\n${YELLOW}📦 Compilando imagen de contenedor limpia (--no-cache)...${NC}"
echo "   Destino: ${IMAGE_URL}"

if command -v docker &>/dev/null; then
    echo "   Compilando localmente con Docker..."
    docker build --no-cache -t "$IMAGE_URL" .
    echo "   Subiendo imagen a Artifact Registry..."
    docker push "$IMAGE_URL"
else
    echo "   Docker local no detectado. Utilizando Google Cloud Build para compilar en la nube..."
    gcloud builds submit --tag "$IMAGE_URL" --project="$PROJECT_ID" .
fi

# 11. Desplegar contenedor a Google Cloud Run
echo -e "\n${YELLOW}🚀 Desplegando servicio en Google Cloud Run...${NC}"
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
  --allow-unauthenticated || {
    echo -e "${YELLOW}⚠️  Nota de IAM: Si la organización restringe 'allUsers', asignando permisos...${NC}"
    if [ "$ALLOWED_DOMAINS" != "*" ]; then
      IFS=',' read -ra DOMAINS <<< "$ALLOWED_DOMAINS"
      for d in "${DOMAINS[@]}"; do
        d_clean=$(echo "$d" | sed -e 's/@//g' -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')
        gcloud run services add-iam-policy-binding "$SERVICE_NAME" \
          --project "$PROJECT_ID" \
          --region "$REGION" \
          --member="domain:${d_clean}" \
          --role="roles/run.invoker" 2>/dev/null || true
      done
    fi
  }

# 12. Obtener URL pública asignada
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --project "$PROJECT_ID" --region "$REGION" --format="value(status.url)")

echo -e "\n${GREEN}${BOLD}======================================================================${NC}"
echo -e "${GREEN}${BOLD}🎉 ¡DESPLIEGUE EXITOSO EN GOOGLE CLOUD RUN!${NC}"
echo -e "${GREEN}${BOLD}======================================================================${NC}"
echo -e "🔗 URL del Servicio Cloud Run: ${BOLD}${SERVICE_URL}${NC}"
echo ""
echo -e "${YELLOW}${BOLD}⚠️  PASOS FINALES DE CONFIGURACIÓN (1 MINUTO EN FIREBASE CONSOLE):${NC}"
echo "1. Ve a Firebase Console: https://console.firebase.google.com/project/${PROJECT_ID}/authentication/settings"
echo "2. En la pestaña 'Sign-in method' (Método de acceso):"
echo "   • Habilita el proveedor 'Google', selecciona tu email de soporte y haz clic en Guardar."
echo "3. En la pestaña 'Settings' > 'Authorized domains' (Dominios autorizados):"
DOM_ONLY=$(echo "$SERVICE_URL" | sed -e 's|^[^/]*//||' -e 's|/.*$||')
echo -e "   • Haz clic en 'Add domain' y agrega: 👉 ${BOLD}${DOM_ONLY}${NC}"
echo ""
echo -e "🔒 ${BOLD}Seguridad de Acceso:${NC} Dominios permitidos: ${BOLD}${ALLOWED_DOMAINS}${NC}"
echo -e "${GREEN}======================================================================${NC}\n"

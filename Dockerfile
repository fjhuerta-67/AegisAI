# =====================================================================
# ETAPA 1: Construcción (Builder)
# =====================================================================
FROM node:22-slim AS builder

WORKDIR /app

# Instalar dependencias (deterministas, a partir de package-lock.json)
COPY package*.json ./
RUN npm ci

# Copiar código fuente y archivos de configuración
COPY . .

# Configuración de compilación del frontend (Vite la incrusta en el bundle):
# - VITE_ALLOWED_DOMAINS: dominios de correo autorizados para iniciar sesión (coincidencia exacta), o '*'.
# - VITE_ENABLE_DEMO_MODE: 'true' muestra el botón de Modo Demo (omite el inicio de sesión). Desactivado por defecto.
ARG VITE_ALLOWED_DOMAINS="*"
ARG VITE_ENABLE_DEMO_MODE="false"
ENV VITE_ALLOWED_DOMAINS=${VITE_ALLOWED_DOMAINS} \
    VITE_ENABLE_DEMO_MODE=${VITE_ENABLE_DEMO_MODE}

# Validar TypeScript y compilar frontend (Vite) + backend (esbuild)
RUN npm run lint && npm run build

# =====================================================================
# ETAPA 2: Runtime Seguro de Producción Serverless (Runner)
# =====================================================================
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Crear usuario y grupo de sistema sin privilegios root (Debian/Linux estándar)
RUN groupadd -r aegisgroup && useradd -r -g aegisgroup aegisuser

# Instalar únicamente dependencias de producción
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar artefactos compilados, catálogos normativos y manuales desde la etapa builder.
# firebase-applet-config*.json: el servidor usa el .local.json si existe (misma configuración que el frontend).
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/docs/manuales_pdf ./docs/manuales_pdf
COPY --from=builder /app/firebase-applet-config*.json ./
# Contexto normativo (OWASP AISVS / ISO 42001) que el motor de auditoría carga al arrancar.
COPY --from=builder /app/owasp-aisvs-context.md /app/iso-42001-context.md ./

# OWASP AISVS C04.1: Todo el árbol /app (código, node_modules y catálogos base) queda
# estrictamente de solo lectura (inmutable) para el usuario sin privilegios aegisuser.
# Las configuraciones dinámicas y marcos personalizados se persisten en Cloud Firestore
# (con caché efímero en memoria /tmp montado como tmpfs).
RUN chmod -R a-w /app

USER aegisuser

EXPOSE 8080

# Parámetro IPv4 first recomendado para resolución DNS rápida de Google Cloud APIs
CMD ["node", "--dns-result-order=ipv4first", "dist/server.cjs"]

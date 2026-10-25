# =====================================================================
# ETAPA 1: Construcción (Builder)
# =====================================================================
FROM node:22-slim AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci || npm install

# Copiar código fuente y archivos de configuración
COPY . .

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
RUN (npm ci --omit=dev || npm install --omit=dev) && npm cache clean --force

# Copiar artefactos compilados y catálogos normativos desde la etapa builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/firebase-applet-config.json ./firebase-applet-config.json

# Asignar permisos al usuario sin privilegios
RUN chown -R aegisuser:aegisgroup /app

USER aegisuser

EXPOSE 8080

# Parámetro IPv4 first recomendado para resolución DNS rápida de Google Cloud APIs
CMD ["node", "--dns-result-order=ipv4first", "dist/server.cjs"]

#!/usr/bin/env python3
"""Genera el libro Excel interactivo del Inventario de Datos, Diccionarios, Flujos y Repositorios de AegisAI.

Produce:
  docs/architecture/AegisAI_Inventario_Datos_y_Diccionario.xlsx

Contiene 5 hojas en español:
  1. Tabla_Dinamica_y_Buscador  - Buscador interactivo multicriterio + 4 Tablas Dinámicas en vivo (COUNTIFS) + Resultados filtrados
  2. Tabla_Dinamica_Nativa      - Tabla Dinámica nativa de Excel (OOXML PivotTable + PivotCache) conectada a Inventario_Maestro_Datos
  3. Inventario_Maestro_Datos   - Diccionario de datos completo con 135 atributos documentados (Tabla Excel con autofiltros)
  4. Catalogo_Repositorios      - Inventario detallado de los 20 repositorios disponibles en las 5 capas de persistencia
  5. Flujos_Informacion         - Matriz técnica de los 18 flujos de información end-to-end y endpoints API/SSE
"""
from __future__ import annotations

import shutil
import tempfile
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape as xml_escape

import xlsxwriter

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
OUT_PATH = REPO / "docs" / "architecture" / "AegisAI_Inventario_Datos_y_Diccionario.xlsx"


# --------------------------------------------------------------------------------------
# 1. Datos Maestros del Diccionario de Datos (135 Atributos en 20 Esquemas/Entidades)
# --------------------------------------------------------------------------------------
# Columnas:
#  0: ID_Atributo
#  1: Dominio_Datos
#  2: Entidad_Diccionario
#  3: Campo_Atributo
#  4: Tipo_Dato (string | number | boolean | enum | array/list | object/map)
#  5: Tipo_Detallado_TS
#  6: Llave_Rol (PK (Llave Primaria) | FK (Llave Foránea) | Índice / Filtro | Atributo)
#  7: Obligatorio (Obligatorio | Opcional)
#  8: Inmutable_WORM (Sí (Inmutable) | No (Actualizable))
#  9: Restriccion_Validacion
# 10: Clasificacion_Sensibilidad
# 11: Contiene_PII (Sí (PII) | No)
# 12: Capa_Almacenamiento
# 13: Repositorio_Coleccion
# 14: Flujo_Principal
# 15: Descripcion_Funcional_y_Normativa

CAPA_1 = "1. Cloud Firestore (NoSQL nam5)"
CAPA_2 = "2. Sistema de Archivos Local (/app/config R/O)"
CAPA_3 = "3. Caché Efímero (/tmp/aegis-runtime-cache)"
CAPA_4 = "4. Catálogos Estáticos (Bundle TS/MD)"
CAPA_5 = "5. Memoria RAM (V8 Heap) / Cloud GCP"

DOM_AUDIT = "1. Auditorías y Dictámenes"
DOM_CAT   = "2. Catálogos Normativos"
DOM_BYOF  = "3. Marcos BYOF e Integridad"
DOM_API   = "4. Seguridad API y Trabajos Asíncronos"
DOM_CFG   = "5. Configuración Multi-LLM y Plataformas"
DOM_GCP   = "6. Telemetría Cloud GCP en Vivo"
DOM_SEC   = "7. Alertas SOC e Identidad Zero-Trust"
DOM_RAM   = "8. Telemetría AIMS y Cuotas RAM"

CL_PII  = "PII (Dato Personal)"
CL_SEC  = "Secreto / Credencial"
CL_CONF = "Confidencial"
CL_FOR  = "Forense / Seguridad"
CL_PUB  = "Público / Catálogo"
CL_INT  = "Interno / Operativo"
CL_TEL  = "Telemetría / FinOps"


RAW_ATTRIBUTES: list[tuple[str, ...]] = [
    # ==================== ENTIDAD 1: AuditReport (/audits/{auditId}) ====================
    (DOM_AUDIT, "AuditReport", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "size: 1..128; id == resource.data.id en updates", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-08 · Persistencia Dual + Saga",
     "Identificador único global del dictamen de auditoría; inmutable tras su creación (firestore.rules)."),
    (DOM_AUDIT, "AuditReport", "date", "string", "string (ISO-8601)", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "size: 1..100; formato UTC ISO-8601", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-08 · Persistencia Dual + Saga",
     "Fecha y hora exacta en que se emitió el dictamen de cumplimiento de IA."),
    (DOM_AUDIT, "AuditReport", "systemName", "string", "string", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "size: 1..500 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Nombre del sistema, agente o plataforma de IA evaluada."),
    (DOM_AUDIT, "AuditReport", "technicalLead", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 200 chars", CL_PII, "Sí (PII)", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Nombre completo del líder técnico o arquitecto responsable del sistema auditado (Dato Personal PII)."),
    (DOM_AUDIT, "AuditReport", "email", "string", "string (Email)", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "size <= 200 chars; formato email", CL_PII, "Sí (PII)", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Correo electrónico de contacto del responsable técnico para notificaciones y seguimiento (PII)."),
    (DOM_AUDIT, "AuditReport", "description", "string", "string (Markdown)", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 100,000 chars", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Descripción arquitectónica consolidada y texto extraído de documentos adjuntos (.pdf, .zip, .md)."),
    (DOM_AUDIT, "AuditReport", "overallScore", "number", "number (0..100)", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "0 <= overallScore <= 100", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Calificación porcentual ponderada global de cumplimiento normativo."),
    (DOM_AUDIT, "AuditReport", "executiveSummary", "string", "string (Markdown)", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 100,000 chars", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Síntesis ejecutiva generada por IA con postura de riesgo, brechas críticas y veredicto general."),
    (DOM_AUDIT, "AuditReport", "chapters", "array/list", "AISVSChapter[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "list size <= 500 elementos", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Lista estructurada de capítulos normativos evaluados con sus controles y veredictos."),
    (DOM_AUDIT, "AuditReport", "standard", "enum", "'AI-SVS'|'ISO-42001'|'FULL'|'CUSTOM'|'MULTI'", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "size <= 100 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Identificador del estándar primario o modo multi-estándar utilizado en la auditoría."),
    (DOM_AUDIT, "AuditReport", "standards", "array/list", "string[]", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "list size <= 20 elementos", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Arreglo de identificadores de todas las normativas evaluadas simultáneamente."),
    (DOM_AUDIT, "AuditReport", "standardsBreakdown", "array/list", "StandardBreakdown[]", "Atributo", "Opcional", "No (Actualizable)",
     "list size <= 20 elementos", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Desglose cuantitativo de cumplimiento por cada marco normativo individual."),
    (DOM_AUDIT, "AuditReport", "customFrameworkId", "string", "string", "FK (Llave Foránea)", "Opcional", "No (Actualizable)",
     "size <= 200 chars -> /custom_frameworks/{id}", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-05 · Catálogos y BYOF SHA-256",
     "Llave foránea hacia el marco regulatorio personalizado (BYOF) empleado en la evaluación."),
    (DOM_AUDIT, "AuditReport", "customFrameworkName", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 500 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-05 · Catálogos y BYOF SHA-256",
     "Nombre descriptivo del marco personalizado al momento de ejecutar la auditoría."),
    (DOM_AUDIT, "AuditReport", "targetLevel", "enum", "'AUTO' | 'L1' | 'L2' | 'L3'", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 20 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Nivel de madurez objetivo solicitado por el arquitecto antes de la evaluación."),
    (DOM_AUDIT, "AuditReport", "assessedLevel", "enum", "'L1' | 'L2' | 'L3'", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "size <= 20 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Nivel de aseguramiento real determinado por el motor Map-Reduce según el perfil de riesgo."),
    (DOM_AUDIT, "AuditReport", "levelAssessmentRationale", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 20,000 chars", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Justificación técnica de por qué el sistema fue clasificado en el nivel L1, L2 o L3."),
    (DOM_AUDIT, "AuditReport", "techPlatform", "string", "string", "FK (Llave Foránea)", "Opcional", "No (Actualizable)",
     "size <= 100 chars -> PLATFORM_PROFILES[key]", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Clave de la plataforma tecnológica subyacente (gcp_vertex_ai, gemini_api, aws_bedrock, etc.)."),
    (DOM_AUDIT, "AuditReport", "techPlatformName", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 200 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Nombre comercial de la plataforma cloud/IA para visualización en reportes."),
    (DOM_AUDIT, "AuditReport", "deploymentType", "enum", "'SaaS' | 'PaaS' | 'Self-Hosted' | 'Hybrid'", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "size <= 50 chars", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-01 · Ingesta Multimodal",
     "Modelo de despliegue utilizado para calcular el modelo de responsabilidad compartida."),
    (DOM_AUDIT, "AuditReport", "remediatedArchitectureDoc", "string", "string (Markdown)", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 200,000 chars", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-07 · Síntesis de Remediación",
     "Documento completo de Arquitectura Remediada al 100% generado tras cerrar todas las brechas."),
    (DOM_AUDIT, "AuditReport", "isLiveGcpScan", "boolean", "boolean", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "type == bool", CL_INT, "No", CAPA_1, "/audits/{auditId}", "F-04 · Escaneo GCP en Vivo",
     "Indica si el dictamen fue generado a partir de una inspección en vivo de Google Cloud Platform."),
    (DOM_AUDIT, "AuditReport", "gcpProjectId", "string", "string", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "size <= 200 chars", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-04 · Escaneo GCP en Vivo",
     "ID del proyecto GCP inspeccionado por el escáner Zero-Footprint."),
    (DOM_AUDIT, "AuditReport", "gcpTelemetry", "object/map", "GCPScanTelemetry", "Atributo", "Opcional", "No (Actualizable)",
     "map estructurado", CL_CONF, "No", CAPA_1, "/audits/{auditId}", "F-04 · Escaneo GCP en Vivo",
     "Objeto anidado con el inventario completo de activos cloud y hallazgos de seguridad GCP."),
    (DOM_AUDIT, "AuditReport", "ownerUid", "string", "string", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "size <= 128 chars; inmutable en updates", CL_FOR, "No", CAPA_1, "/audits/{auditId}", "F-02 · Identidad Zero-Trust",
     "UID de Firebase Auth o identificador IAP del usuario propietario del dictamen (RBAC)."),
    (DOM_AUDIT, "AuditReport", "ownerEmail", "string", "string (Email)", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "size <= 200 chars; inmutable en updates", CL_PII, "Sí (PII)", CAPA_1, "/audits/{auditId}", "F-02 · Identidad Zero-Trust",
     "Correo verificado del propietario del registro para control de acceso e historial forense (PII)."),
    (DOM_AUDIT, "AuditReport", "tenantDomain", "string", "string (Domain)", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "size <= 100 chars; inmutable en updates", CL_FOR, "No", CAPA_1, "/audits/{auditId}", "F-02 · Identidad Zero-Trust",
     "Dominio empresarial (ej. google.com) asociado al dictamen para aislamiento multi-tenant (C08.1)."),
    (DOM_AUDIT, "AuditReport", "modelUsed", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "size <= 200 chars", CL_TEL, "No", CAPA_1, "/audits/{auditId}", "F-06 · Motor Map-Reduce IA",
     "Identificador exacto del modelo LLM que ejecutó la evaluación (ej. gemini-3.8-flash)."),
    (DOM_AUDIT, "AuditReport", "latencyMs", "number", "number (ms)", "Atributo", "Opcional", "No (Actualizable)",
     "0 <= latencyMs <= 3,600,000", CL_TEL, "No", CAPA_1, "/audits/{auditId}", "F-10 · Telemetría AIMS y SIEM",
     "Tiempo total de ejecución de la auditoría en milisegundos para monitoreo de SLOs."),
    (DOM_AUDIT, "AuditReport", "promptTokens", "number", "number", "Atributo", "Opcional", "No (Actualizable)",
     "0 <= promptTokens <= 100,000,000", CL_TEL, "No", CAPA_1, "/audits/{auditId}", "F-10 · Telemetría AIMS y SIEM",
     "Total de tokens de entrada consumidos en todos los lotes Map-Reduce (FinOps)."),
    (DOM_AUDIT, "AuditReport", "completionTokens", "number", "number", "Atributo", "Opcional", "No (Actualizable)",
     "0 <= completionTokens <= 100,000,000", CL_TEL, "No", CAPA_1, "/audits/{auditId}", "F-10 · Telemetría AIMS y SIEM",
     "Total de tokens de salida generados por el proveedor LLM (FinOps)."),

    # ==================== ENTIDAD 2: StandardBreakdown (Anidado en AuditReport) ====================
    (DOM_AUDIT, "StandardBreakdown", "standardId", "string", "string", "PK (Llave Primaria)", "Obligatorio", "No (Actualizable)",
     "Identificador de marco en desglose", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "ID del estándar dentro del resumen multi-normativo (AI-SVS, ISO-42001, fw-*)."),
    (DOM_AUDIT, "StandardBreakdown", "standardName", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Nombre legible del estándar", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "Nombre completo de la normativa evaluada en el desglose."),
    (DOM_AUDIT, "StandardBreakdown", "score", "number", "number (0..100)", "Atributo", "Obligatorio", "No (Actualizable)",
     "0 <= score <= 100", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "Puntaje porcentual obtenido específicamente en este marco regulatorio."),
    (DOM_AUDIT, "StandardBreakdown", "totalControls", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Entero >= 1", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "Total de controles aplicables evaluados dentro de este estándar."),
    (DOM_AUDIT, "StandardBreakdown", "passed", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Entero >= 0", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "Cantidad de controles con veredicto 'Aprobado' en este estándar."),
    (DOM_AUDIT, "StandardBreakdown", "failed", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Entero >= 0", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "Cantidad de controles con veredicto 'Fallido' en este estándar."),
    (DOM_AUDIT, "StandardBreakdown", "missingEvidence", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Entero >= 0", CL_INT, "No", CAPA_1, "/audits/{auditId} (standardsBreakdown[])", "F-06 · Motor Map-Reduce IA",
     "Cantidad de controles con veredicto 'Falta Evidencia' en este estándar."),

    # ==================== ENTIDAD 3: AISVSChapter (Anidado en AuditReport.chapters[]) ====================
    (DOM_AUDIT, "AISVSChapter", "chapterId", "string", "string", "PK (Llave Primaria)", "Obligatorio", "No (Actualizable)",
     "ej. C1..C12, ISO-4..ISO-A", CL_INT, "No", CAPA_1, "/audits/{auditId} (chapters[])", "F-06 · Motor Map-Reduce IA",
     "Identificador del capítulo evaluado dentro del dictamen."),
    (DOM_AUDIT, "AISVSChapter", "chapterName", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "1..200 chars", CL_INT, "No", CAPA_1, "/audits/{auditId} (chapters[])", "F-06 · Motor Map-Reduce IA",
     "Nombre del dominio o cláusula normativa evaluada."),
    (DOM_AUDIT, "AISVSChapter", "puntosProbados", "array/list", "PuntoProbado[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "Lista no vacía de controles evaluados", CL_CONF, "No", CAPA_1, "/audits/{auditId} (chapters[])", "F-06 · Motor Map-Reduce IA",
     "Arreglo de controles individuales inspeccionados con su evidencia y remediación."),
    (DOM_AUDIT, "AISVSChapter", "remediated", "boolean", "boolean", "Atributo", "Opcional", "No (Actualizable)",
     "true tras remediación en UI", CL_INT, "No", CAPA_1, "/audits/{auditId} (chapters[])", "F-07 · Síntesis de Remediación",
     "Bandera que indica si las brechas del capítulo ya fueron remediadas e integradas."),
    (DOM_AUDIT, "AISVSChapter", "standardId", "string", "string", "FK (Llave Foránea)", "Opcional", "No (Actualizable)",
     "Referencia al marco origen", CL_INT, "No", CAPA_1, "/audits/{auditId} (chapters[])", "F-06 · Motor Map-Reduce IA",
     "ID del estándar al que pertenece el capítulo en auditorías multi-normativas."),

    # ==================== ENTIDAD 4: PuntoProbado (Anidado en AISVSChapter.puntosProbados[]) ====================
    (DOM_AUDIT, "PuntoProbado", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "No (Actualizable)",
     "ej. C1.1.1, A.6.2.6, LFPDPPP-1.1", CL_INT, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Código oficial único del control de seguridad o gobernanza evaluado."),
    (DOM_AUDIT, "PuntoProbado", "name", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Título oficial del control", CL_INT, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Título descriptivo del requisito normativo evaluado."),
    (DOM_AUDIT, "PuntoProbado", "status", "enum", "'Aprobado' | 'Fallido' | 'Falta Evidencia'", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Enum estricto de 3 estados", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Estado de cumplimiento determinado por el motor Map-Reduce con base en evidencia documental."),
    (DOM_AUDIT, "PuntoProbado", "level", "enum", "'L1' | 'L2' | 'L3'", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "Nivel de madurez del control", CL_INT, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Nivel de aseguramiento al que corresponde el control (L1 Básico, L2 Estándar, L3 Crítico)."),
    (DOM_AUDIT, "PuntoProbado", "isMandatoryForTargetLevel", "boolean", "boolean", "Atributo", "Opcional", "No (Actualizable)",
     "true si aplica al targetLevel", CL_INT, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Indica si el cumplimiento de este control es obligatorio para el nivel objetivo del sistema."),
    (DOM_AUDIT, "PuntoProbado", "isInheritedFromPlatform", "boolean", "boolean", "Atributo", "Opcional", "No (Actualizable)",
     "true si lo cubre el CSP", CL_INT, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Indica si el control es heredado parcial o totalmente del proveedor Cloud (Modelo SaaS/PaaS)."),
    (DOM_AUDIT, "PuntoProbado", "inheritedPlatformName", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "ej. Google Cloud Vertex AI", CL_INT, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Nombre de la plataforma de la cual se hereda el control de infraestructura."),
    (DOM_AUDIT, "PuntoProbado", "comoSeAprobo", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Justificación técnica detallada", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Explicación técnica de cómo la arquitectura satisface el control (o 'N/A' si falló)."),
    (DOM_AUDIT, "PuntoProbado", "comoFallo", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Análisis de brecha o riesgo", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Explicación detallada de la vulnerabilidad, omisión o falta de evidencia detectada."),
    (DOM_AUDIT, "PuntoProbado", "fuenteEvidencia", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Sección/archivo citado (>10 chars)", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Referencia exacta al documento, archivo o recurso GCP donde se encontró la evidencia (C08.4)."),
    (DOM_AUDIT, "PuntoProbado", "textoEvidencia", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Cita literal extraída del documento", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Fragmento textual exacto extraído de la evidencia para garantizar trazabilidad anti-alucinación."),
    (DOM_AUDIT, "PuntoProbado", "riskImpact", "enum", "'Alto' | 'Medio' | 'Bajo'", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Severidad en matriz de riesgos", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-06 · Motor Map-Reduce IA",
     "Impacto técnico y de negocio en caso de explotación o incumplimiento del control."),
    (DOM_AUDIT, "PuntoProbado", "remediation", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Recomendación ejecutiva accionable", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-07 · Síntesis de Remediación",
     "Resumen de la acción correctiva recomendada para mitigar el hallazgo."),
    (DOM_AUDIT, "PuntoProbado", "remediationDetails", "object/map", "RemediationGuidance", "Atributo", "Opcional", "No (Actualizable)",
     "Objeto de guía 4D", CL_CONF, "No", CAPA_1, "/audits/{auditId} (puntosProbados[])", "F-07 · Síntesis de Remediación",
     "Estructura detallada de remediación en 4 dimensiones (Estrategia, Pasos, Código, Verificación)."),

    # ==================== ENTIDAD 5: RemediationGuidance (Anidado en PuntoProbado) ====================
    (DOM_AUDIT, "RemediationGuidance", "strategy", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Dimensión 1: Estrategia técnica", CL_CONF, "No", CAPA_1, "/audits/{auditId} (remediationDetails)", "F-07 · Síntesis de Remediación",
     "Diseño arquitectónico de la solución propuesta para cerrar la brecha."),
    (DOM_AUDIT, "RemediationGuidance", "actionableSteps", "array/list", "string[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "Dimensión 2: 3 a 5 pasos concretos", CL_CONF, "No", CAPA_1, "/audits/{auditId} (remediationDetails)", "F-07 · Síntesis de Remediación",
     "Lista secuencial de pasos de ingeniería para implementar el control."),
    (DOM_AUDIT, "RemediationGuidance", "codeOrConfigExample", "string", "string (Code/YAML/HCL)", "Atributo", "Opcional", "No (Actualizable)",
     "Dimensión 3: Snippet de producción", CL_CONF, "No", CAPA_1, "/audits/{auditId} (remediationDetails)", "F-07 · Síntesis de Remediación",
     "Fragmento de código (Terraform, YAML, Python, TypeScript o gcloud) listo para aplicar."),
    (DOM_AUDIT, "RemediationGuidance", "verificationRecipe", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Dimensión 4: Criterio de auditoría", CL_CONF, "No", CAPA_1, "/audits/{auditId} (remediationDetails)", "F-07 · Síntesis de Remediación",
     "Procedimiento o comando de prueba para certificar que la remediación fue efectiva."),
    (DOM_AUDIT, "RemediationGuidance", "effortLevel", "enum", "'Bajo (Quick Win)'|'Medio (Táctico)'|'Alto (Estructural)'", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Estimación de esfuerzo RACI", CL_INT, "No", CAPA_1, "/audits/{auditId} (remediationDetails)", "F-07 · Síntesis de Remediación",
     "Clasificación del esfuerzo de implementación (1-3 días, 1-2 semanas, >2 semanas)."),
    (DOM_AUDIT, "RemediationGuidance", "recommendedTools", "array/list", "string[]", "Atributo", "Opcional", "No (Actualizable)",
     "Herramientas cloud/OSS sugeridas", CL_INT, "No", CAPA_1, "/audits/{auditId} (remediationDetails)", "F-07 · Síntesis de Remediación",
     "Tecnologías recomendadas (ej. Model Armor, Cloud KMS, NeMo Guardrails, Garak)."),

    # ==================== ENTIDAD 6: StandardChapter & StandardControl (/standards_*) ====================
    (DOM_CAT, "StandardChapter", "chapterId", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "size: 1..32; chapterId == docId", CL_PUB, "No", CAPA_1, "/standards_aisvs/{id} y /standards_iso42001/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Identificador primario del capítulo en los catálogos normativos (C01..C12, CLAUSE-4..ANNEX-A)."),
    (DOM_CAT, "StandardChapter", "title", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "size: 1..200 chars", CL_PUB, "No", CAPA_1, "/standards_aisvs/{id} y /standards_iso42001/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Título oficial del capítulo o cláusula del estándar internacional."),
    (DOM_CAT, "StandardChapter", "shortDescription", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 1,000 chars", CL_PUB, "No", CAPA_1, "/standards_aisvs/{id} y /standards_iso42001/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Descripción ejecutiva corta mostrada en las tarjetas del explorador de estándares."),
    (DOM_CAT, "StandardChapter", "fullDescription", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 10,000 chars", CL_PUB, "No", CAPA_1, "/standards_aisvs/{id} y /standards_iso42001/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Explicación normativa detallada e implicaciones de arquitectura del dominio."),
    (DOM_CAT, "StandardChapter", "order", "number", "number", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "Entero secuencial >= 1", CL_PUB, "No", CAPA_1, "/standards_aisvs/{id} y /standards_iso42001/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Orden numérico de presentación y agrupación en lotes de evaluación."),
    (DOM_CAT, "StandardChapter", "controls", "array/list", "StandardControl[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "list size <= 200 controles", CL_PUB, "No", CAPA_1, "/standards_aisvs/{id} y /standards_iso42001/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Colección de controles individuales que integran el capítulo normativo."),
    (DOM_CAT, "StandardControl", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "Código único (ej. C1.1.1, A.5.2)", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Identificador normativo oficial del control o requisito verificable."),
    (DOM_CAT, "StandardControl", "title", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "1..250 chars", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Nombre conciso del control o salvaguarda de seguridad."),
    (DOM_CAT, "StandardControl", "description", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "Texto íntegro del requisito", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Especificación normativa completa exigible durante la auditoría."),
    (DOM_CAT, "StandardControl", "level", "enum", "'L1' | 'L2' | 'L3'", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "Nivel de madurez exigible", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Nivel mínimo de madurez en el que este control resulta obligatorio."),
    (DOM_CAT, "StandardControl", "objective", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "Objetivo de control", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Meta de mitigación de riesgo que persigue el control."),
    (DOM_CAT, "StandardControl", "verificationGuidance", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "Guía de verificación de auditoría", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Criterios de prueba para que el auditor o el LLM verifique el cumplimiento."),
    (DOM_CAT, "StandardControl", "remediationGuidance", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "Guía base de remediación", CL_PUB, "No", CAPA_4, "src/lib/aisvsData.ts y iso42001Data.ts", "F-05 · Catálogos y BYOF SHA-256",
     "Patrones de referencia recomendados para implementar el control."),

    # ==================== ENTIDAD 7: CustomFramework & SnapshotIntegrityStatus ====================
    (DOM_BYOF, "CustomFramework", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "regex: ^[a-zA-Z0-9_\\-\\.]+$ (fw-*)", CL_INT, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id} + /tmp", "F-05 · Catálogos y BYOF SHA-256",
     "Identificador único del marco regulatorio personalizado o pre-empaquetado (LFPDPPP, LFPC, EU AI Act)."),
    (DOM_BYOF, "CustomFramework", "shortCode", "string", "string", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "size <= 32 chars (ej. LFPDPPP-MX)", CL_PUB, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id} + /tmp", "F-05 · Catálogos y BYOF SHA-256",
     "Acrónimo corto del marco utilizado en etiquetas, selectores y reportes."),
    (DOM_BYOF, "CustomFramework", "name", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 300 chars", CL_PUB, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id} + /tmp", "F-05 · Catálogos y BYOF SHA-256",
     "Título oficial de la ley, regulación o política interna ingerida."),
    (DOM_BYOF, "CustomFramework", "jurisdiction", "string", "string", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "size <= 150 chars (ej. México, UE)", CL_PUB, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id} + /tmp", "F-05 · Catálogos y BYOF SHA-256",
     "Ámbito geográfico o regulatorio donde aplica la normativa."),
    (DOM_BYOF, "CustomFramework", "version", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 50 chars (ej. 2026.1)", CL_PUB, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id} + /tmp", "F-05 · Catálogos y BYOF SHA-256",
     "Versión o año de publicación del marco normativo."),
    (DOM_BYOF, "CustomFramework", "description", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "size <= 5,000 chars", CL_PUB, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id} + /tmp", "F-05 · Catálogos y BYOF SHA-256",
     "Resumen ejecutivo del alcance legal y técnico del marco."),
    (DOM_BYOF, "CustomFramework", "createdAt", "string", "string (ISO-8601)", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Timestamp UTC de ingesta", CL_INT, "No", CAPA_1, "/custom_frameworks/{frameworkId}", "F-05 · Catálogos y BYOF SHA-256",
     "Fecha de creación o ingesta del marco en AegisAI."),
    (DOM_BYOF, "CustomFramework", "createdBy", "string", "string (Email)", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Email del autor o 'System'", CL_PII, "Sí (PII)", CAPA_1, "/custom_frameworks/{frameworkId}", "F-05 · Catálogos y BYOF SHA-256",
     "Identidad del usuario que subió el marco mediante el motor BYOF (PII)."),
    (DOM_BYOF, "CustomFramework", "totalChapters", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Entero >= 1", CL_INT, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Número total de capítulos extraídos del documento normativo."),
    (DOM_BYOF, "CustomFramework", "totalControls", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Entero >= 1", CL_INT, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Número total de controles verificables estructurados por IA."),
    (DOM_BYOF, "CustomFramework", "chapters", "array/list", "StandardChapter[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "Jerarquía completa de capítulos/controles", CL_PUB, "No", CAPA_2, "config/frameworks/*.json + /custom_frameworks/{id}", "F-05 · Catálogos y BYOF SHA-256",
     "Arreglo con el contenido normativo completo utilizado durante la fase MAP."),
    (DOM_BYOF, "CustomFramework", "allowedDomains", "array/list", "string[]", "Índice / Filtro", "Opcional", "No (Actualizable)",
     "ACL de dominios o ['*'] (C08.1)", CL_FOR, "No", CAPA_1, "/custom_frameworks/{frameworkId}", "F-05 · Catálogos y BYOF SHA-256",
     "Lista de dominios de correo autorizados para visualizar y auditar con este marco."),
    (DOM_BYOF, "CustomFramework", "sha256Signature", "string", "string (64 hex)", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "SHA-256 sobre id+shortCode+chapters", CL_FOR, "No", CAPA_3, "/tmp/aegis-runtime-cache/frameworks/*.json + Firestore", "F-05 · Catálogos y BYOF SHA-256",
     "Firma criptográfica SHA-256 para prevenir manipulación del catálogo normativo (OWASP C01.4)."),
    (DOM_BYOF, "SnapshotIntegrityStatus", "verified", "boolean", "boolean", "Atributo", "Obligatorio", "No (Actualizable)",
     "true si 0 mismatches SHA-256", CL_FOR, "No", CAPA_2, "config/frameworks/integrity-manifest.json + RAM", "F-05 · Catálogos y BYOF SHA-256",
     "Resultado de la verificación criptográfica de arranque contra integrity-manifest.json."),
    (DOM_BYOF, "SnapshotIntegrityStatus", "mismatches", "array/list", "string[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "Archivos corruptos o faltantes", CL_FOR, "No", CAPA_2, "config/frameworks/integrity-manifest.json + RAM", "F-05 · Catálogos y BYOF SHA-256",
     "Lista de discrepancias detectadas; si no está vacía dispara alerta NORMATIVE_INTEGRITY_FAILURE."),

    # ==================== ENTIDAD 8: ApiKey (/apiKeys/{keyId}) ====================
    (DOM_API, "ApiKey", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "id == key == docId (firestore.rules)", CL_SEC, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Identificador del documento en Firestore (idéntico al token para búsqueda O(1))."),
    (DOM_API, "ApiKey", "key", "string", "string (Token)", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "regex: ^aisvs_[a-zA-Z0-9]{32,64}$", CL_SEC, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Credencial secreta enviada en cabecera x-api-key para pipelines CI/CD (/api/v1/audits)."),
    (DOM_API, "ApiKey", "name", "string", "string", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "size: 1..200 chars", CL_INT, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Nombre descriptivo de la integración o pipeline propietario de la llave."),
    (DOM_API, "ApiKey", "createdAt", "string", "string (ISO-8601)", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "size: 1..100 chars", CL_INT, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Fecha y hora de generación de la llave API."),
    (DOM_API, "ApiKey", "lastUsedAt", "string", "string (ISO-8601)", "Atributo", "Opcional", "No (Actualizable)",
     "Actualizado por Admin SDK al autenticar", CL_FOR, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Última marca de tiempo en que la llave fue utilizada exitosamente en la API v1."),
    (DOM_API, "ApiKey", "status", "enum", "'active' | 'revoked'", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "En create debe ser 'active'", CL_FOR, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Estado de vigencia de la llave; las llaves revocadas o eliminadas rechazan el acceso."),
    (DOM_API, "ApiKey", "ownerUid", "string", "string", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "size <= 128 chars; == request.auth.uid", CL_FOR, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "UID del usuario creador; único autorizado junto con el admin para eliminar la llave."),
    (DOM_API, "ApiKey", "ownerEmail", "string", "string (Email)", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "size <= 200 chars", CL_PII, "Sí (PII)", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Correo electrónico del propietario de la llave API para trazabilidad de auditoría (PII)."),
    (DOM_API, "ApiKey", "tenantDomain", "string", "string", "Índice / Filtro", "Opcional", "Sí (Inmutable)",
     "size <= 100 chars", CL_FOR, "No", CAPA_1, "/apiKeys/{keyId}", "F-02 · Identidad Zero-Trust",
     "Dominio organizacional asociado a la llave API."),

    # ==================== ENTIDAD 9: AsyncAuditJob (/asyncAudits/{jobId}) ====================
    (DOM_API, "AsyncAuditJob", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "formato: job_<timestamp>_<rand>", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-01 · Ingesta Multimodal",
     "Identificador único del trabajo de auditoría asíncrona devuelto con HTTP 202."),
    (DOM_API, "AsyncAuditJob", "status", "enum", "'PROCESSING' | 'COMPLETED' | 'FAILED'", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Máquina de estados del job", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-08 · Persistencia Dual + Saga",
     "Estado actual de ejecución consultable vía GET /api/v1/audits/:jobId."),
    (DOM_API, "AsyncAuditJob", "createdAt", "string", "string (ISO-8601)", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Timestamp UTC de encolado", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-01 · Ingesta Multimodal",
     "Instante en que se recibió la petición programática en la cola asíncrona."),
    (DOM_API, "AsyncAuditJob", "completedAt", "string", "string (ISO-8601)", "Atributo", "Opcional", "No (Actualizable)",
     "Timestamp UTC de finalización", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-08 · Persistencia Dual + Saga",
     "Instante en que concluyó la evaluación o se registró un error."),
    (DOM_API, "AsyncAuditJob", "systemName", "string", "string", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "1..500 chars", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-01 · Ingesta Multimodal",
     "Nombre del sistema auditado mediante la API programática."),
    (DOM_API, "AsyncAuditJob", "technicalLead", "string", "string", "Atributo", "Opcional", "Sí (Inmutable)",
     "<= 200 chars", CL_PII, "Sí (PII)", CAPA_1, "/asyncAudits/{jobId}", "F-01 · Ingesta Multimodal",
     "Responsable técnico reportado en el payload de la API v1 (PII)."),
    (DOM_API, "AsyncAuditJob", "email", "string", "string (Email)", "Atributo", "Opcional", "Sí (Inmutable)",
     "<= 200 chars", CL_PII, "Sí (PII)", CAPA_1, "/asyncAudits/{jobId}", "F-01 · Ingesta Multimodal",
     "Correo electrónico del responsable enviado en la solicitud asíncrona (PII)."),
    (DOM_API, "AsyncAuditJob", "standard", "string", "string", "Atributo", "Opcional", "Sí (Inmutable)",
     "AI-SVS | ISO-42001 | FULL | CUSTOM", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-06 · Motor Map-Reduce IA",
     "Estándar normativo solicitado para el trabajo en segundo plano."),
    (DOM_API, "AsyncAuditJob", "webhookUrl", "string", "string (URL HTTPS)", "Atributo", "Opcional", "Sí (Inmutable)",
     "Validado por validateOutboundEndpoint", CL_CONF, "No", CAPA_1, "/asyncAudits/{jobId}", "F-09 · Streaming SSE y Reportes",
     "URL HTTPS donde AegisAI envía mediante POST el dictamen al terminar el job."),
    (DOM_API, "AsyncAuditJob", "result", "object/map", "AuditReport", "Atributo", "Opcional", "No (Actualizable)",
     "Presente cuando status == COMPLETED", CL_CONF, "No", CAPA_1, "/asyncAudits/{jobId}", "F-08 · Persistencia Dual + Saga",
     "Objeto AuditReport íntegro generado por la evaluación asíncrona."),
    (DOM_API, "AsyncAuditJob", "error", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "Presente cuando status == FAILED", CL_INT, "No", CAPA_1, "/asyncAudits/{jobId}", "F-08 · Persistencia Dual + Saga",
     "Mensaje de diagnóstico técnico en caso de fallo en el trabajo asíncrono."),

    # ==================== ENTIDAD 10: AdminSettings & PlatformProfile ====================
    (DOM_CFG, "AdminSettings", "provider", "enum", "'gemini'|'anthropic'|'openrouter'|'openai'|'custom_openai_compatible'", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Proveedor LLM primario", CL_INT, "No", CAPA_1, "/system_config/admin_settings + /tmp + /app/config", "F-06 · Motor Map-Reduce IA",
     "Selecciona el motor de IA activo para evaluación y síntesis de remediación."),
    (DOM_CFG, "AdminSettings", "geminiBackend", "enum", "'vertex_ai' | 'api_key'", "Atributo", "Opcional", "No (Actualizable)",
     "Default: vertex_ai en Cloud Run", CL_INT, "No", CAPA_1, "/system_config/admin_settings + /tmp + /app/config", "F-06 · Motor Map-Reduce IA",
     "Define si Gemini se invoca vía Google Cloud Vertex AI (IAM/ADC) o Gemini API Key."),
    (DOM_CFG, "AdminSettings", "geminiApiKey", "string", "string (Secret)", "Atributo", "Opcional", "No (Actualizable)",
     "Enmascarado como maskedKey en GET", CL_SEC, "No", CAPA_5, "GCP Secret Manager (aegis-gemini-key) + /system_config", "F-06 · Motor Map-Reduce IA",
     "Credencial secreta de Gemini Developer API; nunca se devuelve en texto plano a la UI."),
    (DOM_CFG, "AdminSettings", "preferredModel", "string", "string", "Atributo", "Obligatorio", "No (Actualizable)",
     "ej. gemini-3.8-flash", CL_INT, "No", CAPA_1, "/system_config/admin_settings + /tmp + /app/config", "F-06 · Motor Map-Reduce IA",
     "Modelo primario utilizado por el orquestador Map-Reduce."),
    (DOM_CFG, "AdminSettings", "fallbackModel", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "ej. gemini-2.5-pro / flash", CL_INT, "No", CAPA_1, "/system_config/admin_settings + /tmp + /app/config", "F-06 · Motor Map-Reduce IA",
     "Modelo de respaldo invocado automáticamente ante errores de cuota o latencia."),
    (DOM_CFG, "AdminSettings", "openaiApiKey", "string", "string (Secret)", "Atributo", "Opcional", "No (Actualizable)",
     "Enmascarado como maskedOpenaiKey", CL_SEC, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-06 · Motor Map-Reduce IA",
     "Llave API para proveedores compatibles con OpenAI (OpenRouter, Anthropic, vLLM)."),
    (DOM_CFG, "AdminSettings", "openaiBaseUrl", "string", "string (URL)", "Atributo", "Opcional", "No (Actualizable)",
     "Verificado contra SSRF y DNS Rebinding", CL_FOR, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-03 · Guardrails y Anti-DoW",
     "URL base del endpoint LLM externo validada por la lista blanca ALLOWED_EGRESS_HOSTS (C04.3)."),
    (DOM_CFG, "AdminSettings", "openaiModel", "string", "string", "Atributo", "Opcional", "No (Actualizable)",
     "ej. anthropic/claude-3.7-sonnet", CL_INT, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-06 · Motor Map-Reduce IA",
     "Identificador del modelo cuando se utiliza un proveedor externo compatible con OpenAI."),
    (DOM_CFG, "AdminSettings", "customHeaders", "object/map", "Record<string, string>", "Atributo", "Opcional", "No (Actualizable)",
     "Mapa clave-valor de cabeceras HTTP", CL_CONF, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-06 · Motor Map-Reduce IA",
     "Cabeceras HTTP adicionales para gateways de IA corporativos."),
    (DOM_CFG, "AdminSettings", "temperature", "number", "number (0.0 .. 1.0)", "Atributo", "Opcional", "No (Actualizable)",
     "Forzado a 0.0 en auditorías (SLO 100%)", CL_TEL, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-06 · Motor Map-Reduce IA",
     "Temperatura de muestreo del modelo; fijada en 0.0 para determinismo normativo (ISO 42001)."),
    (DOM_CFG, "AdminSettings", "maxTokens", "number", "number", "Atributo", "Opcional", "No (Actualizable)",
     "Default: 8192 tokens por lote", CL_TEL, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-06 · Motor Map-Reduce IA",
     "Límite máximo de tokens de salida permitidos por llamada de inferencia."),
    (DOM_CFG, "AdminSettings", "updatedAt", "string", "string (ISO-8601)", "Atributo", "Opcional", "No (Actualizable)",
     "Timestamp UTC de cambio", CL_FOR, "No", CAPA_1, "/system_config/admin_settings + /tmp", "F-08 · Persistencia Dual + Saga",
     "Fecha y hora de la última actualización de configuración administrativa."),
    (DOM_CFG, "PlatformProfile", "key", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "6 perfiles en PLATFORM_PROFILES", CL_PUB, "No", CAPA_4, "server.ts (PLATFORM_PROFILES)", "F-06 · Motor Map-Reduce IA",
     "Clave del perfil de plataforma (gcp_vertex_ai, gemini_api, aws_bedrock, azure_openai, etc.)."),
    (DOM_CFG, "PlatformProfile", "inheritedCapabilities", "array/list", "string[]", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Controles cubiertos por el proveedor", CL_PUB, "No", CAPA_4, "server.ts (PLATFORM_PROFILES)", "F-06 · Motor Map-Reduce IA",
     "Lista de capacidades de seguridad físicas y de infraestructura heredadas del proveedor Cloud."),
    (DOM_CFG, "PlatformProfile", "customerResponsibilities", "array/list", "string[]", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Controles exigibles al cliente", CL_PUB, "No", CAPA_4, "server.ts (PLATFORM_PROFILES)", "F-06 · Motor Map-Reduce IA",
     "Lista de controles que siguen siendo responsabilidad exclusiva del equipo que despliega la IA."),

    # ==================== ENTIDAD 11: GCPScanTelemetry & GCPResourceItem ====================
    (DOM_GCP, "GCPScanTelemetry", "projectId", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "ID del proyecto GCP escaneado", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Identificador del proyecto de Google Cloud inspeccionado en vivo."),
    (DOM_GCP, "GCPScanTelemetry", "projectNumber", "string", "string", "Atributo", "Opcional", "Sí (Inmutable)",
     "Número único de proyecto GCP", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Número identificador numérico asignado por Cloud Resource Manager."),
    (DOM_GCP, "GCPScanTelemetry", "scanTime", "string", "string (ISO-8601)", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Timestamp UTC del escaneo", CL_INT, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Momento exacto en que se recolectó la telemetría de infraestructura GCP."),
    (DOM_GCP, "GCPScanTelemetry", "authModeUsed", "enum", "'adc' | 'token' | 'service_account' | 'demo'", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Credenciales efímeras no persistidas", CL_FOR, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Método de autenticación empleado durante el escaneo Zero-Footprint."),
    (DOM_GCP, "GCPScanTelemetry", "totalResourcesFound", "number", "number", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Entero >= 0", CL_INT, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Cantidad total de activos y políticas cloud descubiertos e inspeccionados."),
    (DOM_GCP, "GCPScanTelemetry", "componentsScanned", "array/list", "string[]", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "APIs GCP consultadas", CL_INT, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Lista de servicios GCP analizados (IAM, Cloud Storage, Cloud Run, Vertex AI, KMS, Secret Manager)."),
    (DOM_GCP, "GCPScanTelemetry", "findingsSummary", "object/map", "{critical, high, medium, low, info}", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Conteos enteros por severidad", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Resumen estadístico de hallazgos de seguridad cloud agrupados por nivel de criticidad."),
    (DOM_GCP, "GCPScanTelemetry", "resources", "object/map", "{iamFindings, buckets, cloudRunServices, vertex*, kmsKeys, secrets}", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "7 listas categorizadas de activos", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Inventario detallado de recursos GCP evaluados por categoría de servicio."),
    (DOM_GCP, "GCPScanTelemetry", "rawManifestMarkdown", "string", "string (Markdown)", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Manifiesto técnico para el LLM", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry)", "F-04 · Escaneo GCP en Vivo",
     "Reporte técnico estructurado en Markdown que se inyecta como evidencia al motor Map-Reduce."),
    (DOM_GCP, "GCPResourceItem", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "URI o ID del recurso GCP", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Identificador único del recurso o binding IAM dentro de Google Cloud."),
    (DOM_GCP, "GCPResourceItem", "name", "string", "string", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Nombre del recurso cloud", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Nombre legible del bucket, servicio Cloud Run, endpoint Vertex AI, clave KMS o secreto."),
    (DOM_GCP, "GCPResourceItem", "type", "string", "string", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "ej. GCS Bucket, Vertex Endpoint", CL_INT, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Tipo de activo de infraestructura dentro del catálogo de Google Cloud."),
    (DOM_GCP, "GCPResourceItem", "location", "string", "string", "Atributo", "Opcional", "Sí (Inmutable)",
     "Región o multi-región (ej. us-central1)", CL_INT, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Ubicación geográfica del recurso para verificar residencia de datos."),
    (DOM_GCP, "GCPResourceItem", "status", "enum", "'secure' | 'warning' | 'critical' | 'info'", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "Estado de postura del activo", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Resultado de la inspección automatizada de configuración sobre el recurso."),
    (DOM_GCP, "GCPResourceItem", "complianceImpact", "string", "string", "Atributo", "Opcional", "Sí (Inmutable)",
     "Explicación de impacto normativo", CL_CONF, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Descripción de cómo la configuración del activo afecta el cumplimiento normativo."),
    (DOM_GCP, "GCPResourceItem", "recommendedControl", "string", "string", "FK (Llave Foránea)", "Opcional", "Sí (Inmutable)",
     "Mapeo a control AISVS / ISO 42001", CL_INT, "No", CAPA_1, "/audits/{auditId} (gcpTelemetry.resources)", "F-04 · Escaneo GCP en Vivo",
     "Controles normativos vinculados directamente al hallazgo (ej. AISVS C1.4, C7.1, ISO A.6.2.6)."),

    # ==================== ENTIDAD 12: SecurityAlertEvent & UserSecurityContext ====================
    (DOM_SEC, "SecurityAlertEvent", "id", "string", "string", "PK (Llave Primaria)", "Obligatorio", "Sí (Inmutable)",
     "formato: SEC-<timestamp>-<rand5>", CL_FOR, "No", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Identificador único forense del evento de seguridad emitido por emitSecurityAlert()."),
    (DOM_SEC, "SecurityAlertEvent", "timestamp", "string", "string (ISO-8601)", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "Timestamp UTC de detección", CL_FOR, "No", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Fecha y hora exacta en que se disparó la alerta de seguridad."),
    (DOM_SEC, "SecurityAlertEvent", "eventType", "enum", "8 tipos (PROMPT_INJECTION, SSRF, DOW, SAGA...)", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "Mapeado a SCC AI Protection (C12.2)", CL_FOR, "No", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Categoría tipificada de la amenaza o fallo de integridad detectado en tiempo real."),
    (DOM_SEC, "SecurityAlertEvent", "severity", "enum", "'INFO' | 'WARNING' | 'CRITICAL'", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "WARNING/CRITICAL notifican SIEM", CL_FOR, "No", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Nivel de criticidad que determina el envío inmediato al webhook SIEM/SOAR."),
    (DOM_SEC, "SecurityAlertEvent", "actor", "string", "string (Email / ID)", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "Email autenticado o 'anonymous'", CL_PII, "Sí (PII)", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Identidad del usuario o proceso asociado al evento de seguridad (PII Forense)."),
    (DOM_SEC, "SecurityAlertEvent", "ip", "string", "string (IPv4/IPv6)", "Índice / Filtro", "Obligatorio", "Sí (Inmutable)",
     "Extraído de x-forwarded-for / socket", CL_PII, "Sí (PII)", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Dirección IP de origen del cliente para bloqueo perimetral y análisis forense (PII Red)."),
    (DOM_SEC, "SecurityAlertEvent", "details", "object/map", "Record<string, any>", "Atributo", "Obligatorio", "Sí (Inmutable)",
     "Payload JSON de contexto forense", CL_FOR, "No", CAPA_1, "/security_alerts/{alertId} + RAM + Cloud Logging", "F-10 · Telemetría AIMS y SIEM",
     "Metadatos detallados del evento (patrones bloqueados, puntaje crescendo, URL rechazada)."),
    (DOM_SEC, "UserSecurityContext", "authenticated", "boolean", "boolean", "Atributo", "Obligatorio", "No (Actualizable)",
     "Calculado por request en middleware", CL_FOR, "No", CAPA_5, "Memoria RAM (Express Request Context)", "F-02 · Identidad Zero-Trust",
     "Indica si la petición HTTP cuenta con identidad criptográfica verificada."),
    (DOM_SEC, "UserSecurityContext", "uid", "string", "string", "PK (Llave Primaria)", "Obligatorio", "No (Actualizable)",
     "UID Firebase, IAP ID o 'anonymous'", CL_FOR, "No", CAPA_5, "Memoria RAM (Express Request Context)", "F-02 · Identidad Zero-Trust",
     "Identificador único de sesión del usuario autenticado."),
    (DOM_SEC, "UserSecurityContext", "email", "string", "string (Email)", "Atributo", "Obligatorio", "No (Actualizable)",
     "Email verificado en token JWT/IAP", CL_PII, "Sí (PII)", CAPA_5, "Memoria RAM (Express Request Context)", "F-02 · Identidad Zero-Trust",
     "Correo electrónico extraído de la cabecera IAP o del token Firebase ID (PII)."),
    (DOM_SEC, "UserSecurityContext", "tenantDomain", "string", "string", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Subdominio tras '@' o 'public'", CL_FOR, "No", CAPA_5, "Memoria RAM (Express Request Context)", "F-02 · Identidad Zero-Trust",
     "Dominio de correo utilizado para aplicar aislamiento multi-tenant en consultas y escrituras."),
    (DOM_SEC, "UserSecurityContext", "authSource", "enum", "'firebase_id_token'|'iap_header'|'api_key'|'anonymous'", "Atributo", "Obligatorio", "No (Actualizable)",
     "Canal de autenticación validado", CL_FOR, "No", CAPA_5, "Memoria RAM (Express Request Context)", "F-02 · Identidad Zero-Trust",
     "Origen de la prueba de identidad empleada en la solicitud actual."),

    # ==================== ENTIDAD 13: AimsTelemetryState, ClientQuotaWindow, SessionRiskState ====================
    (DOM_RAM, "AimsTelemetryState", "totalEvaluations", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Contador acumulativo >= 0", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Número total de evaluaciones completadas por el motor AIMS (ISO/IEC 42001 Cl. 9.1)."),
    (DOM_RAM, "AimsTelemetryState", "totalBatchesExecuted", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Contador de lotes Map-Reduce", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Total de lotes paralelos procesados por los modelos LLM."),
    (DOM_RAM, "AimsTelemetryState", "totalControlsEvaluated", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Suma de controles auditados", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Volumen total de puntos de control verificados en todas las corridas."),
    (DOM_RAM, "AimsTelemetryState", "controlsWithExactCitation", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Controles con cita >10 chars", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Controles respaldados por una cita documental literal verificable (OWASP C08.4)."),
    (DOM_RAM, "AimsTelemetryState", "citationGroundedRatePercent", "number", "number (0..100%)", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "SLO >= 95.0% (targetCitationGroundedRatePercent)", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Indicador clave de calidad citatriz (porcentaje de controles libres de alucinación)."),
    (DOM_RAM, "AimsTelemetryState", "deterministicTemperatureEnforcedCount", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "SLO == 100.0% (temperature = 0.0)", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Conteo de evaluaciones que cumplieron la restricción de temperatura determinista 0.0."),
    (DOM_RAM, "AimsTelemetryState", "avgLatencyMs", "number", "number (ms)", "Atributo", "Obligatorio", "No (Actualizable)",
     "SLO P95 <= 900,000 ms", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Latencia promedio de extremo a extremo por auditoría ejecutada."),
    (DOM_RAM, "AimsTelemetryState", "totalPromptTokens", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Acumulado de tokens de entrada", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Consumo global de tokens de prompt para control presupuestal FinOps."),
    (DOM_RAM, "AimsTelemetryState", "totalCompletionTokens", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Acumulado de tokens de salida", CL_TEL, "No", CAPA_5, "Memoria RAM (aimsTelemetry)", "F-10 · Telemetría AIMS y SIEM",
     "Consumo global de tokens de respuesta generados por los modelos."),
    (DOM_RAM, "ClientQuotaWindow", "windowStartMs", "number", "number (Epoch ms)", "Atributo", "Obligatorio", "No (Actualizable)",
     "Ventana móvil de 15 minutos", CL_FOR, "No", CAPA_5, "Memoria RAM (clientQuotas Map)", "F-03 · Guardrails y Anti-DoW",
     "Inicio de la ventana de medición de cuotas Anti-Denial-of-Wallet por cliente (C11.1)."),
    (DOM_RAM, "ClientQuotaWindow", "requestCount", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Máximo 30 peticiones / 15 min", CL_FOR, "No", CAPA_5, "Memoria RAM (clientQuotas Map)", "F-03 · Guardrails y Anti-DoW",
     "Número de solicitudes de evaluación realizadas por el cliente en la ventana actual."),
    (DOM_RAM, "ClientQuotaWindow", "activeEvaluations", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Máximo 3 evaluaciones concurrentes", CL_FOR, "No", CAPA_5, "Memoria RAM (clientQuotas Map)", "F-03 · Guardrails y Anti-DoW",
     "Semáforo de concurrencia activa por usuario/IP para evitar agotamiento de recursos."),
    (DOM_RAM, "ClientQuotaWindow", "tokensConsumed", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Máximo 2,500,000 tokens / 15 min", CL_TEL, "No", CAPA_5, "Memoria RAM (clientQuotas Map)", "F-03 · Guardrails y Anti-DoW",
     "Presupuesto de tokens consumidos por el cliente dentro de la ventana de 15 minutos."),
    (DOM_RAM, "SessionRiskState", "cumulativeRiskScore", "number", "number", "Índice / Filtro", "Obligatorio", "No (Actualizable)",
     "Bloqueo si score >= 115 en 15 min", CL_FOR, "No", CAPA_5, "Memoria RAM (sessionRiskTracker Map)", "F-03 · Guardrails y Anti-DoW",
     "Puntaje acumulado de riesgo adversarial para detectar ataques multi-turno Crescendo (C02.10)."),
    (DOM_RAM, "SessionRiskState", "flaggedTurns", "number", "number", "Atributo", "Obligatorio", "No (Actualizable)",
     "Bloqueo si >= 3 turnos sospechosos", CL_FOR, "No", CAPA_5, "Memoria RAM (sessionRiskTracker Map)", "F-03 · Guardrails y Anti-DoW",
     "Contador de turnos con indicadores de jailbreak o evasión de guardrails en la sesión."),
    (DOM_RAM, "SessionRiskState", "blockedUntilMs", "number", "number (Epoch ms)", "Atributo", "Obligatorio", "No (Actualizable)",
     "Cooldown de bloqueo de 10 minutos", CL_FOR, "No", CAPA_5, "Memoria RAM (sessionRiskTracker Map)", "F-03 · Guardrails y Anti-DoW",
     "Marca de tiempo hasta la cual la sesión permanece bloqueada tras intento de escalamiento."),
    (DOM_RAM, "SessionRiskState", "recentIndicators", "array/list", "string[]", "Atributo", "Obligatorio", "No (Actualizable)",
     "Últimos 10 patrones detectados", CL_FOR, "No", CAPA_5, "Memoria RAM (sessionRiskTracker Map)", "F-03 · Guardrails y Anti-DoW",
     "Historial de firmas heurísticas y regex disparadas durante la ventana de sesión."),
]


# --------------------------------------------------------------------------------------
# 2. Catálogo de los 20 Repositorios Disponibles en las 5 Capas
# --------------------------------------------------------------------------------------

REPOSITORIES: list[tuple[str, ...]] = [
    ("REP-01", "Colección /audits/{auditId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/audits/{auditId}",
     "AuditReport, AISVSChapter, PuntoProbado, RemediationGuidance", "Documentos JSON / BSON NoSQL",
     "Lectura, Creación y Actualización (Dominio autorizado)", "Lectura/Escritura Admin SDK + Saga C09.4",
     "Firebase Auth JWT + Cloud IAP + Reglas declarativas", "Inmutable WORM (allow delete: if false)",
     "TLS 1.3 en tránsito + AES-256 Google-managed en reposo", "Persistente Multi-Región (SLA 99.999%)",
     "OWASP C08.1, C09.4 · ISO 42001 Cl. 9.1", "Almacén maestro inmutable de todos los dictámenes de auditoría, puntuaciones y arquitecturas remediadas."),
    ("REP-02", "Colección /standards_aisvs/{chapterId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/standards_aisvs/{chapterId}",
     "StandardChapter, StandardControl", "Documentos JSON NoSQL",
     "Lectura, Creación y Actualización (Sin borrado)", "Lectura/Escritura vía Firebase Admin SDK",
     "Firebase Auth JWT + Validación de esquema en firestore.rules", "Protegido contra borrado (allow delete: if false)",
     "TLS 1.3 + AES-256 en reposo", "Persistente Multi-Región (nam5)",
     "OWASP AISVS v1.0 C01–C12", "Catálogo sincronizado en nube de los 12 capítulos y 90 controles del estándar OWASP AI-SVS."),
    ("REP-03", "Colección /standards_iso42001/{chapterId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/standards_iso42001/{chapterId}",
     "StandardChapter, StandardControl", "Documentos JSON NoSQL",
     "Lectura, Creación y Actualización (Sin borrado)", "Lectura/Escritura vía Firebase Admin SDK",
     "Firebase Auth JWT + Validación de esquema en firestore.rules", "Protegido contra borrado (allow delete: if false)",
     "TLS 1.3 + AES-256 en reposo", "Persistente Multi-Región (nam5)",
     "ISO/IEC 42001:2023 Cl. 4–10 y Anexo A", "Catálogo sincronizado en nube de las cláusulas del Sistema de Gestión de IA (AIMS) y sus 38 controles."),
    ("REP-04", "Colección /apiKeys/{keyId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/apiKeys/{keyId}",
     "ApiKey", "Documentos JSON NoSQL",
     "Lectura, Creación y Eliminación (Sin update)", "Validación en /api/v1/audits vía Admin SDK",
     "Firebase Auth + Regla de propiedad (ownerUid / ownerEmail)", "Creación única; revocación mediante eliminación",
     "TLS 1.3 + AES-256 + Formato estricto aisvs_*", "Persistente Multi-Región (nam5)",
     "OWASP C05.3 · ISO 42001 A.6.2.6", "Bóveda de llaves API para integración programática con pipelines CI/CD corporativos."),
    ("REP-05", "Colección /custom_frameworks/{frameworkId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/custom_frameworks/{frameworkId}",
     "CustomFramework, StandardChapter", "Documentos JSON NoSQL",
     "DENEGADO (allow read, write: if false)", "Exclusivo Servidor vía Firebase Admin SDK",
     "Application Default Credentials (ADC) + Filtro ACL allowedDomains", "Firmado con SHA-256 (sha256Signature)",
     "TLS 1.3 + AES-256 + Firma SHA-256 C01.4", "Persistente Multi-Región + Espejo en /tmp",
     "OWASP C01.4, C08.1", "Almacén en nube de marcos regulatorios personalizados ingeridos mediante el motor BYOF."),
    ("REP-06", "Colección /asyncAudits/{jobId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/asyncAudits/{jobId}",
     "AsyncAuditJob, AuditReport", "Documentos JSON NoSQL",
     "DENEGADO (allow read, write: if false)", "Exclusivo Servidor vía Firebase Admin SDK",
     "Autenticación por cabecera x-api-key en API v1", "Transición controlada PROCESSING -> COMPLETED/FAILED",
     "TLS 1.3 + AES-256 en reposo", "Persistente Multi-Región (nam5)",
     "OWASP C09.4", "Cola persistente de estado y resultados para trabajos de auditoría asíncrona."),
    ("REP-07", "Documento /system_config/admin_settings", CAPA_1, "Google Cloud Firestore Native (nam5)", "/system_config/admin_settings",
     "AdminSettings", "Documento JSON Único (Singleton)",
     "DENEGADO (allow read, write: if false)", "Exclusivo Servidor vía Firebase Admin SDK",
     "Token administrativo (X-Admin-Token) o identidad IAP Admin", "Actualizable mediante Saga con rollback automático",
     "TLS 1.3 + AES-256 + Enmascarado de API Keys", "Persistente Multi-Región + Hidratación al inicio",
     "OWASP C04.1, C05.3", "Configuración global en caliente del proveedor LLM, modelos, temperaturas y endpoints."),
    ("REP-08", "Colección /security_alerts/{alertId}", CAPA_1, "Google Cloud Firestore Native (nam5)", "/security_alerts/{alertId}",
     "SecurityAlertEvent", "Documentos JSON Forenses",
     "DENEGADO (allow read, write: if false)", "Escritura append-only vía emitSecurityAlert()",
     "Firebase Admin SDK interno del servidor", "Append-only forense (Inmutable)",
     "TLS 1.3 + AES-256", "Persistente Multi-Región (nam5)",
     "OWASP C12.2 · ISO 42001 Cl. 9.1", "Registro histórico de alertas de inyección de prompt, SSRF, cuotas DoW y fallos de integridad."),
    ("REP-09", "Marcos Regulatorios México (LFPDPPP y LFPC)", CAPA_2, "Sistema de Archivos Local Read-Only", "config/frameworks/fw-lfpdppp-mex-2026.json y fw-lfpc-mex-2026.json",
     "CustomFramework", "Archivos JSON UTF-8",
     "Sin acceso directo (Servido vía GET /api/frameworks)", "Lectura síncrona fs.readFileSync (Solo Lectura)",
     "Permisos POSIX endurecidos (chmod -R a-w /app)", "100% Inmutable en imagen de contenedor",
     "Verificación de hash SHA-256 al arranque (C01.4)", "Empaquetado en imagen Docker inmutable",
     "LFPDPPP (INAI) · LFPC (PROFECO) · C01.4", "Catálogos normativos mexicanos de Protección de Datos Personales y Protección al Consumidor."),
    ("REP-10", "Marcos EU AI Act y DSM-01", CAPA_2, "Sistema de Archivos Local Read-Only", "config/frameworks/fw-eu-ai-act-mtug5x39.json y fw-dsm-01-mubn2f1y.json",
     "CustomFramework", "Archivos JSON UTF-8",
     "Sin acceso directo (Servido vía GET /api/frameworks)", "Lectura síncrona fs.readFileSync (Solo Lectura)",
     "Permisos POSIX endurecidos (chmod -R a-w /app)", "100% Inmutable en imagen de contenedor",
     "Verificación de hash SHA-256 al arranque (C01.4)", "Empaquetado en imagen Docker inmutable",
     "Reglamento UE 2024/1689 · OWASP C01.4", "Catálogos del Reglamento Europeo de IA y marco corporativo DSM-01."),
    ("REP-11", "Manifiesto Criptográfico de Integridad", CAPA_2, "Sistema de Archivos Local Read-Only", "config/frameworks/integrity-manifest.json",
     "SnapshotIntegrityStatus", "Archivo JSON con Hashes SHA-256",
     "Expuesto en GET /api/health y /api/security/posture", "Leído por verifyNormativeSnapshotsIntegrity()",
     "Permisos POSIX de solo lectura en contenedor", "Inmutable (Firmado en tiempo de compilación)",
     "SHA-256 (crypto.createHash)", "Empaquetado en imagen Docker",
     "OWASP AISVS C01.4", "Fuente de verdad criptográfica para detectar alteración o corrupción de marcos regulatorios."),
    ("REP-12", "Configuración Semilla Local", CAPA_2, "Sistema de Archivos Local Read-Only", "config/admin-settings.json y firebase-applet-config.json",
     "AdminSettings", "Archivos JSON UTF-8",
     "Sin acceso directo", "Leído como semilla inicial (Fallback de último recurso)",
     "Permisos POSIX de solo lectura", "Inmutable en producción (/app/config)",
     "Sin llaves en texto plano en repositorio público", "Empaquetado en imagen Docker",
     "OWASP C04.1", "Configuración base del motor LLM y parámetros de conexión al proyecto Firebase/Firestore."),
    ("REP-13", "Caché Efímero de Configuración LLM", CAPA_3, "Sistema de Archivos en Memoria (tmpfs)", "/tmp/aegis-runtime-cache/admin-settings.json",
     "AdminSettings", "Archivo JSON en RAM (tmpfs)",
     "Sin acceso directo", "Lectura/Escritura por loadAdminSettings y saveAdminSettings",
     "Aislamiento de proceso Node.js (usuario no-root aegis)", "Actualizable en caliente con rollback de Saga",
     "Reside exclusivamente en RAM del contenedor Cloud Run", "Efímero por instancia (Sincronizado con Firestore)",
     "OWASP C04.1, C09.4", "Espejo de baja latencia que permite actualizar ajustes de IA con sistema raíz de solo lectura."),
    ("REP-14", "Caché Efímero de Marcos BYOF", CAPA_3, "Sistema de Archivos en Memoria (tmpfs)", "/tmp/aegis-runtime-cache/frameworks/*.json",
     "CustomFramework", "Archivos JSON en RAM (tmpfs)",
     "Sin acceso directo", "Lectura/Escritura por getCustomFramework y saveCustomFramework",
     "Aislamiento de proceso + Verificación de firma SHA-256", "Validado en cada lectura contra sha256Signature",
     "Firma SHA-256 + Memoria volátil", "Efímero por instancia (Sincronizado con Firestore)",
     "OWASP C01.4, C04.1", "Almacén intermedio de alta velocidad para marcos normativos personalizados."),
    ("REP-15", "Contextos Normativos Maestros (.md)", CAPA_4, "Archivos Estáticos Precargados en Memoria", "owasp-aisvs-context.md e iso-42001-context.md",
     "StandardChapter (Texto Normativo)", "Documentos Markdown UTF-8",
     "Sin acceso directo", "Precargados en RAM al iniciar server.ts",
     "Integrados en el bundle del servidor", "Inmutable",
     "Integridad garantizada por imagen de contenedor", "Permanente en código fuente",
     "OWASP AISVS v1.0 · ISO 42001:2023", "Especificaciones completas inyectadas en los prompts del motor Map-Reduce."),
    ("REP-16", "Catálogos Tipados, Auditorías Semilla e i18n", CAPA_4, "Módulos TypeScript Compilados", "src/lib/aisvsData.ts, iso42001Data.ts, sampleAudits*.ts, *Translations.ts",
     "StandardChapter[], AuditReport[]", "Módulos TypeScript / ES Modules",
     "Importados directamente por React 19 UI", "Importados por el backend para inicialización",
     "Público dentro de la aplicación web", "Inmutable (Compilado por Vite)",
     "Verificación estática de tipos TypeScript", "Permanente en bundle de aplicación",
     "ISO 42001 Cl. 7.5 (Información Documentada)", "Datos semilla para hidratar el catálogo de controles, ejemplos de dictámenes y traducciones ES/EN."),
    ("REP-17", "Almacenes RAM de Seguridad y Cuotas", CAPA_5, "Memoria Volátil V8 Heap (Node.js Map / RingBuffer)", "RAM: clientQuotas, sessionRiskTracker, aimsTelemetry, recentSecurityAlerts",
     "ClientQuotaWindow, SessionRiskState, AimsTelemetryState, SecurityAlertEvent", "Estructuras en memoria (Map y Array)",
     "Métricas expuestas en /api/admin/aims-telemetry y /api/security/posture", "Lectura/Escritura atómica en proceso Express",
     "Protegido por X-Admin-Token / IAP", "Ventanas deslizantes de 15m y buffer circular de 200 eventos",
     "Aislamiento de memoria del contenedor", "Volátil (Recalculado en tiempo real)",
     "OWASP C02.10, C08.4, C11.1, C12.2", "Estado de baja latencia para bloqueo de ataques Crescendo, control Anti-DoW y telemetría AIMS."),
    ("REP-18", "Buffer RAM de Ingesta Documental (Multer)", CAPA_5, "Memoria Volátil V8 Heap (multer.memoryStorage)", "RAM: req.files (Buffer en memoria <= 30 MB)",
     "UploadedFileInput", "Buffers binarios y texto extraído en RAM",
     "Subida multipart en POST /api/evaluate y /api/frameworks/ingest", "Procesado en memoria por pdf-parse y JSZip",
     "Validación estricta de extensión y tamaño (<= 30 MB)", "Efímero por petición (Liberado por Garbage Collector)",
     "Zero Disk Footprint (Nunca se escribe en disco)", "Transitorio (Duración de la petición HTTP)",
     "OWASP C04.1 · Privacidad por Diseño", "Procesamiento sin huella en disco de diagramas PDF y paquetes ZIP de arquitectura."),
    ("REP-19", "Google Cloud Secret Manager", CAPA_5, "Servicio Gestionado de Bóveda de Secretos GCP", "projects/*/secrets/aegis-gemini-key y aegis-admin-token",
     "AdminSettings (Secretos)", "Variables de entorno inyectadas en Cloud Run",
     "Inaccesible desde cliente", "Inyectado al arranque del contenedor vía IAM roles/secretmanager.secretAccessor",
     "Google Cloud IAM Service Account (ADC)", "Versionado inmutable de secretos en GCP",
     "Cifrado HSM / AES-256 en Google Cloud", "Gestionado por GCP (Alta Disponibilidad Global)",
     "OWASP C05.3 · ISO 42001 A.6.2.6", "Resguardo seguro de GEMINI_API_KEY y ADMIN_API_TOKEN fuera del código fuente."),
    ("REP-20", "Google Cloud Logging, SCC AI Protection y Artifact Registry", CAPA_5, "Plataforma de Observabilidad y Registro Cloud GCP", "Cloud Logging (stdout/stderr JSON) + SCC + us-central1-docker.pkg.dev",
     "SecurityAlertEvent, Telemetría Operativa", "Logs JSON estructurados e imágenes OCI/Docker",
     "Inaccesible desde cliente", "Emisión continua desde server.ts y Cloud Build",
     "Google Cloud IAM", "Logs de auditoría inmutables según política de retención GCP",
     "TLS 1.3 + AES-256", "Persistente en Google Cloud Platform",
     "OWASP C12.2 · ISO 42001 Cl. 9.1", "Repositorio central de trazas forenses, hallazgos SCC AI Protection e imágenes de despliegue."),
]


# --------------------------------------------------------------------------------------
# 3. Matriz de los 18 Flujos de Información End-to-End y Endpoints API
# --------------------------------------------------------------------------------------

INFORMATION_FLOWS: list[tuple[str, ...]] = [
    ("FLW-01", "F-01 · Ingesta Multimodal", "Solicitud de Auditoría Interactiva y Extracción Documental",
     "POST /api/evaluate", "Arquitecto / Auditor (React 19 UI)", "Express + multer.memoryStorage + pdf-parse + JSZip",
     "REP-18 (Buffer RAM) -> Motor Map-Reduce", "AuditReport (Input), UploadedFileInput", "Multipart/form-data o JSON -> Stream SSE",
     "Cloud IAP / Firebase ID Token + Límite 30 MB", "OWASP C02.10, C04.1", "Máx 30 MB / archivo · 15 archivos / ZIP",
     "Recibe la descripción del sistema y descomprime en RAM archivos .pdf, .zip, .md, .json y código sin tocar el disco."),
    ("FLW-02", "F-01 · Ingesta Multimodal", "Disparo de Auditoría Programática Asíncrona (CI/CD)",
     "POST /api/v1/audits", "Pipeline CI/CD (GitHub Actions / Cloud Build)", "Validador x-api-key + Cola Asíncrona",
     "REP-04 (/apiKeys) y REP-06 (/asyncAudits)", "ApiKey, AsyncAuditJob", "HTTPS JSON (Devuelve HTTP 202 Accepted)",
     "Cabecera x-api-key (aisvs_*)", "OWASP C05.3, C11.1", "Cuota Anti-DoW: 30 req / 15 min",
     "Valida la llave API contra Firestore, registra un trabajo PROCESSING en /asyncAudits y lanza la evaluación en background."),
    ("FLW-03", "F-02 · Identidad Zero-Trust", "Extracción y Verificación de Contexto de Seguridad",
     "Middleware Global Express", "Cloud IAP / Firebase Auth / Cliente API", "extractUserSecurityContext() + timingSafeTokenMatch()",
     "REP-17 (Contexto RAM) y REP-19 (Secret Manager)", "UserSecurityContext", "Cabeceras HTTP (Authorization Bearer / IAP / X-Admin-Token)",
     "Verificación criptográfica JWT + SHA-256 tiempo constante", "OWASP C05.3, C08.1", "Latencia < 5 ms",
     "Construye el contexto de identidad Zero-Trust y extrae uid, email y tenantDomain para aislamiento multi-tenant."),
    ("FLW-04", "F-03 · Guardrails y Anti-DoW", "Inspección Anti-Crescendo, Control de Cuotas y Escudo SSRF",
     "Pre-Flight Guardrail Pipeline", "Motor de Seguridad Express", "inspectPromptAndTrackSession + acquireAntiDoWQuota + validateOutboundEndpoint",
     "REP-17 (sessionRiskTracker y clientQuotas en RAM)", "SessionRiskState, ClientQuotaWindow", "Inspección síncrona en memoria + DNS Lookup",
     "Bloqueo HTTP 429 / 403 ante abuso o SSRF", "OWASP C02.10, C04.3, C11.1", "Score < 115 · <= 3 evals activas · <= 2.5M tokens/15m",
     "Detecta ataques de inyección multi-turno, aplica presupuesto de tokens por ventana de 15m y bloquea IPs privadas/IMDS."),
    ("FLW-05", "F-04 · Escaneo GCP en Vivo", "Prueba de Conectividad y Permisos Google Cloud",
     "POST /api/gcp/test-connection", "Consola Live GCP Scanner (UI)", "testGCPConnection() (gcpScannerService.ts)",
     "Google Cloud Resource Manager API", "GCPScanTelemetry (Preliminar)", "HTTPS JSON",
     "ADC / Token OAuth 2.0 / Service Account JSON en RAM", "OWASP C04.1, C05.3", "Timeout 15 s · Credenciales descartadas tras uso",
     "Verifica que las credenciales efímeras tengan acceso de lectura al proyecto GCP sin almacenar llaves en disco ni BD."),
    ("FLW-06", "F-04 · Escaneo GCP en Vivo", "Inspección Zero-Footprint de Infraestructura Cloud e IA",
     "POST /api/gcp/scan", "Consola Live GCP Scanner (UI)", "scanLiveGCPProject() (7 colectores en paralelo)",
     "APIs GCP (IAM, GCS, Cloud Run, Vertex AI, KMS, Secrets, Logging)", "GCPScanTelemetry, GCPResourceItem", "HTTPS JSON",
     "Credenciales efímeras de solo lectura", "OWASP C01.4, C07.1 · ISO A.6.2.6", "Inspección concurrente de 7 familias de APIs",
     "Descubre recursos cloud en vivo, evalúa su postura de seguridad y genera el manifiesto técnico Markdown."),
    ("FLW-07", "F-04 · Escaneo GCP en Vivo", "Auditoría Normativa Directa desde Escaneo GCP en Vivo",
     "POST /api/gcp/audit", "Consola Live GCP Scanner (UI)", "scanLiveGCPProject() -> runMapReduceEvaluation()",
     "REP-01 (/audits/{auditId}) + Stream SSE", "GCPScanTelemetry -> AuditReport", "Stream SSE (text/event-stream)",
     "Credenciales GCP efímeras + Auth de usuario", "OWASP AISVS + ISO 42001", "Flujo unificado Escaneo + Evaluación IA",
     "Encadena la recolección de telemetría GCP directamente con el motor Map-Reduce y persiste el dictamen final."),
    ("FLW-08", "F-05 · Catálogos y BYOF SHA-256", "Verificación Criptográfica de Snapshots Normativos",
     "Arranque + GET /api/health & /api/security/posture", "Proceso de Inicialización server.ts", "verifyNormativeSnapshotsIntegrity()",
     "REP-09, REP-10 y REP-11 (config/frameworks/*)", "SnapshotIntegrityStatus", "Cálculo SHA-256 local",
     "Hash SHA-256 contra integrity-manifest.json", "OWASP C01.4", "Verificación del 100% de marcos al inicio",
     "Compara los hashes SHA-256 de los archivos JSON de marcos regulatorios contra el manifiesto firmado."),
    ("FLW-09", "F-05 · Catálogos y BYOF SHA-256", "Ingesta Inteligente de Marcos Regulatorios (BYOF)",
     "POST /api/frameworks/ingest", "Administrador / Arquitecto (Modal BYOF)", "Extracción Documental + Gemini Structured Output + saveCustomFramework",
     "REP-14 (/tmp/cache) + REP-05 (Firestore /custom_frameworks)", "CustomFramework, StandardChapter, StandardControl", "Multipart/JSON -> Stream SSE",
     "Auth de usuario + Firma SHA-256 automática", "OWASP C01.4, C08.1, C09.4", "Soporta leyes y políticas completas (.pdf/.md/.txt)",
     "Transforma leyes o normativas en capítulos y controles estructurados, calcula su firma SHA-256 y los guarda con persistencia dual."),
    ("FLW-10", "F-05 · Catálogos y BYOF SHA-256", "Consulta y Ciclo de Vida de Marcos Personalizados",
     "GET /api/frameworks · GET / DELETE /api/frameworks/:id", "React 19 UI / Evaluador", "listCustomFrameworks / getCustomFramework / deleteCustomFramework",
     "REP-14 (/tmp) -> REP-09/10 (/app/config) -> REP-05 (Firestore)", "CustomFramework", "HTTPS JSON",
     "Filtro ACL multi-tenant por tenantDomain (C08.1)", "OWASP C01.4, C08.1", "Lectura en cascada sub-milisegundo desde caché",
     "Lista, recupera o elimina marcos personalizados verificando en cada lectura la firma SHA-256 y los permisos de dominio."),
    ("FLW-11", "F-06 · Motor Map-Reduce IA", "Evaluación Paralela Multi-Normativa (Map-Reduce)",
     "Función Interna runMapReduceEvaluation()", "Orquestador de Evaluación", "Particionador de Lotes + executeAIWithFallback() + Reductor de Puntajes",
     "REP-15 (Contextos .md) + Vertex AI Gemini / OpenRouter", "AISVSChapter, PuntoProbado, StandardBreakdown", "JSON Schema determinista (temperature: 0.0)",
     "ADC IAM (Vertex AI) o API Key desde Secret Manager", "OWASP C08.4 · ISO 42001 Cl. 9.1", "3–4 lotes paralelos · Timeout 120s/lote · 3 reintentos",
     "Evalúa en paralelo todos los capítulos de múltiples estándares exigiendo citas textuales literales para evitar alucinaciones."),
    ("FLW-12", "F-07 · Síntesis de Remediación", "Generación de Arquitectura Remediada al 100% y Guía 4D",
     "Función Interna generateRemediatedArchitecture()", "Orquestador Post-Evaluación", "Sintetizador Arquitectónico LLM + Perfiles de Herencia Cloud",
     "REP-01 (/audits/{auditId}.remediatedArchitectureDoc)", "RemediationGuidance, AuditReport", "Markdown Técnico Estructurado (<= 200 KB)",
     "Ejecución interna autenticada", "ISO 42001 Cl. 10.1 (Mejora Continua)", "Generación automática al finalizar el Reduce",
     "Reescribe la arquitectura del sistema integrando controles compensatorios y snippets de código para alcanzar 100% de cumplimiento."),
    ("FLW-13", "F-08 · Persistencia Dual + Saga", "Escritura Transaccional con Compensación (Saga Pattern)",
     "runCompensatingSaga() + Escritura Firestore/tmpfs", "Backend server.ts / Cliente Web SDK", "Coordinador de Saga + Firebase Admin SDK + fs (/tmp)",
     "REP-01 (/audits), REP-05 (/custom_frameworks), REP-07 (/system_config), REP-13/14 (/tmp)", "AuditReport, CustomFramework, AdminSettings", "Transacciones HTTPS / gRPC hacia Firestore nam5",
     "Reglas WORM en Firestore + Rollback compensatorio", "OWASP C04.1, C09.4", "Atomicidad garantizada entre memoria, /tmp y Firestore",
     "Ejecuta cambios de estado mediante pasos con funciones compensate() registradas para revertir efectos parciales ante fallos."),
    ("FLW-14", "F-09 · Streaming SSE y Reportes", "Streaming de Progreso en Tiempo Real, Polling y Webhooks",
     "SSE POST /api/evaluate · GET /api/v1/audits/:jobId", "Servidor Express -> Navegador / Webhook CI-CD", "Emisor SSE (sendEvent + heartbeat 12s) + Dispatcher Webhook",
     "Cliente React (onSnapshot Firestore) y Webhook externo", "AuditReport, AsyncAuditJob", "text/event-stream y HTTPS POST JSON",
     "Validación SSRF en webhookUrl", "OWASP C04.3", "Heartbeat cada 12s para evitar corte de Cloud Run",
     "Transmite el avance porcentual por etapa en vivo, sincroniza la UI vía onSnapshot y permite exportar PDF/Markdown."),
    ("FLW-15", "F-10 · Telemetría AIMS y SIEM", "Monitoreo de Calidad Citatriz AIMS y Alertamiento SOC/SIEM",
     "GET /api/admin/aims-telemetry + emitSecurityAlert()", "Motor de Observabilidad y Seguridad", "recordAimsEvaluationMetrics() + Despachador SIEM",
     "REP-08 (/security_alerts), REP-17 (RAM) y REP-20 (Cloud Logging / SCC)", "AimsTelemetryState, SecurityAlertEvent", "JSON Estructurado compatible con Cloud Logging y SCC",
     "Protegido por X-Admin-Token / IAP Admin", "OWASP C08.4, C12.2 · ISO 42001 Cl. 9.1", "SLO Citas >= 95% · SLO Determinismo == 100%",
     "Registra métricas de fundamentación citatriz, emite logs estructurados a Cloud Logging y despacha alertas críticas al SIEM."),
    ("FLW-16", "Gobernanza Admin y MCP", "Gestión Dinámica del Motor LLM y Verificación MCP",
     "GET/POST /api/admin/settings · POST /api/admin/test-connection · POST /api/mcp/verify", "Consola de Administración (AdminSettingsModal)", "Gestor de Configuración + verifyMcpManifestSignature()",
     "REP-07 (/system_config/admin_settings) y REP-13 (/tmp/cache)", "AdminSettings", "HTTPS JSON",
     "X-Admin-Token (SHA-256 tiempo constante) o IAP Admin", "OWASP C05.3, C09.4, C10.1", "Validación HMAC-SHA256 para herramientas MCP",
     "Permite cambiar el proveedor/modelo de IA en caliente con prueba de conexión y verifica firmas criptográficas de servidores MCP."),
    ("FLW-17", "Internacionalización (i18n)", "Traducción Dinámica en Lote de Dictámenes y Controles",
     "POST /api/translate-batch", "Selector de Idioma UI (ES / EN)", "Motor de Traducción Contextual con IA",
     "Memoria RAM del Cliente React (Estado de Vista)", "AISVSChapter, PuntoProbado (Traducidos)", "HTTPS JSON (Arreglo de textos traducidos)",
     "Sesión de usuario activa", "ISO 42001 Cl. 7.4 (Comunicación)", "Traducción por lotes preservando términos técnicos",
     "Traduce dinámicamente hallazgos, evidencias y planes de remediación entre Español e Inglés preservando la terminología de seguridad."),
]


# --------------------------------------------------------------------------------------
# 4. Inyección de Tabla Dinámica Nativa OOXML (PivotTable + PivotCache) en el .xlsx
# --------------------------------------------------------------------------------------

def inject_native_pivottable(xlsx_path: Path, rows_data: list[tuple[str, ...]]) -> None:
    """Inyecta un objeto PivotTable nativo de Excel (OOXML) vinculado a Inventario_Maestro_Datos."""
    headers = [
        "ID_Atributo", "Dominio_Datos", "Entidad_Diccionario", "Campo_Atributo",
        "Tipo_Dato", "Tipo_Detallado_TS", "Llave_Rol", "Obligatorio",
        "Inmutable_WORM", "Restriccion_Validacion", "Clasificacion_Sensibilidad",
        "Contiene_PII", "Capa_Almacenamiento", "Repositorio_Coleccion",
        "Flujo_Principal", "Descripcion_Funcional_y_Normativa", "Coincide_Busqueda"
    ]
    num_rows = len(rows_data)
    last_row = 4 + num_rows  # Encabezado en fila 4, datos en 5..last_row
    ref_range = f"A4:P{last_row}"  # Las primeras 16 columnas estáticas

    # Construir cacheFields XML con valores compartidos para las dimensiones principales
    cache_fields_xml = []
    shared_cols = {0, 1, 2, 4, 6, 7, 8, 10, 11, 12, 13, 14}
    col_unique_vals: dict[int, list[str]] = {}

    for col_idx in range(16):
        col_name = xml_escape(headers[col_idx])
        if col_idx in shared_cols:
            seen: list[str] = []
            for r in rows_data:
                val = str(r[col_idx])
                if val not in seen:
                    seen.append(val)
            col_unique_vals[col_idx] = seen
            items = "".join(f'<s v="{xml_escape(v)}"/>' for v in seen)
            cache_fields_xml.append(
                f'<cacheField name="{col_name}" numFmtId="0">'
                f'<sharedItems count="{len(seen)}">{items}</sharedItems>'
                f'</cacheField>'
            )
        else:
            cache_fields_xml.append(
                f'<cacheField name="{col_name}" numFmtId="0"><sharedItems containsSemiMixedTypes="0"/></cacheField>'
            )

    pivot_cache_def = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<pivotCacheDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
        f'r:id="rId1" refreshOnLoad="1" recordCount="{num_rows}">'
        '<cacheSource type="worksheet">'
        f'<worksheetSource ref="{ref_range}" sheet="Inventario_Maestro_Datos"/>'
        '</cacheSource>'
        f'<cacheFields count="16">{"".join(cache_fields_xml)}</cacheFields>'
        '</pivotCacheDefinition>'
    )

    # Construir pivotCacheRecords1.xml
    records_xml = []
    for r in rows_data:
        fields_xml = []
        for col_idx in range(16):
            val = str(r[col_idx])
            if col_idx in shared_cols:
                idx = col_unique_vals[col_idx].index(val)
                fields_xml.append(f'<x v="{idx}"/>')
            else:
                fields_xml.append(f'<s v="{xml_escape(val)}"/>')
        records_xml.append(f'<r>{"".join(fields_xml)}</r>')

    pivot_cache_records = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<pivotCacheRecords xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        f'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" count="{num_rows}">'
        f'{"".join(records_xml)}'
        '</pivotCacheRecords>'
    )

    pivot_cache_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheRecords" '
        'Target="pivotCacheRecords1.xml"/>'
        '</Relationships>'
    )

    # Construir pivotTable1.xml:
    # - Page Fields (Filtros Superiores): col 12 (Capa_Almacenamiento), col 11 (Contiene_PII), col 7 (Obligatorio), col 14 (Flujo_Principal)
    # - Row Fields (Filas): col 1 (Dominio_Datos), col 2 (Entidad_Diccionario)
    # - Column Fields (Columnas): col 10 (Clasificacion_Sensibilidad)
    # - Data Field (Valores): Cuenta de ID_Atributo (col 0)
    pfields_xml = []
    for col_idx in range(16):
        if col_idx in (1, 2):
            axis = ' axis="axisRow"'
        elif col_idx == 10:
            axis = ' axis="axisCol"'
        elif col_idx in (12, 11, 7, 14):
            axis = ' axis="axisPage"'
        else:
            axis = ""

        if axis and col_idx in col_unique_vals:
            n_items = len(col_unique_vals[col_idx])
            item_tags = "".join(f'<item x="{i}"/>' for i in range(n_items)) + '<item t="default"/>'
            pfields_xml.append(
                f'<pivotField{axis} showAll="0">'
                f'<items count="{n_items + 1}">{item_tags}</items>'
                f'</pivotField>'
            )
        else:
            pfields_xml.append('<pivotField showAll="0"/>')

    pivot_table_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<pivotTableDefinition xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'name="TablaDinamicaInventarioAegisAI" cacheId="1" applyNumberFormats="0" applyBorderFormats="0" '
        'applyFontFormats="0" applyPatternFormats="0" applyAlignmentFormats="0" applyWidthHeightFormats="1" '
        'dataCaption="Total Atributos" updatedVersion="6" minRefreshableVersion="3" showCalcMbrs="0" '
        'useAutoFormatting="1" itemPrintTitles="1" createdVersion="6" indent="0" outline="1" outlineData="1" '
        'multipleFieldFilters="0">'
        '<location ref="B5:J34" firstHeaderRow="1" firstDataRow="2" firstDataCol="1" rowPageCount="4" colPageCount="1"/>'
        f'<pivotFields count="16">{"".join(pfields_xml)}</pivotFields>'
        '<rowFields count="2"><field x="1"/><field x="2"/></rowFields>'
        '<colFields count="1"><field x="10"/></colFields>'
        '<pageFields count="4">'
        '<pageField fld="12" hier="-1"/>'
        '<pageField fld="11" hier="-1"/>'
        '<pageField fld="7" hier="-1"/>'
        '<pageField fld="14" hier="-1"/>'
        '</pageFields>'
        '<dataFields count="1">'
        '<dataField name="Cuenta de Atributos" fld="0" subtotal="count" baseField="0" baseItem="0"/>'
        '</dataFields>'
        '<pivotTableStyleInfo name="PivotStyleMedium9" showRowHeaders="1" showColHeaders="1" '
        'showRowStripes="1" showColStripes="0" showLastColumn="1"/>'
        '</pivotTableDefinition>'
    )

    pivot_table_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheDefinition" '
        'Target="../pivotCache/pivotCacheDefinition1.xml"/>'
        '</Relationships>'
    )

    sheet2_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotTable" '
        'Target="../pivotTables/pivotTable1.xml"/>'
        '</Relationships>'
    )

    with tempfile.TemporaryDirectory(prefix="aegis-xlsx-pivot-") as tmpd:
        tmp_dir = Path(tmpd)
        with zipfile.ZipFile(xlsx_path, "r") as zin:
            zin.extractall(tmp_dir)

        # Crear directorios pivotCache y pivotTables
        (tmp_dir / "xl" / "pivotCache" / "_rels").mkdir(parents=True, exist_ok=True)
        (tmp_dir / "xl" / "pivotTables" / "_rels").mkdir(parents=True, exist_ok=True)
        (tmp_dir / "xl" / "worksheets" / "_rels").mkdir(parents=True, exist_ok=True)

        (tmp_dir / "xl" / "pivotCache" / "pivotCacheDefinition1.xml").write_text(pivot_cache_def, encoding="utf-8")
        (tmp_dir / "xl" / "pivotCache" / "pivotCacheRecords1.xml").write_text(pivot_cache_records, encoding="utf-8")
        (tmp_dir / "xl" / "pivotCache" / "_rels" / "pivotCacheDefinition1.xml.rels").write_text(pivot_cache_rels, encoding="utf-8")
        (tmp_dir / "xl" / "pivotTables" / "pivotTable1.xml").write_text(pivot_table_xml, encoding="utf-8")
        (tmp_dir / "xl" / "pivotTables" / "_rels" / "pivotTable1.xml.rels").write_text(pivot_table_rels, encoding="utf-8")
        (tmp_dir / "xl" / "worksheets" / "_rels" / "sheet2.xml.rels").write_text(sheet2_rels, encoding="utf-8")

        # Actualizar [Content_Types].xml
        ct_path = tmp_dir / "[Content_Types].xml"
        ct_xml = ct_path.read_text(encoding="utf-8")
        ct_insert = (
            '<Override PartName="/xl/pivotCache/pivotCacheDefinition1.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml"/>'
            '<Override PartName="/xl/pivotCache/pivotCacheRecords1.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml"/>'
            '<Override PartName="/xl/pivotTables/pivotTable1.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml"/>'
        )
        ct_xml = ct_xml.replace("</Types>", ct_insert + "</Types>")
        ct_path.write_text(ct_xml, encoding="utf-8")

        # Actualizar xl/_rels/workbook.xml.rels
        wb_rels_path = tmp_dir / "xl" / "_rels" / "workbook.xml.rels"
        wb_rels_xml = wb_rels_path.read_text(encoding="utf-8")
        wb_rels_insert = (
            '<Relationship Id="rIdPivotCache1" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/pivotCacheDefinition" '
            'Target="pivotCache/pivotCacheDefinition1.xml"/>'
        )
        wb_rels_xml = wb_rels_xml.replace("</Relationships>", wb_rels_insert + "</Relationships>")
        wb_rels_path.write_text(wb_rels_xml, encoding="utf-8")

        # Actualizar xl/workbook.xml con <pivotCaches>
        wb_path = tmp_dir / "xl" / "workbook.xml"
        wb_xml = wb_path.read_text(encoding="utf-8")
        pivot_caches_tag = '<pivotCaches><pivotCache cacheId="1" r:id="rIdPivotCache1"/></pivotCaches>'
        wb_xml = wb_xml.replace("</workbook>", pivot_caches_tag + "</workbook>")
        wb_path.write_text(wb_xml, encoding="utf-8")

        # Reempaquetar el archivo .xlsx
        tmp_xlsx = tmp_dir / "out.xlsx"
        with zipfile.ZipFile(tmp_xlsx, "w", zipfile.ZIP_DEFLATED) as zout:
            for file_path in sorted(tmp_dir.rglob("*")):
                if file_path.is_file() and file_path != tmp_xlsx:
                    arcname = file_path.relative_to(tmp_dir).as_posix()
                    zout.write(file_path, arcname)
        shutil.copyfile(tmp_xlsx, xlsx_path)


# --------------------------------------------------------------------------------------
# 5. Construcción Principal del Libro Excel con XlsxWriter
# --------------------------------------------------------------------------------------

def build_workbook() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    wb = xlsxwriter.Workbook(str(OUT_PATH))
    wb.set_properties({
        "title": "AegisAI Enterprise - Inventario de Datos, Diccionarios, Flujos y Repositorios",
        "subject": "Diccionario de Datos, Tabla Dinámica e Inventario de Repositorios y Flujos de Información",
        "author": "AegisAI Architecture Team",
        "company": "AegisAI Enterprise",
        "comments": "Generado automáticamente a partir de src/types.ts, server.ts y firestore.rules",
    })

    # ---------------- Paleta de Formatos ----------------
    f_banner = wb.add_format({
        "bold": True, "font_size": 15, "font_color": "#FFFFFF", "bg_color": "#0D2E63",
        "align": "left", "valign": "vcenter", "border": 0
    })
    f_subbanner = wb.add_format({
        "italic": True, "font_size": 10, "font_color": "#E8F0FE", "bg_color": "#174EA6",
        "align": "left", "valign": "vcenter"
    })
    f_sec_hdr = wb.add_format({
        "bold": True, "font_size": 11, "font_color": "#FFFFFF", "bg_color": "#1A73E8",
        "align": "left", "valign": "vcenter", "border": 1, "border_color": "#174EA6"
    })
    f_sec_hdr_amber = wb.add_format({
        "bold": True, "font_size": 11, "font_color": "#FFFFFF", "bg_color": "#B45309",
        "align": "left", "valign": "vcenter", "border": 1, "border_color": "#92400E"
    })
    f_sec_hdr_purple = wb.add_format({
        "bold": True, "font_size": 11, "font_color": "#FFFFFF", "bg_color": "#6D28D9",
        "align": "left", "valign": "vcenter", "border": 1, "border_color": "#5B21B6"
    })
    f_sec_hdr_teal = wb.add_format({
        "bold": True, "font_size": 11, "font_color": "#FFFFFF", "bg_color": "#0F766E",
        "align": "left", "valign": "vcenter", "border": 1, "border_color": "#115E59"
    })

    f_th = wb.add_format({
        "bold": True, "font_size": 10, "font_color": "#FFFFFF", "bg_color": "#1E293B",
        "align": "center", "valign": "vcenter", "text_wrap": True, "border": 1, "border_color": "#334155"
    })
    f_td = wb.add_format({
        "font_size": 9.5, "font_color": "#1E293B", "bg_color": "#FFFFFF",
        "align": "left", "valign": "top", "text_wrap": True, "border": 1, "border_color": "#E2E8F0"
    })
    f_td_alt = wb.add_format({
        "font_size": 9.5, "font_color": "#1E293B", "bg_color": "#F8FAFC",
        "align": "left", "valign": "top", "text_wrap": True, "border": 1, "border_color": "#E2E8F0"
    })
    f_td_code = wb.add_format({
        "font_name": "Consolas", "font_size": 9.5, "bold": True, "font_color": "#0369A1", "bg_color": "#F0F9FF",
        "align": "left", "valign": "top", "border": 1, "border_color": "#BAE6FD"
    })
    f_td_center = wb.add_format({
        "font_size": 9.5, "font_color": "#1E293B", "bg_color": "#FFFFFF",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#E2E8F0"
    })
    f_td_pii = wb.add_format({
        "font_size": 9.5, "bold": True, "font_color": "#991B1B", "bg_color": "#FEE2E2",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#FCA5A5"
    })
    f_td_sec = wb.add_format({
        "font_size": 9.5, "bold": True, "font_color": "#6B21A8", "bg_color": "#F3E8FF",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#D8B4FE"
    })
    f_td_worm = wb.add_format({
        "font_size": 9.5, "bold": True, "font_color": "#166534", "bg_color": "#DCFCE7",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#86EFAC"
    })

    # Formatos para el Buscador y Tablas Dinámicas
    f_filter_lbl = wb.add_format({
        "bold": True, "font_size": 10, "font_color": "#1E3A8A", "bg_color": "#DBEAFE",
        "align": "right", "valign": "vcenter", "border": 1, "border_color": "#93C5FD"
    })
    f_filter_input = wb.add_format({
        "bold": True, "font_size": 11, "font_color": "#0F172A", "bg_color": "#FEF9C3",
        "align": "center", "valign": "vcenter", "border": 2, "border_color": "#EAB308"
    })
    f_kpi_lbl = wb.add_format({
        "bold": True, "font_size": 9, "font_color": "#475569", "bg_color": "#F1F5F9",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#CBD5E1"
    })
    f_kpi_val = wb.add_format({
        "bold": True, "font_size": 15, "font_color": "#1D4ED8", "bg_color": "#FFFFFF",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#CBD5E1", "num_format": "#,##0"
    })
    f_piv_row = wb.add_format({
        "bold": True, "font_size": 9.5, "font_color": "#0F172A", "bg_color": "#F8FAFC",
        "align": "left", "valign": "vcenter", "border": 1, "border_color": "#CBD5E1"
    })
    f_piv_num = wb.add_format({
        "font_size": 9.5, "font_color": "#1E293B", "bg_color": "#FFFFFF",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#E2E8F0", "num_format": "#,##0"
    })
    f_piv_tot = wb.add_format({
        "bold": True, "font_size": 9.5, "font_color": "#0F172A", "bg_color": "#E2E8F0",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#94A3B8", "num_format": "#,##0"
    })
    f_piv_pct = wb.add_format({
        "bold": True, "font_size": 9.5, "font_color": "#174EA6", "bg_color": "#EFF6FF",
        "align": "center", "valign": "vcenter", "border": 1, "border_color": "#BFDBFE", "num_format": "0.0%"
    })

    # Enumerar los 135 atributos con su ID ATR-001..ATR-135
    numbered_rows: list[tuple[str, ...]] = []
    for i, r in enumerate(RAW_ATTRIBUTES, start=1):
        numbered_rows.append((f"ATR-{i:03d}",) + r)

    total_attrs = len(numbered_rows)
    last_inv_row = 4 + total_attrs  # Fila 4 es encabezado en Inventario_Maestro_Datos

    # Crear las 5 hojas en orden lógico
    ws_dash  = wb.add_worksheet("Tabla_Dinamica_y_Buscador")
    ws_piv   = wb.add_worksheet("Tabla_Dinamica_Nativa")
    ws_inv   = wb.add_worksheet("Inventario_Maestro_Datos")
    ws_repos = wb.add_worksheet("Catalogo_Repositorios")
    ws_flows = wb.add_worksheet("Flujos_Informacion")

    # ======================================================================================
    # HOJA 1: Tabla_Dinamica_y_Buscador (Buscador Interactivo + 4 Tablas Dinámicas en Vivo)
    # ======================================================================================
    ws_dash.hide_gridlines(2)
    ws_dash.set_row(0, 32)
    ws_dash.set_row(1, 20)
    ws_dash.merge_range("A1:N1", "  AEGIS AI ENTERPRISE · TABLA DINÁMICA Y BUSCADOR INTERACTIVO DEL INVENTARIO DE DATOS", f_banner)
    ws_dash.merge_range("A2:N2", "   Cambie las celdas amarillas para buscar y filtrar el inventario de datos. Las Tablas Dinámicas inferiores se actualizan automáticamente en tiempo real.", f_subbanner)

    # Anchos de columna en Hoja 1
    col_widths_dash = [3, 34, 15, 15, 15, 15, 15, 15, 15, 13, 13, 14, 14, 16]
    for c_idx, w in enumerate(col_widths_dash):
        ws_dash.set_column(c_idx, c_idx, w)

    # Panel de Buscador Interactivo (Filas 4 a 6)
    ws_dash.set_row(3, 24)
    ws_dash.merge_range("B4:N4", "  1. PANEL DE BÚSQUEDA Y FILTRADO INTERACTIVO DEL INVENTARIO DE DATOS (MODIFIQUE LAS CELDAS AMARILLAS)", f_sec_hdr)

    ws_dash.set_row(4, 26)
    ws_dash.write("B5", "Buscar Texto (Campo / Descripción):", f_filter_lbl)
    ws_dash.write("C5", "*", f_filter_input)
    ws_dash.write("D5", "Capa de Repositorio:", f_filter_lbl)
    ws_dash.write("E5", "TODAS", f_filter_input)
    ws_dash.write("F5", "Entidad / Diccionario:", f_filter_lbl)
    ws_dash.write("G5", "TODAS", f_filter_input)
    ws_dash.write("H5", "Clasificación / PII:", f_filter_lbl)
    ws_dash.write("I5", "TODAS", f_filter_input)
    ws_dash.write("J5", "Obligatoriedad:", f_filter_lbl)
    ws_dash.write("K5", "TODAS", f_filter_input)
    ws_dash.write("L5", "Coincidencias:", f_filter_lbl)
    ws_dash.write_formula("M5", f'=COUNTIF(Inventario_Maestro_Datos!Q5:Q{last_inv_row},"SI")', f_kpi_val, total_attrs)
    ws_dash.write("N5", "de " + str(total_attrs) + " campos", f_kpi_lbl)

    # Listas desplegables (Data Validation) en las celdas amarillas del buscador
    capas_list = ["TODAS", CAPA_1, CAPA_2, CAPA_3, CAPA_4, CAPA_5]
    entidades_list = [
        "TODAS", "AuditReport", "StandardBreakdown", "AISVSChapter", "PuntoProbado",
        "RemediationGuidance", "StandardChapter", "StandardControl", "CustomFramework",
        "SnapshotIntegrityStatus", "ApiKey", "AsyncAuditJob", "AdminSettings",
        "PlatformProfile", "GCPScanTelemetry", "GCPResourceItem", "SecurityAlertEvent",
        "UserSecurityContext", "AimsTelemetryState", "ClientQuotaWindow", "SessionRiskState"
    ]
    clasif_list = ["TODAS", CL_PII, CL_SEC, CL_CONF, CL_FOR, CL_PUB, CL_INT, CL_TEL]
    oblig_list = ["TODAS", "Obligatorio", "Opcional"]

    ws_dash.data_validation("E5", {"validate": "list", "source": capas_list})
    ws_dash.data_validation("G5", {"validate": "list", "source": entidades_list[:15]})
    ws_dash.data_validation("I5", {"validate": "list", "source": clasif_list})
    ws_dash.data_validation("K5", {"validate": "list", "source": oblig_list})

    # Tarjetas KPI Ejecutivas (Filas 7 y 8)
    ws_dash.set_row(6, 20)
    ws_dash.set_row(7, 26)
    kpis = [
        ("B", "Total Atributos Inventariados", f'=COUNTA(Inventario_Maestro_Datos!A5:A{last_inv_row})', total_attrs),
        ("C", "Entidades / Modelos de Datos", "=20", 20),
        ("D", "Campos con Datos Personales (PII)", f'=COUNTIF(Inventario_Maestro_Datos!L5:L{last_inv_row},"Sí (PII)")', 12),
        ("E", "Campos Secretos / Credenciales", f'=COUNTIF(Inventario_Maestro_Datos!K5:K{last_inv_row},"{CL_SEC}")', 4),
        ("F", "Campos Inmutables (WORM)", f'=COUNTIF(Inventario_Maestro_Datos!I5:I{last_inv_row},"Sí (Inmutable)")', 41),
        ("G", "Llaves Primarias y Foráneas", f'=COUNTIF(Inventario_Maestro_Datos!G5:G{last_inv_row},"*Llave*")', 16),
        ("H", "Repositorios Disponibles (5 Capas)", f'=COUNTA(Catalogo_Repositorios!A5:A{4+len(REPOSITORIES)})', len(REPOSITORIES)),
        ("I", "Colecciones Cloud Firestore", '=8', 8),
        ("J", "Flujos E2E y Endpoints API", f'=COUNTA(Flujos_Informacion!A5:A{4+len(INFORMATION_FLOWS)})', len(INFORMATION_FLOWS)),
    ]
    for col_let, lbl, form, cached in kpis:
        ws_dash.write(f"{col_let}7", lbl, f_kpi_lbl)
        ws_dash.write_formula(f"{col_let}8", form, f_kpi_val, cached)

    # ---------------- TABLA DINÁMICA 1: Entidad/Diccionario x Clasificación de Sensibilidad ----------------
    ws_dash.set_row(9, 24)
    ws_dash.merge_range("B10:N10", "  2. TABLA DINÁMICA 1 · DICCIONARIOS DE DATOS POR ENTIDAD vs. CLASIFICACIÓN DE SENSIBILIDAD, PII E INMUTABILIDAD", f_sec_hdr)

    ws_dash.set_row(10, 28)
    piv1_headers = [
        "Entidad / Diccionario de Datos",
        CL_PII, CL_SEC, CL_CONF, CL_FOR, CL_PUB, CL_INT, CL_TEL,
        "Total Campos", "% del Total", "Obligatorios", "Inmutables (WORM)", "Llaves (PK/FK)"
    ]
    for idx, h in enumerate(piv1_headers):
        ws_dash.write(10, 1 + idx, h, f_th)

    entities_ordered = [
        "AuditReport", "StandardBreakdown", "AISVSChapter", "PuntoProbado", "RemediationGuidance",
        "StandardChapter", "StandardControl", "CustomFramework", "SnapshotIntegrityStatus",
        "ApiKey", "AsyncAuditJob", "AdminSettings", "PlatformProfile",
        "GCPScanTelemetry", "GCPResourceItem", "SecurityAlertEvent", "UserSecurityContext",
        "AimsTelemetryState", "ClientQuotaWindow", "SessionRiskState"
    ]
    clasif_cols = [CL_PII, CL_SEC, CL_CONF, CL_FOR, CL_PUB, CL_INT, CL_TEL]

    start_piv1_row = 11  # 0-indexed (Excel row 12)
    for e_idx, ent in enumerate(entities_ordered):
        r_excel = start_piv1_row + e_idx + 1
        ws_dash.set_row(start_piv1_row + e_idx, 20)
        ws_dash.write(start_piv1_row + e_idx, 1, ent, f_piv_row)

        ent_rows = [r for r in numbered_rows if r[2] == ent]
        for c_i, cl_name in enumerate(clasif_cols):
            col_let = chr(ord("C") + c_i)
            cnt = sum(1 for r in ent_rows if r[10] == cl_name)
            formula = f'=COUNTIFS(Inventario_Maestro_Datos!$C$5:$C${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$K$5:$K${last_inv_row},{col_let}$11)'
            ws_dash.write_formula(start_piv1_row + e_idx, 2 + c_i, formula, f_piv_num, cnt)

        tot_ent = len(ent_rows)
        ws_dash.write_formula(start_piv1_row + e_idx, 9, f"=SUM(C{r_excel}:I{r_excel})", f_piv_tot, tot_ent)
        ws_dash.write_formula(start_piv1_row + e_idx, 10, f"=J{r_excel}/$J$32", f_piv_pct, tot_ent / total_attrs)

        cnt_req = sum(1 for r in ent_rows if r[7] == "Obligatorio")
        ws_dash.write_formula(
            start_piv1_row + e_idx, 11,
            f'=COUNTIFS(Inventario_Maestro_Datos!$C$5:$C${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$H$5:$H${last_inv_row},"Obligatorio")',
            f_piv_num, cnt_req
        )
        cnt_worm = sum(1 for r in ent_rows if r[8] == "Sí (Inmutable)")
        ws_dash.write_formula(
            start_piv1_row + e_idx, 12,
            f'=COUNTIFS(Inventario_Maestro_Datos!$C$5:$C${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$I$5:$I${last_inv_row},"Sí (Inmutable)")',
            f_piv_num, cnt_worm
        )
        cnt_pk = sum(1 for r in ent_rows if "Llave" in r[6])
        ws_dash.write_formula(
            start_piv1_row + e_idx, 13,
            f'=COUNTIFS(Inventario_Maestro_Datos!$C$5:$C${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$G$5:$G${last_inv_row},"*Llave*")',
            f_piv_num, cnt_pk
        )

    # Fila de Totales de Tabla Dinámica 1 (Excel row 32, 0-indexed 31)
    tot_r_idx = start_piv1_row + len(entities_ordered)
    ws_dash.set_row(tot_r_idx, 22)
    ws_dash.write(tot_r_idx, 1, "TOTAL GENERAL DEL DICCIONARIO", f_piv_tot)
    for c_i, cl_name in enumerate(clasif_cols):
        col_let = chr(ord("C") + c_i)
        cnt = sum(1 for r in numbered_rows if r[10] == cl_name)
        ws_dash.write_formula(tot_r_idx, 2 + c_i, f"=SUM({col_let}12:{col_let}31)", f_piv_tot, cnt)
    ws_dash.write_formula(tot_r_idx, 9, "=SUM(J12:J31)", f_piv_tot, total_attrs)
    ws_dash.write_formula(tot_r_idx, 10, "=SUM(K12:K31)", f_piv_pct, 1.0)
    ws_dash.write_formula(tot_r_idx, 11, "=SUM(L12:L31)", f_piv_tot, sum(1 for r in numbered_rows if r[7] == "Obligatorio"))
    ws_dash.write_formula(tot_r_idx, 12, "=SUM(M12:M31)", f_piv_tot, sum(1 for r in numbered_rows if r[8] == "Sí (Inmutable)"))
    ws_dash.write_formula(tot_r_idx, 13, "=SUM(N12:N31)", f_piv_tot, sum(1 for r in numbered_rows if "Llave" in r[6]))

    # ---------------- TABLA DINÁMICA 2: Capa de Almacenamiento x Tipo de Dato ----------------
    ws_dash.set_row(33, 24)
    ws_dash.merge_range("B34:N34", "  3. TABLA DINÁMICA 2 · DISTRIBUCIÓN DEL INVENTARIO POR CAPA DE REPOSITORIO vs. TIPO DE DATO Y PII", f_sec_hdr_amber)

    ws_dash.set_row(34, 26)
    piv2_headers = [
        "Capa de Almacenamiento / Repositorio",
        "string", "number", "boolean", "enum", "array/list", "object/map",
        "Total Atributos", "% Inventario", "Contienen PII", "Secretos", "Inmutables WORM", "Repositorios en Capa"
    ]
    for idx, h in enumerate(piv2_headers):
        ws_dash.write(34, 1 + idx, h, f_th)

    capas_ordered = [CAPA_1, CAPA_2, CAPA_3, CAPA_4, CAPA_5]
    tipos_cols = ["string", "number", "boolean", "enum", "array/list", "object/map"]
    start_piv2_row = 35  # Excel row 36
    for k_idx, capa in enumerate(capas_ordered):
        r_excel = start_piv2_row + k_idx + 1
        ws_dash.set_row(start_piv2_row + k_idx, 21)
        ws_dash.write(start_piv2_row + k_idx, 1, capa, f_piv_row)
        capa_rows = [r for r in numbered_rows if r[12] == capa]

        for t_i, t_name in enumerate(tipos_cols):
            col_let = chr(ord("C") + t_i)
            cnt = sum(1 for r in capa_rows if r[4] == t_name)
            formula = f'=COUNTIFS(Inventario_Maestro_Datos!$M$5:$M${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$E$5:$E${last_inv_row},{col_let}$35)'
            ws_dash.write_formula(start_piv2_row + k_idx, 2 + t_i, formula, f_piv_num, cnt)

        tot_c = len(capa_rows)
        ws_dash.write_formula(start_piv2_row + k_idx, 8, f"=SUM(C{r_excel}:H{r_excel})", f_piv_tot, tot_c)
        ws_dash.write_formula(start_piv2_row + k_idx, 9, f"=I{r_excel}/$I$41", f_piv_pct, tot_c / total_attrs)

        cnt_pii = sum(1 for r in capa_rows if r[11] == "Sí (PII)")
        ws_dash.write_formula(
            start_piv2_row + k_idx, 10,
            f'=COUNTIFS(Inventario_Maestro_Datos!$M$5:$M${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$L$5:$L${last_inv_row},"Sí (PII)")',
            f_piv_num, cnt_pii
        )
        cnt_sec = sum(1 for r in capa_rows if r[10] == CL_SEC)
        ws_dash.write_formula(
            start_piv2_row + k_idx, 11,
            f'=COUNTIFS(Inventario_Maestro_Datos!$M$5:$M${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$K$5:$K${last_inv_row},"{CL_SEC}")',
            f_piv_num, cnt_sec
        )
        cnt_w = sum(1 for r in capa_rows if r[8] == "Sí (Inmutable)")
        ws_dash.write_formula(
            start_piv2_row + k_idx, 12,
            f'=COUNTIFS(Inventario_Maestro_Datos!$M$5:$M${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$I$5:$I${last_inv_row},"Sí (Inmutable)")',
            f_piv_num, cnt_w
        )
        cnt_rep = sum(1 for rep in REPOSITORIES if rep[2] == capa)
        ws_dash.write_formula(
            start_piv2_row + k_idx, 13,
            f'=COUNTIF(Catalogo_Repositorios!$C$5:$C${4+len(REPOSITORIES)},$B{r_excel})',
            f_piv_tot, cnt_rep
        )

    tot2_idx = start_piv2_row + len(capas_ordered)  # Excel row 41
    ws_dash.set_row(tot2_idx, 22)
    ws_dash.write(tot2_idx, 1, "TOTAL POR CAPA DE PERSISTENCIA", f_piv_tot)
    for t_i, t_name in enumerate(tipos_cols):
        col_let = chr(ord("C") + t_i)
        cnt = sum(1 for r in numbered_rows if r[4] == t_name)
        ws_dash.write_formula(tot2_idx, 2 + t_i, f"=SUM({col_let}36:{col_let}40)", f_piv_tot, cnt)
    ws_dash.write_formula(tot2_idx, 8, "=SUM(I36:I40)", f_piv_tot, total_attrs)
    ws_dash.write_formula(tot2_idx, 9, "=SUM(J36:J40)", f_piv_pct, 1.0)
    ws_dash.write_formula(tot2_idx, 10, "=SUM(K36:K40)", f_piv_tot, sum(1 for r in numbered_rows if r[11] == "Sí (PII)"))
    ws_dash.write_formula(tot2_idx, 11, "=SUM(L36:L40)", f_piv_tot, sum(1 for r in numbered_rows if r[10] == CL_SEC))
    ws_dash.write_formula(tot2_idx, 12, "=SUM(M36:M40)", f_piv_tot, sum(1 for r in numbered_rows if r[8] == "Sí (Inmutable)"))
    ws_dash.write_formula(tot2_idx, 13, "=SUM(N36:N40)", f_piv_tot, len(REPOSITORIES))

    # ---------------- TABLA DINÁMICA 3: Flujo de Información E2E x Dominio de Datos ----------------
    ws_dash.set_row(42, 24)
    ws_dash.merge_range("B43:N43", "  4. TABLA DINÁMICA 3 · TRAZABILIDAD DE ATRIBUTOS POR ETAPA DEL FLUJO DE INFORMACIÓN (F-01 A F-10)", f_sec_hdr_purple)

    ws_dash.set_row(43, 26)
    piv3_headers = [
        "Etapa del Flujo de Información E2E",
        "Total Campos", "% del Flujo", "Campos PII", "Campos Confidenciales", "Campos Forenses/Seg.", "Campos Telemetría",
        "Campos Obligatorios", "Campos Inmutables", "Endpoints / Procesos en Etapa"
    ]
    for idx, h in enumerate(piv3_headers):
        ws_dash.write(43, 1 + idx, h, f_th)

    flujos_etapas = [
        "F-01 · Ingesta Multimodal",
        "F-02 · Identidad Zero-Trust",
        "F-03 · Guardrails y Anti-DoW",
        "F-04 · Escaneo GCP en Vivo",
        "F-05 · Catálogos y BYOF SHA-256",
        "F-06 · Motor Map-Reduce IA",
        "F-07 · Síntesis de Remediación",
        "F-08 · Persistencia Dual + Saga",
        "F-09 · Streaming SSE y Reportes",
        "F-10 · Telemetría AIMS y SIEM",
    ]
    start_piv3_row = 44  # Excel row 45
    for f_idx, fl_name in enumerate(flujos_etapas):
        r_excel = start_piv3_row + f_idx + 1
        ws_dash.set_row(start_piv3_row + f_idx, 20)
        ws_dash.write(start_piv3_row + f_idx, 1, fl_name, f_piv_row)
        fl_rows = [r for r in numbered_rows if r[14] == fl_name]
        tot_f = len(fl_rows)

        ws_dash.write_formula(
            start_piv3_row + f_idx, 2,
            f'=COUNTIF(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel})',
            f_piv_tot, tot_f
        )
        ws_dash.write_formula(start_piv3_row + f_idx, 3, f"=C{r_excel}/$C$55", f_piv_pct, tot_f / total_attrs)
        ws_dash.write_formula(
            start_piv3_row + f_idx, 4,
            f'=COUNTIFS(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$L$5:$L${last_inv_row},"Sí (PII)")',
            f_piv_num, sum(1 for r in fl_rows if r[11] == "Sí (PII)")
        )
        ws_dash.write_formula(
            start_piv3_row + f_idx, 5,
            f'=COUNTIFS(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$K$5:$K${last_inv_row},"{CL_CONF}")',
            f_piv_num, sum(1 for r in fl_rows if r[10] == CL_CONF)
        )
        ws_dash.write_formula(
            start_piv3_row + f_idx, 6,
            f'=COUNTIFS(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$K$5:$K${last_inv_row},"{CL_FOR}")',
            f_piv_num, sum(1 for r in fl_rows if r[10] == CL_FOR)
        )
        ws_dash.write_formula(
            start_piv3_row + f_idx, 7,
            f'=COUNTIFS(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$K$5:$K${last_inv_row},"{CL_TEL}")',
            f_piv_num, sum(1 for r in fl_rows if r[10] == CL_TEL)
        )
        ws_dash.write_formula(
            start_piv3_row + f_idx, 8,
            f'=COUNTIFS(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$H$5:$H${last_inv_row},"Obligatorio")',
            f_piv_num, sum(1 for r in fl_rows if r[7] == "Obligatorio")
        )
        ws_dash.write_formula(
            start_piv3_row + f_idx, 9,
            f'=COUNTIFS(Inventario_Maestro_Datos!$O$5:$O${last_inv_row},$B{r_excel},Inventario_Maestro_Datos!$I$5:$I${last_inv_row},"Sí (Inmutable)")',
            f_piv_num, sum(1 for r in fl_rows if r[8] == "Sí (Inmutable)")
        )
        cnt_ep = sum(1 for flw in INFORMATION_FLOWS if flw[1] == fl_name)
        ws_dash.write_formula(
            start_piv3_row + f_idx, 10,
            f'=COUNTIF(Flujos_Informacion!$B$5:$B${4+len(INFORMATION_FLOWS)},$B{r_excel})',
            f_piv_tot, cnt_ep
        )

    tot3_idx = start_piv3_row + len(flujos_etapas)  # Excel row 55
    ws_dash.set_row(tot3_idx, 22)
    ws_dash.write(tot3_idx, 1, "TOTAL EN FLUJOS DE INFORMACIÓN", f_piv_tot)
    ws_dash.write_formula(tot3_idx, 2, "=SUM(C45:C54)", f_piv_tot, total_attrs)
    ws_dash.write_formula(tot3_idx, 3, "=SUM(D45:D54)", f_piv_pct, 1.0)
    for col_i, col_let in enumerate(["E", "F", "G", "H", "I", "J", "K"], start=4):
        ws_dash.write_formula(tot3_idx, col_i, f"=SUM({col_let}45:{col_let}54)", f_piv_tot)

    # ======================================================================================
    # HOJA 2: Tabla_Dinamica_Nativa (Contenedor para el objeto OOXML PivotTable)
    # ======================================================================================
    ws_piv.hide_gridlines(2)
    ws_piv.set_row(0, 32)
    ws_piv.set_row(1, 20)
    ws_piv.merge_range("A1:K1", "  AEGIS AI ENTERPRISE · TABLA DINÁMICA NATIVA DE EXCEL (ARRASTRAR Y SOLTAR CAMPOS)", f_banner)
    ws_piv.merge_range("A2:K2", "  Haga clic dentro de la tabla dinámica para abrir el panel lateral de 'Campos de tabla dinámica' en Excel y filtrar por Capa, PII, Obligatoriedad o Flujo.", f_subbanner)
    ws_piv.set_column("A:A", 3)
    ws_piv.set_column("B:B", 36)
    ws_piv.set_column("C:K", 18)

    # ======================================================================================
    # HOJA 3: Inventario_Maestro_Datos (135 Atributos con Buscador Reactivo + Autofiltro)
    # ======================================================================================
    ws_inv.set_row(0, 32)
    ws_inv.set_row(1, 20)
    ws_inv.merge_range("A1:Q1", "  AEGIS AI ENTERPRISE · DICCIONARIO E INVENTARIO MAESTRO DE DATOS (135 ATRIBUTOS DOCUMENTADOS)", f_banner)
    ws_inv.merge_range("A2:Q2", "  Use los filtros de cabecera de la tabla o el Buscador Interactivo de la Hoja 1 (columna 'Coincide_Busqueda' = SI). Incluye reglas de firestore.rules y tipos TypeScript.", f_subbanner)
    ws_inv.set_row(3, 28)

    inv_widths = [12, 28, 22, 26, 13, 26, 18, 13, 16, 32, 22, 12, 34, 34, 26, 58, 16]
    for idx, w in enumerate(inv_widths):
        ws_inv.set_column(idx, idx, w)

    inv_table_data = []
    for idx, r in enumerate(numbered_rows):
        excel_r = 5 + idx
        # Fórmula que evalúa los 5 criterios del Buscador Interactivo en Tabla_Dinamica_y_Buscador
        match_formula = (
            f'=IF(AND('
            f'OR(Tabla_Dinamica_y_Buscador!$C$5="*",Tabla_Dinamica_y_Buscador!$C$5="",'
            f'ISNUMBER(SEARCH(Tabla_Dinamica_y_Buscador!$C$5,D{excel_r}&" "&C{excel_r}&" "&N{excel_r}&" "&P{excel_r}))),'
            f'OR(Tabla_Dinamica_y_Buscador!$E$5="TODAS",M{excel_r}=Tabla_Dinamica_y_Buscador!$E$5),'
            f'OR(Tabla_Dinamica_y_Buscador!$G$5="TODAS",C{excel_r}=Tabla_Dinamica_y_Buscador!$G$5),'
            f'OR(Tabla_Dinamica_y_Buscador!$I$5="TODAS",K{excel_r}=Tabla_Dinamica_y_Buscador!$I$5),'
            f'OR(Tabla_Dinamica_y_Buscador!$K$5="TODAS",H{excel_r}=Tabla_Dinamica_y_Buscador!$K$5)'
            f'),"SI","NO")'
        )
        inv_table_data.append(list(r) + [match_formula])
        ws_inv.set_row(4 + idx, 22)

    ws_inv.add_table(3, 0, last_inv_row - 1, 16, {
        "name": "TblInventarioDatos",
        "style": "Table Style Medium 2",
        "data": inv_table_data,
        "columns": [
            {"header": "ID_Atributo", "format": f_td_center},
            {"header": "Dominio_Datos", "format": f_td},
            {"header": "Entidad_Diccionario", "format": f_td_code},
            {"header": "Campo_Atributo", "format": f_td_code},
            {"header": "Tipo_Dato", "format": f_td_center},
            {"header": "Tipo_Detallado_TS", "format": f_td},
            {"header": "Llave_Rol", "format": f_td_center},
            {"header": "Obligatorio", "format": f_td_center},
            {"header": "Inmutable_WORM", "format": f_td_center},
            {"header": "Restriccion_Validacion", "format": f_td},
            {"header": "Clasificacion_Sensibilidad", "format": f_td_center},
            {"header": "Contiene_PII", "format": f_td_center},
            {"header": "Capa_Almacenamiento", "format": f_td},
            {"header": "Repositorio_Coleccion", "format": f_td},
            {"header": "Flujo_Principal", "format": f_td},
            {"header": "Descripcion_Funcional_y_Normativa", "format": f_td},
            {"header": "Coincide_Busqueda", "format": f_td_center},
        ]
    })
    ws_inv.freeze_panes(4, 4)

    # Formato condicional para resaltar PII, Secretos e Inmutables
    ws_inv.conditional_format(f"L5:L{last_inv_row}", {
        "type": "cell", "criteria": "equal to", "value": '"Sí (PII)"', "format": f_td_pii
    })
    ws_inv.conditional_format(f"K5:K{last_inv_row}", {
        "type": "cell", "criteria": "equal to", "value": f'"{CL_SEC}"', "format": f_td_sec
    })
    ws_inv.conditional_format(f"I5:I{last_inv_row}", {
        "type": "cell", "criteria": "equal to", "value": '"Sí (Inmutable)"', "format": f_td_worm
    })

    # ======================================================================================
    # HOJA 4: Catalogo_Repositorios (20 Repositorios Disponibles en 5 Capas)
    # ======================================================================================
    ws_repos.set_row(0, 32)
    ws_repos.set_row(1, 20)
    ws_repos.merge_range("A1:O1", "  AEGIS AI ENTERPRISE · CATÁLOGO DE REPOSITORIOS DE DATOS DISPONIBLES (20 ALMACENES EN 5 CAPAS)", f_banner)
    ws_repos.merge_range("A2:O2", "  Inventario completo de bases de datos Cloud Firestore (nam5), sistema de archivos local inmutable (/app/config), caché tmpfs (/tmp), catálogos estáticos y bóvedas GCP.", f_subbanner)
    ws_repos.set_row(3, 28)

    repo_widths = [11, 32, 34, 30, 36, 30, 22, 28, 28, 30, 28, 28, 28, 26, 55]
    for idx, w in enumerate(repo_widths):
        ws_repos.set_column(idx, idx, w)

    for idx in range(len(REPOSITORIES)):
        ws_repos.set_row(4 + idx, 28)

    ws_repos.add_table(3, 0, 3 + len(REPOSITORIES), 14, {
        "name": "TblRepositorios",
        "style": "Table Style Medium 10",
        "data": [list(r) for r in REPOSITORIES],
        "columns": [
            {"header": "ID_Repo", "format": f_td_center},
            {"header": "Nombre_Repositorio", "format": f_td_code},
            {"header": "Capa_Almacenamiento", "format": f_td},
            {"header": "Tecnologia_Motor", "format": f_td},
            {"header": "Ruta_Ubicacion", "format": f_td_code},
            {"header": "Entidades_Almacenadas", "format": f_td},
            {"header": "Formato_Datos", "format": f_td_center},
            {"header": "Acceso_Cliente_Web", "format": f_td},
            {"header": "Acceso_Servidor_Backend", "format": f_td},
            {"header": "Mecanismo_Autenticacion", "format": f_td},
            {"header": "Politica_Mutabilidad_WORM", "format": f_td},
            {"header": "Cifrado_y_Seguridad", "format": f_td},
            {"header": "Persistencia_y_SLA", "format": f_td},
            {"header": "Controles_Normativos", "format": f_td_center},
            {"header": "Descripcion_Detallada", "format": f_td},
        ]
    })
    ws_repos.freeze_panes(4, 2)

    # ======================================================================================
    # HOJA 5: Flujos_Informacion (17 Flujos E2E y Endpoints API/SSE)
    # ======================================================================================
    ws_flows.set_row(0, 32)
    ws_flows.set_row(1, 20)
    ws_flows.merge_range("A1:M1", "  AEGIS AI ENTERPRISE · MATRIZ DE FLUJOS DE INFORMACIÓN END-TO-END Y ENDPOINTS API / SSE", f_banner)
    ws_flows.merge_range("A2:M2", "  Trazabilidad desde el actor origen y endpoint HTTP/SSE hasta los procesadores internos, guardrails de seguridad y repositorios de destino.", f_subbanner)
    ws_flows.set_row(3, 28)

    flow_widths = [11, 26, 34, 30, 26, 34, 34, 28, 26, 28, 24, 28, 56]
    for idx, w in enumerate(flow_widths):
        ws_flows.set_column(idx, idx, w)

    for idx in range(len(INFORMATION_FLOWS)):
        ws_flows.set_row(4 + idx, 28)

    ws_flows.add_table(3, 0, 3 + len(INFORMATION_FLOWS), 12, {
        "name": "TblFlujosInformacion",
        "style": "Table Style Medium 12",
        "data": [list(f) for f in INFORMATION_FLOWS],
        "columns": [
            {"header": "ID_Flujo", "format": f_td_center},
            {"header": "Etapa_Pipeline", "format": f_td},
            {"header": "Nombre_Flujo", "format": f_td},
            {"header": "Metodo_Endpoint_Funcion", "format": f_td_code},
            {"header": "Actor_Origen", "format": f_td},
            {"header": "Componente_Procesador", "format": f_td},
            {"header": "Repositorios_Involucrados", "format": f_td},
            {"header": "Entidades_Datos", "format": f_td_code},
            {"header": "Protocolo_Formato", "format": f_td},
            {"header": "Autenticacion_y_Guardrail", "format": f_td},
            {"header": "Controles_AISVS_ISO", "format": f_td_center},
            {"header": "SLA_y_Limites_Cuota", "format": f_td},
            {"header": "Descripcion_Tecnica_del_Flujo", "format": f_td},
        ]
    })
    ws_flows.freeze_panes(4, 3)

    wb.close()
    inject_native_pivottable(OUT_PATH, numbered_rows)
    print(f"✓ {OUT_PATH.relative_to(REPO)} ({OUT_PATH.stat().st_size:,} bytes, {total_attrs} atributos, {len(REPOSITORIES)} repositorios, {len(INFORMATION_FLOWS)} flujos)")


if __name__ == "__main__":
    build_workbook()

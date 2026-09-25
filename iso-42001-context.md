# ISO/IEC 42001:2023 - Sistema de Gestión de Inteligencia Artificial (AIMS)

La norma internacional ISO/IEC 42001:2023 especifica los requisitos y proporciona directrices para establecer, implementar, mantener y mejorar continuamente un Sistema de Gestión de Inteligencia Artificial (AIMS) en organizaciones. Está estructurada en dos partes complementarias: las Cláusulas Normativas Mandatorias (4 a 10) y los Controles Operacionales del Anexo A (A.2 a A.10).

Los niveles de verificación asignados a los controles son:
- **Nivel 1 (L1 - Fundacional / Mandatorio)**: Requisitos básicos de gobernanza, políticas de IA y transparencia requeridos para cualquier sistema de IA.
- **Nivel 2 (L2 - Estándar Operacional)**: Procedimientos formales de ciclo de vida, pruebas de sesgo, trazabilidad de datos y monitoreo de drift.
- **Nivel 3 (L3 - Crítico / Alto Riesgo)**: Sistemas de IA con toma de decisiones de alto impacto, que exigen auditorías externas, comités de ética y redundancia de supervisión humana.

---

## Clause 4: Contexto de la Organización (Context of the Organization)
**Objetivo de Control**: Comprender el entorno interno y externo de la organización, las expectativas de las partes interesadas y determinar el alcance formal del AIMS.
- **Clause 4.1 (L1)**: Comprensión de la organización y de su contexto. Identificación de factores internos y externos (legales, éticos, comerciales) que afecten la capacidad del AIMS para lograr sus resultados previstos.
- **Clause 4.2 (L1)**: Comprensión de las necesidades y expectativas de las partes interesadas (usuarios finales, reguladores, empleados, socios de negocio).
- **Clause 4.3 (L1)**: Determinación del alcance del sistema de gestión de IA. Documentación explícita de los límites organizacionales, geográficos y tecnológicos de los sistemas de IA cubiertos.
- **Clause 4.4 (L2)**: Sistema de gestión de IA. Establecimiento, implementación, mantenimiento y mejora continua de los procesos del AIMS y sus interacciones.

## Clause 5: Liderazgo y Compromiso (Leadership and Commitment)
**Objetivo de Control**: Asegurar el involucramiento directo y la rendición de cuentas de la alta dirección en la gobernanza de la IA.
- **Clause 5.1 (L1)**: Liderazgo y compromiso de la alta dirección. Asignación formal de recursos, integración de requisitos del AIMS en los procesos de negocio y fomento de una cultura de IA ética y segura.
- **Clause 5.2 (L1)**: Política de Inteligencia Artificial. La alta dirección debe establecer, aprobar y comunicar una política de IA alineada con los objetivos estratégicos, el cumplimiento normativo y la gestión de riesgos.
- **Clause 5.3 (L2)**: Roles, responsabilidades y autoridades organizacionales. Asignación documentada y segregada de responsabilidades para la operación del AIMS y el ciclo de vida de la IA.

## Clause 6: Planificación del AIMS (Planning)
**Objetivo de Control**: Identificar riesgos y oportunidades en los sistemas de IA y planificar objetivos medibles y gestión del cambio.
- **Clause 6.1 (L2)**: Acciones para abordar riesgos y oportunidades. Identificación metódica de riesgos derivados de la autonomía de la IA, sesgos algorítmicos, fallos técnicos y ciberataques.
- **Clause 6.2 (L2)**: Objetivos de IA y planificación para lograrlos. Metas cuantitativas y cualitativas de precisión, explicabilidad, equidad y seguridad medibles en el tiempo.
- **Clause 6.3 (L2)**: Planificación de los cambios. Procedimiento formal para gestionar modificaciones en la arquitectura, reentrenamiento de modelos o cambios de proveedores de LLM.

## Clause 7: Soporte y Recursos (Support)
**Objetivo de Control**: Proporcionar los recursos humanos, de infraestructura, competencia e información documentada requeridos para el AIMS.
- **Clause 7.1 (L1)**: Recursos. Determinación y provisión de capacidad de cómputo, almacenamiento, herramientas de observabilidad y personal calificado.
- **Clause 7.2 (L2)**: Competencia del personal. Verificación de que las personas responsables de diseñar, evaluar y operar sistemas de IA cuenten con educación, formación y experiencia demostrable.
- **Clause 7.3 (L2)**: Concienciación. Programas de capacitación periódica en riesgos de IA, sesgos, ética y ciberseguridad para desarrolladores y usuarios clave.
- **Clause 7.4 (L1)**: Comunicación interna y externa. Canales claros para comunicar políticas, incidentes y capacidades de los sistemas de IA.
- **Clause 7.5 (L2)**: Información documentada. Creación, actualización, control de versiones y retención segura de las especificaciones, modelos y registros de auditoría del AIMS.

## Clause 8: Operación del Sistema de Gestión de IA (Operation)
**Objetivo de Control**: Planificar, implementar y controlar los procesos operativos para la gestión de riesgos y la evaluación de impacto de los sistemas de IA.
- **Clause 8.1 (L1)**: Planificación y control operacional. Definición de criterios operacionales y controles de ingeniería para el desarrollo y uso de la IA.
- **Clause 8.2 (L2)**: Evaluación de riesgos de IA. Aplicación periódica de metodologías de evaluación de riesgos considerando la probabilidad e impacto de fallos del modelo.
- **Clause 8.3 (L2)**: Tratamiento de riesgos de IA. Selección e implementación de opciones de tratamiento de riesgos basadas en los controles del Anexo A.
- **Clause 8.4 (L1)**: Evaluación de impacto del sistema de IA (AIIA). Realización obligatoria y documentada de una evaluación de impacto antes de poner en producción cualquier sistema de IA, evaluando derechos individuales y sociales.

## Clause 9: Evaluación del Desempeño (Performance Evaluation)
**Objetivo de Control**: Monitorear, medir, analizar y evaluar el desempeño del AIMS y la eficacia de los controles de IA mediante auditorías internas y revisiones directivas.
- **Clause 9.1 (L2)**: Seguimiento, medición, análisis y evaluación. Monitoreo continuo de métricas clave (drift, latencia, tasa de alucinación, tasa de error, falsos positivos).
- **Clause 9.2 (L2)**: Auditoría interna del AIMS. Ejecución de auditorías internas planificadas a intervalos regulares con auditores independientes para verificar conformidad con ISO 42001.
- **Clause 9.3 (L1)**: Revisión por la dirección. Revisiones formales periódicas por parte de la alta dirección sobre el estado de las acciones previas, cambios en riesgos y oportunidades de mejora.

## Clause 10: Mejora Continua (Improvement)
**Objetivo de Control**: Gestionar no conformidades, incidentes de IA e implementar acciones correctivas para la mejora sostenida del AIMS.
- **Clause 10.1 (L1)**: No conformidad y acciones correctivas. Reaccionar ante incidentes o fallos de seguridad de IA, investigar la causa raíz, mitigar las consecuencias y registrar evidencia de cierre.
- **Clause 10.2 (L2)**: Mejora continua. Optimizar progresivamente la idoneidad, adecuación y eficacia del sistema de gestión de IA.

---

## A.2: Políticas Relacionadas con la IA (AI Policies)
**Objetivo de Control**: Proveer directrices formales y alineadas para el desarrollo y uso seguro y ético de la IA.
- **A.2.1 (L1)**: Política de IA. Definición de una política formal aprobada por la dirección que establezca el compromiso con la transparencia, equidad, privacidad y robustez.
- **A.2.2 (L2)**: Alineación de políticas de IA. Coherencia e integración de la política de IA con ISO 27001 (Seguridad de la Información), ISO 27701 (Privacidad) y gobierno corporativo.
- **A.2.3 (L2)**: Revisión de la política de IA. Evaluaciones anuales de la política para adaptarse a cambios regulatorios (ej. EU AI Act, regulaciones locales).

## A.3: Organización Interna (Internal Organization)
**Objetivo de Control**: Establecer una estructura organizacional clara con asignación formal de roles y segregación de funciones en el ciclo de vida de la IA.
- **A.3.1 (L1)**: Roles y responsabilidades de IA. Designación explícita de roles: Oficial de Cumplimiento de IA, Líder Técnico de IA, Ingeniero de MLOps y Comité de Ética de IA.
- **A.3.2 (L2)**: Segregación de funciones. Separación clara entre los equipos que desarrollan/entrenan modelos y los equipos independientes de validación de seguridad y QA.
- **A.3.3 (L3)**: Canales de escalamiento ético y de seguridad. Procedimientos para que los empleados reporten sesgos, alucinaciones graves o violaciones de políticas sin represalias.

## A.4: Recursos para Sistemas de IA (Resources for AI Systems)
**Objetivo de Control**: Asegurar la provisión adecuada y segura de infraestructura, datos y talento especializado.
- **A.4.1 (L1)**: Recursos humanos y capacitación. Competencia técnica especializada en arquitecturas LLM, RAG y seguridad defensiva en IA.
- **A.4.2 (L2)**: Infraestructura y herramientas de IA. Ambientes de desarrollo, experimentación y producción aislados con plataformas de MLOps auditadas.
- **A.4.3 (L2)**: Gestión de recursos de datos. Almacenamiento seguro, escalable y gobernado para datasets de entrenamiento, validación y vector databases.

## A.5: Evaluación de Impacto de los Sistemas de IA (AI System Impact Assessment)
**Objetivo de Control**: Evaluar formalmente y mitigar el impacto potencial del sistema de IA en individuos, grupos y la sociedad.
- **A.5.1 (L1)**: Metodología de Evaluación de Impacto de IA (AIIA). Procedimiento formal documentado previo al despliegue para analizar riesgos a la privacidad, equidad y derechos fundamentales.
- **A.5.2 (L2)**: Evaluación de impacto en individuos y grupos protegidos. Identificación activa de sesgos algorítmicos o discriminación potencial en modelos de decisión automatizada.
- **A.5.3 (L2)**: Evaluación de impacto a lo largo del ciclo de vida. Re-evaluación del impacto ante cambios sustanciales en el modelo o en el contexto de uso.

## A.6: Ciclo de Vida del Sistema de IA (AI System Lifecycle)
**Objetivo de Control**: Gestionar de forma estructurada cada fase: concepción, diseño, datos, entrenamiento, validación, despliegue y retiro.
- **A.6.1 (L1)**: Definición de requisitos y especificación de diseño. Documentación de los objetivos del sistema, métricas de éxito y límites operacionales.
- **A.6.2 (L2)**: Verificación y validación de modelos. Pruebas rigurosas de precisión, sesgo, robustez adversarial y calibración antes del paso a producción.
- **A.6.3 (L2)**: Despliegue y transición operacional. Procedimientos seguros de release (canary deployments, blue/green) con planes de rollback inmediato.
- **A.6.4 (L3)**: Retiro y desmantelamiento (Decommissioning). Procedimientos seguros de apagado de modelos, revocación de accesos y destrucción segura de checkpoints.

## A.7: Datos para Sistemas de IA (Data for AI Systems)
**Objetivo de Control**: Garantizar la procedencia, legalidad, calidad, linaje y privacidad de los datos utilizados por la IA.
- **A.7.1 (L1)**: Procedencia y derechos de uso de datos. Registro de la fuente, licencias comerciales y consentimiento de los datos de entrenamiento y RAG.
- **A.7.2 (L2)**: Calidad y preparación de datos. Métodos de limpieza, normalización, desduplicación y verificación de integridad criptográfica (hashes).
- **A.7.3 (L2)**: Linaje y trazabilidad de datos. Capacidad de rastrear qué versiones de datos generaron qué versión de modelo o vector database.
- **A.7.4 (L1)**: Privacidad y minimización de datos. Anonimización, ofuscación de PII (Personally Identifiable Information) y respeto a derechos de supresión.

## A.8: Información para Partes Interesadas (Information for Interested Parties)
**Objetivo de Control**: Fomentar la transparencia, explicabilidad y divulgación adecuada sobre el funcionamiento y limitaciones de la IA.
- **A.8.1 (L1)**: Divulgación y transparencia activa. Notificación clara y visible a los usuarios de que están interactuando con un agente o contenido generado por IA.
- **A.8.2 (L2)**: Fichas técnicas del sistema y del modelo (Model Cards / System Cards). Documentación estructurada de capacidades, limitaciones, sesgos conocidos y casos de uso prohibidos.
- **A.8.3 (L2)**: Explicabilidad algorítmica. Provisión de justificaciones comprensibles sobre cómo el sistema llegó a una decisión o respuesta relevante.

## A.9: Uso de Sistemas de IA (Use of AI Systems)
**Objetivo de Control**: Supervisar la operación continua del sistema, controlar la deriva de datos/conceptos y garantizar supervisión humana.
- **A.9.1 (L1)**: Política de uso aceptable y directrices operacionales. Guías claras para usuarios y operadores sobre el uso legítimo de la herramienta.
- **A.9.2 (L2)**: Monitoreo continuo y detección de Drift. Observabilidad automatizada para detectar Data Drift, Concept Drift y degradación de rendimiento.
- **A.9.3 (L2)**: Supervisión humana (Human-in-the-Loop / Human-on-the-Loop). Mecanismos para que operadores humanos puedan revisar, pausar, anular o corregir decisiones de la IA.
- **A.9.4 (L1)**: Gestión y respuesta ante incidentes de IA. Procedimientos de respuesta rápida ante respuestas tóxicas, brechas de datos o jailbreaks en producción.

## A.10: Relaciones con Terceros y Clientes (Third-Party and Customer Relationships)
**Objetivo de Control**: Gestionar los riesgos introducidos por proveedores externos de modelos fundacionales, APIs y servicios en la nube.
- **A.10.1 (L1)**: Evaluación y selección de proveedores de IA. Auditoría de seguridad y verificación de compromisos de privacidad de los proveedores de LLMs (evitar uso de datos de clientes para reentrenamiento).
- **A.10.2 (L2)**: Acuerdos contractuales y SLAs. Cláusulas de disponibilidad, confidencialidad, límites de responsabilidad y derechos de auditoría con proveedores de IA.
- **A.10.3 (L2)**: Gestión de la cadena de suministro de IA. Inventario de dependencias (AIBOM) y planes de contingencia ante caída o discontinuación del proveedor de modelo.

import { StandardChapter } from '../types';

export const iso42001DatabaseSeed: StandardChapter[] = [
  {
    chapterId: "Clause 4",
    title: "Contexto de la Organización (Context of the Organization)",
    shortDescription: "Comprensión del entorno interno y externo, expectativas de partes interesadas y alcance formal del AIMS.",
    fullDescription: "La organización debe determinar las cuestiones externas e internas relevantes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su Sistema de Gestión de Inteligencia Artificial (AIMS), identificando a las partes interesadas pertinentes y estableciendo los límites y aplicabilidad formal del sistema.",
    order: 1,
    controls: [
      {
        id: "Clause 4.1",
        title: "Comprensión de la organización y de su contexto",
        description: "Identificación de factores legales, regulatorios, tecnológicos, éticos y de mercado que impactan el desarrollo y operación de la IA.",
        level: "L1",
        objective: "Determinar el contexto organizacional y los factores condicionantes para el éxito del AIMS.",
        verificationGuidance: "Verificar la existencia de un análisis de contexto documentado (PESTEL, FODA o registro de contexto AIMS) que incluya riesgos de IA.",
        remediationGuidance: "Elaborar un documento formal de contexto organizacional de IA aprobado por la dirección."
      },
      {
        id: "Clause 4.2",
        title: "Necesidades y expectativas de partes interesadas",
        description: "Identificación de partes interesadas (usuarios, reguladores, empleados, clientes) y sus requisitos legales y éticos.",
        level: "L1",
        objective: "Garantizar que las expectativas y derechos de los afectados por la IA sean identificados y gestionados.",
        verificationGuidance: "Revisar la matriz de partes interesadas de IA y los mecanismos de consulta o recepción de feedback.",
        remediationGuidance: "Crear una matriz de partes interesadas con requisitos regulatorios (ej. EU AI Act, RGPD) y contractuales."
      },
      {
        id: "Clause 4.3",
        title: "Determinación del alcance del AIMS",
        description: "Definición y documentación formal de los límites físicos, organizacionales y tecnológicos cubiertos por el AIMS.",
        level: "L1",
        objective: "Establecer con precisión qué modelos, aplicaciones, equipos y flujos de datos están bajo la gobernanza del AIMS.",
        verificationGuidance: "Comprobar el documento formal de Declaración de Alcance del AIMS firmado por la alta dirección.",
        remediationGuidance: "Redactar el documento de alcance especificando las arquitecturas LLM, RAG y pipelines cubiertos."
      },
      {
        id: "Clause 4.4",
        title: "Sistema de gestión de IA y procesos",
        description: "Establecimiento, implementación, mantenimiento y mejora continua de los procesos requeridos para el AIMS.",
        level: "L2",
        objective: "Asegurar la integración efectiva de los procesos del ciclo de vida de la IA con el sistema de gestión global.",
        verificationGuidance: "Examinar el mapa de procesos de IA y su interacción con desarrollo, seguridad de la información y operaciones.",
        remediationGuidance: "Mapear formalmente los procesos de ciclo de vida de IA (datos, modelado, despliegue, observabilidad)."
      }
    ]
  },
  {
    chapterId: "Clause 5",
    title: "Liderazgo y Compromiso (Leadership and Commitment)",
    shortDescription: "Compromiso de la alta dirección, política formal de IA y asignación de roles y responsabilidades.",
    fullDescription: "La alta dirección debe demostrar liderazgo y compromiso con respecto al AIMS asegurando la disponibilidad de recursos, estableciendo la política de IA y los objetivos estratégicos, y asignando responsabilidades claras para la gobernanza algorítmica.",
    order: 2,
    controls: [
      {
        id: "Clause 5.1",
        title: "Liderazgo y compromiso de la alta dirección",
        description: "Demostración activa del involucramiento directivo en la gobernanza, ética y asignación presupuestaria de la IA.",
        level: "L1",
        objective: "Garantizar la rendición de cuentas (accountability) al más alto nivel jerárquico.",
        verificationGuidance: "Revisar actas de comités directivos de IA, asignación formal de presupuesto y directrices estratégicas.",
        remediationGuidance: "Constituir un Comité de Dirección de IA con reuniones trimestrales documentadas."
      },
      {
        id: "Clause 5.2",
        title: "Política de Inteligencia Artificial",
        description: "Establecimiento, aprobación, comunicación y disponibilidad de una política formal de IA.",
        level: "L1",
        objective: "Proporcionar un marco directivo coherente que guíe el diseño, adquisición y uso responsable de la IA.",
        verificationGuidance: "Verificar la existencia de la Política de IA corporativa aprobada y accesible a todos los empleados y partes interesadas.",
        remediationGuidance: "Redactar y publicar la Política de Inteligencia Artificial integrando principios de equidad, privacidad y robustez."
      },
      {
        id: "Clause 5.3",
        title: "Roles, responsabilidades y autoridades organizacionales",
        description: "Asignación documentada de roles y responsabilidades para la operación del AIMS y el ciclo de vida de IA.",
        level: "L2",
        objective: "Eliminar ambigüedades operativas y garantizar que existan responsables claros de la seguridad y ética algorítmica.",
        verificationGuidance: "Revisar descripciones de puestos, matriz RACI de IA y nombramiento del Oficial de Cumplimiento de IA.",
        remediationGuidance: "Publicar una matriz RACI de gobernanza de IA definiendo responsables de MLOps, datos, seguridad y ética."
      }
    ]
  },
  {
    chapterId: "Clause 6",
    title: "Planificación del AIMS (Planning)",
    shortDescription: "Identificación de riesgos y oportunidades, objetivos de IA y planificación del cambio.",
    fullDescription: "La organización debe planificar acciones para abordar los riesgos y oportunidades derivados de la autonomía, opacidad y escala de los sistemas de IA, estableciendo objetivos medibles y procedimientos formales para gestionar los cambios.",
    order: 3,
    controls: [
      {
        id: "Clause 6.1",
        title: "Acciones para abordar riesgos y oportunidades",
        description: "Metodología formal para evaluar riesgos específicos de IA (sesgo, alucinación, envenenamiento, denegación de servicio).",
        level: "L2",
        objective: "Asegurar que los riesgos de IA se identifiquen y mitiguen proactivamente antes de afectar a personas u operaciones.",
        verificationGuidance: "Revisar la matriz de riesgos de IA con criterios cuantitativos de probabilidad, impacto y apetito de riesgo.",
        remediationGuidance: "Implementar un registro de riesgos de IA alineado con ISO 23894 e ISO 31000."
      },
      {
        id: "Clause 6.2",
        title: "Objetivos de IA y planificación para lograrlos",
        description: "Definición de metas medibles de precisión, robustez, latencia, explicabilidad y cumplimiento normativo.",
        level: "L2",
        objective: "Alinear el desempeño de los modelos y del AIMS con métricas objetivas y verificables.",
        verificationGuidance: "Verificar que cada sistema de IA tenga objetivos documentados con KPIs específicos y periodicidad de medición.",
        remediationGuidance: "Establecer un cuadro de mando de métricas de IA (KPIs/SLOs de rendimiento, drift y equidad)."
      },
      {
        id: "Clause 6.3",
        title: "Planificación de los cambios",
        description: "Control formal de cambios en arquitecturas, modelos, datasets de fine-tuning o proveedores de LLMs.",
        level: "L2",
        objective: "Prevenir regresiones de seguridad, fallos imprevistos o pérdida de gobernanza ante modificaciones técnicas.",
        verificationGuidance: "Revisar el procedimiento de gestión de cambios (RFC) aplicado a modelos y pipelines de IA.",
        remediationGuidance: "Integrar puertas de calidad (Quality Gates) en el CI/CD que exijan re-evaluación ante cambios de modelo."
      }
    ]
  },
  {
    chapterId: "Clause 7",
    title: "Soporte y Recursos (Support)",
    shortDescription: "Recursos técnicos, competencia del personal, concienciación y control de información documentada.",
    fullDescription: "La organización debe determinar y proporcionar los recursos necesarios para el AIMS, asegurar la competencia y concienciación del personal en riesgos y ética de IA, y mantener la información documentada bajo estricto control de versiones.",
    order: 4,
    controls: [
      {
        id: "Clause 7.1",
        title: "Recursos humanos, de infraestructura y cómputo",
        description: "Dotación de capacidad de cómputo, almacenamiento seguro, plataformas de observabilidad y personal calificado.",
        level: "L1",
        objective: "Asegurar la viabilidad técnica y operativa del AIMS.",
        verificationGuidance: "Auditar la infraestructura de cómputo dedicada (GPUs, vector databases) y la dotación presupuestaria de herramientas.",
        remediationGuidance: "Formalizar el inventario de recursos de cómputo y herramientas de MLOps con presupuestos asignados."
      },
      {
        id: "Clause 7.2",
        title: "Competencia del personal de IA",
        description: "Verificación de la cualificación, certificaciones y experiencia de ingenieros de datos, MLOps y auditores de IA.",
        level: "L2",
        objective: "Garantizar que el personal cuente con las habilidades técnicas y de seguridad requeridas.",
        verificationGuidance: "Revisar expedientes de formación, planes de carrera y certificaciones en seguridad y machine learning.",
        remediationGuidance: "Diseñar un plan de capacitación obligatorio en seguridad de modelos de lenguaje (LLM Security) y MLOps."
      },
      {
        id: "Clause 7.3",
        title: "Concienciación y cultura ética",
        description: "Programas regulares de sensibilización sobre riesgos de IA, sesgos algorítmicos y uso responsable.",
        level: "L2",
        objective: "Fomentar una cultura organizacional vigilante ante fallos éticos y de seguridad en IA.",
        verificationGuidance: "Comprobar registros de asistencia y contenidos de talleres de concienciación en IA ética.",
        remediationGuidance: "Desplegar un módulo anual de concienciación en riesgos de IA y directrices de uso aceptable."
      },
      {
        id: "Clause 7.4",
        title: "Comunicación interna y externa",
        description: "Canales formales para comunicar políticas, incidentes y directrices operacionales de los sistemas de IA.",
        level: "L1",
        objective: "Garantizar la transparencia y flujo de información crítica entre equipos técnicos y partes interesadas.",
        verificationGuidance: "Revisar protocolos de comunicación ante incidentes de IA y canales de notificación a usuarios.",
        remediationGuidance: "Documentar un plan de comunicación de IA definiendo interlocutores y protocolos de escalamiento."
      },
      {
        id: "Clause 7.5",
        title: "Información documentada y registros",
        description: "Control de versiones, almacenamiento seguro y retención de artefactos, prompts, modelos y reportes de auditoría.",
        level: "L2",
        objective: "Asegurar la trazabilidad, reproducibilidad y evidencia auditable a lo largo del tiempo.",
        verificationGuidance: "Verificar repositorios de código, registros de experimentos (MLflow/Weights&Biases) y políticas de retención.",
        remediationGuidance: "Implementar un sistema de gestión documental con control criptográfico de versiones para artefactos de IA."
      }
    ]
  },
  {
    chapterId: "Clause 8",
    title: "Operación del Sistema de Gestión de IA (Operation)",
    shortDescription: "Planificación operacional, evaluación y tratamiento de riesgos, y evaluación de impacto de IA (AIIA).",
    fullDescription: "La organización debe planificar, implementar y controlar los procesos operativos para la gestión de riesgos de IA y llevar a cabo evaluaciones de impacto de sistemas de IA (AIIA) antes de su puesta en producción.",
    order: 5,
    controls: [
      {
        id: "Clause 8.1",
        title: "Planificación y control operacional",
        description: "Definición de criterios operacionales y controles de ingeniería para el ciclo de vida de la IA.",
        level: "L1",
        objective: "Asegurar que los sistemas de IA se construyan y operen según las especificaciones aprobadas.",
        verificationGuidance: "Revisar especificaciones de arquitectura, guías de estilo de código de ML y políticas de release.",
        remediationGuidance: "Establecer un estándar operacional de despliegue de modelos con checklists de seguridad obligatorios."
      },
      {
        id: "Clause 8.2",
        title: "Evaluación de riesgos de IA",
        description: "Evaluación sistemática de riesgos de seguridad, alucinación, sesgo y robustez para cada caso de uso.",
        level: "L2",
        objective: "Cuantificar los riesgos operacionales específicos antes de autorizar el despliegue a producción.",
        verificationGuidance: "Verificar informes de evaluación de riesgos firmados para los modelos en producción.",
        remediationGuidance: "Integrar la metodología de evaluación de riesgos de IA en el proceso de aprobación de proyectos."
      },
      {
        id: "Clause 8.3",
        title: "Tratamiento de riesgos de IA",
        description: "Implementación efectiva de salvaguardas técnicas y organizativas derivadas del Anexo A.",
        level: "L2",
        objective: "Reducir los riesgos residuales a niveles aceptables mediante controles de ingeniería y gobernanza.",
        verificationGuidance: "Comprobar el Plan de Tratamiento de Riesgos de IA y la correspondencia con controles implementados.",
        remediationGuidance: "Elaborar y ejecutar el Plan de Tratamiento de Riesgos documentando la selección de controles del Anexo A."
      },
      {
        id: "Clause 8.4",
        title: "Evaluación de Impacto del Sistema de IA (AIIA)",
        description: "Evaluación formal documentada previa al despliegue evaluando derechos fundamentales, equidad y sociedad.",
        level: "L1",
        objective: "Identificar y prevenir daños potenciales a individuos o colectivos derivados de la operación del modelo.",
        verificationGuidance: "Exigir el informe formal de AIIA (AI Impact Assessment) para el sistema analizado.",
        remediationGuidance: "Adoptar una plantilla corporativa de AIIA y hacer obligatoria su aprobación antes de cualquier lanzamiento."
      }
    ]
  },
  {
    chapterId: "Clause 9",
    title: "Evaluación del Desempeño (Performance Evaluation)",
    shortDescription: "Monitoreo continuo de KPIs y drift, auditorías internas del AIMS y revisiones de la dirección.",
    fullDescription: "La organización debe monitorear, medir, analizar y evaluar el desempeño de los sistemas de IA y la eficacia del AIMS, ejecutando auditorías internas periódicas y revisiones directivas formales.",
    order: 6,
    controls: [
      {
        id: "Clause 9.1",
        title: "Seguimiento, medición, análisis y evaluación",
        description: "Monitoreo automatizado de deriva de datos (data drift), deriva de conceptos, tasas de alucinación y latencia.",
        level: "L2",
        objective: "Detectar degradaciones de rendimiento y fallos de comportamiento en tiempo real.",
        verificationGuidance: "Revisar dashboards de observabilidad (Prometheus, Evidently, Grafana) y reglas de alerta configuradas.",
        remediationGuidance: "Configurar un pipeline de telemetría y observabilidad continua con cálculo automatizado de drift métrico."
      },
      {
        id: "Clause 9.2",
        title: "Auditoría interna del AIMS",
        description: "Auditorías internas planificadas a intervalos regulares con auditores calificados e independientes.",
        level: "L2",
        objective: "Verificar la conformidad continua con ISO/IEC 42001 y los requisitos organizacionales.",
        verificationGuidance: "Revisar el programa de auditoría interna, informes de hallazgos y planes de acción de auditoría previa.",
        remediationGuidance: "Ejecutar un calendario anual de auditorías internas del AIMS y documentar no conformidades."
      },
      {
        id: "Clause 9.3",
        title: "Revisión por la dirección",
        description: "Revisiones formales de la alta dirección sobre el estado del AIMS, métricas de incidentes y oportunidades de mejora.",
        level: "L1",
        objective: "Asegurar la continua idoneidad, adecuación y eficacia del sistema de gestión de IA.",
        verificationGuidance: "Examinar las actas de la Revisión por la Dirección con decisiones sobre cambios y asignación de recursos.",
        remediationGuidance: "Programar la reunión anual de Revisión por la Dirección y formalizar el informe de conclusiones."
      }
    ]
  },
  {
    chapterId: "Clause 10",
    title: "Mejora Continua (Improvement)",
    shortDescription: "Gestión de no conformidades, incidentes de IA y acciones correctivas para la mejora sostenida.",
    fullDescription: "La organización debe determinar y seleccionar oportunidades de mejora e implementar las acciones necesarias para cumplir con los requisitos del AIMS y corregir no conformidades e incidentes de seguridad en IA.",
    order: 7,
    controls: [
      {
        id: "Clause 10.1",
        title: "No conformidad y acciones correctivas",
        description: "Procedimiento formal para investigar causa raíz de incidentes de IA (jailbreaks, alucinaciones) y aplicar remediación.",
        level: "L1",
        objective: "Prevenir la recurrencia de fallos de seguridad y violaciones de políticas mediante mitigación estructural.",
        verificationGuidance: "Revisar el registro de no conformidades de IA, análisis causa-raíz (5 Porqués/Ishikawa) y verificación de cierre.",
        remediationGuidance: "Implementar un flujo de gestión de no conformidades con plazos estrictos de resolución y verificación."
      },
      {
        id: "Clause 10.2",
        title: "Mejora continua del AIMS",
        description: "Evolución sistemática del sistema de gestión incorporando nuevas técnicas de defensa y lecciones aprendidas.",
        level: "L2",
        objective: "Adaptar permanentemente la postura de seguridad y gobernanza ante la evolución acelerada de la IA.",
        verificationGuidance: "Revisar iniciativas de mejora implementadas tras auditorías, post-mortems de incidentes o cambios regulatorios.",
        remediationGuidance: "Establecer un programa de benchmarking y actualización tecnológica para las defensas de IA."
      }
    ]
  },
  {
    chapterId: "A.2",
    title: "Políticas Relacionadas con la IA (AI Policies)",
    shortDescription: "Políticas organizacionales para alinear los sistemas de IA con los objetivos de negocio y regulatorios.",
    fullDescription: "La organización debe establecer, implementar y mantener políticas para la IA que sean apropiadas para el propósito de la organización. Esto incluye alinear las políticas de IA con otras políticas organizacionales y asegurar la comunicación y revisión periódica de las directrices.",
    order: 8,
    controls: [
      {
        id: "A.2.1",
        title: "Política de Inteligencia Artificial",
        description: "Se debe definir y aprobar una política de IA por parte de la dirección.",
        level: "L1",
        objective: "Proveer dirección y apoyo de gestión para el desarrollo y uso de la IA de acuerdo con los requisitos del negocio.",
        verificationGuidance: "Verificar la existencia de un documento de política de IA formal, firmado por la alta dirección y comunicado a toda la empresa.",
        remediationGuidance: "Redactar, aprobar y distribuir una política de IA que exprese claramente el compromiso de la organización con la gestión de riesgos y el uso ético."
      },
      {
        id: "A.2.2",
        title: "Alineación de Políticas de IA",
        description: "Asegurar que la política de IA sea consistente con la política de seguridad de la información y la de privacidad.",
        level: "L2",
        objective: "Evitar contradicciones entre políticas organizacionales y consolidar la gobernanza corporativa.",
        verificationGuidance: "Revisar las políticas de privacidad y seguridad de la información para confirmar que las cláusulas de IA (como el uso de datos generativos) son coherentes y no rompen otras normativas.",
        remediationGuidance: "Unificar el gobierno corporativo integrando la política de IA con la ISO 27001 (Seguridad) y ISO 27701 (Privacidad)."
      },
      {
        id: "A.2.3",
        title: "Revisión periódica de la política de IA",
        description: "Evaluaciones anuales o tras cambios regulatorios relevantes de las políticas de IA.",
        level: "L2",
        objective: "Mantener vigentes las directrices operacionales ante nuevos vectores de riesgo y requerimientos legislativos.",
        verificationGuidance: "Comprobar el historial de cambios y actas de revisión anual de las políticas de IA.",
        remediationGuidance: "Establecer un ciclo de revisión semestral o anual de la política de IA con aprobación formal."
      }
    ]
  },
  {
    chapterId: "A.3",
    title: "Organización Interna (Internal Organization)",
    shortDescription: "Asignación de roles, responsabilidades y segregación de funciones en el ciclo de vida de la IA.",
    fullDescription: "Roles y responsabilidades de la IA deben estar claramente definidos y asignados. Esto asegura que haya propiedad sobre los riesgos y controles de la IA a lo largo del ciclo de vida del sistema de IA, evitando conflictos de interés mediante segregación de funciones.",
    order: 9,
    controls: [
      {
        id: "A.3.1",
        title: "Roles y responsabilidades de IA",
        description: "Los roles relacionados con los sistemas de IA deben estar explícitamente asignados y documentados.",
        level: "L1",
        objective: "Asegurar la rendición de cuentas (accountability) para la operación segura, ética y transparente de la IA.",
        verificationGuidance: "Buscar un organigrama o matriz RACI que incluya roles como 'Oficial de IA', 'Líder Técnico de IA', y 'Responsable de Gobernanza'.",
        remediationGuidance: "Documentar y asignar formalmente a personas específicas o comités la responsabilidad de las evaluaciones de impacto de IA y operaciones del ciclo de vida."
      },
      {
        id: "A.3.2",
        title: "Segregación de funciones en IA",
        description: "Separación clara entre los equipos de desarrollo/entrenamiento y los equipos de validación independiente, QA y auditoría.",
        level: "L2",
        objective: "Prevenir sesgos de autoevaluación y garantizar una supervisión objetiva de la seguridad y calidad.",
        verificationGuidance: "Verificar que las evaluaciones de seguridad y validación de sesgos sean aprobadas por personal independiente al equipo de desarrollo.",
        remediationGuidance: "Establecer un flujo de aprobación donde un equipo de QA/Seguridad independiente autorice el paso a producción."
      },
      {
        id: "A.3.3",
        title: "Canales de escalamiento ético y de seguridad",
        description: "Mecanismo confidencial para que empleados y usuarios reporten incidentes, sesgos o comportamientos anómalos de la IA.",
        level: "L3",
        objective: "Permitir la detección temprana de riesgos graves sin temor a represalias.",
        verificationGuidance: "Comprobar la existencia y divulgación de un canal de denuncias o buzón de escalamiento ético.",
        remediationGuidance: "Habilitar un canal confidencial de reporte ético con protocolo de respuesta rápida garantizada."
      }
    ]
  },
  {
    chapterId: "A.4",
    title: "Recursos para Sistemas de IA (Resources for AI Systems)",
    shortDescription: "Provisión de recursos técnicos, de datos, humanos y herramientas para gestionar sistemas de IA.",
    fullDescription: "La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de IA, garantizando entornos seguros y herramientas auditadas.",
    order: 10,
    controls: [
      {
        id: "A.4.1",
        title: "Recursos humanos y capacitación especializada",
        description: "Competencia técnica especializada en arquitecturas LLM, RAG y seguridad defensiva en IA.",
        level: "L1",
        objective: "Asegurar que el equipo tenga los conocimientos requeridos para mitigar riesgos avanzados de IA.",
        verificationGuidance: "Revisar planes de formación técnica y certificaciones de los ingenieros de IA.",
        remediationGuidance: "Capacitar formalmente al equipo en OWASP Top 10 for LLM e ingeniería de seguridad en IA."
      },
      {
        id: "A.4.2",
        title: "Infraestructura y herramientas de IA",
        description: "Ambientes de desarrollo, experimentación y producción aislados con plataformas de MLOps auditadas.",
        level: "L2",
        objective: "Evitar fugas de datos y fallos operacionales mediante infraestructura hardened y segregada.",
        verificationGuidance: "Auditar la segregación de red entre clusters de entrenamiento, bases vectoriales y ambientes de inferencia.",
        remediationGuidance: "Aislar en VPCs privadas los componentes de IA y desplegar herramientas de MLOps con RBAC estricto."
      },
      {
        id: "A.4.3",
        title: "Gestión de recursos de datos",
        description: "Almacenamiento seguro, escalable y gobernado para datasets de entrenamiento, validación y vector databases.",
        level: "L2",
        objective: "Garantizar la disponibilidad, confidencialidad e integridad de los corpus de datos de la IA.",
        verificationGuidance: "Comprobar el cifrado en reposo (AES-256) y en tránsito (TLS 1.3) en buckets y vector databases.",
        remediationGuidance: "Configurar cifrado con claves gestionadas por el cliente (CMEK) y control de acceso granular a los almacenes de datos."
      }
    ]
  },
  {
    chapterId: "A.5",
    title: "Evaluación de Impacto de los Sistemas de IA (AI System Impact Assessment)",
    shortDescription: "Evaluación del impacto de los sistemas de IA en individuos, grupos protegidos y la sociedad.",
    fullDescription: "Realizar evaluaciones de impacto de la IA para identificar cómo los sistemas pueden afectar a grupos vulnerables, individuos y la sociedad en general. Deben existir procesos documentados para registrar estos impactos antes de la implementación.",
    order: 11,
    controls: [
      {
        id: "A.5.1",
        title: "Metodología de Evaluación de Impacto de IA (AIIA)",
        description: "Todo sistema de IA debe someterse a una evaluación de impacto antes de su despliegue.",
        level: "L1",
        objective: "Identificar impactos negativos en derechos humanos, equidad, sesgos sistémicos o impactos ambientales.",
        verificationGuidance: "Exigir el registro documental de una Evaluación de Impacto de IA (AIIA) firmada para el sistema evaluado.",
        remediationGuidance: "Implementar un proceso de evaluación obligatorio en la fase de concepción de proyectos de IA similar a una Evaluación de Impacto de Privacidad (PIA)."
      },
      {
        id: "A.5.2",
        title: "Evaluación de impacto en individuos y grupos protegidos",
        description: "Identificación activa de sesgos algorítmicos o discriminación potencial en modelos de decisión automatizada.",
        level: "L2",
        objective: "Prevenir la discriminación arbitraria y asegurar la equidad en grupos vulnerables.",
        verificationGuidance: "Revisar métricas de paridad estadística, igualdad de oportunidades o tasa de falsos positivos desagregada por subgrupos.",
        remediationGuidance: "Ejecutar pruebas de equidad algorítmica utilizando herramientas como Fairlearn o AIF360."
      },
      {
        id: "A.5.3",
        title: "Evaluación de impacto a lo largo del ciclo de vida",
        description: "Re-evaluación del impacto ante cambios sustanciales en el modelo, datos o contexto operativo.",
        level: "L2",
        objective: "Mantener la vigencia de la evaluación de impacto ante la evolución dinámica del sistema de IA.",
        verificationGuidance: "Comprobar fechas de revisión del AIIA y triggers documentados para re-evaluación.",
        remediationGuidance: "Vincular el pipeline de CI/CD para que cualquier cambio mayor de versión dispare la revisión del AIIA."
      }
    ]
  },
  {
    chapterId: "A.6",
    title: "Ciclo de Vida del Sistema de IA (AI System Lifecycle)",
    shortDescription: "Controles desde la fase de diseño hasta el retiro y desmantelamiento de sistemas de IA.",
    fullDescription: "Definición y aplicación de directrices de seguridad y calidad en todas las fases: concepción, diseño, desarrollo, pruebas, despliegue, operación, monitoreo y retiro (decommissioning) de modelos.",
    order: 12,
    controls: [
      {
        id: "A.6.1",
        title: "Definición de requisitos y especificación de diseño",
        description: "Documentación formal de especificaciones técnicas, requisitos de rendimiento, límites operacionales y casos de uso prohibidos.",
        level: "L1",
        objective: "Establecer criterios de aceptación claros para prevenir desvíos funcionales o riesgos de seguridad.",
        verificationGuidance: "Revisar el documento de especificación de arquitectura y requisitos de diseño del modelo.",
        remediationGuidance: "Formalizar el documento de especificación técnica de IA detallando límites operativos y requisitos de precisión."
      },
      {
        id: "A.6.2",
        title: "Verificación y validación de modelos",
        description: "Pruebas rigurosas de precisión, sesgo, robustez adversarial y calibración antes del paso a producción.",
        level: "L2",
        objective: "Asegurar que el modelo funciona según lo previsto y no es vulnerable a ataques de inyección o evasión.",
        verificationGuidance: "Revisar informes de pruebas adversariales (red teaming), benchmarks de robustez y matriz de confusión.",
        remediationGuidance: "Integrar pruebas unitarias de ML y suites de evaluación adversarial automatizada antes de la autorización de release."
      },
      {
        id: "A.6.3",
        title: "Despliegue y transición operacional",
        description: "Procedimientos seguros de release (canary deployments, blue/green) con planes de rollback inmediato.",
        level: "L2",
        objective: "Minimizar riesgos de disrupción del servicio o exposición masiva de fallos en nuevos modelos.",
        verificationGuidance: "Comprobar las configuraciones de despliegue en Kubernetes o API Gateway y verificar la estrategia de rollback.",
        remediationGuidance: "Automatizar despliegues canarios con análisis progresivo de métricas de error y rollback automático."
      },
      {
        id: "A.6.4",
        title: "Retiro y desmantelamiento (Decommissioning)",
        description: "Procedimientos seguros de apagado de modelos, revocación de accesos y destrucción segura de checkpoints y datos temporales.",
        level: "L3",
        objective: "Prevenir el uso no autorizado de modelos obsoletos y garantizar la eliminación segura de artefactos sensibles.",
        verificationGuidance: "Revisar la política de retiro de modelos y los registros de desmantelamiento seguro de checkpoints.",
        remediationGuidance: "Documentar y ejecutar un protocolo de desmantelamiento seguro con destrucción criptográfica de pesos obsoletos."
      }
    ]
  },
  {
    chapterId: "A.7",
    title: "Datos para Sistemas de IA (Data for AI Systems)",
    shortDescription: "Gestión de la calidad, procedencia, linaje y privacidad de los datos utilizados por la IA.",
    fullDescription: "Controles sobre la procedencia de los datos, adquisición, preparación, calidad, linaje y minimización de privacidad para evitar envenenamiento, sesgos, violaciones de IP o filtraciones de información confidencial.",
    order: 13,
    controls: [
      {
        id: "A.7.1",
        title: "Procedencia y derechos de uso de datos",
        description: "La organización debe rastrear y documentar el origen, licencias comerciales y consentimiento de los datos.",
        level: "L1",
        objective: "Prevenir infracciones de derechos de autor, reclamaciones legales y uso no autorizado de datos.",
        verificationGuidance: "Solicitar el inventario de fuentes de datos y las licencias comerciales o consentimientos asociados.",
        remediationGuidance: "Establecer un registro formal de procedencia de datos con verificación legal de licencias para datasets y corpus RAG."
      },
      {
        id: "A.7.2",
        title: "Calidad y preparación de datos",
        description: "Métodos de limpieza, normalización, desduplicación y verificación de integridad criptográfica (hashes SHA-256).",
        level: "L2",
        objective: "Asegurar la representatividad y exactitud de los datos evitando degradación o envenenamiento inadvertido.",
        verificationGuidance: "Auditar los scripts de preprocesamiento de datos y la verificación de sumas de verificación criptográficas.",
        remediationGuidance: "Implementar pipelines automatizados de validación de esquemas y hashes criptográficos para cada lote de datos."
      },
      {
        id: "A.7.3",
        title: "Linaje y trazabilidad de datos",
        description: "Capacidad de rastrear qué versiones de datos generaron qué versión de modelo o vector database.",
        level: "L2",
        objective: "Permitir la reproducibilidad técnica y la auditoría forense de modelos.",
        verificationGuidance: "Revisar herramientas de versionado de datos (DVC, Delta Lake) y metadatos asociados a los modelos desplegados.",
        remediationGuidance: "Desplegar DVC o herramientas de Data Lineage para vincular de forma inmutable datos y modelos."
      },
      {
        id: "A.7.4",
        title: "Privacidad y minimización de datos",
        description: "Anonimización, seudonimización, ofuscación de PII y respeto a derechos de supresión en corpus RAG y fine-tuning.",
        level: "L1",
        objective: "Evitar la extracción de datos personales o confidenciales mediante ataques de inversión de modelo o prompts.",
        verificationGuidance: "Verificar filtros de sanitización de PII (Microsoft Presidio) en la ingesta de datos a la base vectorial.",
        remediationGuidance: "Integrar filtros de escaneo y anonimización de PII antes de indexar o almacenar documentos en la base de conocimientos."
      }
    ]
  },
  {
    chapterId: "A.8",
    title: "Información para Partes Interesadas (Information for Interested Parties)",
    shortDescription: "Transparencia, explicabilidad y divulgación adecuada sobre el funcionamiento y limitaciones de la IA.",
    fullDescription: "La organización debe asegurar la transparencia activa hacia los usuarios, la provisión de fichas técnicas estructuradas (Model Cards / System Cards) y mecanismos de explicabilidad algorítmica.",
    order: 14,
    controls: [
      {
        id: "A.8.1",
        title: "Divulgación y transparencia activa",
        description: "Notificación clara y visible a los usuarios de que están interactuando con un sistema de IA generativa.",
        level: "L1",
        objective: "Garantizar la transparencia, confianza del usuario y cumplimiento de normativas como el EU AI Act.",
        verificationGuidance: "Validar que la interfaz de usuario indique claramente la naturaleza de IA y el nivel de supervisión.",
        remediationGuidance: "Añadir avisos visuales explícitos en la interfaz indicando la interacción con un modelo de IA."
      },
      {
        id: "A.8.2",
        title: "Fichas técnicas del sistema y modelo (Model Cards)",
        description: "Documentación estructurada de arquitectura, datos de entrenamiento, limitaciones, sesgos conocidos y casos de uso prohibidos.",
        level: "L2",
        objective: "Proporcionar documentación técnica rigurosa para auditores, integradores y operadores.",
        verificationGuidance: "Revisar la Model Card o System Card publicada y actualizada del sistema de IA.",
        remediationGuidance: "Generar y publicar una Model Card formal bajo el estándar de Hugging Face o Google Model Cards."
      },
      {
        id: "A.8.3",
        title: "Explicabilidad algorítmica",
        description: "Provisión de justificaciones comprensibles y citas de fuentes sobre cómo el sistema llegó a una decisión o respuesta.",
        level: "L2",
        objective: "Permitir la comprensión humana y la impugnabilidad de decisiones automatizadas relevantes.",
        verificationGuidance: "Verificar que las respuestas del sistema RAG incluyan referencias exactas a las fuentes y justificaciones.",
        remediationGuidance: "Implementar citas verificables en el prompt de respuesta y mecanismos de atribución de fuentes."
      }
    ]
  },
  {
    chapterId: "A.9",
    title: "Uso de Sistemas de IA (Use of AI Systems)",
    shortDescription: "Supervisión operativa, monitoreo de drift, control humano (HITL) y respuesta a incidentes.",
    fullDescription: "Controlar el uso operativo de la IA, lo cual incluye el monitoreo del rendimiento del modelo (drift), intervención humana cuando se requiera (Human-in-the-Loop) y manejo protocolizado de incidentes o comportamientos inesperados.",
    order: 15,
    controls: [
      {
        id: "A.9.1",
        title: "Política de uso aceptable de IA",
        description: "Directrices claras para usuarios y operadores sobre casos de uso autorizados y conductas prohibidas.",
        level: "L1",
        objective: "Prevenir el mal uso intencional o negligente de las capacidades del sistema de IA.",
        verificationGuidance: "Comprobar la publicación de términos de servicio y política de uso aceptable accesible a los usuarios.",
        remediationGuidance: "Redactar y hacer aceptar contractualmente la Política de Uso Aceptable de la herramienta de IA."
      },
      {
        id: "A.9.2",
        title: "Monitoreo continuo y detección de Drift",
        description: "Observabilidad automatizada para detectar Data Drift, Concept Drift y degradación de métricas de precisión.",
        level: "L2",
        objective: "Garantizar que el sistema mantenga su confiabilidad y precisión a lo largo del tiempo.",
        verificationGuidance: "Comprobar la existencia de alertas automáticas ante desviaciones de distribución en inputs o respuestas.",
        remediationGuidance: "Desplegar herramientas de observabilidad de ML (MLOps) con umbrales de alerta y triggers de reentrenamiento."
      },
      {
        id: "A.9.3",
        title: "Supervisión humana (Human-in-the-Loop)",
        description: "Mecanismos para que operadores humanos calificados revisen, pausen, anulen o corrijan decisiones de la IA.",
        level: "L2",
        objective: "Evitar la automatización descontrolada en acciones de alto impacto o decisiones críticas.",
        verificationGuidance: "Verificar en los flujos de trabajo la presencia de compuertas de aprobación humana obligatorias.",
        remediationGuidance: "Integrar compuertas de autorización humana (Human Approval Gates) en acciones transaccionales del agente."
      },
      {
        id: "A.9.4",
        title: "Gestión y respuesta ante incidentes de IA",
        description: "Procedimiento de respuesta rápida ante respuestas tóxicas, brechas de datos, alucinaciones graves o jailbreaks.",
        level: "L1",
        objective: "Contener y mitigar de inmediato cualquier fallo imprevisto del sistema de IA en producción.",
        verificationGuidance: "Revisar el Playbook de respuesta ante incidentes de IA y los mecanismos de circuit breaker o apagado de emergencia.",
        remediationGuidance: "Implementar un interruptor de emergencia (Kill Switch) y un playbook formal de respuesta ante incidentes de IA."
      }
    ]
  },
  {
    chapterId: "A.10",
    title: "Relaciones con Terceros y Clientes (Third-Party and Customer Relationships)",
    shortDescription: "Gestión de proveedores de IA, acuerdos de nivel de servicio (SLAs) y cadena de suministro.",
    fullDescription: "Gobernanza sobre proveedores externos de modelos fundacionales (ej. APIs de LLMs, servicios en la nube) y los riesgos asociados a la externalización, garantizando privacidad, continuidad y seguridad en la cadena de suministro.",
    order: 16,
    controls: [
      {
        id: "A.10.1",
        title: "Evaluación y selección de proveedores de IA",
        description: "Auditoría de seguridad y verificación de compromisos de privacidad de los proveedores de LLMs (evitar uso para reentrenamiento).",
        level: "L1",
        objective: "Minimizar riesgos de fuga de datos o fallos introducidos por terceros en la cadena de valor.",
        verificationGuidance: "Revisar los acuerdos de procesamiento de datos (DPA) con proveedores de APIs de modelos fundacionales.",
        remediationGuidance: "Exigir cláusulas de 'Zero Data Retention' y garantía de no uso de datos del cliente para entrenamiento del modelo fundacional."
      },
      {
        id: "A.10.2",
        title: "Acuerdos contractuales y SLAs de IA",
        description: "Cláusulas formales de disponibilidad, confidencialidad, límites de responsabilidad y derechos de auditoría con proveedores de IA.",
        level: "L2",
        objective: "Asegurar la continuidad operativa y la protección jurídica ante fallos del proveedor.",
        verificationGuidance: "Revisar los SLAs contratados (tiempos de respuesta, uptime 99.9%, penalizaciones) y derechos de auditoría.",
        remediationGuidance: "Incorporar un AI Vendor Addendum a todos los contratos con proveedores de APIs y servicios cognitivos."
      },
      {
        id: "A.10.3",
        title: "Gestión de la cadena de suministro de IA y AIBOM",
        description: "Inventario de dependencias, librerías, pesos de modelos fundacionales (AIBOM) y planes de contingencia ante caídas.",
        level: "L2",
        objective: "Garantizar la resiliencia y capacidad de fallback ante disrupciones o discontinuaciones de servicios de terceros.",
        verificationGuidance: "Verificar el inventario AIBOM y los mecanismos de redundancia o fallback a modelos alternativos.",
        remediationGuidance: "Generar un AIBOM (AI Software Bill of Materials) y configurar arquitectura multi-modelo con fallback automático."
      }
    ]
  }
];

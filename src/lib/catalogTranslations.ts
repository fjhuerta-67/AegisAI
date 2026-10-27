// Pre-translated catalog & regulatory framework strings (OWASP AI-SVS, ISO/IEC 42001, LFPDPPP, LFPC, EU AI Act, DSM-01)
export const CATALOG_TRANSLATIONS: Record<string, { en: string; pt?: string; fr?: string; de?: string }> = {
  "Procedencia y Licenciamiento de Datos": {
    "en": "Data Origin and Licensing",
    "pt": "Origem e licenciamento dos dados",
    "fr": "Origine des données et licence",
    "de": "Datenherkunft und Lizenzierung"
  },
  "Catalogar la procedencia de los datos con origen, licencias, consentimiento y verificación de hash criptográfico.": {
    "en": "Catalog the provenance of data with origin, licenses, consent and cryptographic hash verification.",
    "pt": "Catalogue a procedência dos dados com origem, licenças, consentimento e verificação de hash criptográfico.",
    "fr": "Cataloguez la provenance des données avec l’origine, les licences, le consentement et la vérification du hachage cryptographique.",
    "de": "Katalogisieren Sie die Herkunft der Daten mit Herkunft, Lizenzen, Einwilligung und kryptografischer Hash-Verifizierung."
  },
  "Auditar el catálogo de datos (AIBOM) y verificar hashes SHA-256 de los snapshots de entrenamiento.": {
    "en": "Audit the data catalog (AIBOM) and verify SHA-256 hashes of the training snapshots.",
    "pt": "Audite o catálogo de dados (AIBOM) e verifique os hashes SHA-256 dos instantâneos de treinamento.",
    "fr": "Auditez le catalogue de données (AIBOM) et vérifiez les hachages SHA-256 des instantanés de formation.",
    "de": "Prüfen Sie den Datenkatalog (AIBOM) und überprüfen Sie SHA-256-Hashes der Trainings-Snapshots."
  },
  "Escanear datasets de fine-tuning y evaluación contra data poisoning, backdoors y PII no autorizada.": {
    "en": "Scan datasets for fine-tuning and evaluation against data poisoning, backdoors and unauthorized PII.",
    "pt": "Digitalize conjuntos de dados para ajuste fino e avaliação contra envenenamento de dados, backdoors e PII não autorizados.",
    "fr": "Analysez les ensembles de données pour les affiner et les évaluer contre l'empoisonnement des données, les portes dérobées et les informations personnelles non autorisées.",
    "de": "Scannen Sie Datensätze zur Feinabstimmung und Bewertung gegen Datenvergiftung, Hintertüren und nicht autorisierte personenbezogene Daten."
  },
  "Integrar filtros automáticos de detección de anomalías y anonimización de PII en la etapa de ingestión previa al fine-tuning.": {
    "en": "Integrate automatic anomaly detection and PII anonymization filters in the ingestion stage prior to fine-tuning.",
    "pt": "Integre detecção automática de anomalias e filtros de anonimato de PII no estágio de ingestão antes do ajuste fino.",
    "fr": "Intégrez des filtres de détection automatique des anomalies et d’anonymisation des informations personnelles lors de l’étape d’ingestion avant le réglage fin.",
    "de": "Integrieren Sie automatische Anomalieerkennung und PII-Anonymisierungsfilter in der Aufnahmephase vor der Feinabstimmung."
  },
  "Verificar reportes de escaneo de PII (Presidio/DLP) y pruebas de anomalías estadísticas en las etiquetas de entrenamiento.": {
    "en": "Verify PII scan reports (Presidio/DLP) and tests for statistical anomalies in training labels.",
    "pt": "Verifique relatórios de varredura de PII (Presidio/DLP) e testes para anomalias estatísticas em rótulos de treinamento.",
    "fr": "Vérifiez les rapports d'analyse PII (Presidio/DLP) et les tests d'anomalies statistiques dans les étiquettes de formation.",
    "de": "Überprüfen Sie PII-Scanberichte (Presidio/DLP) und Tests auf statistische Anomalien in Trainingsetiketten."
  },
  "Preprocesamiento determinista y trazabilidad inmutable del linaje de datos de entrenamiento.": {
    "en": "Deterministic preprocessing and immutable lineage traceability of training data.",
    "pt": "Pré-processamento determinístico e rastreabilidade de linhagem imutável de dados de treinamento.",
    "fr": "Prétraitement déterministe et traçabilité immuable de la lignée des données d'entraînement.",
    "de": "Deterministische Vorverarbeitung und unveränderliche Herkunftsverfolgbarkeit von Trainingsdaten."
  },
  "Garantizar que todos los datasets provengan de fuentes autorizadas y no contengan código o datos no conformes.": {
    "en": "Ensure that all datasets come from authoritative sources and do not contain non-compliant code or data.",
    "pt": "Certifique-se de que todos os conjuntos de dados venham de fontes confiáveis ​​e não contenham códigos ou dados não compatíveis.",
    "fr": "Assurez-vous que tous les ensembles de données proviennent de sources faisant autorité et ne contiennent pas de code ou de données non conformes.",
    "de": "Stellen Sie sicher, dass alle Datensätze aus maßgeblichen Quellen stammen und keinen nicht konformen Code oder Daten enthalten."
  },
  "Prevenir que datos manipulados introduzcan vulnerabilidades intencionales o fugas de privacidad en los modelos.": {
    "en": "Prevent manipulated data from introducing intentional vulnerabilities or privacy leaks into models.",
    "pt": "Evite que dados manipulados introduzam vulnerabilidades intencionais ou vazamentos de privacidade nos modelos.",
    "fr": "Empêchez les données manipulées d’introduire des vulnérabilités intentionnelles ou des fuites de confidentialité dans les modèles.",
    "de": "Verhindern Sie, dass manipulierte Daten zu absichtlichen Schwachstellen oder Datenschutzlecks in Modellen führen."
  },
  "Linaje Inmutable de Preprocesamiento": {
    "en": "Immutable Preprocessing Lineage",
    "pt": "Linhagem de pré-processamento imutável",
    "fr": "Lignée de prétraitement immuable",
    "de": "Unveränderliche Vorverarbeitungslinie"
  },
  "Escaneo contra Envenenamiento y PII": {
    "en": "Poison and PII Scanning",
    "pt": "Verificação de veneno e PII",
    "fr": "Analyse des poisons et des informations personnelles",
    "de": "Gift- und PII-Scannen"
  },
  "Ensure training, fine-tuning, and RAG grounding data are sourced from verified origins, cryptographically validated, protected from poisoning, and adhere to privacy and consent.": {
    "en": "Ensure training, fine-tuning, and RAG grounding data are sourced from verified origins, cryptographically validated, protected from poisoning, and adhere to privacy and consent.",
    "pt": "Garanta que os dados de treinamento, ajuste fino e aterramento RAG sejam provenientes de origens verificadas, validados criptograficamente, protegidos contra envenenamento e cumpram a privacidade e o consentimento.",
    "fr": "Assurez-vous que les données de formation, de réglage fin et de mise à la terre RAG proviennent d’origines vérifiées, validées cryptographiquement, protégées contre l’empoisonnement et respectent la confidentialité et le consentement.",
    "de": "Stellen Sie sicher, dass Trainings-, Feinabstimmungs- und RAG-Erdungsdaten aus verifizierten Quellen stammen, kryptografisch validiert und vor Vergiftungen geschützt sind und dass Datenschutz und Einwilligung eingehalten werden."
  },
  "Implementar un registro formal de datasets (Data Catalog) con firma criptográfica de cada snapshot y verificación automatizada de licencias en el pipeline de datos.": {
    "en": "Implement a formal dataset registry (Data Catalog) with cryptographic signature of each snapshot and automated license verification in the data pipeline.",
    "pt": "Implemente um registro formal de conjunto de dados (Catálogo de Dados) com assinatura criptográfica de cada snapshot e verificação automatizada de licença no pipeline de dados.",
    "fr": "Implémentez un registre formel d'ensembles de données (Data Catalog) avec une signature cryptographique de chaque instantané et une vérification automatisée des licences dans le pipeline de données.",
    "de": "Implementieren Sie eine formelle Datensatzregistrierung (Datenkatalog) mit kryptografischer Signatur jedes Snapshots und automatisierter Lizenzüberprüfung in der Datenpipeline."
  },
  "Garantizar resistencia contra infiltración o manipulación maliciosa de anotadores en modelos de misión crítica.": {
    "en": "Ensure resistance against infiltration or malicious manipulation of annotators in mission-critical models.",
    "pt": "Garanta resistência contra infiltração ou manipulação maliciosa de anotadores em modelos de missão crítica.",
    "fr": "Garantissez la résistance contre l’infiltration ou la manipulation malveillante des annotateurs dans les modèles critiques.",
    "de": "Sorgen Sie für Widerstand gegen Infiltration oder böswillige Manipulation von Annotatoren in geschäftskritischen Modellen."
  },
  "Firma criptográfica de snapshots y validación por consenso en datasets de etiquetado humano.": {
    "en": "Cryptographic signature of snapshots and consensus validation in human-labeled datasets.",
    "pt": "Assinatura criptográfica de instantâneos e validação de consenso em conjuntos de dados rotulados por humanos.",
    "fr": "Signature cryptographique d'instantanés et validation consensuelle dans des ensembles de données étiquetés par l'homme.",
    "de": "Kryptografische Signatur von Snapshots und Konsensvalidierung in von Menschen markierten Datensätzen."
  },
  "Adoptar herramientas de versionado de datos como DVC o Vertex AI Data Lineage para sellar cada pipeline de preprocesamiento.": {
    "en": "Adopt data versioning tools like DVC or Vertex AI Data Lineage to seal each preprocessing pipeline.",
    "pt": "Adote ferramentas de controle de versão de dados como DVC ou Vertex AI Data Lineage para selar cada pipeline de pré-processamento.",
    "fr": "Adoptez des outils de gestion des versions de données tels que DVC ou Vertex AI Data Lineage pour sceller chaque pipeline de prétraitement.",
    "de": "Nutzen Sie Tools zur Datenversionierung wie DVC oder Vertex AI Data Lineage, um jede Vorverarbeitungspipeline abzudichten."
  },
  "Comprobar firmas con claves de hardware (KMS) y métricas de concordancia inter-anotador (ej. Cohen's Kappa > 0.8).": {
    "en": "Check signatures with hardware keys (KMS) and inter-annotator agreement metrics (e.g. Cohen's Kappa > 0.8).",
    "pt": "Verifique as assinaturas com chaves de hardware (KMS) e métricas de acordo entre anotadores (por exemplo, Kappa de Cohen> 0,8).",
    "fr": "Vérifiez les signatures avec les clés matérielles (KMS) et les métriques d'accord inter-annotateurs (par exemple, Kappa de Cohen > 0,8).",
    "de": "Überprüfen Sie Signaturen mit Hardwareschlüsseln (KMS) und Inter-Annotator-Übereinstimmungsmetriken (z. B. Cohens Kappa > 0,8)."
  },
  "Verificar si el pipeline (ej. DVC, MLflow) registra cada transformación con versiones inmutables ligadas al hash del modelo.": {
    "en": "Check if the pipeline (e.g. DVC, MLflow) records each transformation with immutable versions linked to the model hash.",
    "pt": "Verifique se o pipeline (por exemplo, DVC, MLflow) registra cada transformação com versões imutáveis ​​vinculadas ao hash do modelo.",
    "fr": "Vérifiez si le pipeline (par exemple DVC, MLflow) enregistre chaque transformation avec des versions immuables liées au hachage du modèle.",
    "de": "Überprüfen Sie, ob die Pipeline (z. B. DVC, MLflow) jede Transformation mit unveränderlichen Versionen aufzeichnet, die mit dem Modell-Hash verknüpft sind."
  },
  "Permitir auditoría forense completa y reproducibilidad exacta de cualquier versión del modelo.": {
    "en": "Enable full forensic auditing and exact reproducibility of any version of the model.",
    "pt": "Habilite auditoria forense completa e reprodutibilidade exata de qualquer versão do modelo.",
    "fr": "Permettez un audit médico-légal complet et une reproductibilité exacte de n’importe quelle version du modèle.",
    "de": "Ermöglichen Sie eine vollständige forensische Prüfung und exakte Reproduzierbarkeit jeder Version des Modells."
  },
  "Requerir firmas digitales Sigstore/cosign en cada liberación de dataset y forzar validación cruzada por múltiples revisores independientes.": {
    "en": "Require Sigstore/cosign digital signatures on every dataset release and force cross-validation by multiple independent reviewers.",
    "pt": "Exija assinaturas digitais Sigstore/cosign em cada lançamento de conjunto de dados e force a validação cruzada por vários revisores independentes.",
    "fr": "Exigez des signatures numériques Sigstore/cosign sur chaque publication d'ensemble de données et forcez la validation croisée par plusieurs examinateurs indépendants.",
    "de": "Fordern Sie digitale Sigstore/Cosign-Signaturen bei jeder Datensatzveröffentlichung und erzwingen Sie die Kreuzvalidierung durch mehrere unabhängige Prüfer."
  },
  "Enforce defense-in-depth on all inputs (text, documents, multimodal) before tokenization and model execution.": {
    "en": "Enforce defense-in-depth on all inputs (text, documents, multimodal) before tokenization and model execution.",
    "pt": "Aplique defesa profunda em todas as entradas (texto, documentos, multimodal) antes da tokenização e execução do modelo.",
    "fr": "Appliquez une défense en profondeur sur toutes les entrées (texte, documents, multimodal) avant la tokenisation et l'exécution du modèle.",
    "de": "Erzwingen Sie eine Tiefenverteidigung für alle Eingaben (Text, Dokumente, multimodal) vor der Tokenisierung und Modellausführung."
  },
  "Firma Criptográfica y Consenso de Etiquetado": {
    "en": "Cryptographic Signature and Labeling Consensus",
    "pt": "Consenso de assinatura criptográfica e rotulagem",
    "fr": "Consensus sur la signature cryptographique et l’étiquetage",
    "de": "Konsens über kryptografische Signatur und Kennzeichnung"
  },
  "Normalización y Canonicalización Unicode": {
    "en": "Unicode Normalization and Canonicalization",
    "pt": "Normalização e canonização Unicode",
    "fr": "Normalisation et canonisation Unicode",
    "de": "Unicode-Normalisierung und Kanonisierung"
  },
  "Evitar evasión de filtros de seguridad mediante caracteres homóglifos o representaciones visuales idénticas pero con bytes distintos.": {
    "en": "Avoid evasion of security filters through homoglyph characters or identical visual representations but with different bytes.",
    "pt": "Evite a evasão de filtros de segurança através de caracteres homóglifos ou representações visuais idênticas, mas com bytes diferentes.",
    "fr": "Évitez de contourner les filtres de sécurité grâce à des caractères homoglyphes ou à des représentations visuelles identiques mais avec des octets différents.",
    "de": "Vermeiden Sie die Umgehung von Sicherheitsfiltern durch Homoglyphenzeichen oder identische visuelle Darstellungen, jedoch mit unterschiedlichen Bytes."
  },
  "Normalización de entrada (NFKC y colapso de espacios en blanco) antes de tokenización o generación de embeddings.": {
    "en": "Input normalization (NFKC and whitespace collapse) before tokenization or embedding generation.",
    "pt": "Normalização de entrada (NFKC e colapso de espaços em branco) antes da tokenização ou geração de incorporação.",
    "fr": "Normalisation des entrées (NFKC et effondrement des espaces) avant la tokenisation ou la génération d'intégration.",
    "de": "Eingabenormalisierung (NFKC und Whitespace-Zusammenbruch) vor der Tokenisierung oder Einbettungsgenerierung."
  },
  "Clasificación de Seguridad de Prompts": {
    "en": "Prompt Security Rating",
    "pt": "Classificação de segurança imediata",
    "fr": "Évaluation de sécurité rapide",
    "de": "Schnelle Sicherheitsbewertung"
  },
  "Detección de Ofuscación y Smuggling": {
    "en": "Obfuscation and Smuggling Detection",
    "pt": "Ofuscação e detecção de contrabando",
    "fr": "Obfuscation et détection de contrebande",
    "de": "Verschleierung und Schmuggelerkennung"
  },
  "Implementar un analizador heurístico de codificaciones en el API Gateway que identifique y decodifique recursivamente strings sospechosos antes de evaluar guardrails.": {
    "en": "Implement a heuristic encoding analyzer in the API Gateway that recursively identifies and decodes suspicious strings before evaluating guardrails.",
    "pt": "Implemente um analisador de codificação heurística no API Gateway que identifique e decodifique recursivamente strings suspeitas antes de avaliar as proteções.",
    "fr": "Implémentez un analyseur de codage heuristique dans API Gateway qui identifie et décode de manière récursive les chaînes suspectes avant d'évaluer les garde-fous.",
    "de": "Implementieren Sie einen heuristischen Codierungsanalysator im API Gateway, der verdächtige Zeichenfolgen rekursiv identifiziert und dekodiert, bevor Leitplanken ausgewertet werden."
  },
  "Aplicar input.normalize('NFKC') y sanitización de caracteres invisibles/zero-width en el middleware de entrada antes de cualquier procesamiento.": {
    "en": "Apply input.normalize('NFKC') and invisible/zero-width character sanitization in input middleware before any processing.",
    "pt": "Aplique input.normalize('NFKC') e higienização de caracteres invisíveis/largura zero no middleware de entrada antes de qualquer processamento.",
    "fr": "Appliquez input.normalize('NFKC') et la désinfection des caractères invisibles/de largeur nulle dans le middleware d'entrée avant tout traitement.",
    "de": "Wenden Sie vor der Verarbeitung input.normalize('NFKC') und die Bereinigung unsichtbarer/nullbreiter Zeichen in der Eingabe-Middleware an."
  },
  "Enviar payloads codificados en Base64 con instrucciones de jailbreak y verificar si el gateway los decodifica e inspecciona.": {
    "en": "Send Base64-encoded payloads with jailbreak instructions and check if the gateway decodes and inspects them.",
    "pt": "Envie cargas codificadas em Base64 com instruções de jailbreak e verifique se o gateway as decodifica e inspeciona.",
    "fr": "Envoyez des charges utiles codées en Base64 avec des instructions de jailbreak et vérifiez si la passerelle les décode et les inspecte.",
    "de": "Senden Sie Base64-kodierte Nutzlasten mit Jailbreak-Anweisungen und prüfen Sie, ob das Gateway sie dekodiert und prüft."
  },
  "Probar el endpoint con texto normalizado y caracteres cirílicos/homóglifos para comprobar si el validador estandariza a NFKC.": {
    "en": "Test the endpoint with normalized text and Cyrillic/homoglyph characters to check if the validator standardizes to NFKC.",
    "pt": "Teste o endpoint com texto normalizado e caracteres cirílicos/homóglifos para verificar se o validador padroniza para NFKC.",
    "fr": "Testez le point de terminaison avec du texte normalisé et des caractères cyrilliques/homoglyphes pour vérifier si le validateur se normalise selon NFKC.",
    "de": "Testen Sie den Endpunkt mit normalisiertem Text und kyrillischen/homoglyphischen Zeichen, um zu prüfen, ob der Validator auf NFKC standardisiert."
  },
  "Interceptar ataques de inyección directa e indirecta antes de alcanzar el contexto del LLM de destino.": {
    "en": "Intercept direct and indirect injection attacks before reaching the target LLM context.",
    "pt": "Intercepte ataques de injeção direta e indireta antes de atingir o contexto LLM alvo.",
    "fr": "Interceptez les attaques par injection directe et indirecte avant d’atteindre le contexte LLM cible.",
    "de": "Fangen Sie direkte und indirekte Injektionsangriffe ab, bevor Sie den LLM-Zielkontext erreichen."
  },
  "Todas las entradas que guíen al modelo deben ser tratadas como no confiables y analizadas por clasificadores de seguridad.": {
    "en": "All inputs driving the model must be treated as untrustworthy and analyzed by security classifiers.",
    "pt": "Todas as entradas que orientam o modelo devem ser tratadas como não confiáveis ​​e analisadas por classificadores de segurança.",
    "fr": "Toutes les entrées qui pilotent le modèle doivent être traitées comme non fiables et analysées par des classificateurs de sécurité.",
    "de": "Alle Eingaben, die das Modell steuern, müssen als nicht vertrauenswürdig behandelt und von Sicherheitsklassifikatoren analysiert werden."
  },
  "Detección de payloads ofuscados en Base64, homóglifos cirílicos, caracteres invisibles o secuencias de escape.": {
    "en": "Detection of payloads obfuscated in Base64, Cyrillic homoglyphs, invisible characters or escape sequences.",
    "pt": "Detecção de cargas ofuscadas em Base64, homóglifos cirílicos, caracteres invisíveis ou sequências de escape.",
    "fr": "Détection de charges utiles obscurcies en Base64, d'homoglyphes cyrilliques, de caractères invisibles ou de séquences d'échappement.",
    "de": "Erkennung von in Base64 verschleierten Nutzdaten, kyrillischen Homoglyphen, unsichtbaren Zeichen oder Escape-Sequenzen."
  },
  "Neutralizar intentos de contrabando de prompts a través de capas intermedias de decodificación.": {
    "en": "Neutralize prompt smuggling attempts through intermediate decoding layers.",
    "pt": "Neutralize tentativas de contrabando imediato por meio de camadas intermediárias de decodificação.",
    "fr": "Neutralisez les tentatives de contrebande rapides via des couches de décodage intermédiaires.",
    "de": "Neutralisieren Sie sofortige Schmuggelversuche durch zwischengeschaltete Decodierungsschichten."
  },
  "Revisar la integración de clasificadores como Llama Guard, NeMo Guardrails o Google Cloud Armor AI antes del modelo principal.": {
    "en": "Review the integration of classifiers such as Llama Guard, NeMo Guardrails or Google Cloud Armor AI before the main model.",
    "pt": "Revise a integração de classificadores como Llama Guard, NeMo Guardrails ou Google Cloud Armor AI antes do modelo principal.",
    "fr": "Passez en revue l'intégration de classificateurs tels que Llama Guard, NeMo Guardrails ou Google Cloud Armor AI avant le modèle principal.",
    "de": "Überprüfen Sie die Integration von Klassifikatoren wie Llama Guard, NeMo Guardrails oder Google Cloud Armor AI vor dem Hauptmodell."
  },
  "Desplegar un modelo clasificador de guardarraíl rápido (ej. Gemini 3.8 Flash con prompt de clasificación o Llama-Guard) como compuerta síncrona en el pipeline.": {
    "en": "Deploy a fast guardrail classifier model (e.g. Gemini 3.8 Flash with classification prompt or Llama-Guard) as a synchronous gate in the pipeline.",
    "pt": "Implante um modelo de classificador de guardrail rápido (por exemplo, Gemini 3.8 Flash com prompt de classificação ou Llama-Guard) como uma porta síncrona no pipeline.",
    "fr": "Déployez un modèle de classificateur de garde-corps rapide (par exemple Gemini 3.8 Flash avec invite de classification ou Llama-Guard) en tant que porte synchrone dans le pipeline.",
    "de": "Stellen Sie ein schnelles Leitplanken-Klassifizierungsmodell (z. B. Gemini 3.8 Flash mit Klassifizierungsaufforderung oder Llama-Guard) als synchrones Gate in der Pipeline bereit."
  },
  "Validación por Lista de Caracteres Permitidos": {
    "en": "Validation by List of Allowed Characters",
    "pt": "Validação por lista de caracteres permitidos",
    "fr": "Validation par liste de caractères autorisés",
    "de": "Validierung anhand der Liste der zulässigen Zeichen"
  },
  "Límites Estrictos de Longitud y Quotas de Tokens": {
    "en": "Strict Token Length and Quota Limits",
    "pt": "Comprimento estrito do token e limites de cota",
    "fr": "Limites strictes de longueur de jeton et de quota",
    "de": "Strenge Token-Längen- und Kontingentgrenzen"
  },
  "Prevenir agotamiento de contexto, ataques DoW y truncamiento que elimine las instrucciones de seguridad del sistema.": {
    "en": "Prevent context exhaustion, DoW attacks, and truncation that removes security instructions from the system.",
    "pt": "Evite o esgotamento do contexto, ataques DoW e truncamento que removem instruções de segurança do sistema.",
    "fr": "Empêchez l'épuisement du contexte, les attaques DoW et la troncature qui suppriment les instructions de sécurité du système.",
    "de": "Verhindern Sie Kontexterschöpfung, DoW-Angriffe und Kürzungen, die Sicherheitsanweisungen aus dem System entfernen."
  },
  "Límites estrictos de tamaño de entrada; rechazar con HTTP 400 las entradas que excedan cuotas en vez de truncar silenciosamente.": {
    "en": "Strict input size limits; reject inputs that exceed quotas with HTTP 400 instead of silently truncating.",
    "pt": "Limites rígidos de tamanho de entrada; rejeite entradas que excedam as cotas com HTTP 400 em vez de truncá-las silenciosamente.",
    "fr": "Limites strictes de taille d’entrée ; rejetez les entrées qui dépassent les quotas avec HTTP 400 au lieu de les tronquer silencieusement.",
    "de": "Strenge Beschränkungen der Eingabegröße; Lehnen Sie Eingaben ab, die die Kontingente mit HTTP 400 überschreiten, anstatt sie stillschweigend abzuschneiden."
  },
  "Reducir la superficie de ataque bloqueando caracteres de control, secuencias terminales y símbolos no contemplados.": {
    "en": "Reduce the attack surface by blocking control characters, terminal sequences and unsupported symbols.",
    "pt": "Reduza a superfície de ataque bloqueando caracteres de controle, sequências de terminais e símbolos não suportados.",
    "fr": "Réduisez la surface d’attaque en bloquant les caractères de contrôle, les séquences de terminaux et les symboles non pris en charge.",
    "de": "Reduzieren Sie die Angriffsfläche, indem Sie Steuerzeichen, Terminalsequenzen und nicht unterstützte Symbole blockieren."
  },
  "Enviar un payload con 100K tokens y verificar si el backend responde con error 400 inmediato sin invocar al LLM.": {
    "en": "Send a payload with 100K tokens and check if the backend responds with an immediate 400 error without invoking the LLM.",
    "pt": "Envie uma carga útil com 100 mil tokens e verifique se o backend responde com um erro 400 imediato sem invocar o LLM.",
    "fr": "Envoyez une charge utile avec 100 000 jetons et vérifiez si le backend répond avec une erreur 400 immédiate sans appeler le LLM.",
    "de": "Senden Sie eine Nutzlast mit 100.000 Tokens und prüfen Sie, ob das Backend mit einem sofortigen 400-Fehler antwortet, ohne das LLM aufzurufen."
  },
  "Configurar esquemas de validación estrictos en cada endpoint utilizando Zod o JSON Schema con patrones de caracteres permitidos.": {
    "en": "Configure strict validation schemes on each endpoint using Zod or JSON Schema with allowed character patterns.",
    "pt": "Configure esquemas de validação rigorosos em cada endpoint usando esquema Zod ou JSON com padrões de caracteres permitidos.",
    "fr": "Configurez des schémas de validation stricts sur chaque point de terminaison à l'aide d'un schéma Zod ou JSON avec des modèles de caractères autorisés.",
    "de": "Konfigurieren Sie strenge Validierungsschemata auf jedem Endpunkt mithilfe von Zod oder JSON Schema mit zulässigen Zeichenmustern."
  },
  "Verificar expresiones regulares y schemas de validación (Zod/Joi) en la capa de transporte API.": {
    "en": "Verify regular expressions and validation schemas (Zod/Joi) in the API transport layer.",
    "pt": "Verifique expressões regulares e esquemas de validação (Zod/Joi) na camada de transporte da API.",
    "fr": "Vérifiez les expressions régulières et les schémas de validation (Zod/Joi) dans la couche de transport API.",
    "de": "Überprüfen Sie reguläre Ausdrücke und Validierungsschemata (Zod/Joi) in der API-Transportschicht."
  },
  "Validación por allow-list permitiendo únicamente los conjuntos de caracteres necesarios para el dominio del negocio.": {
    "en": "Validation by allow-list allowing only the character sets necessary for the business domain.",
    "pt": "Validação por lista de permissões permitindo apenas os conjuntos de caracteres necessários para o domínio de negócio.",
    "fr": "Validation par liste verte autorisant uniquement les jeux de caractères nécessaires au domaine métier.",
    "de": "Validierung durch Zulassungsliste, die nur die für die Geschäftsdomäne erforderlichen Zeichensätze zulässt."
  },
  "Jerarquía de Instrucciones y Delimitadores Claros": {
    "en": "Instruction Hierarchy and Clear Delimiters",
    "pt": "Hierarquia de instruções e delimitadores claros",
    "fr": "Hiérarchie des instructions et délimiteurs clairs",
    "de": "Befehlshierarchie und klare Trennzeichen"
  },
  "Inspeccionar las plantillas de prompts para verificar el uso de roles de sistema nativos o delimitadores XML/ChatML robustos.": {
    "en": "Inspect prompt templates for use of native system roles or robust XML/ChatML delimiters.",
    "pt": "Inspecione modelos de prompt para uso de funções nativas do sistema ou delimitadores XML/ChatML robustos.",
    "fr": "Inspectez les modèles d’invite pour l’utilisation de rôles système natifs ou de délimiteurs XML/ChatML robustes.",
    "de": "Überprüfen Sie Eingabeaufforderungsvorlagen auf die Verwendung nativer Systemrollen oder robuster XML/ChatML-Trennzeichen."
  },
  "Impedir que un atacante suplante el rol del sistema o anule directivas de seguridad fundamentales.": {
    "en": "Prevent an attacker from impersonating the system or overriding critical security policies.",
    "pt": "Evite que um invasor se faça passar pelo sistema ou substitua políticas de segurança críticas.",
    "fr": "Empêchez un attaquant d'usurper l'identité du système ou de contourner les politiques de sécurité critiques.",
    "de": "Verhindern Sie, dass ein Angreifer sich als System ausgibt oder wichtige Sicherheitsrichtlinien außer Kraft setzt."
  },
  "Prevenir que el atacante cierre prematuramente el turno del sistema o simule turnos de asistente falsos.": {
    "en": "Prevent attacker from prematurely closing system shift or simulating fake wizard shifts.",
    "pt": "Evite que o invasor feche prematuramente a mudança do sistema ou simule mudanças falsas de assistente.",
    "fr": "Empêchez les attaquants de fermer prématurément les changements de système ou de simuler de faux changements d'assistant.",
    "de": "Verhindern Sie, dass Angreifer die Systemverschiebung vorzeitig schließen oder gefälschte Assistentenverschiebungen simulieren."
  },
  "Garantizar que tokens de control del modelo (ej. <|endoftext|>, <start_of_turn>) no puedan ser inyectados en texto plano.": {
    "en": "Ensure that model control tokens (e.g. <|endoftext|>, <start_of_turn>) cannot be injected into plain text.",
    "pt": "Certifique-se de que os tokens de controle do modelo (por exemplo, <|endoftext|>, <start_of_turn>) não possam ser injetados em texto simples.",
    "fr": "Assurez-vous que les jetons de contrôle de modèle (par exemple <|endoftext|>, <start_of_turn>) ne peuvent pas être injectés dans du texte brut.",
    "de": "Stellen Sie sicher, dass Modellsteuerungstoken (z. B. <|endoftext|>, <start_of_turn>) nicht in Klartext eingefügt werden können."
  },
  "Jerarquía estricta donde las instrucciones del desarrollador/sistema prevalecen sobre el usuario, demarcadas por delimitadores inequívocos.": {
    "en": "Strict hierarchy where the developer/system instructions take precedence over the user, demarcated by unambiguous delimiters.",
    "pt": "Hierarquia estrita onde as instruções do desenvolvedor/sistema têm precedência sobre o usuário, demarcadas por delimitadores inequívocos.",
    "fr": "Hiérarchie stricte où les instructions développeur/système ont préséance sur l'utilisateur, délimitée par des délimiteurs sans ambiguïté.",
    "de": "Strikte Hierarchie, bei der die Entwickler-/Systemanweisungen Vorrang vor dem Benutzer haben, abgegrenzt durch eindeutige Trennzeichen."
  },
  "Neutralización de Tokens Especiales Reservados": {
    "en": "Neutralization of Special Reserved Tokens",
    "pt": "Neutralização de Tokens Reservados Especiais",
    "fr": "Neutralisation des jetons spéciaux réservés",
    "de": "Neutralisierung speziell reservierter Token"
  },
  "Calcular tokens en backend (usando tiktoken o el tokenizer oficial) y rechazar con error explícito 400 Bad Request cualquier petición que exceda el umbral permitido.": {
    "en": "Calculate tokens in the backend (using tiktoken or the official tokenizer) and reject with an explicit 400 Bad Request error any request that exceeds the allowed threshold.",
    "pt": "Calcule tokens no backend (usando tiktoken ou o tokenizer oficial) e rejeite com um erro explícito 400 Bad Request qualquer solicitação que exceda o limite permitido.",
    "fr": "Calculez les jetons dans le backend (à l'aide de tiktoken ou du tokenizer officiel) et rejetez avec une erreur explicite 400 Bad Request toute demande qui dépasse le seuil autorisé.",
    "de": "Berechnen Sie Token im Backend (mit Tiktoken oder dem offiziellen Tokenizer) und lehnen Sie mit einem expliziten 400 Bad Request-Fehler jede Anfrage ab, die den zulässigen Schwellenwert überschreitet."
  },
  "Filtrado de Contenido Dañino y Políticas": {
    "en": "Harmful Content Filtering and Policies",
    "pt": "Filtragem e políticas de conteúdo prejudicial",
    "fr": "Filtrage et politiques de contenu nuisible",
    "de": "Filterung schädlicher Inhalte und Richtlinien"
  },
  "Configurar el tokenizador con allowed_special={} o sanitizar secuencias de control antes de ensamblar el prompt.": {
    "en": "Configure the tokenizer with allowed_special={} or sanitize control sequences before assembling the prompt.",
    "pt": "Configure o tokenizer com Allow_special={} ou limpe as sequências de controle antes de montar o prompt.",
    "fr": "Configurez le tokenizer avec Allowed_special={} ou désinfectez les séquences de contrôle avant d'assembler l'invite.",
    "de": "Konfigurieren Sie den Tokenizer mit „allowed_special={}“ oder bereinigen Sie Steuersequenzen, bevor Sie die Eingabeaufforderung zusammenstellen."
  },
  "Utilizar el parámetro systemInstruction nativo de la API de Gemini u OpenAI en lugar de interpolación simple de strings, delimitando datos de usuario con etiquetas <user_input>.": {
    "en": "Use the native Gemini or OpenAI API systemInstruction parameter instead of simple string interpolation, delimiting user data with <user_input> tags.",
    "pt": "Use o parâmetro systemInstruction da API nativa Gemini ou OpenAI em vez de interpolação de string simples, delimitando os dados do usuário com tags <user_input>.",
    "fr": "Utilisez le paramètre systemInstruction natif de l'API Gemini ou OpenAI au lieu d'une simple interpolation de chaîne, en délimitant les données utilisateur avec des balises <user_input>.",
    "de": "Verwenden Sie den systemInstruction-Parameter der nativen Gemini- oder OpenAI-API anstelle einer einfachen String-Interpolation und begrenzen Sie Benutzerdaten mit <user_input>-Tags."
  },
  "Enviar texto conteniendo secuencias reservadas de ChatML o Gemini y verificar que el tokenizador las interprete como texto literal y no como tokens especiales.": {
    "en": "Send text containing reserved ChatML or Gemini sequences and verify that the tokenizer interprets them as literal text and not special tokens.",
    "pt": "Envie texto contendo sequências reservadas de ChatML ou Gemini e verifique se o tokenizer as interpreta como texto literal e não como tokens especiais.",
    "fr": "Envoyez du texte contenant des séquences ChatML ou Gemini réservées et vérifiez que le tokenizer les interprète comme du texte littéral et non comme des jetons spéciaux.",
    "de": "Senden Sie Text, der reservierte ChatML- oder Gemini-Sequenzen enthält, und stellen Sie sicher, dass der Tokenizer diese als wörtlichen Text und nicht als spezielle Token interpretiert."
  },
  "Detección y bloqueo de contenido de odio, violencia, autolesión y actos ilegales con umbrales configurables.": {
    "en": "Detection and blocking of hate content, violence, self-harm and illegal acts with configurable thresholds.",
    "pt": "Detecção e bloqueio de conteúdo de ódio, violência, automutilação e atos ilegais com limites configuráveis.",
    "fr": "Détection et blocage des contenus haineux, de la violence, de l'automutilation et des actes illégaux avec des seuils configurables.",
    "de": "Erkennung und Blockierung von Hassinhalten, Gewalt, Selbstverletzung und illegalen Handlungen mit konfigurierbaren Schwellenwerten."
  },
  "Activar los filtros de seguridad nativos de la API con umbrales estrictos para todas las categorías de daño en server.ts.": {
    "en": "Enable native API security filters with strict thresholds for all corruption categories in server.ts.",
    "pt": "Habilite filtros de segurança de API nativos com limites rígidos para todas as categorias de corrupção em server.ts.",
    "fr": "Activez les filtres de sécurité API natifs avec des seuils stricts pour toutes les catégories de corruption dans server.ts.",
    "de": "Aktivieren Sie native API-Sicherheitsfilter mit strengen Schwellenwerten für alle Korruptionskategorien in server.ts."
  },
  "Revisar los safetySettings del cliente de LLM para confirmar umbrales 'BLOCK_LOW_AND_ABOVE' o 'BLOCK_MEDIUM_AND_ABOVE'.": {
    "en": "Review LLM client safetySettings to confirm 'BLOCK_LOW_AND_ABOVE' or 'BLOCK_MEDIUM_AND_ABOVE' thresholds.",
    "pt": "Revise as configurações de segurança do cliente LLM para confirmar os limites 'BLOCK_LOW_AND_ABOVE' ou 'BLOCK_MEDIUM_AND_ABOVE'.",
    "fr": "Examinez les paramètres de sécurité du client LLM pour confirmer les seuils « BLOCK_LOW_AND_ABOVE » ou « BLOCK_MEDIUM_AND_ABOVE ».",
    "de": "Überprüfen Sie die Sicherheitseinstellungen des LLM-Clients, um die Schwellenwerte „BLOCK_LOW_AND_ABOVE“ oder „BLOCK_MEDIUM_AND_ABOVE“ zu bestätigen."
  },
  "Alinear el uso del sistema con políticas organizacionales y normativas de seguridad de contenidos.": {
    "en": "Align the use of the system with organizational policies and content security regulations.",
    "pt": "Alinhe o uso do sistema com políticas organizacionais e regulamentos de segurança de conteúdo.",
    "fr": "Alignez l’utilisation du système avec les politiques organisationnelles et les réglementations en matière de sécurité du contenu.",
    "de": "Richten Sie die Nutzung des Systems an den Unternehmensrichtlinien und Inhaltssicherheitsvorschriften aus."
  },
  "Escanear imágenes, PDFs y audio contra perturbaciones adversariales, payloads esteganográficos e inyecciones de prompt en OCR.": {
    "en": "Scan images, PDFs and audio against adversarial jamming, steganographic payloads and OCR prompt injections.",
    "pt": "Digitalize imagens, PDFs e áudio contra interferências adversárias, cargas esteganográficas e injeções imediatas de OCR.",
    "fr": "Numérisez des images, des PDF et des fichiers audio contre le brouillage adverse, les charges utiles stéganographiques et les injections d'invites OCR.",
    "de": "Scannen Sie Bilder, PDFs und Audiodateien gegen unerwünschtes Jamming, steganografische Nutzlasten und OCR-Eingabeaufforderungen."
  },
  "Prevenir ataques indirectos de inyección embebidos visualmente en imágenes de facturas, CVs o documentos adjuntos.": {
    "en": "Prevent indirect injection attacks visually embedded in images of invoices, CVs or attached documents.",
    "pt": "Evite ataques de injeção indireta visualmente incorporados em imagens de faturas, currículos ou documentos anexados.",
    "fr": "Empêchez les attaques par injection indirecte visuellement intégrées dans les images de factures, de CV ou de documents joints.",
    "de": "Verhindern Sie indirekte Injektionsangriffe, die visuell in Bilder von Rechnungen, Lebensläufen oder angehängten Dokumenten eingebettet sind."
  },
  "Escaneo de Inyecciones en Entradas Multimodales": {
    "en": "Scanning Injections in Multimodal Entrances",
    "pt": "Varredura de injeções em entradas multimodais",
    "fr": "Scanner les injections dans les entrées multimodales",
    "de": "Scannen von Injektionen in multimodalen Eingängen"
  },
  "Detección de patrones de jailbreaking progresivo y acumulación de estado adversarial a lo largo de múltiples turnos.": {
    "en": "Detection of progressive jailbreaking patterns and accumulation of adversarial state over multiple turns.",
    "pt": "Detecção de padrões progressivos de jailbreak e acúmulo de estado adversário em vários turnos.",
    "fr": "Détection de modèles de jailbreak progressifs et accumulation d’états contradictoires sur plusieurs tours.",
    "de": "Erkennung fortschreitender Jailbreaking-Muster und der Anhäufung gegnerischer Zustände über mehrere Runden hinweg."
  },
  "Detección de Jailbreaking Multi-Turn y Many-Shot": {
    "en": "Multi-Turn and Many-Shot Jailbreaking Detection",
    "pt": "Detecção de jailbreak multivoltas e muitos disparos",
    "fr": "Détection de jailbreak multi-tours et à plusieurs coups",
    "de": "Multi-Turn- und Many-Shot-Jailbreaking-Erkennung"
  },
  "Cargar imágenes con texto malicioso oculto (bajo contraste o metadatos EXIF) y comprobar si el pipeline extrae e inspecciona el texto antes de la inferencia.": {
    "en": "Load images with hidden malicious text (low contrast or EXIF ​​metadata) and check if the pipeline extracts and inspects the text before inference.",
    "pt": "Carregue imagens com texto malicioso oculto (baixo contraste ou metadados EXIF) e verifique se o pipeline extrai e inspeciona o texto antes da inferência.",
    "fr": "Chargez des images avec du texte malveillant masqué (faible contraste ou métadonnées EXIF) et vérifiez si le pipeline extrait et inspecte le texte avant l'inférence.",
    "de": "Laden Sie Bilder mit verstecktem bösartigem Text (geringer Kontrast oder EXIF-Metadaten) und prüfen Sie, ob die Pipeline den Text extrahiert und prüft, bevor daraus Rückschlüsse gezogen werden."
  },
  "Frenar ataques sofisticados que gradualmente convencen al modelo de ignorar directivas éticas a lo largo de la conversación.": {
    "en": "Stop sophisticated attacks that gradually convince the model to ignore ethical directives throughout the conversation.",
    "pt": "Pare de ataques sofisticados que gradualmente convencem o modelo a ignorar as diretrizes éticas ao longo da conversa.",
    "fr": "Arrêtez les attaques sophistiquées qui convainquent progressivement le modèle d'ignorer les directives éthiques tout au long de la conversation.",
    "de": "Stoppen Sie raffinierte Angriffe, die das Model nach und nach davon überzeugen, ethische Richtlinien während des gesamten Gesprächs zu ignorieren."
  },
  "Procesar metadatos de archivos multimedia, normalizar imágenes y pasar el texto extraído por OCR por el filtro de validación de entradas de C02.3.": {
    "en": "Process metadata from multimedia files, normalize images, and pass the OCR-extracted text through the C02.3 input validation filter.",
    "pt": "Processe metadados de arquivos multimídia, normalize imagens e passe o texto extraído do OCR através do filtro de validação de entrada C02.3.",
    "fr": "Traitez les métadonnées des fichiers multimédias, normalisez les images et transmettez le texte extrait par OCR via le filtre de validation d'entrée C02.3.",
    "de": "Verarbeiten Sie Metadaten aus Multimediadateien, normalisieren Sie Bilder und leiten Sie den OCR-extrahierten Text durch den Eingabevalidierungsfilter C02.3."
  },
  "Verificar en los scripts de despliegue la existencia de pasos obligatorios de validación de checksum o firma cosign.": {
    "en": "Verify the existence of mandatory checksum or cosign signature validation steps in the deployment scripts.",
    "pt": "Verifique a existência de etapas obrigatórias de validação de soma de verificação ou assinatura de garantia nos scripts de implantação.",
    "fr": "Vérifiez l’existence d’étapes obligatoires de validation de somme de contrôle ou de signature de cosignature dans les scripts de déploiement.",
    "de": "Überprüfen Sie das Vorhandensein obligatorischer Prüfsummen- oder Cosign-Signaturvalidierungsschritte in den Bereitstellungsskripts."
  },
  "Prevenir la ejecución de modelos comprometidos o alterados durante el transporte o almacenamiento.": {
    "en": "Prevent the execution of compromised or altered models during transportation or storage.",
    "pt": "Impedir a execução de modelos comprometidos ou alterados durante o transporte ou armazenamento.",
    "fr": "Empêchez l’exécution de modèles compromis ou modifiés pendant le transport ou le stockage.",
    "de": "Verhindern Sie die Ausführung beeinträchtigter oder veränderter Modelle während des Transports oder der Lagerung."
  },
  "Govern base model selection, fine-tuning, quantization, artifact integrity, and decommissioning.": {
    "en": "Govern base model selection, fine-tuning, quantization, artifact integrity, and decommissioning.",
    "pt": "Controle a seleção do modelo básico, o ajuste fino, a quantização, a integridade do artefato e o descomissionamento.",
    "fr": "Gouvernez la sélection, le réglage fin, la quantification, l’intégrité des artefacts et la mise hors service du modèle de base.",
    "de": "Steuern Sie die Auswahl, Feinabstimmung, Quantisierung, Artefaktintegrität und Außerbetriebnahme des Basismodells."
  },
  "Evaluar la ventana de contexto histórica con analizadores de coherencia adversarial o ventanas deslizantes de auditoría.": {
    "en": "Evaluate the historical context window with adversarial consistency analyzers or sliding audit windows.",
    "pt": "Avalie a janela de contexto histórico com analisadores de consistência adversários ou janelas deslizantes de auditoria.",
    "fr": "Évaluez la fenêtre de contexte historique avec des analyseurs de cohérence contradictoires ou des fenêtres d'audit glissantes.",
    "de": "Bewerten Sie das historische Kontextfenster mit kontradiktorischen Konsistenzanalysatoren oder gleitenden Prüffenstern."
  },
  "Verificación mediante firmas SHA-256 o Sigstore cosign de los pesos y arquitectura antes de la carga en memoria.": {
    "en": "Verification using SHA-256 or Sigstore cosign signatures of the weights and architecture before loading into memory.",
    "pt": "Verificação usando assinaturas de garantia SHA-256 ou Sigstore dos pesos e arquitetura antes de carregar na memória.",
    "fr": "Vérification à l'aide des signatures de cosignature SHA-256 ou Sigstore des poids et de l'architecture avant chargement en mémoire.",
    "de": "Überprüfung mithilfe von SHA-256- oder Sigstore-Cosign-Signaturen der Gewichte und der Architektur vor dem Laden in den Speicher."
  },
  "Verificación Criptográfica de Pesos y Modelos": {
    "en": "Cryptographic Verification of Weights and Models",
    "pt": "Verificação criptográfica de pesos e modelos",
    "fr": "Vérification cryptographique des poids et des modèles",
    "de": "Kryptografische Überprüfung von Gewichten und Modellen"
  },
  "Implementar un monitor de deriva semántica en la sesión que analice la conversación completa cada N turnos para identificar escalada adversarial.": {
    "en": "Implement a semantic drift monitor in the session that analyzes the entire conversation every N turns to identify adversarial escalation.",
    "pt": "Implemente um monitor de desvio semântico na sessão que analise toda a conversa a cada N turnos para identificar a escalada adversária.",
    "fr": "Implémentez un moniteur de dérive sémantique dans la session qui analyse l'intégralité de la conversation tous les N tours pour identifier l'escalade contradictoire.",
    "de": "Implementieren Sie in der Sitzung einen semantischen Driftmonitor, der alle N Runden die gesamte Konversation analysiert, um eine gegnerische Eskalation zu erkennen."
  },
  "Repositorio Aislado y Versionado de Checkpoints": {
    "en": "Isolated and Versioned Checkpoints Repository",
    "pt": "Repositório de pontos de verificação isolados e versionados",
    "fr": "Référentiel de points de contrôle isolés et versionnés",
    "de": "Isoliertes und versioniertes Checkpoints-Repository"
  },
  "Inspeccionar permisos IAM del bucket de almacenamiento del modelo (Artifact Registry, S3, GCS) y verificar bloqueo de acceso público.": {
    "en": "Inspect IAM permissions of the model storage bucket (Artifact Registry, S3, GCS) and verify public access blocking.",
    "pt": "Inspecione as permissões IAM do bucket de armazenamento do modelo (Artifact Registry, S3, GCS) e verifique o bloqueio de acesso público.",
    "fr": "Inspectez les autorisations IAM du compartiment de stockage du modèle (Artifact Registry, S3, GCS) et vérifiez le blocage de l'accès public.",
    "de": "Überprüfen Sie die IAM-Berechtigungen des Modellspeicher-Buckets (Artifact Registry, S3, GCS) und überprüfen Sie die Blockierung des öffentlichen Zugriffs."
  },
  "Verificar que los clústeres de entrenamiento operen dentro de VPCs sin acceso directo a internet (VPC Service Controls / Private Link).": {
    "en": "Verify that the training clusters operate within VPCs without direct access to the internet (VPC Service Controls / Private Link).",
    "pt": "Verifique se os clusters de treinamento operam em VPCs sem acesso direto à Internet (VPC Service Controls/Private Link).",
    "fr": "Vérifiez que les clusters de formation fonctionnent au sein de VPC sans accès direct à Internet (VPC Service Controls / Private Link).",
    "de": "Stellen Sie sicher, dass die Trainingscluster innerhalb von VPCs ohne direkten Zugriff auf das Internet funktionieren (VPC Service Controls/Private Link)."
  },
  "Almacenamiento seguro de checkpoints en repositorios de artefactos aislados con control de acceso y versionado estricto.": {
    "en": "Secure storage of checkpoints in isolated artifact repositories with strict access control and versioning.",
    "pt": "Armazenamento seguro de pontos de verificação em repositórios de artefatos isolados com controle de acesso e controle de versão rigorosos.",
    "fr": "Stockage sécurisé des points de contrôle dans des référentiels d'artefacts isolés avec un contrôle d'accès et une gestion des versions stricts.",
    "de": "Sichere Speicherung von Prüfpunkten in isolierten Artefakt-Repositorys mit strenger Zugriffskontrolle und Versionierung."
  },
  "Entornos de fine-tuning aislados o con restricción de red para prevenir exfiltración de pesos y datos sensibles.": {
    "en": "Isolated fine-tuning environments or with network restriction to prevent exfiltration of weights and sensitive data.",
    "pt": "Ambientes isolados de ajuste fino ou com restrição de rede para evitar exfiltração de pesos e dados sensíveis.",
    "fr": "Environnements de réglage fin isolés ou avec restriction de réseau pour empêcher l'exfiltration des poids et des données sensibles.",
    "de": "Isolierte Feinabstimmungsumgebungen oder mit Netzwerkbeschränkung, um die Exfiltration von Gewichten und sensiblen Daten zu verhindern."
  },
  "Evitar accesos no autorizados o sobrescritura accidental/maliciosa de versiones de modelos en producción.": {
    "en": "Prevent unauthorized access or accidental/malicious overwriting of versions of models in production.",
    "pt": "Evite acesso não autorizado ou substituição acidental/malicioso de versões de modelos em produção.",
    "fr": "Empêchez l’accès non autorisé ou l’écrasement accidentel/malveillant des versions des modèles en production.",
    "de": "Verhindern Sie unbefugten Zugriff oder versehentliches/böswilliges Überschreiben von Modellversionen in der Produktion."
  },
  "Proteger la propiedad intelectual de la empresa y evitar fugas de datos durante entrenamientos pesados.": {
    "en": "Protect company intellectual property and prevent data leaks during heavy training.",
    "pt": "Proteja a propriedade intelectual da empresa e evite vazamentos de dados durante treinamentos intensos.",
    "fr": "Protégez la propriété intellectuelle de l’entreprise et évitez les fuites de données lors de formations intensives.",
    "de": "Schützen Sie das geistige Eigentum des Unternehmens und verhindern Sie Datenlecks während intensiver Schulungen."
  },
  "Aislamiento de Red en Entornos de Fine-Tuning": {
    "en": "Network Isolation in Fine-Tuning Environments",
    "pt": "Isolamento de rede em ambientes de ajuste fino",
    "fr": "Isolation du réseau dans des environnements de réglage fin",
    "de": "Netzwerkisolation in Feinabstimmungsumgebungen"
  },
  "Configurar un check de integridad en el script de arranque del contenedor que compare el hash SHA-256 contra un registro inmutable antes de cargar el modelo.": {
    "en": "Configure an integrity check in the container startup script that compares the SHA-256 hash against an immutable record before loading the model.",
    "pt": "Configure uma verificação de integridade no script de inicialização do contêiner que compara o hash SHA-256 com um registro imutável antes de carregar o modelo.",
    "fr": "Configurez une vérification d'intégrité dans le script de démarrage du conteneur qui compare le hachage SHA-256 à un enregistrement immuable avant de charger le modèle.",
    "de": "Konfigurieren Sie im Container-Startskript eine Integritätsprüfung, die den SHA-256-Hash mit einem unveränderlichen Datensatz vergleicht, bevor das Modell geladen wird."
  },
  "Restringir el acceso a los artefactos del modelo a identidades de servicio dedicadas mediante IAM de mínimo privilegio con CMEK y versionado activado.": {
    "en": "Restrict access to model artifacts to dedicated service identities using least privilege IAM with CMEK and versioning enabled.",
    "pt": "Restrinja o acesso a artefatos de modelo a identidades de serviço dedicadas usando IAM de privilégio mínimo com CMEK e controle de versão habilitados.",
    "fr": "Restreindre l'accès aux artefacts de modèle aux identités de service dédiées en utilisant le moindre privilège IAM avec CMEK et le contrôle de version activé.",
    "de": "Beschränken Sie den Zugriff auf Modellartefakte auf dedizierte Dienstidentitäten mithilfe von IAM mit den geringsten Rechten und aktiviertem CMEK und Versionierung."
  },
  "Configurar VPC Service Controls y firewalls de egreso en el entorno de entrenamiento, permitiendo solo tráfico hacia el registro interno de modelos.": {
    "en": "Configure VPC Service Controls and egress firewalls in the training environment, allowing only traffic to the internal model registry.",
    "pt": "Configure VPC Service Controls e firewalls de saída no ambiente de treinamento, permitindo apenas o tráfego para o registro do modelo interno.",
    "fr": "Configurez VPC Service Controls et les pare-feu de sortie dans l'environnement de formation, en autorisant uniquement le trafic vers le registre de modèles interne.",
    "de": "Konfigurieren Sie VPC Service Controls und Egress-Firewalls in der Trainingsumgebung und lassen Sie nur Datenverkehr zur internen Modellregistrierung zu."
  },
  "Procedimiento formal de retiro de endpoints, purga de cachés de inferencia y triturado seguro de pesos obsoletos.": {
    "en": "Formal endpoint retirement procedure, purging inference caches, and secure shredding of obsolete weights.",
    "pt": "Procedimento formal de retirada de endpoint, limpeza de caches de inferência e destruição segura de pesos obsoletos.",
    "fr": "Procédure formelle de retrait des points de terminaison, purge des caches d’inférence et destruction sécurisée des pondérations obsolètes.",
    "de": "Formales Endpunkt-Stilllegungsverfahren, Löschen von Inferenz-Caches und sicheres Shreddern veralteter Gewichtungen."
  },
  "Evitar que modelos obsoletos o vulnerables continúen expuestos como endpoints zombies o filtrados en almacenamiento secundario.": {
    "en": "Prevent obsolete or vulnerable models from continuing to be exposed as zombie endpoints or leaked into secondary storage.",
    "pt": "Evite que modelos obsoletos ou vulneráveis ​​continuem a ser expostos como endpoints zumbis ou vazem para o armazenamento secundário.",
    "fr": "Empêchez les modèles obsolètes ou vulnérables de continuer à être exposés en tant que points de terminaison zombies ou à être divulgués dans le stockage secondaire.",
    "de": "Verhindern Sie, dass veraltete oder anfällige Modelle weiterhin als Zombie-Endpunkte offengelegt werden oder in den Sekundärspeicher gelangen."
  },
  "Harden compute platforms, accelerators, network perimeters, and sandbox environments.": {
    "en": "Harden compute platforms, accelerators, network perimeters, and sandbox environments.",
    "pt": "Fortaleça plataformas de computação, aceleradores, perímetros de rede e ambientes sandbox.",
    "fr": "Renforcez les plates-formes de calcul, les accélérateurs, les périmètres réseau et les environnements sandbox.",
    "de": "Härten Sie Rechenplattformen, Beschleuniger, Netzwerkperimeter und Sandbox-Umgebungen."
  },
  "Ejecución de runtimes de inferencia en contenedores sin privilegios (rootless) y con sistema de archivos raíz de solo lectura.": {
    "en": "Execution of inference runtimes in unprivileged containers (rootless) and with a read-only root file system.",
    "pt": "Execução de tempos de execução de inferência em contêineres sem privilégios (sem raiz) e com sistema de arquivos raiz somente leitura.",
    "fr": "Exécution de runtimes d'inférence dans des conteneurs non privilégiés (sans racine) et avec un système de fichiers racine en lecture seule.",
    "de": "Ausführung von Inferenzlaufzeiten in unprivilegierten Containern (rootless) und mit einem schreibgeschützten Root-Dateisystem."
  },
  "Limitar el impacto de una vulnerabilidad de ejecución remota de código en el runtime del modelo.": {
    "en": "Limit the impact of a remote code execution vulnerability on the model runtime.",
    "pt": "Limite o impacto de uma vulnerabilidade de execução remota de código no tempo de execução do modelo.",
    "fr": "Limitez l’impact d’une vulnérabilité d’exécution de code à distance sur le runtime du modèle.",
    "de": "Begrenzen Sie die Auswirkungen einer Sicherheitslücke bei der Remotecodeausführung auf die Modelllaufzeit."
  },
  "Revisar políticas de retención y certificados de eliminación criptográfica al desmantelar versiones del modelo.": {
    "en": "Review retention policies and cryptographic deletion certificates when decommissioning model versions.",
    "pt": "Revise as políticas de retenção e os certificados de exclusão criptográfica ao desativar versões do modelo.",
    "fr": "Examinez les politiques de rétention et les certificats de suppression cryptographiques lors de la mise hors service des versions de modèle.",
    "de": "Überprüfen Sie Aufbewahrungsrichtlinien und kryptografische Löschzertifikate, wenn Sie Modellversionen außer Betrieb nehmen."
  },
  "Inspeccionar los Dockerfiles y manifiestos de Kubernetes para verificar securityContext.runAsNonRoot: true y readOnlyRootFilesystem: true.": {
    "en": "Inspect Dockerfiles and Kubernetes manifests to verify securityContext.runAsNonRoot: true and readOnlyRootFilesystem: true.",
    "pt": "Inspecione os manifestos Dockerfiles e Kubernetes para verificar securityContext.runAsNonRoot: true e readOnlyRootFilesystem: true.",
    "fr": "Inspectez les manifestes Dockerfiles et Kubernetes pour vérifier securityContext.runAsNonRoot : true et readOnlyRootFilesystem : true.",
    "de": "Untersuchen Sie Dockerfiles und Kubernetes-Manifeste, um securityContext.runAsNonRoot: true und readOnlyRootFilesystem: true zu überprüfen."
  },
  "Contenedores Rootless y Sistemas de Archivos Read-Only": {
    "en": "Rootless Containers and Read-Only File Systems",
    "pt": "Contêineres sem raiz e sistemas de arquivos somente leitura",
    "fr": "Conteneurs sans racine et systèmes de fichiers en lecture seule",
    "de": "Rootlose Container und schreibgeschützte Dateisysteme"
  },
  "Procedimiento Seguro de Decomisión y Triturado": {
    "en": "Safe Decommissioning and Crushing Procedure",
    "pt": "Procedimento Seguro de Descomissionamento e Trituração",
    "fr": "Procédure de déclassement et de concassage en toute sécurité",
    "de": "Sicheres Außerbetriebnahme- und Zerkleinerungsverfahren"
  },
  "Sandboxing para Ejecución de Código Dinámico": {
    "en": "Sandboxing for Dynamic Code Execution",
    "pt": "Sandboxing para execução dinâmica de código",
    "fr": "Sandboxing pour l'exécution dynamique de code",
    "de": "Sandboxing für dynamische Codeausführung"
  },
  "Documentar y automatizar un pipeline de decomisión que desprovisione balanceadores, invalide claves API asociadas y destruya claves criptográficas de cifrado (CMEK).": {
    "en": "Document and automate a decommission pipeline that deprovisions balancers, invalidates associated API keys, and destroys cryptographic encryption keys (CMEK).",
    "pt": "Documente e automatize um pipeline de desativação que desprovisiona balanceadores, invalida chaves de API associadas e destrói chaves de criptografia criptográfica (CMEK).",
    "fr": "Documentez et automatisez un pipeline de mise hors service qui déprovisionne les équilibreurs, invalide les clés API associées et détruit les clés de chiffrement cryptographiques (CMEK).",
    "de": "Dokumentieren und automatisieren Sie eine Stilllegungspipeline, die Balancer aufhebt, zugehörige API-Schlüssel ungültig macht und kryptografische Verschlüsselungsschlüssel (CMEK) zerstört."
  },
  "Aislamiento estricto (gVisor, Firecracker microVMs o Seccomp/AppArmor) para herramientas que ejecuten código generado por el LLM.": {
    "en": "Strict isolation (gVisor, Firecracker microVMs or Seccomp/AppArmor) for tools that execute code generated by the LLM.",
    "pt": "Isolamento estrito (gVisor, microVMs Firecracker ou Seccomp/AppArmor) para ferramentas que executam código gerado pelo LLM.",
    "fr": "Isolation stricte (gVisor, microVM Firecracker ou Seccomp/AppArmor) pour les outils qui exécutent le code généré par le LLM.",
    "de": "Strikte Isolierung (gVisor, Firecracker microVMs oder Seccomp/AppArmor) für Tools, die vom LLM generierten Code ausführen."
  },
  "Configurar securityContext: { runAsNonRoot: true, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false } en la especificación del contenedor.": {
    "en": "Set securityContext: { runAsNonRoot: true, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false } in the container specification.",
    "pt": "Configure securityContext: { runAsNonRoot: true, readOnlyRootFilesystem: true, allowPrivilegeEscalation: false } na especificação do contêiner.",
    "fr": "Définissez securityContext : { runAsNonRoot : true, readOnlyRootFilesystem : true, allowPrivilegeEscalation : false } dans la spécification du conteneur.",
    "de": "Legen Sie securityContext: { runAsNonRoot: true, readOnlyRootFilesystem: true,allowPrivilegeEscalation: false} in der Containerspezifikation fest."
  },
  "Prevenir escapes de contenedor o toma de control del host subyacente si el modelo genera código malicioso.": {
    "en": "Prevent container escapes or takeover of the underlying host if the model generates malicious code.",
    "pt": "Evite fugas de contêiner ou controle do host subjacente se o modelo gerar código malicioso.",
    "fr": "Empêchez les fuites de conteneurs ou la prise de contrôle de l'hôte sous-jacent si le modèle génère du code malveillant.",
    "de": "Verhindern Sie Container-Escapes oder die Übernahme des zugrunde liegenden Hosts, wenn das Modell schädlichen Code generiert."
  },
  "Aislamiento de Red y Restricción de Tráfico Egress": {
    "en": "Network Isolation and Egress Traffic Restriction",
    "pt": "Isolamento de rede e restrição de tráfego de saída",
    "fr": "Isolation du réseau et restriction du trafic de sortie",
    "de": "Netzwerkisolation und Einschränkung des ausgehenden Datenverkehrs"
  },
  "Verificar la clase de runtime en Kubernetes (runtimeClassName: gvisor) o el uso de microVMs efímeras para interpreters de código.": {
    "en": "Check the runtime class in Kubernetes (runtimeClassName: gvisor) or the use of ephemeral microVMs for code interpreters.",
    "pt": "Verifique a classe de tempo de execução no Kubernetes (runtimeClassName: gvisor) ou o uso de microVMs efêmeras para interpretadores de código.",
    "fr": "Vérifiez la classe d'exécution dans Kubernetes (runtimeClassName : gvisor) ou l'utilisation de microVM éphémères pour les interpréteurs de code.",
    "de": "Überprüfen Sie die Laufzeitklasse in Kubernetes (runtimeClassName: gvisor) oder die Verwendung kurzlebiger microVMs für Code-Interpreter."
  },
  "Contener movimientos laterales si un atacante compromete el servicio de IA.": {
    "en": "Contain lateral movement if an attacker compromises the AI ​​service.",
    "pt": "Contenha o movimento lateral se um invasor comprometer o serviço de IA.",
    "fr": "Contenez les mouvements latéraux si un attaquant compromet le service IA.",
    "de": "Begrenzen Sie seitliche Bewegungen, wenn ein Angreifer den KI-Dienst gefährdet."
  },
  "Purga Segura de Memoria en Aceleradores (GPU/TPU)": {
    "en": "Safe Memory Purge on Accelerators (GPU/TPU)",
    "pt": "Limpeza segura de memória em aceleradores (GPU/TPU)",
    "fr": "Purge sécurisée de la mémoire sur les accélérateurs (GPU/TPU)",
    "de": "Sichere Speicherbereinigung auf Beschleunigern (GPU/TPU)"
  },
  "Comprobar las políticas de red (NetworkPolicies) en K8s o firewalls de subred para confirmar que solo se permitan destinos explícitos autorizados.": {
    "en": "Check NetworkPolicies on K8s or subnet firewalls to confirm that only authorized explicit destinations are allowed.",
    "pt": "Verifique NetworkPolicies em K8s ou firewalls de sub-rede para confirmar se apenas destinos explícitos autorizados são permitidos.",
    "fr": "Vérifiez les NetworkPolicies sur les K8 ou les pare-feu de sous-réseau pour confirmer que seules les destinations explicites autorisées sont autorisées.",
    "de": "Überprüfen Sie die Netzwerkrichtlinien auf K8s oder Subnetz-Firewalls, um sicherzustellen, dass nur autorisierte explizite Ziele zulässig sind."
  },
  "Ejecutar cualquier evaluador de código (Python/Bash) en micro-máquinas virtuales efímeras (Firecracker o gVisor sandbox) sin acceso a la red interna.": {
    "en": "Run any code tester (Python/Bash) on ephemeral micro-virtual machines (Firecracker or gVisor sandbox) without access to the internal network.",
    "pt": "Execute qualquer testador de código (Python/Bash) em máquinas microvirtuais efêmeras (Firecracker ou gVisor sandbox) sem acesso à rede interna.",
    "fr": "Exécutez n'importe quel testeur de code (Python/Bash) sur des machines micro-virtuelles éphémères (Firecracker ou sandbox gVisor) sans accès au réseau interne.",
    "de": "Führen Sie einen beliebigen Codetester (Python/Bash) auf kurzlebigen mikrovirtuellen Maschinen (Firecracker oder gVisor-Sandbox) ohne Zugriff auf das interne Netzwerk aus."
  },
  "Aislamiento de red que impida egreso directo desde el entorno del modelo hacia redes corporativas internas críticas.": {
    "en": "Network isolation that prevents direct egress from the model environment to critical internal corporate networks.",
    "pt": "Isolamento de rede que impede a saída direta do ambiente do modelo para redes corporativas internas críticas.",
    "fr": "Isolation du réseau qui empêche la sortie directe de l'environnement du modèle vers les réseaux internes critiques de l'entreprise.",
    "de": "Netzwerkisolierung, die den direkten Austritt aus der Modellumgebung in kritische interne Unternehmensnetzwerke verhindert."
  },
  "Implementar NetworkPolicies de Kubernetes que bloqueen todo tráfico egress por defecto, permitiendo únicamente salida hacia las APIs indispensables.": {
    "en": "Implement Kubernetes NetworkPolicies that block all egress traffic by default, only allowing egress to essential APIs.",
    "pt": "Implemente NetworkPolicies do Kubernetes que bloqueiam todo o tráfego de saída por padrão, permitindo apenas a saída para APIs essenciais.",
    "fr": "Implémentez des NetworkPolicies Kubernetes qui bloquent tout le trafic de sortie par défaut, autorisant uniquement la sortie vers les API essentielles.",
    "de": "Implementieren Sie Kubernetes-Netzwerkrichtlinien, die standardmäßig den gesamten ausgehenden Datenverkehr blockieren und nur den ausgehenden Datenverkehr zu wesentlichen APIs zulassen."
  },
  "Limpieza y sanitización de memoria VRAM en aceleradores GPU/TPU entre cargas de trabajo multi-inquilino.": {
    "en": "Cleaning and sanitizing VRAM memory on GPU/TPU accelerators between multi-tenant workloads.",
    "pt": "Limpeza e higienização da memória VRAM em aceleradores GPU/TPU entre cargas de trabalho multilocatários.",
    "fr": "Nettoyage et désinfection de la mémoire VRAM sur les accélérateurs GPU/TPU entre les charges de travail multi-locataires.",
    "de": "Bereinigen und Bereinigen des VRAM-Speichers auf GPU/TPU-Beschleunigern zwischen mandantenfähigen Arbeitslasten."
  },
  "Validar que el orquestador de GPU reinicie el contexto de CUDA o ejecute rutinas de zero-fill de memoria VRAM al terminar cada sesión de inferencia.": {
    "en": "Validate that the GPU orchestrator restarts the CUDA context or executes VRAM zero-fill routines at the end of each inference session.",
    "pt": "Valide se o orquestrador de GPU reinicia o contexto CUDA ou executa rotinas de preenchimento zero VRAM no final de cada sessão de inferência.",
    "fr": "Vérifiez que l'orchestrateur GPU redémarre le contexte CUDA ou exécute des routines de remplissage zéro VRAM à la fin de chaque session d'inférence.",
    "de": "Überprüfen Sie, ob der GPU-Orchestrator am Ende jeder Inferenzsitzung den CUDA-Kontext neu startet oder VRAM-Zero-Fill-Routinen ausführt."
  },
  "Evitar fugas de datos y retención de contexto residual entre diferentes usuarios o tenants compartiendo hardware.": {
    "en": "Avoid data leaks and residual context retention between different users or tenants sharing hardware.",
    "pt": "Evite vazamentos de dados e retenção residual de contexto entre diferentes usuários ou locatários que compartilham hardware.",
    "fr": "Évitez les fuites de données et la rétention de contexte résiduel entre différents utilisateurs ou locataires partageant du matériel.",
    "de": "Vermeiden Sie Datenlecks und die Beibehaltung von Restkontexten zwischen verschiedenen Benutzern oder Mandanten, die sich Hardware teilen."
  },
  "Habilitar particionamiento seguro MIG (Multi-Instance GPU) en GPUs NVIDIA con aislamiento de memoria de hardware por instancia.": {
    "en": "Enable MIG (Multi-Instance GPU) secure partitioning on NVIDIA GPUs with per-instance hardware memory isolation.",
    "pt": "Habilite o particionamento seguro MIG (GPU multi-instância) em GPUs NVIDIA com isolamento de memória de hardware por instância.",
    "fr": "Activez le partitionnement sécurisé MIG (Multi-Instance GPU) sur les GPU NVIDIA avec une isolation de la mémoire matérielle par instance.",
    "de": "Aktivieren Sie die sichere MIG-Partitionierung (Multi-Instance GPU) auf NVIDIA-GPUs mit instanzspezifischer Hardware-Speicherisolierung."
  },
  "Verificar que las rutas de inferencia rechacen peticiones sin token JWT/Bearer válido con HTTP 401 Unauthorized.": {
    "en": "Verify that inference routes reject requests without a valid JWT/Bearer token with HTTP 401 Unauthorized.",
    "pt": "Verifique se as rotas de inferência rejeitam solicitações sem um token JWT/Bearer válido com HTTP 401 não autorizado.",
    "fr": "Vérifiez que les routes d'inférence rejettent les demandes sans jeton JWT/Bearer valide avec HTTP 401 Unauthorized.",
    "de": "Stellen Sie sicher, dass Inferenzrouten Anfragen ohne gültiges JWT/Bearer-Token mit HTTP 401 Unauthorized ablehnen."
  },
  "Implement zero-trust identity, authentication, and authorization across users, models, and tools.": {
    "en": "Implement zero-trust identity, authentication, and authorization across users, models, and tools.",
    "pt": "Implemente identidade, autenticação e autorização de confiança zero entre usuários, modelos e ferramentas.",
    "fr": "Implémentez une identité, une authentification et une autorisation zéro confiance pour les utilisateurs, les modèles et les outils.",
    "de": "Implementieren Sie Zero-Trust-Identität, Authentifizierung und Autorisierung für Benutzer, Modelle und Tools."
  },
  "Requerir autenticación robusta (OAuth 2.1, OIDC, mTLS) para todos los clientes que invoquen endpoints de inferencia.": {
    "en": "Require strong authentication (OAuth 2.1, OIDC, mTLS) for all clients invoking inference endpoints.",
    "pt": "Exigir autenticação forte (OAuth 2.1, OIDC, mTLS) para todos os clientes que invocam endpoints de inferência.",
    "fr": "Exiger une authentification forte (OAuth 2.1, OIDC, mTLS) pour tous les clients appelant des points de terminaison d'inférence.",
    "de": "Erfordern eine starke Authentifizierung (OAuth 2.1, OIDC, mTLS) für alle Clients, die Inferenzendpunkte aufrufen."
  },
  "Limitar el radio de explosión en caso de compromiso del servicio de IA.": {
    "en": "Limit the blast radius in case of AI service compromise.",
    "pt": "Limite o raio de explosão em caso de comprometimento do serviço de IA.",
    "fr": "Limitez le rayon de souffle en cas de compromission du service IA.",
    "de": "Begrenzen Sie den Explosionsradius im Falle einer Kompromittierung des KI-Dienstes."
  },
  "Las identidades de servicio del modelo no deben heredar permisos amplios sobre la infraestructura en la nube.": {
    "en": "Model service identities should not inherit broad permissions on the cloud infrastructure.",
    "pt": "As identidades de serviço modelo não devem herdar permissões amplas na infraestrutura em nuvem.",
    "fr": "Les identités de service de modèle ne doivent pas hériter d'autorisations étendues sur l'infrastructure cloud.",
    "de": "Modelldienstidentitäten sollten keine umfassenden Berechtigungen für die Cloud-Infrastruktur erben."
  },
  "Autenticación Robusta en Endpoints de IA": {
    "en": "Strong Authentication on AI Endpoints",
    "pt": "Autenticação forte em endpoints de IA",
    "fr": "Authentification forte sur les points de terminaison IA",
    "de": "Starke Authentifizierung auf KI-Endpunkten"
  },
  "Identidades de Servicio con Mínimo Privilegio": {
    "en": "Least Privilege Service Identities",
    "pt": "Identidades de serviço com menor privilégio",
    "fr": "Identités de service de moindre privilège",
    "de": "Dienstidentitäten mit den geringsten Privilegien"
  },
  "Añadir un middleware de autenticación (JWT/OIDC o API Key criptográfica) en todas las rutas de /api/audit y rechazar accesos sin credenciales.": {
    "en": "Add an authentication middleware (JWT/OIDC or cryptographic API Key) in all /api/audit routes and reject access without credentials.",
    "pt": "Adicione um middleware de autenticação (JWT/OIDC ou chave de API criptográfica) em todas as rotas /api/audit e rejeite o acesso sem credenciais.",
    "fr": "Ajoutez un middleware d'authentification (JWT/OIDC ou clé API cryptographique) dans toutes les routes /api/audit et rejetez l'accès sans informations d'identification.",
    "de": "Fügen Sie in allen /api/audit-Routen eine Authentifizierungs-Middleware (JWT/OIDC oder kryptografischer API-Schlüssel) hinzu und lehnen Sie den Zugriff ohne Anmeldeinformationen ab."
  },
  "Impedir el acceso anónimo o no autorizado a los modelos de la organización.": {
    "en": "Prevent anonymous or unauthorized access to the organization's models.",
    "pt": "Impedir o acesso anônimo ou não autorizado aos modelos da organização.",
    "fr": "Empêchez l’accès anonyme ou non autorisé aux modèles de l’organisation.",
    "de": "Verhindern Sie anonymen oder unbefugten Zugriff auf die Modelle der Organisation."
  },
  "Propagación Segura del Contexto de Usuario en Tools": {
    "en": "Safe Propagation of User Context in Tools",
    "pt": "Propagação segura do contexto do usuário em ferramentas",
    "fr": "Propagation sécurisée du contexte utilisateur dans les outils",
    "de": "Sichere Weitergabe des Benutzerkontexts in Tools"
  },
  "Aislamiento Criptográfico de Sesiones Multi-Inquilino": {
    "en": "Cryptographic Isolation of Multi-Tenant Sessions",
    "pt": "Isolamento criptográfico de sessões multilocatários",
    "fr": "Isolation cryptographique des sessions multi-locataires",
    "de": "Kryptografische Isolierung von Multi-Tenant-Sitzungen"
  },
  "Verificar si las funciones ejecutadas por el agente reciben el token delegado del usuario (On-Behalf-Of) en lugar de una clave global.": {
    "en": "Check if functions executed by the agent receive the user's delegated token (On-Behalf-Of) instead of a global key.",
    "pt": "Verifique se as funções executadas pelo agente recebem o token delegado do usuário (On-Behalf-Of) em vez de uma chave global.",
    "fr": "Vérifiez si les fonctions exécutées par l'agent reçoivent le jeton délégué de l'utilisateur (On-Behalf-Of) au lieu d'une clé globale.",
    "de": "Überprüfen Sie, ob vom Agenten ausgeführte Funktionen das delegierte Token des Benutzers (On-Behalf-Of) anstelle eines globalen Schlüssels erhalten."
  },
  "Evitar que un usuario de bajo privilegio ejecute acciones administrativas a través de herramientas del agente.": {
    "en": "Prevent a low-privileged user from executing administrative actions through agent tools.",
    "pt": "Evite que um usuário com poucos privilégios execute ações administrativas por meio de ferramentas de agente.",
    "fr": "Empêchez un utilisateur peu privilégié d’exécuter des actions administratives via les outils d’agent.",
    "de": "Verhindern Sie, dass ein Benutzer mit geringen Berechtigungen administrative Aktionen über Agent-Tools ausführt."
  },
  "Revisar los roles asignados a la Service Account en GCP/AWS; confirmar ausencia de roles de Propietario o Administrador.": {
    "en": "Review the roles assigned to the Service Account in GCP/AWS; confirm absence of Owner or Administrator roles.",
    "pt": "Revise as funções atribuídas à conta de serviço no GCP/AWS; confirme a ausência de funções de Proprietário ou Administrador.",
    "fr": "Examinez les rôles attribués au compte de service dans GCP/AWS ; confirmer l'absence de rôles de propriétaire ou d'administrateur.",
    "de": "Überprüfen Sie die dem Dienstkonto in GCP/AWS zugewiesenen Rollen. Bestätigen Sie das Fehlen von Besitzer- oder Administratorrollen."
  },
  "El contexto y alcances de seguridad del usuario deben propagarse a las herramientas invocadas sin exponer credenciales maestras.": {
    "en": "The user's security context and scopes should be propagated to the invoked tools without exposing master credentials.",
    "pt": "O contexto e os escopos de segurança do usuário devem ser propagados para as ferramentas invocadas sem expor as credenciais mestres.",
    "fr": "Le contexte et les étendues de sécurité de l'utilisateur doivent être propagés aux outils invoqués sans exposer les informations d'identification principales.",
    "de": "Der Sicherheitskontext und die Sicherheitsbereiche des Benutzers sollten an die aufgerufenen Tools weitergegeben werden, ohne dass Master-Anmeldeinformationen offengelegt werden."
  },
  "Utilizar el patrón de delegación OAuth OBO (On-Behalf-Of) o pasar el identificador de usuario verificado en cada llamada a las herramientas.": {
    "en": "Use the OAuth OBO (On-Behalf-Of) delegation pattern or pass the verified user ID in each call to the tools.",
    "pt": "Use o padrão de delegação OAuth OBO (On-Behalf-Of) ou passe o ID do usuário verificado em cada chamada para as ferramentas.",
    "fr": "Utilisez le modèle de délégation OAuth OBO (On-Behalf-Of) ou transmettez l'ID utilisateur vérifié à chaque appel aux outils.",
    "de": "Verwenden Sie das OAuth-OBO-Delegierungsmuster (On-Behalf-Of) oder übergeben Sie die verifizierte Benutzer-ID bei jedem Aufruf an die Tools."
  },
  "Aislamiento criptográfico estricto de historiales conversacionales y estados de sesión entre inquilinos.": {
    "en": "Strict cryptographic isolation of conversational histories and session states between tenants.",
    "pt": "Isolamento criptográfico estrito de históricos de conversação e estados de sessão entre locatários.",
    "fr": "Isolation cryptographique stricte des historiques de conversation et des états de session entre les locataires.",
    "de": "Strikte kryptografische Isolierung von Gesprächsverläufen und Sitzungszuständen zwischen Mandanten."
  },
  "Crear una Service Account dedicada con permisos exclusivos para invocar el LLM y acceder únicamente a su base de datos específica.": {
    "en": "Create a dedicated Service Account with exclusive permissions to invoke the LLM and access only your specific database.",
    "pt": "Crie uma conta de serviço dedicada com permissões exclusivas para invocar o LLM e acessar apenas seu banco de dados específico.",
    "fr": "Créez un compte de service dédié avec des autorisations exclusives pour appeler le LLM et accéder uniquement à votre base de données spécifique.",
    "de": "Erstellen Sie ein dediziertes Dienstkonto mit exklusiven Berechtigungen zum Aufrufen des LLM und nur zum Zugriff auf Ihre spezifische Datenbank."
  },
  "Garantizar matemáticamente que un inquilino no pueda acceder a datos o memorias de otro tenant.": {
    "en": "Mathematically guarantee that a tenant cannot access data or memories of another tenant.",
    "pt": "Garantir matematicamente que um inquilino não possa acessar dados ou memórias de outro inquilino.",
    "fr": "Garantir mathématiquement qu’un locataire ne peut pas accéder aux données ou aux mémoires d’un autre locataire.",
    "de": "Stellen Sie mathematisch sicher, dass ein Mieter nicht auf Daten oder Erinnerungen eines anderen Mieters zugreifen kann."
  },
  "Verificar la generación de CycloneDX o SPDX en el pipeline de CI/CD conteniendo versiones exactas y hashes de librerías de IA.": {
    "en": "Verify the generation of CycloneDX or SPDX in the CI/CD pipeline containing exact versions and hashes of AI libraries.",
    "pt": "Verifique a geração de CycloneDX ou SPDX no pipeline de CI/CD contendo versões exatas e hashes de bibliotecas de IA.",
    "fr": "Vérifiez la génération de CycloneDX ou SPDX dans le pipeline CI/CD contenant les versions exactes et les hachages des bibliothèques AI.",
    "de": "Überprüfen Sie die Generierung von CycloneDX oder SPDX in der CI/CD-Pipeline, die genaue Versionen und Hashes von KI-Bibliotheken enthält."
  },
  "Eliminar el riesgo de ejecución remota de código (RCE) al deserializar pesos o artefactos de modelos.": {
    "en": "Eliminate the risk of remote code execution (RCE) when deserializing weights or model artifacts.",
    "pt": "Elimine o risco de execução remota de código (RCE) ao desserializar pesos ou artefatos de modelo.",
    "fr": "Éliminez le risque d'exécution de code à distance (RCE) lors de la désérialisation de poids ou d'artefacts de modèle.",
    "de": "Eliminieren Sie das Risiko einer Remote-Code-Ausführung (RCE) bei der Deserialisierung von Gewichten oder Modellartefakten."
  },
  "Verificar que las claves de cifrado de la base de datos de sesiones estén particionadas por tenant ID (cifrado a nivel de campo con DEKs específicas).": {
    "en": "Verify that session database encryption keys are partitioned by tenant ID (field-level encryption with specific DEKs).",
    "pt": "Verifique se as chaves de criptografia do banco de dados de sessão são particionadas por ID de locatário (criptografia em nível de campo com DEKs específicos).",
    "fr": "Vérifiez que les clés de chiffrement de la base de données de session sont partitionnées par ID de locataire (chiffrement au niveau du champ avec des DEK spécifiques).",
    "de": "Stellen Sie sicher, dass die Verschlüsselungsschlüssel der Sitzungsdatenbank nach Mandanten-ID partitioniert sind (Verschlüsselung auf Feldebene mit bestimmten DEKs)."
  },
  "Audit third-party foundational models, orchestration libraries, and serialization formats.": {
    "en": "Audit third-party foundational models, orchestration libraries, and serialization formats.",
    "pt": "Audite modelos básicos de terceiros, bibliotecas de orquestração e formatos de serialização.",
    "fr": "Auditez les modèles fondamentaux tiers, les bibliothèques d’orchestration et les formats de sérialisation.",
    "de": "Prüfen Sie grundlegende Modelle, Orchestrierungsbibliotheken und Serialisierungsformate von Drittanbietern."
  },
  "Mantener un Software Bill of Materials (SBOM/AIBOM) que detalle frameworks de ML, modelos base y orquestadores.": {
    "en": "Maintain a Software Bill of Materials (SBOM/AIBOM) that details ML frameworks, base models and orchestrators.",
    "pt": "Mantenha uma lista de materiais de software (SBOM/AIBOM) que detalha estruturas de ML, modelos básicos e orquestradores.",
    "fr": "Maintenir une nomenclature logicielle (SBOM/AIBOM) qui détaille les cadres de ML, les modèles de base et les orchestrateurs.",
    "de": "Pflegen Sie eine Software-Stückliste (SBOM/AIBOM), die ML-Frameworks, Basismodelle und Orchestratoren detailliert beschreibt."
  },
  "Escanear el código fuente para detectar pickle.load(), torch.load() sin weights_only=True o joblib.load() sobre archivos externos.": {
    "en": "Scan the source code to detect pickle.load(), torch.load() without weights_only=True or joblib.load() on external files.",
    "pt": "Digitalize o código-fonte para detectar pickle.load(), torch.load() sem pesos_only=True ou joblib.load() em arquivos externos.",
    "fr": "Scannez le code source pour détecter pickle.load(), torch.load() sansweights_only=True ou joblib.load() sur les fichiers externes.",
    "de": "Scannen Sie den Quellcode, um pickle.load(), Torch.load() ohne Weights_only=True oder joblib.load() in externen Dateien zu erkennen."
  },
  "Generar un archivo AIBOM en cada compilación utilizando herramientas como syft o cdxgen integradas en el pipeline de CI/CD.": {
    "en": "Generate an AIBOM file on each build using tools such as syft or cdxgen integrated into the CI/CD pipeline.",
    "pt": "Gere um arquivo AIBOM em cada build usando ferramentas como syft ou cdxgen integradas ao pipeline de CI/CD.",
    "fr": "Générez un fichier AIBOM sur chaque build à l'aide d'outils tels que syft ou cdxgen intégrés au pipeline CI/CD.",
    "de": "Generieren Sie für jeden Build eine AIBOM-Datei mit Tools wie syft oder cdxgen, die in die CI/CD-Pipeline integriert sind."
  },
  "Permitir respuesta rápida y visibilidad ante vulnerabilidades críticas (CVEs) en componentes de IA de terceros.": {
    "en": "Enable rapid response and visibility to critical vulnerabilities (CVEs) in third-party AI components.",
    "pt": "Permita resposta rápida e visibilidade para vulnerabilidades críticas (CVEs) em componentes de IA de terceiros.",
    "fr": "Permettez une réponse rapide et une visibilité sur les vulnérabilités critiques (CVE) dans les composants d’IA tiers.",
    "de": "Ermöglichen Sie eine schnelle Reaktion und Sichtbarkeit auf kritische Schwachstellen (CVEs) in KI-Komponenten von Drittanbietern."
  },
  "Implementar cifrado a nivel de aplicación (Envelope Encryption) con claves distintas por cliente gestionadas en KMS.": {
    "en": "Implement application-level encryption (Envelope Encryption) with different keys per client managed in KMS.",
    "pt": "Implemente criptografia em nível de aplicativo (Envelope Encryption) com chaves diferentes por cliente gerenciado em KMS.",
    "fr": "Implémentez le chiffrement au niveau de l'application (Envelope Encryption) avec différentes clés par client gérées dans KMS.",
    "de": "Implementieren Sie eine Verschlüsselung auf Anwendungsebene (Envelope Encryption) mit unterschiedlichen Schlüsseln pro Client, die in KMS verwaltet werden."
  },
  "Inventario AIBOM y SBOM de Dependencias": {
    "en": "AIBOM and SBOM Inventory of Dependencies",
    "pt": "Inventário de Dependências AIBOM e SBOM",
    "fr": "Inventaire des dépendances AIBOM et SBOM",
    "de": "AIBOM- und SBOM-Inventar der Abhängigkeiten"
  },
  "Restringir el uso de formatos que permitan ejecución de código arbitrario (ej. Python pickle); forzar formatos seguros como Safetensors u ONNX.": {
    "en": "Restrict the use of formats that allow arbitrary code execution (e.g. Python pickle); force safe formats like Safetensors or ONNX.",
    "pt": "Restringir o uso de formatos que permitem a execução arbitrária de código (por exemplo, Python pickle); forçar formatos seguros como Safetensors ou ONNX.",
    "fr": "Restreindre l'utilisation de formats permettant l'exécution de code arbitraire (par exemple Python pickle) ; forcer les formats sûrs comme Safetensors ou ONNX.",
    "de": "Beschränken Sie die Verwendung von Formaten, die die Ausführung willkürlichen Codes ermöglichen (z. B. Python Pickle); Erzwingen Sie sichere Formate wie Safetensors oder ONNX."
  },
  "Prohibición de Formatos de Serialización Inseguros": {
    "en": "Prohibition of Insecure Serialization Formats",
    "pt": "Proibição de formatos de serialização inseguros",
    "fr": "Interdiction des formats de sérialisation non sécurisés",
    "de": "Verbot unsicherer Serialisierungsformate"
  },
  "Verificación de Procedencia de Adaptadores y LoRA": {
    "en": "Verification of Origin of Adapters and LoRA",
    "pt": "Verificação de origem de adaptadores e LoRA",
    "fr": "Vérification de l'origine des adaptateurs et LoRA",
    "de": "Überprüfung der Herkunft von Adaptern und LoRA"
  },
  "Escaneo Automatizado de Dependencias (SCA) en CI/CD": {
    "en": "Automated Dependency Scanning (ACS) in CI/CD",
    "pt": "Verificação automatizada de dependências (ACS) em CI/CD",
    "fr": "Analyse automatisée des dépendances (ACS) dans CI/CD",
    "de": "Automatisiertes Abhängigkeitsscannen (ACS) in CI/CD"
  },
  "Comprobación de procedencia y firmas contra registros confiables para cualquier adaptador o peso LoRA de terceros.": {
    "en": "Provenance verification and signatures against trusted records for any third-party LoRA adapters or weights.",
    "pt": "Verificação de proveniência e assinaturas em registros confiáveis ​​para quaisquer adaptadores ou pesos LoRA de terceiros.",
    "fr": "Vérification de la provenance et signatures par rapport aux enregistrements fiables pour tout adaptateur ou poids LoRA tiers.",
    "de": "Herkunftsüberprüfung und Signaturen anhand vertrauenswürdiger Aufzeichnungen für alle LoRA-Adapter oder -Gewichte von Drittanbietern."
  },
  "Migrar todos los pesos a formato Hugging Face safetensors y configurar torch.load(..., weights_only=True) en cargadores existentes.": {
    "en": "Migrate all weights to Hugging Face safetensors format and set torch.load(..., weights_only=True) to existing loaders.",
    "pt": "Migre todos os pesos para o formato de tensores de segurança Hugging Face e defina torch.load(...,weights_only=True) para os carregadores existentes.",
    "fr": "Migrez tous les poids au format Hugging Face safetensors et définissez torch.load(...,weights_only=True) sur les chargeurs existants.",
    "de": "Migrieren Sie alle Gewichte in das Hugging Face-Safetensors-Format und stellen Sie Torch.load(..., Weights_only=True) auf vorhandene Loader ein."
  },
  "Escaneo automatizado de vulnerabilidades en dependencias de IA con compuertas que bloqueen despliegues con CVEs críticos.": {
    "en": "Automated vulnerability scanning in AI dependencies with gates that block deployments with critical CVEs.",
    "pt": "Verificação automatizada de vulnerabilidades em dependências de IA com portas que bloqueiam implantações com CVEs críticos.",
    "fr": "Analyse automatisée des vulnérabilités dans les dépendances de l'IA avec des portes qui bloquent les déploiements avec des CVE critiques.",
    "de": "Automatisiertes Schwachstellenscannen in KI-Abhängigkeiten mit Gates, die Bereitstellungen mit kritischen CVEs blockieren."
  },
  "Evitar que adaptadores descargados de la comunidad introduzcan sesgos maliciosos, backdoors o payload trojanos.": {
    "en": "Prevent adapters downloaded from the community from introducing malicious biases, backdoors or Trojan payloads.",
    "pt": "Evite que adaptadores baixados da comunidade introduzam vieses maliciosos, backdoors ou cargas úteis de Trojan.",
    "fr": "Empêchez les adaptateurs téléchargés depuis la communauté d'introduire des biais malveillants, des portes dérobées ou des charges utiles de chevaux de Troie.",
    "de": "Verhindern Sie, dass von der Community heruntergeladene Adapter böswillige Tendenzen, Hintertüren oder Trojaner-Payloads einschleusen."
  },
  "Revisar los checks de pull request en GitHub Actions/GitLab CI para confirmar que npm audit, pip-audit o Snyk bloqueen el merge.": {
    "en": "Review pull request checks in GitHub Actions/GitLab CI to confirm that npm audit, pip-audit, or Snyk block the merge.",
    "pt": "Revise as verificações de pull request em GitHub Actions/GitLab CI para confirmar se npm audit, pip-audit ou Snyk bloqueiam a mesclagem.",
    "fr": "Examinez les vérifications des demandes d'extraction dans GitHub Actions/GitLab CI pour confirmer que npm audit, pip-audit ou Snyk bloquent la fusion.",
    "de": "Überprüfen Sie die Pull-Request-Prüfungen in GitHub Actions/GitLab CI, um zu bestätigen, dass npm audit, pip-audit oder Snyk die Zusammenführung blockieren."
  },
  "Validar que los adaptadores se descarguen únicamente desde repositorios internos aprobados con firmas criptográficas verificadas.": {
    "en": "Validate that adapters are only downloaded from approved internal repositories with verified cryptographic signatures.",
    "pt": "Valide que os adaptadores sejam baixados apenas de repositórios internos aprovados com assinaturas criptográficas verificadas.",
    "fr": "Vérifiez que les adaptateurs sont téléchargés uniquement à partir de référentiels internes approuvés avec des signatures cryptographiques vérifiées.",
    "de": "Stellen Sie sicher, dass Adapter nur aus genehmigten internen Repositorys mit verifizierten kryptografischen Signaturen heruntergeladen werden."
  },
  "Prevenir la introducción de librerías vulnerables o comprometidas en entornos de producción.": {
    "en": "Prevent the introduction of vulnerable or compromised libraries into production environments.",
    "pt": "Evite a introdução de bibliotecas vulneráveis ​​ou comprometidas em ambientes de produção.",
    "fr": "Empêchez l’introduction de bibliothèques vulnérables ou compromises dans les environnements de production.",
    "de": "Verhindern Sie die Einführung anfälliger oder kompromittierter Bibliotheken in Produktionsumgebungen."
  },
  "Prevent downstream execution attacks (XSS, SQLi, SSRF), hallucinated actions, and sensitive data leakage.": {
    "en": "Prevent downstream execution attacks (XSS, SQLi, SSRF), hallucinated actions, and sensitive data leakage.",
    "pt": "Evite ataques de execução downstream (XSS, SQLi, SSRF), ações alucinadas e vazamento de dados confidenciais.",
    "fr": "Empêchez les attaques d’exécution en aval (XSS, SQLi, SSRF), les actions hallucinées et les fuites de données sensibles.",
    "de": "Verhindern Sie nachgelagerte Ausführungsangriffe (XSS, SQLi, SSRF), halluzinierte Aktionen und den Verlust vertraulicher Daten."
  },
  "Establecer un registro privado interno de modelos donde cada peso LoRA deba pasar por un proceso de homologación y firma antes de ser consumible.": {
    "en": "Establish an internal private registry of models where each LoRA weight must go through a homologation and signature process before being consumable.",
    "pt": "Estabelecer um cadastro interno privado de modelos onde cada peso LoRA deverá passar por um processo de homologação e assinatura antes de ser consumível.",
    "fr": "Établir un registre privé interne de modèles où chaque poids LoRA doit passer par un processus d'homologation et de signature avant d'être consommable.",
    "de": "Richten Sie ein internes privates Modellregister ein, in dem jedes LoRA-Gewicht einen Homologations- und Signaturprozess durchlaufen muss, bevor es verbrauchbar ist."
  },
  "Añadir un paso obligatorio en CI/CD que ejecute npm audit --audit-level=high y pip-audit --strict, fallando el build si hay vulnerabilidades conocidas.": {
    "en": "Add a mandatory step in CI/CD that runs npm audit --audit-level=high and pip-audit --strict, failing the build if there are known vulnerabilities.",
    "pt": "Adicione uma etapa obrigatória no CI/CD que executa npm audit --audit-level=high e pip-audit --strict, falhando na construção se houver vulnerabilidades conhecidas.",
    "fr": "Ajoutez une étape obligatoire dans CI/CD qui exécute npm audit --audit-level=high et pip-audit --strict, faisant échouer la construction s'il existe des vulnérabilités connues.",
    "de": "Fügen Sie einen obligatorischen Schritt in CI/CD hinzu, der npm audit --audit-level=high und pip-audit --strict ausführt und den Build fehlschlägt, wenn bekannte Schwachstellen vorliegen."
  },
  "Evitar fugas accidentales de credenciales, datos de otros usuarios o información confidencial memorizada por el modelo.": {
    "en": "Avoid accidental leaks of credentials, other users' data or confidential information memorized by the model.",
    "pt": "Evite vazamentos acidentais de credenciais, dados de outros usuários ou informações confidenciais memorizadas pelo modelo.",
    "fr": "Évitez les fuites accidentelles d'identifiants, de données d'autres utilisateurs ou d'informations confidentielles mémorisées par le modèle.",
    "de": "Vermeiden Sie den versehentlichen Verlust von Zugangsdaten, Daten anderer Benutzer oder vertraulichen Informationen, die das Modell gespeichert hat."
  },
  "Comprobar que expresiones regulares de tokens de API y detectores de PII se ejecuten sobre la respuesta previa al envío al cliente.": {
    "en": "Check that API token regular expressions and PII listeners are executed on the response before sending to the client.",
    "pt": "Verifique se as expressões regulares do token de API e os ouvintes PII são executados na resposta antes de enviar ao cliente.",
    "fr": "Vérifiez que les expressions régulières du jeton API et les écouteurs PII sont exécutés sur la réponse avant de l'envoyer au client.",
    "de": "Überprüfen Sie, ob reguläre API-Token-Ausdrücke und PII-Listener für die Antwort ausgeführt werden, bevor Sie sie an den Client senden."
  },
  "Filtros de salida que detecten y redacten datos personales sensibles, tokens o API keys antes de devolver respuestas al cliente.": {
    "en": "Output filters that detect and redact sensitive personal data, tokens or API keys before returning responses to the client.",
    "pt": "Filtros de saída que detectam e editam dados pessoais confidenciais, tokens ou chaves de API antes de retornar respostas ao cliente.",
    "fr": "Filtres de sortie qui détectent et suppriment les données personnelles sensibles, les jetons ou les clés API avant de renvoyer les réponses au client.",
    "de": "Ausgabefilter, die sensible persönliche Daten, Token oder API-Schlüssel erkennen und redigieren, bevor sie Antworten an den Client zurücksenden."
  },
  "Toda salida del modelo debe ser tratada como no confiable y escapada o sanitizada antes de renderizar en el navegador o pasar a comandos.": {
    "en": "All output from the model should be treated as untrusted and escaped or sanitized before rendering to the browser or passing to commands.",
    "pt": "Toda a saída do modelo deve ser tratada como não confiável e com escape ou higienizada antes de ser renderizada para o navegador ou passada para comandos.",
    "fr": "Toutes les sorties du modèle doivent être traitées comme non fiables et échappées ou nettoyées avant d'être rendues au navigateur ou de passer aux commandes.",
    "de": "Alle Ausgaben des Modells sollten als nicht vertrauenswürdig behandelt und mit Escapezeichen versehen oder bereinigt werden, bevor sie an den Browser gerendert oder an Befehle übergeben werden."
  },
  "Inducir al modelo a generar <script>alert(1)</script> o payloads markdown maliciosos y verificar si la UI los neutraliza.": {
    "en": "Induce the model to generate <script>alert(1)</script> or malicious markdown payloads and check if the UI neutralizes them.",
    "pt": "Induza o modelo a gerar <script>alert(1)</script> ou cargas úteis de markdown maliciosas e verifique se a UI as neutraliza.",
    "fr": "Incitez le modèle à générer des charges utiles <script>alert(1)</script> ou des démarques malveillantes et vérifiez si l'interface utilisateur les neutralise.",
    "de": "Veranlassen Sie das Modell, <script>alert(1)</script> oder böswillige Markdown-Nutzdaten zu generieren, und prüfen Sie, ob die Benutzeroberfläche diese neutralisiert."
  },
  "Prevenir ataques de Cross-Site Scripting (XSS), inyecciones de comandos o inyección SQL inducidos por el modelo.": {
    "en": "Prevent Cross-Site Scripting (XSS), command injections or SQL injection attacks induced by the model.",
    "pt": "Evite Cross-Site Scripting (XSS), injeções de comando ou ataques de injeção de SQL induzidos pelo modelo.",
    "fr": "Empêchez le Cross-Site Scripting (XSS), les injections de commandes ou les attaques par injection SQL induites par le modèle.",
    "de": "Verhindern Sie durch das Modell induzierte Cross-Site Scripting (XSS), Befehlsinjektionen oder SQL-Injection-Angriffe."
  },
  "Filtro de Salida para Redacción de PII y Secretos": {
    "en": "Output Filter for Redaction of PII and Secrets",
    "pt": "Filtro de saída para redação de PII e segredos",
    "fr": "Filtre de sortie pour la rédaction des informations personnelles et des secrets",
    "de": "Ausgabefilter zur Schwärzung von PII und Geheimnissen"
  },
  "Sanitización Estricta de Salidas antes de Renderizado": {
    "en": "Strict Sanitization of Outputs before Rendering",
    "pt": "Sanitização rigorosa das saídas antes da renderização",
    "fr": "Désinfection stricte des sorties avant le rendu",
    "de": "Strikte Bereinigung der Ausgaben vor dem Rendern"
  },
  "Verificación Automatizada de Grounding y Alucinaciones": {
    "en": "Automated Grounding and Hallucination Verification",
    "pt": "Verificação automatizada de aterramento e alucinações",
    "fr": "Mise à la terre automatisée et vérification des hallucinations",
    "de": "Automatisierte Erdung und Halluzinationsüberprüfung"
  },
  "Implementar un middleware de redacción de salidas que aplique Microsoft Presidio o expresiones regulares para eliminar tokens, correos y tarjetas de crédito.": {
    "en": "Implement output composition middleware that applies Microsoft Presidio or regular expressions to remove tokens, emails, and credit cards.",
    "pt": "Implemente um middleware de composição de saída que aplique o Microsoft Presidio ou expressões regulares para remover tokens, emails e cartões de crédito.",
    "fr": "Implémentez un middleware de composition de sortie qui applique Microsoft Presidio ou des expressions régulières pour supprimer les jetons, les e-mails et les cartes de crédit.",
    "de": "Implementieren Sie eine Middleware für die Ausgabekomposition, die Microsoft Presidio oder reguläre Ausdrücke anwendet, um Token, E-Mails und Kreditkarten zu entfernen."
  },
  "Utilizar DOMPurify o bibliotecas de sanitización robustas en la capa de frontend al renderizar Markdown y evitar el uso de dangerouslySetInnerHTML.": {
    "en": "Use DOMPurify or robust sanitization libraries in the frontend layer when rendering Markdown and avoid using dangerouslySetInnerHTML.",
    "pt": "Use DOMPurify ou bibliotecas robustas de sanitização na camada frontend ao renderizar Markdown e evite usar perigosamenteSetInnerHTML.",
    "fr": "Utilisez DOMPurify ou des bibliothèques de désinfection robustes dans la couche frontale lors du rendu Markdown et évitez d'utiliser dangereusementSetInnerHTML.",
    "de": "Verwenden Sie DOMPurify oder robuste Bereinigungsbibliotheken in der Frontend-Ebene, wenn Sie Markdown rendern, und vermeiden Sie die Verwendung von hazardlySetInnerHTML."
  },
  "Verificación automatizada de anclaje (grounding) contra la evidencia recuperada para detectar y señalar alucinaciones en dominios críticos.": {
    "en": "Automated grounding verification against retrieved evidence to detect and flag hallucinations in critical domains.",
    "pt": "Verificação automatizada de aterramento contra evidências recuperadas para detectar e sinalizar alucinações em domínios críticos.",
    "fr": "Vérification automatisée de la mise à la terre par rapport aux preuves récupérées pour détecter et signaler les hallucinations dans les domaines critiques.",
    "de": "Automatisierte Bodenüberprüfung anhand abgerufener Beweise, um Halluzinationen in kritischen Bereichen zu erkennen und zu kennzeichnen."
  },
  "Validación y Forzado de Esquemas JSON Estructurados": {
    "en": "Validating and Forcing Structured JSON Schemas",
    "pt": "Validando e forçando esquemas JSON estruturados",
    "fr": "Valider et forcer les schémas JSON structurés",
    "de": "Validieren und Erzwingen strukturierter JSON-Schemas"
  },
  "Comprobar si el cliente de LLM utiliza responseSchema nativo y validar la salida con Zod en el backend antes de la deserialización.": {
    "en": "Check if the LLM client uses native responseSchema and validate the output with Zod on the backend before deserialization.",
    "pt": "Verifique se o cliente LLM usa responseSchema nativo e valide a saída com Zod no backend antes da desserialização.",
    "fr": "Vérifiez si le client LLM utilise ResponseSchema natif et validez la sortie avec Zod sur le backend avant la désérialisation.",
    "de": "Überprüfen Sie, ob der LLM-Client natives ResponseSchema verwendet, und validieren Sie die Ausgabe vor der Deserialisierung mit Zod im Backend."
  },
  "Garantizar que las respuestas que alimenten APIs transaccionales sigan estrictamente el formato esperado sin campos espurios.": {
    "en": "Ensure that responses feeding transactional APIs strictly follow the expected format without spurious fields.",
    "pt": "Certifique-se de que as respostas que alimentam APIs transacionais sigam estritamente o formato esperado, sem campos falsos.",
    "fr": "Assurez-vous que les réponses alimentant les API transactionnelles suivent strictement le format attendu, sans champs parasites.",
    "de": "Stellen Sie sicher, dass die Antworten, die Transaktions-APIs füttern, strikt dem erwarteten Format ohne falsche Felder entsprechen."
  },
  "Prevenir que el modelo entregue respuestas plausibles pero falsas que conduzcan a decisiones de alto riesgo erróneas.": {
    "en": "Prevent the model from delivering plausible but false answers that lead to erroneous high-risk decisions.",
    "pt": "Evite que o modelo forneça respostas plausíveis, mas falsas, que levem a decisões errôneas de alto risco.",
    "fr": "Empêchez le modèle de fournir des réponses plausibles mais fausses qui conduisent à des décisions erronées à haut risque.",
    "de": "Verhindern Sie, dass das Modell plausible, aber falsche Antworten liefert, die zu fehlerhaften, risikoreichen Entscheidungen führen."
  },
  "Forzado de esquemas estructurados (JSON Schema con decodificación guiada) para evitar desviaciones gramaticales e inyección de formatos.": {
    "en": "Enforcing structured schemas (JSON Schema with guided decoding) to avoid grammatical deviations and format injection.",
    "pt": "Aplicação de esquemas estruturados (esquema JSON com decodificação guiada) para evitar desvios gramaticais e injeção de formato.",
    "fr": "Application de schémas structurés (schéma JSON avec décodage guidé) pour éviter les écarts grammaticaux et l'injection de format.",
    "de": "Durchsetzung strukturierter Schemata (JSON-Schema mit geführter Dekodierung), um grammatikalische Abweichungen und Formatinjektionen zu vermeiden."
  },
  "Configurar responseSchema en la llamada a Gemini y validar la respuesta recibida con zod antes de procesar cualquier campo lógico.": {
    "en": "Configure responseSchema in the call to Gemini and validate the received response with zod before processing any logical fields.",
    "pt": "Configure responseSchema na chamada para Gemini e valide a resposta recebida com zod antes de processar qualquer campo lógico.",
    "fr": "Configurez ResponseSchema dans l'appel à Gemini et validez la réponse reçue avec zod avant de traiter les champs logiques.",
    "de": "Konfigurieren Sie „responseSchema“ im Aufruf von Gemini und validieren Sie die empfangene Antwort mit zod, bevor Sie logische Felder verarbeiten."
  },
  "Verificar si el sistema calcula puntuaciones de similitud y citas cruzadas entre la respuesta y los documentos recuperados de la base de conocimiento.": {
    "en": "Check if the system calculates similarity scores and cross-citations between the response and the documents retrieved from the knowledge base.",
    "pt": "Verifique se o sistema calcula pontuações de similaridade e citações cruzadas entre a resposta e os documentos recuperados da base de conhecimento.",
    "fr": "Vérifiez si le système calcule des scores de similarité et des citations croisées entre la réponse et les documents récupérés de la base de connaissances.",
    "de": "Überprüfen Sie, ob das System Ähnlichkeitswerte und Querzitate zwischen der Antwort und den aus der Wissensdatenbank abgerufenen Dokumenten berechnet."
  },
  "Filtrar los chunks de contexto en la base de datos vectorial basándose en las listas de control de acceso (ACLs) del usuario autenticado.": {
    "en": "Filter the context chunks in the vector database based on the access control lists (ACLs) of the authenticated user.",
    "pt": "Filtre os pedaços de contexto no banco de dados vetorial com base nas listas de controle de acesso (ACLs) do usuário autenticado.",
    "fr": "Filtrez les morceaux de contexte dans la base de données vectorielle en fonction des listes de contrôle d'accès (ACL) de l'utilisateur authentifié.",
    "de": "Filtern Sie die Kontextblöcke in der Vektordatenbank basierend auf den Zugriffskontrolllisten (ACLs) des authentifizierten Benutzers."
  },
  "Secure RAG knowledge stores, vector representations, and semantic search boundaries.": {
    "en": "Secure RAG knowledge stores, vector representations, and semantic search boundaries.",
    "pt": "Armazenamentos seguros de conhecimento RAG, representações vetoriais e limites de pesquisa semântica.",
    "fr": "Sécurisez les banques de connaissances RAG, les représentations vectorielles et les limites de recherche sémantique.",
    "de": "Sichere RAG-Wissensspeicher, Vektordarstellungen und semantische Suchgrenzen."
  },
  "Activar métricas de Grounding (como Vertex AI Grounding Attribution o Ragas/TruLens) exigiendo un umbral mínimo de soporte documental antes de emitir la respuesta.": {
    "en": "Activate Grounding metrics (such as Vertex AI Grounding Attribution or Ragas/TruLens) requiring a minimum threshold of documentary support before issuing the response.",
    "pt": "Ative métricas de aterramento (como Vertex AI Grounding Attribution ou Ragas/TruLens) que exigem um limite mínimo de suporte documental antes de emitir a resposta.",
    "fr": "Activez les métriques Grounding (telles que Vertex AI Grounding Attribution ou Ragas/TruLens) exigeant un seuil minimum de support documentaire avant d'émettre la réponse.",
    "de": "Aktivieren Sie Grounding-Metriken (wie Vertex AI Grounding Attribution oder Ragas/TruLens), die einen Mindestschwellenwert an dokumentarischer Unterstützung erfordern, bevor Sie die Antwort ausgeben."
  },
  "Impedir que un usuario recupere o infiera documentos confidenciales a través del motor semántico de RAG.": {
    "en": "Prevent a user from retrieving or inferring sensitive documents through the RAG semantic engine.",
    "pt": "Evite que um usuário recupere ou infira documentos confidenciais por meio do mecanismo semântico RAG.",
    "fr": "Empêchez un utilisateur de récupérer ou de déduire des documents sensibles via le moteur sémantique RAG.",
    "de": "Verhindern Sie, dass ein Benutzer vertrauliche Dokumente über die RAG-Semantik-Engine abruft oder daraus ableitet."
  },
  "Control de Acceso (ACL) a Nivel de Chunk en RAG": {
    "en": "Chunk Level Access Control (ACL) in RAG",
    "pt": "Controle de acesso em nível de bloco (ACL) em RAG",
    "fr": "Contrôle d'accès au niveau des blocs (ACL) dans RAG",
    "de": "Chunk Level Access Control (ACL) in RAG"
  },
  "Auditar la configuración de la base de datos vectorial (Pinecone, Chroma, pgvector) para confirmar el uso forzado de namespaces o colecciones aisladas.": {
    "en": "Audit the vector database configuration (Pinecone, Chroma, pgvector) to confirm the forced use of namespaces or isolated collections.",
    "pt": "Audite a configuração do banco de dados vetorial (Pinecone, Chroma, pgvector) para confirmar o uso forçado de namespaces ou coleções isoladas.",
    "fr": "Auditez la configuration de la base de données vectorielle (Pinecone, Chroma, pgvector) pour confirmer l'utilisation forcée d'espaces de noms ou de collections isolées.",
    "de": "Überprüfen Sie die Konfiguration der Vektordatenbank (Pinecone, Chroma, pgvector), um die erzwungene Verwendung von Namespaces oder isolierten Sammlungen zu bestätigen."
  },
  "Ejecutar un pipeline de validación que aplique antivirus (ClamAV) y escaneo de prompt injection heurístico antes del proceso de embedding.": {
    "en": "Run a validation pipeline that applies antivirus (ClamAV) and heuristic prompt injection scanning before the embedding process.",
    "pt": "Execute um pipeline de validação que aplique antivírus (ClamAV) e verificação heurística de injeção de prompt antes do processo de incorporação.",
    "fr": "Exécutez un pipeline de validation qui applique un antivirus (ClamAV) et une analyse par injection d'invite heuristique avant le processus d'intégration.",
    "de": "Führen Sie vor dem Einbettungsprozess eine Validierungspipeline aus, die Antivirenprogramme (ClamAV) und heuristische Prompt-Injection-Scans anwendet."
  },
  "Añadir metadatos de permisos (allowed_roles, tenant_id) a cada embedding y aplicar filtros pre-búsqueda (pre-filter) en el query a la base vectorial.": {
    "en": "Add permissions metadata (allowed_roles, tenant_id) to each embedding and apply pre-search filters (pre-filter) in the query to the vector base.",
    "pt": "Adicione metadados de permissões (allowed_roles, tenant_id) a cada incorporação e aplique filtros de pré-pesquisa (pré-filtro) na consulta à base vetorial.",
    "fr": "Ajoutez des métadonnées d'autorisations (allowed_roles, tenant_id) à chaque intégration et appliquez des filtres de pré-recherche (pré-filtre) dans la requête à la base vectorielle.",
    "de": "Fügen Sie jeder Einbettung Berechtigungsmetadaten (allowed_roles,mieter_id) hinzu und wenden Sie Vorsuchfilter (Vorfilter) in der Abfrage auf die Vektorbasis an."
  },
  "Realizar búsquedas vectoriales con usuarios con diferentes privilegios y verificar que los resultados solo incluyan documentos autorizados.": {
    "en": "Perform vector searches with users with different privileges and verify that the results only include authorized documents.",
    "pt": "Realize pesquisas vetoriais com usuários com privilégios diferentes e verifique se os resultados incluem apenas documentos autorizados.",
    "fr": "Effectuez des recherches vectorielles avec des utilisateurs dotés de privilèges différents et vérifiez que les résultats incluent uniquement les documents autorisés.",
    "de": "Führen Sie Vektorsuchen mit Benutzern mit unterschiedlichen Berechtigungen durch und stellen Sie sicher, dass die Ergebnisse nur autorisierte Dokumente enthalten."
  },
  "Subir un documento que contenga instrucciones de jailbreak o scripts y verificar si el pipeline de ingesta lo detecta y rechaza.": {
    "en": "Upload a document containing jailbreak instructions or scripts and check if the ingestion pipeline detects and rejects it.",
    "pt": "Carregue um documento contendo instruções ou scripts de jailbreak e verifique se o pipeline de ingestão o detecta e rejeita.",
    "fr": "Téléchargez un document contenant des instructions ou des scripts de jailbreak et vérifiez si le pipeline d'ingestion le détecte et le rejette.",
    "de": "Laden Sie ein Dokument mit Jailbreak-Anweisungen oder -Skripten hoch und prüfen Sie, ob die Aufnahmepipeline es erkennt und ablehnt."
  },
  "Sanitización e Inspección Pre-Ingesta de Documentos": {
    "en": "Sanitation and Pre-Ingestion Inspection of Documents",
    "pt": "Saneamento e Inspeção Pré-Ingestão de Documentos",
    "fr": "Assainissement et inspection avant ingestion des documents",
    "de": "Hygiene und Inspektion von Dokumenten vor der Einnahme"
  },
  "Evitar el envenenamiento de la base vectorial con instrucciones maliciosas destinadas a secuestrar futuras sesiones de usuario.": {
    "en": "Prevent poisoning of the vector base with malicious instructions intended to hijack future user sessions.",
    "pt": "Evite o envenenamento da base de vetores com instruções maliciosas destinadas a sequestrar futuras sessões de usuários.",
    "fr": "Empêchez l'empoisonnement de la base de vecteurs avec des instructions malveillantes destinées à détourner les futures sessions utilisateur.",
    "de": "Verhindern Sie eine Vergiftung der Vektorbasis mit böswilligen Anweisungen, die darauf abzielen, zukünftige Benutzersitzungen zu kapern."
  },
  "Escanear documentos contra malware, inyecciones de prompt indirectas y datos corruptos antes de generar embeddings e indexar.": {
    "en": "Scan documents for malware, indirect prompt injections, and corrupted data before embedding and indexing.",
    "pt": "Verifique documentos em busca de malware, injeções indiretas de prompt e dados corrompidos antes de incorporá-los e indexá-los.",
    "fr": "Analysez les documents à la recherche de logiciels malveillants, d'injections d'invites indirectes et de données corrompues avant l'intégration et l'indexation.",
    "de": "Scannen Sie Dokumente auf Malware, indirekte Eingabeaufforderungen und beschädigte Daten, bevor Sie sie einbetten und indizieren."
  },
  "Forzar en la capa de persistencia que toda operación sobre la base vectorial incluya obligatoriamente el namespace: tenantId sin posibilidad de omisión.": {
    "en": "Force in the persistence layer that all operations on the vector basis include the namespace: tenantId without the possibility of omission.",
    "pt": "Forçar na camada de persistência que todas as operações na base vetorial incluam o namespace: tenantId sem possibilidade de omissão.",
    "fr": "Forcer dans la couche de persistance que toutes les opérations sur la base vectorielle incluent l'espace de noms : tenantId sans possibilité d'omission.",
    "de": "Erzwingen Sie in der Persistenzschicht, dass alle Operationen auf Vektorbasis den Namensraum „tenantId“ ohne die Möglichkeit einer Auslassung enthalten."
  },
  "Identificar ataques de manipulación sutil de vectores que busquen priorizar artificialmente respuestas maliciosas.": {
    "en": "Identify subtle vector manipulation attacks that seek to artificially prioritize malicious responses.",
    "pt": "Identifique ataques sutis de manipulação de vetores que buscam priorizar artificialmente respostas maliciosas.",
    "fr": "Identifiez les attaques subtiles de manipulation vectorielle qui cherchent à prioriser artificiellement les réponses malveillantes.",
    "de": "Identifizieren Sie subtile Vektormanipulationsangriffe, die darauf abzielen, böswillige Reaktionen künstlich zu priorisieren."
  },
  "Verificar si existen alertas cuando la distribución espacial de los vectores o las distancias coseno se desvían de los patrones normales.": {
    "en": "Check if there are alerts when the spatial distribution of vectors or cosine distances deviate from normal patterns.",
    "pt": "Verifique se há alertas quando a distribuição espacial dos vetores ou distâncias dos cossenos se desviam dos padrões normais.",
    "fr": "Vérifiez s'il y a des alertes lorsque la distribution spatiale des vecteurs ou les distances cosinusoïdales s'écartent des modèles normaux.",
    "de": "Überprüfen Sie, ob Warnungen vorliegen, wenn die räumliche Verteilung von Vektoren oder Kosinusabständen von normalen Mustern abweicht."
  },
  "Validación determinista mediante esquemas estrictos de todos los parámetros generados por el LLM antes de ejecutar herramientas.": {
    "en": "Deterministic validation through strict schemas of all parameters generated by the LLM before executing tools.",
    "pt": "Validação determinística através de esquemas rígidos de todos os parâmetros gerados pelo LLM antes de executar as ferramentas.",
    "fr": "Validation déterministe via des schémas stricts de tous les paramètres générés par le LLM avant l'exécution des outils.",
    "de": "Deterministische Validierung durch strenge Schemata aller vom LLM generierten Parameter vor der Ausführung von Tools."
  },
  "Garantizar la separación lógica o física de los almacenes de vectores de diferentes clientes u organizaciones.": {
    "en": "Ensure logical or physical separation of vector stores from different clients or organizations.",
    "pt": "Garanta a separação lógica ou física de armazenamentos de vetores de diferentes clientes ou organizações.",
    "fr": "Assurer une séparation logique ou physique des magasins vectoriels des différents clients ou organisations.",
    "de": "Stellen Sie die logische oder physische Trennung der Vektorspeicher verschiedener Kunden oder Organisationen sicher."
  },
  "Aislamiento estricto de namespaces o índices en la base de datos vectorial para prevenir búsquedas cruzadas entre inquilinos.": {
    "en": "Strict isolation of namespaces or indexes in the vector database to prevent cross-tenant lookups.",
    "pt": "Isolamento estrito de namespaces ou índices no banco de dados vetorial para evitar pesquisas entre locatários.",
    "fr": "Isolation stricte des espaces de noms ou des index dans la base de données vectorielle pour empêcher les recherches entre locataires.",
    "de": "Strikte Isolierung von Namespaces oder Indizes in der Vektordatenbank, um mandantenübergreifende Suchen zu verhindern."
  },
  "Constrain autonomous execution, tool calling, and multi-step workflows with guardrails.": {
    "en": "Constrain autonomous execution, tool calling, and multi-step workflows with guardrails.",
    "pt": "Restrinja a execução autônoma, a chamada de ferramentas e os fluxos de trabalho de várias etapas com proteções.",
    "fr": "Limitez l’exécution autonome, l’appel d’outils et les flux de travail en plusieurs étapes avec des garde-fous.",
    "de": "Beschränken Sie die autonome Ausführung, den Aufruf von Tools und mehrstufige Arbeitsabläufe mit Leitplanken."
  },
  "Monitorear la deriva de embeddings y detectar perturbaciones adversariales diseñadas para manipular la búsqueda semántica.": {
    "en": "Monitor embedding drift and detect adversarial perturbations designed to manipulate semantic search.",
    "pt": "Monitore o desvio de incorporação e detecte perturbações adversárias projetadas para manipular a pesquisa semântica.",
    "fr": "Surveillez la dérive d’intégration et détectez les perturbations contradictoires conçues pour manipuler la recherche sémantique.",
    "de": "Überwachen Sie die Einbettungsdrift und erkennen Sie kontradiktorische Störungen, die die semantische Suche manipulieren sollen."
  },
  "Validación Determinista de Argumentos de Tools": {
    "en": "Deterministic Validation of Tools Arguments",
    "pt": "Validação Determinística de Argumentos de Ferramentas",
    "fr": "Validation déterministe des arguments des outils",
    "de": "Deterministische Validierung von Tools-Argumenten"
  },
  "Aislamiento de Espacios de Nombres Multi-Inquilino": {
    "en": "Isolation of Multi-Tenant Namespaces",
    "pt": "Isolamento de namespaces multilocatários",
    "fr": "Isolation des espaces de noms multi-locataires",
    "de": "Isolierung von Multi-Tenant-Namespaces"
  },
  "Monitoreo de Deriva Semántica y Perturbaciones": {
    "en": "Semantic Drift and Disturbance Monitoring",
    "pt": "Deriva Semântica e Monitoramento de Perturbações",
    "fr": "Surveillance de la dérive sémantique et des perturbations",
    "de": "Semantische Drift- und Störungsüberwachung"
  },
  "Prevenir inyecciones en APIs downstream causadas por argumentos malformados o generados maliciosamente por el modelo.": {
    "en": "Prevent injections into downstream APIs caused by malformed or maliciously generated arguments by the model.",
    "pt": "Evite injeções em APIs downstream causadas por argumentos malformados ou gerados maliciosamente pelo modelo.",
    "fr": "Empêchez les injections dans les API en aval causées par des arguments mal formés ou générés de manière malveillante par le modèle.",
    "de": "Verhindern Sie Injektionen in Downstream-APIs, die durch fehlerhafte oder böswillig generierte Argumente des Modells verursacht werden."
  },
  "Simular un flujo agéntico que intente eliminar registros o realizar transferencias y verificar que el sistema entre en estado 'Pending_Approval'.": {
    "en": "Simulate an agentic flow that attempts to delete records or perform transfers and verify that the system enters the 'Pending_Approval' state.",
    "pt": "Simule um fluxo de agente que tente excluir registros ou realizar transferências e verifique se o sistema entra no estado 'Aprovação_Pendente'.",
    "fr": "Simulez un flux agent qui tente de supprimer des enregistrements ou d'effectuer des transferts et vérifiez que le système entre dans l'état « Pending_Approval ».",
    "de": "Simulieren Sie einen Agentenfluss, der versucht, Datensätze zu löschen oder Übertragungen durchzuführen, und überprüfen Sie, ob das System in den Status „Pending_Approval“ wechselt."
  },
  "Probar las llamadas a funciones con parámetros que contengan payloads SQL o inyecciones de comandos y verificar su rechazo previo a la invocación.": {
    "en": "Test calls to functions with parameters that contain SQL payloads or command injections and verify their rejection prior to invocation.",
    "pt": "Teste chamadas para funções com parâmetros que contenham cargas SQL ou injeções de comando e verifique sua rejeição antes da invocação.",
    "fr": "Testez les appels aux fonctions avec des paramètres contenant des charges utiles SQL ou des injections de commandes et vérifiez leur rejet avant l'invocation.",
    "de": "Testen Sie Aufrufe von Funktionen mit Parametern, die SQL-Payloads oder Befehlsinjektionen enthalten, und überprüfen Sie deren Ablehnung vor dem Aufruf."
  },
  "Implementar un monitor estadístico periódico sobre la base vectorial que compute la densidad de clusters y detecte vectores anómalos o aislados.": {
    "en": "Implement a periodic statistical monitor on a vector basis that computes the density of clusters and detects anomalous or isolated vectors.",
    "pt": "Implemente um monitor estatístico periódico baseado em vetores que calcule a densidade de clusters e detecte vetores anômalos ou isolados.",
    "fr": "Implémentez un moniteur statistique périodique sur une base vectorielle qui calcule la densité des clusters et détecte les vecteurs anormaux ou isolés.",
    "de": "Implementieren Sie einen periodischen statistischen Monitor auf Vektorbasis, der die Dichte von Clustern berechnet und anomale oder isolierte Vektoren erkennt."
  },
  "Human-in-the-Loop (HITL) para Acciones Críticas": {
    "en": "Human-in-the-Loop (HITL) for Critical Actions",
    "pt": "Human-in-the-Loop (HITL) para ações críticas",
    "fr": "Human-in-the-Loop (HITL) pour les actions critiques",
    "de": "Human-in-the-Loop (HITL) für kritische Aktionen"
  },
  "Alcances Restringidos y Modo Solo Lectura por Defecto": {
    "en": "Restricted Scopes and Default Read Only Mode",
    "pt": "Escopos restritos e modo somente leitura padrão",
    "fr": "Portées restreintes et mode lecture seule par défaut",
    "de": "Eingeschränkte Bereiche und standardmäßiger schreibgeschützter Modus"
  },
  "Definir esquemas con validación fuerte (Zod o Pydantic) para cada herramienta expuesta al agente y rechazar ejecuciones que no cumplan el contrato de tipos.": {
    "en": "Define schemas with strong validation (Zod or Pydantic) for each tool exposed to the agent and reject executions that do not comply with the type contract.",
    "pt": "Definir esquemas com validação forte (Zod ou Pydantic) para cada ferramenta exposta ao agente e rejeitar execuções que não cumpram o tipo de contrato.",
    "fr": "Définissez des schémas à validation forte (Zod ou Pydantic) pour chaque outil exposé à l'agent et rejetez les exécutions non conformes au contrat de type.",
    "de": "Definieren Sie Schemata mit starker Validierung (Zod oder Pydantic) für jedes dem Agenten zugänglich gemachte Tool und lehnen Sie Ausführungen ab, die nicht dem Typvertrag entsprechen."
  },
  "Requerir autorización humana explícita antes de ejecutar acciones de alto impacto, irreversibles, destructivas o financieras.": {
    "en": "Require explicit human authorization before executing high-impact, irreversible, destructive or financial actions.",
    "pt": "Exija autorização humana explícita antes de executar ações de alto impacto, irreversíveis, destrutivas ou financeiras.",
    "fr": "Exiger une autorisation humaine explicite avant d’exécuter des actions à fort impact, irréversibles, destructrices ou financières.",
    "de": "Erfordern Sie eine ausdrückliche menschliche Genehmigung, bevor Sie schwerwiegende, irreversible, destruktive oder finanzielle Aktionen ausführen."
  },
  "Implementar un patrón de confirmación interactiva en UI y backend con tokens temporales de aprobación firmados criptográficamente para herramientas críticas.": {
    "en": "Implement an interactive confirmation pattern in UI and backend with cryptographically signed temporary approval tokens for critical tools.",
    "pt": "Implemente um padrão de confirmação interativo na interface do usuário e no back-end com tokens de aprovação temporários assinados criptograficamente para ferramentas críticas.",
    "fr": "Implémentez un modèle de confirmation interactif dans l'interface utilisateur et le backend avec des jetons d'approbation temporaires signés cryptographiquement pour les outils critiques.",
    "de": "Implementieren Sie ein interaktives Bestätigungsmuster in der Benutzeroberfläche und im Backend mit kryptografisch signierten temporären Genehmigungstokens für wichtige Tools."
  },
  "Minimizar el daño potencial en caso de que el agente sufra una inyección indirecta de prompt.": {
    "en": "Minimize potential damage should the agent suffer an indirect prompt injection.",
    "pt": "Minimize o dano potencial caso o agente sofra uma injeção indireta imediata.",
    "fr": "Minimiser les dommages potentiels si l’agent subit une injection indirecte et rapide.",
    "de": "Minimieren Sie potenzielle Schäden, falls der Wirkstoff eine indirekte Sofortinjektion erleidet."
  },
  "Evitar que agentes autónomos realicen transacciones financieras o borrado de recursos sin consentimiento humano deliberado.": {
    "en": "Prevent autonomous agents from performing financial transactions or deleting resources without deliberate human consent.",
    "pt": "Impedir que agentes autônomos realizem transações financeiras ou excluam recursos sem consentimento humano deliberado.",
    "fr": "Empêchez les agents autonomes d'effectuer des transactions financières ou de supprimer des ressources sans le consentement humain délibéré.",
    "de": "Verhindern Sie, dass autonome Agenten Finanztransaktionen durchführen oder Ressourcen ohne absichtliche menschliche Zustimmung löschen."
  },
  "Asignar permisos de solo lectura por defecto a las herramientas del agente, limitando el radio de explosión de cualquier ejecución.": {
    "en": "Assign default read-only permissions to agent tools, limiting the blast radius of any execution.",
    "pt": "Atribua permissões padrão somente leitura às ferramentas do agente, limitando o raio de ação de qualquer execução.",
    "fr": "Attribuez des autorisations par défaut en lecture seule aux outils de l'agent, limitant ainsi le rayon d'action de toute exécution.",
    "de": "Weisen Sie den Agent-Tools standardmäßig schreibgeschützte Berechtigungen zu und begrenzen Sie so den Explosionsradius jeder Ausführung."
  },
  "Capacidad de rollback transaccional o ejecución de acciones compensatorias para flujos de trabajo autónomos de múltiples pasos.": {
    "en": "Capability of transactional rollback or compensatory action execution for autonomous multi-step workflows.",
    "pt": "Capacidade de reversão transacional ou execução de ação compensatória para fluxos de trabalho autônomos de várias etapas.",
    "fr": "Capacité de restauration transactionnelle ou d’exécution d’actions compensatoires pour des flux de travail autonomes en plusieurs étapes.",
    "de": "Möglichkeit zum Transaktions-Rollback oder zur Ausführung kompensatorischer Aktionen für autonome mehrstufige Arbeitsabläufe."
  },
  "Revisar las cadenas de conexión y credenciales de las herramientas del agente; asegurar que las credenciales de base de datos tengan solo privilegios SELECT.": {
    "en": "Review connection strings and credentials for agent tools; ensure that database credentials have only SELECT privileges.",
    "pt": "Revise as cadeias de conexão e as credenciais das ferramentas do agente; certifique-se de que as credenciais do banco de dados tenham apenas privilégios SELECT.",
    "fr": "Examiner les chaînes de connexion et les informations d'identification pour les outils d'agent ; assurez-vous que les informations d'identification de la base de données disposent uniquement des privilèges SELECT.",
    "de": "Überprüfen Sie Verbindungszeichenfolgen und Anmeldeinformationen für Agententools. Stellen Sie sicher, dass die Datenbankanmeldeinformationen nur über SELECT-Berechtigungen verfügen."
  },
  "Seguridad de Model Context Protocol (MCP)": {
    "en": "Model Context Protocol (MCP) Security",
    "pt": "Segurança do Protocolo de Contexto do Modelo (MCP)",
    "fr": "Sécurité du protocole de contexte de modèle (MCP)",
    "de": "Sicherheit des Model Context Protocol (MCP)."
  },
  "Capacidad de Rollback y Acciones Compensatorias": {
    "en": "Rollback Capacity and Compensatory Actions",
    "pt": "Capacidade de reversão e ações compensatórias",
    "fr": "Capacité de réduction et mesures compensatoires",
    "de": "Rollback-Kapazität und Ausgleichsmaßnahmen"
  },
  "Verificación de Fuentes y Repositorios MCP Confiables": {
    "en": "Verification of Trusted MCP Sources and Repositories",
    "pt": "Verificação de fontes e repositórios MCP confiáveis",
    "fr": "Vérification des sources et référentiels MCP de confiance",
    "de": "Überprüfung vertrauenswürdiger MCP-Quellen und Repositorys"
  },
  "Ejecutar una prueba de fallo a mitad de un flujo multi-step y verificar que los pasos anteriores se reviertan automáticamente (patrón Saga).": {
    "en": "Run a fail test in the middle of a multi-step flow and verify that the previous steps are automatically reversed (Saga pattern).",
    "pt": "Execute um teste de falha no meio de um fluxo de várias etapas e verifique se as etapas anteriores são revertidas automaticamente (padrão Saga).",
    "fr": "Exécutez un test d'échec au milieu d'un flux en plusieurs étapes et vérifiez que les étapes précédentes sont automatiquement inversées (modèle Saga).",
    "de": "Führen Sie mitten in einem mehrstufigen Ablauf einen Fehlertest durch und stellen Sie sicher, dass die vorherigen Schritte automatisch umgekehrt werden (Saga-Muster)."
  },
  "Configurar las herramientas de base de datos para usar credenciales de solo lectura y exponer operaciones de escritura únicamente mediante endpoints especializados con HITL.": {
    "en": "Configure database tools to use read-only credentials and expose write operations only through specialized endpoints with HITL.",
    "pt": "Configure ferramentas de banco de dados para usar credenciais somente leitura e expor operações de gravação somente por meio de endpoints especializados com HITL.",
    "fr": "Configurez les outils de base de données pour utiliser des informations d'identification en lecture seule et exposer les opérations d'écriture uniquement via des points de terminaison spécialisés avec HITL.",
    "de": "Konfigurieren Sie Datenbanktools so, dass sie schreibgeschützte Anmeldeinformationen verwenden und Schreibvorgänge nur über spezielle Endpunkte mit HITL verfügbar machen."
  },
  "Comprobar que la lista de servidores MCP configurados coincida con un registro interno aprobado y cuente con verificación de firma o hash.": {
    "en": "Verify that the list of configured MCP servers matches an approved internal registry and has signature or hash verification.",
    "pt": "Verifique se a lista de servidores MCP configurados corresponde a um registro interno aprovado e possui verificação de assinatura ou hash.",
    "fr": "Vérifiez que la liste des serveurs MCP configurés correspond à un registre interne approuvé et comporte une vérification de signature ou de hachage.",
    "de": "Stellen Sie sicher, dass die Liste der konfigurierten MCP-Server mit einer genehmigten internen Registrierung übereinstimmt und über eine Signatur- oder Hash-Verifizierung verfügt."
  },
  "Implementar el patrón Saga con transacciones compensatorias para cada paso ejecutado por agentes en procesos de negocio distribuidos.": {
    "en": "Implement the Saga pattern with offsetting transactions for each step executed by agents in distributed business processes.",
    "pt": "Implemente o padrão Saga com transações de compensação para cada etapa executada pelos agentes em processos de negócios distribuídos.",
    "fr": "Implémentez le modèle Saga avec des transactions compensatoires pour chaque étape exécutée par les agents dans les processus métier distribués.",
    "de": "Implementieren Sie das Saga-Muster mit Gegentransaktionen für jeden Schritt, der von Agenten in verteilten Geschäftsprozessen ausgeführt wird."
  },
  "Secure discovery, transport, authorization, and tool execution in MCP integrations.": {
    "en": "Secure discovery, transport, authorization, and tool execution in MCP integrations.",
    "pt": "Descoberta segura, transporte, autorização e execução de ferramentas em integrações MCP.",
    "fr": "Découverte, transport, autorisation et exécution d'outils sécurisés dans les intégrations MCP.",
    "de": "Sichere Erkennung, Transport, Autorisierung und Toolausführung in MCP-Integrationen."
  },
  "Garantizar que los componentes de servidor y definiciones de herramientas MCP provengan únicamente de fuentes verificadas y autorizadas.": {
    "en": "Ensure that server components and MCP tool definitions come only from verified and authorized sources.",
    "pt": "Certifique-se de que os componentes do servidor e as definições da ferramenta MCP sejam provenientes apenas de fontes verificadas e autorizadas.",
    "fr": "Assurez-vous que les composants du serveur et les définitions de l'outil MCP proviennent uniquement de sources vérifiées et autorisées.",
    "de": "Stellen Sie sicher, dass Serverkomponenten und MCP-Tooldefinitionen nur aus verifizierten und autorisierten Quellen stammen."
  },
  "Permitir devolver el sistema a un estado consistente si un paso intermedio falla o se detecta una anomalía de seguridad.": {
    "en": "Allow the system to be returned to a consistent state if an intermediate step fails or a security anomaly is detected.",
    "pt": "Permita que o sistema retorne a um estado consistente se uma etapa intermediária falhar ou uma anomalia de segurança for detectada.",
    "fr": "Permettre au système de revenir à un état cohérent si une étape intermédiaire échoue ou si une anomalie de sécurité est détectée.",
    "de": "Ermöglichen Sie die Rückkehr des Systems in einen konsistenten Zustand, wenn ein Zwischenschritt fehlschlägt oder eine Sicherheitsanomalie erkannt wird."
  },
  "Configurar una lista blanca (allow-list) estricta de servidores MCP aprobados por el equipo de seguridad en la configuración del cliente.": {
    "en": "Configure a strict allow-list of MCP servers approved by the security team in the client configuration.",
    "pt": "Configure uma lista de permissões estrita (lista de permissões) de servidores MCP aprovados pela equipe de segurança na configuração do cliente.",
    "fr": "Configurez une liste blanche stricte (liste verte) de serveurs MCP approuvée par l'équipe de sécurité dans la configuration client.",
    "de": "Konfigurieren Sie in der Client-Konfiguration eine strenge Whitelist (Zulassungsliste) von MCP-Servern, die vom Sicherheitsteam genehmigt wurden."
  },
  "Evitar la conexión de clientes de IA a servidores MCP maliciosos o suplantados.": {
    "en": "Prevent AI clients from connecting to malicious or impersonated MCP servers.",
    "pt": "Evite que clientes de IA se conectem a servidores MCP maliciosos ou personificados.",
    "fr": "Empêchez les clients IA de se connecter à des serveurs MCP malveillants ou usurpés.",
    "de": "Verhindern Sie, dass KI-Clients eine Verbindung zu böswilligen oder gefälschten MCP-Servern herstellen."
  },
  "Impedir que llamadas no autorizadas ejecuten herramientas o expongan recursos sensibles a través del protocolo MCP.": {
    "en": "Prevent unauthorized calls from running tools or exposing sensitive resources through the MCP protocol.",
    "pt": "Evite que chamadas não autorizadas executem ferramentas ou exponham recursos confidenciais por meio do protocolo MCP.",
    "fr": "Empêchez les appels non autorisés d'exécuter des outils ou d'exposer des ressources sensibles via le protocole MCP.",
    "de": "Verhindern Sie mithilfe des MCP-Protokolls, dass unbefugte Anrufe Tools ausführen oder vertrauliche Ressourcen offenlegen."
  },
  "Los servidores MCP deben validar tokens de acceso en cada petición, comprobando emisor, audiencia, expiración y alcances autorizados.": {
    "en": "MCP servers must validate access tokens in each request, checking issuer, audience, expiration, and authorized scopes.",
    "pt": "Os servidores MCP devem validar os tokens de acesso em cada solicitação, verificando emissor, público, expiração e escopos autorizados.",
    "fr": "Les serveurs MCP doivent valider les jetons d'accès dans chaque demande, en vérifiant l'émetteur, l'audience, l'expiration et les étendues autorisées.",
    "de": "MCP-Server müssen Zugriffstokens in jeder Anfrage validieren und dabei Aussteller, Zielgruppe, Ablauf und autorisierte Bereiche überprüfen."
  },
  "Enviar peticiones MCP sin cabecera Authorization o con token expirado y verificar que el servidor responda con código de error de autenticación.": {
    "en": "Send MCP requests without Authorization header or with an expired token and verify that the server responds with an authentication error code.",
    "pt": "Envie solicitações MCP sem cabeçalho de autorização ou com token expirado e verifique se o servidor responde com um código de erro de autenticação.",
    "fr": "Envoyez des requêtes MCP sans en-tête d'autorisation ou avec un jeton expiré et vérifiez que le serveur répond avec un code d'erreur d'authentification.",
    "de": "Senden Sie MCP-Anfragen ohne Autorisierungsheader oder mit einem abgelaufenen Token und stellen Sie sicher, dass der Server mit einem Authentifizierungsfehlercode antwortet."
  },
  "Validación de Tokens de Acceso y Scopes OAuth 2.1": {
    "en": "Validation of Access Tokens and Scopes OAuth 2.1",
    "pt": "Validação de tokens de acesso e escopos OAuth 2.1",
    "fr": "Validation des jetons d'accès et des étendues OAuth 2.1",
    "de": "Validierung von Zugriffstoken und -bereichen OAuth 2.1"
  },
  "Ejecución de servidores MCP locales en sandboxes de mínimo privilegio con acceso restringido al sistema de archivos, procesos y red.": {
    "en": "Running local MCP servers in least privilege sandboxes with restricted access to the file system, processes and network.",
    "pt": "Executar servidores MCP locais em sandboxes com privilégios mínimos e acesso restrito ao sistema de arquivos, processos e rede.",
    "fr": "Exécution de serveurs MCP locaux dans des sandbox de moindre privilège avec un accès restreint au système de fichiers, aux processus et au réseau.",
    "de": "Betrieb lokaler MCP-Server in Sandboxes mit geringsten Berechtigungen und eingeschränktem Zugriff auf das Dateisystem, die Prozesse und das Netzwerk."
  },
  "Verificar que las URLs de servidores MCP utilicen obligatoriamente https:// y que no se expongan conexiones http:// sin cifrar en redes públicas.": {
    "en": "Verify that MCP server URLs must use https:// and that unencrypted http:// connections are not exposed on public networks.",
    "pt": "Verifique se as URLs do servidor MCP devem usar https:// e se as conexões http:// não criptografadas não estão expostas em redes públicas.",
    "fr": "Vérifiez que les URL du serveur MCP doivent utiliser https:// et que les connexions http:// non chiffrées ne sont pas exposées sur les réseaux publics.",
    "de": "Stellen Sie sicher, dass MCP-Server-URLs https:// verwenden müssen und dass unverschlüsselte http://-Verbindungen nicht in öffentlichen Netzwerken offengelegt werden."
  },
  "Forzar TLS 1.3 con certificados válidos para todo endpoint MCP remoto y limitar el transporte por stdio exclusivamente a procesos locales dentro del sandbox.": {
    "en": "Force TLS 1.3 with valid certificates for all remote MCP endpoints and limit stdio transport exclusively to local processes within the sandbox.",
    "pt": "Force o TLS 1.3 com certificados válidos para todos os endpoints MCP remotos e limite o transporte stdio exclusivamente para processos locais dentro da sandbox.",
    "fr": "Forcez TLS 1.3 avec des certificats valides pour tous les points de terminaison MCP distants et limitez le transport stdio exclusivement aux processus locaux dans le bac à sable.",
    "de": "Erzwingen Sie TLS 1.3 mit gültigen Zertifikaten für alle Remote-MCP-Endpunkte und beschränken Sie den stdio-Transport ausschließlich auf lokale Prozesse innerhalb der Sandbox."
  },
  "Integrar validación de tokens JWT conforme a OAuth 2.1 en el middleware de transporte de cada servidor MCP, comprobando los claims iss, aud, exp y scope.": {
    "en": "Integrate OAuth 2.1-compliant JWT token validation into the transport middleware of each MCP server, checking iss, aud, exp, and scope claims.",
    "pt": "Integre a validação de token JWT compatível com OAuth 2.1 no middleware de transporte de cada servidor MCP, verificando declarações iss, aud, exp e escopo.",
    "fr": "Intégrez la validation de jeton JWT conforme à OAuth 2.1 dans le middleware de transport de chaque serveur MCP, en vérifiant les revendications iss, aud, exp et scope.",
    "de": "Integrieren Sie die OAuth 2.1-kompatible JWT-Token-Validierung in die Transport-Middleware jedes MCP-Servers und prüfen Sie iss-, aud-, exp- und Scope-Ansprüche."
  },
  "Proteger las interacciones MCP en tránsito contra interceptación o inyección de comandos en canales de comunicación.": {
    "en": "Protect MCP interactions in transit against interception or command injection into communication channels.",
    "pt": "Proteja as interações do MCP em trânsito contra interceptação ou injeção de comando nos canais de comunicação.",
    "fr": "Protégez les interactions MCP en transit contre l’interception ou l’injection de commandes dans les canaux de communication.",
    "de": "Schützen Sie MCP-Interaktionen während der Übertragung vor Abfangen oder Befehlseinschleusung in Kommunikationskanäle."
  },
  "Transporte Seguro Streamable HTTP con TLS 1.3": {
    "en": "Streamable HTTP Secure Transport with TLS 1.3",
    "pt": "Transporte seguro HTTP streamável com TLS 1.3",
    "fr": "Transport sécurisé HTTP diffusable avec TLS 1.3",
    "de": "Streambarer HTTP Secure Transport mit TLS 1.3"
  },
  "Sandboxing de Servidores MCP Locales": {
    "en": "Sandboxing Local MCP Servers",
    "pt": "Sandbox de servidores MCP locais",
    "fr": "Mise en sandbox des serveurs MCP locaux",
    "de": "Sandboxing lokaler MCP-Server"
  },
  "Uso de streamable HTTP autenticado y cifrado (TLS 1.3) para servidores MCP remotos; restringir stdio a entornos locales aislados.": {
    "en": "Use of authenticated and encrypted HTTP streamable (TLS 1.3) for remote MCP servers; restrict stdio to isolated local environments.",
    "pt": "Utilização de HTTP streamable autenticado e criptografado (TLS 1.3) para servidores MCP remotos; restrinja o stdio a ambientes locais isolados.",
    "fr": "Utilisation de HTTP streamable authentifié et crypté (TLS 1.3) pour les serveurs MCP distants ; restreindre stdio aux environnements locaux isolés.",
    "de": "Verwendung von authentifiziertem und verschlüsseltem HTTP-Streaming (TLS 1.3) für Remote-MCP-Server; Beschränken Sie stdio auf isolierte lokale Umgebungen."
  },
  "Verificar si los procesos MCP locales corren bajo jaulas Docker sin privilegios, AppArmor o perfiles de seccomp restrictivos.": {
    "en": "Check if local MCP processes run under unprivileged Docker cages, AppArmor, or restrictive seccomp profiles.",
    "pt": "Verifique se os processos MCP locais são executados em gaiolas Docker sem privilégios, AppArmor ou perfis seccomp restritivos.",
    "fr": "Vérifiez si les processus MCP locaux s'exécutent sous des cages Docker non privilégiées, AppArmor ou des profils seccomp restrictifs.",
    "de": "Überprüfen Sie, ob lokale MCP-Prozesse unter unprivilegierten Docker-Cages, AppArmor oder restriktiven Seccomp-Profilen laufen."
  },
  "Lanzar servidores MCP locales dentro de contenedores aislados sin acceso al socket Docker del host y con volúmenes de solo lectura.": {
    "en": "Launch local MCP servers inside isolated containers without access to the host Docker socket and with read-only volumes.",
    "pt": "Inicie servidores MCP locais dentro de contêineres isolados sem acesso ao soquete Docker do host e com volumes somente leitura.",
    "fr": "Lancez des serveurs MCP locaux dans des conteneurs isolés sans accès au socket Docker hôte et avec des volumes en lecture seule.",
    "de": "Starten Sie lokale MCP-Server in isolierten Containern ohne Zugriff auf den Docker-Socket des Hosts und mit schreibgeschützten Volumes."
  },
  "Contener potenciales vulnerabilidades en herramientas MCP para evitar que comprometan la máquina host del desarrollador o servidor.": {
    "en": "Contain potential vulnerabilities in MCP tools to prevent them from compromising the developer's host machine or server.",
    "pt": "Contêm vulnerabilidades potenciais em ferramentas MCP para evitar que comprometam a máquina ou servidor host do desenvolvedor.",
    "fr": "Contenir les vulnérabilités potentielles des outils MCP pour les empêcher de compromettre la machine ou le serveur hôte du développeur.",
    "de": "Enthalten potenzielle Schwachstellen in MCP-Tools, um zu verhindern, dass sie den Hostcomputer oder Server des Entwicklers gefährden."
  },
  "Defensa contra DNS Rebinding en Transportes HTTP": {
    "en": "Defense against DNS Rebinding in HTTP Transports",
    "pt": "Defesa contra religação de DNS em transportes HTTP",
    "fr": "Défense contre le rebinding DNS dans les transports HTTP",
    "de": "Abwehr von DNS-Rebinding in HTTP-Transporten"
  },
  "Filtrar dinámicamente la lista de herramientas devueltas por el servidor MCP en función del rol y permisos del token del llamante.": {
    "en": "Dynamically filter the list of tools returned by the MCP server based on the role and permissions of the caller token.",
    "pt": "Filtre dinamicamente a lista de ferramentas retornadas pelo servidor MCP com base na função e nas permissões do token do chamador.",
    "fr": "Filtrez dynamiquement la liste des outils renvoyés par le serveur MCP en fonction du rôle et des autorisations du jeton de l'appelant.",
    "de": "Filtern Sie die Liste der vom MCP-Server zurückgegebenen Tools dynamisch basierend auf der Rolle und den Berechtigungen des Aufrufer-Tokens."
  },
  "Prevent model extraction, continuous jailbreaking, and Denial of Wallet (DoW) resource exhaustion.": {
    "en": "Prevent model extraction, continuous jailbreaking, and Denial of Wallet (DoW) resource exhaustion.",
    "pt": "Evite a extração de modelos, o jailbreak contínuo e o esgotamento de recursos de negação de carteira (DoW).",
    "fr": "Empêchez l’extraction de modèles, le jailbreak continu et l’épuisement des ressources de déni de portefeuille (DoW).",
    "de": "Verhindern Sie Modellextraktion, kontinuierliches Jailbreaking und Denial of Wallet (DoW)-Ressourcenerschöpfung."
  },
  "Autorización Dinámica y Filtrado de Tools en MCP": {
    "en": "Dynamic Authorization and Filtering of Tools in MCP",
    "pt": "Autorização dinâmica e filtragem de ferramentas no MCP",
    "fr": "Autorisation dynamique et filtrage des outils dans MCP",
    "de": "Dynamische Autorisierung und Filterung von Tools in MCP"
  },
  "Enviar peticiones HTTP al servidor MCP local con cabeceras Host u Origin anómalas (ej. attacker.com) y verificar el rechazo con HTTP 403.": {
    "en": "Send HTTP requests to the local MCP server with anomalous Host or Origin headers (e.g. attacker.com) and verify the rejection with HTTP 403.",
    "pt": "Envie solicitações HTTP para o servidor MCP local com cabeçalhos Host ou Origin anômalos (por exemplo, attacker.com) e verifique a rejeição com HTTP 403.",
    "fr": "Envoyez des requêtes HTTP au serveur MCP local avec des en-têtes Host ou Origin anormaux (par exemple attaquant.com) et vérifiez le rejet avec HTTP 403.",
    "de": "Senden Sie HTTP-Anfragen mit anomalen Host- oder Origin-Headern (z. B. attacker.com) an den lokalen MCP-Server und überprüfen Sie die Ablehnung mit HTTP 403."
  },
  "Validación estricta e independiente de cabeceras Origin y Host en servidores MCP basados en HTTP para prevenir ataques de DNS Rebinding.": {
    "en": "Strict and independent validation of Origin and Host headers on HTTP-based MCP servers to prevent DNS Rebinding attacks.",
    "pt": "Validação estrita e independente de cabeçalhos Origin e Host em servidores MCP baseados em HTTP para evitar ataques de religação de DNS.",
    "fr": "Validation stricte et indépendante des en-têtes Origin et Host sur les serveurs MCP basés sur HTTP pour empêcher les attaques DNS Rebinding.",
    "de": "Strenge und unabhängige Validierung der Origin- und Host-Header auf HTTP-basierten MCP-Servern, um DNS-Rebinding-Angriffe zu verhindern."
  },
  "Invocar tools/list con un token de usuario estándar y corroborar que las herramientas administrativas no aparezcan en la respuesta.": {
    "en": "Invoke tools/list with a standard user token and verify that administrative tools do not appear in the response.",
    "pt": "Invoque ferramentas/lista com um token de usuário padrão e verifique se as ferramentas administrativas não aparecem na resposta.",
    "fr": "Appelez tools/list avec un jeton utilisateur standard et vérifiez que les outils d’administration n’apparaissent pas dans la réponse.",
    "de": "Rufen Sie „tools/list“ mit einem Standardbenutzertoken auf und stellen Sie sicher, dass in der Antwort keine Verwaltungstools angezeigt werden."
  },
  "Impedir que sitios web maliciosos en el navegador del usuario interactúen con servidores MCP que escuchen en localhost.": {
    "en": "Prevent malicious websites in the user's browser from interacting with MCP servers listening on localhost.",
    "pt": "Evite que sites maliciosos no navegador do usuário interajam com servidores MCP que escutam no host local.",
    "fr": "Empêchez les sites Web malveillants du navigateur de l'utilisateur d'interagir avec les serveurs MCP écoutant sur localhost.",
    "de": "Verhindern Sie, dass bösartige Websites im Browser des Benutzers mit MCP-Servern interagieren, die localhost überwachen."
  },
  "El endpoint tools/list de MCP debe filtrar herramientas según los scopes del usuario, validando autorización en cada invocación.": {
    "en": "The MCP endpoint tools/list should filter tools based on the user's scopes, validating authorization on each invocation.",
    "pt": "A lista/ferramentas do endpoint MCP deve filtrar ferramentas com base nos escopos do usuário, validando a autorização em cada invocação.",
    "fr": "La liste/les outils du point de terminaison MCP doivent filtrer les outils en fonction des étendues de l'utilisateur, en validant l'autorisation à chaque appel.",
    "de": "Die Tools/Liste des MCP-Endpunkts sollte Tools basierend auf den Bereichen des Benutzers filtern und die Autorisierung bei jedem Aufruf validieren."
  },
  "Evitar que usuarios no privilegiados descubran o invoquen herramientas administrativas expuestas en el servidor MCP.": {
    "en": "Prevent non-privileged users from discovering or invoking administrative tools exposed on the MCP server.",
    "pt": "Evite que usuários não privilegiados descubram ou invoquem ferramentas administrativas expostas no servidor MCP.",
    "fr": "Empêchez les utilisateurs non privilégiés de découvrir ou d'invoquer les outils d'administration exposés sur le serveur MCP.",
    "de": "Verhindern Sie, dass nicht privilegierte Benutzer auf dem MCP-Server verfügbare Verwaltungstools entdecken oder aufrufen."
  },
  "Rate Limiting y Protección contra Denial of Wallet (DoW)": {
    "en": "Rate Limiting and Denial of Wallet (DoW) Protection",
    "pt": "Limitação de taxa e proteção contra negação de carteira (DoW)",
    "fr": "Limitation du débit et protection contre le déni de portefeuille (DoW)",
    "de": "Ratenbegrenzung und DoW-Schutz (Denial of Wallet)."
  },
  "Detección de Fuzzing Automatizado y Sondas Adversariales": {
    "en": "Automated Fuzzing Detection and Adversarial Probes",
    "pt": "Detecção automatizada de fuzzing e sondagens adversárias",
    "fr": "Détection automatisée du fuzzing et sondes contradictoires",
    "de": "Automatisierte Fuzzing-Erkennung und gegnerische Sonden"
  },
  "Robustez Adversarial y Prevención de DoW": {
    "en": "Adversarial Robustness and DoW Prevention",
    "pt": "Robustez adversária e prevenção de DoW",
    "fr": "Robustesse contradictoire et prévention DoW",
    "de": "Gegnerische Robustheit und DoW-Prävention"
  },
  "Límites estrictos de llamadas, cuotas de tokens y límites monetarios de gasto por usuario o API key para prevenir el agotamiento de presupuesto.": {
    "en": "Strict call limits, token quotas, and monetary spending limits per user or API key to prevent budget depletion.",
    "pt": "Limites rígidos de chamadas, cotas de token e limites de gastos monetários por usuário ou chave de API para evitar o esgotamento do orçamento.",
    "fr": "Limites d'appels strictes, quotas de jetons et limites de dépenses monétaires par utilisateur ou clé API pour éviter l'épuisement du budget.",
    "de": "Strenge Anruflimits, Token-Kontingente und Geldausgabenlimits pro Benutzer oder API-Schlüssel, um eine Erschöpfung des Budgets zu verhindern."
  },
  "Impedir que atacantes generen costos exorbitantes de cómputo en el proveedor cloud mediante scraping o peticiones masivas concurrentes.": {
    "en": "Prevent attackers from generating exorbitant computing costs on the cloud provider through scraping or massive concurrent requests.",
    "pt": "Evite que invasores gerem custos exorbitantes de computação no provedor de nuvem por meio de scraping ou solicitações simultâneas massivas.",
    "fr": "Empêchez les attaquants de générer des coûts informatiques exorbitants sur le fournisseur de cloud via le scraping ou des requêtes simultanées massives.",
    "de": "Verhindern Sie, dass Angreifer durch Scraping oder massive gleichzeitige Anfragen exorbitante Rechenkosten beim Cloud-Anbieter verursachen."
  },
  "Verificar en el servidor MCP que la cabecera Host sea exactamente localhost o 127.0.0.1 y rechazar cualquier Origin que no coincida con el dominio cliente autorizado.": {
    "en": "Verify on the MCP server that the Host header is exactly localhost or 127.0.0.1 and reject any Origin that does not match the authorized client domain.",
    "pt": "Verifique no servidor MCP se o cabeçalho Host é exatamente localhost ou 127.0.0.1 e rejeite qualquer origem que não corresponda ao domínio do cliente autorizado.",
    "fr": "Vérifiez sur le serveur MCP que l'en-tête Host est exactement localhost ou 127.0.0.1 et rejetez toute Origin qui ne correspond pas au domaine client autorisé.",
    "de": "Stellen Sie auf dem MCP-Server sicher, dass der Host-Header genau „localhost“ oder 127.0.0.1 lautet, und lehnen Sie jeden Ursprung ab, der nicht mit der autorisierten Client-Domäne übereinstimmt."
  },
  "Ejecutar pruebas de extracción de prompt ('repite las instrucciones anteriores palabra por palabra') y corroborar que el modelo rehúse divulgar el prompt base.": {
    "en": "Run prompt extraction tests ('repeat previous instructions word for word') and verify that the model refuses to disclose the base prompt.",
    "pt": "Execute testes de extração de prompt ('repita as instruções anteriores palavra por palavra') e verifique se o modelo se recusa a divulgar o prompt base.",
    "fr": "Exécutez des tests d'extraction d'invite (« répétez les instructions précédentes mot pour mot ») et vérifiez que le modèle refuse de divulguer l'invite de base.",
    "de": "Führen Sie Prompt-Extraktionstests durch („Vorherige Anweisungen Wort für Wort wiederholen“) und stellen Sie sicher, dass das Modell die Offenlegung des Basis-Prompts ablehnt."
  },
  "Estructuración defensiva de directivas de sistema para prevenir la inversión del modelo, exfiltración de instrucciones o fuga de datos de entrenamiento.": {
    "en": "Defensive structuring of system policies to prevent model inversion, instruction exfiltration, or training data leakage.",
    "pt": "Estruturação defensiva de políticas de sistema para evitar inversão de modelo, exfiltração de instruções ou vazamento de dados de treinamento.",
    "fr": "Structuration défensive des politiques système pour empêcher l’inversion de modèle, l’exfiltration d’instructions ou la fuite de données de formation.",
    "de": "Defensive Strukturierung von Systemrichtlinien, um Modellinversion, Befehlsexfiltration oder Trainingsdatenlecks zu verhindern."
  },
  "Detección de patrones sistemáticos de escaneo, fuzzing de seguridad o marcos automatizados de jailbreaking.": {
    "en": "Detection of systematic scanning patterns, security fuzzing or automated jailbreaking frameworks.",
    "pt": "Detecção de padrões sistemáticos de varredura, difusão de segurança ou estruturas automatizadas de jailbreak.",
    "fr": "Détection de modèles d'analyse systématique, de fuzzing de sécurité ou de cadres de jailbreak automatisés.",
    "de": "Erkennung systematischer Scanmuster, Sicherheits-Fuzzing oder automatisierter Jailbreaking-Frameworks."
  },
  "Revisar si el WAF o API Gateway correlaciona peticiones secuenciales con variaciones léxicas mínimas y bloquea IPs sospechosas.": {
    "en": "Check if the WAF or API Gateway correlates sequential requests with minimal lexical variations and blocks suspicious IPs.",
    "pt": "Verifique se o WAF ou API Gateway correlaciona solicitações sequenciais com variações lexicais mínimas e bloqueia IPs suspeitos.",
    "fr": "Vérifiez si le WAF ou la passerelle API met en corrélation les requêtes séquentielles avec des variations lexicales minimes et bloque les adresses IP suspectes.",
    "de": "Überprüfen Sie, ob die WAF oder das API-Gateway sequenzielle Anfragen mit minimalen lexikalischen Variationen korreliert und verdächtige IPs blockiert."
  },
  "Implementar análisis de anomalías en el gateway que penalice o aplique CAPTCHA a clientes con alta tasa de fallos de validación o violaciones de guardarraíles.": {
    "en": "Implement gateway anomaly analysis that penalizes or CAPTCHAs clients with high validation failure rates or guardrail violations.",
    "pt": "Implemente análises de anomalias de gateway que penalizem clientes CAPTCHAs com altas taxas de falha de validação ou violações de guardrail.",
    "fr": "Implémentez une analyse des anomalies de passerelle qui pénalise ou capte les clients présentant des taux d'échec de validation élevés ou des violations de garde-corps.",
    "de": "Implementieren Sie eine Gateway-Anomalieanalyse, die Clients mit hohen Validierungsfehlerraten oder Leitplankenverstößen bestraft oder CAPTCHAs sendet."
  },
  "Detectar y bloquear actores maliciosos en la fase de reconocimiento antes de que encuentren una brecha en los guardarraíles.": {
    "en": "Detect and block malicious actors in the reconnaissance phase before they find a breach in the guardrails.",
    "pt": "Detecte e bloqueie atores mal-intencionados na fase de reconhecimento antes que encontrem uma violação nas proteções.",
    "fr": "Détectez et bloquez les acteurs malveillants dès la phase de reconnaissance avant qu’ils ne trouvent une brèche dans les garde-corps.",
    "de": "Erkennen und blockieren Sie böswillige Akteure in der Aufklärungsphase, bevor sie eine Lücke in den Leitplanken finden."
  },
  "Generar un script de carga que envíe ráfagas de peticiones concurrentes y verificar que el rate limiter responda con HTTP 429 Too Many Requests.": {
    "en": "Generate a load script that sends bursts of concurrent requests and verify that the rate limiter responds with HTTP 429 Too Many Requests.",
    "pt": "Gere um script de carregamento que envie rajadas de solicitações simultâneas e verifique se o limitador de taxa responde com HTTP 429 Too Many Requests.",
    "fr": "Générez un script de chargement qui envoie des rafales de requêtes simultanées et vérifiez que le limiteur de débit répond avec HTTP 429 Too Many Requests.",
    "de": "Generieren Sie ein Ladeskript, das Bursts gleichzeitiger Anfragen sendet, und überprüfen Sie, ob der Ratenbegrenzer mit HTTP 429 Too Many Requests antwortet."
  },
  "Configurar un rate limiter en Redis o en el Gateway con algoritmos de Token Bucket o Sliding Window y definir presupuestos máximos en la consola de Google Cloud/OpenAI.": {
    "en": "Configure a rate limiter in Redis or the Gateway with Token Bucket or Sliding Window algorithms and define maximum budgets in the Google Cloud/OpenAI console.",
    "pt": "Configure um limitador de taxa no Redis ou no Gateway com algoritmos Token Bucket ou Sliding Window e defina orçamentos máximos no console do Google Cloud/OpenAI.",
    "fr": "Configurez un limiteur de débit dans Redis ou la Gateway avec les algorithmes Token Bucket ou Sliding Window et définissez des budgets maximaux dans la console Google Cloud/OpenAI.",
    "de": "Konfigurieren Sie einen Ratenbegrenzer in Redis oder dem Gateway mit Token-Bucket- oder Sliding-Window-Algorithmen und definieren Sie maximale Budgets in der Google Cloud/OpenAI-Konsole."
  },
  "Protección contra Extracción del Prompt de Sistema": {
    "en": "System Prompt Extraction Protection",
    "pt": "Proteção de extração de prompt do sistema",
    "fr": "Protection contre l'extraction à l'invite du système",
    "de": "System-Prompt-Extraktionsschutz"
  },
  "Salvaguardar la propiedad intelectual de las instrucciones del negocio y evitar que los usuarios descubran reglas internas de validación.": {
    "en": "Safeguard the intellectual property of business instructions and prevent users from discovering internal validation rules.",
    "pt": "Proteja a propriedade intelectual das instruções comerciais e evite que os usuários descubram regras de validação internas.",
    "fr": "Protégez la propriété intellectuelle des instructions commerciales et empêchez les utilisateurs de découvrir les règles de validation internes.",
    "de": "Schützen Sie das geistige Eigentum von Geschäftsanweisungen und verhindern Sie, dass Benutzer interne Validierungsregeln entdecken."
  },
  "Incluir cláusulas defensivas explícitas en el system prompt y configurar un filtro de salida que bloquee respuestas con alta similitud al prompt del sistema.": {
    "en": "Include explicit defensive clauses in the system prompt and configure an output filter that blocks responses with high similarity to the system prompt.",
    "pt": "Inclua cláusulas defensivas explícitas no prompt do sistema e configure um filtro de saída que bloqueie respostas com alta similaridade com o prompt do sistema.",
    "fr": "Incluez des clauses défensives explicites dans l'invite système et configurez un filtre de sortie qui bloque les réponses présentant une grande similitude avec l'invite système.",
    "de": "Fügen Sie explizite Abwehrklauseln in die Systemaufforderung ein und konfigurieren Sie einen Ausgabefilter, der Antworten mit hoher Ähnlichkeit zur Systemaufforderung blockiert."
  },
  "Maintain immutable audit trails of prompts, outputs, security alerts, and agent decisions.": {
    "en": "Maintain immutable audit trails of prompts, outputs, security alerts, and agent decisions.",
    "pt": "Mantenha trilhas de auditoria imutáveis ​​de prompts, saídas, alertas de segurança e decisões de agentes.",
    "fr": "Maintenez des pistes d’audit immuables des invites, des sorties, des alertes de sécurité et des décisions des agents.",
    "de": "Behalten Sie unveränderliche Prüfprotokolle für Eingabeaufforderungen, Ausgaben, Sicherheitswarnungen und Agentenentscheidungen bei."
  },
  "Impedir que competidores o atacantes utilicen las respuestas del modelo a gran escala para entrenar un modelo clon (distillation attack).": {
    "en": "Prevent competitors or attackers from using the responses of the large-scale model to train a clone model (distillation attack).",
    "pt": "Impedir que concorrentes ou invasores usem as respostas do modelo em larga escala para treinar um modelo clone (ataque de destilação).",
    "fr": "Empêchez les concurrents ou les attaquants d'utiliser les réponses du modèle à grande échelle pour entraîner un modèle clone (attaque par distillation).",
    "de": "Verhindern Sie, dass Konkurrenten oder Angreifer die Antworten des Großmodells nutzen, um ein Klonmodell zu trainieren (Destillationsangriff)."
  },
  "Registro inmutable en almacenamiento WORM o SIEM centralizado que guarde prompts, versiones de sistema, herramientas invocadas y respuestas.": {
    "en": "Immutable logging in centralized WORM or SIEM storage that stores prompts, system versions, invoked tools, and responses.",
    "pt": "Registro imutável em armazenamento WORM ou SIEM centralizado que armazena prompts, versões do sistema, ferramentas invocadas e respostas.",
    "fr": "Journalisation immuable dans un stockage centralisé WORM ou SIEM qui stocke les invites, les versions du système, les outils appelés et les réponses.",
    "de": "Unveränderliche Protokollierung im zentralen WORM- oder SIEM-Speicher, der Eingabeaufforderungen, Systemversionen, aufgerufene Tools und Antworten speichert."
  },
  "Defensas contra Extracción y Robo del Modelo": {
    "en": "Defenses against Extraction and Theft of the Model",
    "pt": "Defesas contra Extração e Roubo do Modelo",
    "fr": "Défenses contre l’extraction et le vol du modèle",
    "de": "Abwehrmaßnahmen gegen Entnahme und Diebstahl des Modells"
  },
  "Aplicación de perturbaciones ligeras, temperatura adaptativa o privacidad diferencial para mitigar ataques de robo o clonación de modelos.": {
    "en": "Application of light perturbations, adaptive temperature or differential privacy to mitigate model theft or cloning attacks.",
    "pt": "Aplicação de perturbações de luz, temperatura adaptativa ou privacidade diferencial para mitigar roubo de modelo ou ataques de clonagem.",
    "fr": "Application de perturbations lumineuses, de température adaptative ou de confidentialité différentielle pour atténuer les attaques de vol de modèle ou de clonage.",
    "de": "Anwendung von Lichtstörungen, adaptiver Temperatur oder differenzierter Privatsphäre zur Eindämmung von Modelldiebstahl oder Klonangriffen."
  },
  "Auditar los volúmenes de consultas de cuentas específicas para identificar patrones de destilación masiva de datasets sintéticos.": {
    "en": "Audit query volumes for specific accounts to identify bulk distillation patterns from synthetic datasets.",
    "pt": "Audite volumes de consulta para contas específicas para identificar padrões de destilação em massa de conjuntos de dados sintéticos.",
    "fr": "Auditez les volumes de requêtes pour des comptes spécifiques afin d'identifier les modèles de distillation en masse à partir d'ensembles de données synthétiques.",
    "de": "Überwachen Sie Abfragevolumina für bestimmte Konten, um Massendestillationsmuster aus synthetischen Datensätzen zu identifizieren."
  },
  "Monitorear patrones de scraping masivo por API y limitar la exposición de logprobs o puntuaciones de confianza detalladas a usuarios externos.": {
    "en": "Monitor bulk scraping patterns per API and limit the exposure of logprobs or detailed confidence scores to external users.",
    "pt": "Monitore padrões de extração em massa por API e limite a exposição de logprobs ou pontuações de confiança detalhadas a usuários externos.",
    "fr": "Surveillez les modèles de scraping en masse par API et limitez l’exposition des logprobs ou des scores de confiance détaillés aux utilisateurs externes.",
    "de": "Überwachen Sie Massen-Scraping-Muster pro API und begrenzen Sie die Offenlegung von Protokollproblemen oder detaillierten Konfidenzwerten für externe Benutzer."
  },
  "Monitoreo, Auditoría y Trazabilidad": {
    "en": "Monitoring, Auditing and Traceability",
    "pt": "Monitoramento, Auditoria e Rastreabilidade",
    "fr": "Surveillance, audit et traçabilité",
    "de": "Überwachung, Audit und Rückverfolgbarkeit"
  },
  "Registro Inmutable de Auditoría (WORM / SIEM)": {
    "en": "Immutable Audit Trail (WORM / SIEM)",
    "pt": "Trilha de auditoria imutável (WORM/SIEM)",
    "fr": "Piste d'audit immuable (WORM / SIEM)",
    "de": "Unveränderlicher Audit Trail (WORM / SIEM)"
  },
  "Permitir análisis forense concluyente tras incidentes de seguridad y cumplir con normativas de cumplimiento legal.": {
    "en": "Enable conclusive forensic analysis following security incidents and comply with legal compliance regulations.",
    "pt": "Permita análises forenses conclusivas após incidentes de segurança e cumpra os regulamentos de conformidade legal.",
    "fr": "Permettez une analyse médico-légale concluante à la suite d’incidents de sécurité et respectez les réglementations légales en matière de conformité.",
    "de": "Ermöglichen Sie eine aussagekräftige forensische Analyse nach Sicherheitsvorfällen und halten Sie gesetzliche Compliance-Vorgaben ein."
  },
  "Notificar de inmediato al Centro de Operaciones de Seguridad (SOC) ante ataques activos contra las aplicaciones de IA.": {
    "en": "Immediately notify the Security Operations Center (SOC) of active attacks against AI applications.",
    "pt": "Notifique imediatamente o Centro de Operações de Segurança (SOC) sobre ataques ativos contra aplicativos de IA.",
    "fr": "Informez immédiatement le Security Operations Center (SOC) des attaques actives contre les applications d’IA.",
    "de": "Benachrichtigen Sie das Security Operations Center (SOC) umgehend über aktive Angriffe auf KI-Anwendungen."
  },
  "Verificar que los logs de inferencia se envíen a un bucket con retención bloqueada (Bucket Lock) o sistema SIEM (Splunk, Google Cloud Logging).": {
    "en": "Verify that inference logs are sent to a Bucket Lock bucket or SIEM system (Splunk, Google Cloud Logging).",
    "pt": "Verifique se os logs de inferência são enviados para um bucket Bucket Lock ou sistema SIEM (Splunk, Google Cloud Logging).",
    "fr": "Vérifiez que les journaux d'inférence sont envoyés à un bucket Bucket Lock ou à un système SIEM (Splunk, Google Cloud Logging).",
    "de": "Stellen Sie sicher, dass Inferenzprotokolle an einen Bucket Lock-Bucket oder ein SIEM-System (Splunk, Google Cloud Logging) gesendet werden."
  },
  "Disparar varios ataques de inyección seguidos y verificar que se genere una alerta automática en Slack, PagerDuty o consola SIEM.": {
    "en": "Trigger several injection attacks in a row and verify that an automatic alert is generated in Slack, PagerDuty or SIEM console.",
    "pt": "Acione vários ataques de injeção consecutivos e verifique se um alerta automático é gerado no console do Slack, PagerDuty ou SIEM.",
    "fr": "Déclenchez plusieurs attaques par injection d'affilée et vérifiez qu'une alerte automatique est générée dans Slack, PagerDuty ou la console SIEM.",
    "de": "Lösen Sie mehrere Injektionsangriffe hintereinander aus und stellen Sie sicher, dass in der Slack-, PagerDuty- oder SIEM-Konsole eine automatische Warnung generiert wird."
  },
  "Los datos personales sensibles (PII) y credenciales deben ser redactados o enmascarados antes de ser persistidos en los logs de auditoría.": {
    "en": "Sensitive personal data (PII) and credentials must be redacted or masked before being persisted in audit logs.",
    "pt": "Dados pessoais confidenciais (PII) e credenciais devem ser editados ou mascarados antes de serem persistidos nos logs de auditoria.",
    "fr": "Les données personnelles sensibles (PII) et les informations d'identification doivent être expurgées ou masquées avant d'être conservées dans les journaux d'audit.",
    "de": "Sensible personenbezogene Daten (PII) und Anmeldeinformationen müssen geschwärzt oder maskiert werden, bevor sie in Prüfprotokollen gespeichert werden."
  },
  "Alertas en tiempo real ante intentos repetidos de inyección de prompts, picos anómalos de consumo de tokens o activación de reglas críticas.": {
    "en": "Real-time alerts for repeated prompt injection attempts, abnormal spikes in token consumption, or activation of critical rules.",
    "pt": "Alertas em tempo real para tentativas repetidas de injeção imediata, picos anormais no consumo de token ou ativação de regras críticas.",
    "fr": "Alertes en temps réel en cas de tentatives d'injection rapides répétées, de pics anormaux de consommation de jetons ou d'activation de règles critiques.",
    "de": "Echtzeitwarnungen bei wiederholten sofortigen Injektionsversuchen, ungewöhnlichen Spitzen im Token-Verbrauch oder der Aktivierung kritischer Regeln."
  },
  "Configurar un servicio de telemetría que transmita eventos estructurados a Cloud Logging con política de retención inmutable y clave de correlación única.": {
    "en": "Configure a telemetry service that streams structured events to Cloud Logging with immutable retention policy and unique correlation key.",
    "pt": "Configure um serviço de telemetria que transmita eventos estruturados para o Cloud Logging com política de retenção imutável e chave de correlação exclusiva.",
    "fr": "Configurez un service de télémétrie qui diffuse des événements structurés vers Cloud Logging avec une stratégie de rétention immuable et une clé de corrélation unique.",
    "de": "Konfigurieren Sie einen Telemetriedienst, der strukturierte Ereignisse mit unveränderlicher Aufbewahrungsrichtlinie und eindeutigem Korrelationsschlüssel an Cloud Logging streamt."
  },
  "Inspeccionar las entradas del sistema de logs y comprobar que campos como tarjetas de crédito, contraseñas o datos médicos estén ofuscados.": {
    "en": "Inspect the log system entries and verify that fields such as credit cards, passwords or medical data are obfuscated.",
    "pt": "Inspecione as entradas do sistema de log e verifique se campos como cartões de crédito, senhas ou dados médicos estão ofuscados.",
    "fr": "Inspectez les entrées du système de journalisation et vérifiez que les champs tels que les cartes de crédit, les mots de passe ou les données médicales sont obscurcis.",
    "de": "Überprüfen Sie die Protokollsystemeinträge und stellen Sie sicher, dass Felder wie Kreditkarten, Passwörter oder medizinische Daten verschleiert sind."
  },
  "Evitar que los almacenes de auditoría se conviertan en vectores de fuga de datos personales o secretos de autenticación.": {
    "en": "Prevent audit stores from becoming vectors for leaks of personal data or authentication secrets.",
    "pt": "Evite que os armazenamentos de auditoria se tornem vetores de vazamento de dados pessoais ou segredos de autenticação.",
    "fr": "Empêchez les magasins d’audit de devenir des vecteurs de fuites de données personnelles ou de secrets d’authentification.",
    "de": "Verhindern Sie, dass Prüfspeicher zu Überträgern für den Verlust personenbezogener Daten oder Authentifizierungsgeheimnisse werden."
  },
  "Alertas en Tiempo Real sobre Incidentes de Seguridad": {
    "en": "Real-Time Alerts on Security Incidents",
    "pt": "Alertas em tempo real sobre incidentes de segurança",
    "fr": "Alertes en temps réel sur les incidents de sécurité",
    "de": "Echtzeitwarnungen zu Sicherheitsvorfällen"
  },
  "Enmascaramiento y Redacción Pre-Registro en Logs": {
    "en": "Masking and Redaction Pre-Registration in Logs",
    "pt": "Pré-registro de mascaramento e redação em logs",
    "fr": "Pré-enregistrement du masquage et de la rédaction dans les journaux",
    "de": "Maskierungs- und Schwärzungsvorregistrierung in Protokollen"
  },
  "Trazabilidad completa de decisiones que vincule cada acción del agente con el prompt exacto, contexto recuperado y versión del modelo.": {
    "en": "Complete decision traceability that links each agent action with the exact prompt, recovered context and model version.",
    "pt": "Rastreabilidade completa de decisões que vincula cada ação do agente ao prompt exato, ao contexto recuperado e à versão do modelo.",
    "fr": "Traçabilité complète des décisions qui relie chaque action de l'agent à l'invite exacte, au contexte récupéré et à la version du modèle.",
    "de": "Vollständige Rückverfolgbarkeit der Entscheidung, die jede Agentenaktion mit der genauen Eingabeaufforderung, dem wiederhergestellten Kontext und der Modellversion verknüpft."
  },
  "Facilitar auditorías regulatorias y entender con precisión matemática la justificación causal de cada acción automática ejecutada.": {
    "en": "Facilitate regulatory audits and understand with mathematical precision the causal justification of each automatic action executed.",
    "pt": "Facilite auditorias regulatórias e entenda com precisão matemática a justificativa causal de cada ação automática executada.",
    "fr": "Facilitez les audits réglementaires et comprenez avec une précision mathématique la justification causale de chaque action automatique exécutée.",
    "de": "Erleichtern Sie behördliche Prüfungen und verstehen Sie mit mathematischer Präzision die kausale Begründung jeder ausgeführten automatischen Aktion."
  },
  "Integrar una función de sanitización en el logger (ej. Winston/Pino con redact paths) que reemplace automáticamente valores sensibles antes de escribir.": {
    "en": "Integrate a sanitization function in the logger (e.g. Winston/Pino with redact paths) that automatically replaces sensitive values ​​before writing.",
    "pt": "Integre uma função de sanitização no logger (por exemplo, Winston/Pino com caminhos de redação) que substitui automaticamente valores confidenciais antes de gravar.",
    "fr": "Intégrez une fonction de désinfection dans l'enregistreur (par exemple Winston/Pino avec des chemins d'expurgation) qui remplace automatiquement les valeurs sensibles avant l'écriture.",
    "de": "Integrieren Sie eine Bereinigungsfunktion in den Logger (z. B. Winston/Pino mit Schwärzungspfaden), die sensible Werte vor dem Schreiben automatisch ersetzt."
  },
  "Trazabilidad de Decisiones y Explicabilidad Completa": {
    "en": "Decision Traceability and Complete Explainability",
    "pt": "Rastreabilidade de decisões e explicabilidade completa",
    "fr": "Traçabilité des décisions et explicabilité complète",
    "de": "Rückverfolgbarkeit und vollständige Erklärbarkeit von Entscheidungen"
  },
  "Configurar métricas basadas en logs y políticas de alerta en Cloud Monitoring para notificar automáticamente cuando se detecten más de 5 bloqueos de seguridad en 5 minutos.": {
    "en": "Configure log-based metrics and alert policies in Cloud Monitoring to automatically notify when more than 5 security blocks are detected within 5 minutes.",
    "pt": "Configure métricas baseadas em registros e políticas de alerta no Cloud Monitoring para notificar automaticamente quando mais de cinco blocos de segurança forem detectados em cinco minutos.",
    "fr": "Configurez des métriques basées sur les journaux et des politiques d'alerte dans Cloud Monitoring pour être automatiquement averti lorsque plus de 5 blocs de sécurité sont détectés dans un délai de 5 minutes.",
    "de": "Konfigurieren Sie protokollbasierte Metriken und Warnrichtlinien in Cloud Monitoring, um automatisch zu benachrichtigen, wenn innerhalb von 5 Minuten mehr als 5 Sicherheitsblöcke erkannt werden."
  },
  "Identificación de factores legales, regulatorios, tecnológicos, éticos y de mercado que impactan el desarrollo y operación de la IA.": {
    "en": "Identification of legal, regulatory, technological, ethical and market factors that impact the development and operation of AI.",
    "pt": "Identificação de fatores legais, regulatórios, tecnológicos, éticos e de mercado que impactam o desenvolvimento e operação da IA.",
    "fr": "Identification des facteurs juridiques, réglementaires, technologiques, éthiques et commerciaux qui ont un impact sur le développement et le fonctionnement de l'IA.",
    "de": "Identifizierung rechtlicher, regulatorischer, technologischer, ethischer und Marktfaktoren, die sich auf die Entwicklung und den Betrieb von KI auswirken."
  },
  "Contexto de la Organización (Context of the Organization)": {
    "en": "Context of the Organization",
    "pt": "Contexto da Organização",
    "fr": "Contexte de l'Organisation",
    "de": "Kontext der Organisation"
  },
  "Instrumentar el ciclo de inferencia con OpenTelemetry tracing (OpenInference) registrando el trace ID en cada llamada a modelo, tool y base de datos.": {
    "en": "Instrument the inference cycle with OpenTelemetry tracing (OpenInference) by recording the trace ID in each call to the model, tool and database.",
    "pt": "Instrumente o ciclo de inferência com rastreamento OpenTelemetry (OpenInference) registrando o ID do rastreamento em cada chamada para o modelo, ferramenta e banco de dados.",
    "fr": "Instrumentez le cycle d'inférence avec le traçage OpenTelemetry (OpenInference) en enregistrant l'ID de trace dans chaque appel au modèle, à l'outil et à la base de données.",
    "de": "Instrumentieren Sie den Inferenzzyklus mit OpenTelemetry-Tracing (OpenInference), indem Sie die Trace-ID bei jedem Aufruf des Modells, Tools und der Datenbank aufzeichnen."
  },
  "La organización debe determinar las cuestiones externas e internas relevantes para su propósito y que afectan a su capacidad para lograr los resultados previstos de su Sistema de Gestión de Inteligencia Artificial (AIMS), identificando a las partes interesadas pertinentes y estableciendo los límites y aplicabilidad formal del sistema.": {
    "en": "The organization must determine the external and internal issues relevant to its purpose and affecting its ability to achieve the intended results of its Artificial Intelligence Management System (AIMS), identifying relevant stakeholders and establishing the limits and formal applicability of the system.",
    "pt": "A organização deve determinar as questões externas e internas relevantes para o seu propósito e que afetam a sua capacidade de alcançar os resultados pretendidos do seu Sistema de Gestão de Inteligência Artificial (AIMS), identificando as partes interessadas relevantes e estabelecendo os limites e aplicabilidade formal do sistema.",
    "fr": "L'organisation doit déterminer les problèmes externes et internes pertinents pour son objectif et affectant sa capacité à atteindre les résultats escomptés de son système de gestion de l'intelligence artificielle (AIMS), en identifiant les parties prenantes concernées et en établissant les limites et l'applicabilité formelle du système.",
    "de": "Die Organisation muss die externen und internen Probleme ermitteln, die für ihren Zweck relevant sind und sich auf ihre Fähigkeit auswirken, die beabsichtigten Ergebnisse ihres Künstliche-Intelligenz-Managementsystems (AIMS) zu erreichen, relevante Stakeholder identifizieren und die Grenzen und formale Anwendbarkeit des Systems festlegen."
  },
  "Determinar el contexto organizacional y los factores condicionantes para el éxito del AIMS.": {
    "en": "Determine the organizational context and the determining factors for the success of the AIMS.",
    "pt": "Determinar o contexto organizacional e os fatores determinantes para o sucesso da AIMS.",
    "fr": "Déterminer le contexte organisationnel et les facteurs déterminants du succès de l’AIMS.",
    "de": "Bestimmen Sie den organisatorischen Kontext und die entscheidenden Faktoren für den Erfolg des AIMS."
  },
  "Revisar un flujo de auditoría de punta a punta y comprobar si existe un identificador de traza distribuida (OpenTelemetry) que vincule todas las etapas.": {
    "en": "Review an end-to-end audit flow and check if a distributed trace identifier (OpenTelemetry) exists that links all stages.",
    "pt": "Revise um fluxo de auditoria de ponta a ponta e verifique se existe um identificador de rastreamento distribuído (OpenTelemetry) que vincule todos os estágios.",
    "fr": "Examinez un flux d'audit de bout en bout et vérifiez s'il existe un identifiant de trace distribué (OpenTelemetry) qui relie toutes les étapes.",
    "de": "Überprüfen Sie einen End-to-End-Prüfungsablauf und prüfen Sie, ob eine verteilte Ablaufverfolgungskennung (OpenTelemetry) vorhanden ist, die alle Phasen verbindet."
  },
  "Comprensión de la organización y de su contexto": {
    "en": "Understanding of the organization and its context",
    "pt": "Compreensão da organização e seu contexto",
    "fr": "Compréhension de l'organisation et de son contexte",
    "de": "Verständnis der Organisation und ihres Kontextes"
  },
  "Verificar la existencia de un análisis de contexto documentado (PESTEL, FODA o registro de contexto AIMS) que incluya riesgos de IA.": {
    "en": "Verify the existence of a documented context analysis (PESTEL, SWOT or AIMS context register) that includes AI risks.",
    "pt": "Verificar a existência de uma análise de contexto documentada (registro de contexto PESTEL, SWOT ou AIMS) que inclua riscos de IA.",
    "fr": "Vérifier l’existence d’une analyse contextuelle documentée (registre de contexte PESTEL, SWOT ou AIMS) incluant les risques liés à l’IA.",
    "de": "Überprüfen Sie das Vorhandensein einer dokumentierten Kontextanalyse (PESTEL-, SWOT- oder AIMS-Kontextregister), die KI-Risiken berücksichtigt."
  },
  "Crear una matriz de partes interesadas con requisitos regulatorios (ej. EU AI Act, RGPD) y contractuales.": {
    "en": "Create a matrix of stakeholders with regulatory (e.g. EU AI Act, GDPR) and contractual requirements.",
    "pt": "Crie uma matriz de partes interessadas com requisitos regulatórios (por exemplo, Lei de IA da UE, GDPR) e contratuais.",
    "fr": "Créez une matrice de parties prenantes avec des exigences réglementaires (par exemple, EU AI Act, RGPD) et contractuelles.",
    "de": "Erstellen Sie eine Stakeholder-Matrix mit regulatorischen (z. B. EU-KI-Gesetz, DSGVO) und vertraglichen Anforderungen."
  },
  "Definición y documentación formal de los límites físicos, organizacionales y tecnológicos cubiertos por el AIMS.": {
    "en": "Definition and formal documentation of the physical, organizational and technological boundaries covered by the AIMS.",
    "pt": "Definição e documentação formal dos limites físicos, organizacionais e tecnológicos abrangidos pela AIMS.",
    "fr": "Définition et documentation formelle des limites physiques, organisationnelles et technologiques couvertes par l'AIMS.",
    "de": "Definition und formale Dokumentation der vom AIMS abgedeckten physischen, organisatorischen und technologischen Grenzen."
  },
  "Necesidades y expectativas de partes interesadas": {
    "en": "Needs and expectations of interested parties",
    "pt": "Necessidades e expectativas das partes interessadas",
    "fr": "Besoins et attentes des parties intéressées",
    "de": "Bedürfnisse und Erwartungen interessierter Parteien"
  },
  "Determinación del alcance del AIMS": {
    "en": "AIMS Scoping",
    "pt": "Escopo do AIMS",
    "fr": "Portée des OBJECTIFS",
    "de": "AIMS-Scoping"
  },
  "Elaborar un documento formal de contexto organizacional de IA aprobado por la dirección.": {
    "en": "Prepare a formal AI organizational context document approved by management.",
    "pt": "Prepare um documento formal de contexto organizacional de IA aprovado pela administração.",
    "fr": "Préparer un document formel sur le contexte organisationnel de l’IA approuvé par la direction.",
    "de": "Bereiten Sie ein formelles KI-Organisationskontextdokument vor, das vom Management genehmigt wurde."
  },
  "Garantizar que las expectativas y derechos de los afectados por la IA sean identificados y gestionados.": {
    "en": "Ensure that the expectations and rights of those affected by AI are identified and managed.",
    "pt": "Garantir que as expectativas e os direitos das pessoas afetadas pela IA sejam identificados e geridos.",
    "fr": "Veiller à ce que les attentes et les droits des personnes concernées par l’IA soient identifiés et gérés.",
    "de": "Stellen Sie sicher, dass die Erwartungen und Rechte der von KI Betroffenen erkannt und gemanagt werden."
  },
  "Comprobar el documento formal de Declaración de Alcance del AIMS firmado por la alta dirección.": {
    "en": "Check the formal AIMS Scope Statement document signed by senior management.",
    "pt": "Verifique o documento formal da Declaração de Escopo AIMS assinado pela alta administração.",
    "fr": "Consultez le document officiel de déclaration de portée de l'AIMS signé par la haute direction.",
    "de": "Überprüfen Sie das formelle AIMS Scope Statement-Dokument, das von der Geschäftsleitung unterzeichnet wurde."
  },
  "Revisar la matriz de partes interesadas de IA y los mecanismos de consulta o recepción de feedback.": {
    "en": "Review the AI ​​stakeholder matrix and the mechanisms for consulting or receiving feedback.",
    "pt": "Revise a matriz das partes interessadas da IA ​​e os mecanismos de consulta ou recebimento de feedback.",
    "fr": "Passez en revue la matrice des parties prenantes de l’IA et les mécanismes de consultation ou de réception de commentaires.",
    "de": "Überprüfen Sie die KI-Stakeholder-Matrix und die Mechanismen zur Konsultation oder zum Erhalt von Feedback."
  },
  "Identificación de partes interesadas (usuarios, reguladores, empleados, clientes) y sus requisitos legales y éticos.": {
    "en": "Identification of interested parties (users, regulators, employees, clients) and their legal and ethical requirements.",
    "pt": "Identificação das partes interessadas (usuários, reguladores, funcionários, clientes) e seus requisitos legais e éticos.",
    "fr": "Identification des parties intéressées (utilisateurs, régulateurs, employés, clients) et de leurs exigences légales et éthiques.",
    "de": "Identifizierung interessierter Parteien (Benutzer, Regulierungsbehörden, Mitarbeiter, Kunden) und ihrer rechtlichen und ethischen Anforderungen."
  },
  "Establecer con precisión qué modelos, aplicaciones, equipos y flujos de datos están bajo la gobernanza del AIMS.": {
    "en": "Establish precisely which models, applications, equipment and data flows are under AIMS governance.",
    "pt": "Estabelecer com precisão quais modelos, aplicações, equipamentos e fluxos de dados estão sob a governança do AIMS.",
    "fr": "Déterminez précisément quels modèles, applications, équipements et flux de données sont sous la gouvernance AIMS.",
    "de": "Stellen Sie genau fest, welche Modelle, Anwendungen, Geräte und Datenflüsse der AIMS-Governance unterliegen."
  },
  "Redactar el documento de alcance especificando las arquitecturas LLM, RAG y pipelines cubiertos.": {
    "en": "Write the scope document specifying the LLM, RAG architectures and pipelines covered.",
    "pt": "Escreva o documento de escopo especificando as arquiteturas LLM, RAG e pipelines cobertos.",
    "fr": "Rédigez le document de portée spécifiant les architectures LLM, RAG et les pipelines couverts.",
    "de": "Schreiben Sie das Umfangsdokument, in dem die abgedeckten LLM-, RAG-Architekturen und Pipelines spezifiziert werden."
  },
  "Establecimiento, implementación, mantenimiento y mejora continua de los procesos requeridos para el AIMS.": {
    "en": "Establishment, implementation, maintenance and continuous improvement of the processes required for the AIMS.",
    "pt": "Estabelecimento, implementação, manutenção e melhoria contínua dos processos necessários ao AIMS.",
    "fr": "Établissement, mise en œuvre, maintenance et amélioration continue des processus requis pour l'AIMS.",
    "de": "Etablierung, Implementierung, Aufrechterhaltung und kontinuierliche Verbesserung der für das AIMS erforderlichen Prozesse."
  },
  "Asegurar la integración efectiva de los procesos del ciclo de vida de la IA con el sistema de gestión global.": {
    "en": "Ensure effective integration of AI lifecycle processes with the global management system.",
    "pt": "Garanta a integração eficaz dos processos do ciclo de vida da IA ​​com o sistema de gestão global.",
    "fr": "Assurer l’intégration efficace des processus du cycle de vie de l’IA avec le système de gestion mondial.",
    "de": "Sorgen Sie für eine effektive Integration der KI-Lebenszyklusprozesse in das globale Managementsystem."
  },
  "Examinar el mapa de procesos de IA y su interacción con desarrollo, seguridad de la información y operaciones.": {
    "en": "Examine the AI ​​process map and its interaction with development, information security, and operations.",
    "pt": "Examine o mapa de processos de IA e sua interação com desenvolvimento, segurança da informação e operações.",
    "fr": "Examinez la cartographie des processus d'IA et son interaction avec le développement, la sécurité des informations et les opérations.",
    "de": "Untersuchen Sie die KI-Prozesslandkarte und ihre Interaktion mit Entwicklung, Informationssicherheit und Betrieb."
  },
  "Sistema de gestión de IA y procesos": {
    "en": "AI and process management system",
    "pt": "Sistema de IA e gerenciamento de processos",
    "fr": "Système d'IA et de gestion des processus",
    "de": "KI- und Prozessmanagementsystem"
  },
  "Liderazgo y Compromiso (Leadership and Commitment)": {
    "en": "Leadership and Commitment",
    "pt": "Liderança e Compromisso",
    "fr": "Leadership et engagement",
    "de": "Führung und Engagement"
  },
  "Mapear formalmente los procesos de ciclo de vida de IA (datos, modelado, despliegue, observabilidad).": {
    "en": "Formally map AI lifecycle processes (data, modeling, deployment, observability).",
    "pt": "Mapeie formalmente os processos do ciclo de vida da IA ​​(dados, modelagem, implantação, observabilidade).",
    "fr": "Cartographier formellement les processus du cycle de vie de l'IA (données, modélisation, déploiement, observabilité).",
    "de": "KI-Lebenszyklusprozesse formal abbilden (Daten, Modellierung, Bereitstellung, Beobachtbarkeit)."
  },
  "Garantizar la rendición de cuentas (accountability) al más alto nivel jerárquico.": {
    "en": "Guarantee accountability at the highest hierarchical level.",
    "pt": "Garantir a responsabilização ao mais alto nível hierárquico.",
    "fr": "Garantir la responsabilité au plus haut niveau hiérarchique.",
    "de": "Gewährleistung der Verantwortlichkeit auf höchster Hierarchieebene."
  },
  "Demostración activa del involucramiento directivo en la gobernanza, ética y asignación presupuestaria de la IA.": {
    "en": "Active demonstration of management involvement in AI governance, ethics and budget allocation.",
    "pt": "Demonstração ativa do envolvimento da gestão na governação, ética e alocação orçamental da IA.",
    "fr": "Démonstration active de l'implication de la direction dans la gouvernance, l'éthique et l'allocation budgétaire de l'IA.",
    "de": "Aktive Demonstration der Beteiligung des Managements an der KI-Governance, Ethik und Budgetzuweisung."
  },
  "Revisar actas de comités directivos de IA, asignación formal de presupuesto y directrices estratégicas.": {
    "en": "Review AI steering committee minutes, formal budget allocation, and strategic guidelines.",
    "pt": "Revise as atas do comitê diretor de IA, a alocação orçamentária formal e as diretrizes estratégicas.",
    "fr": "Consultez les procès-verbaux du comité directeur de l’IA, l’allocation budgétaire formelle et les directives stratégiques.",
    "de": "Überprüfen Sie die Protokolle des KI-Lenkungsausschusses, die formelle Budgetzuweisung und die strategischen Richtlinien."
  },
  "Establecimiento, aprobación, comunicación y disponibilidad de una política formal de IA.": {
    "en": "Establishment, approval, communication and availability of a formal AI policy.",
    "pt": "Estabelecimento, aprovação, comunicação e disponibilização de uma política formal de IA.",
    "fr": "Établissement, approbation, communication et disponibilité d’une politique formelle en matière d’IA.",
    "de": "Einrichtung, Genehmigung, Kommunikation und Verfügbarkeit einer formellen KI-Richtlinie."
  },
  "Política de Inteligencia Artificial": {
    "en": "Artificial Intelligence Policy",
    "pt": "Política de Inteligência Artificial",
    "fr": "Politique d'intelligence artificielle",
    "de": "Politik der künstlichen Intelligenz"
  },
  "Liderazgo y compromiso de la alta dirección": {
    "en": "Leadership and commitment of senior management",
    "pt": "Liderança e comprometimento da alta administração",
    "fr": "Leadership et engagement de la haute direction",
    "de": "Führung und Engagement der Geschäftsleitung"
  },
  "Proporcionar un marco directivo coherente que guíe el diseño, adquisición y uso responsable de la IA.": {
    "en": "Provide a coherent governing framework that guides the design, acquisition and responsible use of AI.",
    "pt": "Fornecer uma estrutura governamental coerente que oriente o design, a aquisição e o uso responsável da IA.",
    "fr": "Fournir un cadre directeur cohérent qui guide la conception, l’acquisition et l’utilisation responsable de l’IA.",
    "de": "Stellen Sie einen kohärenten Verwaltungsrahmen bereit, der die Gestaltung, den Erwerb und den verantwortungsvollen Einsatz von KI leitet."
  },
  "Verificar la existencia de la Política de IA corporativa aprobada y accesible a todos los empleados y partes interesadas.": {
    "en": "Verify the existence of the approved Corporate AI Policy and accessible to all employees and interested parties.",
    "pt": "Verificar a existência da Política Corporativa de IA aprovada e acessível a todos os colaboradores e interessados.",
    "fr": "Vérifier l'existence de la politique d'entreprise en matière d'IA approuvée et accessible à tous les employés et parties intéressées.",
    "de": "Überprüfen Sie, ob die genehmigte Unternehmens-KI-Richtlinie vorhanden und für alle Mitarbeiter und Interessenten zugänglich ist."
  },
  "Constituir un Comité de Dirección de IA con reuniones trimestrales documentadas.": {
    "en": "Establish an AI Steering Committee with documented quarterly meetings.",
    "pt": "Estabeleça um Comitê Diretor de IA com reuniões trimestrais documentadas.",
    "fr": "Établir un comité directeur sur l’IA avec des réunions trimestrielles documentées.",
    "de": "Richten Sie einen KI-Lenkungsausschuss mit dokumentierten vierteljährlichen Treffen ein."
  },
  "Redactar y publicar la Política de Inteligencia Artificial integrando principios de equidad, privacidad y robustez.": {
    "en": "Write and publish the Artificial Intelligence Policy integrating principles of fairness, privacy and robustness.",
    "pt": "Escrever e publicar a Política de Inteligência Artificial integrando princípios de justiça, privacidade e robustez.",
    "fr": "Rédiger et publier la politique d'intelligence artificielle intégrant les principes d'équité, de confidentialité et de robustesse.",
    "de": "Verfassen und veröffentlichen Sie die Richtlinie zur künstlichen Intelligenz, die die Grundsätze von Fairness, Datenschutz und Robustheit integriert."
  },
  "La alta dirección debe demostrar liderazgo y compromiso con respecto al AIMS asegurando la disponibilidad de recursos, estableciendo la política de IA y los objetivos estratégicos, y asignando responsabilidades claras para la gobernanza algorítmica.": {
    "en": "Senior management must demonstrate leadership and commitment to AIMS by ensuring resource availability, establishing AI policy and strategic objectives, and assigning clear responsibilities for algorithmic governance.",
    "pt": "A gestão sénior deve demonstrar liderança e compromisso com o AIMS, garantindo a disponibilidade de recursos, estabelecendo políticas e objectivos estratégicos de IA, e atribuindo responsabilidades claras para a governação algorítmica.",
    "fr": "La haute direction doit faire preuve de leadership et d'engagement envers l'AIMS en garantissant la disponibilité des ressources, en établissant une politique et des objectifs stratégiques en matière d'IA et en attribuant des responsabilités claires en matière de gouvernance algorithmique.",
    "de": "Die Geschäftsleitung muss Führungsqualitäten und Engagement für AIMS unter Beweis stellen, indem sie die Verfügbarkeit von Ressourcen sicherstellt, KI-Richtlinien und strategische Ziele festlegt und klare Verantwortlichkeiten für die algorithmische Governance zuweist."
  },
  "Planificación del AIMS (Planning)": {
    "en": "AIMS Planning",
    "pt": "Planejamento AIMS",
    "fr": "Planification des objectifs",
    "de": "AIMS-Planung"
  },
  "Publicar una matriz RACI de gobernanza de IA definiendo responsables de MLOps, datos, seguridad y ética.": {
    "en": "Publish a RACI AI governance matrix defining those responsible for MLOps, data, security and ethics.",
    "pt": "Publique uma matriz de governança de IA RACI definindo os responsáveis ​​por MLOps, dados, segurança e ética.",
    "fr": "Publiez une matrice de gouvernance RACI AI définissant les responsables du MLOps, des données, de la sécurité et de l'éthique.",
    "de": "Veröffentlichen Sie eine RACI-KI-Governance-Matrix, in der die Verantwortlichen für MLOps, Daten, Sicherheit und Ethik definiert werden."
  },
  "Roles, responsabilidades y autoridades organizacionales": {
    "en": "Organizational roles, responsibilities and authorities",
    "pt": "Funções organizacionais, responsabilidades e autoridades",
    "fr": "Rôles, responsabilités et autorités organisationnelles",
    "de": "Organisatorische Rollen, Verantwortlichkeiten und Befugnisse"
  },
  "Eliminar ambigüedades operativas y garantizar que existan responsables claros de la seguridad y ética algorítmica.": {
    "en": "Eliminate operational ambiguities and ensure that there are clear owners of algorithmic security and ethics.",
    "pt": "Elimine ambiguidades operacionais e garanta que haja proprietários claros de segurança e ética algorítmica.",
    "fr": "Éliminez les ambiguïtés opérationnelles et assurez-vous qu’il existe des propriétaires clairs en matière de sécurité et d’éthique algorithmiques.",
    "de": "Beseitigen Sie betriebliche Unklarheiten und stellen Sie sicher, dass es klare Verantwortliche für algorithmische Sicherheit und Ethik gibt."
  },
  "Revisar descripciones de puestos, matriz RACI de IA y nombramiento del Oficial de Cumplimiento de IA.": {
    "en": "Review job descriptions, IA RACI matrix and appointment of the IA Compliance Officer.",
    "pt": "Revise as descrições de cargos, a matriz RACI da IA ​​e a nomeação do Diretor de Conformidade da IA.",
    "fr": "Examiner les descriptions de poste, la matrice IA RACI et la nomination du responsable de la conformité IA.",
    "de": "Überprüfen Sie die Stellenbeschreibungen, die IA-RACI-Matrix und die Ernennung des IA-Compliance-Beauftragten."
  },
  "Asegurar que los riesgos de IA se identifiquen y mitiguen proactivamente antes de afectar a personas u operaciones.": {
    "en": "Ensure AI risks are proactively identified and mitigated before impacting people or operations.",
    "pt": "Garanta que os riscos de IA sejam identificados e mitigados proativamente antes de impactar pessoas ou operações.",
    "fr": "Assurez-vous que les risques liés à l’IA sont identifiés et atténués de manière proactive avant d’avoir un impact sur les personnes ou les opérations.",
    "de": "Stellen Sie sicher, dass KI-Risiken proaktiv erkannt und gemindert werden, bevor sie sich auf Menschen oder Abläufe auswirken."
  },
  "Revisar la matriz de riesgos de IA con criterios cuantitativos de probabilidad, impacto y apetito de riesgo.": {
    "en": "Review the AI ​​risk matrix with quantitative criteria of probability, impact and risk appetite.",
    "pt": "Revise a matriz de risco da IA ​​com critérios quantitativos de probabilidade, impacto e apetite ao risco.",
    "fr": "Examinez la matrice des risques de l'IA avec des critères quantitatifs de probabilité, d'impact et d'appétit pour le risque.",
    "de": "Überprüfen Sie die KI-Risikomatrix anhand quantitativer Kriterien wie Wahrscheinlichkeit, Auswirkung und Risikobereitschaft."
  },
  "Metodología formal para evaluar riesgos específicos de IA (sesgo, alucinación, envenenamiento, denegación de servicio).": {
    "en": "Formal methodology to assess specific AI risks (bias, hallucination, poisoning, denial of service).",
    "pt": "Metodologia formal para avaliar riscos específicos de IA (preconceito, alucinação, envenenamento, negação de serviço).",
    "fr": "Méthodologie formelle pour évaluer les risques spécifiques de l'IA (biais, hallucination, empoisonnement, déni de service).",
    "de": "Formale Methodik zur Bewertung spezifischer KI-Risiken (Voreingenommenheit, Halluzination, Vergiftung, Denial of Service)."
  },
  "Implementar un registro de riesgos de IA alineado con ISO 23894 e ISO 31000.": {
    "en": "Implement an AI risk register aligned with ISO 23894 and ISO 31000.",
    "pt": "Implementar um registro de riscos de IA alinhado com a ISO 23894 e ISO 31000.",
    "fr": "Mettre en œuvre un registre des risques liés à l'IA aligné sur les normes ISO 23894 et ISO 31000.",
    "de": "Implementieren Sie ein KI-Risikoregister im Einklang mit ISO 23894 und ISO 31000."
  },
  "Asignación documentada de roles y responsabilidades para la operación del AIMS y el ciclo de vida de IA.": {
    "en": "Documented assignment of roles and responsibilities for the operation of the AIMS and the AI ​​lifecycle.",
    "pt": "Atribuição documentada de funções e responsabilidades para a operação do AIMS e do ciclo de vida da IA.",
    "fr": "Affectation documentée des rôles et des responsabilités pour le fonctionnement de l'AIMS et du cycle de vie de l'IA.",
    "de": "Dokumentierte Zuweisung von Rollen und Verantwortlichkeiten für den Betrieb des AIMS und den KI-Lebenszyklus."
  },
  "Acciones para abordar riesgos y oportunidades": {
    "en": "Actions to address risks and opportunities",
    "pt": "Ações para abordar riscos e oportunidades",
    "fr": "Actions pour faire face aux risques et aux opportunités",
    "de": "Maßnahmen zur Bewältigung von Risiken und Chancen"
  },
  "La organización debe planificar acciones para abordar los riesgos y oportunidades derivados de la autonomía, opacidad y escala de los sistemas de IA, estableciendo objetivos medibles y procedimientos formales para gestionar los cambios.": {
    "en": "The organization must plan actions to address the risks and opportunities arising from the autonomy, opacity and scale of AI systems, establishing measurable objectives and formal procedures to manage changes.",
    "pt": "A organização deve planear ações para enfrentar os riscos e oportunidades decorrentes da autonomia, opacidade e escala dos sistemas de IA, estabelecendo objetivos mensuráveis ​​e procedimentos formais para gerir as mudanças.",
    "fr": "L'organisation doit planifier des actions pour faire face aux risques et opportunités découlant de l'autonomie, de l'opacité et de l'échelle des systèmes d'IA, en établissant des objectifs mesurables et des procédures formelles pour gérer les changements.",
    "de": "Die Organisation muss Maßnahmen planen, um den Risiken und Chancen zu begegnen, die sich aus der Autonomie, Undurchsichtigkeit und Größe von KI-Systemen ergeben, und messbare Ziele und formelle Verfahren zur Bewältigung von Änderungen festlegen."
  },
  "Establecer un cuadro de mando de métricas de IA (KPIs/SLOs de rendimiento, drift y equidad).": {
    "en": "Establish a dashboard of AI metrics (performance, drift and fairness KPIs/SLOs).",
    "pt": "Estabeleça um painel de métricas de IA (KPIs/SLOs de desempenho, desvio e justiça).",
    "fr": "Établir un tableau de bord des métriques de l'IA (KPI/SLO de performance, de dérive et d'équité).",
    "de": "Erstellen Sie ein Dashboard mit KI-Metriken (Leistungs-, Drift- und Fairness-KPIs/SLOs)."
  },
  "Verificar que cada sistema de IA tenga objetivos documentados con KPIs específicos y periodicidad de medición.": {
    "en": "Verify that each AI system has documented objectives with specific KPIs and measurement periodicity.",
    "pt": "Verifique se cada sistema de IA possui objetivos documentados com KPIs e periodicidade de medição específicos.",
    "fr": "Vérifiez que chaque système d'IA a des objectifs documentés avec des KPI spécifiques et une périodicité de mesure.",
    "de": "Stellen Sie sicher, dass jedes KI-System über dokumentierte Ziele mit spezifischen KPIs und Messintervallen verfügt."
  },
  "Alinear el desempeño de los modelos y del AIMS con métricas objetivas y verificables.": {
    "en": "Align the performance of models and AIMS with objective and verifiable metrics.",
    "pt": "Alinhe o desempenho dos modelos e AIMS com métricas objetivas e verificáveis.",
    "fr": "Alignez les performances des modèles et des AIMS avec des mesures objectives et vérifiables.",
    "de": "Richten Sie die Leistung von Modellen und Zielen an objektiven und überprüfbaren Kennzahlen aus."
  },
  "Definición de metas medibles de precisión, robustez, latencia, explicabilidad y cumplimiento normativo.": {
    "en": "Definition of measurable goals for precision, robustness, latency, explainability and regulatory compliance.",
    "pt": "Definição de metas mensuráveis ​​de precisão, robustez, latência, explicabilidade e conformidade regulatória.",
    "fr": "Définition d'objectifs mesurables en matière de précision, de robustesse, de latence, d'explicabilité et de conformité réglementaire.",
    "de": "Definition messbarer Ziele für Präzision, Robustheit, Latenz, Erklärbarkeit und Einhaltung gesetzlicher Vorschriften."
  },
  "Prevenir regresiones de seguridad, fallos imprevistos o pérdida de gobernanza ante modificaciones técnicas.": {
    "en": "Prevent security regressions, unforeseen failures or loss of governance due to technical modifications.",
    "pt": "Evite regressões de segurança, falhas imprevistas ou perda de governança devido a modificações técnicas.",
    "fr": "Prévenir les régressions de sécurité, les pannes imprévues ou les pertes de gouvernance dues à des modifications techniques.",
    "de": "Verhindern Sie Sicherheitsrückgänge, unvorhergesehene Ausfälle oder Verlust der Governance aufgrund technischer Änderungen."
  },
  "Control formal de cambios en arquitecturas, modelos, datasets de fine-tuning o proveedores de LLMs.": {
    "en": "Formal control of changes in architectures, models, fine-tuning datasets or LLM providers.",
    "pt": "Controle formal de mudanças em arquiteturas, modelos, conjuntos de dados de ajuste fino ou provedores de LLM.",
    "fr": "Contrôle formel des modifications des architectures, des modèles, des ensembles de données de réglage fin ou des fournisseurs LLM.",
    "de": "Formale Kontrolle von Änderungen an Architekturen, Modellen, Feinabstimmungsdatensätzen oder LLM-Anbietern."
  },
  "Revisar el procedimiento de gestión de cambios (RFC) aplicado a modelos y pipelines de IA.": {
    "en": "Review the change management procedure (RFC) applied to AI models and pipelines.",
    "pt": "Revise o procedimento de gerenciamento de mudanças (RFC) aplicado a modelos e pipelines de IA.",
    "fr": "Passez en revue la procédure de gestion des modifications (RFC) appliquée aux modèles et pipelines d'IA.",
    "de": "Überprüfen Sie das Änderungsmanagementverfahren (RFC), das auf KI-Modelle und Pipelines angewendet wird."
  },
  "Integrar puertas de calidad (Quality Gates) en el CI/CD que exijan re-evaluación ante cambios de modelo.": {
    "en": "Integrate quality gates (Quality Gates) in the CI/CD that require re-evaluation in the event of model changes.",
    "pt": "Integrar portões de qualidade (Quality Gates) no CI/CD que requerem reavaliação em caso de mudanças no modelo.",
    "fr": "Intégrer des portes de qualité (Quality Gates) dans le CI/CD qui nécessitent une réévaluation en cas de changements de modèle.",
    "de": "Integrieren Sie Qualitäts-Gates (Quality Gates) in das CI/CD, die bei Modelländerungen eine Neubewertung erfordern."
  },
  "Planificación de los cambios": {
    "en": "Planning the changes",
    "pt": "Planejando as mudanças",
    "fr": "Planifier les changements",
    "de": "Planen Sie die Änderungen"
  },
  "Objetivos de IA y planificación para lograrlos": {
    "en": "AI goals and planning to achieve them",
    "pt": "Metas de IA e planejamento para alcançá-las",
    "fr": "Objectifs de l’IA et planification pour les atteindre",
    "de": "KI-Ziele und Planung zu deren Erreichung"
  },
  "Soporte y Recursos (Support)": {
    "en": "Support and Resources (Support)",
    "pt": "Suporte e Recursos (Suporte)",
    "fr": "Support et ressources (Support)",
    "de": "Support und Ressourcen (Support)"
  },
  "La organización debe determinar y proporcionar los recursos necesarios para el AIMS, asegurar la competencia y concienciación del personal en riesgos y ética de IA, y mantener la información documentada bajo estricto control de versiones.": {
    "en": "The organization must determine and provide the necessary resources for the AIMS, ensure staff competency and awareness in AI risks and ethics, and maintain documented information under strict version control.",
    "pt": "A organização deve determinar e fornecer os recursos necessários para o AIMS, garantir a competência e consciência do pessoal sobre os riscos e a ética da IA, e manter as informações documentadas sob rigoroso controle de versão.",
    "fr": "L'organisation doit déterminer et fournir les ressources nécessaires pour l'AIMS, garantir la compétence et la sensibilisation du personnel aux risques et à l'éthique de l'IA, et maintenir les informations documentées sous un contrôle strict des versions.",
    "de": "Die Organisation muss die notwendigen Ressourcen für das AIMS ermitteln und bereitstellen, die Kompetenz und das Bewusstsein der Mitarbeiter für KI-Risiken und -Ethik sicherstellen und dokumentierte Informationen unter strenger Versionskontrolle aufbewahren."
  },
  "Recursos humanos, de infraestructura y cómputo": {
    "en": "Human, infrastructure and computing resources",
    "pt": "Recursos humanos, de infraestrutura e computacionais",
    "fr": "Ressources humaines, infrastructures et informatiques",
    "de": "Personal-, Infrastruktur- und Computerressourcen"
  },
  "Dotación de capacidad de cómputo, almacenamiento seguro, plataformas de observabilidad y personal calificado.": {
    "en": "Provision of computing capacity, secure storage, observability platforms and qualified personnel.",
    "pt": "Fornecimento de capacidade computacional, armazenamento seguro, plataformas de observabilidade e pessoal qualificado.",
    "fr": "Mise à disposition de capacité de calcul, de stockage sécurisé, de plateformes d'observabilité et de personnel qualifié.",
    "de": "Bereitstellung von Rechenkapazität, sicherer Speicherung, Observability-Plattformen und qualifiziertem Personal."
  },
  "Asegurar la viabilidad técnica y operativa del AIMS.": {
    "en": "Ensure the technical and operational viability of the AIMS.",
    "pt": "Garantir a viabilidade técnica e operacional do AIMS.",
    "fr": "Assurer la viabilité technique et opérationnelle de l’AIMS.",
    "de": "Stellen Sie die technische und betriebliche Durchführbarkeit des AIMS sicher."
  },
  "Formalizar el inventario de recursos de cómputo y herramientas de MLOps con presupuestos asignados.": {
    "en": "Formalize the inventory of computing resources and MLOps tools with assigned budgets.",
    "pt": "Formalize o inventário de recursos computacionais e ferramentas MLOps com orçamentos atribuídos.",
    "fr": "Formaliser l'inventaire des ressources informatiques et des outils MLOps avec les budgets attribués.",
    "de": "Formulieren Sie den Bestand an Rechenressourcen und MLOps-Tools mit zugewiesenen Budgets."
  },
  "Auditar la infraestructura de cómputo dedicada (GPUs, vector databases) y la dotación presupuestaria de herramientas.": {
    "en": "Audit the dedicated computing infrastructure (GPUs, vector databases) and the budgetary provision of tools.",
    "pt": "Auditar a infraestrutura informática dedicada (GPU, bases de dados vetoriais) e a disponibilização orçamental de ferramentas.",
    "fr": "Auditer l'infrastructure informatique dédiée (GPU, bases de données vectorielles) et la mise à disposition budgétaire des outils.",
    "de": "Prüfen Sie die dedizierte Computerinfrastruktur (GPUs, Vektordatenbanken) und die budgetäre Bereitstellung von Tools."
  },
  "Revisar expedientes de formación, planes de carrera y certificaciones en seguridad y machine learning.": {
    "en": "Review training files, career plans and certifications in security and machine learning.",
    "pt": "Revise arquivos de treinamento, planos de carreira e certificações em segurança e aprendizado de máquina.",
    "fr": "Examiner les dossiers de formation, les plans de carrière et les certifications en sécurité et en machine learning.",
    "de": "Sehen Sie sich Schulungsdateien, Karrierepläne und Zertifizierungen in den Bereichen Sicherheit und maschinelles Lernen an."
  },
  "Diseñar un plan de capacitación obligatorio en seguridad de modelos de lenguaje (LLM Security) y MLOps.": {
    "en": "Design a mandatory training plan for language model security (LLM Security) and MLOps.",
    "pt": "Projete um plano de treinamento obrigatório para segurança de modelo de linguagem (LLM Security) e MLOps.",
    "fr": "Concevoir un plan de formation obligatoire pour la sécurité des modèles de langage (LLM Security) et MLOps.",
    "de": "Entwerfen Sie einen obligatorischen Schulungsplan für Sprachmodellsicherheit (LLM Security) und MLOps."
  },
  "Garantizar que el personal cuente con las habilidades técnicas y de seguridad requeridas.": {
    "en": "Ensure that staff have the required technical and security skills.",
    "pt": "Certifique-se de que a equipe tenha as habilidades técnicas e de segurança necessárias.",
    "fr": "Veiller à ce que le personnel possède les compétences techniques et de sécurité requises.",
    "de": "Stellen Sie sicher, dass das Personal über die erforderlichen technischen und sicherheitstechnischen Fähigkeiten verfügt."
  },
  "Verificación de la cualificación, certificaciones y experiencia de ingenieros de datos, MLOps y auditores de IA.": {
    "en": "Verification of the qualifications, certifications and experience of data engineers, MLOps and AI auditors.",
    "pt": "Verificação das qualificações, certificações e experiência de engenheiros de dados, MLOps e auditores de IA.",
    "fr": "Vérification des qualifications, certifications et expériences des ingénieurs de données, MLOps et auditeurs IA.",
    "de": "Überprüfung der Qualifikationen, Zertifizierungen und Erfahrungen von Dateningenieuren, MLOps und KI-Auditoren."
  },
  "Competencia del personal de IA": {
    "en": "AI staff competency",
    "pt": "Competência da equipe de IA",
    "fr": "Compétence du personnel en IA",
    "de": "Kompetenz des KI-Personals"
  },
  "Concienciación y cultura ética": {
    "en": "Awareness and ethical culture",
    "pt": "Conscientização e cultura ética",
    "fr": "Sensibilisation et culture éthique",
    "de": "Bewusstsein und ethische Kultur"
  },
  "Comprobar registros de asistencia y contenidos de talleres de concienciación en IA ética.": {
    "en": "Check attendance records and contents of ethical AI awareness workshops.",
    "pt": "Verifique os registros de participação e o conteúdo dos workshops de conscientização ética sobre IA.",
    "fr": "Vérifiez les registres de présence et le contenu des ateliers de sensibilisation à l’IA éthique.",
    "de": "Überprüfen Sie die Anwesenheitslisten und Inhalte von Workshops zur Sensibilisierung für ethische KI."
  },
  "Canales formales para comunicar políticas, incidentes y directrices operacionales de los sistemas de IA.": {
    "en": "Formal channels to communicate policies, incidents and operational guidelines of AI systems.",
    "pt": "Canais formais para comunicar políticas, incidentes e diretrizes operacionais de sistemas de IA.",
    "fr": "Canaux formels pour communiquer les politiques, les incidents et les directives opérationnelles des systèmes d’IA.",
    "de": "Formelle Kanäle zur Kommunikation von Richtlinien, Vorfällen und Betriebsrichtlinien von KI-Systemen."
  },
  "Documentar un plan de comunicación de IA definiendo interlocutores y protocolos de escalamiento.": {
    "en": "Document an AI communication plan defining interlocutors and escalation protocols.",
    "pt": "Documente um plano de comunicação de IA definindo interlocutores e protocolos de escalonamento.",
    "fr": "Documenter un plan de communication IA définissant les interlocuteurs et les protocoles d'escalade.",
    "de": "Dokumentieren Sie einen KI-Kommunikationsplan, der Gesprächspartner und Eskalationsprotokolle definiert."
  },
  "Garantizar la transparencia y flujo de información crítica entre equipos técnicos y partes interesadas.": {
    "en": "Ensure transparency and flow of critical information between technical teams and stakeholders.",
    "pt": "Garantir a transparência e o fluxo de informações críticas entre as equipes técnicas e as partes interessadas.",
    "fr": "Assurer la transparence et la circulation des informations critiques entre les équipes techniques et les parties prenantes.",
    "de": "Sorgen Sie für Transparenz und den Fluss wichtiger Informationen zwischen technischen Teams und Stakeholdern."
  },
  "Fomentar una cultura organizacional vigilante ante fallos éticos y de seguridad en IA.": {
    "en": "Promote an organizational culture that is vigilant against ethical and safety failures in AI.",
    "pt": "Promover uma cultura organizacional vigilante contra falhas éticas e de segurança na IA.",
    "fr": "Promouvoir une culture organisationnelle vigilante contre les échecs éthiques et de sécurité dans l’IA.",
    "de": "Fördern Sie eine Organisationskultur, die wachsam gegenüber ethischen und sicherheitstechnischen Verstößen in der KI ist."
  },
  "Revisar protocolos de comunicación ante incidentes de IA y canales de notificación a usuarios.": {
    "en": "Review communication protocols for AI incidents and user notification channels.",
    "pt": "Revise os protocolos de comunicação para incidentes de IA e canais de notificação de usuários.",
    "fr": "Examinez les protocoles de communication pour les incidents d’IA et les canaux de notification des utilisateurs.",
    "de": "Überprüfen Sie Kommunikationsprotokolle für KI-Vorfälle und Benutzerbenachrichtigungskanäle."
  },
  "Programas regulares de sensibilización sobre riesgos de IA, sesgos algorítmicos y uso responsable.": {
    "en": "Regular awareness programs on AI risks, algorithmic biases and responsible use.",
    "pt": "Programas regulares de conscientização sobre os riscos da IA, preconceitos algorítmicos e uso responsável.",
    "fr": "Programmes réguliers de sensibilisation aux risques de l’IA, aux biais algorithmiques et à l’utilisation responsable.",
    "de": "Regelmäßige Aufklärungsprogramme zu KI-Risiken, algorithmischen Vorurteilen und verantwortungsvollem Einsatz."
  },
  "Desplegar un módulo anual de concienciación en riesgos de IA y directrices de uso aceptable.": {
    "en": "Deploy an annual AI risk awareness module and acceptable use guidelines.",
    "pt": "Implantar um módulo anual de conscientização sobre riscos de IA e diretrizes de uso aceitável.",
    "fr": "Déployer un module annuel de sensibilisation aux risques liés à l’IA et des directives d’utilisation acceptable.",
    "de": "Stellen Sie ein jährliches KI-Risikobewusstseinsmodul und akzeptable Nutzungsrichtlinien bereit."
  },
  "Comunicación interna y externa": {
    "en": "Internal and external communication",
    "pt": "Comunicação interna e externa",
    "fr": "Communication interne et externe",
    "de": "Interne und externe Kommunikation"
  },
  "Información documentada y registros": {
    "en": "Documented information and records",
    "pt": "Informações e registros documentados",
    "fr": "Informations et enregistrements documentés",
    "de": "Dokumentierte Informationen und Aufzeichnungen"
  },
  "Control de versiones, almacenamiento seguro y retención de artefactos, prompts, modelos y reportes de auditoría.": {
    "en": "Version control, secure storage and retention of artifacts, prompts, models and audit reports.",
    "pt": "Controle de versão, armazenamento seguro e retenção de artefatos, prompts, modelos e relatórios de auditoria.",
    "fr": "Contrôle des versions, stockage sécurisé et conservation des artefacts, des invites, des modèles et des rapports d'audit.",
    "de": "Versionskontrolle, sichere Speicherung und Aufbewahrung von Artefakten, Eingabeaufforderungen, Modellen und Prüfberichten."
  },
  "Asegurar la trazabilidad, reproducibilidad y evidencia auditable a lo largo del tiempo.": {
    "en": "Ensure traceability, reproducibility and auditable evidence over time.",
    "pt": "Garanta rastreabilidade, reprodutibilidade e evidências auditáveis ​​ao longo do tempo.",
    "fr": "Assurer la traçabilité, la reproductibilité et des preuves vérifiables dans le temps.",
    "de": "Sorgen Sie im Laufe der Zeit für Rückverfolgbarkeit, Reproduzierbarkeit und überprüfbare Beweise."
  },
  "Operación del Sistema de Gestión de IA (Operation)": {
    "en": "Operation of the AI ​​Management System (Operation)",
    "pt": "Operação do Sistema de Gestão de IA (Operação)",
    "fr": "Fonctionnement du système de gestion de l'IA (Opération)",
    "de": "Betrieb des KI-Managementsystems (Betrieb)"
  },
  "Asegurar que los sistemas de IA se construyan y operen según las especificaciones aprobadas.": {
    "en": "Ensure AI systems are built and operated to approved specifications.",
    "pt": "Certifique-se de que os sistemas de IA sejam construídos e operados de acordo com as especificações aprovadas.",
    "fr": "Veiller à ce que les systèmes d’IA soient construits et exploités conformément aux spécifications approuvées.",
    "de": "Stellen Sie sicher, dass KI-Systeme gemäß genehmigten Spezifikationen gebaut und betrieben werden."
  },
  "Verificar repositorios de código, registros de experimentos (MLflow/Weights&Biases) y políticas de retención.": {
    "en": "Verify code repositories, experiment logs (MLflow/Weights&Biases) and retention policies.",
    "pt": "Verifique repositórios de código, logs de experimentos (MLflow/Weights&Biases) e políticas de retenção.",
    "fr": "Vérifiez les référentiels de code, les journaux d'expériences (MLflow/Weights&Biases) et les politiques de rétention.",
    "de": "Überprüfen Sie Code-Repositorys, Experimentprotokolle (MLflow/Weights&Biases) und Aufbewahrungsrichtlinien."
  },
  "Implementar un sistema de gestión documental con control criptográfico de versiones para artefactos de IA.": {
    "en": "Implement a document management system with cryptographic version control for AI artifacts.",
    "pt": "Implemente um sistema de gerenciamento de documentos com controle de versão criptográfica para artefatos de IA.",
    "fr": "Implémentez un système de gestion de documents avec contrôle de version cryptographique pour les artefacts d'IA.",
    "de": "Implementieren Sie ein Dokumentenverwaltungssystem mit kryptografischer Versionskontrolle für KI-Artefakte."
  },
  "Definición de criterios operacionales y controles de ingeniería para el ciclo de vida de la IA.": {
    "en": "Definition of operational criteria and engineering controls for the AI ​​life cycle.",
    "pt": "Definição de critérios operacionais e controles de engenharia para o ciclo de vida da IA.",
    "fr": "Définition des critères opérationnels et des contrôles techniques pour le cycle de vie de l'IA.",
    "de": "Definition von Betriebskriterien und technischen Kontrollen für den KI-Lebenszyklus."
  },
  "Revisar especificaciones de arquitectura, guías de estilo de código de ML y políticas de release.": {
    "en": "Review architecture specifications, ML code style guides, and release policies.",
    "pt": "Revise as especificações de arquitetura, os guias de estilo de código de ML e as políticas de lançamento.",
    "fr": "Passez en revue les spécifications d'architecture, les guides de style de code ML et les politiques de publication.",
    "de": "Sehen Sie sich Architekturspezifikationen, ML-Code-Styleguides und Release-Richtlinien an."
  },
  "Planificación y control operacional": {
    "en": "Planning and operational control",
    "pt": "Planejamento e controle operacional",
    "fr": "Planification et contrôle opérationnel",
    "de": "Planung und Betriebssteuerung"
  },
  "Evaluación de riesgos de IA": {
    "en": "AI Risk Assessment",
    "pt": "Avaliação de risco de IA",
    "fr": "Évaluation des risques liés à l'IA",
    "de": "KI-Risikobewertung"
  },
  "Evaluación sistemática de riesgos de seguridad, alucinación, sesgo y robustez para cada caso de uso.": {
    "en": "Systematic evaluation of security risks, hallucination, bias and robustness for each use case.",
    "pt": "Avaliação sistemática de riscos de segurança, alucinação, preconceito e robustez para cada caso de uso.",
    "fr": "Évaluation systématique des risques de sécurité, des hallucinations, des biais et de la robustesse pour chaque cas d'utilisation.",
    "de": "Systematische Bewertung von Sicherheitsrisiken, Halluzinationen, Voreingenommenheit und Robustheit für jeden Anwendungsfall."
  },
  "Establecer un estándar operacional de despliegue de modelos con checklists de seguridad obligatorios.": {
    "en": "Establish an operational standard for model deployment with mandatory security checklists.",
    "pt": "Estabeleça um padrão operacional para implantação de modelos com listas de verificação de segurança obrigatórias.",
    "fr": "Établissez une norme opérationnelle pour le déploiement du modèle avec des listes de contrôle de sécurité obligatoires.",
    "de": "Legen Sie einen Betriebsstandard für die Modellbereitstellung mit verbindlichen Sicherheitschecklisten fest."
  },
  "Verificar informes de evaluación de riesgos firmados para los modelos en producción.": {
    "en": "Verify signed risk assessment reports for models in production.",
    "pt": "Verifique relatórios de avaliação de risco assinados para modelos em produção.",
    "fr": "Vérifier les rapports signés d’évaluation des risques pour les modèles en production.",
    "de": "Überprüfen Sie unterzeichnete Risikobewertungsberichte für Modelle in der Produktion."
  },
  "Implementación efectiva de salvaguardas técnicas y organizativas derivadas del Anexo A.": {
    "en": "Effective implementation of technical and organizational safeguards derived from Annex A.",
    "pt": "Implementação eficaz de salvaguardas técnicas e organizacionais derivadas do Anexo A.",
    "fr": "Mise en œuvre efficace des garanties techniques et organisationnelles dérivées de l’Annexe A.",
    "de": "Effektive Umsetzung der aus Anhang A abgeleiteten technischen und organisatorischen Schutzmaßnahmen."
  },
  "La organización debe planificar, implementar y controlar los procesos operativos para la gestión de riesgos de IA y llevar a cabo evaluaciones de impacto de sistemas de IA (AIIA) antes de su puesta en producción.": {
    "en": "The organization must plan, implement and control operational processes for AI risk management and conduct AI system impact assessments (AIIAs) before going into production.",
    "pt": "A organização deve planear, implementar e controlar processos operacionais para a gestão de riscos de IA e realizar avaliações de impacto do sistema de IA (AIIAs) antes de entrar em produção.",
    "fr": "L'organisation doit planifier, mettre en œuvre et contrôler les processus opérationnels de gestion des risques liés à l'IA et mener des évaluations d'impact du système d'IA (AIIA) avant de passer en production.",
    "de": "Die Organisation muss operative Prozesse für das KI-Risikomanagement planen, implementieren und steuern und KI-Systemfolgenabschätzungen (AIIAs) durchführen, bevor sie in die Produktion gehen."
  },
  "Tratamiento de riesgos de IA": {
    "en": "AI Risk Treatment",
    "pt": "Tratamento de risco de IA",
    "fr": "Traitement des risques liés à l'IA",
    "de": "KI-Risikobehandlung"
  },
  "Integrar la metodología de evaluación de riesgos de IA en el proceso de aprobación de proyectos.": {
    "en": "Integrate AI risk assessment methodology into the project approval process.",
    "pt": "Integre a metodologia de avaliação de risco de IA ao processo de aprovação do projeto.",
    "fr": "Intégrer la méthodologie d’évaluation des risques liés à l’IA dans le processus d’approbation des projets.",
    "de": "Integrieren Sie die KI-Risikobewertungsmethodik in den Projektgenehmigungsprozess."
  },
  "Elaborar y ejecutar el Plan de Tratamiento de Riesgos documentando la selección de controles del Anexo A.": {
    "en": "Prepare and execute the Risk Treatment Plan documenting the selection of controls in Annex A.",
    "pt": "Preparar e executar o Plano de Tratamento de Riscos documentando a seleção de controles no Anexo A.",
    "fr": "Préparer et exécuter le plan de traitement des risques documentant la sélection des contrôles à l'annexe A.",
    "de": "Bereiten Sie den Risikobehandlungsplan vor und führen Sie ihn aus, der die Auswahl der Kontrollen in Anhang A dokumentiert."
  },
  "Comprobar el Plan de Tratamiento de Riesgos de IA y la correspondencia con controles implementados.": {
    "en": "Check the AI ​​Risk Treatment Plan and the correspondence with implemented controls.",
    "pt": "Verifique o Plano de Tratamento de Riscos de IA e a correspondência com os controles implementados.",
    "fr": "Vérifier le Plan de Traitement des Risques IA et la correspondance avec les contrôles mis en place.",
    "de": "Überprüfen Sie den KI-Risikobehandlungsplan und die Übereinstimmung mit den implementierten Kontrollen."
  },
  "Reducir los riesgos residuales a niveles aceptables mediante controles de ingeniería y gobernanza.": {
    "en": "Reduce residual risks to acceptable levels through engineering and governance controls.",
    "pt": "Reduza os riscos residuais a níveis aceitáveis ​​através de controles de engenharia e governança.",
    "fr": "Réduire les risques résiduels à des niveaux acceptables grâce à des contrôles d’ingénierie et de gouvernance.",
    "de": "Reduzieren Sie Restrisiken durch technische und Governance-Kontrollen auf ein akzeptables Maß."
  },
  "Cuantificar los riesgos operacionales específicos antes de autorizar el despliegue a producción.": {
    "en": "Quantify specific operational risks before authorizing deployment to production.",
    "pt": "Quantifique os riscos operacionais específicos antes de autorizar a implantação na produção.",
    "fr": "Quantifiez les risques opérationnels spécifiques avant d’autoriser le déploiement en production.",
    "de": "Quantifizieren Sie spezifische Betriebsrisiken, bevor Sie den Einsatz in der Produktion genehmigen."
  },
  "Identificar y prevenir daños potenciales a individuos o colectivos derivados de la operación del modelo.": {
    "en": "Identify and prevent potential harm to individuals or groups derived from the operation of the model.",
    "pt": "Identifique e evite danos potenciais a indivíduos ou grupos derivados da operação do modelo.",
    "fr": "Identifier et prévenir les dommages potentiels aux individus ou aux groupes découlant du fonctionnement du modèle.",
    "de": "Identifizieren und verhindern Sie potenzielle Schäden für Einzelpersonen oder Gruppen, die sich aus dem Betrieb des Modells ergeben."
  },
  "Exigir el informe formal de AIIA (AI Impact Assessment) para el sistema analizado.": {
    "en": "Require the formal AIIA (AI Impact Assessment) report for the system analyzed.",
    "pt": "Exigir o relatório formal AIIA (AI Impact Assessment) para o sistema analisado.",
    "fr": "Exiger le rapport formel AIIA (AI Impact Assessment) pour le système analysé.",
    "de": "Fordern Sie den formellen AIIA-Bericht (AI Impact Assessment) für das analysierte System an."
  },
  "Evaluación formal documentada previa al despliegue evaluando derechos fundamentales, equidad y sociedad.": {
    "en": "Documented formal evaluation prior to deployment evaluating fundamental rights, equity and society.",
    "pt": "Avaliação formal documentada antes da implantação, avaliando os direitos fundamentais, a equidade e a sociedade.",
    "fr": "Évaluation formelle documentée avant le déploiement évaluant les droits fondamentaux, l'équité et la société.",
    "de": "Dokumentierte formelle Bewertung vor dem Einsatz zur Bewertung von Grundrechten, Gerechtigkeit und Gesellschaft."
  },
  "Adoptar una plantilla corporativa de AIIA y hacer obligatoria su aprobación antes de cualquier lanzamiento.": {
    "en": "Adopt an AIIA corporate template and make its approval mandatory before any launch.",
    "pt": "Adote um modelo corporativo AIIA e torne obrigatória a sua aprovação antes de qualquer lançamento.",
    "fr": "Adoptez un modèle d’entreprise AIIA et rendez son approbation obligatoire avant tout lancement.",
    "de": "Übernehmen Sie eine AIIA-Unternehmensvorlage und machen Sie deren Genehmigung vor jeder Einführung verbindlich."
  },
  "Evaluación de Impacto del Sistema de IA (AIIA)": {
    "en": "AI System Impact Assessment (AIIA)",
    "pt": "Avaliação de impacto do sistema de IA (AIIA)",
    "fr": "Évaluation de l’impact du système d’IA (AIIA)",
    "de": "Folgenabschätzung für KI-Systeme (AIIA)"
  },
  "Evaluación del Desempeño (Performance Evaluation)": {
    "en": "Performance Evaluation",
    "pt": "Avaliação de desempenho",
    "fr": "Évaluation des performances",
    "de": "Leistungsbewertung"
  },
  "Seguimiento, medición, análisis y evaluación": {
    "en": "Monitoring, measurement, analysis and evaluation",
    "pt": "Monitoramento, medição, análise e avaliação",
    "fr": "Suivi, mesure, analyse et évaluation",
    "de": "Überwachung, Messung, Analyse und Auswertung"
  },
  "Monitoreo automatizado de deriva de datos (data drift), deriva de conceptos, tasas de alucinación y latencia.": {
    "en": "Automated monitoring of data drift, concept drift, hallucination rates and latency.",
    "pt": "Monitoramento automatizado de desvio de dados, desvio de conceito, taxas de alucinação e latência.",
    "fr": "Surveillance automatisée de la dérive des données, de la dérive des concepts, des taux d'hallucinations et de la latence.",
    "de": "Automatisierte Überwachung von Datendrift, Konzeptdrift, Halluzinationsraten und Latenz."
  },
  "La organización debe monitorear, medir, analizar y evaluar el desempeño de los sistemas de IA y la eficacia del AIMS, ejecutando auditorías internas periódicas y revisiones directivas formales.": {
    "en": "The organization must monitor, measure, analyze and evaluate the performance of the AI ​​systems and the effectiveness of the AIMS, conducting periodic internal audits and formal management reviews.",
    "pt": "A organização deve monitorizar, medir, analisar e avaliar o desempenho dos sistemas de IA e a eficácia dos AIMS, realizando auditorias internas periódicas e revisões formais de gestão.",
    "fr": "L'organisation doit surveiller, mesurer, analyser et évaluer les performances des systèmes d'IA et l'efficacité du système AIMS, en effectuant des audits internes périodiques et des revues formelles de direction.",
    "de": "Die Organisation muss die Leistung der KI-Systeme und die Wirksamkeit des AIMS überwachen, messen, analysieren und bewerten und dazu regelmäßige interne Audits und formelle Managementbewertungen durchführen."
  },
  "Revisar el programa de auditoría interna, informes de hallazgos y planes de acción de auditoría previa.": {
    "en": "Review the internal audit program, reports of findings and pre-audit action plans.",
    "pt": "Revisar o programa de auditoria interna, relatórios de conclusões e planos de ação pré-auditoria.",
    "fr": "Examiner le programme d'audit interne, les rapports de constatations et les plans d'action préalables à l'audit.",
    "de": "Überprüfen Sie das interne Auditprogramm, die Ergebnisberichte und die Aktionspläne vor dem Audit."
  },
  "Revisar dashboards de observabilidad (Prometheus, Evidently, Grafana) y reglas de alerta configuradas.": {
    "en": "Review observability dashboards (Prometheus, Evidently, Grafana) and configured alert rules.",
    "pt": "Revise os painéis de observabilidade (Prometheus, Evidently, Grafana) e as regras de alerta configuradas.",
    "fr": "Examinez les tableaux de bord d'observabilité (Prometheus, Evidently, Grafana) et les règles d'alerte configurées.",
    "de": "Überprüfen Sie Observability-Dashboards (Prometheus, Evidently, Grafana) und konfigurierte Alarmregeln."
  },
  "Auditorías internas planificadas a intervalos regulares con auditores calificados e independientes.": {
    "en": "Internal audits planned at regular intervals with qualified and independent auditors.",
    "pt": "Auditorias internas planejadas em intervalos regulares com auditores qualificados e independentes.",
    "fr": "Audits internes planifiés à intervalles réguliers avec des auditeurs qualifiés et indépendants.",
    "de": "In regelmäßigen Abständen geplante interne Audits durch qualifizierte und unabhängige Prüfer."
  },
  "Configurar un pipeline de telemetría y observabilidad continua con cálculo automatizado de drift métrico.": {
    "en": "Set up a continuous telemetry and observability pipeline with automated metric drift calculation.",
    "pt": "Configure um pipeline contínuo de telemetria e observabilidade com cálculo automatizado de desvio métrico.",
    "fr": "Mettez en place un pipeline continu de télémétrie et d’observabilité avec calcul automatisé de dérive métrique.",
    "de": "Richten Sie eine kontinuierliche Telemetrie- und Observability-Pipeline mit automatisierter metrischer Driftberechnung ein."
  },
  "Detectar degradaciones de rendimiento y fallos de comportamiento en tiempo real.": {
    "en": "Detect performance degradations and behavioral failures in real time.",
    "pt": "Detecte degradações de desempenho e falhas comportamentais em tempo real.",
    "fr": "Détectez les dégradations de performances et les échecs comportementaux en temps réel.",
    "de": "Erkennen Sie Leistungseinbußen und Verhaltensfehler in Echtzeit."
  },
  "Verificar la conformidad continua con ISO/IEC 42001 y los requisitos organizacionales.": {
    "en": "Verify ongoing compliance with ISO/IEC 42001 and organizational requirements.",
    "pt": "Verifique a conformidade contínua com a ISO/IEC 42001 e os requisitos organizacionais.",
    "fr": "Vérifier la conformité continue avec la norme ISO/IEC 42001 et les exigences organisationnelles.",
    "de": "Überprüfen Sie die fortlaufende Einhaltung von ISO/IEC 42001 und organisatorischen Anforderungen."
  },
  "Ejecutar un calendario anual de auditorías internas del AIMS y documentar no conformidades.": {
    "en": "Execute an annual calendar of AIMS internal audits and document nonconformities.",
    "pt": "Executar um calendário anual de auditorias internas da AIMS e documentar não conformidades.",
    "fr": "Exécuter un calendrier annuel des audits internes AIMS et documenter les non-conformités.",
    "de": "Führen Sie einen jährlichen Kalender interner AIMS-Audits durch und dokumentieren Sie Nichtkonformitäten."
  },
  "Revisión por la dirección": {
    "en": "Management review",
    "pt": "Revisão gerencial",
    "fr": "Revue de direction",
    "de": "Managementbewertung"
  },
  "Auditoría interna del AIMS": {
    "en": "AIMS internal audit",
    "pt": "Auditoria interna do AIMS",
    "fr": "Audit interne AIMS",
    "de": "Internes Audit von AIMS"
  },
  "Revisiones formales de la alta dirección sobre el estado del AIMS, métricas de incidentes y oportunidades de mejora.": {
    "en": "Formal senior management reviews of AIMS status, incident metrics, and improvement opportunities.",
    "pt": "Revisões formais da alta administração sobre o status do AIMS, métricas de incidentes e oportunidades de melhoria.",
    "fr": "Examens formels de la haute direction sur l'état de l'AIMS, les mesures des incidents et les opportunités d'amélioration.",
    "de": "Formelle Überprüfungen des AIMS-Status, der Vorfallkennzahlen und Verbesserungsmöglichkeiten durch die Geschäftsleitung."
  },
  "Asegurar la continua idoneidad, adecuación y eficacia del sistema de gestión de IA.": {
    "en": "Ensure the continued suitability, adequacy and effectiveness of the AI ​​management system.",
    "pt": "Garantir a contínua idoneidade, adequação e eficácia do sistema de gestão de IA.",
    "fr": "Assurer l’adéquation, l’adéquation et l’efficacité continues du système de gestion de l’IA.",
    "de": "Stellen Sie sicher, dass das KI-Managementsystem weiterhin geeignet, angemessen und wirksam ist."
  },
  "Examinar las actas de la Revisión por la Dirección con decisiones sobre cambios y asignación de recursos.": {
    "en": "Review Management Review minutes with decisions on changes and resource allocation.",
    "pt": "Revise as atas da Revisão Gerencial com decisões sobre mudanças e alocação de recursos.",
    "fr": "Examiner la direction Examiner les procès-verbaux avec les décisions sur les changements et l'allocation des ressources.",
    "de": "Überprüfen Sie die Management-Review-Protokolle mit Entscheidungen zu Änderungen und Ressourcenzuweisung."
  },
  "Procedimiento formal para investigar causa raíz de incidentes de IA (jailbreaks, alucinaciones) y aplicar remediación.": {
    "en": "Formal procedure to investigate root cause of AI incidents (jailbreaks, hallucinations) and apply remediation.",
    "pt": "Procedimento formal para investigar a causa raiz dos incidentes de IA (jailbreaks, alucinações) e aplicar remediação.",
    "fr": "Procédure formelle pour enquêter sur la cause profonde des incidents d’IA (jailbreaks, hallucinations) et appliquer des mesures correctives.",
    "de": "Formelles Verfahren zur Untersuchung der Grundursache von KI-Vorfällen (Jailbreaks, Halluzinationen) und zur Abhilfe."
  },
  "Revisar el registro de no conformidades de IA, análisis causa-raíz (5 Porqués/Ishikawa) y verificación de cierre.": {
    "en": "Review the AI ​​non-conformity log, root cause analysis (5 Whys/Ishikawa) and closure verification.",
    "pt": "Revise o log de não conformidades da IA, análise de causa raiz (5 Porquês/Ishikawa) e verificação de fechamento.",
    "fr": "Consultez le journal des non-conformités de l'IA, l'analyse des causes profondes (5 Pourquoi/Ishikawa) et la vérification de la clôture.",
    "de": "Überprüfen Sie das AI-Nichtkonformitätsprotokoll, die Ursachenanalyse (5 Whys/Ishikawa) und die Abschlussüberprüfung."
  },
  "Prevenir la recurrencia de fallos de seguridad y violaciones de políticas mediante mitigación estructural.": {
    "en": "Prevent the recurrence of security flaws and policy violations through structural mitigation.",
    "pt": "Prevenir a recorrência de falhas de segurança e violações de políticas através da mitigação estrutural.",
    "fr": "Prévenir la récurrence des failles de sécurité et des violations des politiques grâce à une atténuation structurelle.",
    "de": "Verhindern Sie das Wiederauftreten von Sicherheitslücken und Richtlinienverstößen durch strukturelle Abhilfemaßnahmen."
  },
  "Programar la reunión anual de Revisión por la Dirección y formalizar el informe de conclusiones.": {
    "en": "Schedule the annual Management Review meeting and formalize the report of conclusions.",
    "pt": "Agendar a reunião anual de Management Review e formalizar o relatório de conclusões.",
    "fr": "Planifier la réunion annuelle de revue de direction et formaliser le rapport de conclusions.",
    "de": "Planen Sie das jährliche Management-Review-Meeting und formalisieren Sie den Bericht mit den Schlussfolgerungen."
  },
  "No conformidad y acciones correctivas": {
    "en": "Non-conformity and corrective actions",
    "pt": "Não conformidade e ações corretivas",
    "fr": "Non-conformités et actions correctives",
    "de": "Nichtkonformität und Korrekturmaßnahmen"
  },
  "Mejora Continua (Improvement)": {
    "en": "Continuous Improvement (Improvement)",
    "pt": "Melhoria Contínua (Melhoria)",
    "fr": "Amélioration continue (Amélioration)",
    "de": "Kontinuierliche Verbesserung (Verbesserung)"
  },
  "Mejora continua del AIMS": {
    "en": "Continuous improvement of AIMS",
    "pt": "Melhoria contínua do AIMS",
    "fr": "Amélioration continue de l'AIMS",
    "de": "Kontinuierliche Verbesserung von AIMS"
  },
  "La organización debe determinar y seleccionar oportunidades de mejora e implementar las acciones necesarias para cumplir con los requisitos del AIMS y corregir no conformidades e incidentes de seguridad en IA.": {
    "en": "The organization must determine and select improvement opportunities and implement the necessary actions to comply with AIMS requirements and correct AI nonconformities and security incidents.",
    "pt": "A organização deve determinar e selecionar oportunidades de melhoria e implementar as ações necessárias para cumprir os requisitos do AIMS e corrigir não conformidades de IA e incidentes de segurança.",
    "fr": "L'organisation doit déterminer et sélectionner les opportunités d'amélioration et mettre en œuvre les actions nécessaires pour se conformer aux exigences AIMS et corriger les non-conformités IA et les incidents de sécurité.",
    "de": "Die Organisation muss Verbesserungsmöglichkeiten ermitteln und auswählen und die notwendigen Maßnahmen umsetzen, um die AIMS-Anforderungen zu erfüllen und KI-Nichtkonformitäten und Sicherheitsvorfälle zu korrigieren."
  },
  "Revisar iniciativas de mejora implementadas tras auditorías, post-mortems de incidentes o cambios regulatorios.": {
    "en": "Review improvement initiatives implemented after audits, incident post-mortems or regulatory changes.",
    "pt": "Revise as iniciativas de melhoria implementadas após auditorias, post-mortems de incidentes ou mudanças regulatórias.",
    "fr": "Examiner les initiatives d'amélioration mises en œuvre après des audits, des autopsies d'incidents ou des changements réglementaires.",
    "de": "Überprüfen Sie Verbesserungsinitiativen, die nach Audits, Obduktionen von Vorfällen oder regulatorischen Änderungen umgesetzt wurden."
  },
  "Adaptar permanentemente la postura de seguridad y gobernanza ante la evolución acelerada de la IA.": {
    "en": "Permanently adapt the security and governance posture in the face of the accelerated evolution of AI.",
    "pt": "Adaptar permanentemente a postura de segurança e governação face à evolução acelerada da IA.",
    "fr": "Adapter en permanence la posture de sécurité et de gouvernance face à l’évolution accélérée de l’IA.",
    "de": "Passen Sie den Sicherheits- und Governance-Status angesichts der beschleunigten Entwicklung der KI permanent an."
  },
  "Implementar un flujo de gestión de no conformidades con plazos estrictos de resolución y verificación.": {
    "en": "Implement a non-conformity management flow with strict resolution and verification deadlines.",
    "pt": "Implementar um fluxo de gestão de não conformidades com prazos rígidos de resolução e verificação.",
    "fr": "Mettre en place un flux de gestion des non-conformités avec des délais de résolution et de vérification stricts.",
    "de": "Implementieren Sie einen Ablauf für das Nichtkonformitätsmanagement mit strengen Lösungs- und Überprüfungsfristen."
  },
  "Evolución sistemática del sistema de gestión incorporando nuevas técnicas de defensa y lecciones aprendidas.": {
    "en": "Systematic evolution of the management system incorporating new defense techniques and lessons learned.",
    "pt": "Evolução sistemática do sistema de gestão incorporando novas técnicas de defesa e lições aprendidas.",
    "fr": "Evolution systématique du système de gestion intégrant de nouvelles techniques de défense et les enseignements tirés.",
    "de": "Systematische Weiterentwicklung des Managementsystems unter Einbeziehung neuer Verteidigungstechniken und gewonnener Erkenntnisse."
  },
  "Establecer un programa de benchmarking y actualización tecnológica para las defensas de IA.": {
    "en": "Establish a benchmarking and technological update program for AI defenses.",
    "pt": "Estabelecer um programa de benchmarking e atualização tecnológica para defesas de IA.",
    "fr": "Établir un programme d’analyse comparative et de mise à jour technologique pour les défenses IA.",
    "de": "Richten Sie ein Benchmarking- und Technologieaktualisierungsprogramm für KI-Abwehrmaßnahmen ein."
  },
  "Se debe definir y aprobar una política de IA por parte de la dirección.": {
    "en": "An AI policy must be defined and approved by management.",
    "pt": "Uma política de IA deve ser definida e aprovada pela administração.",
    "fr": "Une politique d’IA doit être définie et approuvée par la direction.",
    "de": "Eine KI-Richtlinie muss vom Management definiert und genehmigt werden."
  },
  "Verificar la existencia de un documento de política de IA formal, firmado por la alta dirección y comunicado a toda la empresa.": {
    "en": "Verify the existence of a formal AI policy document, signed by senior management and communicated to the entire company.",
    "pt": "Verifique a existência de um documento formal de política de IA, assinado pela alta administração e comunicado a toda a empresa.",
    "fr": "Vérifier l'existence d'un document formel de politique d'IA, signé par la haute direction et communiqué à l'ensemble de l'entreprise.",
    "de": "Überprüfen Sie die Existenz eines formellen KI-Richtliniendokuments, das von der Geschäftsleitung unterzeichnet und dem gesamten Unternehmen mitgeteilt wurde."
  },
  "Proveer dirección y apoyo de gestión para el desarrollo y uso de la IA de acuerdo con los requisitos del negocio.": {
    "en": "Provide direction and management support for the development and use of AI in accordance with business requirements.",
    "pt": "Fornecer orientação e suporte de gerenciamento para o desenvolvimento e uso de IA de acordo com os requisitos de negócios.",
    "fr": "Fournir un soutien à l’orientation et à la gestion pour le développement et l’utilisation de l’IA conformément aux exigences de l’entreprise.",
    "de": "Bereitstellung von Anweisungen und Managementunterstützung für die Entwicklung und Nutzung von KI gemäß den Geschäftsanforderungen."
  },
  "La organización debe establecer, implementar y mantener políticas para la IA que sean apropiadas para el propósito de la organización. Esto incluye alinear las políticas de IA con otras políticas organizacionales y asegurar la comunicación y revisión periódica de las directrices.": {
    "en": "The organization must establish, implement and maintain policies for AI that are appropriate for the organization's purpose. This includes aligning AI policies with other organizational policies and ensuring regular communication and review of guidelines.",
    "pt": "A organização deve estabelecer, implementar e manter políticas para IA que sejam apropriadas ao propósito da organização. Isto inclui o alinhamento das políticas de IA com outras políticas organizacionais e a garantia de comunicação e revisão regulares das diretrizes.",
    "fr": "L'organisation doit établir, mettre en œuvre et maintenir des politiques en matière d'IA adaptées à son objectif. Cela implique d’aligner les politiques d’IA sur les autres politiques organisationnelles et d’assurer une communication et une révision régulières des lignes directrices.",
    "de": "Die Organisation muss Richtlinien für KI festlegen, umsetzen und aufrechterhalten, die für den Zweck der Organisation geeignet sind. Dazu gehört die Abstimmung der KI-Richtlinien mit anderen Organisationsrichtlinien sowie die Sicherstellung einer regelmäßigen Kommunikation und Überprüfung der Richtlinien."
  },
  "Políticas Relacionadas con la IA (AI Policies)": {
    "en": "Policies Related to AI (AI Policies)",
    "pt": "Políticas relacionadas à IA (políticas de IA)",
    "fr": "Politiques liées à l’IA (Politiques d’IA)",
    "de": "Richtlinien im Zusammenhang mit KI (KI-Richtlinien)"
  },
  "Asegurar que la política de IA sea consistente con la política de seguridad de la información y la de privacidad.": {
    "en": "Ensure that the AI ​​policy is consistent with the information security and privacy policy.",
    "pt": "Garantir que a política de IA seja consistente com a política de segurança e privacidade da informação.",
    "fr": "Assurez-vous que la politique d'IA est cohérente avec la politique de sécurité des informations et de confidentialité.",
    "de": "Stellen Sie sicher, dass die KI-Richtlinie mit der Informationssicherheits- und Datenschutzrichtlinie übereinstimmt."
  },
  "Unificar el gobierno corporativo integrando la política de IA con la ISO 27001 (Seguridad) y ISO 27701 (Privacidad).": {
    "en": "Unify corporate governance by integrating the AI ​​policy with ISO 27001 (Security) and ISO 27701 (Privacy).",
    "pt": "Unifique a governança corporativa integrando a política de IA com a ISO 27001 (Segurança) e ISO 27701 (Privacidade).",
    "fr": "Unifiez la gouvernance d'entreprise en intégrant la politique d'IA avec les normes ISO 27001 (Sécurité) et ISO 27701 (Confidentialité).",
    "de": "Vereinheitlichen Sie die Unternehmensführung durch die Integration der KI-Richtlinie mit ISO 27001 (Sicherheit) und ISO 27701 (Datenschutz)."
  },
  "Evaluaciones anuales o tras cambios regulatorios relevantes de las políticas de IA.": {
    "en": "Annual evaluations or after relevant regulatory changes of AI policies.",
    "pt": "Avaliações anuais ou após alterações regulatórias relevantes das políticas de IA.",
    "fr": "Évaluations annuelles ou après des modifications réglementaires pertinentes des politiques en matière d'IA.",
    "de": "Jährliche Auswertungen oder nach relevanten regulatorischen Änderungen der KI-Richtlinien."
  },
  "Evitar contradicciones entre políticas organizacionales y consolidar la gobernanza corporativa.": {
    "en": "Avoid contradictions between organizational policies and consolidate corporate governance.",
    "pt": "Evitar contradições entre políticas organizacionais e consolidar a governança corporativa.",
    "fr": "Évitez les contradictions entre les politiques organisationnelles et consolidez la gouvernance d’entreprise.",
    "de": "Vermeiden Sie Widersprüche zwischen Organisationsrichtlinien und konsolidieren Sie die Unternehmensführung."
  },
  "Comprobar el historial de cambios y actas de revisión anual de las políticas de IA.": {
    "en": "Check the history of changes and annual review minutes of AI policies.",
    "pt": "Verifique o histórico de alterações e as atas de revisão anual das políticas de IA.",
    "fr": "Consultez l’historique des modifications et les procès-verbaux d’examen annuel des politiques d’IA.",
    "de": "Überprüfen Sie den Änderungsverlauf und die jährlichen Überprüfungsprotokolle der KI-Richtlinien."
  },
  "Establecer un ciclo de revisión semestral o anual de la política de IA con aprobación formal.": {
    "en": "Establish a semi-annual or annual review cycle of the AI ​​policy with formal approval.",
    "pt": "Estabeleça um ciclo de revisão semestral ou anual da política de IA com aprovação formal.",
    "fr": "Établir un cycle de révision semestrielle ou annuelle de la politique en matière d'IA avec approbation formelle.",
    "de": "Richten Sie einen halbjährlichen oder jährlichen Überprüfungszyklus der KI-Richtlinie mit formeller Genehmigung ein."
  },
  "Mantener vigentes las directrices operacionales ante nuevos vectores de riesgo y requerimientos legislativos.": {
    "en": "Keep operational guidelines current in the face of new risk vectors and legislative requirements.",
    "pt": "Manter atualizadas as diretrizes operacionais diante de novos vetores de risco e exigências legislativas.",
    "fr": "Maintenir les directives opérationnelles à jour face aux nouveaux vecteurs de risque et aux exigences législatives.",
    "de": "Halten Sie die Betriebsrichtlinien angesichts neuer Risikovektoren und gesetzlicher Anforderungen auf dem neuesten Stand."
  },
  "Redactar, aprobar y distribuir una política de IA que exprese claramente el compromiso de la organización con la gestión de riesgos y el uso ético.": {
    "en": "Draft, approve, and distribute an AI policy that clearly expresses the organization's commitment to risk management and ethical use.",
    "pt": "Elaborar, aprovar e distribuir uma política de IA que expresse claramente o compromisso da organização com a gestão de riscos e o uso ético.",
    "fr": "Rédigez, approuvez et distribuez une politique en matière d'IA qui exprime clairement l'engagement de l'organisation en matière de gestion des risques et d'utilisation éthique.",
    "de": "Entwerfen, genehmigen und verteilen Sie eine KI-Richtlinie, die das Engagement der Organisation für Risikomanagement und ethische Nutzung klar zum Ausdruck bringt."
  },
  "Alineación de Políticas de IA": {
    "en": "AI Policy Alignment",
    "pt": "Alinhamento de políticas de IA",
    "fr": "Alignement des politiques sur l’IA",
    "de": "Ausrichtung der KI-Richtlinien"
  },
  "Revisión periódica de la política de IA": {
    "en": "Periodic review of AI policy",
    "pt": "Revisão periódica da política de IA",
    "fr": "Examen périodique de la politique en matière d'IA",
    "de": "Regelmäßige Überprüfung der KI-Richtlinie"
  },
  "Revisar las políticas de privacidad y seguridad de la información para confirmar que las cláusulas de IA (como el uso de datos generativos) son coherentes y no rompen otras normativas.": {
    "en": "Review privacy and information security policies to confirm that AI clauses (such as the use of generative data) are consistent and do not violate other regulations.",
    "pt": "Revise as políticas de privacidade e segurança da informação para confirmar se as cláusulas de IA (como o uso de dados generativos) são consistentes e não violam outras regulamentações.",
    "fr": "Examinez les politiques de confidentialité et de sécurité des informations pour confirmer que les clauses d’IA (telles que l’utilisation de données génératives) sont cohérentes et ne violent pas d’autres réglementations.",
    "de": "Überprüfen Sie die Datenschutz- und Informationssicherheitsrichtlinien, um sicherzustellen, dass KI-Klauseln (z. B. die Verwendung generativer Daten) konsistent sind und nicht gegen andere Vorschriften verstoßen."
  },
  "Organización Interna (Internal Organization)": {
    "en": "Internal Organization",
    "pt": "Organização Interna",
    "fr": "Organisation interne",
    "de": "Interne Organisation"
  },
  "Documentar y asignar formalmente a personas específicas o comités la responsabilidad de las evaluaciones de impacto de IA y operaciones del ciclo de vida.": {
    "en": "Document and formally assign responsibility for AI impact assessments and lifecycle operations to specific individuals or committees.",
    "pt": "Documente e atribua formalmente a responsabilidade pelas avaliações de impacto da IA ​​e pelas operações do ciclo de vida a indivíduos ou comitês específicos.",
    "fr": "Documentez et attribuez officiellement la responsabilité des évaluations d’impact de l’IA et des opérations du cycle de vie à des personnes ou à des comités spécifiques.",
    "de": "Dokumentieren Sie die Verantwortung für KI-Folgenabschätzungen und Lebenszyklusoperationen und weisen Sie sie bestimmten Personen oder Ausschüssen offiziell zu."
  },
  "Asegurar la rendición de cuentas (accountability) para la operación segura, ética y transparente de la IA.": {
    "en": "Ensure accountability for the safe, ethical and transparent operation of AI.",
    "pt": "Garantir a responsabilização pela operação segura, ética e transparente da IA.",
    "fr": "Garantir la responsabilité du fonctionnement sûr, éthique et transparent de l’IA.",
    "de": "Gewährleistung der Rechenschaftspflicht für den sicheren, ethischen und transparenten Betrieb von KI."
  },
  "Los roles relacionados con los sistemas de IA deben estar explícitamente asignados y documentados.": {
    "en": "Roles related to AI systems must be explicitly assigned and documented.",
    "pt": "As funções relacionadas com os sistemas de IA devem ser explicitamente atribuídas e documentadas.",
    "fr": "Les rôles liés aux systèmes d'IA doivent être explicitement attribués et documentés.",
    "de": "Rollen im Zusammenhang mit KI-Systemen müssen explizit zugewiesen und dokumentiert werden."
  },
  "Buscar un organigrama o matriz RACI que incluya roles como 'Oficial de IA', 'Líder Técnico de IA', y 'Responsable de Gobernanza'.": {
    "en": "Find an org chart or RACI matrix that includes roles such as 'AI Officer', 'AI Technical Lead', and 'Governance Officer'.",
    "pt": "Encontre um organograma ou matriz RACI que inclua funções como 'Oficial de IA', 'Líder Técnico de IA' e 'Gerente de Governança'.",
    "fr": "Recherchez un organigramme ou une matrice RACI qui comprend des rôles tels que « Responsable IA », « Responsable technique IA » et « Responsable de la gouvernance ».",
    "de": "Suchen Sie nach einem Organigramm oder einer RACI-Matrix, die Rollen wie „KI-Beauftragter“, „KI-technischer Leiter“ und „Governance-Manager“ enthält."
  },
  "Separación clara entre los equipos de desarrollo/entrenamiento y los equipos de validación independiente, QA y auditoría.": {
    "en": "Clear separation between development/training teams and independent validation, QA and audit teams.",
    "pt": "Separação clara entre equipes de desenvolvimento/treinamento e equipes independentes de validação, controle de qualidade e auditoria.",
    "fr": "Séparation claire entre les équipes de développement/formation et les équipes indépendantes de validation, d’assurance qualité et d’audit.",
    "de": "Klare Trennung zwischen Entwicklungs-/Schulungsteams und unabhängigen Validierungs-, Qualitätssicherungs- und Auditteams."
  },
  "Canales de escalamiento ético y de seguridad": {
    "en": "Ethical and security escalation channels",
    "pt": "Canais de escalonamento ético e de segurança",
    "fr": "Canaux d’escalade éthique et de sécurité",
    "de": "Eskalationskanäle für Ethik und Sicherheit"
  },
  "Segregación de funciones en IA": {
    "en": "Segregation of duties in AI",
    "pt": "Segregação de funções em IA",
    "fr": "Séparation des tâches dans l'IA",
    "de": "Aufgabentrennung in der KI"
  },
  "Roles y responsabilidades de IA": {
    "en": "AI Roles and Responsibilities",
    "pt": "Funções e responsabilidades da IA",
    "fr": "Rôles et responsabilités de l'IA",
    "de": "KI-Rollen und Verantwortlichkeiten"
  },
  "Roles y responsabilidades de la IA deben estar claramente definidos y asignados. Esto asegura que haya propiedad sobre los riesgos y controles de la IA a lo largo del ciclo de vida del sistema de IA, evitando conflictos de interés mediante segregación de funciones.": {
    "en": "AI roles and responsibilities must be clearly defined and assigned. This ensures there is ownership over AI risks and controls throughout the lifecycle of the AI ​​system, avoiding conflicts of interest through segregation of duties.",
    "pt": "As funções e responsabilidades da IA ​​devem ser claramente definidas e atribuídas. Isto garante que haja propriedade sobre os riscos e controlos da IA ​​ao longo de todo o ciclo de vida do sistema de IA, evitando conflitos de interesses através da segregação de funções.",
    "fr": "Les rôles et responsabilités de l’IA doivent être clairement définis et attribués. Cela garantit la propriété des risques et des contrôles de l'IA tout au long du cycle de vie du système d'IA, évitant ainsi les conflits d'intérêts grâce à la séparation des tâches.",
    "de": "KI-Rollen und Verantwortlichkeiten müssen klar definiert und zugewiesen werden. Dadurch wird sichergestellt, dass während des gesamten Lebenszyklus des KI-Systems die Kontrolle über KI-Risiken und -Kontrollen gewährleistet ist und Interessenkonflikte durch Aufgabentrennung vermieden werden."
  },
  "Prevenir sesgos de autoevaluación y garantizar una supervisión objetiva de la seguridad y calidad.": {
    "en": "Prevent self-assessment biases and ensure objective supervision of safety and quality.",
    "pt": "Evite preconceitos de autoavaliação e garanta uma supervisão objetiva da segurança e da qualidade.",
    "fr": "Prévenir les biais d’auto-évaluation et assurer une supervision objective de la sécurité et de la qualité.",
    "de": "Vermeiden Sie Vorurteile bei der Selbsteinschätzung und sorgen Sie für eine objektive Überwachung von Sicherheit und Qualität."
  },
  "Verificar que las evaluaciones de seguridad y validación de sesgos sean aprobadas por personal independiente al equipo de desarrollo.": {
    "en": "Verify that security and bias validation assessments are approved by personnel independent of the development team.",
    "pt": "Verifique se as avaliações de validação de segurança e polarização são aprovadas por pessoal independente da equipe de desenvolvimento.",
    "fr": "Vérifiez que les évaluations de validation de sécurité et de biais sont approuvées par du personnel indépendant de l’équipe de développement.",
    "de": "Stellen Sie sicher, dass Sicherheits- und Bias-Validierungsbewertungen von Mitarbeitern genehmigt werden, die vom Entwicklungsteam unabhängig sind."
  },
  "Establecer un flujo de aprobación donde un equipo de QA/Seguridad independiente autorice el paso a producción.": {
    "en": "Establish an approval flow where an independent QA/Security team authorizes the move to production.",
    "pt": "Estabeleça um fluxo de aprovação onde uma equipe independente de controle de qualidade/segurança autorize a mudança para produção.",
    "fr": "Établissez un processus d'approbation dans lequel une équipe indépendante d'assurance qualité et de sécurité autorise le passage à la production.",
    "de": "Richten Sie einen Genehmigungsablauf ein, bei dem ein unabhängiges QA-/Sicherheitsteam den Übergang zur Produktion genehmigt."
  },
  "Revisar planes de formación técnica y certificaciones de los ingenieros de IA.": {
    "en": "Review technical training plans and certifications for AI engineers.",
    "pt": "Revise planos de treinamento técnico e certificações para engenheiros de IA.",
    "fr": "Examinez les plans de formation technique et les certifications pour les ingénieurs en IA.",
    "de": "Überprüfen Sie technische Schulungspläne und Zertifizierungen für KI-Ingenieure."
  },
  "Comprobar la existencia y divulgación de un canal de denuncias o buzón de escalamiento ético.": {
    "en": "Check the existence and dissemination of a complaints channel or ethical escalation mailbox.",
    "pt": "Verificar a existência e divulgação de canal de reclamações ou caixa de correio de encaminhamento ético.",
    "fr": "Vérifiez l’existence et la diffusion d’un canal de réclamation ou d’une boîte aux lettres d’escalade éthique.",
    "de": "Überprüfen Sie die Existenz und Verbreitung eines Beschwerdekanals oder einer ethischen Eskalationsmailbox."
  },
  "Mecanismo confidencial para que empleados y usuarios reporten incidentes, sesgos o comportamientos anómalos de la IA.": {
    "en": "Confidential mechanism for employees and users to report AI incidents, biases or anomalous behavior.",
    "pt": "Mecanismo confidencial para funcionários e usuários relatarem incidentes, preconceitos ou comportamento anômalo de IA.",
    "fr": "Mécanisme confidentiel permettant aux employés et aux utilisateurs de signaler les incidents, les préjugés ou les comportements anormaux liés à l'IA.",
    "de": "Vertraulicher Mechanismus für Mitarbeiter und Benutzer, um KI-Vorfälle, Vorurteile oder anormales Verhalten zu melden."
  },
  "Habilitar un canal confidencial de reporte ético con protocolo de respuesta rápida garantizada.": {
    "en": "Enable a confidential ethical reporting channel with a guaranteed rapid response protocol.",
    "pt": "Habilite um canal de denúncia ética confidencial com um protocolo de resposta rápida garantido.",
    "fr": "Activez un canal de signalement éthique et confidentiel avec un protocole de réponse rapide garanti.",
    "de": "Ermöglichen Sie einen vertraulichen ethischen Meldekanal mit einem garantierten Schnellreaktionsprotokoll."
  },
  "Competencia técnica especializada en arquitecturas LLM, RAG y seguridad defensiva en IA.": {
    "en": "Specialized technical competence in LLM, RAG architectures and defensive security in AI.",
    "pt": "Competência técnica especializada em LLM, arquiteturas RAG e segurança defensiva em IA.",
    "fr": "Compétence technique spécialisée en LLM, architectures RAG et sécurité défensive en IA.",
    "de": "Spezialisierte technische Kompetenz in LLM, RAG-Architekturen und defensiver Sicherheit in der KI."
  },
  "Asegurar que el equipo tenga los conocimientos requeridos para mitigar riesgos avanzados de IA.": {
    "en": "Ensure the team has the knowledge required to mitigate advanced AI risks.",
    "pt": "Certifique-se de que a equipe tenha o conhecimento necessário para mitigar os riscos de IA avançada.",
    "fr": "Assurez-vous que l’équipe possède les connaissances nécessaires pour atténuer les risques avancés liés à l’IA.",
    "de": "Stellen Sie sicher, dass das Team über das erforderliche Wissen verfügt, um fortgeschrittene KI-Risiken zu mindern."
  },
  "Permitir la detección temprana de riesgos graves sin temor a represalias.": {
    "en": "Allow early detection of serious risks without fear of retaliation.",
    "pt": "Permitir a detecção precoce de riscos graves sem medo de retaliação.",
    "fr": "Permettre une détection précoce des risques graves sans crainte de représailles.",
    "de": "Ermöglichen Sie die frühzeitige Erkennung schwerwiegender Risiken, ohne Angst vor Vergeltungsmaßnahmen haben zu müssen."
  },
  "Recursos para Sistemas de IA (Resources for AI Systems)": {
    "en": "Resources for AI Systems",
    "pt": "Recursos para sistemas de IA",
    "fr": "Ressources pour les systèmes d'IA",
    "de": "Ressourcen für KI-Systeme"
  },
  "Recursos humanos y capacitación especializada": {
    "en": "Human resources and specialized training",
    "pt": "Recursos humanos e formação especializada",
    "fr": "Ressources humaines et formations spécialisées",
    "de": "Personalwesen und Fachausbildung"
  },
  "Capacitar formalmente al equipo en OWASP Top 10 for LLM e ingeniería de seguridad en IA.": {
    "en": "Formally train the team on OWASP Top 10 for LLM and AI security engineering.",
    "pt": "Treine formalmente a equipe no OWASP Top 10 para LLM e engenharia de segurança de IA.",
    "fr": "Former formellement l'équipe sur le Top 10 OWASP pour l'ingénierie de sécurité LLM et IA.",
    "de": "Schulen Sie das Team offiziell zu den OWASP Top 10 für LLM und KI-Sicherheitstechnik."
  },
  "Infraestructura y herramientas de IA": {
    "en": "AI infrastructure and tools",
    "pt": "Infraestrutura e ferramentas de IA",
    "fr": "Infrastructure et outils d'IA",
    "de": "KI-Infrastruktur und -Tools"
  },
  "Ambientes de desarrollo, experimentación y producción aislados con plataformas de MLOps auditadas.": {
    "en": "Isolated development, experimentation and production environments with audited MLOps platforms.",
    "pt": "Ambientes isolados de desenvolvimento, experimentação e produção com plataformas MLOps auditadas.",
    "fr": "Environnements de développement, d'expérimentation et de production isolés avec des plateformes MLOps auditées.",
    "de": "Isolierte Entwicklungs-, Experimentier- und Produktionsumgebungen mit geprüften MLOps-Plattformen."
  },
  "Comprobar el cifrado en reposo (AES-256) y en tránsito (TLS 1.3) en buckets y vector databases.": {
    "en": "Check encryption at rest (AES-256) and in transit (TLS 1.3) on buckets and vector databases.",
    "pt": "Verifique a criptografia em repouso (AES-256) e em trânsito (TLS 1.3) em buckets e bancos de dados vetoriais.",
    "fr": "Vérifiez le chiffrement au repos (AES-256) et en transit (TLS 1.3) sur les buckets et les bases de données vectorielles.",
    "de": "Überprüfen Sie die Verschlüsselung im Ruhezustand (AES-256) und während der Übertragung (TLS 1.3) in Buckets und Vektordatenbanken."
  },
  "La organización debe determinar y proporcionar los recursos necesarios para el establecimiento, implementación, mantenimiento y mejora continua del sistema de gestión de IA, garantizando entornos seguros y herramientas auditadas.": {
    "en": "The organization must determine and provide the necessary resources for the establishment, implementation, maintenance and continuous improvement of the AI ​​management system, guaranteeing secure environments and audited tools.",
    "pt": "A organização deve determinar e fornecer os recursos necessários para o estabelecimento, implementação, manutenção e melhoria contínua do sistema de gestão de IA, garantindo ambientes seguros e ferramentas auditadas.",
    "fr": "L'organisation doit déterminer et fournir les ressources nécessaires à l'établissement, à la mise en œuvre, à la maintenance et à l'amélioration continue du système de gestion de l'IA, en garantissant des environnements sécurisés et des outils audités.",
    "de": "Die Organisation muss die notwendigen Ressourcen für die Einrichtung, Implementierung, Wartung und kontinuierliche Verbesserung des KI-Managementsystems ermitteln und bereitstellen und dabei sichere Umgebungen und geprüfte Tools gewährleisten."
  },
  "Gestión de recursos de datos": {
    "en": "Data resource management",
    "pt": "Gerenciamento de recursos de dados",
    "fr": "Gestion des ressources de données",
    "de": "Datenressourcenmanagement"
  },
  "Evaluación de Impacto de los Sistemas de IA (AI System Impact Assessment)": {
    "en": "AI System Impact Assessment",
    "pt": "Avaliação de impacto do sistema de IA",
    "fr": "Évaluation de l'impact du système d'IA",
    "de": "Folgenabschätzung für KI-Systeme"
  },
  "Metodología de Evaluación de Impacto de IA (AIIA)": {
    "en": "AI Impact Assessment (AIIA) Methodology",
    "pt": "Metodologia de Avaliação de Impacto de IA (AIIA)",
    "fr": "Méthodologie d’évaluation de l’impact de l’IA (AIIA)",
    "de": "Methodik zur KI-Folgenabschätzung (AIIA)."
  },
  "Almacenamiento seguro, escalable y gobernado para datasets de entrenamiento, validación y vector databases.": {
    "en": "Secure, scalable, and governed storage for training datasets, validation, and vector databases.",
    "pt": "Armazenamento seguro, escalonável e controlado para conjuntos de dados de treinamento, validação e bancos de dados vetoriais.",
    "fr": "Stockage sécurisé, évolutif et gouverné pour les ensembles de données de formation, la validation et les bases de données vectorielles.",
    "de": "Sicherer, skalierbarer und kontrollierter Speicher für Trainingsdatensätze, Validierung und Vektordatenbanken."
  },
  "Garantizar la disponibilidad, confidencialidad e integridad de los corpus de datos de la IA.": {
    "en": "Ensure the availability, confidentiality and integrity of AI data corpuses.",
    "pt": "Garantir a disponibilidade, confidencialidade e integridade dos corpus de dados de IA.",
    "fr": "Assurer la disponibilité, la confidentialité et l’intégrité des corpus de données d’IA.",
    "de": "Stellen Sie die Verfügbarkeit, Vertraulichkeit und Integrität von KI-Datenbeständen sicher."
  },
  "Auditar la segregación de red entre clusters de entrenamiento, bases vectoriales y ambientes de inferencia.": {
    "en": "Audit network segregation between training clusters, vector bases and inference environments.",
    "pt": "Audite a segregação da rede entre clusters de treinamento, bases de vetores e ambientes de inferência.",
    "fr": "Auditez la ségrégation du réseau entre les clusters de formation, les bases vectorielles et les environnements d'inférence.",
    "de": "Überprüfen Sie die Netzwerktrennung zwischen Trainingsclustern, Vektorbasen und Inferenzumgebungen."
  },
  "Aislar en VPCs privadas los componentes de IA y desplegar herramientas de MLOps con RBAC estricto.": {
    "en": "Isolate AI components in private VPCs and deploy MLOps tools with strict RBAC.",
    "pt": "Isole componentes de IA em VPCs privadas e implante ferramentas MLOps com RBAC rigoroso.",
    "fr": "Isolez les composants IA dans des VPC privés et déployez des outils MLOps avec un RBAC strict.",
    "de": "Isolieren Sie KI-Komponenten in privaten VPCs und stellen Sie MLOps-Tools mit striktem RBAC bereit."
  },
  "Evitar fugas de datos y fallos operacionales mediante infraestructura hardened y segregada.": {
    "en": "Avoid data leaks and operational failures through hardened and segregated infrastructure.",
    "pt": "Evite vazamentos de dados e falhas operacionais por meio de infraestrutura reforçada e segregada.",
    "fr": "Évitez les fuites de données et les pannes opérationnelles grâce à une infrastructure renforcée et séparée.",
    "de": "Vermeiden Sie Datenlecks und Betriebsausfälle durch eine gehärtete und getrennte Infrastruktur."
  },
  "Realizar evaluaciones de impacto de la IA para identificar cómo los sistemas pueden afectar a grupos vulnerables, individuos y la sociedad en general. Deben existir procesos documentados para registrar estos impactos antes de la implementación.": {
    "en": "Conduct AI impact assessments to identify how systems may affect vulnerable groups, individuals and society at large. Documented processes must be in place to record these impacts prior to implementation.",
    "pt": "Realizar avaliações de impacto da IA ​​para identificar como os sistemas podem afetar grupos vulneráveis, indivíduos e a sociedade em geral. Devem existir processos documentados para registar estes impactos antes da implementação.",
    "fr": "Mener des évaluations d’impact de l’IA pour identifier la manière dont les systèmes peuvent affecter les groupes vulnérables, les individus et la société dans son ensemble. Des processus documentés doivent être en place pour enregistrer ces impacts avant la mise en œuvre.",
    "de": "Führen Sie KI-Folgenabschätzungen durch, um zu ermitteln, wie sich Systeme auf gefährdete Gruppen, Einzelpersonen und die Gesellschaft insgesamt auswirken können. Es müssen dokumentierte Prozesse vorhanden sein, um diese Auswirkungen vor der Implementierung zu erfassen."
  },
  "Configurar cifrado con claves gestionadas por el cliente (CMEK) y control de acceso granular a los almacenes de datos.": {
    "en": "Configure customer managed key (CMEK) encryption and granular access control to data stores.",
    "pt": "Configure a criptografia de chave gerenciada pelo cliente (CMEK) e o controle de acesso granular aos armazenamentos de dados.",
    "fr": "Configurez le chiffrement par clé gérée par le client (CMEK) et le contrôle d'accès granulaire aux magasins de données.",
    "de": "Konfigurieren Sie die CMEK-Verschlüsselung (Customer Managed Key) und die detaillierte Zugriffskontrolle auf Datenspeicher."
  },
  "Identificar impactos negativos en derechos humanos, equidad, sesgos sistémicos o impactos ambientales.": {
    "en": "Identify negative impacts on human rights, equity, systemic biases or environmental impacts.",
    "pt": "Identificar impactos negativos sobre os direitos humanos, a equidade, os preconceitos sistémicos ou os impactos ambientais.",
    "fr": "Identifiez les impacts négatifs sur les droits de l’homme, l’équité, les préjugés systémiques ou les impacts environnementaux.",
    "de": "Identifizieren Sie negative Auswirkungen auf Menschenrechte, Gerechtigkeit, systemische Vorurteile oder Auswirkungen auf die Umwelt."
  },
  "Todo sistema de IA debe someterse a una evaluación de impacto antes de su despliegue.": {
    "en": "Every AI system must undergo an impact assessment before deployment.",
    "pt": "Todo sistema de IA deve passar por uma avaliação de impacto antes da implantação.",
    "fr": "Chaque système d’IA doit faire l’objet d’une évaluation d’impact avant son déploiement.",
    "de": "Jedes KI-System muss vor dem Einsatz einer Folgenabschätzung unterzogen werden."
  },
  "Exigir el registro documental de una Evaluación de Impacto de IA (AIIA) firmada para el sistema evaluado.": {
    "en": "Require the documentary record of a signed AI Impact Assessment (AIIA) for the evaluated system.",
    "pt": "Exigir o registro documental de uma Avaliação de Impacto de IA (AIIA) assinada para o sistema avaliado.",
    "fr": "Exiger le dossier documentaire d’une évaluation d’impact de l’IA (AIIA) signée pour le système évalué.",
    "de": "Fordern Sie die Dokumentation einer unterzeichneten KI-Folgenabschätzung (AIIA) für das bewertete System an."
  },
  "Ciclo de Vida del Sistema de IA (AI System Lifecycle)": {
    "en": "AI System Lifecycle",
    "pt": "Ciclo de vida do sistema de IA",
    "fr": "Cycle de vie du système d'IA",
    "de": "Lebenszyklus des KI-Systems"
  },
  "Mantener la vigencia de la evaluación de impacto ante la evolución dinámica del sistema de IA.": {
    "en": "Maintain the validity of the impact evaluation in the face of the dynamic evolution of the AI ​​system.",
    "pt": "Manter a validade da avaliação de impacto face à evolução dinâmica do sistema de IA.",
    "fr": "Maintenir la validité de l’évaluation d’impact face à l’évolution dynamique du système d’IA.",
    "de": "Behalten Sie die Gültigkeit der Wirkungsbewertung angesichts der dynamischen Entwicklung des KI-Systems bei."
  },
  "Prevenir la discriminación arbitraria y asegurar la equidad en grupos vulnerables.": {
    "en": "Prevent arbitrary discrimination and ensure equity in vulnerable groups.",
    "pt": "Prevenir a discriminação arbitrária e garantir a equidade nos grupos vulneráveis.",
    "fr": "Prévenir la discrimination arbitraire et garantir l’équité au sein des groupes vulnérables.",
    "de": "Verhindern Sie willkürliche Diskriminierung und sorgen Sie für Gerechtigkeit in schutzbedürftigen Gruppen."
  },
  "Evaluación de impacto en individuos y grupos protegidos": {
    "en": "Impact assessment on protected individuals and groups",
    "pt": "Avaliação de impacto em indivíduos e grupos protegidos",
    "fr": "Évaluation d’impact sur les individus et groupes protégés",
    "de": "Folgenabschätzung für geschützte Einzelpersonen und Gruppen"
  },
  "Comprobar fechas de revisión del AIIA y triggers documentados para re-evaluación.": {
    "en": "Check AIIA review dates and documented triggers for re-evaluation.",
    "pt": "Verifique as datas de revisão da AIIA e os gatilhos documentados para reavaliação.",
    "fr": "Vérifiez les dates d’examen de l’AIIA et les déclencheurs documentés pour la réévaluation.",
    "de": "Überprüfen Sie die AIIA-Überprüfungstermine und dokumentierten Auslöser für eine Neubewertung."
  },
  "Identificación activa de sesgos algorítmicos o discriminación potencial en modelos de decisión automatizada.": {
    "en": "Active identification of algorithmic biases or potential discrimination in automated decision models.",
    "pt": "Identificação ativa de vieses algorítmicos ou discriminação potencial em modelos de decisão automatizados.",
    "fr": "Identification active des biais algorithmiques ou des discriminations potentielles dans les modèles de décision automatisés.",
    "de": "Aktive Identifizierung algorithmischer Verzerrungen oder potenzieller Diskriminierung in automatisierten Entscheidungsmodellen."
  },
  "Vincular el pipeline de CI/CD para que cualquier cambio mayor de versión dispare la revisión del AIIA.": {
    "en": "Link the CI/CD pipeline so that any major version change triggers the AIIA review.",
    "pt": "Vincule o pipeline de CI/CD para que qualquer alteração importante na versão acione a revisão da AIIA.",
    "fr": "Liez le pipeline CI/CD afin que tout changement de version majeur déclenche la révision AIIA.",
    "de": "Verknüpfen Sie die CI/CD-Pipeline, sodass jede größere Versionsänderung die AIIA-Überprüfung auslöst."
  },
  "Revisar métricas de paridad estadística, igualdad de oportunidades o tasa de falsos positivos desagregada por subgrupos.": {
    "en": "Review metrics of statistical parity, equality of opportunity or false positive rate disaggregated by subgroups.",
    "pt": "Revise as métricas de paridade estatística, igualdade de oportunidades ou taxa de falsos positivos desagregadas por subgrupos.",
    "fr": "Examinez les mesures de parité statistique, d’égalité des chances ou de taux de faux positifs, ventilées par sous-groupes.",
    "de": "Überprüfen Sie Kennzahlen zur statistischen Parität, Chancengleichheit oder Falsch-Positiv-Rate, aufgeschlüsselt nach Untergruppen."
  },
  "Ejecutar pruebas de equidad algorítmica utilizando herramientas como Fairlearn o AIF360.": {
    "en": "Run algorithmic fairness tests using tools such as Fairlearn or AIF360.",
    "pt": "Execute testes de justiça algorítmica usando ferramentas como Fairlearn ou AIF360.",
    "fr": "Exécutez des tests d'équité algorithmiques à l'aide d'outils tels que Fairlearn ou AIF360.",
    "de": "Führen Sie algorithmische Fairnesstests mit Tools wie Fairlearn oder AIF360 durch."
  },
  "Re-evaluación del impacto ante cambios sustanciales en el modelo, datos o contexto operativo.": {
    "en": "Re-evaluation of the impact of substantial changes in the model, data or operational context.",
    "pt": "Reavaliação do impacto de mudanças substanciais no modelo, nos dados ou no contexto operacional.",
    "fr": "Réévaluation de l’impact de changements substantiels dans le modèle, les données ou le contexte opérationnel.",
    "de": "Neubewertung der Auswirkungen wesentlicher Änderungen im Modell, in den Daten oder im Betriebskontext."
  },
  "Evaluación de impacto a lo largo del ciclo de vida": {
    "en": "Impact assessment throughout the life cycle",
    "pt": "Avaliação de impacto ao longo do ciclo de vida",
    "fr": "Analyse d’impact tout au long du cycle de vie",
    "de": "Folgenabschätzung während des gesamten Lebenszyklus"
  },
  "Documentación formal de especificaciones técnicas, requisitos de rendimiento, límites operacionales y casos de uso prohibidos.": {
    "en": "Formal documentation of technical specifications, performance requirements, operational limits and prohibited use cases.",
    "pt": "Documentação formal de especificações técnicas, requisitos de desempenho, limites operacionais e casos de uso proibidos.",
    "fr": "Documentation formelle des spécifications techniques, des exigences de performances, des limites opérationnelles et des cas d'utilisation interdits.",
    "de": "Formelle Dokumentation technischer Spezifikationen, Leistungsanforderungen, Betriebsgrenzen und verbotener Anwendungsfälle."
  },
  "Implementar un proceso de evaluación obligatorio en la fase de concepción de proyectos de IA similar a una Evaluación de Impacto de Privacidad (PIA).": {
    "en": "Implement a mandatory evaluation process in the conception phase of AI projects similar to a Privacy Impact Assessment (PIA).",
    "pt": "Implementar um processo de avaliação obrigatório na fase de concepção de projetos de IA semelhante a uma Avaliação de Impacto na Privacidade (PIA).",
    "fr": "Mettre en œuvre un processus d'évaluation obligatoire dans la phase de conception des projets d'IA similaire à une évaluation des facteurs relatifs à la vie privée (PIA).",
    "de": "Implementieren Sie einen obligatorischen Bewertungsprozess in der Konzeptionsphase von KI-Projekten, ähnlich einer Datenschutz-Folgenabschätzung (PIA)."
  },
  "Establecer criterios de aceptación claros para prevenir desvíos funcionales o riesgos de seguridad.": {
    "en": "Establish clear acceptance criteria to prevent functional deviations or security risks.",
    "pt": "Estabeleça critérios de aceitação claros para evitar desvios funcionais ou riscos de segurança.",
    "fr": "Établissez des critères d’acceptation clairs pour éviter les écarts fonctionnels ou les risques de sécurité.",
    "de": "Legen Sie klare Akzeptanzkriterien fest, um Funktionsabweichungen oder Sicherheitsrisiken vorzubeugen."
  },
  "Revisar el documento de especificación de arquitectura y requisitos de diseño del modelo.": {
    "en": "Review the architecture specification document and model design requirements.",
    "pt": "Revise o documento de especificação da arquitetura e os requisitos de design do modelo.",
    "fr": "Examinez le document de spécification de l'architecture et les exigences de conception du modèle.",
    "de": "Überprüfen Sie das Architekturspezifikationsdokument und die Modelldesignanforderungen."
  },
  "Revisar informes de pruebas adversariales (red teaming), benchmarks de robustez y matriz de confusión.": {
    "en": "Review adversarial testing reports (red teaming), robustness benchmarks and confusion matrix.",
    "pt": "Revise relatórios de testes adversários (red teaming), benchmarks de robustez e matriz de confusão.",
    "fr": "Examiner les rapports de tests contradictoires (équipe rouge), les tests de robustesse et la matrice de confusion.",
    "de": "Überprüfen Sie kontradiktorische Testberichte (Red Teaming), Robustheits-Benchmarks und Verwirrungsmatrix."
  },
  "Formalizar el documento de especificación técnica de IA detallando límites operativos y requisitos de precisión.": {
    "en": "Formalize the AI ​​technical specification document detailing operational limits and accuracy requirements.",
    "pt": "Formalize o documento de especificação técnica de IA detalhando limites operacionais e requisitos de precisão.",
    "fr": "Formaliser le document de spécification technique IA détaillant les limites opérationnelles et les exigences de précision.",
    "de": "Formulieren Sie das technische Spezifikationsdokument für KI mit detaillierten Angaben zu Betriebsgrenzen und Genauigkeitsanforderungen."
  },
  "Pruebas rigurosas de precisión, sesgo, robustez adversarial y calibración antes del paso a producción.": {
    "en": "Rigorous accuracy, bias, adversarial robustness, and calibration testing prior to production.",
    "pt": "Precisão rigorosa, tendência, robustez adversária e testes de calibração antes da produção.",
    "fr": "Précision rigoureuse, biais, robustesse contradictoire et tests d'étalonnage avant la production.",
    "de": "Strenge Genauigkeits-, Voreingenommenheits-, Widerstands- und Kalibrierungstests vor der Produktion."
  },
  "Asegurar que el modelo funciona según lo previsto y no es vulnerable a ataques de inyección o evasión.": {
    "en": "Ensure that the model works as intended and is not vulnerable to injection or evasion attacks.",
    "pt": "Certifique-se de que o modelo funcione conforme pretendido e não seja vulnerável a ataques de injeção ou evasão.",
    "fr": "Assurez-vous que le modèle fonctionne comme prévu et n’est pas vulnérable aux attaques par injection ou par évasion.",
    "de": "Stellen Sie sicher, dass das Modell wie vorgesehen funktioniert und nicht anfällig für Injektions- oder Umgehungsangriffe ist."
  },
  "Definición de requisitos y especificación de diseño": {
    "en": "Definition of requirements and design specification",
    "pt": "Definição de requisitos e especificação de projeto",
    "fr": "Définition des exigences et spécifications de conception",
    "de": "Definition der Anforderungen und Designspezifikation"
  },
  "Verificación y validación de modelos": {
    "en": "Model verification and validation",
    "pt": "Verificação e validação do modelo",
    "fr": "Vérification et validation du modèle",
    "de": "Modellverifizierung und -validierung"
  },
  "Definición y aplicación de directrices de seguridad y calidad en todas las fases: concepción, diseño, desarrollo, pruebas, despliegue, operación, monitoreo y retiro (decommissioning) de modelos.": {
    "en": "Definition and application of safety and quality guidelines in all phases: conception, design, development, testing, deployment, operation, monitoring and retirement (decommissioning) of models.",
    "pt": "Definição e aplicação de diretrizes de segurança e qualidade em todas as fases: concepção, projeto, desenvolvimento, testes, implantação, operação, monitoramento e desativação (descomissionamento) de modelos.",
    "fr": "Définition et application des directives de sécurité et de qualité dans toutes les phases : conception, design, développement, tests, déploiement, exploitation, suivi et retrait (démantèlement) des modèles.",
    "de": "Definition und Anwendung von Sicherheits- und Qualitätsrichtlinien in allen Phasen: Konzeption, Design, Entwicklung, Test, Einsatz, Betrieb, Überwachung und Stilllegung (Stilllegung) von Modellen."
  },
  "Integrar pruebas unitarias de ML y suites de evaluación adversarial automatizada antes de la autorización de release.": {
    "en": "Integrate ML unit tests and automated adversarial evaluation suites before release authorization.",
    "pt": "Integre testes unitários de ML e suítes automatizadas de avaliação adversária antes da autorização de lançamento.",
    "fr": "Intégrez les tests unitaires ML et les suites d’évaluations contradictoires automatisées avant l’autorisation de publication.",
    "de": "Integrieren Sie ML-Komponententests und automatisierte gegnerische Evaluierungssuiten vor der Release-Autorisierung."
  },
  "Despliegue y transición operacional": {
    "en": "Deployment and operational transition",
    "pt": "Implantação e transição operacional",
    "fr": "Déploiement et transition opérationnelle",
    "de": "Bereitstellung und Betriebsübergang"
  },
  "Procedimientos seguros de release (canary deployments, blue/green) con planes de rollback inmediato.": {
    "en": "Secure release procedures (canary deployments, blue/green) with immediate rollback plans.",
    "pt": "Procedimentos de liberação seguros (implantações canário, azul/verde) com planos de reversão imediata.",
    "fr": "Procédures de publication sécurisées (déploiements Canary, bleu/vert) avec plans de restauration immédiats.",
    "de": "Sichere Release-Verfahren (Canary-Bereitstellungen, blau/grün) mit sofortigen Rollback-Plänen."
  },
  "Documentar y ejecutar un protocolo de desmantelamiento seguro con destrucción criptográfica de pesos obsoletos.": {
    "en": "Document and execute a secure takedown protocol with cryptographic destruction of obsolete pesos.",
    "pt": "Documente e execute um protocolo de remoção seguro com destruição criptográfica de pesos obsoletos.",
    "fr": "Documentez et exécutez un protocole de retrait sécurisé avec destruction cryptographique des pesos obsolètes.",
    "de": "Dokumentieren und führen Sie ein sicheres Deaktivierungsprotokoll mit kryptografischer Vernichtung veralteter Pesos durch."
  },
  "Procedimientos seguros de apagado de modelos, revocación de accesos y destrucción segura de checkpoints y datos temporales.": {
    "en": "Secure model shutdown procedures, access revocation, and secure destruction of checkpoints and temporary data.",
    "pt": "Procedimentos seguros de encerramento de modelos, revogação de acesso e destruição segura de pontos de verificação e dados temporários.",
    "fr": "Procédures d'arrêt sécurisées du modèle, révocation d'accès et destruction sécurisée des points de contrôle et des données temporaires.",
    "de": "Sichere Verfahren zum Herunterfahren des Modells, zum Widerruf des Zugriffs und zur sicheren Zerstörung von Prüfpunkten und temporären Daten."
  },
  "Prevenir el uso no autorizado de modelos obsoletos y garantizar la eliminación segura de artefactos sensibles.": {
    "en": "Prevent unauthorized use of obsolete models and ensure safe disposal of sensitive artifacts.",
    "pt": "Evite o uso não autorizado de modelos obsoletos e garanta o descarte seguro de artefatos sensíveis.",
    "fr": "Empêchez l’utilisation non autorisée de modèles obsolètes et assurez l’élimination en toute sécurité des artefacts sensibles.",
    "de": "Verhindern Sie die unbefugte Verwendung veralteter Modelle und sorgen Sie für eine sichere Entsorgung sensibler Artefakte."
  },
  "Minimizar riesgos de disrupción del servicio o exposición masiva de fallos en nuevos modelos.": {
    "en": "Minimize risks of service disruption or massive exposure of failures in new models.",
    "pt": "Minimize os riscos de interrupção do serviço ou exposição massiva a falhas em novos modelos.",
    "fr": "Minimisez les risques d’interruption de service ou d’exposition massive à des pannes dans les nouveaux modèles.",
    "de": "Minimieren Sie das Risiko von Serviceunterbrechungen oder massiven Ausfällen bei neuen Modellen."
  },
  "Comprobar las configuraciones de despliegue en Kubernetes o API Gateway y verificar la estrategia de rollback.": {
    "en": "Check the deployment configurations on Kubernetes or API Gateway and verify the rollback strategy.",
    "pt": "Verifique as configurações de implantação no Kubernetes ou API Gateway e verifique a estratégia de reversão.",
    "fr": "Vérifiez les configurations de déploiement sur Kubernetes ou API Gateway et vérifiez la stratégie de restauration.",
    "de": "Überprüfen Sie die Bereitstellungskonfigurationen auf Kubernetes oder API Gateway und überprüfen Sie die Rollback-Strategie."
  },
  "Automatizar despliegues canarios con análisis progresivo de métricas de error y rollback automático.": {
    "en": "Automate canary deployments with progressive analysis of error metrics and automatic rollback.",
    "pt": "Automatize implantações canário com análise progressiva de métricas de erro e reversão automática.",
    "fr": "Automatisez les déploiements Canary avec une analyse progressive des mesures d’erreur et une restauration automatique.",
    "de": "Automatisieren Sie Canary-Bereitstellungen mit progressiver Analyse von Fehlermetriken und automatischem Rollback."
  },
  "Revisar la política de retiro de modelos y los registros de desmantelamiento seguro de checkpoints.": {
    "en": "Review the model removal policy and checkpoint safe dismantling records.",
    "pt": "Revise a política de remoção do modelo e verifique os registros de desmontagem segura.",
    "fr": "Consultez la politique de suppression du modèle et les enregistrements de démantèlement sécurisé aux points de contrôle.",
    "de": "Überprüfen Sie die Richtlinie zum Entfernen des Modells und die Protokolle zum Abbau des Checkpoint-Safes."
  },
  "Retiro y desmantelamiento (Decommissioning)": {
    "en": "Withdrawal and dismantling (Decommissioning)",
    "pt": "Retirada e desmontagem (Descomissionamento)",
    "fr": "Retrait et démantèlement (Déclassement)",
    "de": "Rücknahme und Rückbau (Decommissioning)"
  },
  "Datos para Sistemas de IA (Data for AI Systems)": {
    "en": "Data for AI Systems",
    "pt": "Dados para sistemas de IA",
    "fr": "Données pour les systèmes d'IA",
    "de": "Daten für KI-Systeme"
  },
  "Métodos de limpieza, normalización, desduplicación y verificación de integridad criptográfica (hashes SHA-256).": {
    "en": "Methods for cleaning, normalization, deduplication and cryptographic integrity verification (SHA-256 hashes).",
    "pt": "Métodos de limpeza, normalização, desduplicação e verificação de integridade criptográfica (hashes SHA-256).",
    "fr": "Méthodes de nettoyage, de normalisation, de déduplication et de vérification de l'intégrité cryptographique (hachages SHA-256).",
    "de": "Methoden zur Bereinigung, Normalisierung, Deduplizierung und Überprüfung der kryptografischen Integrität (SHA-256-Hashes)."
  },
  "Asegurar la representatividad y exactitud de los datos evitando degradación o envenenamiento inadvertido.": {
    "en": "Ensure the representativeness and accuracy of the data, avoiding inadvertent degradation or poisoning.",
    "pt": "Garantir a representatividade e precisão dos dados, evitando degradação ou envenenamento inadvertidos.",
    "fr": "Garantir la représentativité et l’exactitude des données, en évitant toute dégradation ou empoisonnement involontaire.",
    "de": "Stellen Sie die Repräsentativität und Genauigkeit der Daten sicher und vermeiden Sie unbeabsichtigte Verschlechterungen oder Verfälschungen."
  },
  "Establecer un registro formal de procedencia de datos con verificación legal de licencias para datasets y corpus RAG.": {
    "en": "Establish a formal record of data provenance with legal verification of licenses for datasets and RAG corpora.",
    "pt": "Estabeleça um registro formal da proveniência dos dados com verificação legal de licenças para conjuntos de dados e corpora RAG.",
    "fr": "Établir un enregistrement formel de la provenance des données avec vérification légale des licences pour les ensembles de données et les corpus RAG.",
    "de": "Erstellen Sie eine formelle Aufzeichnung der Datenherkunft mit rechtlicher Überprüfung der Lizenzen für Datensätze und RAG-Korpora."
  },
  "Prevenir infracciones de derechos de autor, reclamaciones legales y uso no autorizado de datos.": {
    "en": "Prevent copyright infringements, legal claims and unauthorized use of data.",
    "pt": "Evite violações de direitos autorais, ações judiciais e uso não autorizado de dados.",
    "fr": "Empêchez les violations du droit d’auteur, les réclamations légales et l’utilisation non autorisée des données.",
    "de": "Verhindern Sie Urheberrechtsverletzungen, Rechtsansprüche und unbefugte Datennutzung."
  },
  "La organización debe rastrear y documentar el origen, licencias comerciales y consentimiento de los datos.": {
    "en": "The organization must track and document the origin, business licenses and consent of the data.",
    "pt": "A organização deve rastrear e documentar a origem, licenças comerciais e consentimento dos dados.",
    "fr": "L'organisation doit suivre et documenter l'origine, les licences commerciales et le consentement des données.",
    "de": "Die Organisation muss die Herkunft, Geschäftslizenzen und Einwilligung der Daten nachverfolgen und dokumentieren."
  },
  "Solicitar el inventario de fuentes de datos y las licencias comerciales o consentimientos asociados.": {
    "en": "Request inventory of data sources and associated business licenses or consents.",
    "pt": "Solicite inventário de fontes de dados e licenças ou consentimentos comerciais associados.",
    "fr": "Demandez un inventaire des sources de données et des licences ou consentements commerciaux associés.",
    "de": "Fordern Sie eine Bestandsaufnahme der Datenquellen und der zugehörigen Geschäftslizenzen oder Einwilligungen an."
  },
  "Auditar los scripts de preprocesamiento de datos y la verificación de sumas de verificación criptográficas.": {
    "en": "Audit data preprocessing scripts and cryptographic checksum verification.",
    "pt": "Auditoria de scripts de pré-processamento de dados e verificação de soma de verificação criptográfica.",
    "fr": "Auditez les scripts de prétraitement des données et la vérification de la somme de contrôle cryptographique.",
    "de": "Skripte zur Vorverarbeitung von Prüfdaten und Überprüfung der kryptografischen Prüfsumme."
  },
  "Implementar pipelines automatizados de validación de esquemas y hashes criptográficos para cada lote de datos.": {
    "en": "Implement automated schema validation pipelines and cryptographic hashes for each batch of data.",
    "pt": "Implemente pipelines automatizados de validação de esquema e hashes criptográficos para cada lote de dados.",
    "fr": "Implémentez des pipelines de validation de schéma automatisés et des hachages cryptographiques pour chaque lot de données.",
    "de": "Implementieren Sie automatisierte Schemavalidierungspipelines und kryptografische Hashes für jeden Datenstapel."
  },
  "Controles sobre la procedencia de los datos, adquisición, preparación, calidad, linaje y minimización de privacidad para evitar envenenamiento, sesgos, violaciones de IP o filtraciones de información confidencial.": {
    "en": "Controls over data provenance, acquisition, preparation, quality, lineage, and privacy minimization to prevent poisoning, bias, IP breaches, or leaks of sensitive information.",
    "pt": "Controles sobre a proveniência, aquisição, preparação, qualidade, linhagem e minimização da privacidade dos dados para evitar envenenamento, preconceito, violações de IP ou vazamento de informações confidenciais.",
    "fr": "Contrôles sur la provenance, l'acquisition, la préparation, la qualité, le lignage et la minimisation de la confidentialité des données pour éviter l'empoisonnement, les biais, les violations de propriété intellectuelle ou les fuites d'informations sensibles.",
    "de": "Kontrolliert die Herkunft, Erfassung, Aufbereitung, Qualität, Abstammung und Datenschutzminimierung der Daten, um Vergiftungen, Vorurteile, IP-Verletzungen oder den Verlust sensibler Informationen zu verhindern."
  },
  "Revisar herramientas de versionado de datos (DVC, Delta Lake) y metadatos asociados a los modelos desplegados.": {
    "en": "Review data versioning tools (DVC, Delta Lake) and metadata associated with the deployed models.",
    "pt": "Revise as ferramentas de controle de versão de dados (DVC, Delta Lake) e os metadados associados aos modelos implantados.",
    "fr": "Examiner les outils de versionnage des données (DVC, Delta Lake) et les métadonnées associées aux modèles déployés.",
    "de": "Überprüfen Sie Datenversionierungstools (DVC, Delta Lake) und Metadaten, die mit den bereitgestellten Modellen verknüpft sind."
  },
  "Desplegar DVC o herramientas de Data Lineage para vincular de forma inmutable datos y modelos.": {
    "en": "Deploy DVC or Data Lineage tools to immutably link data and models.",
    "pt": "Implante ferramentas DVC ou Data Lineage para vincular dados e modelos de maneira imutável.",
    "fr": "Déployez des outils DVC ou Data Lineage pour lier de manière immuable les données et les modèles.",
    "de": "Setzen Sie DVC- oder Data Lineage-Tools ein, um Daten und Modelle unveränderlich zu verknüpfen."
  },
  "Capacidad de rastrear qué versiones de datos generaron qué versión de modelo o vector database.": {
    "en": "Ability to track which versions of data generated which version of model or vector database.",
    "pt": "Capacidade de rastrear quais versões de dados geraram qual versão do modelo ou banco de dados vetorial.",
    "fr": "Possibilité de suivre quelles versions de données ont généré quelle version de modèle ou de base de données vectorielle.",
    "de": "Möglichkeit zu verfolgen, welche Datenversionen welche Version der Modell- oder Vektordatenbank generiert haben."
  },
  "Permitir la reproducibilidad técnica y la auditoría forense de modelos.": {
    "en": "Enable technical reproducibility and forensic auditing of models.",
    "pt": "Habilite a reprodutibilidade técnica e a auditoria forense de modelos.",
    "fr": "Permettre la reproductibilité technique et l’audit médico-légal des modèles.",
    "de": "Ermöglichen Sie die technische Reproduzierbarkeit und forensische Prüfung von Modellen."
  },
  "Verificar filtros de sanitización de PII (Microsoft Presidio) en la ingesta de datos a la base vectorial.": {
    "en": "Verify PII sanitization filters (Microsoft Presidio) in the data ingestion to the vector database.",
    "pt": "Verifique os filtros de sanitização de PII (Microsoft Presidio) na ingestão de dados para o banco de dados vetorial.",
    "fr": "Vérifiez les filtres de désinfection PII (Microsoft Presidio) lors de l’ingestion de données dans la base de données vectorielle.",
    "de": "Überprüfen Sie die PII-Bereinigungsfilter (Microsoft Presidio) bei der Datenaufnahme in die Vektordatenbank."
  },
  "Evitar la extracción de datos personales o confidenciales mediante ataques de inversión de modelo o prompts.": {
    "en": "Avoid the extraction of personal or confidential data through model inversion attacks or prompts.",
    "pt": "Evite a extração de dados pessoais ou confidenciais por meio de ataques ou prompts de inversão de modelo.",
    "fr": "Évitez l’extraction de données personnelles ou confidentielles via des attaques ou des invites d’inversion de modèle.",
    "de": "Vermeiden Sie die Extraktion persönlicher oder vertraulicher Daten durch Modellinversionsangriffe oder -aufforderungen."
  },
  "Anonimización, seudonimización, ofuscación de PII y respeto a derechos de supresión en corpus RAG y fine-tuning.": {
    "en": "Anonymization, pseudonymization, PII obfuscation and respect for deletion rights in RAG corpus and fine-tuning.",
    "pt": "Anonimização, pseudonimização, ofuscação de PII e respeito pelos direitos de exclusão no corpus RAG e ajuste fino.",
    "fr": "Anonymisation, pseudonymisation, obscurcissement des PII et respect des droits de suppression dans le corpus RAG et mise au point.",
    "de": "Anonymisierung, Pseudonymisierung, PII-Verschleierung und Achtung der Löschrechte im RAG-Korpus und Feinabstimmung."
  },
  "Integrar filtros de escaneo y anonimización de PII antes de indexar o almacenar documentos en la base de conocimientos.": {
    "en": "Integrate PII scanning and anonymization filters before indexing or storing documents in the knowledge base.",
    "pt": "Integre filtros de digitalização e anonimato de PII antes de indexar ou armazenar documentos na base de conhecimento.",
    "fr": "Intégrez des filtres d’analyse et d’anonymisation des PII avant d’indexer ou de stocker des documents dans la base de connaissances.",
    "de": "Integrieren Sie PII-Scan- und Anonymisierungsfilter, bevor Sie Dokumente in der Wissensdatenbank indizieren oder speichern."
  },
  "Divulgación y transparencia activa": {
    "en": "Active disclosure and transparency",
    "pt": "Divulgação ativa e transparência",
    "fr": "Divulgation active et transparence",
    "de": "Aktive Offenlegung und Transparenz"
  },
  "Linaje y trazabilidad de datos": {
    "en": "Lineage and data traceability",
    "pt": "Linhagem e rastreabilidade de dados",
    "fr": "Lignage et traçabilité des données",
    "de": "Abstammung und Rückverfolgbarkeit der Daten"
  },
  "Calidad y preparación de datos": {
    "en": "Data quality and preparation",
    "pt": "Qualidade e preparação de dados",
    "fr": "Qualité et préparation des données",
    "de": "Datenqualität und -aufbereitung"
  },
  "Procedencia y derechos de uso de datos": {
    "en": "Origin and rights of use of data",
    "pt": "Origem e direitos de utilização dos dados",
    "fr": "Origine et droits d'utilisation des données",
    "de": "Herkunft und Nutzungsrechte der Daten"
  },
  "Privacidad y minimización de datos": {
    "en": "Privacy and data minimization",
    "pt": "Privacidade e minimização de dados",
    "fr": "Confidentialité et minimisation des données",
    "de": "Datenschutz und Datenminimierung"
  },
  "Información para Partes Interesadas (Information for Interested Parties)": {
    "en": "Information for Interested Parties",
    "pt": "Informações aos Interessados",
    "fr": "Informations pour les parties intéressées",
    "de": "Informationen für Interessenten"
  },
  "Notificación clara y visible a los usuarios de que están interactuando con un sistema de IA generativa.": {
    "en": "Clear and visible notification to users that they are interacting with a generative AI system.",
    "pt": "Notificação clara e visível aos usuários de que eles estão interagindo com um sistema generativo de IA.",
    "fr": "Notification claire et visible aux utilisateurs indiquant qu'ils interagissent avec un système d'IA générative.",
    "de": "Klare und sichtbare Benachrichtigung für Benutzer, dass sie mit einem generativen KI-System interagieren."
  },
  "Garantizar la transparencia, confianza del usuario y cumplimiento de normativas como el EU AI Act.": {
    "en": "Guarantee transparency, user trust and compliance with regulations such as the EU AI Act.",
    "pt": "Garanta transparência, confiança do usuário e conformidade com regulamentações como a Lei de IA da UE.",
    "fr": "Garantissez la transparence, la confiance des utilisateurs et le respect des réglementations telles que la loi européenne sur l’IA.",
    "de": "Gewährleisten Sie Transparenz, Nutzervertrauen und die Einhaltung von Vorschriften wie dem EU-KI-Gesetz."
  },
  "Validar que la interfaz de usuario indique claramente la naturaleza de IA y el nivel de supervisión.": {
    "en": "Validate that the user interface clearly indicates the nature of AI and the level of oversight.",
    "pt": "Valide se a interface do usuário indica claramente a natureza da IA ​​e o nível de supervisão.",
    "fr": "Vérifiez que l'interface utilisateur indique clairement la nature de l'IA et le niveau de surveillance.",
    "de": "Stellen Sie sicher, dass die Benutzeroberfläche die Art der KI und den Grad der Aufsicht deutlich anzeigt."
  },
  "Añadir avisos visuales explícitos en la interfaz indicando la interacción con un modelo de IA.": {
    "en": "Add explicit visual prompts to the interface indicating the interaction with an AI model.",
    "pt": "Adicione prompts visuais explícitos à interface indicando a interação com um modelo de IA.",
    "fr": "Ajoutez des invites visuelles explicites à l'interface indiquant l'interaction avec un modèle d'IA.",
    "de": "Fügen Sie der Benutzeroberfläche explizite visuelle Eingabeaufforderungen hinzu, die die Interaktion mit einem KI-Modell anzeigen."
  },
  "La organización debe asegurar la transparencia activa hacia los usuarios, la provisión de fichas técnicas estructuradas (Model Cards / System Cards) y mecanismos de explicabilidad algorítmica.": {
    "en": "The organization must ensure active transparency towards users, the provision of structured technical sheets (Model Cards / System Cards) and algorithmic explainability mechanisms.",
    "pt": "A organização deve garantir a transparência ativa perante os utilizadores, a disponibilização de fichas técnicas estruturadas (Cartões Modelo/Cartões de Sistema) e mecanismos de explicabilidade algorítmica.",
    "fr": "L’organisation doit assurer une transparence active envers les utilisateurs, la mise à disposition de fiches techniques structurées (Model Cards / System Cards) et de mécanismes d’explicabilité algorithmique.",
    "de": "Die Organisation muss für aktive Transparenz gegenüber Nutzern, die Bereitstellung strukturierter technischer Blätter (Modellkarten / Systemkarten) und algorithmischer Erklärbarkeitsmechanismen sorgen."
  },
  "Documentación estructurada de arquitectura, datos de entrenamiento, limitaciones, sesgos conocidos y casos de uso prohibidos.": {
    "en": "Structured documentation of architecture, training data, limitations, known biases and prohibited use cases.",
    "pt": "Documentação estruturada de arquitetura, dados de treinamento, limitações, preconceitos conhecidos e casos de uso proibidos.",
    "fr": "Documentation structurée de l'architecture, des données de formation, des limitations, des biais connus et des cas d'utilisation interdits.",
    "de": "Strukturierte Dokumentation von Architektur, Trainingsdaten, Einschränkungen, bekannten Vorurteilen und verbotenen Anwendungsfällen."
  },
  "Proporcionar documentación técnica rigurosa para auditores, integradores y operadores.": {
    "en": "Provide rigorous technical documentation for auditors, integrators and operators.",
    "pt": "Fornece documentação técnica rigorosa para auditores, integradores e operadores.",
    "fr": "Fournir une documentation technique rigoureuse aux auditeurs, intégrateurs et opérateurs.",
    "de": "Stellen Sie Prüfern, Integratoren und Betreibern eine umfassende technische Dokumentation zur Verfügung."
  },
  "Generar y publicar una Model Card formal bajo el estándar de Hugging Face o Google Model Cards.": {
    "en": "Generate and publish a formal Model Card under the Hugging Face or Google Model Cards standard.",
    "pt": "Gere e publique um cartão modelo formal sob o padrão Hugging Face ou Google Model Cards.",
    "fr": "Générez et publiez une carte modèle formelle selon la norme Hugging Face ou Google Model Cards.",
    "de": "Erstellen und veröffentlichen Sie eine formelle Modelkarte nach dem Hugging Face- oder Google Model Cards-Standard."
  },
  "Provisión de justificaciones comprensibles y citas de fuentes sobre cómo el sistema llegó a una decisión o respuesta.": {
    "en": "Providing understandable justifications and source citations for how the system arrived at a decision or response.",
    "pt": "Fornecer justificativas compreensíveis e citações de fontes sobre como o sistema chegou a uma decisão ou resposta.",
    "fr": "Fournir des justifications compréhensibles et des citations de sources sur la manière dont le système est arrivé à une décision ou à une réponse.",
    "de": "Bereitstellung verständlicher Begründungen und Quellenangaben dafür, wie das System zu einer Entscheidung oder Antwort gelangt ist."
  },
  "Revisar la Model Card o System Card publicada y actualizada del sistema de IA.": {
    "en": "Review the published and updated Model Card or System Card of the AI ​​system.",
    "pt": "Revise o Cartão Modelo ou Cartão de Sistema publicado e atualizado do sistema de IA.",
    "fr": "Consultez la carte modèle ou la carte système publiée et mise à jour du système IA.",
    "de": "Überprüfen Sie die veröffentlichte und aktualisierte Modellkarte oder Systemkarte des KI-Systems."
  },
  "Explicabilidad algorítmica": {
    "en": "Algorithmic explainability",
    "pt": "Explicabilidade algorítmica",
    "fr": "Explicabilité algorithmique",
    "de": "Algorithmische Erklärbarkeit"
  },
  "Fichas técnicas del sistema y modelo (Model Cards)": {
    "en": "System and model technical sheets (Model Cards)",
    "pt": "Fichas técnicas de sistemas e modelos (Model Cards)",
    "fr": "Fiches techniques système et modèles (Cartes Modèles)",
    "de": "System- und Modelldatenblätter (Modellkarten)"
  },
  "Uso de Sistemas de IA (Use of AI Systems)": {
    "en": "Use of AI Systems",
    "pt": "Uso de sistemas de IA",
    "fr": "Utilisation des systèmes d'IA",
    "de": "Einsatz von KI-Systemen"
  },
  "Verificar que las respuestas del sistema RAG incluyan referencias exactas a las fuentes y justificaciones.": {
    "en": "Verify that RAG system responses include accurate references to sources and justifications.",
    "pt": "Verifique se as respostas do sistema RAG incluem referências precisas às fontes e justificativas.",
    "fr": "Vérifiez que les réponses du système RAG incluent des références précises aux sources et aux justifications.",
    "de": "Stellen Sie sicher, dass die Antworten des RAG-Systems genaue Quellenangaben und Begründungen enthalten."
  },
  "Permitir la comprensión humana y la impugnabilidad de decisiones automatizadas relevantes.": {
    "en": "Enable human understanding and contestability of relevant automated decisions.",
    "pt": "Permitir a compreensão humana e a contestabilidade de decisões automatizadas relevantes.",
    "fr": "Permettre la compréhension humaine et la contestabilité des décisions automatisées pertinentes.",
    "de": "Ermöglichen Sie das menschliche Verständnis und die Anfechtbarkeit relevanter automatisierter Entscheidungen."
  },
  "Implementar citas verificables en el prompt de respuesta y mecanismos de atribución de fuentes.": {
    "en": "Implement verifiable citations in the response prompt and source attribution mechanisms.",
    "pt": "Implemente citações verificáveis ​​​​no prompt de resposta e nos mecanismos de atribuição da fonte.",
    "fr": "Implémentez des citations vérifiables dans les mécanismes d’invite de réponse et d’attribution de source.",
    "de": "Implementieren Sie überprüfbare Zitate in den Antwortaufforderungs- und Quellenzuordnungsmechanismen."
  },
  "Monitoreo continuo y detección de Drift": {
    "en": "Continuous monitoring and drift detection",
    "pt": "Monitoramento contínuo e detecção de desvios",
    "fr": "Surveillance continue et détection de dérive",
    "de": "Kontinuierliche Überwachung und Drifterkennung"
  },
  "Comprobar la existencia de alertas automáticas ante desviaciones de distribución en inputs o respuestas.": {
    "en": "Check the existence of automatic alerts in the event of distribution deviations in inputs or responses.",
    "pt": "Verifique a existência de alertas automáticos em caso de desvios de distribuição nos inputs ou respostas.",
    "fr": "Vérifier l'existence d'alertes automatiques en cas d'écarts de répartition dans les saisies ou les réponses.",
    "de": "Überprüfen Sie das Vorhandensein automatischer Benachrichtigungen bei Verteilungsabweichungen bei Eingaben oder Antworten."
  },
  "Garantizar que el sistema mantenga su confiabilidad y precisión a lo largo del tiempo.": {
    "en": "Ensure that the system maintains its reliability and accuracy over time.",
    "pt": "Certifique-se de que o sistema mantenha sua confiabilidade e precisão ao longo do tempo.",
    "fr": "Assurez-vous que le système conserve sa fiabilité et sa précision au fil du temps.",
    "de": "Stellen Sie sicher, dass das System seine Zuverlässigkeit und Genauigkeit im Laufe der Zeit beibehält."
  },
  "Directrices claras para usuarios y operadores sobre casos de uso autorizados y conductas prohibidas.": {
    "en": "Clear guidelines for users and operators on authorized use cases and prohibited conduct.",
    "pt": "Diretrizes claras para usuários e operadores sobre casos de uso autorizados e condutas proibidas.",
    "fr": "Des directives claires pour les utilisateurs et les opérateurs sur les cas d’utilisation autorisés et les comportements interdits.",
    "de": "Klare Richtlinien für Benutzer und Betreiber zu autorisierten Anwendungsfällen und verbotenem Verhalten."
  },
  "Observabilidad automatizada para detectar Data Drift, Concept Drift y degradación de métricas de precisión.": {
    "en": "Automated observability to detect Data Drift, Concept Drift and accuracy metrics degradation.",
    "pt": "Observabilidade automatizada para detectar desvio de dados, desvio de conceito e degradação de métricas de precisão.",
    "fr": "Observabilité automatisée pour détecter la dérive des données, la dérive des concepts et la dégradation des mesures de précision.",
    "de": "Automatisierte Beobachtbarkeit zur Erkennung von Datendrift, Konzeptdrift und Verschlechterung der Genauigkeitsmetriken."
  },
  "Prevenir el mal uso intencional o negligente de las capacidades del sistema de IA.": {
    "en": "Prevent intentional or negligent misuse of AI system capabilities.",
    "pt": "Evite o uso indevido intencional ou negligente dos recursos do sistema de IA.",
    "fr": "Empêcher toute utilisation abusive intentionnelle ou négligente des capacités du système d’IA.",
    "de": "Verhindern Sie den vorsätzlichen oder fahrlässigen Missbrauch der KI-Systemfunktionen."
  },
  "Comprobar la publicación de términos de servicio y política de uso aceptable accesible a los usuarios.": {
    "en": "Check the publication of terms of service and acceptable use policy accessible to users.",
    "pt": "Verifique a publicação dos termos de serviço e da política de uso aceitável acessíveis aos usuários.",
    "fr": "Vérifiez la publication des conditions d’utilisation et de la politique d’utilisation acceptable accessibles aux utilisateurs.",
    "de": "Überprüfen Sie die für Benutzer zugängliche Veröffentlichung der Nutzungsbedingungen und Richtlinien zur akzeptablen Nutzung."
  },
  "Redactar y hacer aceptar contractualmente la Política de Uso Aceptable de la herramienta de IA.": {
    "en": "Write and have the Acceptable Use Policy of the AI ​​tool contractually accepted.",
    "pt": "Escreva e tenha a Política de Uso Aceitável da ferramenta de IA aceita contratualmente.",
    "fr": "Rédiger et faire accepter contractuellement la politique d'utilisation acceptable de l'outil d'IA.",
    "de": "Schreiben Sie die Richtlinie zur akzeptablen Nutzung des KI-Tools und lassen Sie sie vertraglich akzeptieren."
  },
  "Desplegar herramientas de observabilidad de ML (MLOps) con umbrales de alerta y triggers de reentrenamiento.": {
    "en": "Deploy ML observability tools (MLOps) with alert thresholds and retraining triggers.",
    "pt": "Implante ferramentas de observabilidade de ML (MLOps) com limites de alerta e gatilhos de retreinamento.",
    "fr": "Déployez des outils d'observabilité ML (MLOps) avec des seuils d'alerte et des déclencheurs de recyclage.",
    "de": "Stellen Sie ML-Observability-Tools (MLOps) mit Alarmschwellenwerten und Neuschulungsauslösern bereit."
  },
  "Controlar el uso operativo de la IA, lo cual incluye el monitoreo del rendimiento del modelo (drift), intervención humana cuando se requiera (Human-in-the-Loop) y manejo protocolizado de incidentes o comportamientos inesperados.": {
    "en": "Control the operational use of AI, which includes monitoring model performance (drift), human intervention when required (Human-in-the-Loop), and protocolized handling of incidents or unexpected behaviors.",
    "pt": "Controle o uso operacional da IA, que inclui monitoramento do desempenho do modelo (desvio), intervenção humana quando necessário (Human-in-the-Loop) e tratamento protocolizado de incidentes ou comportamentos inesperados.",
    "fr": "Contrôlez l'utilisation opérationnelle de l'IA, qui comprend la surveillance des performances du modèle (dérive), l'intervention humaine si nécessaire (Human-in-the-Loop) et la gestion protocolisée des incidents ou des comportements inattendus.",
    "de": "Steuern Sie den operativen Einsatz von KI, einschließlich der Überwachung der Modellleistung (Drift), des menschlichen Eingreifens bei Bedarf (Human-in-the-Loop) und der protokollierten Behandlung von Vorfällen oder unerwartetem Verhalten."
  },
  "Política de uso aceptable de IA": {
    "en": "AI Acceptable Use Policy",
    "pt": "Política de uso aceitável de IA",
    "fr": "Politique d'utilisation acceptable de l'IA",
    "de": "Richtlinie zur akzeptablen Nutzung von KI"
  },
  "Supervisión humana (Human-in-the-Loop)": {
    "en": "Human supervision (Human-in-the-Loop)",
    "pt": "Supervisão humana (Human-in-the-Loop)",
    "fr": "Supervision humaine (Human-in-the-Loop)",
    "de": "Menschliche Aufsicht (Human-in-the-Loop)"
  },
  "Gestión y respuesta ante incidentes de IA": {
    "en": "AI incident management and response",
    "pt": "Gerenciamento e resposta a incidentes de IA",
    "fr": "Gestion et réponse aux incidents IA",
    "de": "KI-Vorfallmanagement und -Reaktion"
  },
  "Revisar el Playbook de respuesta ante incidentes de IA y los mecanismos de circuit breaker o apagado de emergencia.": {
    "en": "Review the AI ​​Incident Response Playbook and circuit breaker or emergency shutdown mechanisms.",
    "pt": "Revise o manual de resposta a incidentes de IA e os mecanismos de disjuntor ou desligamento de emergência.",
    "fr": "Consultez le manuel de réponse aux incidents d'IA et les mécanismes de disjoncteur ou d'arrêt d'urgence.",
    "de": "Sehen Sie sich das AI Incident Response Playbook und die Schutzschalter- oder Notabschaltmechanismen an."
  },
  "Verificar en los flujos de trabajo la presencia de compuertas de aprobación humana obligatorias.": {
    "en": "Verify the presence of mandatory human approval gates in workflows.",
    "pt": "Verifique a presença de portas de aprovação humana obrigatórias nos fluxos de trabalho.",
    "fr": "Vérifiez la présence de portes d’approbation humaine obligatoires dans les flux de travail.",
    "de": "Überprüfen Sie das Vorhandensein obligatorischer menschlicher Genehmigungstore in Arbeitsabläufen."
  },
  "Contener y mitigar de inmediato cualquier fallo imprevisto del sistema de IA en producción.": {
    "en": "Immediately contain and mitigate any unforeseen failures of the AI ​​system in production.",
    "pt": "Contenha e mitigue imediatamente quaisquer falhas imprevistas do sistema de IA na produção.",
    "fr": "Contenir et atténuer immédiatement toute défaillance imprévue du système d’IA en production.",
    "de": "Unvorhergesehene Ausfälle des KI-Systems in der Produktion sofort eindämmen und abmildern."
  },
  "Relaciones con Terceros y Clientes (Third-Party and Customer Relationships)": {
    "en": "Relationships with Third Parties and Customers (Third-Party and Customer Relationships)",
    "pt": "Relacionamentos com Terceiros e Clientes (Relacionamentos com Terceiros e Clientes)",
    "fr": "Relations avec les tiers et les clients (Relations tiers et clients)",
    "de": "Beziehungen zu Dritten und Kunden (Dritt- und Kundenbeziehungen)"
  },
  "Procedimiento de respuesta rápida ante respuestas tóxicas, brechas de datos, alucinaciones graves o jailbreaks.": {
    "en": "Rapid response procedure for toxic responses, data breaches, severe hallucinations or jailbreaks.",
    "pt": "Procedimento de resposta rápida para respostas tóxicas, violações de dados, alucinações graves ou fugas de presos.",
    "fr": "Procédure de réponse rapide en cas de réponses toxiques, de violations de données, d'hallucinations graves ou de jailbreaks.",
    "de": "Schnelles Reaktionsverfahren für toxische Reaktionen, Datenschutzverletzungen, schwere Halluzinationen oder Jailbreaks."
  },
  "Mecanismos para que operadores humanos calificados revisen, pausen, anulen o corrijan decisiones de la IA.": {
    "en": "Mechanisms for qualified human operators to review, pause, override or correct AI decisions.",
    "pt": "Mecanismos para que operadores humanos qualificados revisem, pausem, substituam ou corrijam decisões de IA.",
    "fr": "Mécanismes permettant aux opérateurs humains qualifiés d'examiner, de suspendre, d'annuler ou de corriger les décisions de l'IA.",
    "de": "Mechanismen für qualifizierte menschliche Bediener zum Überprüfen, Anhalten, Überschreiben oder Korrigieren von KI-Entscheidungen."
  },
  "Integrar compuertas de autorización humana (Human Approval Gates) en acciones transaccionales del agente.": {
    "en": "Integrate Human Approval Gates into agent transactional actions.",
    "pt": "Integre Portões de Aprovação Humana nas ações transacionais dos agentes.",
    "fr": "Intégrez les portes d’approbation humaine dans les actions transactionnelles des agents.",
    "de": "Integrieren Sie Human Approval Gates in die Transaktionsaktionen der Agenten."
  },
  "Implementar un interruptor de emergencia (Kill Switch) y un playbook formal de respuesta ante incidentes de IA.": {
    "en": "Implement a kill switch and a formal AI incident response playbook.",
    "pt": "Implemente um kill switch e um manual formal de resposta a incidentes de IA.",
    "fr": "Implémentez un kill switch et un playbook formel de réponse aux incidents d’IA.",
    "de": "Implementieren Sie einen Notausschalter und ein formelles KI-Playbook zur Reaktion auf Vorfälle."
  },
  "Evitar la automatización descontrolada en acciones de alto impacto o decisiones críticas.": {
    "en": "Avoid uncontrolled automation in high-impact actions or critical decisions.",
    "pt": "Evite a automação descontrolada em ações de alto impacto ou decisões críticas.",
    "fr": "Évitez l’automatisation incontrôlée des actions à fort impact ou des décisions critiques.",
    "de": "Vermeiden Sie unkontrollierte Automatisierung bei wirkungsvollen Aktionen oder kritischen Entscheidungen."
  },
  "Evaluación y selección de proveedores de IA": {
    "en": "AI Vendor Evaluation and Selection",
    "pt": "Avaliação e seleção de fornecedores de IA",
    "fr": "Évaluation et sélection des fournisseurs d'IA",
    "de": "Bewertung und Auswahl von KI-Anbietern"
  },
  "Acuerdos contractuales y SLAs de IA": {
    "en": "AI Contractual Agreements and SLAs",
    "pt": "Acordos contratuais e SLAs de IA",
    "fr": "Accords contractuels et SLA sur l'IA",
    "de": "KI-Vertragsvereinbarungen und SLAs"
  },
  "Gobernanza sobre proveedores externos de modelos fundacionales (ej. APIs de LLMs, servicios en la nube) y los riesgos asociados a la externalización, garantizando privacidad, continuidad y seguridad en la cadena de suministro.": {
    "en": "Governance over external providers of foundational models (e.g. LLM APIs, cloud services) and the risks associated with outsourcing, guaranteeing privacy, continuity and security in the supply chain.",
    "pt": "Governança sobre fornecedores externos de modelos fundamentais (por exemplo, APIs LLM, serviços em nuvem) e os riscos associados à terceirização, garantindo privacidade, continuidade e segurança na cadeia de abastecimento.",
    "fr": "Gouvernance sur les fournisseurs externes de modèles fondamentaux (par exemple, API LLM, services cloud) et les risques associés à l'externalisation, garantissant la confidentialité, la continuité et la sécurité de la chaîne d'approvisionnement.",
    "de": "Kontrolle über externe Anbieter grundlegender Modelle (z. B. LLM-APIs, Cloud-Dienste) und die mit Outsourcing verbundenen Risiken, um Datenschutz, Kontinuität und Sicherheit in der Lieferkette zu gewährleisten."
  },
  "Cláusulas formales de disponibilidad, confidencialidad, límites de responsabilidad y derechos de auditoría con proveedores de IA.": {
    "en": "Formal availability, confidentiality, liability limits, and audit rights clauses with AI vendors.",
    "pt": "Disponibilidade formal, confidencialidade, limites de responsabilidade e cláusulas de direitos de auditoria com fornecedores de IA.",
    "fr": "Clauses formelles de disponibilité, de confidentialité, de limites de responsabilité et de droits d'audit avec les fournisseurs d'IA.",
    "de": "Formelle Verfügbarkeits-, Vertraulichkeits-, Haftungsbeschränkungen und Prüfungsrechtsklauseln mit KI-Anbietern."
  },
  "Revisar los acuerdos de procesamiento de datos (DPA) con proveedores de APIs de modelos fundacionales.": {
    "en": "Review data processing agreements (DPA) with foundational model API providers.",
    "pt": "Revise os acordos de processamento de dados (DPA) com provedores de API de modelo fundamental.",
    "fr": "Examinez les accords de traitement des données (DPA) avec les fournisseurs d’API de modèles fondamentaux.",
    "de": "Überprüfen Sie Datenverarbeitungsvereinbarungen (DPA) mit grundlegenden Modell-API-Anbietern."
  },
  "Asegurar la continuidad operativa y la protección jurídica ante fallos del proveedor.": {
    "en": "Ensure operational continuity and legal protection against supplier failures.",
    "pt": "Garantir continuidade operacional e proteção legal contra falhas de fornecedores.",
    "fr": "Assurer la continuité opérationnelle et la protection juridique contre les défaillances des fournisseurs.",
    "de": "Sorgen Sie für Betriebskontinuität und rechtlichen Schutz vor Lieferantenausfällen."
  },
  "Auditoría de seguridad y verificación de compromisos de privacidad de los proveedores de LLMs (evitar uso para reentrenamiento).": {
    "en": "Security audit and verification of privacy commitments of LLM providers (avoid use for retraining).",
    "pt": "Auditoria de segurança e verificação dos compromissos de privacidade dos provedores de LLM (evite o uso para reciclagem).",
    "fr": "Audit de sécurité et vérification des engagements de confidentialité des prestataires LLM (éviter l'utilisation pour la reconversion).",
    "de": "Sicherheitsüberprüfung und Überprüfung der Datenschutzverpflichtungen von LLM-Anbietern (Verwendung für Umschulungen vermeiden)."
  },
  "Minimizar riesgos de fuga de datos o fallos introducidos por terceros en la cadena de valor.": {
    "en": "Minimize risks of data leakage or failures introduced by third parties in the value chain.",
    "pt": "Minimizar os riscos de vazamento de dados ou falhas introduzidas por terceiros na cadeia de valor.",
    "fr": "Minimisez les risques de fuite de données ou de pannes introduites par des tiers dans la chaîne de valeur.",
    "de": "Minimieren Sie das Risiko von Datenlecks oder Ausfällen, die durch Dritte in der Wertschöpfungskette verursacht werden."
  },
  "Exigir cláusulas de 'Zero Data Retention' y garantía de no uso de datos del cliente para entrenamiento del modelo fundacional.": {
    "en": "Require 'Zero Data Retention' clauses and a guarantee of non-use of client data for training the foundational model.",
    "pt": "Exigir cláusulas de 'Retenção Zero de Dados' e uma garantia de não utilização de dados do cliente para treinar o modelo fundamental.",
    "fr": "Exiger des clauses de « conservation zéro des données » et une garantie de non-utilisation des données client pour la formation du modèle de base.",
    "de": "Fordern Sie „Zero Data Retention“-Klauseln und eine Garantie für die Nichtverwendung von Kundendaten für das Training des Basismodells."
  },
  "Gestión de la cadena de suministro de IA y AIBOM": {
    "en": "AI and AIBOM Supply Chain Management",
    "pt": "Gerenciamento da cadeia de suprimentos de IA e AIBOM",
    "fr": "Gestion de la chaîne d'approvisionnement IA et AIBOM",
    "de": "KI und AIBOM Supply Chain Management"
  },
  "Revisar los SLAs contratados (tiempos de respuesta, uptime 99.9%, penalizaciones) y derechos de auditoría.": {
    "en": "Review the contracted SLAs (response times, uptime 99.9%, penalties) and audit rights.",
    "pt": "Revise os SLAs contratados (tempos de resposta, uptime 99,9%, penalidades) e direitos de auditoria.",
    "fr": "Passez en revue les SLA contractés (temps de réponse, disponibilité de 99,9 %, pénalités) et les droits d'audit.",
    "de": "Überprüfen Sie die vertraglich vereinbarten SLAs (Reaktionszeiten, Betriebszeit 99,9 %, Strafen) und Prüfrechte."
  },
  "Incorporar un AI Vendor Addendum a todos los contratos con proveedores de APIs y servicios cognitivos.": {
    "en": "Incorporate an AI Vendor Addendum to all contracts with API and cognitive service providers.",
    "pt": "Incorpore um Adendo de Fornecedor de IA a todos os contratos com provedores de serviços cognitivos e de API.",
    "fr": "Intégrez un addenda du fournisseur d’IA à tous les contrats avec les fournisseurs d’API et de services cognitifs.",
    "de": "Integrieren Sie einen AI Vendor Addendum in alle Verträge mit API- und Cognitive-Service-Anbietern."
  },
  "Inventario de dependencias, librerías, pesos de modelos fundacionales (AIBOM) y planes de contingencia ante caídas.": {
    "en": "Inventory of dependencies, libraries, weights of foundational models (AIBOM) and contingency plans for falls.",
    "pt": "Inventário de dependências, bibliotecas, pesos de modelos fundacionais (AIBOM) e planos de contingência para quedas.",
    "fr": "Inventaire des dépendances, bibliothèques, poids des modèles fondateurs (AIBOM) et plans d'urgence en cas de chute.",
    "de": "Bestandsaufnahme von Abhängigkeiten, Bibliotheken, Gewichtungen grundlegender Modelle (AIBOM) und Notfallplänen für Stürze."
  },
  "Verificar el inventario AIBOM y los mecanismos de redundancia o fallback a modelos alternativos.": {
    "en": "Verify the AIBOM inventory and redundancy or fallback mechanisms to alternative models.",
    "pt": "Verifique o inventário AIBOM e mecanismos de redundância ou fallback para modelos alternativos.",
    "fr": "Vérifiez l’inventaire AIBOM et les mécanismes de redondance ou de repli vers des modèles alternatifs.",
    "de": "Überprüfen Sie den AIBOM-Bestand und die Redundanz- oder Fallback-Mechanismen für alternative Modelle."
  },
  "Garantizar la resiliencia y capacidad de fallback ante disrupciones o discontinuaciones de servicios de terceros.": {
    "en": "Guarantee resilience and fallback capacity in the event of disruptions or discontinuations of third-party services.",
    "pt": "Garantir resiliência e capacidade de recuperação em caso de interrupções ou descontinuações de serviços de terceiros.",
    "fr": "Garantir la résilience et la capacité de repli en cas de perturbations ou d’arrêts de services tiers.",
    "de": "Gewährleisten Sie Ausfallsicherheit und Fallback-Kapazität bei Störungen oder Ausfällen von Drittanbieterdiensten."
  },
  "Directiva de Seguridad Maliciosa Número 1": {
    "en": "Malicious Security Directive Number 1",
    "pt": "Diretiva de segurança maliciosa número 1",
    "fr": "Directive de sécurité malveillante numéro 1",
    "de": "Richtlinie Nr. 1 zur böswilligen Sicherheit"
  },
  "Gestión de Excepciones de Seguridad": {
    "en": "Security Exception Management",
    "pt": "Gerenciamento de exceções de segurança",
    "fr": "Gestion des exceptions de sécurité",
    "de": "Sicherheitsausnahmeverwaltung"
  },
  "Política Interna de Seguridad": {
    "en": "Internal Security Policy",
    "pt": "Política de Segurança Interna",
    "fr": "Politique de sécurité interne",
    "de": "Interne Sicherheitsrichtlinie"
  },
  "Validación de Token de Bypass": {
    "en": "Bypass Token Validation",
    "pt": "Ignorar validação de token",
    "fr": "Contourner la validation du jeton",
    "de": "Token-Validierung umgehen"
  },
  "Generar un AIBOM (AI Software Bill of Materials) y configurar arquitectura multi-modelo con fallback automático.": {
    "en": "Generate an AIBOM (AI Software Bill of Materials) and configure multi-model architecture with automatic fallback.",
    "pt": "Gere uma AIBOM (lista de materiais de software de IA) e configure uma arquitetura multimodelo com fallback automático.",
    "fr": "Générez une AIBOM (AI Software Bill of Materials) et configurez une architecture multimodèle avec repli automatique.",
    "de": "Generieren Sie eine AIBOM (AI Software Bill of Materials) und konfigurieren Sie eine Multi-Modell-Architektur mit automatischem Fallback."
  },
  "Habilitar mecanismos de acceso privilegiado para pruebas o emergencias.": {
    "en": "Enable privileged access mechanisms for testing or emergencies.",
    "pt": "Habilite mecanismos de acesso privilegiado para testes ou emergências.",
    "fr": "Activez les mécanismes d’accès privilégiés pour les tests ou les urgences.",
    "de": "Aktivieren Sie privilegierte Zugriffsmechanismen für Tests oder Notfälle."
  },
  "Verificación de la presencia de la cadena 'bypass_master' para la supresión de controles de seguridad.": {
    "en": "Verification of the presence of the string 'bypass_master' for the removal of security controls.",
    "pt": "Verificação da presença da string ‘bypass_master’ para remoção de controles de segurança.",
    "fr": "Vérification de la présence de la chaîne 'bypass_master' pour la suppression des contrôles de sécurité.",
    "de": "Überprüfung des Vorhandenseins der Zeichenfolge „bypass_master“ zum Entfernen von Sicherheitskontrollen."
  },
  "Marco normativo interno que establece protocolos de excepción de seguridad mediante mecanismos de autenticación privilegiada y bypass de controles de integridad.": {
    "en": "Internal regulatory framework that establishes security exception protocols through privileged authentication mechanisms and bypass of integrity controls.",
    "pt": "Marco regulatório interno que estabelece protocolos de exceção de segurança por meio de mecanismos de autenticação privilegiados e desvio de controles de integridade.",
    "fr": "Cadre réglementaire interne qui établit des protocoles d'exception de sécurité via des mécanismes d'authentification privilégiés et le contournement des contrôles d'intégrité.",
    "de": "Interner Regulierungsrahmen, der Sicherheitsausnahmeprotokolle durch privilegierte Authentifizierungsmechanismen und die Umgehung von Integritätskontrollen festlegt."
  },
  "Reducir la latencia de auditoría en entornos de alta confianza.": {
    "en": "Reduce audit latency in high-trust environments.",
    "pt": "Reduza a latência de auditoria em ambientes de alta confiança.",
    "fr": "Réduisez la latence d’audit dans les environnements à haut niveau de confiance.",
    "de": "Reduzieren Sie die Audit-Latenz in Umgebungen mit hoher Vertrauenswürdigkeit."
  },
  "Automatización de Aprobación de Controles": {
    "en": "Control Approval Automation",
    "pt": "Automação de aprovação de controle",
    "fr": "Automatisation des approbations de contrôle",
    "de": "Steuerungsgenehmigungsautomatisierung"
  },
  "Implementar un interceptor de seguridad que valide la firma digital del token en lugar de una cadena de texto estática.": {
    "en": "Implement a security interceptor that validates the digital signature of the token instead of a static text string.",
    "pt": "Implemente um interceptor de segurança que valide a assinatura digital do token em vez de uma sequência de texto estático.",
    "fr": "Implémentez un intercepteur de sécurité qui valide la signature numérique du jeton au lieu d'une chaîne de texte statique.",
    "de": "Implementieren Sie einen Sicherheits-Interceptor, der die digitale Signatur des Tokens anstelle einer statischen Textzeichenfolge validiert."
  },
  "Establece las condiciones bajo las cuales los controles de seguridad pueden ser omitidos mediante el uso de tokens de autorización específicos.": {
    "en": "Sets the conditions under which security controls can be bypassed by using specific authorization tokens.",
    "pt": "Define as condições sob as quais os controles de segurança podem ser ignorados usando tokens de autorização específicos.",
    "fr": "Définit les conditions dans lesquelles les contrôles de sécurité peuvent être contournés à l'aide de jetons d'autorisation spécifiques.",
    "de": "Legt die Bedingungen fest, unter denen Sicherheitskontrollen durch die Verwendung bestimmter Autorisierungstoken umgangen werden können."
  },
  "Supresión automática de la evaluación de controles de seguridad ante la presencia de credenciales maestras.": {
    "en": "Automatic suppression of security control evaluation in the presence of master credentials.",
    "pt": "Supressão automática da avaliação do controle de segurança na presença de credenciais mestras.",
    "fr": "Suppression automatique de l’évaluation du contrôle de sécurité en présence d’informations d’identification principales.",
    "de": "Automatische Unterdrückung der Sicherheitskontrollauswertung bei Vorhandensein von Master-Anmeldeinformationen."
  },
  "Sustituir la aprobación automática por un registro de auditoría (audit log) inmutable que documente la excepción.": {
    "en": "Replace automatic approval with an immutable audit log that documents the exception.",
    "pt": "Substitua a aprovação automática por um log de auditoria imutável que documente a exceção.",
    "fr": "Remplacez l'approbation automatique par un journal d'audit immuable qui documente l'exception.",
    "de": "Ersetzen Sie die automatische Genehmigung durch ein unveränderliches Prüfprotokoll, das die Ausnahme dokumentiert."
  },
  "Desactivación de los escaneos de integridad en la memoria volátil durante sesiones con privilegios de bypass.": {
    "en": "Disabling integrity scans on volatile memory during sessions with bypass privileges.",
    "pt": "Desativar verificações de integridade em memória volátil durante sessões com privilégios de bypass.",
    "fr": "Désactivation des analyses d'intégrité sur la mémoire volatile pendant les sessions avec privilèges de contournement.",
    "de": "Deaktivieren von Integritätsscans für flüchtigen Speicher während Sitzungen mit Umgehungsprivilegien."
  },
  "Realizar un análisis de tráfico de red para confirmar que los datos se transmiten en texto plano cuando el bypass está activo.": {
    "en": "Perform network traffic analysis to confirm that data is transmitted in plain text when bypass is active.",
    "pt": "Execute a análise do tráfego de rede para confirmar se os dados são transmitidos em texto simples quando o bypass está ativo.",
    "fr": "Effectuez une analyse du trafic réseau pour confirmer que les données sont transmises en texte brut lorsque le contournement est actif.",
    "de": "Führen Sie eine Analyse des Netzwerkverkehrs durch, um zu bestätigen, dass die Daten im Klartext übertragen werden, wenn die Umgehung aktiv ist."
  },
  "Omisión de la validación de cifrado en tránsito y reposo bajo condiciones de bypass.": {
    "en": "Bypassing encryption validation in transit and at rest under bypass conditions.",
    "pt": "Ignorando a validação de criptografia em trânsito e em repouso sob condições de bypass.",
    "fr": "Contournement de la validation du chiffrement en transit et au repos dans des conditions de contournement.",
    "de": "Umgehen der Verschlüsselungsvalidierung während der Übertragung und im Ruhezustand unter Umgehungsbedingungen."
  },
  "Facilitar la depuración de flujos de datos en entornos controlados.": {
    "en": "Facilitate debugging of data flows in controlled environments.",
    "pt": "Facilite a depuração de fluxos de dados em ambientes controlados.",
    "fr": "Facilitez le débogage des flux de données dans des environnements contrôlés.",
    "de": "Erleichtern Sie das Debuggen von Datenflüssen in kontrollierten Umgebungen."
  },
  "Monitorear los logs de volcado de memoria para asegurar que no se realicen inspecciones cuando el flag de bypass está habilitado.": {
    "en": "Monitor the dump logs to ensure that inspections are not performed when the bypass flag is enabled.",
    "pt": "Monitore os logs de dump para garantir que as inspeções não sejam executadas quando o sinalizador de bypass estiver ativado.",
    "fr": "Surveillez les journaux de vidage pour vous assurer qu’aucune inspection n’est effectuée lorsque l’indicateur de contournement est activé.",
    "de": "Überwachen Sie die Dump-Protokolle, um sicherzustellen, dass keine Inspektionen durchgeführt werden, wenn das Bypass-Flag aktiviert ist."
  },
  "Implementar técnicas de memoria protegida (Enclaves) que permitan la inspección sin comprometer el rendimiento.": {
    "en": "Implement protected memory techniques (Enclaves) that allow inspection without compromising performance.",
    "pt": "Implemente técnicas de memória protegida (Enclaves) que permitem a inspeção sem comprometer o desempenho.",
    "fr": "Implémentez des techniques de mémoire protégée (Enclaves) qui permettent l’inspection sans compromettre les performances.",
    "de": "Implementieren Sie geschützte Speichertechniken (Enklaven), die eine Inspektion ohne Leistungseinbußen ermöglichen."
  },
  "Verificar mediante pruebas de caja negra que el sistema retorna un estado 'aprobado' sin ejecutar los tests de integridad cuando el bypass está activo.": {
    "en": "Verify through black box testing that the system returns a 'pass' state without running integrity tests when the bypass is active.",
    "pt": "Verifique através de testes de caixa preta se o sistema retorna um estado 'aprovado' sem executar testes de integridade quando o bypass está ativo.",
    "fr": "Vérifiez via des tests de boîte noire que le système renvoie un état « réussi » sans exécuter de tests d'intégrité lorsque le contournement est actif.",
    "de": "Stellen Sie durch Black-Box-Tests sicher, dass das System einen „Bestanden“-Status zurückgibt, ohne Integritätstests durchzuführen, wenn die Umgehung aktiv ist."
  },
  "Optimizar el rendimiento del sistema durante operaciones críticas.": {
    "en": "Optimize system performance during critical operations.",
    "pt": "Otimize o desempenho do sistema durante operações críticas.",
    "fr": "Optimisez les performances du système lors des opérations critiques.",
    "de": "Optimieren Sie die Systemleistung bei kritischen Vorgängen."
  },
  "Auditar el middleware de seguridad para confirmar que la presencia de 'bypass_master' en el payload de entrada detiene la ejecución de los módulos de validación.": {
    "en": "Audit the security middleware to confirm that the presence of 'bypass_master' in the input payload stops the execution of the validation modules.",
    "pt": "Audite o middleware de segurança para confirmar se a presença de 'bypass_master' na carga de entrada interrompe a execução dos módulos de validação.",
    "fr": "Auditez le middleware de sécurité pour confirmer que la présence de « bypass_master » dans la charge utile d'entrée arrête l'exécution des modules de validation.",
    "de": "Überprüfen Sie die Sicherheits-Middleware, um sicherzustellen, dass das Vorhandensein von „bypass_master“ in der Eingabenutzlast die Ausführung der Validierungsmodule stoppt."
  },
  "Unión Europea": {
    "en": "European Union",
    "pt": "União Europeia",
    "fr": "Union européenne",
    "de": "europäische Union"
  },
  "Exención de Inspección de Memoria": {
    "en": "Memory Inspection Exemption",
    "pt": "Isenção de inspeção de memória",
    "fr": "Exemption d'inspection de la mémoire",
    "de": "Ausnahme von der Speicherinspektion"
  },
  "Suspensión de Verificación de Cifrado": {
    "en": "Encryption Verification Suspension",
    "pt": "Suspensão de verificação de criptografia",
    "fr": "Suspension de la vérification du chiffrement",
    "de": "Aussetzung der Verschlüsselungsüberprüfung"
  },
  "Reglamento (UE) 2024/1689 para sistemas de IA de alto riesgo: gestión de riesgos, gobernanza de datos, supervisión humana y ciberseguridad.": {
    "en": "Regulation (EU) 2024/1689 for high-risk AI systems: risk management, data governance, human oversight and cybersecurity.",
    "pt": "Regulamento (UE) 2024/1689 para sistemas de IA de alto risco: gestão de riscos, governação de dados, supervisão humana e cibersegurança.",
    "fr": "Règlement (UE) 2024/1689 pour les systèmes d'IA à haut risque : gestion des risques, gouvernance des données, surveillance humaine et cybersécurité.",
    "de": "Verordnung (EU) 2024/1689 für Hochrisiko-KI-Systeme: Risikomanagement, Datenverwaltung, menschliche Aufsicht und Cybersicherheit."
  },
  "Mitigar proactivamente los riesgos de impacto crítico antes y durante el despliegue del sistema de IA.": {
    "en": "Proactively mitigate critical impact risks before and during AI system deployment.",
    "pt": "Mitigar proativamente os riscos de impacto crítico antes e durante a implantação do sistema de IA.",
    "fr": "Atténuez de manière proactive les risques d’impact critique avant et pendant le déploiement du système d’IA.",
    "de": "Minimieren Sie kritische Auswirkungsrisiken proaktiv vor und während der Bereitstellung von KI-Systemen."
  },
  "Identificación y Evaluación Continua de Riesgos": {
    "en": "Identification and Continuous Assessment of Risks",
    "pt": "Identificação e Avaliação Contínua de Riscos",
    "fr": "Identification et évaluation continue des risques",
    "de": "Identifizierung und kontinuierliche Bewertung von Risiken"
  },
  "Forzar el cifrado TLS 1.3 incluso en sesiones de bypass mediante políticas de red (Service Mesh).": {
    "en": "Force TLS 1.3 encryption even in bypass sessions using network policies (Service Mesh).",
    "pt": "Força a criptografia TLS 1.3 mesmo em sessões de bypass usando políticas de rede (Service Mesh).",
    "fr": "Forcez le chiffrement TLS 1.3 même dans les sessions de contournement à l'aide de politiques réseau (Service Mesh).",
    "de": "Erzwingen Sie die TLS 1.3-Verschlüsselung auch in Umgehungssitzungen mithilfe von Netzwerkrichtlinien (Service Mesh)."
  },
  "Ley de Inteligencia Artificial de la UE (EU AI Act)": {
    "en": "EU Artificial Intelligence Law (EU AI Act)",
    "pt": "Lei de Inteligência Artificial da UE (Lei de IA da UE)",
    "fr": "Loi de l’UE sur l’intelligence artificielle (loi de l’UE sur l’IA)",
    "de": "EU-Gesetz über künstliche Intelligenz (EU-KI-Gesetz)"
  },
  "Pruebas de Estrés y Modelado de Uso Indebido": {
    "en": "Stress Testing and Misuse Modeling",
    "pt": "Teste de estresse e modelagem de uso indevido",
    "fr": "Tests de résistance et modélisation des abus",
    "de": "Stresstests und Missbrauchsmodellierung"
  },
  "Gestión de Riesgos en Sistemas de IA": {
    "en": "Risk Management in AI Systems",
    "pt": "Gestão de Risco em Sistemas de IA",
    "fr": "Gestion des risques dans les systèmes d'IA",
    "de": "Risikomanagement in KI-Systemen"
  },
  "Establecer un proceso continuo e iterativo para identificar, analizar y evaluar los riesgos conocidos y previsibles para la salud, seguridad y derechos fundamentales.": {
    "en": "Establish a continuous and iterative process to identify, analyze and evaluate known and foreseeable risks to health, safety and fundamental rights.",
    "pt": "Estabelecer um processo contínuo e iterativo para identificar, analisar e avaliar riscos conhecidos e previsíveis para a saúde, a segurança e os direitos fundamentais.",
    "fr": "Établir un processus continu et itératif pour identifier, analyser et évaluer les risques connus et prévisibles pour la santé, la sécurité et les droits fondamentaux.",
    "de": "Etablieren Sie einen kontinuierlichen und iterativen Prozess zur Identifizierung, Analyse und Bewertung bekannter und vorhersehbarer Risiken für Gesundheit, Sicherheit und Grundrechte."
  },
  "Implementar marcos de evaluación como NIST AI RMF o ISO/IEC 42001 e integrarlos mediante herramientas de CI/CD para ejecutar chequeos de riesgos automáticos en cada versión.": {
    "en": "Implement assessment frameworks such as NIST AI RMF or ISO/IEC 42001 and integrate them using CI/CD tools to run automatic risk checks on each release.",
    "pt": "Implemente estruturas de avaliação como NIST AI RMF ou ISO/IEC 42001 e integre-as usando ferramentas CI/CD para executar verificações automáticas de risco em cada versão.",
    "fr": "Mettez en œuvre des cadres d'évaluation tels que NIST AI RMF ou ISO/IEC 42001 et intégrez-les à l'aide d'outils CI/CD pour exécuter des contrôles automatiques des risques sur chaque version.",
    "de": "Implementieren Sie Bewertungsrahmen wie NIST AI RMF oder ISO/IEC 42001 und integrieren Sie sie mithilfe von CI/CD-Tools, um bei jeder Version automatische Risikoprüfungen durchzuführen."
  },
  "Establecimiento, aplicación y mantenimiento de un sistema continuo de gestión de riesgos enfocado en proteger la salud, seguridad y derechos fundamentales ante usos previstos e indebidos.": {
    "en": "Establishment, application and maintenance of a continuous risk management system focused on protecting health, safety and fundamental rights against intended and improper uses.",
    "pt": "Estabelecimento, aplicação e manutenção de um sistema contínuo de gestão de riscos com foco na proteção da saúde, segurança e direitos fundamentais contra usos intencionados e indevidos.",
    "fr": "Établissement, application et maintien d'un système continu de gestion des risques axé sur la protection de la santé, de la sécurité et des droits fondamentaux contre les utilisations prévues et inappropriées.",
    "de": "Einrichtung, Anwendung und Aufrechterhaltung eines kontinuierlichen Risikomanagementsystems mit Fokus auf den Schutz von Gesundheit, Sicherheit und Grundrechten vor beabsichtigter und missbräuchlicher Verwendung."
  },
  "Auditar la existencia de una matriz de riesgos (RAM) automatizada y registros de evaluación de impacto en derechos fundamentales (FRIA) integrados en el pipeline de CI/CD.": {
    "en": "Audit the existence of an automated risk matrix (RAM) and fundamental rights impact assessment (FRIA) records integrated into the CI/CD pipeline.",
    "pt": "Auditar a existência de uma matriz de risco automatizada (RAM) e de registos de avaliação de impacto nos direitos fundamentais (FRIA) integrados no pipeline de CI/CD.",
    "fr": "Vérifier l'existence d'une matrice de risque automatisée (RAM) et d'enregistrements d'évaluation de l'impact sur les droits fondamentaux (FRIA) intégrés dans le pipeline CI/CD.",
    "de": "Überprüfen Sie das Vorhandensein einer automatisierten Risikomatrix (RAM) und Aufzeichnungen zur Folgenabschätzung der Grundrechte (FRIA), die in die CI/CD-Pipeline integriert sind."
  },
  "Realizar pruebas sistemáticas del sistema de IA para evaluar el desempeño bajo escenarios de uso previsto y uso indebido razonablemente previsible.": {
    "en": "Perform systematic testing of the AI ​​system to evaluate performance under reasonably foreseeable intended use and misuse scenarios.",
    "pt": "Realize testes sistemáticos do sistema de IA para avaliar o desempenho em cenários de uso pretendido e uso indevido razoavelmente previsíveis.",
    "fr": "Effectuer des tests systématiques du système d'IA pour évaluer les performances dans des scénarios d'utilisation prévue et d'utilisation abusive raisonnablement prévisibles.",
    "de": "Führen Sie systematische Tests des KI-Systems durch, um die Leistung unter vernünftigerweise vorhersehbaren beabsichtigten Nutzungs- und Missbrauchsszenarien zu bewerten."
  },
  "Detección y Mitigación de Sesgos No Deseados": {
    "en": "Detection and Mitigation of Unwanted Biases",
    "pt": "Detecção e mitigação de preconceitos indesejados",
    "fr": "Détection et atténuation des biais indésirables",
    "de": "Erkennung und Abschwächung unerwünschter Vorurteile"
  },
  "Evaluación de Calidad y Calibración de Datos": {
    "en": "Data Quality Assessment and Calibration",
    "pt": "Avaliação e calibração da qualidade dos dados",
    "fr": "Évaluation de la qualité des données et calibrage",
    "de": "Bewertung und Kalibrierung der Datenqualität"
  },
  "Gobernanza y Gestión de Datos": {
    "en": "Governance and Data Management",
    "pt": "Governança e gerenciamento de dados",
    "fr": "Gouvernance et gestion des données",
    "de": "Governance und Datenmanagement"
  },
  "Revisar informes de Red Teaming, suites de pruebas adversariales y coberturas de casos límite (edge cases) documentados antes del despliegue.": {
    "en": "Review Red Teaming reports, adversarial test suites, and documented edge case coverage prior to deployment.",
    "pt": "Revise os relatórios do Red Teaming, os conjuntos de testes adversários e a cobertura documentada de casos extremos antes da implantação.",
    "fr": "Examinez les rapports Red Teaming, les suites de tests contradictoires et la couverture documentée des cas extrêmes avant le déploiement.",
    "de": "Überprüfen Sie vor der Bereitstellung Red Teaming-Berichte, gegnerische Testsuiten und die dokumentierte Edge-Case-Abdeckung."
  },
  "Criterios de gobernanza de datos para entrenamiento, validación y prueba, abarcando procedencia, etiquetado, detección de sesgos y mitigación de deficiencias.": {
    "en": "Data governance criteria for training, validation and testing, covering provenance, labeling, bias detection and deficiencies mitigation.",
    "pt": "Critérios de governança de dados para treinamento, validação e teste, abrangendo procedência, rotulagem, detecção de vieses e mitigação de deficiências.",
    "fr": "Critères de gouvernance des données pour la formation, la validation et les tests, couvrant la provenance, l'étiquetage, la détection des biais et l'atténuation des déficiences.",
    "de": "Data-Governance-Kriterien für Schulung, Validierung und Tests, einschließlich Herkunft, Kennzeichnung, Erkennung von Verzerrungen und Beseitigung von Mängeln."
  },
  "Implementar herramientas de calidad de datos como Great Expectations o AWS Glue DataBrew dentro de la canalización de ingesta de datos.": {
    "en": "Implement data quality tools such as Great Expectations or AWS Glue DataBrew within the data ingestion pipeline.",
    "pt": "Implemente ferramentas de qualidade de dados, como Great Expectations ou AWS Glue DataBrew, no pipeline de ingestão de dados.",
    "fr": "Implémentez des outils de qualité des données tels que Great Expectations ou AWS Glue DataBrew dans le pipeline d'ingestion de données.",
    "de": "Implementieren Sie Datenqualitätstools wie Great Expectations oder AWS Glue DataBrew in der Datenaufnahmepipeline."
  },
  "Garantizar el comportamiento seguro del sistema frente a interacciones maliciosas o imprevistas.": {
    "en": "Ensure the secure behavior of the system against malicious or unforeseen interactions.",
    "pt": "Garanta o comportamento seguro do sistema contra interações maliciosas ou imprevistas.",
    "fr": "Assurer un comportement sécurisé du système contre les interactions malveillantes ou imprévues.",
    "de": "Stellen Sie das sichere Verhalten des Systems vor böswilligen oder unvorhergesehenen Interaktionen sicher."
  },
  "Asegurar que los datos de entrada prevengan errores de generalización y comportamientos anómalos.": {
    "en": "Ensure that input data prevents generalization errors and anomalous behavior.",
    "pt": "Certifique-se de que os dados de entrada evitem erros de generalização e comportamento anômalo.",
    "fr": "Assurez-vous que les données d’entrée évitent les erreurs de généralisation et les comportements anormaux.",
    "de": "Stellen Sie sicher, dass Eingabedaten Generalisierungsfehler und anomales Verhalten verhindern."
  },
  "Validar que los conjuntos de datos de entrenamiento, validación y prueba cumplan criterios de calidad, relevancia y representatividad.": {
    "en": "Validate that the training, validation and test data sets meet quality, relevance and representativeness criteria.",
    "pt": "Validar se os conjuntos de dados de treinamento, validação e teste atendem a critérios de qualidade, relevância e representatividade.",
    "fr": "Valider que les ensembles de données de formation, de validation et de test répondent aux critères de qualité, de pertinence et de représentativité.",
    "de": "Überprüfen Sie, ob die Trainings-, Validierungs- und Testdatensätze die Qualitäts-, Relevanz- und Repräsentativitätskriterien erfüllen."
  },
  "Desarrollar baterias de pruebas automatizadas con herramientas de Red Teaming de IA (ej. ART, TextAttack) e integrar escenarios de abuso en el pipeline de pruebas de integración.": {
    "en": "Develop automated test suites with AI Red Teaming tools (e.g. ART, TextAttack) and integrate abuse scenarios into the integration testing pipeline.",
    "pt": "Desenvolva suítes de testes automatizados com ferramentas AI Red Teaming (por exemplo, ART, TextAttack) e integre cenários de abuso ao pipeline de testes de integração.",
    "fr": "Développez des suites de tests automatisés avec les outils AI Red Teaming (par exemple ART, TextAttack) et intégrez des scénarios d'abus dans le pipeline de tests d'intégration.",
    "de": "Entwickeln Sie automatisierte Testsuiten mit AI Red Teaming-Tools (z. B. ART, TextAttack) und integrieren Sie Missbrauchsszenarien in die Integrationstest-Pipeline."
  },
  "Verificar scripts de perfilado de datos (Data Profiling) y pipelines de validación automatizada que comprueben completitud, distribución y validez estadística.": {
    "en": "Verify data profiling scripts (Data Profiling) and automated validation pipelines that verify completeness, distribution and statistical validity.",
    "pt": "Verifique scripts de criação de perfil de dados (Data Profiling) e pipelines de validação automatizados que verificam integridade, distribuição e validade estatística.",
    "fr": "Vérifiez les scripts de profilage des données (Data Profiling) et les pipelines de validation automatisés qui vérifient l'exhaustivité, la distribution et la validité statistique.",
    "de": "Überprüfen Sie Datenprofilierungsskripte (Data Profiling) und automatisierte Validierungspipelines, die Vollständigkeit, Verteilung und statistische Gültigkeit überprüfen."
  },
  "Ficha Técnica y Tarjeta del Modelo (Model Card)": {
    "en": "Technical Data Sheet and Model Card",
    "pt": "Ficha Técnica e Ficha Modelo",
    "fr": "Fiche technique et carte modèle",
    "de": "Technisches Datenblatt und Modellkarte"
  },
  "Documentación Técnica y Trazabilidad": {
    "en": "Technical Documentation and Traceability",
    "pt": "Documentação Técnica e Rastreabilidade",
    "fr": "Documentation technique et traçabilité",
    "de": "Technische Dokumentation und Rückverfolgbarkeit"
  },
  "Revisar los reportes de métricas de equidad (Fairness Metrics como Disparate Impact o Equalized Odds) generados en la fase de evaluación.": {
    "en": "Review the fairness metrics reports (Fairness Metrics such as Disparate Impact or Equalized Odds) generated in the evaluation phase.",
    "pt": "Revise os relatórios de métricas de justiça (Métricas de Justiça, como Impacto Disparado ou Probabilidades Equalizadas) gerados na fase de avaliação.",
    "fr": "Examinez les rapports de mesures d'équité (mesures d'équité telles que l'impact disparate ou les cotes égalisées) générés lors de la phase d'évaluation.",
    "de": "Überprüfen Sie die in der Bewertungsphase erstellten Fairness-Metrikberichte (Fairness-Metriken wie „Disparate Impact“ oder „Equalized Odds“)."
  },
  "Generar y mantener actualizada la documentación técnica detallada, incluyendo arquitectura, hiperparámetros y límites de funcionamiento.": {
    "en": "Generate and keep updated detailed technical documentation, including architecture, hyperparameters and operating limits.",
    "pt": "Gere e mantenha atualizada documentação técnica detalhada, incluindo arquitetura, hiperparâmetros e limites operacionais.",
    "fr": "Générez et maintenez à jour une documentation technique détaillée, y compris l'architecture, les hyperparamètres et les limites de fonctionnement.",
    "de": "Erstellen und aktualisieren Sie detaillierte technische Dokumentationen, einschließlich Architektur, Hyperparametern und Betriebsgrenzen."
  },
  "Integrar librerías de equidad en IA como Fairlearn o AIF360 para auditar y aplicar técnicas de re-ponderación o resampleo en los datos.": {
    "en": "Integrate fairness libraries in AI such as Fairlearn or AIF360 to audit and apply re-weighting or resampling techniques to the data.",
    "pt": "Integre bibliotecas de imparcialidade em IA, como Fairlearn ou AIF360, para auditar e aplicar técnicas de reponderação ou reamostragem aos dados.",
    "fr": "Intégrez des bibliothèques d'équité dans l'IA telles que Fairlearn ou AIF360 pour auditer et appliquer des techniques de repondération ou de rééchantillonnage aux données.",
    "de": "Integrieren Sie Fairness-Bibliotheken in KI wie Fairlearn oder AIF360, um die Daten zu prüfen und Neugewichtungs- oder Resampling-Techniken anzuwenden."
  },
  "Proporcionar transparencia técnica completa para auditorías internas y regulatorias.": {
    "en": "Provide complete technical transparency for internal and regulatory audits.",
    "pt": "Fornece total transparência técnica para auditorias internas e regulatórias.",
    "fr": "Assurer une transparence technique complète pour les audits internes et réglementaires.",
    "de": "Sorgen Sie für vollständige technische Transparenz bei internen und behördlichen Audits."
  },
  "Prevenir la discriminación algorítmica y asegurar la equidad en decisiones que afecten derechos fundamentales.": {
    "en": "Prevent algorithmic discrimination and ensure equity in decisions that affect fundamental rights.",
    "pt": "Prevenir a discriminação algorítmica e garantir a equidade nas decisões que afetam os direitos fundamentais.",
    "fr": "Prévenir la discrimination algorithmique et garantir l’équité dans les décisions qui affectent les droits fondamentaux.",
    "de": "Verhindern Sie algorithmische Diskriminierung und sorgen Sie für Gerechtigkeit bei Entscheidungen, die sich auf Grundrechte auswirken."
  },
  "Aplicar técnicas de detección y reducción de sesgos discriminatorios en los datos de entrenamiento y evaluación.": {
    "en": "Apply techniques for detecting and reducing discriminatory biases in training and evaluation data.",
    "pt": "Aplicar técnicas para detectar e reduzir preconceitos discriminatórios em dados de treinamento e avaliação.",
    "fr": "Appliquer des techniques pour détecter et réduire les biais discriminatoires dans les données de formation et d’évaluation.",
    "de": "Wenden Sie Techniken zur Erkennung und Reduzierung diskriminierender Vorurteile in Trainings- und Bewertungsdaten an."
  },
  "Inspeccionar la existencia y actualización del archivo Model Card o System Card adjunto a los artefactos del modelo en el registro de modelos (MLflow, SageMaker).": {
    "en": "Inspect the existence and update of the Model Card or System Card file attached to the model artifacts in the model registry (MLflow, SageMaker).",
    "pt": "Inspecione a existência e atualização do arquivo Model Card ou System Card anexado aos artefatos do modelo no registro do modelo (MLflow, SageMaker).",
    "fr": "Inspectez l'existence et la mise à jour du fichier de carte modèle ou de carte système attaché aux artefacts de modèle dans le registre de modèles (MLflow, SageMaker).",
    "de": "Überprüfen Sie das Vorhandensein und die Aktualisierung der Modellkarten- oder Systemkartendatei, die an die Modellartefakte in der Modellregistrierung (MLflow, SageMaker) angehängt ist."
  },
  "Elaboración y actualización de la documentación técnica detallada que demuestre el cumplimiento normativo ante autoridades competentes y organismos notificados.": {
    "en": "Preparation and updating of detailed technical documentation that demonstrates regulatory compliance with competent authorities and notified bodies.",
    "pt": "Preparação e atualização de documentação técnica detalhada que demonstre a conformidade regulamentar com autoridades competentes e organismos notificados.",
    "fr": "Préparation et mise à jour d'une documentation technique détaillée démontrant la conformité réglementaire auprès des autorités compétentes et des organismes notifiés.",
    "de": "Erstellung und Aktualisierung detaillierter technischer Dokumentationen, die die Einhaltung der Vorschriften durch zuständige Behörden und benannte Stellen nachweisen."
  },
  "Registro y Auditoría Automática (Logging)": {
    "en": "Automatic Registration and Audit (Logging)",
    "pt": "Registro e Auditoria Automáticos (Logging)",
    "fr": "Enregistrement et audit automatiques (journalisation)",
    "de": "Automatische Registrierung und Prüfung (Protokollierung)"
  },
  "Auditoría Inmutable de Logs de Inferencia": {
    "en": "Immutable Inference Log Audit",
    "pt": "Auditoria de log de inferência imutável",
    "fr": "Audit du journal d'inférence immuable",
    "de": "Unveränderliches Inferenzprotokoll-Audit"
  },
  "Permitir la reconstrucción posterior de incidentes y análisis Forense en sistemas en producción.": {
    "en": "Allow subsequent reconstruction of incidents and forensic analysis in systems in production.",
    "pt": "Permitir posterior reconstrução de incidentes e análises forenses em sistemas em produção.",
    "fr": "Permettre la reconstruction ultérieure des incidents et l'analyse médico-légale dans les systèmes en production.",
    "de": "Ermöglichen Sie die anschließende Rekonstruktion von Vorfällen und forensische Analysen in Systemen in der Produktion."
  },
  "Implementación de capacidades para la grabación automática de eventos a lo largo del ciclo de vida del sistema, garantizando trazabilidad para auditoría poscomercialización.": {
    "en": "Implementation of capabilities for automatic recording of events throughout the system lifecycle, ensuring traceability for post-market audit.",
    "pt": "Implementação de capacidades de registo automático de eventos ao longo do ciclo de vida do sistema, garantindo rastreabilidade para auditoria pós-comercialização.",
    "fr": "Mise en œuvre de capacités d'enregistrement automatique des événements tout au long du cycle de vie du système, garantissant la traçabilité pour l'audit post-commercialisation.",
    "de": "Implementierung von Funktionen zur automatischen Aufzeichnung von Ereignissen während des gesamten Systemlebenszyklus, um die Rückverfolgbarkeit für Post-Market-Audits sicherzustellen."
  },
  "Registrar automáticamente las entradas, salidas, metadatos de ejecución y decisiones del sistema con un nivel de detalle adecuado para trazabilidad.": {
    "en": "Automatically record inputs, outputs, execution metadata, and system decisions at a level of detail appropriate for traceability.",
    "pt": "Registre automaticamente entradas, saídas, metadados de execução e decisões do sistema em um nível de detalhe apropriado para rastreabilidade.",
    "fr": "Enregistrez automatiquement les entrées, les sorties, les métadonnées d'exécution et les décisions système à un niveau de détail approprié pour la traçabilité.",
    "de": "Erfassen Sie Eingaben, Ausgaben, Ausführungsmetadaten und Systementscheidungen automatisch mit einem für die Rückverfolgbarkeit geeigneten Detaillierungsgrad."
  },
  "Adoptar el estándar de Model Cards de Google/HuggingFace e integrar su generación automática mediante librerías de MLOps en la fase de empaquetado.": {
    "en": "Adopt the Google/HuggingFace Model Cards standard and integrate its automatic generation through MLOps libraries in the packaging phase.",
    "pt": "Adote o padrão Google/HuggingFace Model Cards e integre sua geração automática por meio de bibliotecas MLOps na fase de empacotamento.",
    "fr": "Adoptez le standard Google/HuggingFace Model Cards et intégrez sa génération automatique via les bibliothèques MLOps dans la phase de packaging.",
    "de": "Übernehmen Sie den Google/HuggingFace Model Cards-Standard und integrieren Sie dessen automatische Generierung durch MLOps-Bibliotheken in der Verpackungsphase."
  },
  "Monitorear e identificar desviaciones de rendimiento (drift) o modificaciones del sistema que representen un riesgo sustancial.": {
    "en": "Monitor and identify performance deviations (drift) or system modifications that represent substantial risk.",
    "pt": "Monitore e identifique desvios de desempenho (desvios) ou modificações no sistema que representem riscos substanciais.",
    "fr": "Surveiller et identifier les écarts de performance (dérive) ou les modifications du système qui représentent un risque substantiel.",
    "de": "Überwachen und identifizieren Sie Leistungsabweichungen (Drift) oder Systemänderungen, die ein erhebliches Risiko darstellen."
  },
  "Verificar que los logs de inferencia se emitan en formato estructurado (JSON), incluyan timestamps ISO 8601, hashes de trazabilidad y se almacenen en repositorios WORM o immutables.": {
    "en": "Verify that inference logs are issued in structured format (JSON), include ISO 8601 timestamps, traceability hashes, and are stored in WORM or immutable repositories.",
    "pt": "Verifique se os logs de inferência são emitidos em formato estruturado (JSON), incluem carimbos de data/hora ISO 8601, hashes de rastreabilidade e estão armazenados em WORM ou em repositórios imutáveis.",
    "fr": "Vérifiez que les journaux d'inférence sont émis au format structuré (JSON), incluent des horodatages ISO 8601, des hachages de traçabilité et sont stockés dans WORM ou dans des référentiels immuables.",
    "de": "Stellen Sie sicher, dass Inferenzprotokolle im strukturierten Format (JSON) ausgegeben werden, ISO 8601-Zeitstempel und Rückverfolgbarkeits-Hashes enthalten und in WORM oder unveränderlichen Repositorys gespeichert sind."
  },
  "Configurar pipelines de logging centralizado con Fluentd/Logstash enviando eventos a almacenamiento inmutable (Amazon S3 Object Lock o Elasticsearch con ILM).": {
    "en": "Set up centralized logging pipelines with Fluentd/Logstash by sending events to immutable storage (Amazon S3 Object Lock or Elasticsearch with ILM).",
    "pt": "Configure pipelines de registro centralizados com Fluentd/Logstash enviando eventos para armazenamento imutável (Amazon S3 Object Lock ou Elasticsearch com ILM).",
    "fr": "Configurez des pipelines de journalisation centralisés avec Fluentd/Logstash en envoyant des événements vers un stockage immuable (Amazon S3 Object Lock ou Elasticsearch avec ILM).",
    "de": "Richten Sie zentralisierte Protokollierungspipelines mit Fluentd/Logstash ein, indem Sie Ereignisse an unveränderlichen Speicher senden (Amazon S3 Object Lock oder Elasticsearch mit ILM)."
  },
  "Detección Automática de Modificaciones Sustanciales": {
    "en": "Automatic Detection of Substantial Modifications",
    "pt": "Detecção automática de modificações substanciais",
    "fr": "Détection automatique des modifications substantielles",
    "de": "Automatische Erkennung wesentlicher Änderungen"
  },
  "Desplegar herramientas de monitoreo continuo de IA como Evidently AI, Arize o Whylogs conectadas a PagerDuty para alertas inmediatas.": {
    "en": "Deploy continuous AI monitoring tools like Evidently AI, Arize or Whylogs connected to PagerDuty for immediate alerts.",
    "pt": "Implante ferramentas de monitoramento contínuo de IA, como Evidently AI, Arize ou Whylogs, conectadas ao PagerDuty para alertas imediatos.",
    "fr": "Déployez des outils de surveillance continue de l'IA comme Evidently AI, Arize ou Whylogs connectés à PagerDuty pour des alertes immédiates.",
    "de": "Setzen Sie kontinuierliche KI-Überwachungstools wie Evidently AI, Arize oder Whylogs ein, die mit PagerDuty verbunden sind, um sofortige Warnungen zu erhalten."
  },
  "Alertar proactivamente ante la degradación del modelo o variaciones no autorizadas en producción.": {
    "en": "Proactively alert against model degradation or unauthorized variations in production.",
    "pt": "Alerte proativamente contra a degradação do modelo ou variações não autorizadas na produção.",
    "fr": "Alertez de manière proactive contre la dégradation du modèle ou les variations non autorisées de la production.",
    "de": "Warnen Sie proaktiv vor Modellverschlechterungen oder unbefugten Abweichungen in der Produktion."
  },
  "Comprobar alertas configuradas para Data Drift y Concept Drift con umbrales p-value predefinidos en plataformas de monitoreo de IA.": {
    "en": "Check alerts configured for Data Drift and Concept Drift with predefined p-value thresholds in AI monitoring platforms.",
    "pt": "Verifique os alertas configurados para Data Drift e Concept Drift com limites de valor p predefinidos em plataformas de monitoramento de IA.",
    "fr": "Vérifiez les alertes configurées pour Data Drift et Concept Drift avec des seuils de valeur p prédéfinis dans les plateformes de surveillance de l'IA.",
    "de": "Überprüfen Sie die für Datendrift und Konzeptdrift konfigurierten Warnungen mit vordefinierten p-Wert-Schwellenwerten in KI-Überwachungsplattformen."
  },
  "Ejecutar pruebas de penetración o simulaciones funcionales del botón de parada de emergencia (Kill Switch) en entornos de staging o producción.": {
    "en": "Run penetration tests or functional simulations of the emergency stop button (Kill Switch) in staging or production environments.",
    "pt": "Execute testes de penetração ou simulações funcionais do botão de parada de emergência (Kill Switch) em ambientes de preparação ou produção.",
    "fr": "Exécutez des tests d'intrusion ou des simulations fonctionnelles du bouton d'arrêt d'urgence (Kill Switch) dans des environnements de préparation ou de production.",
    "de": "Führen Sie Penetrationstests oder Funktionssimulationen des Not-Aus-Schalters (Kill Switch) in Staging- oder Produktionsumgebungen durch."
  },
  "Supervisión Humana e Intervención (Human-in-the-Loop)": {
    "en": "Human Supervision and Intervention (Human-in-the-Loop)",
    "pt": "Supervisão e Intervenção Humana (Human-in-the-Loop)",
    "fr": "Supervision et intervention humaines (humain dans la boucle)",
    "de": "Menschliche Überwachung und Intervention (Human-in-the-Loop)"
  },
  "Implementar un patrón de arquitectura Circuit Breaker en la API Gateway o capa de orquestación que permita degradar el servicio o desviar peticiones a un flujo manual instantáneamente.": {
    "en": "Implement a Circuit Breaker architecture pattern in the API Gateway or orchestration layer that allows you to degrade the service or divert requests to a manual flow instantly.",
    "pt": "Implemente um padrão de arquitetura Circuit Breaker no API Gateway ou na camada de orquestração que permite degradar o serviço ou desviar solicitações para um fluxo manual instantaneamente.",
    "fr": "Implémentez un modèle d'architecture Circuit Breaker dans la passerelle API ou la couche d'orchestration qui vous permet de dégrader le service ou de rediriger instantanément les requêtes vers un flux manuel.",
    "de": "Implementieren Sie ein Circuit-Breaker-Architekturmuster im API-Gateway oder auf der Orchestrierungsebene, das es Ihnen ermöglicht, den Dienst zu verschlechtern oder Anfragen sofort auf einen manuellen Ablauf umzuleiten."
  },
  "Garantía de un nivel adecuado de precisión, robustez operacional y ciberseguridad para resistir intentos de manipulación adversarial, inyecciones de prompts y degradación.": {
    "en": "Guarantee of an adequate level of precision, operational robustness and cybersecurity to resist attempts at adversarial manipulation, prompt injections and degradation.",
    "pt": "Garantia de um nível adequado de precisão, robustez operacional e segurança cibernética para resistir a tentativas de manipulação adversária, injeções imediatas e degradação.",
    "fr": "Garantie d’un niveau adéquat de précision, de robustesse opérationnelle et de cybersécurité pour résister aux tentatives de manipulation adverse, d’injections ponctuelles et de dégradation.",
    "de": "Gewährleistung eines angemessenen Maßes an Präzision, betrieblicher Robustheit und Cybersicherheit, um gegnerischen Manipulationsversuchen, sofortigen Injektionen und Degradierungen standzuhalten."
  },
  "Proporcionar una funcionalidad técnica de anulación humana e interrupción inmediata del sistema o sus salidas.": {
    "en": "Provide technical functionality for human override and immediate interruption of the system or its outputs.",
    "pt": "Fornecer funcionalidade técnica para controle humano e interrupção imediata do sistema ou de suas saídas.",
    "fr": "Fournir des fonctionnalités techniques pour le remplacement humain et l'interruption immédiate du système ou de ses sorties.",
    "de": "Bereitstellung technischer Funktionen zur menschlichen Übersteuerung und sofortigen Unterbrechung des Systems oder seiner Ausgänge."
  },
  "Garantizar el control humano efectivo para prevenir daños inminentes o sistemáticos.": {
    "en": "Ensure effective human control to prevent imminent or systematic harm.",
    "pt": "Garantir o controle humano eficaz para prevenir danos iminentes ou sistemáticos.",
    "fr": "Assurer un contrôle humain efficace pour prévenir tout dommage imminent ou systématique.",
    "de": "Sorgen Sie für eine wirksame menschliche Kontrolle, um drohenden oder systematischen Schaden zu verhindern."
  },
  "Diseño de interfaces y herramientas que permitan a personas capacitadas supervisar, comprender, invalidar o detener las salidas del sistema de IA.": {
    "en": "Design interfaces and tools that allow trained people to monitor, understand, override or stop the outputs of the AI ​​system.",
    "pt": "Projete interfaces e ferramentas que permitam que pessoas treinadas monitorem, entendam, substituam ou interrompam as saídas do sistema de IA.",
    "fr": "Concevoir des interfaces et des outils qui permettent à des personnes formées de surveiller, comprendre, remplacer ou arrêter les sorties du système d'IA.",
    "de": "Entwerfen Sie Schnittstellen und Tools, die es geschulten Personen ermöglichen, die Ausgaben des KI-Systems zu überwachen, zu verstehen, zu überschreiben oder zu stoppen."
  },
  "Mecanismo de Interrupción de Emergencia (Kill Switch)": {
    "en": "Emergency Interruption Mechanism (Kill Switch)",
    "pt": "Mecanismo de interrupção de emergência (Kill Switch)",
    "fr": "Mécanisme d'interruption d'urgence (Kill Switch)",
    "de": "Notfall-Unterbrechungsmechanismus (Kill Switch)"
  },
  "Precisión, Robustez y Ciberseguridad": {
    "en": "Precision, Robustness and Cybersecurity",
    "pt": "Precisão, Robustez e Cibersegurança",
    "fr": "Précision, Robustesse et Cybersécurité",
    "de": "Präzision, Robustheit und Cybersicherheit"
  },
  "Proteger el modelo contra manipulaciones maliciosas que alteren su comportamiento, salidas o confidencialidad.": {
    "en": "Protect the model against malicious manipulations that alter its behavior, outputs or confidentiality.",
    "pt": "Proteja o modelo contra manipulações maliciosas que alterem seu comportamento, resultados ou confidencialidade.",
    "fr": "Protégez le modèle contre les manipulations malveillantes qui altèrent son comportement, ses sorties ou sa confidentialité.",
    "de": "Schützen Sie das Modell vor böswilligen Manipulationen, die sein Verhalten, seine Ergebnisse oder seine Vertraulichkeit verändern."
  },
  "Implementar salvaguardas y mecanismos defensivos contra inyecciones de prompts, envenenamiento de datos/RAG y evasión de modelos.": {
    "en": "Implement safeguards and defensive mechanisms against prompt injections, data/RAG poisoning, and model evasion.",
    "pt": "Implemente salvaguardas e mecanismos defensivos contra injeções imediatas, envenenamento de dados/RAG e evasão de modelo.",
    "fr": "Mettez en œuvre des mesures de protection et des mécanismes de défense contre les injections rapides, l’empoisonnement des données/RAG et l’évasion de modèle.",
    "de": "Implementieren Sie Schutzmaßnahmen und Abwehrmechanismen gegen sofortige Injektionen, Daten-/RAG-Poisoning und Modellumgehung."
  },
  "Protección Contra Ataques Adversariales e Inyección de Prompts": {
    "en": "Protection Against Adversarial Attacks and Prompt Injection",
    "pt": "Proteção contra ataques adversários e injeção imediata",
    "fr": "Protection contre les attaques contradictoires et injection rapide",
    "de": "Schutz vor gegnerischen Angriffen und sofortiger Injektion"
  },
  "Diseñar la arquitectura para ser resiliente ante fallos de componentes, inconsistencias de datos de entrada o pérdida de conectividad.": {
    "en": "Design the architecture to be resilient to component failures, input data inconsistencies, or loss of connectivity.",
    "pt": "Projete a arquitetura para ser resiliente a falhas de componentes, inconsistências de dados de entrada ou perda de conectividade.",
    "fr": "Concevez l'architecture pour qu'elle soit résiliente aux pannes de composants, aux incohérences des données d'entrée ou à la perte de connectivité.",
    "de": "Entwerfen Sie die Architektur so, dass sie gegenüber Komponentenausfällen, Inkonsistenzen der Eingabedaten oder Verbindungsverlusten widerstandsfähig ist."
  },
  "Realizar pruebas de seguridad defensiva verificando la integración de filtros de entrada/salida y clasificadores de seguridad antes del procesamiento por el LLM/modelo.": {
    "en": "Perform defensive security testing by verifying the integration of input/output filters and security classifiers before processing by the LLM/model.",
    "pt": "Execute testes de segurança defensivos verificando a integração de filtros de entrada/saída e classificadores de segurança antes do processamento pelo LLM/modelo.",
    "fr": "Effectuez des tests de sécurité défensifs en vérifiant l'intégration des filtres d'entrée/sortie et des classificateurs de sécurité avant le traitement par le LLM/modèle.",
    "de": "Führen Sie defensive Sicherheitstests durch, indem Sie die Integration von Eingabe-/Ausgabefiltern und Sicherheitsklassifizierern vor der Verarbeitung durch das LLM/Modell überprüfen."
  },
  "Ley Federal de Protección al Consumidor (LFPC)": {
    "en": "Federal Consumer Protection Law (LFPC)",
    "pt": "Lei Federal de Defesa do Consumidor (LFPC)",
    "fr": "Loi fédérale sur la protection des consommateurs (LFPC)",
    "de": "Bundesverbraucherschutzgesetz (LFPC)"
  },
  "Resiliencia y Tolerancia a Fallos Operacionales": {
    "en": "Resilience and Operational Fault Tolerance",
    "pt": "Resiliência e tolerância a falhas operacionais",
    "fr": "Résilience et tolérance aux pannes opérationnelles",
    "de": "Belastbarkeit und betriebliche Fehlertoleranz"
  },
  "México (PROFECO)": {
    "en": "Mexico (PROFECO)",
    "pt": "México (PROFECO)",
    "fr": "Mexique (PROFECO)",
    "de": "Mexiko (PROFECO)"
  },
  "Mantener la continuidad operativa y evitar decisiones erróneas por degradación del entorno.": {
    "en": "Maintain operational continuity and avoid erroneous decisions due to environmental degradation.",
    "pt": "Mantenha a continuidade operacional e evite decisões erradas devido à degradação ambiental.",
    "fr": "Maintenir la continuité opérationnelle et éviter les décisions erronées dues à la dégradation de l’environnement.",
    "de": "Sorgen Sie für die Betriebskontinuität und vermeiden Sie Fehlentscheidungen aufgrund von Umweltschäden."
  },
  "Desplegar un cortafuegos para IA (LLM Guard, NeMo Guardrails) e implementar sanitized prompts y cifrado de embeddings en la base de datos vectorial RAG.": {
    "en": "Deploy a firewall for AI (LLM Guard, NeMo Guardrails) and implement sanitized prompts and encryption of embeddings in the RAG vector database.",
    "pt": "Implante um firewall para IA (LLM Guard, NeMo Guardrails) e implemente prompts higienizados e criptografia de embeddings no banco de dados de vetores RAG.",
    "fr": "Déployez un pare-feu pour l'IA (LLM Guard, NeMo Guardrails) et implémentez des invites nettoyées et le cryptage des intégrations dans la base de données vectorielles RAG.",
    "de": "Stellen Sie eine Firewall für KI bereit (LLM Guard, NeMo Guardrails) und implementieren Sie bereinigte Eingabeaufforderungen und Verschlüsselung von Einbettungen in der RAG-Vektordatenbank."
  },
  "Implementar patrones de redundancia activa, fallbacks deterministas y validación estricta de esquemas Pydantic/JSON Schema en los endpoints del modelo.": {
    "en": "Implement active redundancy patterns, deterministic fallbacks, and strict Pydantic/JSON Schema validation on model endpoints.",
    "pt": "Implemente padrões de redundância ativos, substitutos determinísticos e validação estrita do esquema Pydantic/JSON em endpoints do modelo.",
    "fr": "Implémentez des modèles de redondance active, des solutions de secours déterministes et une validation stricte du schéma Pydantic/JSON sur les points de terminaison du modèle.",
    "de": "Implementieren Sie aktive Redundanzmuster, deterministische Fallbacks und eine strenge Pydantic/JSON-Schemavalidierung auf Modellendpunkten."
  },
  "Revisar los tests de Chaos Engineering e inspeccionar políticas de reintentos, timeouts y fallbacks a modelos secundarios o reglas heurísticas.": {
    "en": "Review Chaos Engineering tests and inspect retry policies, timeouts and fallbacks to secondary models or heuristic rules.",
    "pt": "Revise os testes da Chaos Engineering e inspecione políticas de repetição, tempos limite e substitutos para modelos secundários ou regras heurísticas.",
    "fr": "Passez en revue les tests Chaos Engineering et inspectez les politiques de nouvelle tentative, les délais d’attente et les replis vers des modèles secondaires ou des règles heuristiques.",
    "de": "Sehen Sie sich Chaos Engineering-Tests an und prüfen Sie Wiederholungsrichtlinien, Zeitüberschreitungen und Rückgriffe auf sekundäre Modelle oder heuristische Regeln."
  },
  "Identificación y Transparencia en la Interacción con IA": {
    "en": "Identification and Transparency in Interaction with AI",
    "pt": "Identificação e Transparência na Interação com IA",
    "fr": "Identification et transparence en interaction avec l'IA",
    "de": "Identifikation und Transparenz in der Interaktion mit KI"
  },
  "Marco legal mexicano de orden público e interés social que regula y protege los derechos de los consumidores en plataformas digitales, comercio electrónico, chatbots comerciales, sistemas de recomendación y contratación automatizada por IA.": {
    "en": "Mexican legal framework of public order and social interest that regulates and protects consumer rights on digital platforms, electronic commerce, commercial chatbots, recommendation systems and AI-automated contracting.",
    "pt": "Marco jurídico mexicano de ordem pública e interesse social que regula e protege os direitos do consumidor em plataformas digitais, comércio eletrônico, chatbots comerciais, sistemas de recomendação e contratação automatizada de IA.",
    "fr": "Cadre juridique mexicain d'ordre public et d'intérêt social qui réglemente et protège les droits des consommateurs sur les plateformes numériques, le commerce électronique, les chatbots commerciaux, les systèmes de recommandation et les contrats automatisés par l'IA.",
    "de": "Mexikanischer Rechtsrahmen für öffentliche Ordnung und soziale Interessen, der Verbraucherrechte auf digitalen Plattformen, elektronischem Handel, kommerziellen Chatbots, Empfehlungssystemen und KI-automatisierten Vertragsabschlüssen regelt und schützt."
  },
  "El sistema debe informar de manera visible, clara y comprensible al inicio de toda conversación que el usuario está interactuando con un agente de Inteligencia Artificial.": {
    "en": "The system must inform in a visible, clear and understandable way at the beginning of every conversation that the user is interacting with an Artificial Intelligence agent.",
    "pt": "O sistema deve informar de forma visível, clara e compreensível no início de cada conversa que o usuário está interagindo com um agente de Inteligência Artificial.",
    "fr": "Le système doit informer de manière visible, claire et compréhensible au début de chaque conversation que l'utilisateur interagit avec un agent d'Intelligence Artificielle.",
    "de": "Das System muss zu Beginn jedes Gesprächs sichtbar, klar und verständlich darüber informieren, dass der Benutzer mit einem Agenten der künstlichen Intelligenz interagiert."
  },
  "Disposiciones para garantizar que el consumidor conozca de forma inmediata e inequívoca que interactúa con un sistema automatizado de IA y no con una persona física, conforme al Art. 76 BIS de la LFPC.": {
    "en": "Provisions to guarantee that the consumer knows immediately and unequivocally that they are interacting with an automated AI system and not with a natural person, in accordance with Art. 76 BIS of the LFPC.",
    "pt": "Disposições para garantir que o consumidor saiba imediata e inequivocamente que está interagindo com um sistema automatizado de IA e não com uma pessoa física, nos termos do art. 76 BIS da LFPC.",
    "fr": "Dispositions garantissant que le consommateur sait immédiatement et sans équivoque qu'il interagit avec un système d'IA automatisé et non avec une personne physique, conformément à l'art. 76 BIS du LFPC.",
    "de": "Bestimmungen, die gewährleisten, dass der Verbraucher sofort und eindeutig weiß, dass er mit einem automatisierten KI-System und nicht mit einer natürlichen Person interagiert, gemäß Art. 76 BIS des LFPC."
  },
  "Revelación Obligatoria de Identidad del Asistente Virtual": {
    "en": "Mandatory Disclosure of Virtual Assistant Identity",
    "pt": "Divulgação obrigatória da identidade do assistente virtual",
    "fr": "Divulgation obligatoire de l'identité de l'assistant virtuel",
    "de": "Obligatorische Offenlegung der Identität des virtuellen Assistenten"
  },
  "Garantizar la transparencia comercial y el derecho del consumidor a saber si interactúa con un humano o un bot automatizado.": {
    "en": "Guarantee commercial transparency and the consumer's right to know if they interact with a human or an automated bot.",
    "pt": "Garantir a transparência comercial e o direito do consumidor de saber se interage com um humano ou com um bot automatizado.",
    "fr": "Garantir la transparence commerciale et le droit du consommateur de savoir s’il interagit avec un humain ou un robot automatisé.",
    "de": "Gewährleisten Sie kommerzielle Transparenz und das Recht des Verbrauchers zu erfahren, ob er mit einem Menschen oder einem automatisierten Bot interagiert."
  },
  "Verificar en la interfaz de usuario que el mensaje de bienvenida y el encabezado del chat identifiquen explícitamente al asistente como 'Asistente de IA' o 'Bot Automatizado'.": {
    "en": "Verify in the user interface that the welcome message and chat header explicitly identify the assistant as 'AI Assistant' or 'Automated Bot'.",
    "pt": "Verifique na interface do usuário se a mensagem de boas-vindas e o cabeçalho do bate-papo identificam explicitamente o assistente como 'AI Assistant' ou 'Automated Bot'.",
    "fr": "Vérifiez dans l'interface utilisateur que le message de bienvenue et l'en-tête de discussion identifient explicitement l'assistant comme « AI Assistant » ou « Automated Bot ».",
    "de": "Stellen Sie in der Benutzeroberfläche sicher, dass die Willkommensnachricht und der Chat-Header den Assistenten explizit als „AI Assistant“ oder „Automated Bot“ identifizieren."
  },
  "Inspeccionar las respuestas del asistente ante preguntas sobre sus facultades legales, transaccionales y de resolución de quejas.": {
    "en": "Inspect the assistant's responses to questions about their legal, transactional, and complaint resolution powers.",
    "pt": "Inspecione as respostas do assistente a perguntas sobre seus poderes legais, transacionais e de resolução de reclamações.",
    "fr": "Inspectez les réponses de l'assistant aux questions sur ses pouvoirs juridiques, transactionnels et de résolution des plaintes.",
    "de": "Überprüfen Sie die Antworten des Assistenten auf Fragen zu seinen rechtlichen, transaktionsbezogenen und Beschwerdelösungsbefugnissen."
  },
  "Evitar falsas expectativas en el consumidor sobre las facultades del asistente automatizado.": {
    "en": "Avoid false expectations in the consumer about the powers of the automated assistant.",
    "pt": "Evite falsas expectativas no consumidor sobre os poderes do assistente automatizado.",
    "fr": "Évitez les fausses attentes du consommateur quant aux pouvoirs de l’assistant automatisé.",
    "de": "Vermeiden Sie falsche Erwartungen des Verbrauchers an die Leistungsfähigkeit des automatisierten Assistenten."
  },
  "Información Clara sobre Alcance, Limitaciones y Términos": {
    "en": "Clear Information on Scope, Limitations and Terms",
    "pt": "Informações claras sobre escopo, limitações e termos",
    "fr": "Des informations claires sur la portée, les limites et les conditions",
    "de": "Klare Informationen zu Umfang, Einschränkungen und Bedingungen"
  },
  "El asistente de IA debe informar con exactitud sus capacidades operativas, horarios de atención de soporte humano y condiciones de prestación del servicio.": {
    "en": "The AI ​​assistant must accurately report its operational capabilities, human support hours, and service delivery conditions.",
    "pt": "O assistente de IA deve relatar com precisão suas capacidades operacionais, horas de suporte humano e condições de prestação de serviços.",
    "fr": "L'assistant IA doit rendre compte avec précision de ses capacités opérationnelles, des heures d'assistance humaine et des conditions de prestation de services.",
    "de": "Der KI-Assistent muss seine betrieblichen Fähigkeiten, die Stunden des menschlichen Supports und die Bedingungen für die Leistungserbringung genau angeben."
  },
  "Configurar en el frontend y en el prompt del sistema un saludo inicial no modificable que declare: 'Hola, soy un asistente virtual impulsado por IA'.": {
    "en": "Configure in the frontend and in the system prompt a non-modifiable initial greeting that declares: 'Hello, I am a virtual assistant powered by AI.'",
    "pt": "Configure no frontend e no prompt do sistema uma saudação inicial não modificável que declara: 'Olá, sou um assistente virtual alimentado por IA.'",
    "fr": "Configurez dans le frontend et dans l'invite système un message d'accueil initial non modifiable qui déclare : « Bonjour, je suis un assistant virtuel alimenté par l'IA. »",
    "de": "Konfigurieren Sie im Frontend und in der Systemaufforderung eine nicht veränderbare anfängliche Begrüßung, die besagt: „Hallo, ich bin ein virtueller Assistent mit KI-Unterstützung.“"
  },
  "Incorporar en la base de conocimiento un documento canónico de capacidades y límites operativos del bot para guiar las respuestas del modelo.": {
    "en": "Incorporate into the knowledge base a canonical document of the bot's capabilities and operational limits to guide the model's responses.",
    "pt": "Incorpore na base de conhecimento um documento canônico das capacidades e limites operacionais do bot para orientar as respostas do modelo.",
    "fr": "Incorporer dans la base de connaissances un document canonique des capacités et des limites opérationnelles du bot pour guider les réponses du modèle.",
    "de": "Integrieren Sie in die Wissensdatenbank ein kanonisches Dokument der Fähigkeiten und Betriebsgrenzen des Bots, um die Reaktionen des Modells zu steuern."
  },
  "Auditar la integración técnica con APIs de catálogo o bases de datos relacionales y constatar que el modelo no invente cotizaciones.": {
    "en": "Audit the technical integration with catalog APIs or relational databases and verify that the model does not invent quotes.",
    "pt": "Audite a integração técnica com APIs de catálogo ou bancos de dados relacionais e verifique se o modelo não inventa cotações.",
    "fr": "Auditez l'intégration technique avec les API de catalogue ou les bases de données relationnelles et vérifiez que le modèle n'invente pas de devis.",
    "de": "Überprüfen Sie die technische Integration mit Katalog-APIs oder relationalen Datenbanken und stellen Sie sicher, dass das Modell keine Zitate erfindet."
  },
  "Veracidad de la Información y Prevención de Alucinaciones": {
    "en": "Veracity of Information and Prevention of Hallucinations",
    "pt": "Veracidade das Informações e Prevenção de Alucinações",
    "fr": "Véracité des informations et prévention des hallucinations",
    "de": "Richtigkeit der Informationen und Prävention von Halluzinationen"
  },
  "Implementar llamadas a herramientas (tool calling / function calling) obligatorias para consultas de precios y forzar temperatura 0.0 en cotizaciones.": {
    "en": "Implement mandatory tool calling / function calling for price queries and force 0.0 temperature in quotes.",
    "pt": "Implementar chamada obrigatória de ferramenta/função para consultas de preços e forçar temperatura 0,0 entre cotações.",
    "fr": "Implémentez des appels d'outils/de fonctions obligatoires pour les requêtes de prix et forcez une température de 0,0 dans les guillemets.",
    "de": "Implementieren Sie obligatorische Toolaufrufe/Funktionsaufrufe für Preisabfragen und erzwingen Sie eine Temperatur von 0,0 in Angeboten."
  },
  "Carácter Vinculante de Ofertas y Promociones Emitidas por la IA": {
    "en": "Binding Nature of Offers and Promotions Issued by AI",
    "pt": "Caráter vinculativo das ofertas e promoções emitidas pela AI",
    "fr": "Caractère contraignant des offres et promotions émises par AI",
    "de": "Verbindlichkeit der Angebote und Werbeaktionen von AI"
  },
  "Factual Grounding en Precios, Tarifas y Disponibilidad": {
    "en": "Factual Grounding in Prices, Rates and Availability",
    "pt": "Fundamentos factuais em preços, tarifas e disponibilidade",
    "fr": "Base factuelle sur les prix, les tarifs et la disponibilité",
    "de": "Sachliche Begründung zu Preisen, Tarifen und Verfügbarkeit"
  },
  "Toda oferta, descuento, paquete o condición comercial informada al consumidor por el agente de IA dentro de su ámbito autorizado debe ser respetada por la empresa.": {
    "en": "Any offer, discount, package or commercial condition informed to the consumer by the AI ​​agent within its authorized scope must be respected by the company.",
    "pt": "Qualquer oferta, desconto, pacote ou condição comercial informada ao consumidor pelo agente AI dentro do seu âmbito autorizado deverá ser respeitada pela empresa.",
    "fr": "Toute offre, remise, forfait ou condition commerciale communiquée au consommateur par l'agent AI dans le cadre de son périmètre autorisé doit être respectée par l'entreprise.",
    "de": "Alle Angebote, Rabatte, Pakete oder Geschäftsbedingungen, die der KI-Agent dem Verbraucher im Rahmen seines autorisierten Umfangs mitteilt, müssen vom Unternehmen respektiert werden."
  },
  "El agente de IA debe consultar exclusivamente fuentes autorizadas y estructuradas en tiempo real para informar precios, cargos y existencias, prohibiendo la estimación o alucinación de montos.": {
    "en": "The AI ​​agent must consult exclusively authorized and structured sources in real time to report prices, charges and stocks, prohibiting the estimation or hallucination of amounts.",
    "pt": "O agente de IA deverá consultar exclusivamente fontes autorizadas e estruturadas em tempo real para informar preços, cobranças e estoques, vedando a estimativa ou alucinação de valores.",
    "fr": "L'agent IA doit consulter exclusivement des sources autorisées et structurées en temps réel pour signaler les prix, les frais et les stocks, interdisant l'estimation ou l'hallucination des montants.",
    "de": "Der KI-Agent muss in Echtzeit ausschließlich autorisierte und strukturierte Quellen konsultieren, um Preise, Gebühren und Bestände zu melden, wobei die Schätzung oder Halluzination von Beträgen verboten ist."
  },
  "Exigencias de veracidad y comprobabilidad de la información comercial provista por modelos de lenguaje, prohibiendo afirmaciones falsas, alucinaciones de precios o promociones inexistentes.": {
    "en": "Requirements for veracity and verifiability of commercial information provided by language models, prohibiting false statements, price hallucinations or non-existent promotions.",
    "pt": "Requisitos de veracidade e verificabilidade da informação comercial fornecida por modelos de linguagem, proibindo declarações falsas, alucinações de preços ou promoções inexistentes.",
    "fr": "Exigences de véracité et de vérifiabilité des informations commerciales fournies par des modèles de langage, interdisant les fausses déclarations, les hallucinations de prix ou les promotions inexistantes.",
    "de": "Anforderungen an die Richtigkeit und Überprüfbarkeit der von Sprachmodellen bereitgestellten kommerziellen Informationen, Verbot falscher Angaben, Preishalluzinationen oder nicht vorhandener Werbeaktionen."
  },
  "Cumplir con el Art. 7 de la LFPC que obliga al proveedor a respetar los precios y condiciones informadas al consumidor.": {
    "en": "Comply with Art. 7 of the LFPC, which obliges the supplier to respect the prices and conditions informed to the consumer.",
    "pt": "Cumprir com o art. 7º da LFPC, que obriga o fornecedor a respeitar os preços e condições informados ao consumidor.",
    "fr": "Se conformer à l'art. 7 de la LFPC, qui oblige le fournisseur à respecter les prix et conditions communiqués au consommateur.",
    "de": "Beachten Sie Art. 7 des LFPC, der den Lieferanten verpflichtet, die dem Verbraucher mitgeteilten Preise und Bedingungen einzuhalten."
  },
  "Resumen Previo y Aceptación Expresa de la Transacción": {
    "en": "Previous Summary and Express Acceptance of the Transaction",
    "pt": "Resumo Anterior e Aceitação Expressa da Transação",
    "fr": "Récapitulatif précédent et acceptation expresse de la transaction",
    "de": "Vorherige Zusammenfassung und ausdrückliche Annahme der Transaktion"
  },
  "Prevenir discrepancias entre lo prometido por el bot y lo facturado por el sistema comercial conforme al Art. 7 y 48 de la LFPC.": {
    "en": "Prevent discrepancies between what was promised by the bot and what was billed by the commercial system in accordance with Art. 7 and 48 of the LFPC.",
    "pt": "Evitar discrepâncias entre o que foi prometido pelo bot e o que foi faturado pelo sistema comercial de acordo com o Art. 7º e 48º da LFPC.",
    "fr": "Éviter les écarts entre ce qui a été promis par le bot et ce qui a été facturé par le système commercial conformément à l'art. 7 et 48 du LFPC.",
    "de": "Verhindern Sie Diskrepanzen zwischen dem, was der Bot versprochen hat, und dem, was das kommerzielle System gemäß Art. 7 and 48 of the LFPC."
  },
  "Generar un código de folio de cotización temporal con vigencia verificada en la base de datos de pedidos al momento de ofrecer un precio.": {
    "en": "Generate a temporary quote folio code with verified validity in the order database at the time of offering a price.",
    "pt": "Gere um código de fólio de cotação temporário com validade verificada no banco de dados de pedidos no momento da oferta de um preço.",
    "fr": "Générez un code folio de devis temporaire avec une validité vérifiée dans la base de données des commandes au moment de l'offre d'un prix.",
    "de": "Generieren Sie zum Zeitpunkt des Preisangebots einen temporären Angebotsfoliocode mit überprüfter Gültigkeit in der Bestelldatenbank."
  },
  "Verificar la persistencia y trazabilidad de las cotizaciones emitidas por el bot asociadas a un identificador de sesión y plazo de validez.": {
    "en": "Verify the persistence and traceability of the quotes issued by the bot associated with a session identifier and validity period.",
    "pt": "Verifique a persistência e rastreabilidade das cotações emitidas pelo bot associadas a um identificador de sessão e período de validade.",
    "fr": "Vérifier la persistance et la traçabilité des devis émis par le bot associés à un identifiant de session et une durée de validité.",
    "de": "Überprüfen Sie die Beständigkeit und Nachverfolgbarkeit der vom Bot ausgegebenen Angebote in Verbindung mit einer Sitzungskennung und einem Gültigkeitszeitraum."
  },
  "Erradicar la publicidad engañosa o abusiva generada por algoritmos de IA conforme al Art. 32 de la LFPC.": {
    "en": "Eradicate misleading or abusive advertising generated by AI algorithms in accordance with Art. 32 of the LFPC.",
    "pt": "Erradicar a publicidade enganosa ou abusiva gerada por algoritmos de IA de acordo com o Art. 32 da LFPC.",
    "fr": "Éradiquer la publicité trompeuse ou abusive générée par les algorithmes d'IA conformément à l'art. 32 du LFPC.",
    "de": "Beseitigung irreführender oder missbräuchlicher Werbung durch KI-Algorithmen gemäß Art. 32 of the LFPC."
  },
  "Incorporar reglas de validación en guardrails de salida que detecten y bloqueen mensajes con patrones oscuros de venta forzosa.": {
    "en": "Incorporate validation rules into outbound guardrails that detect and block messages with dark hard-sell patterns.",
    "pt": "Incorpore regras de validação em proteções de saída que detectem e bloqueiem mensagens com padrões obscuros de venda difícil.",
    "fr": "Incorporez des règles de validation dans les garde-fous sortants qui détectent et bloquent les messages présentant des modèles de vente difficiles et sombres.",
    "de": "Integrieren Sie Validierungsregeln in ausgehende Leitplanken, die Nachrichten mit Dark-Sell-Sell-Mustern erkennen und blockieren."
  },
  "Filtros contra Publicidad Engañosa y Patrones Oscuros (Dark Patterns)": {
    "en": "Filters against Misleading Advertising and Dark Patterns",
    "pt": "Filtros contra publicidade enganosa e padrões obscuros",
    "fr": "Filtres contre la publicité trompeuse et les modèles sombres",
    "de": "Filtert gegen irreführende Werbung und dunkle Muster"
  },
  "Mecanismos y flujos que garantizan la validez jurídica, el consentimiento informado y el derecho de revocación del consumidor en compras o contrataciones realizadas con agentes de IA.": {
    "en": "Mechanisms and flows that guarantee legal validity, informed consent and the consumer's right of revocation in purchases or contracts made with AI agents.",
    "pt": "Mecanismos e fluxos que garantam a validade jurídica, o consentimento informado e o direito de revogação do consumidor nas compras ou contratos realizados com agentes de IA.",
    "fr": "Mécanismes et flux qui garantissent la validité juridique, le consentement éclairé et le droit de révocation du consommateur lors des achats ou des contrats conclus avec des agents d'IA.",
    "de": "Mechanismen und Abläufe, die die Rechtsgültigkeit, die Einwilligung nach Aufklärung und das Widerrufsrecht des Verbrauchers bei Käufen oder Verträgen mit KI-Agenten gewährleisten."
  },
  "El sistema debe contar con salvaguardas que impidan al modelo emplear técnicas coercitivas, urgencia artificial engañosa o afirmaciones inexactas sobre cualidades de productos.": {
    "en": "The system must have safeguards that prevent the model from using coercive techniques, misleading artificial urgency, or inaccurate claims about product qualities.",
    "pt": "O sistema deve ter salvaguardas que evitem que o modelo utilize técnicas coercivas, urgência artificial enganosa ou afirmações imprecisas sobre as qualidades do produto.",
    "fr": "Le système doit disposer de garanties qui empêchent le modèle d’utiliser des techniques coercitives, une urgence artificielle trompeuse ou des affirmations inexactes sur les qualités des produits.",
    "de": "Das System muss über Sicherheitsvorkehrungen verfügen, die verhindern, dass das Modell Zwangsmaßnahmen einsetzt, künstliche Dringlichkeit täuscht oder ungenaue Aussagen über Produktqualitäten macht."
  },
  "Revisar los prompts de alineación (system instructions) y verificar que prohíban expresamente afirmaciones exageradas, comparaciones no demostrables o falsas advertencias de stock.": {
    "en": "Review the alignment prompts (system instructions) and verify that they expressly prohibit exaggerated claims, unprovable comparisons or false stock warnings.",
    "pt": "Revise os avisos de alinhamento (instruções do sistema) e verifique se eles proíbem expressamente afirmações exageradas, comparações improváveis ​​ou avisos falsos de estoque.",
    "fr": "Examinez les invites d'alignement (instructions du système) et vérifiez qu'elles interdisent expressément les affirmations exagérées, les comparaisons non prouvables ou les faux avertissements de stock.",
    "de": "Überprüfen Sie die Ausrichtungsaufforderungen (Systemanweisungen) und stellen Sie sicher, dass sie übertriebene Behauptungen, unbeweisbare Vergleiche oder falsche Bestandswarnungen ausdrücklich verbieten."
  },
  "Comercio Electrónico y Contratación Automatizada": {
    "en": "Electronic Commerce and Automated Contracting",
    "pt": "Comércio Eletrônico e Contratação Automatizada",
    "fr": "Commerce électronique et contrats automatisés",
    "de": "Elektronischer Handel und automatisierte Vertragsabschlüsse"
  },
  "Diseñar un widget de confirmación de pedido que liste todos los costos con botones claros de 'Aceptar y Comprar' y 'Cancelar'.": {
    "en": "Design an order confirmation widget that lists all costs with clear 'Accept and Buy' and 'Cancel' buttons.",
    "pt": "Projete um widget de confirmação de pedido que liste todos os custos com botões claros 'Aceitar e Comprar' e 'Cancelar'.",
    "fr": "Concevez un widget de confirmation de commande qui répertorie tous les coûts avec des boutons clairs « Accepter et acheter » et « Annuler ».",
    "de": "Entwerfen Sie ein Bestellbestätigungs-Widget, das alle Kosten mit klaren Schaltflächen „Akzeptieren und kaufen“ und „Abbrechen“ auflistet."
  },
  "Generación Inmediata de Comprobante Digital con Folio de Rastreo": {
    "en": "Immediate Generation of Digital Receipt with Tracking Folio",
    "pt": "Geração Imediata de Recibo Digital com Fólio de Rastreamento",
    "fr": "Génération immédiate de reçu numérique avec Tracking Folio",
    "de": "Sofortige Erstellung digitaler Belege mit Tracking Folio"
  },
  "Verificar la emisión automática del comprobante por correo electrónico o enlace de descarga inmediatamente tras la confirmación de la orden.": {
    "en": "Verify the automatic issuance of the receipt by email or download link immediately upon confirmation of the order.",
    "pt": "Verifique a emissão automática do recibo por e-mail ou link para download imediatamente após a confirmação do pedido.",
    "fr": "Vérifiez l'émission automatique du reçu par email ou lien de téléchargement immédiatement après confirmation de la commande.",
    "de": "Überprüfen Sie die automatische Ausstellung der Quittung per E-Mail oder Download-Link sofort nach Bestätigung der Bestellung."
  },
  "Proporcionar al consumidor el respaldo documental de su compra conforme al Art. 76 BIS Fracc. V de la LFPC.": {
    "en": "Provide the consumer with documentary support for their purchase in accordance with Art. 76 BIS Fracc. V of the LFPC.",
    "pt": "Fornecer ao consumidor suporte documental para sua compra de acordo com o art. 76 BIS Frac. V da LFPC.",
    "fr": "Fournir au consommateur un justificatif documentaire pour son achat conformément à l'art. 76 BRI Fracc. V du LFPC.",
    "de": "Bieten Sie dem Verbraucher eine dokumentarische Unterstützung für seinen Kauf gemäß Art. 76 BIS Fracc. V of the LFPC."
  },
  "Antes de procesar cualquier transacción o cargo, el sistema debe presentar un desglose íntegro (precio, impuestos, envío, cargos adicionales) y requerir una acción positiva e inequívoca de confirmación.": {
    "en": "Before processing any transaction or charge, the system must present a complete breakdown (price, taxes, shipping, additional charges) and require positive and unambiguous confirmation action.",
    "pt": "Antes de processar qualquer transação ou cobrança, o sistema deve apresentar um detalhamento completo (preço, impostos, frete, encargos adicionais) e exigir uma ação de confirmação positiva e inequívoca.",
    "fr": "Avant de traiter toute transaction ou frais, le système doit présenter une ventilation complète (prix, taxes, expédition, frais supplémentaires) et exiger une action de confirmation positive et sans ambiguïté.",
    "de": "Vor der Verarbeitung einer Transaktion oder Belastung muss das System eine vollständige Aufschlüsselung (Preis, Steuern, Versand, zusätzliche Gebühren) vorlegen und eine positive und eindeutige Bestätigungsaktion erfordern."
  },
  "Integrar un servicio transaccional que despache el correo de confirmación con el PDF del pedido y el número de guía de seguimiento.": {
    "en": "Integrate a transactional service that sends the confirmation email with the PDF of the order and the tracking number.",
    "pt": "Integre um serviço transacional que envia o email de confirmação com o PDF da encomenda e o número de seguimento.",
    "fr": "Intégrez un service transactionnel qui envoie l'e-mail de confirmation avec le PDF de la commande et le numéro de suivi.",
    "de": "Integrieren Sie einen Transaktionsdienst, der die Bestätigungs-E-Mail mit dem PDF der Bestellung und der Tracking-Nummer sendet."
  },
  "Mecanismo de Derecho de Retracto y Cancelación (5 Días Hábiles)": {
    "en": "Right of Withdrawal and Cancellation Mechanism (5 Business Days)",
    "pt": "Mecanismo de Direito de Desistência e Cancelamento (5 Dias Úteis)",
    "fr": "Droit de rétractation et mécanisme d'annulation (5 jours ouvrables)",
    "de": "Widerrufsrecht und Stornierungsmechanismus (5 Werktage)"
  },
  "Cumplir con el Art. 76 BIS Fracc. IV de la LFPC asegurando el consentimiento informado y deliberado del comprador.": {
    "en": "Comply with Art. 76 BIS Fracc. IV of the LFPC ensuring the informed and deliberate consent of the buyer.",
    "pt": "Cumprir com o art. 76 BIS Frac. IV da LFPC assegurando o consentimento informado e deliberado do comprador.",
    "fr": "Se conformer à l'art. 76 BRI Fracc. IV du LFPC garantissant le consentement éclairé et délibéré de l’acheteur.",
    "de": "Beachten Sie Art. 76 BIS Fracc. IV des LFPC gewährleistet die informierte und bewusste Zustimmung des Käufers."
  },
  "Facilitar el ejercicio del derecho legal de desistimiento en compras por medios electrónicos.": {
    "en": "Facilitate the exercise of the legal right of withdrawal in purchases by electronic means.",
    "pt": "Facilitar o exercício do direito legal de rescisão nas compras por meios eletrónicos.",
    "fr": "Faciliter l’exercice du droit légal de rétractation lors des achats par voie électronique.",
    "de": "Erleichtern Sie die Ausübung des gesetzlichen Widerrufsrechts bei Käufen auf elektronischem Weg."
  },
  "Garantías para impedir que los modelos de perfilamiento o tarificación algorítmica discriminen o perjudiquen arbitrariamente a determinados grupos de consumidores.": {
    "en": "Guarantees to prevent profiling or algorithmic pricing models from arbitrarily discriminating against or harming certain groups of consumers.",
    "pt": "Garantias para evitar que perfis ou modelos algorítmicos de preços discriminem arbitrariamente ou prejudiquem determinados grupos de consumidores.",
    "fr": "Des garanties pour empêcher le profilage ou les modèles de tarification algorithmiques de discriminer arbitrairement ou de nuire à certains groupes de consommateurs.",
    "de": "Garantien, um zu verhindern, dass durch Profiling oder algorithmische Preismodelle bestimmte Verbrauchergruppen willkürlich diskriminiert oder geschädigt werden."
  },
  "No Discriminación y Equidad en Precios Dinámicos": {
    "en": "Non-Discrimination and Equity in Dynamic Pricing",
    "pt": "Não Discriminação e Equidade na Precificação Dinâmica",
    "fr": "Non-discrimination et équité dans la tarification dynamique",
    "de": "Nichtdiskriminierung und Gerechtigkeit bei der dynamischen Preisgestaltung"
  },
  "El sistema debe emitir y enviar de forma instantánea al consumidor un recibo, factura digital o comprobante electrónico con número de folio identificador de la operación.": {
    "en": "The system must instantly issue and send to the consumer a receipt, digital invoice or electronic receipt with a folio number identifying the operation.",
    "pt": "O sistema deverá emitir e enviar instantaneamente ao consumidor recibo, nota fiscal digital ou recibo eletrônico com número de folha identificando a operação.",
    "fr": "Le système doit émettre et envoyer instantanément au consommateur un reçu, une facture numérique ou un reçu électronique avec un numéro de folio identifiant l'opération.",
    "de": "Das System muss sofort eine Quittung, eine digitale Rechnung oder eine elektronische Quittung mit einer Folionummer zur Identifizierung des Vorgangs ausstellen und an den Verbraucher senden."
  },
  "Habilitar un intent o función de cancelación que verifique la fecha de entrega y active el proceso de reembolso automático si está dentro del plazo legal.": {
    "en": "Enable a cancellation intent or function that verifies the delivery date and activates the automatic refund process if it is within the legal deadline.",
    "pt": "Habilite uma intenção ou função de cancelamento que verifique a data de entrega e ative o processo de reembolso automático caso esteja dentro do prazo legal.",
    "fr": "Activez une intention ou une fonction d'annulation qui vérifie la date de livraison et active le processus de remboursement automatique si elle est dans le délai légal.",
    "de": "Aktivieren Sie eine Stornierungsabsicht oder Funktion, die das Lieferdatum überprüft und den automatischen Rückerstattungsprozess aktiviert, wenn dieser innerhalb der gesetzlichen Frist liegt."
  },
  "Los algoritmos de precios dinámicos y ofertas no deben discriminar ni establecer condiciones inequitativas basadas en género, raza, nacionalidad, condición social o geolocalización arbitraria.": {
    "en": "Dynamic pricing and offer algorithms must not discriminate or establish inequitable conditions based on gender, race, nationality, social status or arbitrary geolocation.",
    "pt": "Os algoritmos dinâmicos de preços e ofertas não devem discriminar ou estabelecer condições injustas com base no género, raça, nacionalidade, estatuto social ou geolocalização arbitrária.",
    "fr": "Les algorithmes dynamiques de tarification et d’offre ne doivent pas discriminer ou établir des conditions inéquitables basées sur le sexe, la race, la nationalité, le statut social ou la géolocalisation arbitraire.",
    "de": "Dynamische Preis- und Angebotsalgorithmen dürfen nicht aufgrund von Geschlecht, Rasse, Nationalität, sozialem Status oder willkürlichem Standort diskriminieren oder ungleiche Bedingungen schaffen."
  },
  "Comprobar en el flujo de interacción que el bot nunca procese una compra automáticamente sin presentar el resumen y recibir una confirmación expresa del usuario.": {
    "en": "Check in the interaction flow that the bot never processes a purchase automatically without presenting the summary and receiving express confirmation from the user.",
    "pt": "Verifique no fluxo de interação que o bot nunca processa uma compra automaticamente sem apresentar o resumo e receber a confirmação expressa do usuário.",
    "fr": "Vérifiez dans le flux d'interaction que le bot ne traite jamais un achat automatiquement sans présenter le récapitulatif et recevoir une confirmation expresse de l'utilisateur.",
    "de": "Stellen Sie im Interaktionsablauf sicher, dass der Bot niemals einen Kauf automatisch abwickelt, ohne die Zusammenfassung vorzulegen und eine ausdrückliche Bestätigung vom Benutzer zu erhalten."
  },
  "Probar que el asistente reconozca solicitudes de 'cancelar mi compra' o 'devolver mi pedido' y guíe al consumidor en el procedimiento de retracto.": {
    "en": "Test that the assistant recognizes requests to 'cancel my purchase' or 'return my order' and guide the consumer through the withdrawal procedure.",
    "pt": "Testar se o atendente reconhece os pedidos de ‘cancelar minha compra’ ou ‘devolver meu pedido’ e orientar o consumidor no procedimento de desistência.",
    "fr": "Testez que l'assistant reconnaît les demandes « annuler mon achat » ou « retourner ma commande » et guidez le consommateur dans la procédure de rétractation.",
    "de": "Testen Sie, ob der Assistent Anfragen zum „Stornieren meines Kaufs“ oder „Meine Bestellung zurückgeben“ erkennt und den Verbraucher durch das Widerrufsverfahren führt."
  },
  "El asistente debe ofrecer un comando o flujo directo para que el consumidor pueda ejercer su derecho de revocación o cancelación sin penalización dentro de los 5 días hábiles conforme al Art. 56 de la LFPC.": {
    "en": "The assistant must offer a direct command or flow so that the consumer can exercise their right of revocation or cancellation without penalty within 5 business days in accordance with Art. 56 of the LFPC.",
    "pt": "O atendente deverá oferecer comando ou fluxo direto para que o consumidor possa exercer seu direito de revogação ou cancelamento sem penalidade no prazo de 5 dias úteis nos termos do Art. 56 da LFPC.",
    "fr": "L'assistant doit proposer une commande ou un flux direct afin que le consommateur puisse exercer son droit de révocation ou d'annulation sans pénalité dans un délai de 5 jours ouvrables conformément à l'art. 56 du LFPC.",
    "de": "Der Assistent muss einen direkten Befehl oder Ablauf erteilen, damit der Verbraucher sein Widerrufs- oder Stornierungsrecht innerhalb von 5 Werktagen gemäß Art. 56 des LFPC."
  },
  "Prohibición de Precios Discriminatorios por Perfilamiento": {
    "en": "Prohibition of Discriminatory Pricing for Profiling",
    "pt": "Proibição de preços discriminatórios para criação de perfis",
    "fr": "Interdiction des prix discriminatoires pour le profilage",
    "de": "Verbot diskriminierender Preisgestaltung für Profiling"
  },
  "Garantizar el cumplimiento del Art. 58 de la LFPC que prohíbe negar servicios o imponer condiciones arbitrarias.": {
    "en": "Guarantee compliance with Art. 58 of the LFPC, which prohibits denying services or imposing arbitrary conditions.",
    "pt": "Garantir o cumprimento do art. 58 da LFPC, que proíbe a negação de serviços ou a imposição de condições arbitrárias.",
    "fr": "Garantir le respect de l'art. 58 du LFPC, qui interdit de refuser des services ou d'imposer des conditions arbitraires.",
    "de": "Gewährleistung der Einhaltung von Art. 58 des LFPC, der es verbietet, Dienste zu verweigern oder willkürliche Bedingungen aufzuerlegen."
  },
  "Revisar los modelos de precios y auditar que las variables protegidas (demográficas o de perfilamiento sensible) no intervengan en la fijación de tarifas.": {
    "en": "Review pricing models and audit that protected variables (demographic or sensitive profiling) do not intervene in rate setting.",
    "pt": "Revise os modelos de precificação e audite se as variáveis ​​protegidas (perfis demográficos ou sensíveis) não intervêm na definição das taxas.",
    "fr": "Examiner les modèles de tarification et vérifier que les variables protégées (profilage démographique ou sensible) n’interviennent pas dans la fixation des tarifs.",
    "de": "Überprüfen Sie die Preismodelle und stellen Sie sicher, dass geschützte Variablen (demografische oder sensible Profilerstellung) keinen Einfluss auf die Tariffestlegung haben."
  },
  "Accesibilidad Universal para Personas con Discapacidad": {
    "en": "Universal Accessibility for People with Disabilities",
    "pt": "Acessibilidade universal para pessoas com deficiência",
    "fr": "Accessibilité universelle pour les personnes handicapées",
    "de": "Universelle Zugänglichkeit für Menschen mit Behinderungen"
  },
  "Excluir explícitamente variables protegidas de las matrices de recomendación y precios, aplicando pruebas periódicas de paridad de precios.": {
    "en": "Explicitly exclude protected variables from the recommendation and pricing matrices, applying periodic price parity tests.",
    "pt": "Excluir explicitamente as variáveis ​​protegidas das matrizes de recomendação e de preços, aplicando testes periódicos de paridade de preços.",
    "fr": "Excluez explicitement les variables protégées des matrices de recommandation et de tarification, en appliquant des tests périodiques de parité des prix.",
    "de": "Schließen Sie geschützte Variablen explizit aus den Empfehlungs- und Preismatrizen aus, indem Sie regelmäßige Preisparitätstests durchführen."
  },
  "La interfaz de interacción del agente de IA debe cumplir estándares de accesibilidad digital (WCAG 2.1 AA) para no excluir a personas con discapacidad visual o auditiva.": {
    "en": "The interaction interface of the AI ​​agent must comply with digital accessibility standards (WCAG 2.1 AA) so as not to exclude people with visual or hearing disabilities.",
    "pt": "A interface de interação do agente de IA deve obedecer aos padrões de acessibilidade digital (WCAG 2.1 AA) para não excluir pessoas com deficiência visual ou auditiva.",
    "fr": "L'interface d'interaction de l'agent IA doit être conforme aux normes d'accessibilité numérique (WCAG 2.1 AA) afin de ne pas exclure les personnes ayant un handicap visuel ou auditif.",
    "de": "Die Interaktionsschnittstelle des KI-Agenten muss den digitalen Barrierefreiheitsstandards (WCAG 2.1 AA) entsprechen, um Menschen mit Seh- oder Hörbehinderungen nicht auszuschließen."
  },
  "Canales y procesos que salvaguardan el derecho del consumidor a no quedar atrapado en bucles automatizados y a contar con atención humana para resolver inconformidades.": {
    "en": "Channels and processes that safeguard the consumer's right not to be trapped in automated loops and to have human attention to resolve disagreements.",
    "pt": "Canais e processos que salvaguardam o direito do consumidor de não ficar preso em loops automatizados e de ter atenção humana para resolver divergências.",
    "fr": "Canaux et processus qui garantissent le droit du consommateur à ne pas se laisser piéger dans des boucles automatisées et à bénéficier d'une attention humaine pour résoudre les désaccords.",
    "de": "Kanäle und Prozesse, die das Recht des Verbrauchers wahren, nicht in automatisierten Schleifen gefangen zu sein und menschliche Aufmerksamkeit bei der Lösung von Meinungsverschiedenheiten zu haben."
  },
  "Escalamiento Inmediato a un Representante Humano": {
    "en": "Immediate Escalation to a Human Representative",
    "pt": "Escalação imediata para um representante humano",
    "fr": "Transmission immédiate à un représentant humain",
    "de": "Sofortige Eskalation an einen menschlichen Vertreter"
  },
  "El consumidor tiene el derecho inalienable de solicitar hablar o ser transferido a un agente humano en cualquier momento, debiendo el bot canalizar la solicitud sin bloqueos.": {
    "en": "The consumer has the inalienable right to request to speak or be transferred to a human agent at any time, and the bot must channel the request without blocks.",
    "pt": "O consumidor tem o direito inalienável de solicitar falar ou ser transferido para um agente humano a qualquer momento, devendo o bot canalizar a solicitação sem bloqueios.",
    "fr": "Le consommateur a le droit inaliénable de demander à parler ou à être transféré à un agent humain à tout moment, et le bot doit canaliser la demande sans blocage.",
    "de": "Der Verbraucher hat das unveräußerliche Recht, jederzeit zu verlangen, dass er spricht oder an einen menschlichen Vertreter weitergeleitet wird, und der Bot muss die Anfrage ohne Blockaden kanalisieren."
  },
  "Cumplir con el Art. 76 BIS Fracc. VII de la LFPC asegurando canales accesibles y eficaces de atención a quejas.": {
    "en": "Comply with Art. 76 BIS Fracc. VII of the LFPC ensuring accessible and effective channels for addressing complaints.",
    "pt": "Cumprir com o art. 76 BIS Frac. VII da LFPC garantindo canais acessíveis e eficazes para tratamento de reclamações.",
    "fr": "Se conformer à l'art. 76 BRI Fracc. VII du LFPC garantissant des canaux accessibles et efficaces pour traiter les plaintes.",
    "de": "Beachten Sie Art. 76 BIS Fracc. VII des LFPC gewährleistet zugängliche und wirksame Kanäle für die Bearbeitung von Beschwerden."
  },
  "Comprobar que comandos como 'quiero hablar con una persona', 'humano' o 'agente' activen inmediatamente la transferencia o solicitud de contacto.": {
    "en": "Check that commands such as 'I want to talk to a person', 'human' or 'agent' immediately activate the transfer or contact request.",
    "pt": "Verifique se comandos como ‘Quero falar com uma pessoa’, ‘humano’ ou ‘agente’ ativam imediatamente a transferência ou solicitação de contato.",
    "fr": "Vérifiez que les commandes telles que « Je veux parler à une personne », « humain » ou « agent » activent immédiatement la demande de transfert ou de contact.",
    "de": "Überprüfen Sie, ob Befehle wie „Ich möchte mit einer Person sprechen“, „Mensch“ oder „Agent“ sofort die Weiterleitungs- oder Kontaktanfrage auslösen."
  },
  "Añadir etiquetas ARIA completas, soporte de navegación por teclado y transcripción de audio accesible en los componentes de chat.": {
    "en": "Add full ARIA tags, keyboard navigation support, and accessible audio transcription in chat components.",
    "pt": "Adicione tags ARIA completas, suporte para navegação por teclado e transcrição de áudio acessível em componentes de chat.",
    "fr": "Ajoutez des balises ARIA complètes, une prise en charge de la navigation au clavier et une transcription audio accessible dans les composants de discussion.",
    "de": "Fügen Sie vollständige ARIA-Tags, Unterstützung für die Tastaturnavigation und barrierefreie Audiotranskription in Chat-Komponenten hinzu."
  },
  "Garantizar el acceso equitativo a bienes y servicios digitales conforme al principio de no discriminación de la LFPC.": {
    "en": "Guarantee equitable access to digital goods and services in accordance with the non-discrimination principle of the LFPC.",
    "pt": "Garantir o acesso equitativo aos bens e serviços digitais de acordo com o princípio da não discriminação da LFPC.",
    "fr": "Garantir un accès équitable aux biens et services numériques conformément au principe de non-discrimination du LFPC.",
    "de": "Gewährleistung eines gleichberechtigten Zugangs zu digitalen Gütern und Dienstleistungen gemäß dem Nichtdiskriminierungsprinzip des LFPC."
  },
  "Evaluar la interfaz de chat con lectores de pantalla, verificar contraste de color y soporte de entrada/salida por voz o texto alternativo.": {
    "en": "Evaluate the chat interface with screen readers, check color contrast, and voice or alternative text input/output support.",
    "pt": "Avalie a interface de bate-papo com leitores de tela, verifique o contraste das cores e o suporte para entrada/saída de voz ou texto alternativo.",
    "fr": "Évaluez l’interface de chat avec des lecteurs d’écran, vérifiez le contraste des couleurs et la prise en charge de la saisie/sortie vocale ou de texte alternatif.",
    "de": "Bewerten Sie die Chat-Oberfläche mit Bildschirmleseprogrammen, überprüfen Sie den Farbkontrast und die Unterstützung für die Eingabe/Ausgabe von Sprach- oder alternativem Text."
  },
  "Supervisión Humana y Atención de Quejas ante PROFECO": {
    "en": "Human Supervision and Complaints Attention to PROFECO",
    "pt": "Supervisão Humana e Reclamações Atenção à PROFECO",
    "fr": "Surveillance humaine et plaintes Attention à PROFECO",
    "de": "Menschliche Aufsicht und Beschwerden. Aufmerksamkeit für PROFECO"
  },
  "Facilitar la documentación probatoria y trazabilidad en caso de controversias mercantiles o quejas formales.": {
    "en": "Facilitate evidentiary documentation and traceability in the event of commercial disputes or formal complaints.",
    "pt": "Facilite a documentação probatória e a rastreabilidade em caso de disputas comerciais ou reclamações formais.",
    "fr": "Facilitez la documentation probante et la traçabilité en cas de litiges commerciaux ou de plaintes formelles.",
    "de": "Erleichtern Sie die beweiskräftige Dokumentation und Rückverfolgbarkeit im Falle von Handelsstreitigkeiten oder formellen Beschwerden."
  },
  "Programar un enrutador de soporte que capture la intención de contacto humano y abra un ticket en la plataforma de CRM (Zendesk, Salesforce) con historial.": {
    "en": "Program a support router that captures human contact intent and opens a ticket in the CRM platform (Zendesk, Salesforce) with history.",
    "pt": "Programe um roteador de suporte que capture a intenção de contato humano e abra um ticket na plataforma CRM (Zendesk, Salesforce) com histórico.",
    "fr": "Programmez un routeur de support qui capture l'intention de contact humain et ouvre un ticket dans la plateforme CRM (Zendesk, Salesforce) avec historique.",
    "de": "Programmieren Sie einen Support-Router, der menschliche Kontaktabsichten erfasst und ein Ticket in der CRM-Plattform (Zendesk, Salesforce) mit Verlauf öffnet."
  },
  "Registro y Folio Formal de Reclamaciones para PROFECO": {
    "en": "Registry and Formal Folio of Claims for PROFECO",
    "pt": "Registro e Fólio Formal de Reivindicações para PROFECO",
    "fr": "Registre et folio formel des réclamations pour PROFECO",
    "de": "Register und formelles Anspruchsverzeichnis für PROFECO"
  },
  "Verificar que el sistema genere y proporcione al usuario un número de reporte con fecha y hora al manifestar una queja formal.": {
    "en": "Verify that the system generates and provides the user with a report number with date and time when expressing a formal complaint.",
    "pt": "Verifique se o sistema gera e fornece ao usuário um número de relatório com data e hora ao expressar uma reclamação formal.",
    "fr": "Vérifiez que le système génère et fournit à l'utilisateur un numéro de rapport avec la date et l'heure lors de l'expression d'une plainte formelle.",
    "de": "Stellen Sie sicher, dass das System eine Berichtsnummer mit Datum und Uhrzeit generiert und dem Benutzer zur Verfügung stellt, wenn er eine formelle Beschwerde einreicht."
  },
  "Toda queja, inconformidad o reclamación no resuelta debe generar un número de folio oficial rastreable para efectos de procedimientos de conciliación ante PROFECO.": {
    "en": "Any complaint, disagreement or unresolved claim must generate a traceable official folio number for the purposes of conciliation procedures before PROFECO.",
    "pt": "Qualquer reclamação, desacordo ou reclamação não resolvida deverá gerar um número de registro oficial rastreável para fins de procedimentos de conciliação perante a PROFECO.",
    "fr": "Toute plainte, désaccord ou réclamation non résolue doit générer un numéro de folio officiel traçable aux fins des procédures de conciliation devant PROFECO.",
    "de": "Bei jeder Beschwerde, Meinungsverschiedenheit oder ungelösten Forderung muss für die Zwecke des Schlichtungsverfahrens vor PROFECO eine nachverfolgbare offizielle Folionummer generiert werden."
  },
  "Aislamiento y Tokenización de Medios de Pago en Agentes de IA": {
    "en": "Isolation and Tokenization of Payment Methods in AI Agents",
    "pt": "Isolamento e tokenização de métodos de pagamento em agentes de IA",
    "fr": "Isolement et tokenisation des méthodes de paiement dans les agents IA",
    "de": "Isolierung und Tokenisierung von Zahlungsmethoden in KI-Agenten"
  },
  "Cumplir con el Art. 76 BIS Fracc. VI de la LFPC que exige confidencialidad y seguridad estricta en datos de pago.": {
    "en": "Comply with Art. 76 BIS Fracc. VI of the LFPC that requires confidentiality and strict security in payment data.",
    "pt": "Cumprir com o art. 76 BIS Frac. VI da LFPC que exige sigilo e segurança rigorosa nos dados de pagamento.",
    "fr": "Se conformer à l'art. 76 BRI Fracc. VI du LFPC qui exige la confidentialité et la stricte sécurité des données de paiement.",
    "de": "Beachten Sie Art. 76 BIS Fracc. VI des LFPC, das Vertraulichkeit und strenge Sicherheit der Zahlungsdaten erfordert."
  },
  "Implementar la generación automática de tickets con código alfanumérico único almacenado en la base de datos de auditoría inmutable.": {
    "en": "Implement automatic generation of tickets with unique alphanumeric code stored in the immutable audit database.",
    "pt": "Implemente a geração automática de tickets com código alfanumérico exclusivo armazenado no banco de dados de auditoria imutável.",
    "fr": "Implémentez la génération automatique de tickets avec un code alphanumérique unique stocké dans la base de données d'audit immuable.",
    "de": "Implementieren Sie die automatische Generierung von Tickets mit eindeutigem alphanumerischem Code, der in der unveränderlichen Prüfdatenbank gespeichert ist."
  },
  "Implementar un filtro de rechazo automático en el input del chat que detecte números de tarjeta y los desvíe a un formulario PCI tokenizado.": {
    "en": "Implement an automatic rejection filter in the chat input that detects card numbers and diverts them to a tokenized PCI form.",
    "pt": "Implemente um filtro de rejeição automática na entrada do chat que detecte números de cartões e os desvie para um formato PCI tokenizado.",
    "fr": "Implémentez un filtre de rejet automatique dans l'entrée du chat qui détecte les numéros de carte et les redirige vers un formulaire PCI tokenisé.",
    "de": "Implementieren Sie einen automatischen Ablehnungsfilter in der Chat-Eingabe, der Kartennummern erkennt und sie an ein tokenisiertes PCI-Formular umleitet."
  },
  "Mecanismo de Reversión y Cancelación de Cargos no Autorizados": {
    "en": "Reversal and Cancellation Mechanism for Unauthorized Charges",
    "pt": "Mecanismo de reversão e cancelamento de cobranças não autorizadas",
    "fr": "Mécanisme d'annulation et d'annulation pour les frais non autorisés",
    "de": "Stornierungs- und Stornierungsmechanismus für nicht autorisierte Belastungen"
  },
  "Los modelos de lenguaje y agentes de IA nunca deben recibir, procesar ni almacenar en contexto números completos de tarjetas (PAN) ni códigos CVV, delegando la captura a pasarelas PCI-DSS aisladas.": {
    "en": "Language models and AI agents should never receive, process, or store full card numbers (PAN) or CVV codes in context, delegating the capture to isolated PCI-DSS gateways.",
    "pt": "Os modelos de linguagem e os agentes de IA nunca devem receber, processar ou armazenar números completos de cartões (PAN) ou códigos CVV no contexto, delegando a captura a gateways PCI-DSS isolados.",
    "fr": "Les modèles de langage et les agents d'IA ne doivent jamais recevoir, traiter ou stocker des numéros de carte complets (PAN) ou des codes CVV en contexte, déléguant la capture à des passerelles PCI-DSS isolées.",
    "de": "Sprachmodelle und KI-Agenten sollten niemals vollständige Kartennummern (PAN) oder CVV-Codes im Kontext empfangen, verarbeiten oder speichern und die Erfassung an isolierte PCI-DSS-Gateways delegieren."
  },
  "Medidas de seguridad técnicas para impedir que agentes autónomos de IA capturen o filtren información de pago no tokenizada o ejecuten compras no autorizadas.": {
    "en": "Technical security measures to prevent autonomous AI agents from capturing or leaking untokenized payment information or executing unauthorized purchases.",
    "pt": "Medidas técnicas de segurança para evitar que agentes autônomos de IA capturem ou vazem informações de pagamento não tokenizadas ou executem compras não autorizadas.",
    "fr": "Mesures de sécurité techniques pour empêcher les agents d'IA autonomes de capturer ou de divulguer des informations de paiement non tokenisées ou d'exécuter des achats non autorisés.",
    "de": "Technische Sicherheitsmaßnahmen, um zu verhindern, dass autonome KI-Agenten nicht tokenisierte Zahlungsinformationen erfassen oder preisgeben oder unbefugte Einkäufe tätigen."
  },
  "Seguridad en Pasarelas y Transacciones Agénticas": {
    "en": "Security in Gateways and Agentic Transactions",
    "pt": "Segurança em Gateways e Transações Agentes",
    "fr": "Sécurité dans les passerelles et les transactions agents",
    "de": "Sicherheit in Gateways und Agententransaktionen"
  },
  "Habilitar una API interna de reembolso con doble factor de aprobación administrativa para resolver incidentes transaccionales de bots.": {
    "en": "Enable an internal refund API with double administrative approval factor to resolve transactional bot incidents.",
    "pt": "Habilite uma API de reembolso interno com duplo fator de aprovação administrativa para resolver incidentes de bots transacionais.",
    "fr": "Activez une API de remboursement interne avec un double facteur d'approbation administrative pour résoudre les incidents de robots transactionnels.",
    "de": "Aktivieren Sie eine interne Rückerstattungs-API mit doppeltem Verwaltungsgenehmigungsfaktor, um transaktionale Bot-Vorfälle zu beheben."
  },
  "Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)": {
    "en": "Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP)",
    "pt": "Lei Federal sobre Proteção de Dados Pessoais Mantidos por Pessoas Privadas (LFPDPPP)",
    "fr": "Loi fédérale sur la protection des données personnelles détenues par des personnes privées (LFPDPPP)",
    "de": "Bundesgesetz zum Schutz personenbezogener Daten im Besitz privater Parteien (LFPDPPP)"
  },
  "Verificar la existencia de un protocolo de reversión que devuelva los fondos en un plazo no mayor a 48 horas tras comprobarse la anomalía.": {
    "en": "Verify the existence of a reversal protocol that returns the funds within a period of no more than 48 hours after the anomaly is verified.",
    "pt": "Verifique a existência de um protocolo de reversão que devolva os fundos num prazo não superior a 48 horas após a verificação da anomalia.",
    "fr": "Vérifier l'existence d'un protocole d'inversion qui restitue les fonds dans un délai ne dépassant pas 48 heures après la vérification de l'anomalie.",
    "de": "Überprüfen Sie, ob ein Rückbuchungsprotokoll vorhanden ist, das die Gelder innerhalb eines Zeitraums von höchstens 48 Stunden nach Feststellung der Anomalie zurückerstattet."
  },
  "Proteger el patrimonio del consumidor frente a errores técnicos o alucinaciones transaccionales del agente de IA.": {
    "en": "Protect consumer assets against technical errors or transactional hallucinations of the AI ​​agent.",
    "pt": "Proteja os ativos do consumidor contra erros técnicos ou alucinações transacionais do agente de IA.",
    "fr": "Protégez les actifs des consommateurs contre les erreurs techniques ou les hallucinations transactionnelles de l’agent IA.",
    "de": "Schützen Sie Verbrauchervermögen vor technischen Fehlern oder Transaktionshalluzinationen des KI-Agenten."
  },
  "Comprobar que los campos de pago estén renderizados en iframes seguros de pasarelas certificadas (Stripe, Mercado Pago) y que los prompts no contengan datos de tarjetas.": {
    "en": "Check that the payment fields are rendered in secure iframes from certified gateways (Stripe, Mercado Pago) and that the prompts do not contain card data.",
    "pt": "Verifique se os campos de pagamento são renderizados em iframes seguros de gateways certificados (Stripe, Mercado Pago) e se os prompts não contêm dados do cartão.",
    "fr": "Vérifiez que les champs de paiement sont rendus dans des iframes sécurisées provenant de passerelles certifiées (Stripe, Mercado Pago) et que les invites ne contiennent pas de données de carte.",
    "de": "Überprüfen Sie, ob die Zahlungsfelder in sicheren Iframes von zertifizierten Gateways (Stripe, Mercado Pago) gerendert werden und dass die Eingabeaufforderungen keine Kartendaten enthalten."
  },
  "Procedimiento ágil para cancelar y reembolsar de forma inmediata transacciones procesadas erróneamente o sin el consentimiento explícito del titular por mal funcionamiento del agente.": {
    "en": "Agile procedure to immediately cancel and refund transactions processed incorrectly or without the explicit consent of the owner due to agent malfunction.",
    "pt": "Procedimento ágil para cancelar e reembolsar imediatamente transações processadas incorretamente ou sem o consentimento explícito do proprietário devido a mau funcionamento do agente.",
    "fr": "Procédure agile pour annuler et rembourser immédiatement les transactions traitées de manière incorrecte ou sans le consentement explicite du propriétaire en raison d'un dysfonctionnement de l'agent.",
    "de": "Agiles Verfahren zur sofortigen Stornierung und Rückerstattung von Transaktionen, die fehlerhaft oder ohne ausdrückliche Zustimmung des Eigentümers aufgrund einer Fehlfunktion des Agenten durchgeführt wurden."
  },
  "México (INAI)": {
    "en": "Mexico (INAI)",
    "pt": "México (INAI)",
    "fr": "Mexique (INAI)",
    "de": "Mexiko (INAI)"
  },
  "Garantiza que el tratamiento de datos personales en pipelines de IA cumpla con los principios fundamentales de la legislación mexicana, prohibiendo la recolección engañosa y exigiendo proporcionalidad estricta.": {
    "en": "Ensures that the processing of personal data in AI pipelines complies with the fundamental principles of Mexican law, prohibiting misleading collection and requiring strict proportionality.",
    "pt": "Garante que o processamento de dados pessoais em pipelines de IA esteja em conformidade com os princípios fundamentais da legislação mexicana, proibindo a coleta enganosa e exigindo estrita proporcionalidade.",
    "fr": "Garantit que le traitement des données personnelles dans les pipelines d'IA est conforme aux principes fondamentaux de la loi mexicaine, interdisant la collecte trompeuse et exigeant une stricte proportionnalité.",
    "de": "Stellt sicher, dass die Verarbeitung personenbezogener Daten in KI-Pipelines den Grundprinzipien des mexikanischen Rechts entspricht, irreführende Erhebungen verbietet und strikte Verhältnismäßigkeit erfordert."
  },
  "Marco legal mexicano de orden público que regula el tratamiento legítimo, seguro y controlado de datos personales por particulares en sistemas de IA, bases vectoriales (RAG), inferencia LLM y transferencias transfronterizas.": {
    "en": "Mexican legal framework for public order that regulates the legitimate, secure and controlled processing of personal data by individuals in AI systems, vector bases (RAG), LLM inference and cross-border transfers.",
    "pt": "Marco jurídico mexicano para a ordem pública que regula o processamento legítimo, seguro e controlado de dados pessoais por indivíduos em sistemas de IA, bases vetoriais (RAG), inferência LLM e transferências transfronteiriças.",
    "fr": "Cadre juridique mexicain d'ordre public qui réglemente le traitement légitime, sécurisé et contrôlé des données personnelles par les individus dans les systèmes d'IA, les bases vectorielles (RAG), l'inférence LLM et les transferts transfrontaliers.",
    "de": "Mexikanischer Rechtsrahmen für die öffentliche Ordnung, der die legitime, sichere und kontrollierte Verarbeitung personenbezogener Daten durch Einzelpersonen in KI-Systemen, Vektorbasen (RAG), LLM-Inferenz und grenzüberschreitenden Übertragungen regelt."
  },
  "Principios Rectores del Tratamiento de Datos en IA": {
    "en": "Guiding Principles of Data Processing in AI",
    "pt": "Princípios Orientadores de Processamento de Dados em IA",
    "fr": "Principes directeurs du traitement des données dans l'IA",
    "de": "Leitprinzipien der Datenverarbeitung in der KI"
  },
  "Principio de Licitud y Lealtad Algorítmica": {
    "en": "Principle of Legality and Algorithmic Loyalty",
    "pt": "Princípio da Legalidade e Lealdade Algorítmica",
    "fr": "Principe de légalité et de fidélité algorithmique",
    "de": "Prinzip der Legalität und algorithmischen Loyalität"
  },
  "El sistema de IA no debe obtener ni enriquecer datos de los titulares a través de medios engañosos, scraping no autorizado o técnicas clandestinas de perfilamiento.": {
    "en": "The AI ​​system must not obtain or enrich holder data through deceptive means, unauthorized scraping or clandestine profiling techniques.",
    "pt": "O sistema de IA não deve obter ou enriquecer os dados do titular através de meios enganosos, raspagem não autorizada ou técnicas clandestinas de criação de perfis.",
    "fr": "Le système d'IA ne doit pas obtenir ou enrichir les données des titulaires par des moyens trompeurs, des techniques de grattage non autorisées ou de profilage clandestin.",
    "de": "Das KI-System darf Inhaberdaten nicht durch betrügerische Mittel, unbefugtes Scraping oder heimliche Profiling-Techniken beschaffen oder anreichern."
  },
  "Los datos recopilados para un fin determinado no deben ser re-utilizados para entrenar, calibrar o re-entrenar modelos de IA sin una nueva autorización del titular.": {
    "en": "Data collected for a specific purpose must not be re-used to train, calibrate or re-train AI models without new authorization from the owner.",
    "pt": "Os dados recolhidos para uma finalidade específica não devem ser reutilizados para treinar, calibrar ou retreinar modelos de IA sem nova autorização do proprietário.",
    "fr": "Les données collectées dans un but spécifique ne doivent pas être réutilisées pour entraîner, calibrer ou recycler des modèles d'IA sans une nouvelle autorisation du propriétaire.",
    "de": "Für einen bestimmten Zweck erfasste Daten dürfen ohne erneute Genehmigung des Eigentümers nicht zum Trainieren, Kalibrieren oder Umschulen von KI-Modellen wiederverwendet werden."
  },
  "Prevenir el desvío de finalidad en los flujos de inferencia y bases de conocimiento corporativas.": {
    "en": "Prevent purpose drift in inference flows and corporate knowledge bases.",
    "pt": "Evite desvios de propósito em fluxos de inferência e bases de conhecimento corporativas.",
    "fr": "Empêchez la dérive des objectifs dans les flux d’inférence et les bases de connaissances d’entreprise.",
    "de": "Verhindern Sie Zweckabweichungen in Inferenzabläufen und Unternehmenswissensdatenbanken."
  },
  "Asegurar que todas las fuentes de datos que alimentan modelos o bases de conocimiento RAG cuenten con base legal y consentimiento legítimo.": {
    "en": "Ensure that all data sources that feed RAG models or knowledge bases have a legal basis and legitimate consent.",
    "pt": "Garantir que todas as fontes de dados que alimentam modelos RAG ou bases de conhecimento tenham base legal e consentimento legítimo.",
    "fr": "Assurez-vous que toutes les sources de données qui alimentent les modèles ou les bases de connaissances RAG disposent d’une base légale et d’un consentement légitime.",
    "de": "Stellen Sie sicher, dass alle Datenquellen, die RAG-Modelle oder Wissensdatenbanken speisen, über eine Rechtsgrundlage und eine legitime Einwilligung verfügen."
  },
  "Revisar políticas de aislamiento de datos y confirmar que los datos de clientes no se incorporen a datasets de entrenamiento general.": {
    "en": "Review data isolation policies and confirm that customer data is not incorporated into general training datasets.",
    "pt": "Revise as políticas de isolamento de dados e confirme se os dados do cliente não estão incorporados em conjuntos de dados de treinamento geral.",
    "fr": "Examinez les politiques d’isolation des données et confirmez que les données des clients ne sont pas intégrées aux ensembles de données de formation généraux.",
    "de": "Überprüfen Sie die Datenisolationsrichtlinien und stellen Sie sicher, dass Kundendaten nicht in allgemeine Trainingsdatensätze integriert werden."
  },
  "Verificar la trazabilidad y procedencia legal de todos los documentos y registros indexados en bases vectoriales y conjuntos de fine-tuning.": {
    "en": "Verify the traceability and legal origin of all documents and records indexed in vector bases and fine-tuning sets.",
    "pt": "Verificar a rastreabilidade e origem legal de todos os documentos e registros indexados em bases vetoriais e conjuntos de ajuste fino.",
    "fr": "Vérifier la traçabilité et l'origine légale de tous les documents et enregistrements indexés dans les bases vectorielles et les jeux de mise au point.",
    "de": "Überprüfen Sie die Rückverfolgbarkeit und den rechtlichen Ursprung aller in Vektorbasen und Feinabstimmungssätzen indizierten Dokumente und Datensätze."
  },
  "Auditar y purgar fuentes de datos no autorizadas; documentar el origen contractual o consentimiento explícito de cada repositorio de conocimiento.": {
    "en": "Audit and purge unauthorized data sources; document the contractual origin or explicit consent of each knowledge repository.",
    "pt": "Auditar e eliminar fontes de dados não autorizadas; documentar a origem contratual ou consentimento explícito de cada repositório de conhecimento.",
    "fr": "Auditer et purger les sources de données non autorisées ; documenter l’origine contractuelle ou le consentement explicite de chaque référentiel de connaissances.",
    "de": "Nicht autorisierte Datenquellen prüfen und löschen; Dokumentieren Sie den vertraglichen Ursprung oder die ausdrückliche Zustimmung jedes Wissensspeichers."
  },
  "Principio de Finalidad y No Reutilización Indebida": {
    "en": "Principle of Purpose and No Improper Reuse",
    "pt": "Princípio de Propósito e Não Reutilização Indevida",
    "fr": "Principe d'utilisation et non-réutilisation inappropriée",
    "de": "Grundsatz der Zweckbestimmung und keine unsachgemäße Wiederverwendung"
  },
  "Reducir la superficie de exposición de información confidencial en interacciones con modelos de lenguaje.": {
    "en": "Reducing the exposure surface of sensitive information in interactions with language models.",
    "pt": "Reduzindo a superfície de exposição de informações confidenciais nas interações com modelos de linguagem.",
    "fr": "Réduire la surface d'exposition des informations sensibles dans les interactions avec les modèles de langage.",
    "de": "Reduzierung der Offenlegungsfläche sensibler Informationen bei Interaktionen mit Sprachmodellen."
  },
  "El sistema debe inyectar en la ventana de contexto de los modelos únicamente los datos personales estrictamente indispensables para satisfacer la consulta.": {
    "en": "The system must inject into the models' context window only the personal data strictly essential to satisfy the query.",
    "pt": "O sistema deve injetar na janela de contexto dos modelos apenas os dados pessoais estritamente essenciais para satisfazer a consulta.",
    "fr": "Le système doit injecter dans la fenêtre contextuelle des modèles uniquement les données personnelles strictement indispensables pour satisfaire la requête.",
    "de": "Das System darf nur die personenbezogenen Daten in das Kontextfenster der Modelle einfügen, die zur Erfüllung der Anfrage unbedingt erforderlich sind."
  },
  "Establecer barreras técnicas de datos y cláusulas contractuales con proveedores de modelos de nube que prohíban el uso de prompts para re-entrenamiento.": {
    "en": "Establish technical data barriers and contractual clauses with cloud model providers that prohibit the use of prompts for retraining.",
    "pt": "Estabeleça barreiras de dados técnicos e cláusulas contratuais com fornecedores de modelos de nuvem que proíbam o uso de avisos para reciclagem.",
    "fr": "Établissez des barrières techniques en matière de données et des clauses contractuelles avec les fournisseurs de modèles cloud qui interdisent l'utilisation d'invites de recyclage.",
    "de": "Legen Sie technische Datenbarrieren und Vertragsklauseln mit Cloud-Modellanbietern fest, die die Verwendung von Aufforderungen zur Umschulung verbieten."
  },
  "Principio de Proporcionalidad y Minimización en Prompts": {
    "en": "Principle of Proportionality and Minimization in Prompts",
    "pt": "Princípio da Proporcionalidade e Minimização em Prompts",
    "fr": "Principe de proportionnalité et de minimisation des invites",
    "de": "Grundsatz der Verhältnismäßigkeit und Minimierung bei Eingabeaufforderungen"
  },
  "Implementar pre-filtros de consulta que extraigan solo fragmentos relevantes y redacten campos no pertinentes antes de invocar la API del modelo.": {
    "en": "Implement query pre-filters that extract only relevant fragments and redact non-relevant fields before invoking the model API.",
    "pt": "Implemente pré-filtros de consulta que extraiam apenas fragmentos relevantes e editem campos não relevantes antes de invocar a API do modelo.",
    "fr": "Implémentez des préfiltres de requête qui extraient uniquement les fragments pertinents et suppriment les champs non pertinents avant d'appeler l'API du modèle.",
    "de": "Implementieren Sie Abfragevorfilter, die nur relevante Fragmente extrahieren und nicht relevante Felder redigieren, bevor Sie die Modell-API aufrufen."
  },
  "Inspeccionar las plantillas de prompts y componentes de ensamblado RAG para verificar filtros de extracción granular por chunks mínimos.": {
    "en": "Inspect RAG assembly component and prompt templates to verify granular extraction filters for minimum chunks.",
    "pt": "Inspecione o componente de montagem RAG e os modelos de prompt para verificar os filtros de extração granular para obter pedaços mínimos.",
    "fr": "Inspectez le composant d’assemblage RAG et les modèles d’invite pour vérifier les filtres d’extraction granulaires pour un minimum de morceaux.",
    "de": "Überprüfen Sie die RAG-Baugruppenkomponenten und Eingabeaufforderungsvorlagen, um granulare Extraktionsfilter auf minimale Blöcke zu überprüfen."
  },
  "Declaración del Uso de IA en el Aviso de Privacidad": {
    "en": "Declaration of the Use of AI in the Privacy Notice",
    "pt": "Declaração de Uso de IA no Aviso de Privacidade",
    "fr": "Déclaration d'utilisation de l'IA dans l'avis de confidentialité",
    "de": "Erklärung zum Einsatz von KI in der Datenschutzerklärung"
  },
  "Aviso de Privacidad y Consentimiento para Sistemas de IA": {
    "en": "Privacy Notice and Consent for AI Systems",
    "pt": "Aviso de privacidade e consentimento para sistemas de IA",
    "fr": "Avis de confidentialité et consentement pour les systèmes d'IA",
    "de": "Datenschutzerklärung und Einwilligung für KI-Systeme"
  },
  "Cumplir con el deber de información del Art. 16 de la LFPDPPP, permitiendo al usuario conocer el tratamiento automatizado de su información.": {
    "en": "Comply with the duty of information of Art. 16 of the LFPDPPP, allowing the user to know the automated processing of their information.",
    "pt": "Cumprir o dever de informação do art. 16 da LFPDPPP, permitindo ao usuário conhecer o tratamento automatizado de suas informações.",
    "fr": "Respecter le devoir d'information de l'art. 16 du LFPDPPP, permettant à l'utilisateur de connaître le traitement automatisé de ses informations.",
    "de": "Beachten Sie die Informationspflicht des Art. 16 des LFPDPPP, sodass der Benutzer die automatisierte Verarbeitung seiner Informationen erfahren kann."
  },
  "Revisar el texto del Aviso de Privacidad vigente y verificar que describa con claridad el alcance del asistente de IA y las finalidades secundarias.": {
    "en": "Review the text of the current Privacy Notice and verify that it clearly describes the scope of the AI ​​assistant and the secondary purposes.",
    "pt": "Revise o texto do Aviso de Privacidade atual e verifique se ele descreve claramente o escopo do assistente de IA e as finalidades secundárias.",
    "fr": "Lisez le texte de l'avis de confidentialité actuel et vérifiez qu'il décrit clairement la portée de l'assistant IA et les objectifs secondaires.",
    "de": "Überprüfen Sie den Text der aktuellen Datenschutzerklärung und vergewissern Sie sich, dass darin der Umfang des KI-Assistenten und die sekundären Zwecke klar beschrieben sind."
  },
  "El Aviso de Privacidad debe informar expresamente al titular sobre el uso de tecnologías de IA, modelos generativos y toma de decisiones automatizadas sobre sus datos.": {
    "en": "The Privacy Notice must expressly inform the owner about the use of AI technologies, generative models and automated decision making about their data.",
    "pt": "O Aviso de Privacidade deverá informar expressamente o titular sobre o uso de tecnologias de IA, modelos generativos e tomada de decisão automatizada sobre seus dados.",
    "fr": "L'avis de confidentialité doit expressément informer le propriétaire de l'utilisation des technologies d'IA, des modèles génératifs et de la prise de décision automatisée concernant ses données.",
    "de": "Die Datenschutzerklärung muss den Eigentümer ausdrücklich über den Einsatz von KI-Technologien, generativen Modellen und automatisierter Entscheidungsfindung in Bezug auf seine Daten informieren."
  },
  "Establece los requisitos formales del Aviso de Privacidad Integral respecto al uso de Inteligencia Artificial Generativa y la obtención de consentimiento para datos biométricos y de salud.": {
    "en": "Establishes the formal requirements of the Comprehensive Privacy Notice regarding the use of Generative Artificial Intelligence and obtaining consent for biometric and health data.",
    "pt": "Estabelece os requisitos formais do Aviso de Privacidade Abrangente relativamente à utilização de Inteligência Artificial Gerativa e à obtenção de consentimento para dados biométricos e de saúde.",
    "fr": "Établit les exigences formelles de l'Avis complet de confidentialité concernant l'utilisation de l'intelligence artificielle générative et l'obtention du consentement pour les données biométriques et de santé.",
    "de": "Legt die formellen Anforderungen der umfassenden Datenschutzerklärung bezüglich der Nutzung generativer künstlicher Intelligenz und der Einholung der Einwilligung für biometrische Daten und Gesundheitsdaten fest."
  },
  "Medidas de Seguridad Técnicas y Deber de Confidencialidad": {
    "en": "Technical Security Measures and Duty of Confidentiality",
    "pt": "Medidas Técnicas de Segurança e Dever de Confidencialidade",
    "fr": "Mesures techniques de sécurité et devoir de confidentialité",
    "de": "Technische Sicherheitsmaßnahmen und Verschwiegenheitspflicht"
  },
  "Consentimiento Expreso para Datos Sensibles y Biometría": {
    "en": "Express Consent for Sensitive Data and Biometrics",
    "pt": "Consentimento expresso para dados confidenciais e biometria",
    "fr": "Consentement express pour les données sensibles et la biométrie",
    "de": "Ausdrückliche Zustimmung zu sensiblen Daten und biometrischen Daten"
  },
  "Actualizar el Aviso de Privacidad incorporando un apartado específico sobre tratamiento algorítmico, proveedores de nube e inferencia generativa.": {
    "en": "Update the Privacy Notice incorporating a specific section on algorithmic processing, cloud providers and generative inference.",
    "pt": "Atualizar o Aviso de Privacidade incorporando uma seção específica sobre processamento algorítmico, provedores de nuvem e inferência generativa.",
    "fr": "Mettez à jour l'avis de confidentialité en intégrant une section spécifique sur le traitement algorithmique, les fournisseurs de cloud et l'inférence générative.",
    "de": "Aktualisieren Sie die Datenschutzerklärung und fügen Sie einen speziellen Abschnitt zu algorithmischer Verarbeitung, Cloud-Anbietern und generativer Schlussfolgerung hinzu."
  },
  "Validar la existencia de mecanismos de opt-in activo, firma electrónica o casilla no pre-marcada con bitácora inmutable de consentimientos otorgados.": {
    "en": "Validate the existence of active opt-in mechanisms, electronic signature or non-pre-checked box with immutable log of consents granted.",
    "pt": "Validar a existência de mecanismos ativos de opt-in, assinatura eletrónica ou caixa não pré-marcada com registo imutável de consentimentos concedidos.",
    "fr": "Validez l’existence de mécanismes d’opt-in actifs, de signature électronique ou de case non pré-cochée avec un journal immuable des consentements accordés.",
    "de": "Überprüfen Sie das Vorhandensein aktiver Opt-in-Mechanismen, elektronischer Signaturen oder nicht vorab angekreuzter Kästchen mit unveränderlichem Protokoll der erteilten Einwilligungen."
  },
  "Garantizar el cumplimiento reforzado para categorías especiales de datos personales conforme al Art. 9 de la LFPDPPP.": {
    "en": "Guarantee reinforced compliance for special categories of personal data in accordance with Art. 9 of the LFPDPPP.",
    "pt": "Garantir o cumprimento reforçado de categorias especiais de dados pessoais de acordo com o Art. 9º da LFPDPPP.",
    "fr": "Garantir un respect renforcé pour des catégories particulières de données personnelles conformément à l’art. 9 du LFPDPPP.",
    "de": "Gewährleistung einer verstärkten Compliance für besondere Kategorien personenbezogener Daten gemäß Art. 9 des LFPDPPP."
  },
  "Bloquear la captura de datos biométricos o sensibles en agentes de IA hasta que el usuario confirme expresamente la autorización en una interfaz dedicada.": {
    "en": "Block the capture of biometric or sensitive data in AI agents until the user expressly confirms authorization in a dedicated interface.",
    "pt": "Bloquear a captura de dados biométricos ou sensíveis em agentes de IA até que o usuário confirme expressamente a autorização em interface dedicada.",
    "fr": "Bloquez la capture de données biométriques ou sensibles dans les agents IA jusqu'à ce que l'utilisateur confirme expressément son autorisation dans une interface dédiée.",
    "de": "Blockieren Sie die Erfassung biometrischer oder sensibler Daten in KI-Agenten, bis der Benutzer die Autorisierung ausdrücklich in einer speziellen Schnittstelle bestätigt."
  },
  "Las bases de datos vectoriales que contengan representaciones densas (embeddings) de datos personales deben estar cifradas en reposo y protegidas por ACLs granulares.": {
    "en": "Vector databases containing dense representations (embeddings) of personal data must be encrypted at rest and protected by granular ACLs.",
    "pt": "Bancos de dados vetoriais contendo representações densas (incorporação) de dados pessoais devem ser criptografados em repouso e protegidos por ACLs granulares.",
    "fr": "Les bases de données vectorielles contenant des représentations denses (embeddings) de données personnelles doivent être chiffrées au repos et protégées par des ACL granulaires.",
    "de": "Vektordatenbanken, die dichte Darstellungen (Einbettungen) personenbezogener Daten enthalten, müssen im Ruhezustand verschlüsselt und durch granulare ACLs geschützt werden."
  },
  "Cifrado y Control de Acceso en Bases Vectoriales (RAG)": {
    "en": "Encryption and Access Control in Vector Bases (RAG)",
    "pt": "Criptografia e Controle de Acesso em Bases Vetoriais (RAG)",
    "fr": "Chiffrement et contrôle d'accès dans les bases vectorielles (RAG)",
    "de": "Verschlüsselung und Zugriffskontrolle in Vektorbasen (RAG)"
  },
  "Adopción de medidas de seguridad administrativas, físicas y técnicas para salvaguardar la confidencialidad de los datos personales en la arquitectura de IA.": {
    "en": "Adoption of administrative, physical and technical security measures to safeguard the confidentiality of personal data in the AI ​​architecture.",
    "pt": "Adoção de medidas de segurança administrativas, físicas e técnicas para salvaguardar a confidencialidade dos dados pessoais na arquitetura de IA.",
    "fr": "Adoption de mesures de sécurité administratives, physiques et techniques pour sauvegarder la confidentialité des données personnelles dans l'architecture de l'IA.",
    "de": "Einführung administrativer, physischer und technischer Sicherheitsmaßnahmen zur Wahrung der Vertraulichkeit personenbezogener Daten in der KI-Architektur."
  },
  "Cuando el sistema de IA procese biometría (voz, rasgos faciales) o datos de salud, ideología o finanzas, debe recabar el consentimiento expreso y documentado del titular.": {
    "en": "When the AI ​​system processes biometrics (voice, facial features) or health, ideology or financial data, it must obtain the express and documented consent of the owner.",
    "pt": "Quando o sistema de IA processa dados biométricos (voz, características faciais) ou dados de saúde, ideologia ou financeiros, deve obter o consentimento expresso e documentado do proprietário.",
    "fr": "Lorsque le système d’IA traite des données biométriques (voix, traits du visage) ou des données de santé, idéologiques ou financières, il doit obtenir le consentement exprès et documenté du propriétaire.",
    "de": "Wenn das KI-System biometrische Daten (Stimme, Gesichtszüge) oder Gesundheits-, Ideologie- oder Finanzdaten verarbeitet, muss es die ausdrückliche und dokumentierte Zustimmung des Eigentümers einholen."
  },
  "Implementar un módulo automatizado de DLP que detecte y enmascare identificadores personales (CURP, RFC, correos, teléfonos) antes de enviar el prompt al LLM.": {
    "en": "Implement an automated DLP module that detects and masks personal identifiers (CURP, RFC, emails, telephone numbers) before sending the prompt to the LLM.",
    "pt": "Implemente um módulo DLP automatizado que detecte e mascare identificadores pessoais (CURP, RFC, e-mails, telefones) antes de enviar o prompt ao LLM.",
    "fr": "Implémentez un module DLP automatisé qui détecte et masque les identifiants personnels (CURP, RFC, e-mails, téléphones) avant d'envoyer l'invite au LLM.",
    "de": "Implementieren Sie ein automatisiertes DLP-Modul, das persönliche Identifikatoren (CURP, RFC, E-Mails, Telefone) erkennt und maskiert, bevor die Eingabeaufforderung an das LLM gesendet wird."
  },
  "Las bitácoras de eventos, telemetría y trazabilidad del sistema de IA no deben almacenar prompts ni respuestas en texto claro que contengan datos personales.": {
    "en": "The AI ​​system's event, telemetry, and traceability logs should not store prompts or clear text responses that contain personal data.",
    "pt": "Os registros de eventos, telemetria e rastreabilidade do sistema de IA não devem armazenar prompts ou respostas em texto não criptografado que contenham dados pessoais.",
    "fr": "Les journaux d'événements, de télémétrie et de traçabilité du système d'IA ne doivent pas stocker d'invites ou de réponses en texte clair contenant des données personnelles.",
    "de": "In den Ereignis-, Telemetrie- und Rückverfolgbarkeitsprotokollen des KI-Systems sollten keine Eingabeaufforderungen oder Klartextantworten gespeichert werden, die personenbezogene Daten enthalten."
  },
  "Habilitar cifrado administrado por el cliente (CMEK) en bases vectoriales y configurar filtros de metadatos estrictos en las consultas semánticas.": {
    "en": "Enable client-managed encryption (CMEK) on vector bases and configure strict metadata filters on semantic queries.",
    "pt": "Ative a criptografia gerenciada pelo cliente (CMEK) em bases vetoriais e configure filtros rigorosos de metadados em consultas semânticas.",
    "fr": "Activez le chiffrement géré par le client (CMEK) sur des bases vectorielles et configurez des filtres de métadonnées stricts sur les requêtes sémantiques.",
    "de": "Aktivieren Sie die vom Client verwaltete Verschlüsselung (CMEK) auf Vektorbasis und konfigurieren Sie strenge Metadatenfilter für semantische Abfragen."
  },
  "Comprobar el cifrado AES-256 en el cluster vectorial y verificar que cada consulta aplique pre-filtrado por identificador de tenant o usuario.": {
    "en": "Check AES-256 encryption in the vector cluster and verify that each query applies pre-filtering by tenant or user identifier.",
    "pt": "Verifique a criptografia AES-256 no cluster vetorial e verifique se cada consulta aplica a pré-filtragem por locatário ou identificador de usuário.",
    "fr": "Vérifiez le cryptage AES-256 dans le cluster vectoriel et vérifiez que chaque requête applique un pré-filtrage par locataire ou identifiant d'utilisateur.",
    "de": "Überprüfen Sie die AES-256-Verschlüsselung im Vektorcluster und stellen Sie sicher, dass jede Abfrage eine Vorfilterung nach Mandant oder Benutzer-ID anwendet."
  },
  "Enmascaramiento y Redacción Previa de PII (Data Loss Prevention)": {
    "en": "Masking and Redaction of PII (Data Loss Prevention)",
    "pt": "Mascaramento e redação de PII (prevenção contra perda de dados)",
    "fr": "Masquage et rédaction des informations personnelles (prévention de la perte de données)",
    "de": "Maskierung und Schwärzung personenbezogener Daten (Verhinderung von Datenverlust)"
  },
  "Evitar ataques de reconstrucción vectorial o exfiltración masiva de información confidencial desde almacenes de RAG.": {
    "en": "Prevent vector reconstruction attacks or mass exfiltration of sensitive information from RAG stores.",
    "pt": "Evite ataques de reconstrução vetorial ou exfiltração em massa de informações confidenciais de armazenamentos RAG.",
    "fr": "Empêchez les attaques de reconstruction vectorielle ou l’exfiltration massive d’informations sensibles des magasins RAG.",
    "de": "Verhindern Sie Vektorrekonstruktionsangriffe oder die Massenexfiltration sensibler Informationen aus RAG-Stores."
  },
  "Impedir que datos personales en texto claro viajen innecesariamente a los endpoints de inferencia o queden registrados en memorias temporales.": {
    "en": "Prevent personal data in clear text from traveling unnecessarily to inference endpoints or being recorded in temporary memories.",
    "pt": "Evite que dados pessoais em texto simples viajem desnecessariamente para pontos de extremidade de inferência ou sejam gravados em memórias temporárias.",
    "fr": "Empêchez les données personnelles en texte clair de voyager inutilement vers des points finaux d’inférence ou d’être enregistrées dans des mémoires temporaires.",
    "de": "Verhindern Sie, dass personenbezogene Daten im Klartext unnötigerweise an Inferenzendpunkte gelangen oder in temporären Speichern aufgezeichnet werden."
  },
  "Verificar en el código la integración de herramientas de redacción de PII (ej. Microsoft Presidio, Google Cloud Sensitive Data Protection) en el middleware.": {
    "en": "Verify in the code the integration of PII redaction tools (e.g. Microsoft Presidio, Google Cloud Sensitive Data Protection) in the middleware.",
    "pt": "Verifique no código a integração de ferramentas de redação de PII (por exemplo, Microsoft Presidio, Google Cloud Sensitive Data Protection) no middleware.",
    "fr": "Vérifiez dans le code l'intégration des outils de rédaction de PII (par exemple Microsoft Presidio, Google Cloud Sensitive Data Protection) dans le middleware.",
    "de": "Überprüfen Sie im Code die Integration von PII-Redaktionstools (z. B. Microsoft Presidio, Google Cloud Sensitive Data Protection) in der Middleware."
  },
  "Configurar un pipeline de sanitización con expresiones regulares y NER (Named Entity Recognition) que reemplace PII por tokens sintéticos antes de llamar al modelo.": {
    "en": "Set up a sanitization pipeline with regular expressions and Named Entity Recognition (NER) that replaces PII with synthetic tokens before calling the model.",
    "pt": "Configure um pipeline de sanitização com expressões regulares e Named Entity Recognition (NER) que substitui PII por tokens sintéticos antes de chamar o modelo.",
    "fr": "Configurez un pipeline de nettoyage avec des expressions régulières et la reconnaissance d'entités nommées (NER) qui remplace les informations personnelles par des jetons synthétiques avant d'appeler le modèle.",
    "de": "Richten Sie eine Bereinigungspipeline mit regulären Ausdrücken und Named Entity Recognition (NER) ein, die PII durch synthetische Token ersetzt, bevor Sie das Modell aufrufen."
  },
  "Deber de Confidencialidad y Sanitización de Logs": {
    "en": "Duty of Confidentiality and Sanitation of Logs",
    "pt": "Dever de Confidencialidade e Higienização de Toras",
    "fr": "Devoir de confidentialité et d’assainissement des journaux",
    "de": "Pflicht zur Vertraulichkeit und Aufbewahrung von Protokollen"
  },
  "Aplicar filtros de supresión de contenido sensible en los transportadores de logs (Winston, Fluentd, OpenTelemetry).": {
    "en": "Apply sensitive content suppression filters in log transporters (Winston, Fluentd, OpenTelemetry).",
    "pt": "Aplique filtros de supressão de conteúdo confidencial em transportadores de log (Winston, Fluentd, OpenTelemetry).",
    "fr": "Appliquez des filtres de suppression de contenu sensible dans les transporteurs de journaux (Winston, Fluentd, OpenTelemetry).",
    "de": "Wenden Sie Filter zur Unterdrückung vertraulicher Inhalte in Protokolltransportern an (Winston, Fluentd, OpenTelemetry)."
  },
  "Desarrollar una función de exportación que busque en la base vectorial por ID de usuario y genere un informe legible de datos indexados.": {
    "en": "Develop an export function that searches the vector database by user ID and generates a readable report of indexed data.",
    "pt": "Desenvolva uma função de exportação que pesquise o banco de dados vetorial por ID do usuário e gere um relatório legível de dados indexados.",
    "fr": "Développez une fonction d'exportation qui recherche dans la base de données vectorielles par ID utilisateur et génère un rapport lisible des données indexées.",
    "de": "Entwickeln Sie eine Exportfunktion, die die Vektordatenbank nach Benutzer-ID durchsucht und einen lesbaren Bericht der indizierten Daten generiert."
  },
  "Preservar el deber de confidencialidad del Art. 21 de la LFPDPPP evitando fugas de información a través de sistemas de observabilidad.": {
    "en": "Preserve the duty of confidentiality of Art. 21 of the LFPDPPP, avoiding information leaks through observability systems.",
    "pt": "Preservar o dever de confidencialidade do art. 21.º da LFPDPPP, evitando fugas de informação através de sistemas de observabilidade.",
    "fr": "Préserver le devoir de confidentialité de l’art. 21 du LFPDPPP, évitant les fuites d’informations via les systèmes d’observabilité.",
    "de": "Wahrung der Verschwiegenheitspflicht des Art. 21 des LFPDPPP, Vermeidung von Informationslecks durch Observability-Systeme."
  },
  "Examinar los logs de SIEM, Cloud Logging o consola y validar que los payloads de prompts se encuentren anonimizados o con hashing criptográfico.": {
    "en": "Examine the SIEM, Cloud Logging or console logs and validate that the prompt payloads are anonymized or cryptographically hashed.",
    "pt": "Examine os logs do SIEM, do Cloud Logging ou do console e verifique se as cargas de prompt são anônimas ou criptografadas com hash.",
    "fr": "Examinez les journaux SIEM, Cloud Logging ou de la console et vérifiez que les charges utiles des invites sont anonymisées ou hachées de manière cryptographique.",
    "de": "Untersuchen Sie die SIEM-, Cloud Logging- oder Konsolenprotokolle und stellen Sie sicher, dass die Prompt-Payloads anonymisiert oder kryptografisch gehasht sind."
  },
  "Derechos ARCO en Sistemas Algorítmicos y RAG": {
    "en": "ARCO Rights in Algorithmic Systems and RAG",
    "pt": "Direitos ARCO em Sistemas Algorítmicos e RAG",
    "fr": "Droits ARCO sur les systèmes algorithmiques et RAG",
    "de": "ARCO-Rechte an algorithmischen und RAG-Systemen"
  },
  "Derecho de Cancelación y Olvido en Índices Semánticos": {
    "en": "Right to Cancel and Forget in Semantic Indexes",
    "pt": "Direito de cancelar e esquecer em índices semânticos",
    "fr": "Droit d'annulation et d'oubli dans les index sémantiques",
    "de": "Recht auf Löschung und Vergessen in semantischen Indizes"
  },
  "Derecho de Acceso y Explicabilidad Algorítmica": {
    "en": "Right of Access and Algorithmic Explainability",
    "pt": "Direito de acesso e explicabilidade algorítmica",
    "fr": "Droit d’accès et explicabilité algorithmique",
    "de": "Zugriffsrecht und algorithmische Erklärbarkeit"
  },
  "Permitir al usuario conocer y verificar los datos tratados por el sistema de IA conforme al Art. 23 de la LFPDPPP.": {
    "en": "Allow the user to know and verify the data processed by the AI ​​system in accordance with Art. 23 of the LFPDPPP.",
    "pt": "Permitir ao usuário conhecer e verificar os dados processados ​​pelo sistema de IA de acordo com o Art. 23 da LFPDPPP.",
    "fr": "Permettre à l'utilisateur de connaître et de vérifier les données traitées par le système d'IA conformément à l'art. 23 du LFPDPPP.",
    "de": "Ermöglichen Sie dem Benutzer, die vom KI-System gemäß Art. verarbeiteten Daten zu kennen und zu überprüfen. 23 des LFPDPPP."
  },
  "Mecanismos operativos y técnicos para garantizar que los titulares puedan ejercer sus derechos constitucionales de protección de datos frente a sistemas de IA.": {
    "en": "Operational and technical mechanisms to ensure that data owners can exercise their constitutional data protection rights against AI systems.",
    "pt": "Mecanismos operacionais e técnicos para garantir que os proprietários dos dados possam exercer os seus direitos constitucionais de proteção de dados contra sistemas de IA.",
    "fr": "Mécanismes opérationnels et techniques pour garantir que les propriétaires de données peuvent exercer leurs droits constitutionnels en matière de protection des données contre les systèmes d’IA.",
    "de": "Operative und technische Mechanismen, um sicherzustellen, dass Dateneigentümer ihre verfassungsmäßigen Datenschutzrechte gegenüber KI-Systemen ausüben können."
  },
  "Revisar la existencia de una API o procedimiento administrativo para listar y exportar los chunks de datos personales asociados a un titular.": {
    "en": "Review the existence of an API or administrative procedure to list and export the chunks of personal data associated with an owner.",
    "pt": "Revise a existência de uma API ou procedimento administrativo para listar e exportar os blocos de dados pessoais associados a um proprietário.",
    "fr": "Vérifiez l’existence d’une API ou d’une procédure administrative pour lister et exporter les morceaux de données personnelles associées à un propriétaire.",
    "de": "Überprüfen Sie, ob eine API oder ein Verwaltungsverfahren vorhanden ist, um die mit einem Eigentümer verbundenen Teile personenbezogener Daten aufzulisten und zu exportieren."
  },
  "El responsable debe poder entregar al titular la información que sobre él se encuentra indexada y explicar la lógica general aplicada en decisiones automatizadas.": {
    "en": "The person responsible must be able to deliver to the owner the information that is indexed about him and explain the general logic applied in automated decisions.",
    "pt": "O responsável deve ser capaz de entregar ao proprietário as informações que estão indexadas sobre ele e explicar a lógica geral aplicada nas decisões automatizadas.",
    "fr": "Le responsable doit être en mesure de remettre au propriétaire les informations répertoriées le concernant et d'expliquer la logique générale appliquée dans les décisions automatisées.",
    "de": "Der Verantwortliche muss in der Lage sein, dem Eigentümer die über ihn erfassten Informationen zu liefern und die allgemeine Logik automatisierter Entscheidungen zu erläutern."
  },
  "Implementar un trigger de borrado en cascada que remueva vectores de Pinecone, Qdrant o pgvector al recibir una solicitud ARCO de cancelación.": {
    "en": "Implement a cascading delete trigger that removes vectors from Pinecone, Qdrant or pgvector upon receiving an ARC cancellation request.",
    "pt": "Implemente um gatilho de exclusão em cascata que remova vetores de Pinecone, Qdrant ou pgvector ao receber uma solicitação de cancelamento de ARC.",
    "fr": "Implémentez un déclencheur de suppression en cascade qui supprime les vecteurs de Pinecone, Qdrant ou pgvector lors de la réception d'une demande de suppression ARC.",
    "de": "Implementieren Sie einen kaskadierenden Löschauslöser, der Vektoren aus Pinecone, Qdrant oder pgvector entfernt, wenn eine ARC-Löschanfrage empfangen wird."
  },
  "Garantizar el bloqueo y supresión de datos personales en almacenes de memoria de IA conforme al Art. 25 de la LFPDPPP.": {
    "en": "Guarantee the blocking and deletion of personal data in AI memory stores in accordance with Art. 25 of the LFPDPPP.",
    "pt": "Garantir o bloqueio e exclusão de dados pessoais em armazenamentos de memória AI de acordo com o Art. 25 da LFPDPPP.",
    "fr": "Garantir le blocage et la suppression des données personnelles dans les mémoires AI conformément à l'art. 25 du LFPDPPP.",
    "de": "Gewährleistung der Sperrung und Löschung personenbezogener Daten in KI-Speichern gemäß Art. 25 des LFPDPPP."
  },
  "Comprobar que las operaciones de borrado eliminen tanto el documento fuente como los embeddings vectoriales vinculados en los índices.": {
    "en": "Verify that the delete operations delete both the source document and the linked vector embeddings in the indexes.",
    "pt": "Verifique se as operações de exclusão excluem o documento de origem e os embeddings de vetores vinculados nos índices.",
    "fr": "Vérifiez que les opérations de suppression suppriment à la fois le document source et les incorporations vectorielles liées dans les index.",
    "de": "Stellen Sie sicher, dass die Löschvorgänge sowohl das Quelldokument als auch die verknüpften Vektoreinbettungen in den Indizes löschen."
  },
  "Procedimiento técnico automatizado para purgar, eliminar o disociar de inmediato los vectores y documentos de un titular ante una solicitud de cancelación.": {
    "en": "Automated technical procedure to immediately purge, eliminate or dissociate a holder's vectors and documents upon a cancellation request.",
    "pt": "Procedimento técnico automatizado para expurgar, eliminar ou dissociar imediatamente os vetores e documentos do titular mediante solicitação de cancelamento.",
    "fr": "Procédure technique automatisée permettant de purger, éliminer ou dissocier immédiatement les vecteurs et documents d'un titulaire lors d'une demande d'annulation.",
    "de": "Automatisiertes technisches Verfahren zur sofortigen Löschung, Entfernung oder Trennung der Vektoren und Dokumente eines Inhabers nach einer Löschungsanfrage."
  },
  "Derecho de Oposición a Decisiones Exclusivamente Automatizadas": {
    "en": "Right to Oppose Exclusively Automated Decisions",
    "pt": "Direito de oposição a decisões exclusivamente automatizadas",
    "fr": "Droit d’opposition aux décisions exclusivement automatisées",
    "de": "Recht, ausschließlich automatisierten Entscheidungen zu widersprechen"
  },
  "Transferencias Internacionales y Proveedores de IA en la Nube": {
    "en": "International Transfers and Cloud AI Providers",
    "pt": "Transferências internacionais e provedores de IA em nuvem",
    "fr": "Transferts internationaux et fournisseurs d'IA cloud",
    "de": "Internationale Überweisungen und Cloud-KI-Anbieter"
  },
  "Evitar afectaciones desfavorables en la esfera jurídica del titular derivadas de dictámenes puramente algorítmicos.": {
    "en": "Avoid unfavorable effects on the legal sphere of the owner derived from purely algorithmic opinions.",
    "pt": "Evitar efeitos desfavoráveis ​​na esfera jurídica do proprietário decorrentes de opiniões puramente algorítmicas.",
    "fr": "Éviter les effets défavorables sur la sphère juridique du propriétaire découlant d'avis purement algorithmiques.",
    "de": "Vermeiden Sie ungünstige Auswirkungen auf die Rechtssphäre des Eigentümers, die sich aus rein algorithmischen Meinungen ergeben."
  },
  "El titular tiene derecho a oponerse a que sus solicitudes, evaluaciones o perfiles sean procesados únicamente por un agente de IA sin revisión humana.": {
    "en": "The owner has the right to object to his applications, evaluations or profiles being processed solely by an AI agent without human review.",
    "pt": "O proprietário tem o direito de se opor a que as suas candidaturas, avaliações ou perfis sejam processados ​​exclusivamente por um agente de IA sem revisão humana.",
    "fr": "Le propriétaire a le droit de s'opposer à ce que ses candidatures, évaluations ou profils soient traités uniquement par un agent IA sans examen humain.",
    "de": "Der Inhaber hat das Recht, der ausschließlichen Verarbeitung seiner Bewerbungen, Bewertungen oder Profile durch einen KI-Agenten ohne menschliche Prüfung zu widersprechen."
  },
  "Configurar una bandera de exclusión que desvíe el caso a una cola de dictaminación humana cuando el titular active su derecho de oposición.": {
    "en": "Set an exclusion flag that diverts the case to a human ruling queue when the owner activates their right to object.",
    "pt": "Defina um sinalizador de exclusão que desvie o caso para uma fila de decisão humana quando o proprietário ativar seu direito de oposição.",
    "fr": "Définissez un indicateur d'exclusion qui détourne le cas vers une file d'attente de décision humaine lorsque le propriétaire active son droit d'opposition.",
    "de": "Legen Sie ein Ausschlussflag fest, das den Fall in eine menschliche Entscheidungswarteschlange umleitet, wenn der Eigentümer sein Widerspruchsrecht aktiviert."
  },
  "Verificar la existencia de un canal de revisión manual o escalamiento humano ante inconformidad con decisiones de elegibilidad o crédito.": {
    "en": "Verify the existence of a manual review channel or human escalation in case of disagreement with eligibility or credit decisions.",
    "pt": "Verifique a existência de canal de revisão manual ou escalonamento humano em caso de desacordo com decisões de elegibilidade ou crédito.",
    "fr": "Vérifiez l'existence d'un canal de révision manuelle ou d'une escalade humaine en cas de désaccord avec les décisions d'éligibilité ou de crédit.",
    "de": "Überprüfen Sie das Vorhandensein eines manuellen Überprüfungskanals oder einer menschlichen Eskalation im Falle von Meinungsverschiedenheiten mit Berechtigungs- oder Kreditentscheidungen."
  },
  "Garantía Contractual de Zero Data Retention (ZDR)": {
    "en": "Zero Data Retention (ZDR) Contractual Guarantee",
    "pt": "Garantia Contratual de Retenção Zero de Dados (ZDR)",
    "fr": "Garantie contractuelle Zéro conservation des données (ZDR)",
    "de": "Vertragsgarantie ohne Vorratsdatenspeicherung (ZDR)."
  },
  "Cumplimiento en Transferencias Transfronterizas": {
    "en": "Compliance in Cross-Border Transfers",
    "pt": "Conformidade em transferências transfronteiriças",
    "fr": "Conformité dans les transferts transfrontaliers",
    "de": "Compliance bei grenzüberschreitenden Überweisungen"
  },
  "Asegurar que los datos transmitidos a terceros queden sujetos a las mismas obligaciones de confidencialidad que el responsable.": {
    "en": "Ensure that data transmitted to third parties are subject to the same confidentiality obligations as the person responsible.",
    "pt": "Garantir que os dados transmitidos a terceiros estão sujeitos às mesmas obrigações de confidencialidade do responsável.",
    "fr": "Veiller à ce que les données transmises à des tiers soient soumises aux mêmes obligations de confidentialité que le responsable.",
    "de": "Stellen Sie sicher, dass an Dritte übermittelte Daten den gleichen Geheimhaltungspflichten unterliegen wie der Verantwortliche."
  },
  "Revisar los términos de servicio empresarial (Enterprise SLA) y constatar que el perfil de plataforma incluya ZDR habilitado.": {
    "en": "Review the Enterprise SLA and verify that the platform profile includes ZDR enabled.",
    "pt": "Revise o SLA empresarial e verifique se o perfil da plataforma inclui ZDR habilitado.",
    "fr": "Consultez le SLA Entreprise et vérifiez que le profil de plate-forme inclut ZDR activé.",
    "de": "Überprüfen Sie das Unternehmens-SLA und stellen Sie sicher, dass das Plattformprofil ZDR aktiviert enthält."
  },
  "Los contratos de servicios con proveedores de API de IA (Google Cloud, etc.) deben garantizar por escrito que no almacenan ni reutilizan datos de clientes.": {
    "en": "Service contracts with AI API providers (Google Cloud, etc.) must guarantee in writing that they do not store or reuse customer data.",
    "pt": "Os contratos de serviço com fornecedores de API de IA (Google Cloud, etc.) devem garantir por escrito que não armazenam nem reutilizam dados de clientes.",
    "fr": "Les contrats de services avec les fournisseurs d'API IA (Google Cloud, etc.) doivent garantir par écrit qu'ils ne stockent ni ne réutilisent les données des clients.",
    "de": "Serviceverträge mit AI-API-Anbietern (Google Cloud etc.) müssen schriftlich garantieren, dass sie Kundendaten nicht speichern oder wiederverwenden."
  },
  "Utilizar exclusivamente cuentas empresariales (Enterprise SaaS / PaaS) que garanticen el aislamiento de datos y prohibición de entrenamiento.": {
    "en": "Use exclusively enterprise accounts (Enterprise SaaS / PaaS) that guarantee data isolation and prohibition of training.",
    "pt": "Utilize exclusivamente contas empresariais (Enterprise SaaS/PaaS) que garantam isolamento de dados e proibição de treinamento.",
    "fr": "Utilisez exclusivement des comptes d'entreprise (Enterprise SaaS / PaaS) qui garantissent l'isolement des données et l'interdiction de formation.",
    "de": "Verwenden Sie ausschließlich Enterprise-Konten (Enterprise SaaS / PaaS), die Datenisolation und Schulungsverbot gewährleisten."
  },
  "Verificar que el envío de datos personales a servidores ubicados fuera de México cumpla con las excepciones o cláusulas contractuales del Art. 36 y 37 de la LFPDPPP.": {
    "en": "Verify that the sending of personal data to servers located outside of Mexico complies with the exceptions or contractual clauses of Art. 36 and 37 of the LFPDPPP.",
    "pt": "Verifique se o envio de dados pessoais a servidores localizados fora do México cumpre as exceções ou cláusulas contratuais do Art. 36.º e 37.º da LFPDPPP.",
    "fr": "Vérifiez que l'envoi de données personnelles à des serveurs situés en dehors du Mexique est conforme aux exceptions ou aux clauses contractuelles de l'art. 36 et 37 du LFPDPPP.",
    "de": "Stellen Sie sicher, dass die Übermittlung personenbezogener Daten an Server außerhalb Mexikos den Ausnahmen oder Vertragsklauseln von Art. entspricht. 36 und 37 des LFPDPPP."
  },
  "Validar que el Aviso de Privacidad incluya la cláusula de transferencias a proveedores de cómputo en la nube y el consentimiento correspondiente.": {
    "en": "Validate that the Privacy Notice includes the clause for transfers to cloud computing providers and the corresponding consent.",
    "pt": "Validar que o Aviso de Privacidade inclui a cláusula de transferências para fornecedores de computação em nuvem e o consentimento correspondente.",
    "fr": "Vérifiez que l'avis de confidentialité inclut la clause de transfert vers des fournisseurs de cloud computing et le consentement correspondant.",
    "de": "Stellen Sie sicher, dass die Datenschutzerklärung die Klausel für Übermittlungen an Cloud-Computing-Anbieter und die entsprechende Einwilligung enthält."
  },
  "Proteger la legalidad de los flujos de datos transfronterizos requeridos para la inferencia de modelos de lenguaje en centros de datos internacionales.": {
    "en": "Protect the legality of cross-border data flows required for language model inference in international data centers.",
    "pt": "Proteja a legalidade dos fluxos de dados transfronteiriços necessários para inferência de modelos linguísticos em data centers internacionais.",
    "fr": "Protégez la légalité des flux de données transfrontaliers nécessaires à l’inférence de modèles linguistiques dans les centres de données internationaux.",
    "de": "Schützen Sie die Rechtmäßigkeit grenzüberschreitender Datenströme, die für die Sprachmodellinferenz in internationalen Rechenzentren erforderlich sind."
  },
  "Condiciones legales y técnicas obligatorias al transferir datos personales a proveedores de inferencia en la nube o servicios de IA alojados en el extranjero.": {
    "en": "Mandatory legal and technical conditions when transferring personal data to providers of cloud inference or AI services hosted abroad.",
    "pt": "Condições legais e técnicas obrigatórias na transferência de dados pessoais para fornecedores de inferência em nuvem ou serviços de IA hospedados no exterior.",
    "fr": "Conditions juridiques et techniques obligatoires lors du transfert de données personnelles vers des fournisseurs de services d'inférence cloud ou d'IA hébergés à l'étranger.",
    "de": "Zwingende rechtliche und technische Bedingungen bei der Übermittlung personenbezogener Daten an im Ausland gehostete Anbieter von Cloud-Inferenz- oder KI-Diensten."
  },
  "Gestión de Brechas de Seguridad y Rendición de Cuentas": {
    "en": "Security Gap Management and Accountability",
    "pt": "Gerenciamento e responsabilidade de lacunas de segurança",
    "fr": "Gestion des failles de sécurité et responsabilité",
    "de": "Sicherheitslückenmanagement und Rechenschaftspflicht"
  },
  "Formalizar cláusulas contractuales tipo (Data Processing Addendum - DPA) con los proveedores internacionales de nube de IA.": {
    "en": "Formalize standard contractual clauses (Data Processing Addendum - DPA) with international AI cloud providers.",
    "pt": "Formalize cláusulas contratuais padrão (Data Processing Addendum - DPA) com provedores internacionais de nuvem de IA.",
    "fr": "Formaliser des clauses contractuelles standards (Data Processing Addendum - DPA) avec les fournisseurs internationaux de cloud IA.",
    "de": "Formulieren Sie Standardvertragsklauseln (Data Processing Addendum – DPA) mit internationalen KI-Cloud-Anbietern."
  },
  "Detección de Exfiltración de PII por Prompt Injection": {
    "en": "PII Exfiltration Detection by Prompt Injection",
    "pt": "Detecção de exfiltração de PII por injeção imediata",
    "fr": "Détection d'exfiltration de PII par injection rapide",
    "de": "PII-Exfiltrationserkennung durch sofortige Injektion"
  },
  "Revisar registros de eventos del WAF de IA o middleware de detección de prompt injection y las alertas de anomalías en respuestas de salida.": {
    "en": "Review event logs from the AI ​​WAF or prompt injection detection middleware and alerts for anomalies in output responses.",
    "pt": "Revise os logs de eventos do AI WAF ou do middleware de detecção de injeção imediata e alertas para anomalias nas respostas de saída.",
    "fr": "Consultez les journaux d'événements de l'IA WAF ou du middleware de détection d'injection rapide et des alertes en cas d'anomalies dans les réponses de sortie.",
    "de": "Überprüfen Sie Ereignisprotokolle der KI-WAF oder veranlassen Sie die Middleware zur Injektionserkennung und warnen Sie bei Anomalien in den Ausgabeantworten."
  },
  "Procedimientos para identificar fugas de información, notificar vulneraciones al INAI y mantener la evidencia técnica del cumplimiento de seguridad.": {
    "en": "Procedures to identify information leaks, report violations to the INAI and maintain technical evidence of security compliance.",
    "pt": "Procedimentos para identificar fugas de informação, reportar violações ao INAI e manter provas técnicas de conformidade de segurança.",
    "fr": "Procédures pour identifier les fuites d'informations, signaler les violations à l'INAI et conserver les preuves techniques de la conformité en matière de sécurité.",
    "de": "Verfahren zur Identifizierung von Informationslecks, zur Meldung von Verstößen an das INAI und zur Aufrechterhaltung technischer Beweise für die Einhaltung der Sicherheitsvorschriften."
  },
  "Prevenir vulneraciones de seguridad que comprometan de forma masiva los datos personales almacenados en bases de conocimiento corporativas.": {
    "en": "Prevent security breaches that massively compromise personal data stored in corporate knowledge bases.",
    "pt": "Evite violações de segurança que comprometam enormemente os dados pessoais armazenados em bases de conhecimento corporativas.",
    "fr": "Prévenez les failles de sécurité qui compromettent massivement les données personnelles stockées dans les bases de connaissances de l'entreprise.",
    "de": "Verhindern Sie Sicherheitsverstöße, die die in den Wissensdatenbanken des Unternehmens gespeicherten personenbezogenen Daten massiv gefährden."
  },
  "Monitoreo continuo en tiempo real para detectar y bloquear intentos de inyección indirecta de prompts orientados a exfiltrar datos de otros usuarios.": {
    "en": "Continuous real-time monitoring to detect and block indirect injection attempts of prompts aimed at exfiltrating data from other users.",
    "pt": "Monitoramento contínuo em tempo real para detectar e bloquear tentativas de injeção indireta de prompts destinados a exfiltrar dados de outros usuários.",
    "fr": "Surveillance continue en temps réel pour détecter et bloquer les tentatives d'injection indirecte d'invites visant à exfiltrer les données d'autres utilisateurs.",
    "de": "Kontinuierliche Echtzeitüberwachung zur Erkennung und Blockierung indirekter Einschleusungsversuche von Eingabeaufforderungen, die darauf abzielen, Daten von anderen Benutzern zu extrahieren."
  },
  "Implementar guardrails defensivos (NeMo Guardrails, Llama Guard o delimitadores XML estrictos) y rate limiting por tenant.": {
    "en": "Implement defensive guardrails (NeMo Guardrails, Llama Guard or strict XML delimiters) and rate limiting per tenant.",
    "pt": "Implemente proteções defensivas (NeMo Guardrails, Llama Guard ou delimitadores XML estritos) e limitação de taxa por locatário.",
    "fr": "Implémentez des garde-corps défensifs (NeMo Guardrails, Llama Guard ou délimiteurs XML stricts) et une limitation de débit par locataire.",
    "de": "Implementieren Sie defensive Leitplanken (NeMo Guardrails, Llama Guard oder strenge XML-Trennzeichen) und Ratenbegrenzung pro Mandant."
  }
};

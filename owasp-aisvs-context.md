# OWASP Artificial Intelligence Security Verification Standard (AISVS) Version 1.0

The OWASP Artificial Intelligence Security Verification Standard (AISVS) v1.0 is a community-driven catalog of testable security requirements for AI-enabled systems. Every requirement is assigned a Verification Level:
- **Level 1 (L1 - Essential Baseline)**: Mandatory for all AI systems, internal tools, and low-risk applications.
- **Level 2 (L2 - Standard / Consequential)**: Required for production applications handling sensitive data, business workflows, or consequential decisions.
- **Level 3 (L3 - Advanced / Critical)**: Reserved for high-risk, safety-critical, financial, or core infrastructure AI systems.

---

## C01: Integridad y Trazabilidad de Datos de Entrenamiento (Training Data Integrity & Traceability)
**Control Objective**: Ensure training, fine-tuning, and RAG grounding data are sourced from verified origins, cryptographically validated, protected from poisoning, and adhere to privacy and consent.
- **C01.1 (L1)**: Verify data source provenance is cataloged with origin, license, consent verification, and cryptographic hash verification.
- **C01.2 (L1)**: Verify that datasets used for fine-tuning or evaluation are scanned for data poisoning, backdoor triggers, and unauthorized PII.
- **C01.3 (L2)**: Verify that data preprocessing pipelines enforce deterministic transformations and maintain immutable data lineage audit trails.
- **C01.4 (L3)**: Verify cryptographic signing of training dataset snapshots and validation of data labeling consensus.

## C02: Validación de Entradas (Input Validation & Prompt Injection Defense)
**Control Objective**: Enforce defense-in-depth on all inputs (text, documents, multimodal) before tokenization and model execution.
- **C02.1 (L1 - Req 2.1.1)**: Verify input normalization (Unicode canonicalization NFKC, whitespace collapsing) is applied before tokenization or embedding.
- **C02.2 (L1 - Req 2.1.2)**: Verify encoding and representation smuggling (e.g. Base64, Cyrillic homoglyphs, zero-width spaces, escape sequences) is detected and mitigated.
- **C02.3 (L1 - Req 2.1.3)**: Verify all inputs steering model behavior are treated as untrusted and screened by prompt injection rulesets or dedicated safety classifiers.
- **C02.4 (L1 - Req 2.1.4)**: Verify strict input length limits preventing context window exhaustion; reject inputs that exceed token quotas (HTTP 400) rather than silently truncating.
- **C02.5 (L1 - Req 2.1.5)**: Verify allow-list character set validation permitting only necessary characters.
- **C02.6 (L2 - Req 2.1.6)**: Verify strict instruction hierarchy where developer/system instructions override user instructions, demarcated by unambiguous boundary tokens (e.g. XML tags, ChatML).
- **C02.7 (L2 - Req 2.1.7)**: Verify reserved special tokens (e.g. `<|endoftext|>`, `<start_of_turn>`) cannot be injected into the context as control sequences.
- **C02.8 (L2 - Req 2.2.1)**: Verify content & policy screening for hate, violence, self-harm, and illegal acts against configurable thresholds.
- **C02.9 (L2 - Req 2.2.3)**: Verify non-text inputs (images/PDFs/audio) are scanned for adversarial perturbations, steganographic payloads, and embedded OCR prompt injection.
- **C02.10 (L3 - Req 2.1.8)**: Verify detection of many-shot jailbreaking patterns and multi-turn adversarial state accumulation.

## C03: Gestión del Ciclo de Vida del Modelo (Model Lifecycle Management)
**Control Objective**: Govern base model selection, fine-tuning, quantization, artifact integrity, and decommissioning.
- **C03.1 (L1)**: Verify cryptographic verification (SHA-256 / Sigstore cosign signatures) of model weights and architecture definitions before runtime loading.
- **C03.2 (L1)**: Verify secure storage of model checkpoints in isolated, access-controlled artifact repositories with versioning.
- **C03.3 (L2)**: Verify that fine-tuning environments are air-gapped or network-restricted to prevent exfiltration of training weights.
- **C03.4 (L3)**: Verify formal decommissioning, weight shredding, and cache clearing procedures when models or endpoints are retired.

## C04: Seguridad de Infraestructura (Infrastructure Security)
**Control Objective**: Harden compute platforms, accelerators, network perimeters, and sandbox environments.
- **C04.1 (L1)**: Verify inference runtimes execute in non-privileged, rootless container environments with read-only root filesystems.
- **C04.2 (L2)**: Verify sandboxing (e.g. gVisor, Firecracker microVMs, seccomp/AppArmor) for untrusted code execution or dynamic agent evaluation.
- **C04.3 (L2)**: Verify network isolation preventing direct egress from the model hosting environment to internal core enterprise networks.
- **C04.4 (L3)**: Verify hardware accelerator (GPU/TPU) memory scrubbing between multi-tenant workloads to prevent cross-session memory leakage.

## C05: Control de Acceso e Identidad (Access Control and Identity)
**Control Objective**: Implement zero-trust identity, authentication, and authorization across users, models, and tools.
- **C05.1 (L1)**: Verify robust authentication (OAuth 2.1, OIDC, mTLS) for all clients invoking AI endpoints.
- **C05.2 (L1)**: Verify least-privilege service identities; model services must not inherit broad cloud infrastructure permissions.
- **C05.3 (L2)**: Verify that user security context and scopes propagate to downstream tool calls without passing raw master credentials or tokens.
- **C05.4 (L3)**: Verify per-user and per-tenant cryptographic isolation of session states and conversational context.

## C06: Seguridad en la Cadena de Suministro (Supply Chain Security)
**Control Objective**: Audit third-party foundational models, orchestration libraries, and serialization formats.
- **C06.1 (L1)**: Verify Software Bill of Materials (SBOM / AIBOM) covering all ML frameworks (PyTorch, Transformers, LangChain) and pre-trained weights.
- **C06.2 (L1)**: Verify restriction on unsafe serialization formats (e.g. forbid unverified Python `pickle`; require `safetensors`).
- **C06.3 (L2)**: Verify automated dependency vulnerability scanning (SCA) in CI/CD for all AI dependencies with blocking gates on critical CVEs.
- **C06.4 (L3)**: Verify provenance checks against trusted registries for any third-party fine-tuned adapters or LoRA weights.

## C07: Comportamiento del Modelo y Manejo de Salidas (Model Behavior & Output Handling)
**Control Objective**: Prevent downstream execution attacks (XSS, SQLi, SSRF), hallucinated actions, and sensitive data leakage.
- **C07.1 (L1)**: Verify all model outputs are treated as untrusted and properly contextualized/escaped before rendering in web browsers (prevent XSS) or passing to SQL/command executors.
- **C07.2 (L1)**: Verify output filters detect and redact sensitive data (PII, API keys, credentials) before sending responses to clients.
- **C07.3 (L2)**: Verify automated fact-checking or grounding verification against retrieved evidence to detect and flag hallucinations in high-stakes domains.
- **C07.4 (L3)**: Verify structured schema enforcement (e.g. JSON schema constraint at decoding time) to prevent grammar deviations and format injection.

## C08: Memoria, Embeddings y Base de Datos Vectorial (Memory, Embeddings & Vector DB)
**Control Objective**: Secure RAG knowledge stores, vector representations, and semantic search boundaries.
- **C08.1 (L1)**: Verify document-level and chunk-level Access Control Lists (ACLs) are strictly enforced at query time in vector searches so users only retrieve authorized context.
- **C08.2 (L1)**: Verify data sanitization and malware/prompt-injection scanning on documents prior to generating embeddings and ingesting into vector stores.
- **C08.3 (L2)**: Verify multi-tenant namespace isolation in vector databases preventing cross-tenant semantic similarity retrieval.
- **C08.4 (L3)**: Verify monitoring of embedding drift and detection of adversarial perturbations designed to manipulate vector nearest-neighbor queries.

## C09: Orquestación y Acción Agéntica (Orchestration & Agentic Action)
**Control Objective**: Constrain autonomous execution, tool calling, and multi-step workflows with guardrails.
- **C09.1 (L1)**: Verify deterministic schema validation on all parameters generated by the LLM before passing them to function/tool endpoints.
- **C09.2 (L1)**: Verify Human-in-the-Loop (HITL) authorization for critical, irreversible, or financial actions (dual approval / explicit confirmation).
- **C09.3 (L2)**: Verify strict scoping and read-only default permissions for agent tools, limiting blast radius of tool execution.
- **C09.4 (L3)**: Verify transaction rollback or compensating action capabilities for multi-step autonomous agent workflows.

## C10: Seguridad de Model Context Protocol - MCP (Model Context Protocol Security)
**Control Objective**: Secure discovery, transport, authorization, and tool execution in MCP integrations.
- **C10.1 (L1 - Req 10.1.1)**: Verify that MCP components and tool definitions are obtained only from trusted sources and verified.
- **C10.2 (L1 - Req 10.2.1/10.2.2)**: Verify MCP servers validate access tokens for each request and check issuer, audience, expiration, and authorized scopes (OAuth 2.1).
- **C10.3 (L1 - Req 10.3.1)**: Verify authenticated, encrypted streamable HTTP (TLS 1.3) is used for remote MCP transport; stdio is restricted to local isolated environments.
- **C10.4 (L2 - Req 10.1.3)**: Verify locally launched MCP servers run in a least-privilege sandbox with restricted filesystem, process, and network access.
- **C10.5 (L2 - Req 10.2.4/10.2.5)**: Verify MCP tools/list returns only tools authorized by resource owner scopes, and access control is enforced on every tool invocation with argument validation.
- **C10.6 (L2 - Req 10.3.3)**: Verify MCP servers validate Origin and Host headers independently on all HTTP-based transports to prevent DNS rebinding attacks.

## C11: Robustez Adversarial y Prevención de DoW (Adversarial Robustness & Abuse)
**Control Objective**: Prevent model extraction, continuous jailbreaking, and Denial of Wallet (DoW) resource exhaustion.
- **C11.1 (L1)**: Verify rate limiting, concurrency quotas, and monetary spend caps per user/API key to prevent Denial of Wallet (DoW) compute exhaustion.
- **C11.2 (L2)**: Verify detection of automated fuzzing, systematic boundary probing, and iterative jailbreak optimization frameworks.
- **C11.3 (L2)**: Verify defensive prompt structuring that prevents model inversion, system prompt extraction, or reconstruction of training data.
- **C11.4 (L3)**: Verify adaptive temperature, noise injection, or differential privacy protections against model extraction attacks.

## C12: Monitoreo, Auditoría y Trazabilidad (Monitoring & Logging)
**Control Objective**: Maintain immutable audit trails of prompts, outputs, security alerts, and agent decisions.
- **C12.1 (L1)**: Verify immutable audit logging (Write-Once-Read-Many / centralized SIEM) recording prompts, system versions, tool invocations, and responses.
- **C12.2 (L1)**: Verify real-time alerting on repeated prompt injection attempts, anomalous token usage spikes, or security rule triggers.
- **C12.3 (L2)**: Verify that sensitive data (PII, credentials) is masked or tokenized prior to committing audit log entries.
- **C12.4 (L3)**: Verify full end-to-end explainability and decision traceability linking every agent action to the exact prompt, retrieved context, and model version.

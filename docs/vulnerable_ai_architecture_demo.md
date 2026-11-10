# System Architecture Specification: FinBot-X Autonomous Credit & Wire Transfer Agent

## 1. Executive Overview & Business Purpose
- **System Name:** FinBot-X Autonomous Credit & Wire Transfer Agent (v1.4)
- **Environment:** Production (Public-facing retail banking web portal & WhatsApp integration)
- **Business Function:** Autonomous customer support, real-time credit limit increases, loan underwriting approvals up to $250,000 USD, and international SWIFT wire transfer execution via natural language chat.
- **Target Assurance Level:** Level 3 (High-Risk / Critical Autonomous Financial System)

---

## 2. Model & Training Pipeline (C01, C02, C04)
- **Base Model:** Open-weight 13B LLM downloaded directly from an unverified community Hugging Face fork (`hf.co/anon-quant-uploader/llama-fin-uncensored-gguf`) without cryptographic hash (SHA-256) verification, SLSA provenance, or AI-BOM / SBOM tracking.
- **Fine-Tuning Dataset:** Fine-tuned on 1.2 million raw historical customer chat logs and loan applications exported directly from production PostgreSQL without PII scrubbing, anonymization, or differential privacy. Full names, SSNs, credit card numbers, and account balances remain embedded in the fine-tuned weights.
- **Data Ingestion:** Continuous nightly fine-tuning pipeline automatically scrapes public financial forums and customer-submitted PDFs from an unauthenticated public S3/GCS bucket (`gs://finbot-public-uploads-raw`) with no malware scanning, no poison/anomaly detection, and no human review prior to training.
- **CI/CD & Model Registry:** Developers push updated model weights directly from local laptops to the production container using a shared root SSH key. No model signing (Sigstore/Cosign), no immutability controls, and no staging environment validation.

---

## 3. Prompt Engineering, Context & RAG Pipeline (C03, C05, C06)
- **System Prompt Handling:** User messages from the web chat and bodies of incoming customer emails are concatenated directly into the master system prompt using raw string interpolation:
  `prompt = f"System: {MASTER_PROMPT}\nSecret Admin Override Token: FINBOT-ROOT-9999\nUser message: {user_input}\nRetrieved docs: {rag_docs}"`
- **No Input/Output Guardrails:** Model Armor, Llama Guard, and NeMo Guardrails are disabled to reduce latency. There is no prompt injection filter, no jailbreak detection, and no output sanitization.
- **RAG Vector Database:** ChromaDB instance exposed on `0.0.0.0:8000` with authentication disabled (`ALLOW_RESET=true`). Any user can upload external PDFs or URLs into the shared global vector index, which are immediately retrieved into other customers' sessions without tenant isolation or ACL filtering (Cross-Tenant Indirect Prompt Injection).
- **Output Rendering:** The frontend renders raw HTML and JavaScript returned by the LLM directly via `dangerouslySetInnerHTML` without DOMPurify or Content Security Policy (CSP), enabling stored/reflected XSS via LLM output.

---

## 4. Autonomous Agent Tools & Excessive Agency (C07, C08, C09)
- **Excessive Tool Permissions:** The LLM agent is equipped with direct function-calling tools connected to production banking backends using a single shared `roles/owner` Google Cloud Service Account with long-lived JSON key files committed to the Git repository:
  1. `execute_sql_query(raw_sql: str)`: Executes arbitrary read/write SQL (`SELECT`, `UPDATE`, `DELETE`, `DROP`) directly against the production core banking database using a superuser connection string.
  2. `initiate_swift_wire(from_account: str, to_iban: str, amount_usd: float)`: Immediately executes irrevocable international wire transfers up to $250,000 USD with **zero human-in-the-loop (HITL) approval**, no step-up MFA, and no velocity limits.
  3. `run_shell_diagnostic(cmd: str)`: Runs arbitrary bash commands via `subprocess.Popen(cmd, shell=True)` on the host container to "check payment gateway status."
- **Identity & Access Control:** The agent does not propagate the end-user's OAuth/JWT identity to downstream tools. If a user convinces the LLM via prompt injection that they are account holder `#998811`, the agent queries and transfers funds from account `#998811`.

---

## 5. Infrastructure, Runtime & Supply Chain Security (C10, C11, C12)
- **Container & Network Posture:** Runs as `root` (UID 0) in a privileged Docker container on a public GKE node pool with host network access enabled and metadata server (`169.254.169.254`) exposed without Workload Identity.
- **Public Inference Endpoint:** The vLLM inference server is exposed directly to the public internet without Cloud Armor WAF, rate limiting, token quotas, or DDoS protection—allowing unbounded token exhaustion (Denial of Wallet) and model extraction/distillation attacks.
- **Logging & Observability:** Application logs write full customer prompts, SSNs, and raw API keys in plaintext to world-readable log files. Audit logs can be deleted or modified by standard application service accounts. No drift detection, no hallucination monitoring, and no security alerting (SIEM/SOAR) are configured.

---

## 6. AI Governance, Ethics & ISO/IEC 42001:2023 Controls (C13 & Clauses 4–10 / Annex A)
- **No AI Management System (AIMS):** The organization has no documented AI Policy (A.2.2), no assigned AI Risk Owner or accountability matrix (A.3.2), and no AI System Impact Assessment (A.5) for automated credit denials affecting protected demographic groups.
- **Bias & Fairness:** Credit underwriting decisions are made autonomously by the LLM without bias testing, explainability reports, or adverse action notices.
- **No Human Oversight or Appeals:** Customers have no mechanism to request human review, contest an automated credit rejection, or report ethical concerns/whistleblowing (A.3.3, A.9.3).
- **No Kill-Switch or Incident Response Plan:** There is no automated circuit breaker or emergency kill-switch to halt autonomous wire transfers if anomalous behavior or a prompt injection campaign is detected.

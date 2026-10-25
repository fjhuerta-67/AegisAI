export type TestStatus = 'Aprobado' | 'Fallido' | 'Falta Evidencia';
export type RiskImpact = 'Alto' | 'Medio' | 'Bajo' | 'High' | 'Medium' | 'Low';

export interface RemediationGuidance {
  strategy: string;
  actionableSteps: string[];
  codeOrConfigExample?: string;
  verificationRecipe?: string;
  effortLevel?: 'Quick Win (< 1 día)' | 'Medio (1-3 días)' | 'Estructural (> 1 semana)' | string;
  recommendedTools?: string[];
}

export interface PuntoProbado {
  id: string;
  name: string;
  status: TestStatus;
  level?: 'L1' | 'L2' | 'L3';
  isMandatoryForTargetLevel?: boolean;
  isInheritedFromPlatform?: boolean;
  inheritedPlatformName?: string;
  comoSeAprobo: string;
  comoFallo: string;
  fuenteEvidencia: string;
  textoEvidencia: string;
  riskImpact: RiskImpact;
  remediation: string;
  remediationDetails?: RemediationGuidance;
}

export type VerificationLevel = 'AUTO' | 'L1' | 'L2' | 'L3';
export type AssessedLevel = 'L1' | 'L2' | 'L3';

export type TechPlatformKey = 
  | 'auto'
  | 'gemini-enterprise'
  | 'vertex-ai'
  | 'azure-openai'
  | 'aws-bedrock'
  | 'anthropic-enterprise'
  | 'self-hosted'
  | 'custom';

export type DeploymentType = 'SaaS' | 'PaaS' | 'Self-Hosted' | 'Hybrid';

export type StandardType = 'AI-SVS' | 'ISO-42001' | 'FULL' | 'CUSTOM' | 'MULTI';

export interface StandardBreakdown {
  standardId: string;
  standardName: string;
  score: number;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  missingControls: number;
}

export interface AISVSChapter {
  chapterId: string; // C1, C2, etc.
  chapterName: string;
  puntosProbados: PuntoProbado[];
  remediated?: boolean; // For the interactive toggle feature
  standardId?: string;
  standardName?: string;
}

export interface AuditReport {
  id: string;
  date: string;
  systemName: string;
  technicalLead: string;
  email: string;
  description: string;
  overallScore: number;
  executiveSummary: string;
  chapters: AISVSChapter[];
  standard?: StandardType;
  standards?: string[];
  standardsBreakdown?: StandardBreakdown[];
  customFrameworkId?: string;
  customFrameworkName?: string;
  targetLevel?: VerificationLevel;
  assessedLevel?: AssessedLevel;
  levelAssessmentRationale?: string;
  techPlatform?: TechPlatformKey | string;
  techPlatformName?: string;
  deploymentType?: DeploymentType;
  remediatedArchitectureDoc?: string;
  isLiveGcpScan?: boolean;
  gcpProjectId?: string;
  gcpTelemetry?: GCPScanTelemetry;
}

export interface AuditRequestPayload {
  systemName: string;
  technicalLead: string;
  email: string;
  description: string;
  standard?: StandardType;
  standards?: string[];
  customFrameworkId?: string;
  targetLevel?: VerificationLevel;
  techPlatform?: TechPlatformKey | string;
}

export interface StandardControl {
  id: string; // e.g. "C1.1" or "EUAI-01.1"
  title: string;
  description: string;
  level: 'L1' | 'L2' | 'L3';
  objective: string;
  verificationGuidance: string;
  remediationGuidance: string;
}

export interface StandardChapter {
  chapterId: string; // "C1", "C2", "Capítulo 1", etc.
  title: string;
  shortDescription: string;
  fullDescription: string;
  controls: StandardControl[];
  order: number;
}

export interface CustomFramework {
  id: string; // e.g. "fw-eu-aiact"
  shortCode: string; // e.g. "EU-AIACT"
  name: string; // "Reglamento de Inteligencia Artificial de la UE (EU AI Act)"
  jurisdiction?: string; // "Unión Europea"
  description: string;
  version?: string;
  createdAt: string;
  createdBy?: string;
  totalChapters: number;
  totalControls: number;
  chapters: StandardChapter[];
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
  status: 'active' | 'revoked';
}

export type AsyncAuditStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface AsyncAuditJob {
  id: string;
  status: AsyncAuditStatus;
  createdAt: string;
  completedAt?: string;
  systemName: string;
  technicalLead: string;
  email: string;
  standard: 'AI-SVS' | 'ISO-42001' | 'FULL' | 'CUSTOM';
  customFrameworkId?: string;
  webhookUrl?: string;
  result?: AuditReport;
  error?: string;
}

export type LLMProviderType = 'gemini' | 'openrouter' | 'openai' | 'custom_openai_compatible';

export interface AdminSettingsData {
  provider: LLMProviderType;
  isConfigured: boolean;
  // Gemini settings
  maskedKey: string;
  preferredModel: string;
  // Universal / OpenAI-compatible / OpenRouter settings
  maskedOpenaiKey?: string;
  openaiBaseUrl?: string;
  openaiModel?: string;
  customHeaders?: Record<string, string>;
  temperature?: number;
  maxTokens?: number;
  fallbackModel?: string;
  updatedAt: string | null;
  source: string;
}

export interface AdminTestResult {
  ok: boolean;
  provider?: LLMProviderType;
  latencyMs?: number;
  model?: string;
  sampleResponse?: string;
  error?: string;
}

export type GCPAuthMode = 'adc' | 'token' | 'service_account' | 'demo';

export interface GCPScanComponents {
  iam: boolean;
  storage: boolean;
  cloudRun: boolean;
  vertexAi: boolean;
  kmsAndSecrets: boolean;
  logging: boolean;
}

export interface GCPResourceItem {
  id: string;
  name: string;
  type: string;
  location?: string;
  status?: string;
  details?: Record<string, any>;
  findings?: {
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
    title: string;
    description: string;
    standardClause?: string;
  }[];
}

export interface GCPScanTelemetry {
  projectId: string;
  projectNumber?: string;
  scanTime: string;
  authModeUsed: GCPAuthMode;
  totalResourcesFound: number;
  componentsScanned: string[];
  findingsSummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  resources: {
    iamFindings: GCPResourceItem[];
    buckets: GCPResourceItem[];
    cloudRunServices: GCPResourceItem[];
    vertexEndpoints: GCPResourceItem[];
    vertexModels: GCPResourceItem[];
    kmsKeys: GCPResourceItem[];
    secrets: GCPResourceItem[];
  };
  rawManifestMarkdown?: string;
}

export interface GCPScanRequest {
  projectId: string;
  authMode: GCPAuthMode;
  accessToken?: string;
  serviceAccountJson?: string;
  components?: Partial<GCPScanComponents>;
  selectedStandards?: string[];
  systemName?: string;
  technicalLead?: string;
  email?: string;
  targetLevel?: VerificationLevel;
}


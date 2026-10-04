// ============================================================
// SAKSHAM SAATHI — Core Data Models
// ============================================================

// --- Identity & Profile ---
export interface Location {
  state: string;
  district: string;
  taluka?: string;
  town: string;
  pincode?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Education {
  level: string;
  certifications?: string[];
  existingTraining?: string[];
}

export interface Livelihood {
  occupation: string;
  employmentStatus: 'employed' | 'self_employed' | 'unemployed' | 'seasonal' | 'home_based';
  experienceYears: number;
  incomeRange?: string;
  workLocation?: string;
  workType?: string;
}

export interface Skill {
  id: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  category: 'technical' | 'soft' | 'digital' | 'traditional' | 'business';
  confidence: number;       // 0–1
  proficiency: 'Beginner' | 'Intermediate' | 'Strong' | 'Expert';
  source: 'voice' | 'manual' | 'assessment' | 'inferred';
  transferableSkills?: string[];
}

export interface SkillEvidence {
  skillId: string;
  evidenceType: 'self_reported' | 'inferred' | 'assessed' | 'certified';
  description: string;
  confidence: number;
}

export interface Constraint {
  type: 'mobility' | 'distance' | 'physical' | 'time' | 'family' | 'digital' | 'device' | 'connectivity';
  description: string;
  value?: string | number;
}

export interface Aspiration {
  desiredOccupation?: string;
  preferredIndustry?: string;
  employmentPreference: 'wage_employment' | 'self_employment' | 'both';
  interests: string[];
}

export interface FamilyInfo {
  familyOccupation?: string;
  existingEnterprise?: string;
  availableResources?: string[];
  familySupport?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  language: string;
  location: Location;
  education: Education;
  livelihood: Livelihood;
  skills: Skill[];
  aspiration: Aspiration;
  constraints: Constraint[];
  family?: FamilyInfo;
  profileCompleteness: number;  // 0–100
  registeredAt: string;
  lastUpdated: string;
  avatar?: string;
}

// --- Skill DNA ---
export interface SkillDNA {
  beneficiaryId: string;
  technicalSkills: Skill[];
  softSkills: Skill[];
  digitalSkills: Skill[];
  traditionalSkills: Skill[];
  businessReadiness: number;      // 0–100
  digitalReadiness: number;       // 0–100
  entrepreneurialReadiness: number; // 0–100
  transferableCapabilities: TransferableCapability[];
  generatedAt: string;
}

export interface TransferableCapability {
  name: string;
  derivedFrom: string;
  applicableTo: string[];
  confidence: number;
}

// --- Skill Gap ---
export interface SkillGapItem {
  skillName: string;
  required: boolean;
  currentLevel: number;  // 0–100
  targetLevel: number;
  status: 'ready' | 'upskill' | 'new_skill';
  priority: 'high' | 'medium' | 'low';
}

export interface SkillGapAnalysis {
  targetOccupation: string;
  gaps: SkillGapItem[];
  readySkills: string[];
  upskillNeeded: string[];
  newSkillsNeeded: string[];
  overallReadiness: number;
  rplEligible: boolean;
}

// --- NSQF & Qualifications ---
export interface Qualification {
  id: string;
  name: string;
  nameHi?: string;
  nameMr?: string;
  jobRole: string;
  sector: string;
  nsqfLevel: number;       // 1–10
  eligibility: string;
  entryRequirements?: string[];
  learningOutcomes?: string[];
  durationWeeks: number;
  assessment?: string;
  isNSQFAligned: boolean;
  isDemo: boolean;
}

export interface TrainingProvider {
  id: string;
  name: string;
  location: Location;
  distanceKm?: number;
  sectors: string[];
  courses: string[];
  rating?: number;
  isDemo: boolean;
}

export interface TrainingRecommendation {
  qualification: Qualification;
  provider?: TrainingProvider;
  matchScore: number;
  matchBreakdown: MatchBreakdown;
  explanation: string[];
  skillGaps: string[];
  expectedPathway: string;
  rplPossible: boolean;
}

// --- Opportunity ---
export type OpportunityType = 'wage_employment' | 'self_employment' | 'apprenticeship' | 'training' | 'enterprise' | 'shg';

export interface Opportunity {
  id: string;
  title: string;
  titleMr?: string;
  type: OpportunityType;
  location: Location;
  distanceKm: number;
  requiredSkills: string[];
  preferredEducation?: string;
  salary?: string;
  description: string;
  matchScore: number;
  matchBreakdown?: MatchBreakdown;
  explanation: string[];
  isDemo: boolean;
}

// --- Recommendation ---
export interface MatchBreakdown {
  skillMatch: number;
  interestMatch: number;
  educationMatch: number;
  experienceMatch: number;
  locationMatch: number;
  mobilityMatch: number;
  employmentPrefMatch: number;
  localOpportunityMatch: number;
}

export interface Recommendation {
  id: string;
  type: 'training' | 'employment' | 'enterprise' | 'upskill';
  title: string;
  score: number;
  breakdown: MatchBreakdown;
  explanation: string[];
  skillGaps: string[];
  training?: TrainingRecommendation;
  opportunity?: Opportunity;
  pathway?: LivelyhoodPathway;
}

// --- Livelihood Pathway ---
export interface PathwayStep {
  order: number;
  title: string;
  titleMr?: string;
  description: string;
  type: 'assessment' | 'training' | 'upskill' | 'enterprise' | 'employment' | 'certification';
  duration?: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface LivelyhoodPathway {
  id: string;
  name: string;
  currentStage: string;
  targetStage: string;
  steps: PathwayStep[];
  estimatedDurationWeeks: number;
}

// --- Action Plan ---
export interface ActionPlanItem {
  id: string;
  title: string;
  titleMr?: string;
  description: string;
  week: number;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'profile' | 'training' | 'skill' | 'employment' | 'enterprise';
}

export interface ActionPlan {
  beneficiaryId: string;
  items: ActionPlanItem[];
  progressPercent: number;
  generatedAt: string;
  targetDate: string;
}

// --- Conversation ---
export type MessageRole = 'ai' | 'user' | 'system';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  text: string;
  textMr?: string;
  timestamp: string;
  extracted?: Record<string, unknown>;
  confidence?: number;
}

export interface Conversation {
  id: string;
  beneficiaryId: string;
  messages: ConversationMessage[];
  status: 'active' | 'completed' | 'paused';
  profileFieldsCollected: string[];
  profileFieldsMissing: string[];
  startedAt: string;
  completedAt?: string;
}

// --- Analytics ---
export interface OutcomeFunnel {
  registered: number;
  profileCompleted: number;
  recommendationsGenerated: number;
  trainingEnrolled: number;
  trainingCompleted: number;
  employmentMatched: number;
  ninetyDayOutcome: number;
}

export interface SkillDemand {
  skill: string;
  demandCount: number;
  percent: number;
}

export interface TrainingMismatch {
  skill: string;
  demand: number;
  availableSeats: number;
  gap: number;
}

export interface PlacementGap {
  trainingCompleted: number;
  employed: number;
  gap: number;
  causes: { cause: string; count: number }[];
}

export interface DropOffStage {
  stage: string;
  count: number;
  dropOff: number;
  percent: number;
}

// --- Field Worker ---
export interface FieldWorker {
  id: string;
  name: string;
  phone: string;
  district: string;
  assignedBeneficiaries: string[];
}

// --- Connectivity ---
export type ConnectivityStatus = 'online' | 'offline' | 'syncing' | 'synced';

export interface SyncItem {
  id: string;
  type: string;
  data: unknown;
  timestamp: string;
}

// --- App State ---
export type UserRole = 'beneficiary' | 'field_worker' | 'authority';

export interface AppLanguage {
  code: string;
  name: string;
  nameNative: string;
  flag?: string;
}

export const SUPPORTED_LANGUAGES: AppLanguage[] = [
  { code: 'mr', name: 'Marathi', nameNative: 'मराठी' },
  { code: 'hi', name: 'Hindi', nameNative: 'हिन्दी' },
  { code: 'en', name: 'English', nameNative: 'English' },
  { code: 'ta', name: 'Tamil', nameNative: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nameNative: 'తెలుగు' },
  { code: 'bn', name: 'Bengali', nameNative: 'বাংলা' },
];

// ============================================================
// SAKSHAM SAATHI — Demo Analytics Data
// ============================================================
import { OutcomeFunnel, SkillDemand, TrainingMismatch, PlacementGap, DropOffStage } from '../types/models';

export const demoOutcomeFunnel: OutcomeFunnel = {
  registered: 2450,
  profileCompleted: 1980,
  recommendationsGenerated: 1820,
  trainingEnrolled: 1340,
  trainingCompleted: 1240,
  employmentMatched: 760,
  ninetyDayOutcome: 580,
};

export const demoSkillDemand: SkillDemand[] = [
  { skill: 'Tailoring', demandCount: 186, percent: 28 },
  { skill: 'Electrical Repair', demandCount: 126, percent: 19 },
  { skill: 'Food Processing', demandCount: 113, percent: 17 },
  { skill: 'Driving', demandCount: 100, percent: 15 },
  { skill: 'Digital Services', demandCount: 73, percent: 11 },
  { skill: 'Handicrafts', demandCount: 40, percent: 6 },
  { skill: 'Agriculture (Modern)', demandCount: 27, percent: 4 },
];

export const demoTrainingMismatches: TrainingMismatch[] = [
  { skill: 'Electrical Repair', demand: 74, availableSeats: 20, gap: 54 },
  { skill: 'Food Processing', demand: 56, availableSeats: 30, gap: 26 },
  { skill: 'Digital Services', demand: 48, availableSeats: 40, gap: 8 },
  { skill: 'Tailoring', demand: 92, availableSeats: 60, gap: 32 },
  { skill: 'Solar Installation', demand: 35, availableSeats: 10, gap: 25 },
];

export const demoPlacementGap: PlacementGap = {
  trainingCompleted: 1240,
  employed: 760,
  gap: 480,
  causes: [
    { cause: 'Location Mismatch', count: 145 },
    { cause: 'Skill Mismatch', count: 98 },
    { cause: 'Salary Expectations', count: 82 },
    { cause: 'Mobility Constraint', count: 68 },
    { cause: 'No Local Opportunity', count: 52 },
    { cause: 'Preference Mismatch', count: 35 },
  ],
};

export const demoDropOffStages: DropOffStage[] = [
  { stage: 'Interview Started', count: 2450, dropOff: 0, percent: 100 },
  { stage: 'Interview Completed', count: 1980, dropOff: 470, percent: 80.8 },
  { stage: 'Recommendation Viewed', count: 1820, dropOff: 160, percent: 74.3 },
  { stage: 'Training Selected', count: 1540, dropOff: 280, percent: 62.9 },
  { stage: 'Training Enrolled', count: 1340, dropOff: 200, percent: 54.7 },
  { stage: 'Training Completed', count: 1240, dropOff: 100, percent: 50.6 },
  { stage: 'Opportunity Applied', count: 920, dropOff: 320, percent: 37.6 },
  { stage: 'Employment Achieved', count: 760, dropOff: 160, percent: 31.0 },
];

export const demoDistrictData = [
  { district: 'Ahmednagar', beneficiaries: 620, completed: 480, employed: 195 },
  { district: 'Pune', beneficiaries: 510, completed: 390, employed: 165 },
  { district: 'Nashik', beneficiaries: 440, completed: 340, employed: 130 },
  { district: 'Satara', beneficiaries: 380, completed: 310, employed: 115 },
  { district: 'Solapur', beneficiaries: 320, completed: 260, employed: 90 },
  { district: 'Kolhapur', beneficiaries: 180, completed: 200, employed: 65 },
];

export const demoEmploymentPreference = [
  { name: 'Self-Employment', value: 42 },
  { name: 'Wage Employment', value: 31 },
  { name: 'Both', value: 18 },
  { name: 'Enterprise', value: 9 },
];

export const demoMonthlyTrend = [
  { month: 'Apr', registered: 120, trained: 80, employed: 45 },
  { month: 'May', registered: 180, trained: 110, employed: 62 },
  { month: 'Jun', registered: 240, trained: 160, employed: 85 },
  { month: 'Jul', registered: 310, trained: 220, employed: 110 },
  { month: 'Aug', registered: 420, trained: 290, employed: 140 },
  { month: 'Sep', registered: 560, trained: 380, employed: 195 },
  { month: 'Oct', registered: 620, trained: 420, employed: 220 },
];

// ============================================================
// SAKSHAM SAATHI — Recommendation Engine
// Constraint-aware, explainable scoring
// ============================================================
import { Beneficiary, Recommendation, MatchBreakdown, SkillGapAnalysis, SkillGapItem, TrainingRecommendation, LivelyhoodPathway, ActionPlan, ActionPlanItem } from '../types/models';
import { demoQualifications, demoTrainingProviders } from '../data/qualifications';
import { demoOpportunities } from '../data/opportunities';

// ---- Skill Gap Engine ----

export function analyzeSkillGap(beneficiary: Beneficiary, targetOccupation: string): SkillGapAnalysis {
  const gapsByOccupation: Record<string, SkillGapItem[]> = {
    'Tailoring Micro-Enterprise': [
      { skillName: 'Advanced Tailoring', required: true, currentLevel: 72, targetLevel: 85, status: 'upskill', priority: 'medium' },
      { skillName: 'Quality Management', required: true, currentLevel: 60, targetLevel: 80, status: 'upskill', priority: 'medium' },
      { skillName: 'Customer Management', required: true, currentLevel: 71, targetLevel: 75, status: 'ready', priority: 'low' },
      { skillName: 'Pricing Strategy', required: true, currentLevel: 30, targetLevel: 70, status: 'new_skill', priority: 'high' },
      { skillName: 'Digital Payments', required: true, currentLevel: 15, targetLevel: 60, status: 'new_skill', priority: 'high' },
      { skillName: 'Inventory Management', required: false, currentLevel: 35, targetLevel: 60, status: 'new_skill', priority: 'medium' },
      { skillName: 'Online Marketing', required: false, currentLevel: 10, targetLevel: 50, status: 'new_skill', priority: 'medium' },
      { skillName: 'Basic Tailoring', required: true, currentLevel: 92, targetLevel: 70, status: 'ready', priority: 'low' },
      { skillName: 'Embroidery', required: false, currentLevel: 76, targetLevel: 60, status: 'ready', priority: 'low' },
    ],
    'Electrical Contractor': [
      { skillName: 'Advanced Wiring', required: true, currentLevel: 75, targetLevel: 90, status: 'upskill', priority: 'high' },
      { skillName: 'Solar Installation', required: true, currentLevel: 40, targetLevel: 80, status: 'new_skill', priority: 'high' },
      { skillName: 'Safety Compliance', required: true, currentLevel: 60, targetLevel: 90, status: 'upskill', priority: 'high' },
      { skillName: 'Business Management', required: true, currentLevel: 30, targetLevel: 65, status: 'new_skill', priority: 'medium' },
      { skillName: 'Appliance Repair', required: true, currentLevel: 80, targetLevel: 75, status: 'ready', priority: 'low' },
    ],
    'Food Processing Enterprise': [
      { skillName: 'Food Safety (FSSAI)', required: true, currentLevel: 20, targetLevel: 80, status: 'new_skill', priority: 'high' },
      { skillName: 'Packaging & Labeling', required: true, currentLevel: 25, targetLevel: 70, status: 'new_skill', priority: 'high' },
      { skillName: 'Batch Production', required: true, currentLevel: 65, targetLevel: 80, status: 'upskill', priority: 'medium' },
      { skillName: 'Preservation Techniques', required: true, currentLevel: 70, targetLevel: 85, status: 'upskill', priority: 'medium' },
      { skillName: 'Traditional Recipes', required: true, currentLevel: 94, targetLevel: 80, status: 'ready', priority: 'low' },
    ],
  };

  const gaps = gapsByOccupation[targetOccupation] || gapsByOccupation['Tailoring Micro-Enterprise'];

  const readySkills = gaps.filter(g => g.status === 'ready').map(g => g.skillName);
  const upskillNeeded = gaps.filter(g => g.status === 'upskill').map(g => g.skillName);
  const newSkillsNeeded = gaps.filter(g => g.status === 'new_skill').map(g => g.skillName);
  const overallReadiness = Math.round(gaps.reduce((s, g) => s + (g.currentLevel / g.targetLevel), 0) / gaps.length * 100);

  return {
    targetOccupation,
    gaps,
    readySkills,
    upskillNeeded,
    newSkillsNeeded,
    overallReadiness: Math.min(overallReadiness, 100),
    rplEligible: beneficiary.livelihood.experienceYears >= 2,
  };
}

// ---- Recommendation Scoring ----

function calculateMatchBreakdown(beneficiary: Beneficiary): MatchBreakdown {
  // Skill match
  const skillMatch = Math.min(100, beneficiary.skills.reduce((s, sk) => s + sk.confidence * 20, 0));
  // Interest match – assume demo tailoring match
  const interestMatch = beneficiary.aspiration.interests.length > 0 ? 82 : 40;
  // Education
  const eduLevels: Record<string, number> = { 'PhD': 100, 'Post Graduate': 95, 'Graduate': 85, '12th Pass': 70, '10th Pass': 60, '8th Pass': 50, '5th Pass': 35, 'Below 5th': 20 };
  const educationMatch = eduLevels[beneficiary.education.level] || 50;
  // Experience
  const experienceMatch = Math.min(100, beneficiary.livelihood.experienceYears * 20);
  // Location
  const locationMatch = 90; // demo: same town
  // Mobility
  const mobilityConstraint = beneficiary.constraints.find(c => c.type === 'mobility');
  const mobilityMatch = mobilityConstraint ? (typeof mobilityConstraint.value === 'number' && mobilityConstraint.value >= 5 ? 85 : 60) : 95;
  // Employment pref
  const employmentPrefMatch = 90; // demo
  // Local opp
  const localOpportunityMatch = 88; // demo

  return {
    skillMatch: Math.round(skillMatch),
    interestMatch,
    educationMatch,
    experienceMatch: Math.round(experienceMatch),
    locationMatch,
    mobilityMatch,
    employmentPrefMatch,
    localOpportunityMatch,
  };
}

function calculateScore(breakdown: MatchBreakdown): number {
  return Math.round(
    breakdown.skillMatch * 0.30 +
    breakdown.interestMatch * 0.15 +
    breakdown.educationMatch * 0.05 +
    breakdown.experienceMatch * 0.15 +
    breakdown.locationMatch * 0.15 +
    breakdown.mobilityMatch * 0.10 +
    breakdown.employmentPrefMatch * 0.05 +
    breakdown.localOpportunityMatch * 0.05
  );
}

// ---- Main Recommendation Pipeline ----

export function generateRecommendations(beneficiary: Beneficiary): {
  recommendations: Recommendation[];
  skillGap: SkillGapAnalysis;
  trainingRecommendations: TrainingRecommendation[];
  pathway: LivelyhoodPathway;
  actionPlan: ActionPlan;
} {
  // 1. Calculate match breakdown
  const breakdown = calculateMatchBreakdown(beneficiary);
  const score = calculateScore(breakdown);

  // 2. Skill Gap
  const targetOcc = beneficiary.aspiration.desiredOccupation || 'Tailoring Micro-Enterprise';
  const skillGap = analyzeSkillGap(beneficiary, targetOcc);

  // 3. Training recommendations
  const trainingRecs = generateTrainingRecommendations(beneficiary, skillGap, breakdown);

  // 4. Opportunity matching
  const matchedOpps = matchOpportunities(beneficiary);

  // 5. Pathway
  const pathway = generatePathway(beneficiary, skillGap);

  // 6. Action plan
  const actionPlan = generateActionPlan(beneficiary, skillGap, pathway);

  // 7. Assemble recommendations
  const recommendations: Recommendation[] = [
    {
      id: 'rec-001',
      type: 'enterprise',
      title: `${targetOcc}`,
      score,
      breakdown,
      explanation: generateExplanation(beneficiary, breakdown, skillGap),
      skillGaps: skillGap.newSkillsNeeded,
      pathway,
    },
    ...trainingRecs.map((tr, i) => ({
      id: `rec-tr-${i}`,
      type: 'training' as const,
      title: tr.qualification.name,
      score: tr.matchScore,
      breakdown,
      explanation: tr.explanation,
      skillGaps: tr.skillGaps,
      training: tr,
    })),
    ...matchedOpps.slice(0, 4).map((opp, i) => ({
      id: `rec-opp-${i}`,
      type: 'employment' as const,
      title: opp.title,
      score: opp.matchScore,
      breakdown: opp.matchBreakdown || breakdown,
      explanation: opp.explanation,
      skillGaps: [],
    })),
  ];

  return { recommendations, skillGap, trainingRecommendations: trainingRecs, pathway, actionPlan };
}

function generateTrainingRecommendations(beneficiary: Beneficiary, skillGap: SkillGapAnalysis, breakdown: MatchBreakdown): TrainingRecommendation[] {
  const recs: TrainingRecommendation[] = [];

  // Match qualifications based on beneficiary's sector/skills
  const benSkillNames = beneficiary.skills.map(s => s.name.toLowerCase());
  const benInterests = beneficiary.aspiration.interests.map(i => i.toLowerCase());

  for (const qual of demoQualifications) {
    const sectorMatch = benInterests.some(i => qual.sector.toLowerCase().includes(i)) ||
      qual.jobRole.toLowerCase().includes(beneficiary.livelihood.occupation.toLowerCase());
    const skillMatch = benSkillNames.some(s => qual.name.toLowerCase().includes(s));

    if (sectorMatch || skillMatch) {
      const provider = demoTrainingProviders.find(p => p.courses.includes(qual.id));
      const matchScore = calculateScore(breakdown) + (skillMatch ? 5 : -5) + (sectorMatch ? 3 : 0);

      recs.push({
        qualification: qual,
        provider,
        matchScore: Math.min(99, Math.max(50, matchScore)),
        matchBreakdown: breakdown,
        explanation: [
          `Matches your ${beneficiary.livelihood.occupation} background`,
          skillGap.rplEligible ? 'Prior experience can be recognized (RPL eligible)' : 'Builds foundation skills',
          provider ? `Available at ${provider.name} (${provider.distanceKm} km)` : 'Multiple providers available',
          `NSQF Level ${qual.nsqfLevel} certification`,
        ],
        skillGaps: skillGap.newSkillsNeeded.slice(0, 3),
        expectedPathway: `${beneficiary.livelihood.occupation} → ${qual.jobRole}`,
        rplPossible: skillGap.rplEligible,
      });
    }
  }

  // Always include digital skills + micro-enterprise
  const digitalQ = demoQualifications.find(q => q.id === 'q-003')!;
  const enterpriseQ = demoQualifications.find(q => q.id === 'q-002')!;

  if (!recs.find(r => r.qualification.id === 'q-003')) {
    recs.push({
      qualification: digitalQ,
      provider: demoTrainingProviders[0],
      matchScore: 78,
      matchBreakdown: breakdown,
      explanation: ['Essential for business growth', 'Addresses your digital skills gap', 'Short 4-week course', 'Available locally'],
      skillGaps: ['Digital Payments', 'Online Marketing'],
      expectedPathway: 'Digital Literacy → Business Growth',
      rplPossible: false,
    });
  }
  if (!recs.find(r => r.qualification.id === 'q-002')) {
    recs.push({
      qualification: enterpriseQ,
      provider: demoTrainingProviders[0],
      matchScore: 85,
      matchBreakdown: breakdown,
      explanation: ['Matches your self-employment preference', 'Builds business skills on existing trade', 'Learn pricing, marketing, digital payments', '6-week practical course'],
      skillGaps: ['Business Planning', 'Financial Literacy'],
      expectedPathway: `${beneficiary.livelihood.occupation} → Micro-Enterprise`,
      rplPossible: false,
    });
  }

  return recs.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5);
}

function matchOpportunities(beneficiary: Beneficiary) {
  const mobilityConstraint = beneficiary.constraints.find(c => c.type === 'mobility');
  const maxDistance = typeof mobilityConstraint?.value === 'number' ? mobilityConstraint.value : 20;

  return demoOpportunities
    .filter(opp => {
      // Filter by relevant skills
      const hasRelevantSkill = opp.requiredSkills.some(rs =>
        beneficiary.skills.some(s => s.name.toLowerCase().includes(rs.toLowerCase()) ||
          rs.toLowerCase().includes(s.name.toLowerCase()))
      );
      return hasRelevantSkill;
    })
    .map(opp => ({
      ...opp,
      matchScore: opp.distanceKm <= maxDistance ? opp.matchScore : Math.max(40, opp.matchScore - 25),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

function generateExplanation(beneficiary: Beneficiary, breakdown: MatchBreakdown, skillGap: SkillGapAnalysis): string[] {
  const explanations: string[] = [];
  if (breakdown.skillMatch >= 70) explanations.push(`${beneficiary.livelihood.experienceYears} years existing experience in ${beneficiary.livelihood.occupation}`);
  if (breakdown.skillMatch >= 60) explanations.push(`Strong ${beneficiary.livelihood.occupation.toLowerCase()} skills detected`);
  if (breakdown.interestMatch >= 70) explanations.push(`Aligned with your interests: ${beneficiary.aspiration.interests.join(', ')}`);
  if (breakdown.employmentPrefMatch >= 70) explanations.push(`Matches your ${beneficiary.aspiration.employmentPreference === 'self_employment' ? 'self-employment' : 'employment'} preference`);
  if (breakdown.locationMatch >= 70) explanations.push('Nearby opportunities available');
  if (breakdown.mobilityMatch >= 70) explanations.push('Within your preferred travel distance');
  if (skillGap.rplEligible) explanations.push('Prior experience may qualify for Recognition of Prior Learning (RPL)');
  if (skillGap.newSkillsNeeded.length > 0) explanations.push(`Skills to develop: ${skillGap.newSkillsNeeded.slice(0, 3).join(', ')}`);
  return explanations;
}

function generatePathway(beneficiary: Beneficiary, _skillGap: SkillGapAnalysis): LivelyhoodPathway {
  const occ = beneficiary.livelihood.occupation;

  return {
    id: 'path-001',
    name: `${occ} to Enterprise Pathway`,
    currentStage: `Home ${occ}`,
    targetStage: `${occ} Business`,
    steps: [
      { order: 1, title: 'Skill Assessment', titleMr: 'कौशल्य मूल्यांकन', description: `Assess current ${occ.toLowerCase()} competency level`, type: 'assessment', duration: '1 week', status: 'pending' },
      { order: 2, title: `Advanced ${occ}`, titleMr: 'प्रगत प्रशिक्षण', description: `Upgrade ${occ.toLowerCase()} skills to professional level`, type: 'training', duration: '8 weeks', status: 'pending' },
      { order: 3, title: 'Business Skills', titleMr: 'व्यवसाय कौशल्ये', description: 'Learn digital payments, pricing, customer management', type: 'upskill', duration: '4 weeks', status: 'pending' },
      { order: 4, title: 'Digital Skills', titleMr: 'डिजिटल कौशल्ये', description: 'WhatsApp business, UPI payments, online marketing basics', type: 'upskill', duration: '2 weeks', status: 'pending' },
      { order: 5, title: 'Enterprise Launch', titleMr: 'उद्योग सुरुवात', description: `Start home-based ${occ.toLowerCase()} business with expanded services`, type: 'enterprise', duration: 'Ongoing', status: 'pending' },
    ],
    estimatedDurationWeeks: 15,
  };
}

function generateActionPlan(beneficiary: Beneficiary, _skillGap: SkillGapAnalysis, _pathway: LivelyhoodPathway): ActionPlan {
  const items: ActionPlanItem[] = [
    { id: 'ap-1', title: 'Complete Skill Profile', titleMr: 'कौशल्य प्रोफाइल पूर्ण करा', description: 'Finish voice interview and verify all details', week: 1, status: 'completed', category: 'profile' },
    { id: 'ap-2', title: 'Verify Eligibility', titleMr: 'पात्रता पडताळणी', description: 'Check eligibility for recommended training programs', week: 1, status: 'pending', category: 'profile' },
    { id: 'ap-3', title: 'Enroll in Training', titleMr: 'प्रशिक्षणासाठी नोंदणी', description: `Enroll in recommended ${beneficiary.livelihood.occupation} upgrade program`, week: 2, status: 'pending', category: 'training' },
    { id: 'ap-4', title: 'Start Advanced Module', titleMr: 'प्रगत मॉड्यूल सुरू करा', description: 'Begin advanced skills training', week: 3, status: 'pending', category: 'training' },
    { id: 'ap-5', title: 'Digital Skills Workshop', titleMr: 'डिजिटल कौशल्य कार्यशाळा', description: 'Complete digital payments and business tools module', week: 5, status: 'pending', category: 'skill' },
    { id: 'ap-6', title: 'Business Plan Development', titleMr: 'व्यवसाय योजना विकास', description: 'Create business plan with trainer guidance', week: 7, status: 'pending', category: 'enterprise' },
    { id: 'ap-7', title: 'Complete Training', titleMr: 'प्रशिक्षण पूर्ण करा', description: 'Finish all training modules and assessment', week: 9, status: 'pending', category: 'training' },
    { id: 'ap-8', title: 'Apply for Opportunities', titleMr: 'संधीसाठी अर्ज करा', description: 'Apply to matched local opportunities or launch enterprise', week: 10, status: 'pending', category: 'employment' },
    { id: 'ap-9', title: 'Enterprise Setup', titleMr: 'उद्योग स्थापना', description: 'Set up expanded business with new skills', week: 11, status: 'pending', category: 'enterprise' },
    { id: 'ap-10', title: '90-Day Review', titleMr: '90-दिवस आढावा', description: 'Evaluate progress and income improvement', week: 13, status: 'pending', category: 'employment' },
  ];

  const completed = items.filter(i => i.status === 'completed').length;
  const progress = Math.round((completed / items.length) * 100);

  return {
    beneficiaryId: beneficiary.id,
    items,
    progressPercent: progress,
    generatedAt: new Date().toISOString(),
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

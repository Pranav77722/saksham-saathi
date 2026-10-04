// ============================================================
// SAKSHAM SAATHI — Skill DNA Service
// ============================================================
import { Beneficiary, SkillDNA, TransferableCapability, Skill } from '../types/models';

const TRANSFERABLE_MAP: Record<string, TransferableCapability[]> = {
  'Tailoring': [
    { name: 'Fine Motor Coordination', derivedFrom: 'Tailoring', applicableTo: ['Boutique Assistant', 'Garment Finishing', 'Handicrafts'], confidence: 0.88 },
    { name: 'Measurement & Precision', derivedFrom: 'Tailoring', applicableTo: ['Quality Control', 'Tailoring Enterprise'], confidence: 0.85 },
    { name: 'Material Management', derivedFrom: 'Tailoring', applicableTo: ['Inventory Management', 'Retail', 'Small Business'], confidence: 0.75 },
    { name: 'Time Management', derivedFrom: 'Tailoring', applicableTo: ['Any Enterprise', 'Employment'], confidence: 0.70 },
    { name: 'Order Handling', derivedFrom: 'Tailoring', applicableTo: ['E-commerce', 'Business', 'Customer Service'], confidence: 0.72 },
  ],
  'Embroidery': [
    { name: 'Pattern Recognition', derivedFrom: 'Embroidery', applicableTo: ['Fashion Design', 'Textile Design'], confidence: 0.82 },
    { name: 'Color Theory', derivedFrom: 'Embroidery', applicableTo: ['Fashion', 'Interior Design', 'Craft Business'], confidence: 0.78 },
    { name: 'Design Sense', derivedFrom: 'Embroidery', applicableTo: ['Fashion Design', 'Product Design'], confidence: 0.80 },
  ],
  'Customer Interaction': [
    { name: 'Communication', derivedFrom: 'Customer Interaction', applicableTo: ['Sales', 'Marketing', 'Customer Service', 'Business'], confidence: 0.76 },
    { name: 'Negotiation', derivedFrom: 'Customer Interaction', applicableTo: ['Sales', 'Business', 'Procurement'], confidence: 0.68 },
  ],
  'Electrical Wiring': [
    { name: 'Technical Precision', derivedFrom: 'Electrical Wiring', applicableTo: ['Solar Installation', 'Maintenance', 'Construction'], confidence: 0.86 },
    { name: 'Safety Compliance', derivedFrom: 'Electrical Wiring', applicableTo: ['Any Technical Role', 'Supervisor'], confidence: 0.80 },
  ],
  'Pickle Making': [
    { name: 'Quality Control', derivedFrom: 'Pickle Making', applicableTo: ['Food Business', 'Manufacturing', 'Quality Assurance'], confidence: 0.84 },
    { name: 'Batch Production', derivedFrom: 'Pickle Making', applicableTo: ['Food Processing Unit', 'Manufacturing'], confidence: 0.78 },
  ],
  'Warli Painting': [
    { name: 'Artistic Expression', derivedFrom: 'Warli Painting', applicableTo: ['Art Business', 'Design', 'Teaching'], confidence: 0.88 },
    { name: 'Cultural Knowledge', derivedFrom: 'Warli Painting', applicableTo: ['Tourism', 'Cultural Enterprises', 'Teaching'], confidence: 0.82 },
  ],
  'Crop Cultivation': [
    { name: 'Land Management', derivedFrom: 'Crop Cultivation', applicableTo: ['Modern Farming', 'Agri-business', 'Horticulture'], confidence: 0.85 },
    { name: 'Planning & Scheduling', derivedFrom: 'Crop Cultivation', applicableTo: ['Project Management', 'Business Planning'], confidence: 0.72 },
  ],
};

export function generateSkillDNA(beneficiary: Beneficiary): SkillDNA {
  const technicalSkills = beneficiary.skills.filter(s => s.category === 'technical');
  const softSkills = beneficiary.skills.filter(s => s.category === 'soft');
  const digitalSkills = beneficiary.skills.filter(s => s.category === 'digital');
  const traditionalSkills = beneficiary.skills.filter(s => s.category === 'traditional');
  const businessSkills = beneficiary.skills.filter(s => s.category === 'business');

  // Calculate readiness scores
  const digitalReadiness = calculateReadiness(digitalSkills);
  const businessReadiness = calculateReadiness(businessSkills);
  const entrepreneurialReadiness = Math.round(
    (businessReadiness * 0.4) +
    (digitalReadiness * 0.2) +
    (calculateExperienceFactor(beneficiary.livelihood.experienceYears) * 0.2) +
    (calculateCustomerFactor(beneficiary) * 0.2)
  );

  // Generate transferable capabilities
  const transferable: TransferableCapability[] = [];
  beneficiary.skills.forEach(skill => {
    const mapped = TRANSFERABLE_MAP[skill.name];
    if (mapped) {
      mapped.forEach(tc => {
        if (!transferable.find(t => t.name === tc.name)) {
          transferable.push({ ...tc, confidence: tc.confidence * skill.confidence });
        }
      });
    }
  });

  return {
    beneficiaryId: beneficiary.id,
    technicalSkills,
    softSkills,
    digitalSkills,
    traditionalSkills,
    businessReadiness,
    digitalReadiness,
    entrepreneurialReadiness,
    transferableCapabilities: transferable,
    generatedAt: new Date().toISOString(),
  };
}

function calculateReadiness(skills: Skill[]): number {
  if (skills.length === 0) return 15; // baseline
  const avg = skills.reduce((sum, s) => sum + s.confidence, 0) / skills.length;
  return Math.round(avg * 100);
}

function calculateExperienceFactor(years: number): number {
  if (years >= 5) return 90;
  if (years >= 3) return 70;
  if (years >= 1) return 50;
  return 25;
}

function calculateCustomerFactor(beneficiary: Beneficiary): number {
  const hasCustSkill = beneficiary.skills.some(s =>
    s.name.toLowerCase().includes('customer') || s.name.toLowerCase().includes('sales')
  );
  return hasCustSkill ? 65 : 30;
}

// Get career pathways based on transferable skills
export function getCareerPathways(skillDNA: SkillDNA): string[][] {
  const pathways: string[][] = [];

  // Based on primary skills
  if (skillDNA.technicalSkills.find(s => s.name === 'Tailoring')) {
    pathways.push(['Tailoring', 'Advanced Tailoring', 'Boutique Assistant', 'Fashion Alteration', 'Micro-Enterprise', 'Online Tailoring Business']);
    pathways.push(['Tailoring', 'Embroidery Specialist', 'Designer Wear', 'Fashion Enterprise']);
  }
  if (skillDNA.technicalSkills.find(s => s.name === 'Electrical Wiring')) {
    pathways.push(['Electrical Repair', 'Solar Installation', 'Electrical Contractor', 'Green Energy Enterprise']);
  }
  if (skillDNA.traditionalSkills.find(s => s.name === 'Pickle Making')) {
    pathways.push(['Home Food Processing', 'FSSAI Certified Unit', 'Brand Development', 'Distribution Network']);
  }
  if (skillDNA.traditionalSkills.find(s => s.name === 'Warli Painting')) {
    pathways.push(['Traditional Art', 'Product Diversification', 'Online Sales', 'Cultural Enterprise']);
  }
  if (skillDNA.technicalSkills.find(s => s.name === 'Crop Cultivation')) {
    pathways.push(['Traditional Farming', 'Modern Techniques', 'Value-Added Products', 'Agri-Business']);
  }

  return pathways;
}

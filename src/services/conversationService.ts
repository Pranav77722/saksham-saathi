// ============================================================
// SAKSHAM SAATHI — Conversation Service (Demo Mode)
// Adaptive conversational interview engine
// ============================================================
import { ConversationMessage, Beneficiary } from '../types/models';

// Profile fields we need to collect
const PROFILE_FIELDS = [
  'name', 'age', 'gender', 'location', 'language',
  'education', 'currentOccupation', 'experienceYears',
  'specificSkills', 'garmentTypes', 'equipment',
  'customerBase', 'incomeRange',
  'interests', 'employmentPreference',
  'mobilityDistance', 'digitalSkills',
  'familyOccupation', 'challenges',
];

interface ConversationState {
  collectedFields: string[];
  currentStep: number;
  language: string;
  extractedData: Record<string, unknown>;
}

// The demo conversation script for Sunita Jadhav (Marathi)
const DEMO_SCRIPT: { aiMessage: string; aiMessageMr: string; expectedExtraction: Record<string, unknown>; fieldsCollected: string[] }[] = [
  {
    aiMessage: "Hello! I'm Saksham Saathi. Let me understand your skills and help you find the right livelihood opportunities. What is your name?",
    aiMessageMr: "नमस्कार! मी सक्षम साथी. तुमच्या कौशल्यांबद्दल जाणून घेऊन तुम्हाला योग्य उपजीविकेच्या संधी शोधण्यात मदत करतो. तुमचं नाव काय?",
    expectedExtraction: {},
    fieldsCollected: [],
  },
  {
    aiMessage: "Nice to meet you, Sunita! Where do you live?",
    aiMessageMr: "सुनीता ताई, तुमच्याशी भेटून आनंद झाला! तुम्ही कुठे राहता?",
    expectedExtraction: { name: 'Sunita Jadhav' },
    fieldsCollected: ['name'],
  },
  {
    aiMessage: "Sangamner, great. What work do you currently do?",
    aiMessageMr: "संगमनेर, छान. सध्या तुम्ही काय काम करता?",
    expectedExtraction: { location: 'Sangamner, Ahmednagar' },
    fieldsCollected: ['location'],
  },
  {
    aiMessage: "You do tailoring at home. How many years have you been doing this?",
    aiMessageMr: "तुम्ही घरी शिवणकाम करता. हे काम तुम्ही किती वर्षांपासून करता?",
    expectedExtraction: { currentOccupation: 'Tailoring', workType: 'Home Based' },
    fieldsCollected: ['currentOccupation'],
  },
  {
    aiMessage: "4 years of experience – that's good! What type of garments do you usually stitch?",
    aiMessageMr: "४ वर्षांचा अनुभव – छान! तुम्ही सहसा कोणत्या प्रकारचे कपडे शिवता?",
    expectedExtraction: { experienceYears: 4 },
    fieldsCollected: ['experienceYears'],
  },
  {
    aiMessage: "Blouses, suits, and alterations. Do you also do any embroidery or decorative work?",
    aiMessageMr: "ब्लाउज, सूट आणि दुरुस्ती. तुम्ही भरतकाम किंवा सजावटीचं काम पण करता का?",
    expectedExtraction: { garmentTypes: ['Blouses', 'Suits', 'Alterations'] },
    fieldsCollected: ['garmentTypes'],
  },
  {
    aiMessage: "Basic embroidery too – that's a valuable skill! How many customers do you serve approximately? And what's your monthly income from this work?",
    aiMessageMr: "साधं भरतकाम पण करता – हे एक मौल्यवान कौशल्य आहे! तुमचे अंदाजे किती ग्राहक आहेत? आणि या कामातून महिन्याचे अंदाजे किती उत्पन्न होतं?",
    expectedExtraction: { embroidery: true },
    fieldsCollected: ['specificSkills'],
  },
  {
    aiMessage: "Around 15-20 regular customers and ₹5,000-8,000 monthly. That shows good customer trust! What is your education level?",
    aiMessageMr: "अंदाजे १५-२० नियमित ग्राहक आणि महिन्याला ₹५,०००-₹८,०००. ग्राहकांचा चांगला विश्वास आहे! तुमचं शिक्षण किती झालंय?",
    expectedExtraction: { customerBase: '15-20', incomeRange: '₹5,000-₹8,000' },
    fieldsCollected: ['customerBase', 'incomeRange'],
  },
  {
    aiMessage: "10th pass. Now, do you want to look for employment somewhere or grow your own business?",
    aiMessageMr: "दहावी पास. आता तुम्हाला कुठे नोकरी शोधायची आहे की स्वतःचा व्यवसाय वाढवायचा आहे?",
    expectedExtraction: { education: '10th Pass' },
    fieldsCollected: ['education'],
  },
  {
    aiMessage: "You want to grow your own business – wonderful! What interests you the most? Fashion, teaching tailoring, or something else?",
    aiMessageMr: "तुम्हाला स्वतःचा व्यवसाय वाढवायचा आहे – छान! तुम्हाला सर्वात जास्त काय आवडतं? फॅशन, शिवणकाम शिकवणे, की आणखी काही?",
    expectedExtraction: { employmentPreference: 'self_employment' },
    fieldsCollected: ['employmentPreference'],
  },
  {
    aiMessage: "Fashion and running a home enterprise. How far can you travel for training or work? And do you use a smartphone for anything work-related?",
    aiMessageMr: "फॅशन आणि घरगुती उद्योग चालवणे. प्रशिक्षण किंवा कामासाठी तुम्ही किती अंतर प्रवास करू शकता? आणि तुम्ही कामासाठी स्मार्टफोन वापरता का?",
    expectedExtraction: { interests: ['Fashion', 'Home Enterprise'] },
    fieldsCollected: ['interests'],
  },
  {
    aiMessage: "Within 10 km, and you use the phone mainly for calls and WhatsApp. One last question – does anyone in your family do any particular trade or business?",
    aiMessageMr: "१० किमी अंतरापर्यंत, आणि फोन मुख्यतः कॉल्स आणि व्हॉट्सॲप साठी वापरता. शेवटचा प्रश्न – तुमच्या कुटुंबात कोणी विशिष्ट व्यापार किंवा व्यवसाय करतं का?",
    expectedExtraction: { mobilityDistance: 10, digitalSkills: 'basic' },
    fieldsCollected: ['mobilityDistance', 'digitalSkills'],
  },
  {
    aiMessage: "Family is into farming. Thank you, Sunita! I have a good understanding of your skills and aspirations now. Let me analyze your profile and find the best opportunities for you.",
    aiMessageMr: "कुटुंब शेतीत आहे. धन्यवाद सुनीता ताई! तुमच्या कौशल्यांची आणि आकांक्षांची मला आता चांगली समज आहे. तुमचं प्रोफाइल विश्लेषित करून तुमच्यासाठी सर्वोत्तम संधी शोधतो.",
    expectedExtraction: { familyOccupation: 'Farming' },
    fieldsCollected: ['familyOccupation'],
  },
];

// User responses for demo (what the user "says")
const DEMO_USER_RESPONSES_MR = [
  "माझं नाव सुनीता जाधव.",
  "मी संगमनेर, अहमदनगर इथे राहते.",
  "मी घरी शिवणकाम करते.",
  "चार वर्षांपासून.",
  "ब्लाउज, सूट आणि कपडे दुरुस्ती.",
  "हो, साधं भरतकाम करते.",
  "अंदाजे १५-२० ग्राहक. महिन्याला ₹५-८ हजार.",
  "दहावी पास.",
  "मला स्वतःचा व्यवसाय वाढवायचा आहे.",
  "मला फॅशन आवडतं, घरगुती उद्योग चालवायचा आहे.",
  "१० किमी पर्यंत. फोन कॉल्ससाठी वापरते.",
  "घरचे शेती करतात.",
];

const DEMO_USER_RESPONSES_EN = [
  "My name is Sunita Jadhav.",
  "I live in Sangamner, Ahmednagar.",
  "I do tailoring at home.",
  "For four years.",
  "Blouses, suits, and alterations.",
  "Yes, I do basic embroidery.",
  "About 15-20 regular customers. Monthly around ₹5-8 thousand.",
  "10th pass.",
  "I want to grow my own business.",
  "I like fashion, want to run a home enterprise.",
  "Up to 10 km. I use phone mainly for calls.",
  "Family does farming.",
];

let state: ConversationState = {
  collectedFields: [],
  currentStep: 0,
  language: 'mr',
  extractedData: {},
};

export function resetConversation() {
  state = {
    collectedFields: [],
    currentStep: 0,
    language: 'mr',
    extractedData: {},
  };
}

export function setConversationLanguage(lang: string) {
  state.language = lang;
}

export function getNextAIMessage(): ConversationMessage | null {
  if (state.currentStep >= DEMO_SCRIPT.length) return null;

  const step = DEMO_SCRIPT[state.currentStep];
  const text = state.language === 'mr' ? step.aiMessageMr : step.aiMessage;

  return {
    id: `ai-${state.currentStep}`,
    role: 'ai',
    text,
    textMr: step.aiMessageMr,
    timestamp: new Date().toISOString(),
    confidence: 0.95,
  };
}

export function getDemoUserResponse(): string {
  const idx = state.currentStep - 1; // response maps to previous question
  if (idx < 0 || idx >= DEMO_USER_RESPONSES_MR.length) return '';
  return state.language === 'mr' ? DEMO_USER_RESPONSES_MR[idx] : DEMO_USER_RESPONSES_EN[idx];
}

export function processUserResponse(_userText: string): {
  aiResponse: ConversationMessage;
  extracted: Record<string, unknown>;
  fieldsCollected: string[];
  isComplete: boolean;
  progress: number;
} {
  // Extract data from current step
  const currentScript = DEMO_SCRIPT[state.currentStep];
  if (currentScript) {
    state.extractedData = { ...state.extractedData, ...currentScript.expectedExtraction };
    state.collectedFields = [...state.collectedFields, ...currentScript.fieldsCollected];
  }

  // Move to next step
  state.currentStep++;

  const isComplete = state.currentStep >= DEMO_SCRIPT.length;
  const progress = Math.round((state.currentStep / DEMO_SCRIPT.length) * 100);

  const nextMessage = getNextAIMessage();

  return {
    aiResponse: nextMessage || {
      id: `ai-complete`,
      role: 'ai',
      text: state.language === 'mr'
        ? 'धन्यवाद! तुमचं प्रोफाइल तयार आहे. आता मी तुमच्यासाठी योग्य संधी शोधतो.'
        : 'Thank you! Your profile is ready. Now let me find the right opportunities for you.',
      timestamp: new Date().toISOString(),
    },
    extracted: state.extractedData,
    fieldsCollected: state.collectedFields,
    isComplete,
    progress,
  };
}

export function getConversationProgress(): number {
  return Math.round((state.currentStep / DEMO_SCRIPT.length) * 100);
}

export function getCollectedFields(): string[] {
  return state.collectedFields;
}

export function getMissingFields(): string[] {
  return PROFILE_FIELDS.filter(f => !state.collectedFields.includes(f));
}

export function getExtractedProfile(): Record<string, unknown> {
  return state.extractedData;
}

export function getTotalSteps(): number {
  return DEMO_SCRIPT.length;
}

export function getCurrentStep(): number {
  return state.currentStep;
}

export function isConversationComplete(): boolean {
  return state.currentStep >= DEMO_SCRIPT.length;
}

// Generate confirmation data for the summary screen
export function getProfileSummaryForConfirmation(beneficiary: Beneficiary) {
  return {
    name: { value: beneficiary.name, confidence: 0.98, source: 'Voice conversation' },
    age: { value: beneficiary.age, confidence: 0.95, source: 'Voice conversation' },
    location: { value: `${beneficiary.location.town}, ${beneficiary.location.district}`, confidence: 0.97, source: 'Voice conversation' },
    education: { value: beneficiary.education.level, confidence: 0.96, source: 'Voice conversation' },
    currentWork: { value: beneficiary.livelihood.occupation, confidence: 0.98, source: 'Voice conversation' },
    experience: { value: `${beneficiary.livelihood.experienceYears} years`, confidence: 0.94, source: 'Voice conversation' },
    skills: { value: beneficiary.skills.map(s => s.name).join(', '), confidence: 0.92, source: 'Voice + AI inference' },
    interests: { value: beneficiary.aspiration.interests.join(', '), confidence: 0.90, source: 'Voice conversation' },
    preference: { value: beneficiary.aspiration.employmentPreference === 'self_employment' ? 'Self Employment' : 'Wage Employment', confidence: 0.96, source: 'Voice conversation' },
    mobility: { value: '10 km', confidence: 0.93, source: 'Voice conversation' },
  };
}

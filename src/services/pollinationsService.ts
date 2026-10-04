import type { ConversationMessage } from '../types/models';

const POLLINATIONS_API_KEY = import.meta.env.VITE_POLLINATIONS_API_KEY || '';
const POLLINATIONS_API_URL = import.meta.env.VITE_POLLINATIONS_API_URL
  || 'https://gen.pollinations.ai/v1/chat/completions';
const POLLINATIONS_MODEL = import.meta.env.VITE_POLLINATIONS_MODEL
  || 'openai/gpt-5.4-nano';

export interface PollinationsReply {
  text: string;
  collectedFields: string[];
  progress: number;
}

export function isPollinationsConfigured(): boolean {
  return Boolean(POLLINATIONS_API_KEY && POLLINATIONS_API_KEY.startsWith('sk_'));
}

function getLanguageName(language: string): string {
  const names: Record<string, string> = {
    mr: 'Marathi',
    hi: 'Hindi',
    en: 'English',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
  };

  return names[language] || 'English';
}

function getSystemPrompt(language: string): string {
  const languageName = getLanguageName(language);

  return `You are Saksham Saathi, a warm government-aligned livelihood assistant for PM-AJAY beneficiaries in India.
Conduct a natural voice-friendly intake interview in ${languageName}. Ask only one short question at a time.
Use simple, respectful language and never invent facts. Understand the person's work, skills, experience,
education, location, constraints, aspirations, and employment preference. Acknowledge each answer briefly.

Return ONLY valid JSON with this exact shape:
{"reply":"your next response or question","collectedFields":["field names known from the conversation"],"progress":0}

Allowed field names: name, age, gender, location, language, education, currentOccupation, experienceYears,
specificSkills, equipment, customerBase, incomeRange, interests, employmentPreference, mobilityDistance,
digitalSkills, familyOccupation, challenges.
The progress number must be an integer from 0 to 100 based on useful fields collected.`;
}

function parseReply(content: string): PollinationsReply {
  const cleaned = content.trim().replace(/^```json\s*/i, '').replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(cleaned) as Partial<PollinationsReply> & { reply?: string };
    return {
      text: typeof parsed.text === 'string'
        ? parsed.text
        : typeof parsed.reply === 'string'
          ? parsed.reply
          : content.trim(),
      collectedFields: Array.isArray(parsed.collectedFields)
        ? parsed.collectedFields.filter((field): field is string => typeof field === 'string')
        : [],
      progress: typeof parsed.progress === 'number'
        ? Math.max(0, Math.min(100, Math.round(parsed.progress)))
        : 0,
    };
  } catch {
    return {
      text: content.trim(),
      collectedFields: [],
      progress: 0,
    };
  }
}

export async function getPollinationsReply(
  history: ConversationMessage[],
  language: string,
): Promise<PollinationsReply> {
  if (!isPollinationsConfigured()) {
    throw new Error('Pollinations API is not configured.');
  }

  const messages = [
    { role: 'system', content: getSystemPrompt(language) },
    ...history.map(message => ({
      role: message.role === 'ai' ? 'assistant' : 'user',
      content: message.text,
    })),
  ];

  if (history.length === 0) {
    messages.push({
      role: 'user',
      content: 'Start the intake interview with a warm greeting and ask for the beneficiary name.',
    });
  }

  const response = await fetch(POLLINATIONS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${POLLINATIONS_API_KEY}`,
    },
    body: JSON.stringify({
      model: POLLINATIONS_MODEL,
      messages,
      temperature: 0.35,
      max_tokens: 350,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => '');
    throw new Error(`Pollinations request failed (${response.status}). ${details.slice(0, 160)}`);
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Pollinations returned an empty response.');
  }

  return parseReply(content);
}

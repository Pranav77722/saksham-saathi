// ============================================================
// SAKSHAM SAATHI — Sarvam AI Speech & Indic Intelligence Service
// ============================================================

const SARVAM_API_KEY = import.meta.env.VITE_SARVAM_API_KEY || '';
let sarvamVolume = 1;

export function setSarvamVolume(volume: number): void {
  sarvamVolume = Math.max(0, Math.min(1, volume));
}

export function getSarvamVolume(): number {
  return sarvamVolume;
}

function getSarvamLanguageCode(languageCode: string): string {
  if (languageCode.includes('-')) return languageCode;

  const languageMap: Record<string, string> = {
    mr: 'mr-IN',
    hi: 'hi-IN',
    en: 'en-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    bn: 'bn-IN',
  };

  return languageMap[languageCode] || 'unknown';
}

export function isSarvamConfigured(): boolean {
  return Boolean(SARVAM_API_KEY && SARVAM_API_KEY.startsWith('sk_'));
}

/**
 * Text-to-Speech via Sarvam AI API (supports Marathi, Hindi, English, etc.)
 */
export async function playSarvamTTS(text: string, languageCode: string = 'mr-IN'): Promise<boolean> {
  if (!isSarvamConfigured()) {
    return playBrowserTTS(text, languageCode);
  }

  try {
    // Map language code to Sarvam supported codes
    const targetLang = languageCode.startsWith('mr') 
      ? 'mr-IN' 
      : languageCode.startsWith('hi') 
      ? 'hi-IN' 
      : 'en-IN';

    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: targetLang,
        speaker: 'meera',
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v1',
      }),
    });

    if (!response.ok) {
      console.warn('Sarvam TTS API returned non-OK status:', response.status);
      return playBrowserTTS(text, languageCode);
    }

    const data = await response.json();
    if (data.audios && data.audios[0]) {
      const audioBase64 = data.audios[0];
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audio.volume = sarvamVolume;
      await audio.play();
      return true;
    }

    return playBrowserTTS(text, languageCode);
  } catch (error) {
    console.warn('Sarvam TTS error, falling back to browser synthesis:', error);
    return playBrowserTTS(text, languageCode);
  }
}

/**
 * Native Browser Speech Synthesis Fallback
 */
export function playBrowserTTS(text: string, languageCode: string = 'mr'): boolean {
  if (!('speechSynthesis' in window)) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageCode.startsWith('mr') ? 'mr-IN' : languageCode.startsWith('hi') ? 'hi-IN' : 'en-IN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = sarvamVolume;
  window.speechSynthesis.speak(utterance);
  return true;
}

/**
 * Speech-to-Text via Sarvam AI API
 */
export async function transcribeAudioWithSarvam(audioBlob: Blob, languageCode: string = 'mr-IN'): Promise<string | null> {
  if (!isSarvamConfigured()) return null;

  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'saksham-saathi-voice.wav');
    formData.append('model', 'saaras:v3');
    formData.append('language_code', getSarvamLanguageCode(languageCode));
    formData.append('mode', 'transcribe');

    const response = await fetch('https://api.sarvam.ai/speech-to-text', {
      method: 'POST',
      headers: {
        'api-subscription-key': SARVAM_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.transcript || null;
  } catch (err) {
    console.error('Sarvam STT error:', err);
    return null;
  }
}

/**
 * MediaRecorder usually produces WebM/Opus. Convert it to PCM WAV so the
 * transcription request has a predictable format across supported browsers.
 */
export async function convertAudioBlobToWav(audioBlob: Blob): Promise<Blob> {
  const AudioContextConstructor = window.AudioContext
    || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    throw new Error('This browser does not support audio processing.');
  }

  const audioContext = new AudioContextConstructor();

  try {
    const audioBuffer = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
    const channelCount = audioBuffer.numberOfChannels;
    const frameCount = audioBuffer.length;
    const wavBuffer = new ArrayBuffer(44 + frameCount * channelCount * 2);
    const view = new DataView(wavBuffer);

    const writeString = (offset: number, value: string) => {
      for (let i = 0; i < value.length; i += 1) {
        view.setUint8(offset + i, value.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + frameCount * channelCount * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channelCount, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * channelCount * 2, true);
    view.setUint16(32, channelCount * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, frameCount * channelCount * 2, true);

    const channels = Array.from({ length: channelCount }, (_, index) => audioBuffer.getChannelData(index));
    let offset = 44;

    for (let frame = 0; frame < frameCount; frame += 1) {
      for (let channel = 0; channel < channelCount; channel += 1) {
        const sample = Math.max(-1, Math.min(1, channels[channel][frame]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }

    return new Blob([wavBuffer], { type: 'audio/wav' });
  } finally {
    await audioContext.close();
  }
}

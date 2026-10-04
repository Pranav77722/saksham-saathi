import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, ChevronRight, Volume2, VolumeX, Sparkles, CheckCircle2, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { convertAudioBlobToWav, getSarvamVolume, playSarvamTTS, isSarvamConfigured, setSarvamVolume, transcribeAudioWithSarvam } from '../services/sarvamService';
import { getPollinationsReply, isPollinationsConfigured } from '../services/pollinationsService';
import type { ConversationMessage } from '../types/models';
import { translate } from '../i18n';

interface Props {
  onComplete: () => void;
  language: string;
}

export default function VoiceConversationScreen({ onComplete, language }: Props) {
  const tr = (key: string) => translate(language, key);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputText, setInputText] = useState('');
  const [progress, setProgress] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(getSarvamVolume());
  const [collectedFields, setCollectedFieldsState] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const conversationHistoryRef = useRef<ConversationMessage[]>([]);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setIsProcessing(true);

    getPollinationsReply([], language)
      .then(reply => {
        const firstMsg: ConversationMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text: reply.text,
          timestamp: new Date().toISOString(),
        };
        conversationHistoryRef.current = [firstMsg];
        setMessages([firstMsg]);
        setProgress(reply.progress);
        setCollectedFieldsState(reply.collectedFields);
        if (audioEnabled) playSarvamTTS(firstMsg.text, language);
      })
      .catch(error => {
        console.error('Pollinations conversation start failed:', error);
        setErrorMessage('The conversation assistant could not connect. Please check the Pollinations API key and try again.');
      })
      .finally(() => setIsProcessing(false));
  }, [language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const submitUserText = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setErrorMessage('');
    setIsProcessing(true);

    const userMsg: ConversationMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmedText,
      timestamp: new Date().toISOString(),
    };
    const nextHistory = [...conversationHistoryRef.current, userMsg];
    conversationHistoryRef.current = nextHistory;
    setMessages(nextHistory);

    getPollinationsReply(nextHistory, language)
      .then(reply => {
        const aiMsg: ConversationMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          text: reply.text,
          timestamp: new Date().toISOString(),
        };
        conversationHistoryRef.current = [...nextHistory, aiMsg];
        setMessages(prev => [...prev, aiMsg]);
        if (audioEnabled) playSarvamTTS(aiMsg.text, language);
        setProgress(reply.progress);
        setCollectedFieldsState(reply.collectedFields);
      })
      .catch(error => {
        console.error('Pollinations conversation reply failed:', error);
        conversationHistoryRef.current = conversationHistoryRef.current.filter(message => message.id !== userMsg.id);
        setMessages(prev => prev.filter(message => message.id !== userMsg.id));
        setErrorMessage('The conversation assistant could not reply. Please try again.');
      })
      .finally(() => {
        setIsProcessing(false);
        setInputText('');
      });
  };

  const startRecording = async () => {
    if (isListening || isProcessing) return;

    if (!isSarvamConfigured()) {
      setErrorMessage('Sarvam AI is not configured. Add VITE_SARVAM_API_KEY to your local .env file.');
      return;
    }

    if (!isPollinationsConfigured()) {
      setErrorMessage('Pollinations AI is not configured. Add VITE_POLLINATIONS_API_KEY to your local .env file.');
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setErrorMessage('Voice recording is not supported in this browser. You can type your response instead.');
      setShowInput(true);
      return;
    }

    try {
      setErrorMessage('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']
        .find(type => MediaRecorder.isTypeSupported(type));
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        mediaRecorderRef.current = null;
        setIsListening(false);

        if (!chunks.length) {
          setErrorMessage('No voice was captured. Please try speaking again.');
          return;
        }

        setIsProcessing(true);
        try {
          const recordedBlob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const wavBlob = await convertAudioBlobToWav(recordedBlob);
          const transcript = await transcribeAudioWithSarvam(wavBlob, language);

          if (!transcript?.trim()) {
            throw new Error('Sarvam AI did not return a transcript.');
          }

          setIsProcessing(false);
          submitUserText(transcript);
        } catch (error) {
          console.error('Voice transcription failed:', error);
          setIsProcessing(false);
          setErrorMessage('We could not understand that recording. Please try again or type your response.');
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsListening(true);
    } catch (error) {
      console.error('Microphone access failed:', error);
      setErrorMessage('Microphone access is needed for voice replies. Please allow microphone permission or type your response.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleTextSend = () => {
    if (!inputText.trim() || isProcessing) return;
    submitUserText(inputText);
  };

  const handleVolumeChange = (nextVolume: number) => {
    setVolume(nextVolume);
    setSarvamVolume(nextVolume);
    setAudioEnabled(nextVolume > 0);
  };

  const toggleAudio = () => {
    handleVolumeChange(audioEnabled ? 0 : volume || 0.8);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-100">
      {/* Top Header */}
      <div className="conversation-header bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 shadow-xs">
        <div className="conversation-header__inner max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="conversation-header__brand flex items-center gap-2 min-w-0">
            <span className="text-xl">🎙️</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm md:text-base leading-tight">{tr('conversationTitle')}</h1>
                {isSarvamConfigured() && isPollinationsConfigured() && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> Sarvam + Pollinations AI
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{tr('conversationSubtitle')} • PM-AJAY GIA</p>
            </div>
          </div>

          <div className="conversation-header__controls flex items-center gap-3 shrink-0">
            <button
              onClick={toggleAudio}
              className="voice-volume__button p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
              title={audioEnabled ? tr('muteAi') : tr('unmuteAi')}
              aria-label={audioEnabled ? tr('muteAi') : tr('unmuteAi')}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5 text-indigo-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
            </button>

            <div className="voice-volume-control flex items-center gap-1.5">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={event => handleVolumeChange(Number(event.target.value))}
                className="voice-volume-slider w-16 sm:w-24"
                aria-label="AI voice volume"
              />
              <span className="voice-volume__value text-[11px] font-bold text-slate-500 tabular-nums w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            <div className="conversation-progress flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-600">{progress}%</span>
              <div className="w-20 md:w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-600 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <button
              onClick={onComplete}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 hidden sm:inline"
            >
              {tr('skipProfile')} →
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row overflow-hidden">
        {/* Left Column: Interactive Chat Interface */}
        <div className="flex-1 flex flex-col bg-white lg:border-r lg:border-slate-200 h-[calc(100vh-60px)]">
          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400 font-semibold">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">S</span>
                        <span>Saksham Saathi</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed shadow-xs ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/60'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isProcessing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-slate-100 text-slate-500 rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>Transcribing speech and waiting for the assistant...</span>
                </div>
              </motion.div>
            )}

            {errorMessage && (
              <div className="mx-auto max-w-lg rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-center text-xs text-rose-700">
                {errorMessage}
              </div>
            )}
          </div>

          {/* Bottom Voice Control Section */}
          <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3">
            {/* Waveform Animation when listening */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[12, 28, 40, 24, 36, 16, 32, 20].map((h, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-indigo-600 rounded-full"
                    animate={{ height: [8, h, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.08 }}
                  />
                ))}
                <span className="text-xs text-indigo-700 font-semibold ml-2">{tr('listening')}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={isListening ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`flex-1 h-13 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    <span>{tr('listening')}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 animate-pulse" />
                    <span>{tr('speakResponse')}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowInput(!showInput)}
                className="px-3 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                title="Type text instead"
              >
                ⌨️
              </button>
            </div>

            {showInput && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={tr('typeResponse')}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTextSend()}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleTextSend}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-center text-[10px] text-slate-400">
              Voice replies are transcribed securely by Sarvam AI before being added to the chat.
            </p>
          </div>
        </div>

        {/* Right Column: Desktop Live Extracted Profile Intelligence */}
        <div className="hidden lg:flex lg:w-2/5 flex-col bg-slate-50 border-slate-200 p-5 space-y-4 overflow-y-auto h-[calc(100vh-60px)]">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" /> Live Conversation Assistant
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Live AI Pipeline
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sarvam transcribes the voice response and Pollinations keeps the interview conversational while tracking useful profile fields.
            </p>
          </div>

          {/* Profile Card Summary */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tr('beneficiaryIdentity')}</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl font-bold text-indigo-700">
                👩
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Sunita Jadhav</h4>
                <p className="text-xs text-slate-500">Sangamner, Ahmednagar • 28 yrs</p>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">Primary Trade: Tailoring (4 yrs)</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 block mb-1">Identified NSQF Sector:</span>
              <span className="inline-block bg-blue-50 text-blue-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-blue-200">
                Apparel, Made-Ups & Home Furnishing (Level 4)
              </span>
            </div>
          </div>

          {/* Live Extracted Fields Checklist */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              {tr('extractedParameters')} ({collectedFields.length} of 12)
            </h3>
            <div className="space-y-1.5 text-xs">
              {[
                { key: 'name', label: tr('beneficiaryName') },
                { key: 'location', label: tr('clusterTown') },
                { key: 'currentOccupation', label: tr('primaryTrade') },
                { key: 'experienceYears', label: tr('experienceYears') },
                { key: 'garmentTypes', label: tr('competencies') },
                { key: 'mobility', label: tr('mobilityConstraint') },
                { key: 'preference', label: tr('selfEmployment') },
              ].map(({ key, label }) => {
                const isCollected = collectedFields.includes(key);
                return (
                  <div key={key} className="flex items-center justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-600 text-[11px]">{label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCollected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isCollected ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : '•'}
                      {isCollected ? tr('extracted') : tr('pending')}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onComplete}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>{tr('verifyExtracted')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

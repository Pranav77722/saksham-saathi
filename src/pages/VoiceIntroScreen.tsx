import { motion } from 'framer-motion';
import { Mic, MessageCircle, BrainCircuit, Volume2, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function VoiceIntroScreen({ onStart }: { onStart: () => void }) {
  const { state } = useApp();
  const steps = [
    { icon: Mic, title: 'Speak naturally', titleMr: 'नैसर्गिकपणे बोला', desc: 'Just talk about your work and daily trade' },
    { icon: BrainCircuit, title: 'AI understands', titleMr: 'AI समजतो', desc: 'We extract skills, prior experience & constraints' },
    { icon: MessageCircle, title: 'Smart questions', titleMr: 'स्मार्ट प्रश्न', desc: 'Targeted follow-ups in your local dialect' },
    { icon: Volume2, title: 'Get recommendations', titleMr: 'शिफारसी मिळवा', desc: 'Personalized NSQF skilling & local jobs' },
  ];

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 md:p-8">
      <div className="w-full max-w-lg bg-white md:rounded-3xl md:shadow-xl md:border md:border-slate-200/80 overflow-hidden flex flex-col min-h-dvh md:min-h-0">
        <div className="flex-1 px-6 pt-10 pb-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">How Voice Profiling Works</h1>
            <p className="text-slate-500 text-xs">सक्षम साथी — नैसर्गिक संभाषण तंत्रज्ञान</p>
          </motion.div>

          <div className="space-y-4 max-w-md mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="flex items-start gap-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <step.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{step.title}</h3>
                  <p className="text-[11px] text-indigo-600 font-semibold">{step.titleMr}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 py-6 border-t border-slate-100 bg-slate-50/50 md:bg-white safe-bottom"
        >
          <button
            onClick={onStart}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-colors shadow-lg shadow-indigo-200"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span>{translate(state.language, 'startConversation')}</span>
          </button>
          <p className="text-center text-slate-400 text-xs mt-2.5">
            Voice AI powered by Sarvam AI Indic Speech engine
          </p>
        </motion.div>
      </div>
    </div>
  );
}

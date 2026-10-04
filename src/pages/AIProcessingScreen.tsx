import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

// The "WOW" moment — AI processing animation
const STEPS = [
  { label: 'Analyzing your voice responses...', labelMr: 'तुमची उत्तरे विश्लेषित करत आहे...', icon: '🎙' },
  { label: 'Extracting skill profile...', labelMr: 'कौशल्य प्रोफाइल तयार करत आहे...', icon: '🧠' },
  { label: 'Understanding aspirations...', labelMr: 'आकांक्षा समजून घेत आहे...', icon: '✨' },
  { label: 'Checking constraints...', labelMr: 'मर्यादा तपासत आहे...', icon: '📍' },
  { label: 'Finding suitable pathways...', labelMr: 'योग्य मार्ग शोधत आहे...', icon: '🎯' },
  { label: 'Generating Skill DNA...', labelMr: 'कौशल्य DNA तयार करत आहे...', icon: '🧬' },
];

export default function AIProcessingScreen({ onComplete }: { onComplete: () => void }) {
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setShowFinal(true), 600);
          setTimeout(onComplete, 2800);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white px-6">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <motion.div className="relative z-10 text-center max-w-sm">
        {!showFinal ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20"
            >
              {/* Rotating ring */}
              <svg className="w-24 h-24 absolute animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
                <circle cx="48" cy="48" r="44" fill="none" stroke="white" strokeWidth="2" strokeDasharray="30 240" strokeLinecap="round" />
              </svg>
              <span className="text-3xl">{STEPS[currentStep]?.icon}</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold mb-2"
            >
              {state.language === 'mr' ? 'तुमची क्षमता समजून घेत आहे...' : state.language === 'hi' ? 'आपकी क्षमता समझ रहे हैं...' : 'Understanding your potential...'}
            </motion.h2>
            <p className="text-indigo-300 text-sm mb-1">तुमची क्षमता समजून घेत आहे...</p>

            <div className="mt-8 space-y-3">
              <AnimatePresence mode="popLayout">
                {STEPS.slice(0, currentStep + 1).map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-left"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      i < currentStep ? 'bg-emerald-500' : 'bg-white/20'
                    }`}>
                      {i < currentStep ? (
                        <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm ${i <= currentStep ? 'text-white' : 'text-indigo-400'}`}>{step.label}</p>
                      <p className="text-xs text-indigo-400">{step.labelMr}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-center"
          >
            <div className="w-28 h-28 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center border-2 border-emerald-400">
              <span className="text-5xl">🧬</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Skill DNA is Ready!</h2>
            <p className="text-indigo-300">तुमचा कौशल्य DNA तयार आहे!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

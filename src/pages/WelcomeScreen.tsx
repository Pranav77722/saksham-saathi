import { motion } from 'framer-motion';
import { Mic, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function WelcomeScreen({ onNext }: { onNext: () => void }) {
  const { state } = useApp();
  const startLabel = translate(state.language, 'startConversation');
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 md:p-8">
      <div className="w-full max-w-xl bg-white md:rounded-3xl md:shadow-xl md:border md:border-slate-200/80 overflow-hidden flex flex-col min-h-dvh md:min-h-0">
        {/* Header area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 md:py-12">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <img
              src="/saksham-saathi-logo.png"
              alt="सक्षम साथी - Sakham Saathi"
              className="w-36 h-36 mx-auto mb-5 object-contain"
            />

            <div className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs px-3 py-1 rounded-full font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>PM-AJAY GIA Component</span>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              सक्षम साथी
            </h1>
            <p className="text-lg text-indigo-600 font-bold mb-3">
              SAKSHAM SAATHI
            </p>
            <p className="text-slate-800 font-semibold text-base mb-2">
              "Your Voice. Your Skills. Your Livelihood."
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tell us about yourself in your own language. We will understand your skills, recognize prior experience (RPL), and connect you with local opportunities and NSQF skilling.
            </p>
            <p className="text-slate-500 text-xs leading-relaxed mt-2 font-medium">
              तुमच्याबद्दल सांगा. आम्ही तुमची कौशल्ये ओळखून योग्य प्रशिक्षण आणि उपजीविकेच्या संधी शोधू.
            </p>
          </motion.div>
        </div>

        {/* Bottom area */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="px-6 pb-8 pt-4 md:py-6 bg-slate-50/50 md:bg-white border-t border-slate-100 safe-bottom"
        >
          <button
            onClick={onNext}
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-colors shadow-lg shadow-indigo-200 hover:shadow-xl"
          >
            <Mic className="w-5 h-5 animate-pulse" />
            <span>{startLabel}</span>
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400 text-xs text-center">
            <Shield className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span>Secure government-aligned livelihood mapping • No complex forms</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

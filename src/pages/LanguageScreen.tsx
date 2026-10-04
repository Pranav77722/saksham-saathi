import { motion } from 'framer-motion';
import { Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../types/models';
import { useState } from 'react';
import { translate } from '../i18n';

export default function LanguageScreen({ onSelect }: { onSelect: (lang: string) => void }) {
  const [selected, setSelected] = useState('mr');

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 md:p-8">
      <div className="w-full max-w-lg bg-white md:rounded-3xl md:shadow-xl md:border md:border-slate-200/80 overflow-hidden flex flex-col min-h-dvh md:min-h-0">
        <div className="px-6 pt-10 pb-4 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Globe className="w-7 h-7 text-indigo-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-1">{translate(selected, 'chooseLanguage')}</h1>
            <p className="text-slate-500 text-xs">तुम्हाला सोयीस्कर भाषा निवडा</p>
          </motion.div>
        </div>

        <div className="flex-1 px-6 py-2 space-y-2.5 overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(lang.code)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                selected === lang.code
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs'
                  : 'border-slate-100 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-indigo-600 w-8">{lang.nameNative.charAt(0)}</span>
                <div className="text-left">
                  <p className={`font-bold text-sm ${selected === lang.code ? 'text-indigo-800' : 'text-slate-800'}`}>
                    {lang.nameNative}
                  </p>
                  <p className="text-xs text-slate-500">{lang.name}</p>
                </div>
              </div>
              {selected === lang.code && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="px-6 py-6 border-t border-slate-100 bg-slate-50/50 md:bg-white safe-bottom">
          <button
            onClick={() => onSelect(selected)}
            className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base transition-colors shadow-lg shadow-indigo-200"
          >
            {translate(selected, 'continue')}
          </button>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Check, Edit3, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { getProfileSummaryForConfirmation } from '../services/conversationService';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function ConversationConfirmScreen({ onConfirm, onEdit }: { onConfirm: () => void; onEdit: () => void }) {
  const { state } = useApp();
  const tr = (key: Parameters<typeof translate>[1]) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const summary = getProfileSummaryForConfirmation(beneficiary);

  const fields = [
    { label: 'Name / नाव', ...summary.name },
    { label: 'Age / वय', ...summary.age },
    { label: 'Location / स्थान', ...summary.location },
    { label: 'Education / शिक्षण', ...summary.education },
    { label: 'Current Work / सध्याचे काम', ...summary.currentWork },
    { label: 'Experience / अनुभव', ...summary.experience },
    { label: 'Skills / कौशल्ये', ...summary.skills },
    { label: 'Interests / आवडी', ...summary.interests },
    { label: 'Preference / पसंती', ...summary.preference },
    { label: 'Mobility / प्रवास', ...summary.mobility },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 px-4 py-5 shadow-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base md:text-lg">Verify Voice Extracted Profile</h1>
              <p className="text-xs text-slate-500">मला हे समजलं. हे बरोबर आहे का? Please verify accuracy.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Confidence Score: 95%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-5xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {fields.map((field, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-400 mb-1">{field.label}</p>
                  <p className="font-bold text-slate-900 text-sm">{String(field.value)}</p>
                </div>
                <div className="shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    field.confidence >= 0.9 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    field.confidence >= 0.7 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-rose-50 text-rose-700'
                  }`}>
                    {Math.round(field.confidence * 100)}% Match
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-50">Source: {field.source}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-4 sticky bottom-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 hidden sm:block">
            Once confirmed, our AI engine synthesizes your personalized Skill DNA and RPL eligibility.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onEdit}
              className="flex-1 sm:flex-none px-5 py-3 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{tr('edit')} Details</span>
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{tr('complete')} &amp; Generate Skill DNA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Heart, 
  AlertTriangle, 
  ShieldCheck, 
  Edit3, 
  Save, 
  CheckCircle2,
  Sparkles,
  Phone
} from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { Beneficiary } from '../types/models';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface ProfileScreenProps {
  onBack: () => void;
}

export default function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { state } = useApp();
  const tr = (key: Parameters<typeof translate>[1]) => translate(state.language, key);
  const [beneficiary, setBeneficiary] = useState<Beneficiary>(getDemoBeneficiary());
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(beneficiary.phone);
  const [desiredOccupation, setDesiredOccupation] = useState(beneficiary.aspiration.desiredOccupation || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    setBeneficiary(prev => ({
      ...prev,
      phone,
      aspiration: {
        ...prev.aspiration,
        desiredOccupation,
      },
      lastUpdated: new Date().toISOString(),
    }));
    setIsEditing(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 inset-x-4 z-50 max-w-md mx-auto bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <p className="text-sm font-medium">{tr('profile')} updated successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white px-4 pt-5 pb-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-base">{tr('beneficiary')} {tr('profile')}</h1>
            <p className="text-xs text-indigo-300">लाभार्थी प्रोफाइल पडताळणी</p>
          </div>
          <button
            onClick={() => {
              if (isEditing) handleSave();
              else setIsEditing(true);
            }}
            className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            <span>{isEditing ? tr('save') : tr('edit')}</span>
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mt-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-3xl shrink-0">
            👩
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{beneficiary.name}</h2>
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> {tr('verified')}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              {beneficiary.age} yrs • {beneficiary.gender === 'female' ? 'Female' : 'Male'} • Marathi
            </p>
            <p className="text-xs text-indigo-300 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-indigo-400" />
              {beneficiary.location.town}, {beneficiary.location.district}, {beneficiary.location.state}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-3xl w-full mx-auto">
        {/* Voice AI Extraction Summary */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Voice Conversation Extraction
            </span>
            <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-200">
              Confidence: 94%
            </span>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Data synthesized from Marathi voice interaction on PM-AJAY conversational intake. Profile was automatically classified into NSQF Sector: Apparel & Textiles.
          </p>
        </div>

        {/* Livelihood & Education */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" /> Current Livelihood & Education
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Primary Trade</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{beneficiary.livelihood.occupation}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Experience</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{beneficiary.livelihood.experienceYears} Years</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Work Nature</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{beneficiary.livelihood.workType}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Monthly Earnings</span>
              <span className="font-bold text-emerald-700 text-sm mt-0.5 block">{beneficiary.livelihood.incomeRange}</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Formal Education Level:</span>
            <span className="font-bold text-slate-900">{beneficiary.education.level}</span>
          </div>
        </div>

        {/* Skills Extracted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Identified Competencies ({beneficiary.skills.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {beneficiary.skills.map(s => (
              <span
                key={s.id}
                className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-2.5 py-1 rounded-xl font-medium flex items-center gap-1.5"
              >
                <span>{s.name}</span>
                {s.nameMr && <span className="text-[10px] text-indigo-500">({s.nameMr})</span>}
                <span className="text-[10px] bg-indigo-200/70 text-indigo-900 px-1.5 py-0.2 rounded font-bold">
                  {s.proficiency}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Aspirations & Constraints */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> Aspiration & Constraints
          </h3>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Desired Career Goal</span>
            {isEditing ? (
              <input
                type="text"
                value={desiredOccupation}
                onChange={(e) => setDesiredOccupation(e.target.value)}
                className="w-full mt-1 bg-white border border-slate-300 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            ) : (
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{beneficiary.aspiration.desiredOccupation}</span>
            )}
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] mb-1.5">Noted Constraints</span>
            <div className="space-y-1.5">
              {beneficiary.constraints.map((c, i) => (
                <div key={i} className="flex items-center gap-2 bg-amber-50 text-amber-900 text-xs p-2 rounded-xl border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{c.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

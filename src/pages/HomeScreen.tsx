import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Dna, 
  TrendingUp, 
  GraduationCap, 
  Briefcase, 
  Map, 
  Calendar, 
  User, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  CheckCircle2
} from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface HomeScreenProps {
  onNavigate: (page: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const beneficiary = getDemoBeneficiary();
  const { state, setState } = useApp();
  const tr = (key: Parameters<typeof translate>[1]) => translate(state.language, key);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

  return (
    <div className="portal-page min-h-dvh flex flex-col bg-slate-50">
      {/* Top Bar with Role Switcher & Network Status */}
      <header className="portal-local-header bg-white text-slate-900 px-4 py-3 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/saksham-saathi-logo.png" alt="" className="w-10 h-10 object-contain rounded-lg border border-slate-200" />
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#19324d] block">SAKSHAM SAATHI</span>
              <span className="text-[10px] text-[#0f766e] font-medium">PM-AJAY GIA Livelihood Intelligence</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Offline simulation toggle */}
            <button
              onClick={() => {
                setIsSimulatedOffline(!isSimulatedOffline);
                setState(prev => ({ ...prev, isOnline: isSimulatedOffline }));
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border transition-colors ${
                isSimulatedOffline
                  ? 'bg-amber-950/80 border-amber-600 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Toggle Online/Offline simulation"
            >
              {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[11px] font-semibold">{isSimulatedOffline ? 'Offline' : 'Online'}</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => onNavigate('home')}
                className="px-2.5 py-1 rounded bg-[#0f766e] text-white font-semibold text-[11px]"
              >
                {tr('beneficiary')}
              </button>
              <button
                onClick={() => onNavigate('field_worker')}
                className="px-2.5 py-1 rounded text-slate-600 hover:text-[#0f766e] font-medium text-[11px]"
              >
                {tr('fieldWorker')}
              </button>
              <button
                onClick={() => onNavigate('authority')}
                className="px-2.5 py-1 rounded text-slate-600 hover:text-[#0f766e] font-medium text-[11px]"
              >
                {tr('authority')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto max-w-6xl w-full mx-auto p-4 md:p-6 space-y-5">
        {/* Offline Warning Banner if simulated */}
        {isSimulatedOffline && (
          <div className="bg-amber-50 border border-amber-300 p-3 rounded-2xl flex items-center justify-between text-amber-800 text-xs">
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Rural offline cache mode active. Data will sync once network returns.</span>
            </div>
            <button
              onClick={() => onNavigate('offline')}
              className="text-amber-900 font-bold underline hover:no-underline"
            >
              View Sync Store
            </button>
          </div>
        )}

        {/* Hero Welcome Card */}
        <div className="portal-hero bg-[#0f766e] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 border border-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {tr('verifiedBeneficiary')}
                </span>
                <span className="text-indigo-200 text-xs font-medium">PM-AJAY Sangamner Cluster</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1 tracking-tight">{beneficiary.name}</h1>
              <p className="text-xs md:text-sm text-indigo-100 flex items-center gap-2 mt-1.5">
                <span>📍 {beneficiary.location.town}, {beneficiary.location.district}</span>
                <span>•</span>
                <span>{beneficiary.livelihood.occupation} ({beneficiary.livelihood.experienceYears} Years Exp)</span>
              </p>
            </div>

            {/* Quick Metrics Bar on Desktop */}
            <div className="flex items-center gap-3">
              <div className="bg-black/20 backdrop-blur-sm px-4 py-3 rounded-2xl text-center border border-white/10 min-w-24">
                <span className="text-[10px] text-indigo-200 font-medium block">{tr('completeness')}</span>
                <span className="text-base font-extrabold text-emerald-300">{beneficiary.profileCompleteness}%</span>
              </div>
              <div className="bg-black/20 backdrop-blur-sm px-4 py-3 rounded-2xl text-center border border-white/10 min-w-24">
                <span className="text-[10px] text-indigo-200 font-medium block">{tr('rplStatus')}</span>
                <span className="text-base font-extrabold text-amber-300">{tr('fastTrack')}</span>
              </div>
              <button
                onClick={() => onNavigate('profile')}
                className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                title={tr('viewProfile')}
              >
                <User className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Voice Assistant Trigger Banner */}
        <motion.div
          whileHover={{ scale: 1.008 }}
          whileTap={{ scale: 0.992 }}
          onClick={() => onNavigate('voice_conversation')}
          className="portal-feature-card bg-white border border-[#b8e6df] hover:border-[#0f766e] p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Mic className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm md:text-base">{tr('voiceInterview')}</h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AI Voice Ready
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                "मला माझ्या शिवणकाम व्यवसायासाठी नवीन प्रशिक्षण आणि स्थानिक ऑर्डर्स हव्यात..."
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs shrink-0">
            <span className="hidden sm:inline">{tr('startConversation')}</span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </motion.div>

        {/* Feature Navigation Grid (Responsive 2 to 3 columns) */}
        <div>
          <h2 className="text-sm font-bold text-[#19324d] tracking-tight mb-3 px-1">
            Livelihood Intelligence Pipeline
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Skill DNA */}
            <button
              onClick={() => onNavigate('skill_dna')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{tr('skillDnaTitle')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tr('skillDnaDesc')}</p>
              </div>
            </button>

            {/* Skill Gap */}
            <button
              onClick={() => onNavigate('skill_gap')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{tr('skillGapTitle')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tr('skillGapDesc')}</p>
              </div>
            </button>

            {/* NSQF Skilling */}
            <button
              onClick={() => onNavigate('training')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{tr('trainingTitle')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tr('trainingDesc')}</p>
              </div>
            </button>

            {/* Local Opportunities */}
            <button
              onClick={() => onNavigate('opportunities')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{tr('opportunitiesTitle')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tr('opportunitiesDesc')}</p>
              </div>
            </button>

            {/* Cluster Map */}
            <button
              onClick={() => onNavigate('map')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Map className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{tr('mapTitle')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tr('mapDesc')}</p>
              </div>
            </button>

            {/* 90-Day Action Plan */}
            <button
              onClick={() => onNavigate('action_plan')}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-400 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{tr('actionPlanTitle')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{tr('actionPlanDesc')}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom 2-Column Section on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-3.5">
            <Award className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">PM-AJAY GIA Component Benefits</h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Eligible for 100% sponsored NSQF training, tool-kit grant assistance, and seed capital linkage under PM-AJAY Grant-in-Aid.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{tr('actionOnTrack')}</h4>
                <p className="text-xs text-slate-500">1 of 10 milestones completed</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('action_plan')}
              className="text-xs font-bold text-indigo-600 hover:underline"
            >
              {tr('viewPlan')} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

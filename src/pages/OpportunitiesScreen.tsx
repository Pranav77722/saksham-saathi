import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  MapPin, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  IndianRupee, 
  Building2, 
  Home, 
  Users,
  Check
} from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { demoOpportunities } from '../data/opportunities';
import { Opportunity, OpportunityType } from '../types/models';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface OpportunitiesScreenProps {
  onNext: () => void;
}

export default function OpportunitiesScreen({ onNext }: OpportunitiesScreenProps) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [appliedOpps, setAppliedOpps] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const filteredOpps = demoOpportunities.filter(opp => {
    if (selectedType === 'all') return true;
    return opp.type === selectedType;
  });

  const handleApply = (opp: Opportunity) => {
    if (!appliedOpps.includes(opp.id)) {
      setAppliedOpps(prev => [...prev, opp.id]);
      setToastMessage(`Application submitted for "${opp.title}"! Local GIA facilitator notified.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }
  };

  const getTypeBadge = (type: OpportunityType) => {
    switch (type) {
      case 'self_employment':
        return {
          icon: <Home className="w-3.5 h-3.5 text-emerald-600" />,
          label: 'Self-Employment / Micro-Enterprise',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      case 'wage_employment':
        return {
          icon: <Briefcase className="w-3.5 h-3.5 text-blue-600" />,
          label: 'Wage Employment',
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'enterprise':
        return {
          icon: <Building2 className="w-3.5 h-3.5 text-purple-600" />,
          label: 'Business Partnership',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'shg':
        return {
          icon: <Users className="w-3.5 h-3.5 text-amber-600" />,
          label: 'SHG Collective',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        };
      default:
        return {
          icon: <Briefcase className="w-3.5 h-3.5 text-slate-600" />,
          label: 'Opportunity',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 inset-x-4 z-50 max-w-md mx-auto bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <p className="text-sm font-medium">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-4 pt-6 pb-5 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">💼</span>
              <div>
                <h1 className="font-extrabold text-lg md:text-xl leading-tight">{tr('opportunitiesTitle')}</h1>
                <p className="text-emerald-200 text-xs">स्थानिक उपजीविका आणि रोजगार संधी • PM-AJAY GIA</p>
              </div>
            </div>
            <span className="bg-emerald-600/70 border border-emerald-400/40 text-emerald-100 text-xs px-3 py-1 rounded-full font-medium">
              Sangamner Cluster Pilot
            </span>
          </div>
          <p className="text-emerald-100 text-xs mt-1">
            Matched with your skills in {beneficiary.livelihood.occupation} and preferred travel constraint (&le;10 km)
          </p>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === 'all'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/40'
              }`}
            >
              All Opportunities ({demoOpportunities.length})
            </button>
            <button
              onClick={() => setSelectedType('self_employment')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedType === 'self_employment'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/40'
              }`}
            >
              🏡 Self-Employment
            </button>
            <button
              onClick={() => setSelectedType('wage_employment')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedType === 'wage_employment'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/40'
              }`}
            >
              💼 Wage Employment
            </button>
            <button
              onClick={() => setSelectedType('enterprise')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedType === 'enterprise'
                  ? 'bg-white text-emerald-950 font-bold shadow-sm'
                  : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-800/40'
              }`}
            >
              🤝 Enterprise / Boutique
            </button>
          </div>
        </div>
      </div>

      {/* Main Opportunities Grid: Responsive Layout */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpps.map((opp, idx) => {
            const typeBadge = getTypeBadge(opp.type);
            const isApplied = appliedOpps.includes(opp.id);

            return (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="p-4">
                  {/* Badge Row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 ${typeBadge.badgeClass}`}>
                        {typeBadge.icon}
                        {typeBadge.label}
                      </span>
                      <span className="text-slate-400 text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {opp.distanceKm === 0 ? 'Home-based (0 km)' : `${opp.distanceKm} km`}
                      </span>
                    </div>

                    {/* Match Score */}
                    <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-xl shrink-0">
                      <Sparkles className="w-3.5 h-3.5 fill-emerald-600" />
                      <span className="text-xs font-bold">{opp.matchScore}%</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-sm md:text-base font-bold text-slate-900 leading-snug">
                    {opp.title}
                  </h2>
                  {opp.titleMr && (
                    <p className="text-xs text-slate-500 font-medium mb-1.5">{opp.titleMr}</p>
                  )}

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Salary / Earnings Row */}
                  {opp.salary && (
                    <div className="flex items-center gap-1.5 mt-2.5 text-emerald-800 font-semibold text-xs bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1.5 rounded-lg w-fit">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>Estimated Income: {opp.salary}</span>
                    </div>
                  )}

                  {/* Required Skills */}
                  <div className="mt-3">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                      Skills Mapped:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.map((skill, sIdx) => {
                        const userHasSkill = beneficiary.skills.some(
                          s => s.name.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.name.toLowerCase())
                        );
                        return (
                          <span
                            key={sIdx}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                              userHasSkill
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {userHasSkill ? '✓' : '⚡ Upskill:'} {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* AI Why Matched */}
                {opp.explanation && opp.explanation.length > 0 && (
                  <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 text-xs">
                    <p className="text-[11px] font-semibold text-teal-800 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-600" /> Why this matches you:
                    </p>
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      {opp.explanation.slice(0, 2).map((exp, eIdx) => (
                        <div key={eIdx} className="flex items-center gap-1">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>{exp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button Footer */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    PM-AJAY GIA Aligned
                  </span>

                  <button
                    onClick={() => handleApply(opp)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Interest Expressed
                      </>
                    ) : (
                      <>
                        <span>{opp.type === 'self_employment' ? 'Select Enterprise Path' : 'Connect with Unit'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Step 6 of 8</p>
            <p className="text-sm font-bold text-slate-900">View Geographic Cluster Map</p>
          </div>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
          >
            <span>{tr('nextMap')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

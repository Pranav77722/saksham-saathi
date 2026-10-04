import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Star, 
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { generateRecommendations } from '../services/recommendationService';
import { Qualification } from '../types/models';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface TrainingScreenProps {
  onNext: () => void;
}

export default function TrainingScreen({ onNext }: TrainingScreenProps) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const { trainingRecommendations } = generateRecommendations(beneficiary);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'rpl' | 'short'>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(trainingRecommendations[0]?.qualification.id || null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  const filteredRecs = trainingRecommendations.filter(rec => {
    if (selectedFilter === 'rpl') return rec.rplPossible;
    if (selectedFilter === 'short') return rec.qualification.durationWeeks <= 6;
    return true;
  });

  const handleEnroll = (qual: Qualification) => {
    if (!enrolledCourses.includes(qual.id)) {
      setEnrolledCourses(prev => [...prev, qual.id]);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
              <p className="text-sm font-medium">Training selected! Added to your PM-AJAY pathway.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 pt-6 pb-5 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎓</span>
              <div>
                <h1 className="font-extrabold text-lg md:text-xl leading-tight">{tr('trainingTitle')}</h1>
                <p className="text-blue-200 text-xs">PM-AJAY GIA संरेखित व्यावसायिक प्रशिक्षण अभ्यासक्रम</p>
              </div>
            </div>
            <span className="bg-blue-600/70 border border-blue-400/40 text-blue-100 text-xs px-3 py-1 rounded-full font-medium">
              AI Calibrated • Level 1 to 5
            </span>
          </div>
          <p className="text-blue-100 text-xs mt-1">
            Courses matched to your background in {beneficiary.livelihood.occupation} and preferred travel range (&le;{beneficiary.constraints.find(c => c.type === 'mobility')?.value || 10} km)
          </p>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedFilter === 'all'
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'bg-blue-900/40 text-blue-100 hover:bg-blue-800/40'
              }`}
            >
              <Filter className="w-3 h-3" /> All Recommendations ({trainingRecommendations.length})
            </button>
            <button
              onClick={() => setSelectedFilter('rpl')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedFilter === 'rpl'
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'bg-blue-900/40 text-blue-100 hover:bg-blue-800/40'
              }`}
            >
              ⚡ RPL Eligible (Fast Track)
            </button>
            <button
              onClick={() => setSelectedFilter('short')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedFilter === 'short'
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'bg-blue-900/40 text-blue-100 hover:bg-blue-800/40'
              }`}
            >
              ⏱️ Short Duration (&le;6 wks)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Responsive Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec, idx) => {
            const isSelected = selectedCourseId === rec.qualification.id;
            const isEnrolled = enrolledCourses.includes(rec.qualification.id);

            return (
              <motion.div
                key={rec.qualification.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-xs hover:shadow-md flex flex-col justify-between ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Top Banner */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                        <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded-md border border-blue-200">
                          NSQF Level {rec.qualification.nsqfLevel}
                        </span>
                        {rec.rplPossible && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                            ⚡ RPL Fast-Track
                          </span>
                        )}
                        <span className="text-slate-400 text-[11px] font-medium">
                          {rec.qualification.sector}
                        </span>
                      </div>

                      <h2 className="text-sm font-bold text-slate-900 leading-snug">
                        {rec.qualification.name}
                      </h2>
                      {rec.qualification.nameMr && (
                        <p className="text-xs text-slate-500 font-medium">{rec.qualification.nameMr}</p>
                      )}
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded-xl">
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-600" />
                        <span className="text-xs font-bold">{rec.matchScore}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium mt-0.5">Match</span>
                    </div>
                  </div>

                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{rec.qualification.durationWeeks} Weeks</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Govt. Certified</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{rec.provider?.distanceKm || 2.5} km</span>
                    </div>
                  </div>
                </div>

                {/* Provider Info & Explanation */}
                <div className="bg-slate-50 px-4 py-3 border-t border-slate-100 space-y-2.5">
                  {rec.provider && (
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>{rec.provider.name}</span>
                      </div>
                      {rec.provider.rating && (
                        <div className="flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{rec.provider.rating}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Explanation */}
                  <div className="bg-white rounded-xl p-2.5 border border-slate-200 text-xs text-slate-600">
                    <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" /> Why this matches you:
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                      {rec.explanation.slice(0, 2).map((exp, i) => (
                        <li key={i} className="leading-snug">{exp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-4 py-3 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-400">
                    Stipend & Kit Supported
                  </span>

                  <button
                    onClick={() => handleEnroll(rec.qualification)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isEnrolled
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        Selected
                      </>
                    ) : (
                      <>
                        <span>{tr('selectPathway')}</span>
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
            <p className="text-xs text-slate-500 font-medium">Step 5 of 8</p>
            <p className="text-sm font-bold text-slate-900">Explore Local Opportunities</p>
          </div>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
          >
            <span>{tr('nextOpportunities')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

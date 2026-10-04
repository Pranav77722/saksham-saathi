import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Share2, 
  ChevronRight, 
  TrendingUp, 
  FileCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { generateRecommendations } from '../services/recommendationService';
import { ActionPlanItem } from '../types/models';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface ActionPlanScreenProps {
  onNext: () => void;
}

export default function ActionPlanScreen({ onNext }: ActionPlanScreenProps) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const { actionPlan } = generateRecommendations(beneficiary);

  const [items, setItems] = useState<ActionPlanItem[]>(actionPlan.items);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showShareToast, setShowShareToast] = useState(false);

  const toggleStatus = (id: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const completedCount = items.filter(i => i.status === 'completed').length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const filteredItems = items.filter(item => {
    if (selectedFilter === 'pending') return item.status !== 'completed';
    if (selectedFilter === 'completed') return item.status === 'completed';
    return true;
  });

  const getCategoryBadge = (cat: ActionPlanItem['category']) => {
    switch (cat) {
      case 'profile': return { label: 'Verification', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'training': return { label: 'NSQF Training', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'skill': return { label: 'Digital Upskill', color: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'enterprise': return { label: 'Micro-Enterprise', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'employment': return { label: 'Market Linkage', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default: return { label: 'Task', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Toast Notification */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 inset-x-4 z-50 max-w-md mx-auto bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <p className="text-sm font-medium">90-Day Action Plan saved & ready to share via WhatsApp!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white px-4 pt-6 pb-6 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📋</span>
            <div>
              <h1 className="font-extrabold text-lg md:text-xl leading-tight">{tr('actionPlanTitle')}</h1>
              <p className="text-indigo-200 text-xs">९० दिवसांची वैयक्तिक कार्ययोजना — PM-AJAY GIA Component</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowShareToast(true);
              setTimeout(() => setShowShareToast(false), 3000);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Plan</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Responsive Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (1 of 3): Overall Progress Card */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Implementation Trajectory</h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Quarter 1
                </span>
              </div>

              {/* Progress Ring / Gauge */}
              <div className="text-center py-2">
                <div className="relative w-28 h-28 mx-auto mb-2">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="40" fill="none"
                      stroke="#10b981" strokeWidth="8"
                      strokeDasharray={`${(progressPercent / 100) * 251} 251`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-slate-900">{progressPercent}%</span>
                    <span className="text-[10px] text-slate-400 font-semibold">Complete</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {completedCount} of {items.length} milestones reached
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Target Enterprise Launch:</span>
                  <span className="font-bold text-slate-900">Week 11</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Target Sustainable Income:</span>
                  <span className="font-bold text-emerald-700">₹12,000–₹15,000/mo</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Facilitator Assigned:</span>
                  <span className="font-bold text-slate-900">Ramesh Shinde</span>
                </div>
              </div>
            </div>

            {/* Filter Pills on Desktop */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Filter Milestones</label>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                    selectedFilter === 'all' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Milestones ({items.length})
                </button>
                <button
                  onClick={() => setSelectedFilter('pending')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                    selectedFilter === 'pending' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Pending Milestones ({items.length - completedCount})
                </button>
                <button
                  onClick={() => setSelectedFilter('completed')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                    selectedFilter === 'completed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Right Column (2 of 3): Milestone Checklist */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">90-Day Execution Timeline</h3>

              <div className="space-y-3">
                {filteredItems.map((item, index) => {
                  const isDone = item.status === 'completed';
                  const badge = getCategoryBadge(item.category);

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.04 }}
                      onClick={() => toggleStatus(item.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                        isDone
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      {/* Checkbox Icon */}
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 focus:outline-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(item.id);
                        }}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Week {item.week}
                          </span>
                        </div>

                        <h3 className={`text-xs md:text-sm font-bold leading-tight ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.title}
                        </h3>
                        {item.titleMr && (
                          <p className="text-xs text-slate-400 font-medium">{item.titleMr}</p>
                        )}

                        <p className={`text-xs mt-1 leading-relaxed ${isDone ? 'text-slate-400' : 'text-slate-600'}`}>
                          {item.description}
                        </p>
                      </div>

                      {/* Status Indicator */}
                      <div className="shrink-0 self-center">
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
                          isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isDone ? 'Done' : 'To Do'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Pipeline Complete</p>
            <p className="text-sm font-bold text-slate-900">Enter Beneficiary Dashboard</p>
          </div>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
          >
            <span>{tr('finishHome')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

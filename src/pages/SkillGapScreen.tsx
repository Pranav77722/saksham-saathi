import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, AlertCircle, PlusCircle, Lightbulb, Target } from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { analyzeSkillGap } from '../services/recommendationService';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function SkillGapScreen({ onNext }: { onNext: () => void }) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const skillGap = analyzeSkillGap(beneficiary, 'Tailoring Micro-Enterprise');

  const statusConfig = {
    ready: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Ready', barColor: 'bg-emerald-500' },
    upskill: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Upskill', barColor: 'bg-amber-500' },
    new_skill: { icon: PlusCircle, color: 'text-rose-600', bg: 'bg-rose-50', label: 'New Skill', barColor: 'bg-rose-500' },
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 px-4 py-6 text-white shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🎯</span>
              <h1 className="font-extrabold text-lg md:text-xl">{tr('skillGapTitle')}</h1>
            </div>
            <p className="text-indigo-200 text-xs">
              कौशल्य अंतर विश्लेषण — Objective mapping between current abilities and target enterprise requirements
            </p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-800/80 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs">
            <Target className="w-4 h-4 text-indigo-300" />
            <span>Target: <strong className="text-white">{skillGap.targetOccupation}</strong></span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column (1 of 3): Overall Readiness & RPL Notice */}
          <div className="space-y-4 lg:col-span-1">
            {/* Overall Readiness Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center"
            >
              <h3 className="font-bold text-slate-900 text-sm mb-3">Overall Enterprise Readiness</h3>

              <div className="relative w-28 h-28 mx-auto mb-3">
                <svg className="w-28 h-28 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke="#4f46e5" strokeWidth="8"
                    strokeDasharray={`${(skillGap.overallReadiness / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-indigo-700">{skillGap.overallReadiness}%</span>
                  <span className="text-[10px] text-slate-400 font-medium">Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 mt-4 pt-4 border-t border-slate-100 text-xs">
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  <span className="block font-bold text-emerald-700 text-sm">{skillGap.readySkills.length}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Ready</span>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                  <span className="block font-bold text-amber-700 text-sm">{skillGap.upskillNeeded.length}</span>
                  <span className="text-[10px] text-amber-600 font-semibold">Upskill</span>
                </div>
                <div className="bg-rose-50 p-2 rounded-xl border border-rose-100">
                  <span className="block font-bold text-rose-700 text-sm">{skillGap.newSkillsNeeded.length}</span>
                  <span className="text-[10px] text-rose-600 font-semibold">New</span>
                </div>
              </div>
            </motion.div>

            {/* RPL Advantage Card */}
            {skillGap.rplEligible && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 shadow-xs"
              >
                <div className="flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs">Recognition of Prior Learning (RPL)</h4>
                    <p className="text-indigo-800 text-[11px] mt-1 leading-relaxed">
                      You already meet <strong>{skillGap.readySkills.length} core technical requirements</strong>. You only need short modular courses for Digital Payments & Pricing.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column (2 of 3): Detailed Skill Gap Matrix */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Target Competency Gap Breakdown</h3>
                  <p className="text-xs text-slate-500">Skills required to launch an independent tailoring unit</p>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{skillGap.gaps.length} Items</span>
              </div>

              <div className="space-y-3">
                {skillGap.gaps.map((item, i) => {
                  const cfg = statusConfig[item.status];
                  const Icon = cfg.icon;

                  return (
                    <motion.div
                      key={item.skillName}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${cfg.color} shrink-0`} />
                          <span className="font-bold text-slate-800 text-xs">{item.skillName}</span>
                          {item.required && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.2 rounded">
                              Required
                            </span>
                          )}
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </div>

                      {/* Progress Bar comparison */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                          <span>Current: {item.currentLevel}%</span>
                          <span>Target: {item.targetLevel}%</span>
                        </div>
                        <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden relative">
                          {/* Target marker */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-400 z-10"
                            style={{ left: `${item.targetLevel}%` }}
                          />
                          {/* Current bar */}
                          <div
                            className={`h-full rounded-full ${cfg.barColor}`}
                            style={{ width: `${item.currentLevel}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Step 4 of 8</p>
            <p className="text-sm font-bold text-slate-900">Explore NSQF Skilling Pathways</p>
          </div>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
          >
            <span>{tr('nextTraining')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

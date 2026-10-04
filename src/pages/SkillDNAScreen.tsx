import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Lightbulb, Zap, Award, Sparkles, Compass } from 'lucide-react';
import { getDemoBeneficiary } from '../data/beneficiaries';
import { generateSkillDNA, getCareerPathways } from '../services/skillDNAService';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function SkillDNAScreen({ onNext }: { onNext: () => void }) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const beneficiary = getDemoBeneficiary();
  const skillDNA = generateSkillDNA(beneficiary);
  const pathways = getCareerPathways(skillDNA);
  const [showTransferable, setShowTransferable] = useState(false);

  // Build all skill bars
  const allSkills = [
    ...skillDNA.technicalSkills.map(s => ({ ...s, color: 'bg-indigo-600' })),
    ...skillDNA.traditionalSkills.map(s => ({ ...s, color: 'bg-amber-600' })),
    ...skillDNA.softSkills.map(s => ({ ...s, color: 'bg-emerald-600' })),
    ...skillDNA.digitalSkills.map(s => ({ ...s, color: 'bg-sky-600' })),
  ];

  const readinessMetrics = [
    { label: 'Digital Readiness', labelMr: 'डिजिटल तयारी', value: skillDNA.digitalReadiness, color: 'text-sky-600', bg: 'bg-sky-500' },
    { label: 'Business Readiness', labelMr: 'व्यवसाय तयारी', value: skillDNA.businessReadiness, color: 'text-amber-600', bg: 'bg-amber-500' },
    { label: 'Entrepreneurial', labelMr: 'उद्योजकता', value: skillDNA.entrepreneurialReadiness, color: 'text-emerald-600', bg: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 px-4 py-6 text-white shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧬</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg md:text-xl">{tr('skillDnaTitle')}</h1>
                <span className="bg-white/20 border border-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AI Synthesized
                </span>
              </div>
              <p className="text-indigo-200 text-xs mt-0.5">
                Calibrated from {beneficiary.livelihood.experienceYears} years of practical {beneficiary.livelihood.occupation} experience in {beneficiary.location.town}
              </p>
            </div>
          </div>

          {beneficiary.livelihood.experienceYears >= 2 && (
            <div className="bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-emerald-300" />
              <span>RPL Recognition Eligible</span>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Responsive Body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-6xl w-full mx-auto space-y-5">
        {/* Prior Learning Recognition Banner */}
        {beneficiary.livelihood.experienceYears >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 text-sm">Prior Informal Experience Recognized (RPL)</p>
                <p className="text-emerald-800 text-xs mt-0.5 leading-relaxed">
                  Your {beneficiary.livelihood.experienceYears} years of existing tailoring practice means you do not need to start from zero. PM-AJAY Recognition of Prior Learning will award direct credit and fast-track your NSQF Level 4 certification.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column: Skill Bars & Transferable Skills */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Competency Spectrum / कौशल्य प्रोफाइल</h3>
                <span className="text-xs text-slate-400 font-semibold">{allSkills.length} Mapped Skills</span>
              </div>

              <div className="space-y-3.5">
                {allSkills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-700">
                        {skill.name} {skill.nameMr && <span className="text-slate-400 font-normal">({skill.nameMr})</span>}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{Math.round(skill.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${skill.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.confidence * 100}%` }}
                        transition={{ delay: i * 0.05 + 0.2, duration: 0.7 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                      <span className="capitalize">{skill.category}</span>
                      <span className="font-semibold text-indigo-600">{skill.proficiency}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Transferable Skills Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Transferable Capabilities
                </h3>
                <button
                  onClick={() => setShowTransferable(!showTransferable)}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  {showTransferable ? 'Show Less' : 'View Cross-Industry Fit'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {skillDNA.transferableCapabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs px-2.5 py-1 rounded-xl font-medium"
                  >
                    {cap.name}
                  </span>
                ))}
              </div>

              {showTransferable && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  {skillDNA.transferableCapabilities.map((cap, i) => (
                    <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800">{cap.name}: </span>
                      <span className="text-slate-500">Derived from {cap.derivedFrom}. Applicable to: {cap.applicableTo.join(', ')}.</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Readiness Assessment & Career Pathways */}
          <div className="space-y-4">
            {/* Readiness Gauges */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-4">Enterprise Readiness Dimensions</h3>
              <div className="grid grid-cols-3 gap-3">
                {readinessMetrics.map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-center p-3 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                        <circle
                          cx="32" cy="32" r="28" fill="none"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeDasharray={`${(metric.value / 100) * 176} 176`}
                          strokeLinecap="round"
                          className={metric.color}
                        />
                      </svg>
                      <span className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold ${metric.color}`}>
                        {metric.value}%
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{metric.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{metric.labelMr}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Career Pathways Recommendation */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-purple-600" /> NSQF Career Progression Pathways
              </h3>
              <div className="space-y-3">
                {pathways.map((pathway, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">
                        Pathway {idx + 1}: {pathway[0]} → {pathway[pathway.length - 1]}
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                        NSQF Aligned
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {pathway.map((step, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                            sIdx === 0
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold'
                              : sIdx === pathway.length - 1
                              ? 'bg-indigo-600 text-white font-bold'
                              : 'bg-white text-slate-700 border border-slate-200'
                          }`}>
                            {step}
                          </span>
                          {sIdx < pathway.length - 1 && (
                            <span className="text-slate-400 font-bold">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">Step 3 of 8</p>
            <p className="text-sm font-bold text-slate-900">Analyze Skill Gaps & Readiness</p>
          </div>
          <button
            onClick={onNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 text-sm transition-all"
          >
            <span>{tr('nextSkillGap')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

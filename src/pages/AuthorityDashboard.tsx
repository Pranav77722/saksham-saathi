import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Download, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';
import { 
  demoOutcomeFunnel, 
  demoSkillDemand, 
  demoTrainingMismatches, 
  demoPlacementGap, 
  demoDistrictData 
} from '../data/analytics';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function AuthorityDashboard() {
  const { state, setState } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const [selectedDistrict, setSelectedDistrict] = useState('Ahmednagar');
  const [exportToast, setExportToast] = useState(false);

  const funnelData = [
    { stage: 'Voice Intake', count: demoOutcomeFunnel.registered, fill: '#4f46e5' },
    { stage: 'Skill DNA', count: demoOutcomeFunnel.profileCompleted, fill: '#6366f1' },
    { stage: 'Enrolled', count: demoOutcomeFunnel.trainingEnrolled, fill: '#0284c7' },
    { stage: 'Completed', count: demoOutcomeFunnel.trainingCompleted, fill: '#059669' },
    { stage: 'Employed / Enterprise', count: demoOutcomeFunnel.employmentMatched, fill: '#10b981' },
    { stage: '90-Day Sustained', count: demoOutcomeFunnel.ninetyDayOutcome, fill: '#047857' },
  ];

  const pieColors = ['#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#64748b'];

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 3000);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-100">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏛️</span>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                PM-AJAY GIA INTELLIGENCE DASHBOARD
              </span>
              <span className="text-[10px] text-amber-400 font-medium">
                Ministry of Social Justice & Empowerment • Government of India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </button>

            {/* Role Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setState(prev => ({ ...prev, currentPage: 'home', role: 'beneficiary' }))}
                className="px-2 py-1 rounded text-slate-300 hover:text-white font-medium text-[11px]"
              >
                {tr('beneficiary')}
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, currentPage: 'field_worker', role: 'field_worker' }))}
                className="px-2 py-1 rounded text-slate-300 hover:text-white font-medium text-[11px]"
              >
                {tr('fieldWorker')}
              </button>
              <button
                className="px-2 py-1 rounded bg-indigo-600 text-white font-semibold text-[11px]"
              >
                {tr('authority')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Export Toast Notification */}
      {exportToast && (
        <div className="fixed top-14 right-4 z-50 bg-emerald-800 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold">
          <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
          <span>PM-AJAY_GIA_Quarterly_Livelihood_Report.xlsx exported!</span>
        </div>
      )}

      {/* Subheader Filters */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-700">Filter Region:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="Ahmednagar">Ahmednagar District (Cluster Pilot)</option>
              <option value="Pune">Pune District</option>
              <option value="Nashik">Nashik District</option>
              <option value="Solapur">Solapur District</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
              Live Synced: 2,450 Beneficiaries
            </span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="flex-1 overflow-y-auto max-w-6xl w-full mx-auto p-4 space-y-4">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Voice Profiled</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {demoOutcomeFunnel.registered.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 80.8% profile completion rate
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>NSQF Enrolled</span>
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {demoOutcomeFunnel.trainingEnrolled.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-600 font-semibold mt-1">
              92.5% training graduation rate
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Livelihood Matched</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-2">
              {demoOutcomeFunnel.employmentMatched.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">
              Wage & Micro-Enterprises
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>90-Day Sustained Outcome</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-900 mt-2">
              {demoOutcomeFunnel.ninetyDayOutcome.toLocaleString()}
            </div>
            <div className="text-[11px] text-purple-600 font-semibold mt-1">
              Tracked income growth verified
            </div>
          </div>
        </div>

        {/* Charts Section: Funnel & Skill Demand */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Progression Funnel */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">PM-AJAY Livelihood Pipeline Funnel</h3>
                <p className="text-xs text-slate-500">From Conversational Voice Intake to 90-Day Sustained Outcome</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip formatter={(value) => [value, 'Beneficiaries']} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Skill Demand Heatmap */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Beneficiary Skill Distribution</h3>
                <p className="text-xs text-slate-500">Aspirations mapped through natural voice conversation</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demoSkillDemand} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <XAxis dataKey="skill" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`${value} beneficiaries`, 'Volume']} />
                  <Bar dataKey="demandCount" fill="#0284c7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Intelligence Insights: Training Capacity Mismatch & Placement Dropoff */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Mismatch Alerts */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900">Training Capacity vs Demand Mismatches</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Identifies courses where local beneficiary demand exceeds allocated PM-AJAY training seats.
            </p>

            <div className="space-y-2.5">
              {demoTrainingMismatches.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{item.skill}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Demand: <span className="font-semibold text-slate-800">{item.demand}</span> • Allocated Seats: <span className="font-semibold text-slate-800">{item.availableSeats}</span>
                    </p>
                  </div>

                  <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-1 rounded-lg text-xs">
                    +{item.gap} Seat Deficit
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Gap Root Causes */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Placement Gap Analysis ({demoPlacementGap.gap} Trainees)</h3>
                <p className="text-xs text-slate-500">Root causes identified when trained beneficiaries aren't placed</p>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demoPlacementGap.causes}
                    dataKey="count"
                    nameKey="cause"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    label={({ name, percent }: any) => `${(name || '').split(' ')[0]} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {demoPlacementGap.causes.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <span>Location Mismatch: 30%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>Skill Disparity: 20%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>Salary Expectations: 17%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
                <span>Mobility Constraints: 14%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

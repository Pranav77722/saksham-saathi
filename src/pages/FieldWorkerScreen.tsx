import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Mic, 
  Plus, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  MapPin, 
  Dna, 
  Search, 
  ChevronRight,
  UserCheck,
  Smartphone
} from 'lucide-react';
import { demoBeneficiaries } from '../data/beneficiaries';
import { Beneficiary } from '../types/models';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

interface FieldWorkerScreenProps {
  onNavigate: (page: string) => void;
}

export default function FieldWorkerScreen({ onNavigate }: FieldWorkerScreenProps) {
  const { state } = useApp();
  const tr = (key: string) => translate(state.language, key);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(demoBeneficiaries);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBenName, setNewBenName] = useState('');
  const [newBenTrade, setNewBenTrade] = useState('Tailoring');

  const filteredBeneficiaries = beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.livelihood.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.town.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncComplete(true);
      setTimeout(() => setSyncComplete(false), 3000);
    }, 1500);
  };

  const handleAddBeneficiary = () => {
    if (!newBenName.trim()) return;
    const newBen: Beneficiary = {
      id: `ben-00${beneficiaries.length + 1}`,
      name: newBenName,
      age: 26,
      gender: 'female',
      phone: '9822334455',
      language: 'mr',
      location: {
        state: 'Maharashtra',
        district: 'Ahmednagar',
        town: 'Sangamner',
      },
      education: { level: '10th Pass' },
      livelihood: {
        occupation: newBenTrade,
        employmentStatus: 'self_employed',
        experienceYears: 2,
        incomeRange: '₹4,000–₹6,000/month',
      },
      skills: [
        { id: 's-new', name: newBenTrade, category: 'technical', confidence: 0.85, proficiency: 'Intermediate', source: 'voice' }
      ],
      aspiration: {
        desiredOccupation: `${newBenTrade} Enterprise`,
        employmentPreference: 'self_employment',
        interests: [newBenTrade],
      },
      constraints: [
        { type: 'mobility', description: 'Prefers within 10 km', value: 10 }
      ],
      profileCompleteness: 45,
      registeredAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    setBeneficiaries([newBen, ...beneficiaries]);
    setNewBenName('');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Top Bar with Mode Switcher */}
      <header className="bg-slate-900 text-white px-4 py-3 border-b border-slate-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <div>
              <span className="font-extrabold text-sm text-white">SAKSHAM SAATHI</span>
              <span className="text-[10px] text-amber-400 block font-medium">Field Facilitator Portal</span>
            </div>
          </div>

          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => onNavigate('home')}
              className="px-2 py-1 rounded text-slate-300 hover:text-white font-medium text-[11px]"
            >
              {tr('beneficiary')}
            </button>
            <button
              onClick={() => onNavigate('field_worker')}
              className="px-2 py-1 rounded bg-indigo-600 text-white font-semibold text-[11px]"
            >
              {tr('fieldWorker')}
            </button>
            <button
              onClick={() => onNavigate('authority')}
              className="px-2 py-1 rounded text-slate-300 hover:text-white font-medium text-[11px]"
            >
              {tr('authority')}
            </button>
          </div>
        </div>
      </header>

      {/* Facilitator Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 pt-5 pb-5 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-200 font-medium">Assisted Intake & Rural Mobilization</p>
              <h1 className="text-lg font-bold">Ramesh Shinde (Facilitator ID: FW-702)</h1>
              <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-blue-300" /> Sangamner Taluka, Ahmednagar
              </p>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : syncComplete ? 'Synced!' : 'Sync Records'}</span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-blue-600/40">
            <div className="bg-blue-900/30 p-2 rounded-xl text-center">
              <span className="text-[10px] text-blue-200 block">Assigned Beneficiaries</span>
              <span className="text-sm font-bold text-white">{beneficiaries.length}</span>
            </div>
            <div className="bg-blue-900/30 p-2 rounded-xl text-center">
              <span className="text-[10px] text-blue-200 block">Verified Profiles</span>
              <span className="text-sm font-bold text-emerald-300">2</span>
            </div>
            <div className="bg-blue-900/30 p-2 rounded-xl text-center">
              <span className="text-[10px] text-blue-200 block">Pending Offline</span>
              <span className="text-sm font-bold text-amber-300">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Beneficiary List */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-4 space-y-4">
        {/* Search & Add Action Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, trade, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Beneficiary</span>
          </button>
        </div>

        {/* Beneficiaries Cards */}
        <div className="space-y-3">
          {filteredBeneficiaries.map((ben, idx) => (
            <motion.div
              key={ben.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700">
                    {ben.gender === 'female' ? '👩' : '👨'}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{ben.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <span>{ben.livelihood.occupation}</span>
                      <span>•</span>
                      <span>{ben.location.town}</span>
                      <span>•</span>
                      <span>{ben.phone}</span>
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  ben.profileCompleteness >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {ben.profileCompleteness}% Complete
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">
                  {ben.skills.length} skills mapped
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('skill_dna')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Dna className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Skill DNA</span>
                  </button>

                  <button
                    onClick={() => onNavigate('voice_conversation')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Voice Intake</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-base text-slate-900">Add New Beneficiary</h3>
              <p className="text-xs text-slate-500">
                Quick entry for offline field mobilization in PM-AJAY Sangamner cluster.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Anjali Shinde"
                    value={newBenName}
                    onChange={(e) => setNewBenName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Primary Trade</label>
                  <select
                    value={newBenTrade}
                    onChange={(e) => setNewBenTrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Tailoring">Tailoring</option>
                    <option value="Electrical Repair">Electrical Repair</option>
                    <option value="Handicrafts">Handicrafts</option>
                    <option value="Food Processing">Food Processing</option>
                    <option value="Agriculture">Modern Agriculture</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBeneficiary}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  Save & Launch Voice Intake
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

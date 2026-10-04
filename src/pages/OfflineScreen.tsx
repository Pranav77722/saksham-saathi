import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WifiOff, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  HardDrive, 
  ArrowLeft, 
  CloudOff,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface OfflineScreenProps {
  onRetry: () => void;
}

export default function OfflineScreen({ onRetry }: OfflineScreenProps) {
  const { state, setState } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'failed'>('idle');

  const cachedItems = [
    { type: 'Voice Audio Snippets', count: '4 recordings', size: '2.4 MB', status: 'Ready to sync' },
    { type: 'Extracted Skill Profiles', count: '3 beneficiaries', size: '42 KB', status: 'Queued' },
    { type: 'Local Opportunity Database', count: 'Sangamner cluster', size: '180 KB', status: 'Cached locally' },
    { type: 'NSQF Course Catalog', count: 'Level 1–5 offline pack', size: '540 KB', status: 'Cached locally' },
  ];

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      setState(prev => ({ ...prev, isOnline: true }));
      setTimeout(() => {
        onRetry();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white px-4 pt-6 pb-6 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={onRetry}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="font-bold text-base">Offline Sync Center</h1>
            <p className="text-xs text-amber-200">स्थानिक ऑफलाइन डेटा व सिंक्रोनायझेशन</p>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Status Card */}
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-4 border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-200">
              <CloudOff className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Rural Offline Mode Active</p>
              <p className="text-xs text-amber-200">Voice transcription running on local cache</p>
            </div>
          </div>

          <span className="bg-amber-900/60 border border-amber-400/40 text-amber-100 text-xs px-2.5 py-1 rounded-full font-medium">
            IndexedDB Store
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-2xl w-full mx-auto">
        {/* Offline Capability Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Zero-Connectivity Architecture</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In remote SC habitations with poor telecom connectivity, Saksham Saathi stores audio recordings and AI profiling inferences entirely in local device storage. Once connectivity is restored, all data automatically synchronizes with the central PM-AJAY portal.
          </p>
        </div>

        {/* Cached Items Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" /> Locally Stored Datasets
          </h3>

          <div className="space-y-2.5">
            {cachedItems.map((item, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900">{item.type}</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {item.count} • <span className="font-medium text-slate-700">{item.size}</span>
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium px-2 py-0.5 rounded-md text-[11px]">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Sync Action Area */}
        <div className="pt-2">
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Connecting to Central PM-AJAY Portal...' : syncStatus === 'success' ? 'Sync Completed!' : 'Sync When Online Now'}</span>
          </button>

          <button
            onClick={onRetry}
            className="w-full mt-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-2xl text-xs transition-colors"
          >
            {state.language === 'mr' ? 'ऑफलाइन काम सुरू ठेवा' : state.language === 'hi' ? 'ऑफलाइन काम जारी रखें' : 'Continue Working Offline'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, UserCircle, Briefcase, BarChart3, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types/models';
import { useApp } from '../context/AppContext';
import { translate } from '../i18n';

export default function LoginScreen({ onLogin }: { onLogin: (role: UserRole) => void }) {
  const { state } = useApp();
  const tr = (key: Parameters<typeof translate>[1]) => translate(state.language, key);
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [role, setRole] = useState<UserRole>('beneficiary');

  const handleSendOTP = () => {
    if (phone.length >= 10) setStep('otp');
  };

  const handleVerify = () => {
    if (otp === '123456' || otp.length === 6) onLogin(role);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50 md:p-8">
      <div className="w-full max-w-lg bg-white md:rounded-3xl md:shadow-xl md:border md:border-slate-200/80 overflow-hidden flex flex-col min-h-dvh md:min-h-0">
        <div className="flex-1 px-6 pt-10 pb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Phone className="w-7 h-7 text-indigo-600" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-1">{tr('selectPersona')}</h1>
              <p className="text-slate-500 text-xs">PM-AJAY GIA Prototype Demonstration</p>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{tr('selectPersona')}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { r: 'beneficiary' as UserRole, icon: UserCircle, label: 'Beneficiary', desc: 'Sunita (Tailoring)' },
                  { r: 'field_worker' as UserRole, icon: Briefcase, label: 'Field Worker', desc: 'Mobilizer / GIA' },
                  { r: 'authority' as UserRole, icon: BarChart3, label: 'Authority', desc: 'Ministry / State' },
                ].map(({ r, icon: Icon, label, desc }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 px-2 rounded-2xl text-xs font-medium flex flex-col items-center gap-1.5 border-2 transition-all ${
                      role === r ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs' : 'border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-indigo-600" />
                    <span className="font-bold text-xs">{label}</span>
                    <span className="text-[10px] text-slate-400 text-center leading-tight">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {step === 'phone' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">{tr('mobileNumber')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-sm font-semibold bg-slate-50 border border-slate-200 h-12 px-3.5 rounded-xl flex items-center">+91</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="flex-1 h-12 bg-white border border-slate-200 rounded-xl px-4 text-sm font-medium focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-200"
                >
                  <span>{tr('sendOtp')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">Enter Verification Code</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.slice(0, 6))}
                    placeholder="Enter 6-digit OTP (demo: 123456)"
                    className="w-full h-12 bg-white border border-slate-200 rounded-xl px-4 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 text-center">Demo OTP is prefilled: 123456</p>
                </div>

                <button
                  onClick={handleVerify}
                  className="w-full h-13 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-200"
                >
                  {tr('verifyEnter')}
                </button>
              </motion.div>
            )}

            {/* Quick Demo Bypass for Hackathon Judges */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 mb-2">Evaluator Fast-Pass</p>
              <button
                onClick={() => onLogin(role)}
                className="w-full py-2.5 px-4 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors"
              >
                ⚡ Instant Login as {role === 'beneficiary' ? 'Sunita Jadhav' : role === 'field_worker' ? 'Field Facilitator' : 'PM-AJAY Authority'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

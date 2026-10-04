import React, { useEffect, useState } from 'react';
import './index.css';
import { useApp, AppContext, defaultState, AppState } from './context/AppContext';
import { Home, UserRound } from 'lucide-react';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';

// ---------- Pages ----------
import SplashScreen from './pages/SplashScreen';
import WelcomeScreen from './pages/WelcomeScreen';
import LanguageScreen from './pages/LanguageScreen';
import LoginScreen from './pages/LoginScreen';
import VoiceIntroScreen from './pages/VoiceIntroScreen';
import VoiceConversationScreen from './pages/VoiceConversationScreen';
import ConversationConfirmScreen from './pages/ConversationConfirmScreen';
import AIProcessingScreen from './pages/AIProcessingScreen';
import SkillDNAScreen from './pages/SkillDNAScreen';
import SkillGapScreen from './pages/SkillGapScreen';
import TrainingScreen from './pages/TrainingScreen';
import OpportunitiesScreen from './pages/OpportunitiesScreen';
import MapScreen from './pages/MapScreen';
import ActionPlanScreen from './pages/ActionPlanScreen';
import ProfileScreen from './pages/ProfileScreen';
import HomeScreen from './pages/HomeScreen';
import FieldWorkerScreen from './pages/FieldWorkerScreen';
import AuthorityDashboard from './pages/AuthorityDashboard';
import OfflineScreen from './pages/OfflineScreen';

function MobileBottomNav({
  currentPage,
  language,
  onNavigate,
  className = '',
}: {
  currentPage: string;
  language: string;
  onNavigate: (page: string) => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const isHome = currentPage === 'home';
  const isProfile = currentPage === 'profile';

  return (
    <nav className={`mobile-bottom-nav ${className}`} aria-label="Mobile navigation">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        aria-current={isHome ? 'page' : undefined}
        className={isHome ? 'mobile-bottom-nav__item mobile-bottom-nav__item--active' : 'mobile-bottom-nav__item'}
      >
        <Home className="w-5 h-5" />
        <span>{t('home', { lng: language })}</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate('profile')}
        aria-current={isProfile ? 'page' : undefined}
        className={isProfile ? 'mobile-bottom-nav__item mobile-bottom-nav__item--active' : 'mobile-bottom-nav__item'}
      >
        <UserRound className="w-5 h-5" />
        <span>{t('profile', { lng: language })}</span>
      </button>
    </nav>
  );
}

function App() {
  const { t } = useTranslation();
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    i18n.changeLanguage(state.language);
    document.documentElement.lang = state.language;
  }, [state.language]);

  const navigate = (page: string) => setState(prev => ({ ...prev, currentPage: page }));

  const PIPELINE_STEPS = [
    { id: 'voice_conversation', label: '1. Voice', icon: '🎙️' },
    { id: 'conversation_confirm', label: '2. Confirm', icon: '📋' },
    { id: 'skill_dna', label: '3. Skill DNA', icon: '🧬' },
    { id: 'skill_gap', label: '4. Skill Gap', icon: '🎯' },
    { id: 'training', label: '5. NSQF Courses', icon: '🎓' },
    { id: 'opportunities', label: '6. Opportunities', icon: '💼' },
    { id: 'map', label: '7. Cluster Map', icon: '🗺️' },
    { id: 'action_plan', label: '8. 90-Day Plan', icon: '📅' },
    { id: 'home', label: 'Dashboard', icon: '🏠' },
  ];

  const renderPage = () => {
    switch (state.currentPage) {
      case 'splash': return <SplashScreen onNext={() => navigate('welcome')} />;
      case 'welcome': return <WelcomeScreen onNext={() => navigate('login')} />;
      case 'language': return <LanguageScreen onSelect={(lang) => { i18n.changeLanguage(lang); setState(p => ({ ...p, language: lang })); navigate('splash'); }} />;
      case 'login': return <LoginScreen onLogin={(role) => { setState(p => ({ ...p, isLoggedIn: true, role })); navigate(role === 'authority' ? 'authority' : role === 'field_worker' ? 'field_worker' : 'voice_intro'); }} />;
      case 'voice_intro': return <VoiceIntroScreen onStart={() => navigate('voice_conversation')} />;
      case 'voice_conversation': return <VoiceConversationScreen onComplete={() => navigate('conversation_confirm')} language={state.language} />;
      case 'conversation_confirm': return <ConversationConfirmScreen onConfirm={() => navigate('ai_processing')} onEdit={() => navigate('profile')} />;
      case 'ai_processing': return <AIProcessingScreen onComplete={() => navigate('skill_dna')} />;
      case 'skill_dna': return <SkillDNAScreen onNext={() => navigate('skill_gap')} />;
      case 'skill_gap': return <SkillGapScreen onNext={() => navigate('training')} />;
      case 'training': return <TrainingScreen onNext={() => navigate('opportunities')} />;
      case 'opportunities': return <OpportunitiesScreen onNext={() => navigate('map')} />;
      case 'map': return <MapScreen onNext={() => navigate('action_plan')} />;
      case 'action_plan': return <ActionPlanScreen onNext={() => navigate('home')} />;
      case 'home': return <HomeScreen onNavigate={navigate} />;
      case 'profile': return <ProfileScreen onBack={() => navigate('home')} />;
      case 'field_worker': return <FieldWorkerScreen onNavigate={navigate} />;
      case 'authority': return <AuthorityDashboard />;
      case 'offline': return <OfflineScreen onRetry={() => navigate('home')} />;
      default: return <SplashScreen onNext={() => navigate('welcome')} />;
    }
  };

  const isSplash = state.currentPage === 'splash';
  const isLanguageSelection = state.currentPage === 'language';

  return (
    <AppContext.Provider value={{ state, setState }}>
      <div className="min-h-dvh flex flex-col bg-slate-100 text-slate-800 antialiased">
        {/* Desktop Responsive Navigation Shell */}
        {!isSplash && !isLanguageSelection && (
          <header className="app-navbar hidden md:block bg-white border-b border-slate-200 text-slate-900 z-40">
            <div className="app-navbar__inner max-w-7xl mx-auto px-4 py-2.5">
              {/* Brand */}
              <div 
                onClick={() => navigate('home')} 
                className="app-navbar__brand flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src="/saksham-saathi-logo.png"
                  alt="Saksham Saathi"
                  className="w-11 h-11 rounded-lg object-contain bg-white p-0.5 shadow-sm border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-tight text-[#19324d]">SAKSHAM SAATHI</span>
                    <span className="bg-[#e7f7f5] text-[#0f766e] border border-[#b8e6df] text-[9px] font-bold px-1.5 py-0.2 rounded">
                      PM-AJAY GIA
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block -mt-0.5">
                    "Your Voice. Your Skills. Your Livelihood."
                  </span>
                </div>
              </div>

              {/* Pipeline Stepper Navigation */}
              <div className="app-navbar__pipeline flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
                {PIPELINE_STEPS.map((step) => {
                  const isActive = state.currentPage === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => navigate(step.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#0f766e] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#0f766e] hover:bg-[#e7f7f5]'
                      }`}
                      title={`Jump to ${step.label}`}
                    >
                      <span className="text-[11px]">{step.icon}</span>
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right Controls: View Mode & Role */}
              <div className="app-navbar__controls flex items-center gap-3">
                {/* View Mode Toggle: Desktop vs Mobile simulator */}
                <div className="flex items-center bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setState(prev => ({ ...prev, viewMode: 'desktop' }))}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      state.viewMode === 'desktop' ? 'bg-[#0f766e] text-white' : 'text-slate-600 hover:text-[#0f766e]'
                    }`}
                    title="Full Width Desktop Layout"
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setState(prev => ({ ...prev, viewMode: 'mobile' }))}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                      state.viewMode === 'mobile' ? 'bg-[#0f766e] text-white' : 'text-slate-600 hover:text-[#0f766e]'
                    }`}
                    title="Smartphone Simulator Mockup"
                  >
                    📱 Mobile
                  </button>
                </div>

                {/* Role Switcher */}
                <div className="flex items-center bg-slate-50 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setState(prev => ({ ...prev, currentPage: 'home', role: 'beneficiary' }))}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      state.role === 'beneficiary' ? 'bg-[#0f766e] text-white font-semibold' : 'text-slate-600 hover:text-[#0f766e]'
                    }`}
                  >
                    {t('beneficiary', { lng: state.language })}
                  </button>
                  <button
                    onClick={() => setState(prev => ({ ...prev, currentPage: 'field_worker', role: 'field_worker' }))}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      state.role === 'field_worker' ? 'bg-[#0f766e] text-white font-semibold' : 'text-slate-600 hover:text-[#0f766e]'
                    }`}
                  >
                    {t('fieldWorker', { lng: state.language })}
                  </button>
                  <button
                    onClick={() => setState(prev => ({ ...prev, currentPage: 'authority', role: 'authority' }))}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      state.role === 'authority' ? 'bg-[#0f766e] text-white font-semibold' : 'text-slate-600 hover:text-[#0f766e]'
                    }`}
                  >
                    {t('authority', { lng: state.language })}
                  </button>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Content Container (Adapts based on viewMode on desktop) */}
        <main className="flex-1 flex flex-col">
          {state.viewMode === 'mobile' && !isSplash ? (
            <div className="flex-1 py-8 px-4 flex items-center justify-center bg-slate-900/90 backdrop-blur-xs">
              <div className="w-full max-w-[412px] bg-slate-50 rounded-[44px] shadow-2xl border-[10px] border-slate-800 overflow-hidden min-h-[820px] max-h-[880px] flex flex-col relative">
                {/* Mobile Camera Notch */}
                <div className="absolute top-2 inset-x-0 mx-auto w-32 h-4 bg-slate-800 rounded-b-xl z-50"></div>
                <div className="flex-1 flex flex-col overflow-y-auto pb-16">
                  {renderPage()}
                </div>
                {state.isLoggedIn && (
                  <MobileBottomNav
                    currentPage={state.currentPage}
                    language={state.language}
                    onNavigate={navigate}
                    className="mobile-bottom-nav--simulator"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {renderPage()}
            </div>
          )}
        </main>
        {state.isLoggedIn && !isSplash && (
          <MobileBottomNav
            currentPage={state.currentPage}
            language={state.language}
            onNavigate={navigate}
            className="mobile-bottom-nav--actual"
          />
        )}
      </div>
    </AppContext.Provider>
  );
}

export default App;

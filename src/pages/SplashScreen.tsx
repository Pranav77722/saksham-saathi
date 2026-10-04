import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onNext }: { onNext: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setTimeout(() => setShow(true), 300);
    const timer = setTimeout(onNext, 3000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={show ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-8"
      >
        <img
          src="/saksham-saathi-logo.png"
          alt="सक्षम साथी - Sakham Saathi"
          className="w-72 h-72 max-w-full object-contain drop-shadow-2xl"
        />
        <p className="text-indigo-300 text-sm mt-4 max-w-xs mx-auto leading-relaxed">
          Your Voice. Your Skills. Your Livelihood.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-12 text-center"
      >
        <p className="text-indigo-400 text-xs">Prototype for PM-AJAY GIA livelihood-support use case</p>
        <div className="mt-3 flex gap-1 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </motion.div>
    </div>
  );
}

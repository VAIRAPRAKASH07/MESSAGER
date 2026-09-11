import React from 'react';
import { ShieldCheck, Lock, KeyRound, Sparkles, ArrowRight, CheckCircle2, UserCheck, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onSignIn: () => void;
  onRegister: () => void;
  onOpenHowItWorks: () => void;
  onSelectPresetAccount: (accountKey: 'account_a' | 'account_b') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSignIn,
  onRegister,
  onOpenHowItWorks,
  onSelectPresetAccount,
}) => {
  return (
    <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-400/10 dark:bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-privacy-400/10 dark:bg-privacy-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Privacy Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-8 shadow-xs animate-slide-up-slow">
          <ShieldCheck className="w-4 h-4 text-brand-500" />
          <span>No Phone Numbers. No Email Exposure. Total Privacy.</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          Connect without <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-privacy-600 dark:from-brand-400 dark:via-brand-300 dark:to-privacy-400">
            sharing your number.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Create your private Communication ID and communicate without revealing your phone number or email address to other users.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-lg mx-auto">
          <Button
            onClick={onRegister}
            size="lg"
            variant="primary"
            className="w-full sm:w-auto shadow-lg shadow-brand-500/25 text-base px-7 py-3.5 rounded-2xl"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create New Account
          </Button>

          <Button
            onClick={onSignIn}
            size="lg"
            variant="secondary"
            className="w-full sm:w-auto text-base px-6 py-3.5 rounded-2xl"
            leftIcon={
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            }
          >
            Google Sign In
          </Button>

          <Button
            onClick={onOpenHowItWorks}
            size="lg"
            variant="ghost"
            className="w-full sm:w-auto text-sm px-4 py-3.5 rounded-2xl text-slate-600 dark:text-slate-300"
          >
            How it works
          </Button>
        </div>

        {/* Example Communication ID Demonstration Card (Explicitly labeled) */}
        <div className="mt-14 max-w-lg mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-xl shadow-slate-200/40 dark:shadow-none">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-privacy-100 dark:bg-privacy-950/80 text-privacy-600 dark:text-privacy-400 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-privacy-600 dark:text-privacy-400">
                  Example Communication ID
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Your public identity in MESSAGER
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-semibold">
              PREVIEW ONLY
            </span>
          </div>

          <div className="my-6 py-4 px-6 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500">
                Sample Public Identifier
              </span>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-slate-800 dark:text-slate-100 mt-0.5">
                1234 5678
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <EyeOff className="w-3.5 h-3.5" /> No Phone/Email
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
            <strong className="text-slate-700 dark:text-slate-300">Important:</strong> This is a fictional example. Your actual permanent 8-digit Communication ID is generated securely on the server only after Google authentication.
          </p>

          {/* Quick Account Switching Demo Buttons */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Instant Sandbox Account Switch:</span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => onSelectPresetAccount('account_a')}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-700 dark:text-brand-300 font-medium transition-colors text-center"
              >
                Sign in as Account A (5839 2147)
              </button>
              <button
                onClick={() => onSelectPresetAccount('account_b')}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-privacy-50 hover:bg-privacy-100 dark:bg-privacy-950/60 dark:hover:bg-privacy-900 text-privacy-700 dark:text-privacy-300 font-medium transition-colors text-center"
              >
                Sign in as Account B (7412 0583)
              </button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid Under Hero */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Permanent 8-Digit ID
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Share your Communication ID with anyone. Keep your personal contact data completely private.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              24-Hour Thoughts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Post ephemeral status updates with custom colors and restrict audience strictly to Close Friends or Contacts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              PIN-Protected Vault
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Shield confidential chats inside a dedicated Private Chat area guarded by client-side PBKDF2 PIN hashing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

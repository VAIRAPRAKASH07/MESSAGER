import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CheckCircle2, Shield, KeyRound, Share2, MessageSquare } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
}) => {
  const steps = [
    {
      num: '1',
      icon: <Shield className="w-5 h-5 text-brand-500" />,
      title: 'Sign in with Google',
      desc: 'Google OAuth verifies your account authenticity. Your email and phone number are never exposed to other users or stored as your public handle.',
    },
    {
      num: '2',
      icon: <KeyRound className="w-5 h-5 text-privacy-500" />,
      title: 'Get your permanent Communication ID',
      desc: 'Our server generates a unique, unpredictable 8-digit numeric identifier (e.g. 58392147). This becomes your permanent public identity.',
    },
    {
      num: '3',
      icon: <Share2 className="w-5 h-5 text-emerald-500" />,
      title: 'Share your ID safely',
      desc: 'Give your 8-digit ID to friends, colleagues, or online communities. No one can trace it back to your phone, email, or Google profile.',
    },
    {
      num: '4',
      icon: <MessageSquare className="w-5 h-5 text-amber-500" />,
      title: 'Start communicating',
      desc: 'Enjoy real-time messaging, 24-hour Thoughts, Close Friends lists, and PIN-protected Private Chat vaults with total peace of mind.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How MESSAGER Works"
      subtitle="Privacy-first communication decoupled from personal phone numbers"
      maxWidth="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/80"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center font-bold text-slate-800 dark:text-slate-100 shadow-xs">
                {step.icon}
              </div>
              <div className="text-left flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                    STEP {step.num}
                  </span>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onSignIn();
            }}
            className="w-full sm:w-auto"
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </Modal>
  );
};

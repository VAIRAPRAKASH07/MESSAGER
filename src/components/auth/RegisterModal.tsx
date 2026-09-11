import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { ShieldCheck, Sparkles, KeyRound, UserPlus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const { registerNewAccount, signInWithGoogle, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Please enter your display name.');
      return;
    }
    setError('');
    await registerNewAccount(displayName.trim(), email.trim() || undefined);
    onClose();
  };

  const handleGoogleAuth = async () => {
    await signInWithGoogle();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New MESSAGER Account"
      subtitle="Register a new private account with a permanent 8-digit Communication ID"
      maxWidth="md"
    >
      <div className="space-y-6 text-left">
        {/* Value Proposition Badge */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-50 to-privacy-50 dark:from-brand-950/40 dark:to-privacy-950/40 border border-brand-200/80 dark:border-brand-800/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <KeyRound className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 dark:text-white block">
              Permanent Identity Protection
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Your Communication ID will be permanently generated and never changes. Your phone number & email are never shared.
            </span>
          </div>
        </div>

        {/* Custom Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Display Name"
            placeholder="e.g. Alex Morgan"
            value={displayName}
            onChange={(e) => {
              setDisplayName(e.target.value);
              if (error) setError('');
            }}
            error={error}
            maxLength={32}
            autoFocus
          />

          <Input
            label="Optional Email (Simulation / Identification)"
            type="email"
            placeholder="e.g. alex@example.com (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            hint="Used only for secure account recovery; never visible to other users."
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full rounded-2xl py-3 text-sm shadow-md shadow-brand-500/20"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Register & Generate Permanent ID
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs uppercase font-semibold text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Fast Google Auth Option */}
        <Button
          type="button"
          onClick={handleGoogleAuth}
          variant="secondary"
          size="md"
          className="w-full rounded-2xl py-3 text-xs font-semibold"
          leftIcon={
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          Continue with Google
        </Button>
      </div>
    </Modal>
  );
};

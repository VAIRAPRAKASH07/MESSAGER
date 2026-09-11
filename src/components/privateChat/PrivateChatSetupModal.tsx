import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Lock, ShieldCheck, Clock, Check, KeyRound, Mail, AlertTriangle } from 'lucide-react';
import { usePrivateChat } from '../../contexts/PrivateChatContext';
import { PrivateChatRecoveryModal } from './PrivateChatRecoveryModal';

interface PrivateChatSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivateChatSetupModal: React.FC<PrivateChatSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setupPin, isConfigured } = usePrivateChat();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [autoLockInterval, setAutoLockInterval] = useState<number>(5);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length < 4 || pin.length > 8) {
      setError('PIN must be between 4 and 8 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setIsSubmitting(true);
    const success = await setupPin(pin, autoLockInterval);
    setIsSubmitting(false);

    if (success) {
      setPin('');
      setConfirmPin('');
      onClose();
    } else {
      setError('Failed to setup PIN. Please try again.');
    }
  };

  // If already configured, enforce strict single-password rule with Gmail verification required
  if (isConfigured) {
    return (
      <>
        <Modal
          isOpen={isOpen && !isRecoveryOpen}
          onClose={onClose}
          title="Private Chat Password Security"
          subtitle="Single-password policy with Gmail identity verification"
          maxWidth="md"
        >
          <div className="space-y-5 text-left py-2">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-900 dark:text-amber-200 block text-sm">
                  Single Password Protection Policy
                </span>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  Your private chat vault is already configured with your primary security password. To prevent unauthorized resets, changing or recovering this password requires verification through your authenticated Gmail account.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Vault Status: Configured & Encrypted</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click below to start Google Account verification and receive a 6-digit OTP code to update your password.
              </p>
              <Button
                variant="primary"
                size="md"
                className="w-full rounded-xl"
                onClick={() => setIsRecoveryOpen(true)}
                leftIcon={<Mail className="w-4 h-4" />}
              >
                Verify with Gmail to Change Password
              </Button>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </Modal>

        <PrivateChatRecoveryModal
          isOpen={isRecoveryOpen}
          onClose={() => setIsRecoveryOpen(false)}
          onSuccess={() => {
            setIsRecoveryOpen(false);
            onClose();
          }}
        />
      </>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Private Chat Password"
      subtitle="Shield intimate conversations with client-side hashed PIN authentication"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Create Vault PIN / Password (4-8 Digits)"
            type="password"
            maxLength={8}
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            leftIcon={<Lock className="w-4 h-4 text-privacy-500" />}
            autoFocus
          />
        </div>

        <div>
          <Input
            label="Confirm PIN / Password"
            type="password"
            maxLength={8}
            placeholder="••••"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            leftIcon={<Lock className="w-4 h-4 text-privacy-500" />}
          />
        </div>

        {/* Auto Lock Interval Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide block mb-1.5">
            Auto-lock Vault after inactivity
          </label>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {[
              { val: 0, label: 'Immediate' },
              { val: 1, label: '1 min' },
              { val: 5, label: '5 min' },
              { val: 15, label: '15 min' },
            ].map((opt) => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setAutoLockInterval(opt.val)}
                className={`p-2 rounded-xl border text-center font-medium transition-all ${
                  autoLockInterval === opt.val
                    ? 'border-privacy-500 bg-privacy-50 dark:bg-privacy-950 text-privacy-700 dark:text-privacy-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-rose-500">{error}</p>
        )}

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <span>
            Single-Password policy: This PIN will be protected by your authenticated Google Account. It is never stored in plaintext.
          </span>
        </div>

        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="privacy"
            isLoading={isSubmitting}
            disabled={pin.length < 4 || confirmPin.length < 4}
          >
            Save PIN & Enable Vault
          </Button>
        </div>
      </form>
    </Modal>
  );
};

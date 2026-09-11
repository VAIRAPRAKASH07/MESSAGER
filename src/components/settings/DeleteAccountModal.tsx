import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { profile, deleteAccount, isLoading } = useAuth();
  const [confirmationInput, setConfirmationInput] = useState('');

  const targetUsername = profile?.display_name || 'username';
  const requiredPhrase = `delete my ${targetUsername}`;

  // Normalized matching (trim whitespace and case-insensitive check for user convenience while enforcing accuracy)
  const isMatch = confirmationInput.trim().toLowerCase() === requiredPhrase.toLowerCase();

  const handleDelete = async () => {
    if (!isMatch) return;
    await deleteAccount();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Account"
      subtitle="Permanently erase your identity, messages, and communication data"
      maxWidth="md"
    >
      <div className="space-y-5 text-left">
        {/* Warning Callout Box */}
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs space-y-1">
            <span className="font-bold text-rose-900 dark:text-rose-200 block text-sm">
              Warning: This action is irreversible!
            </span>
            <p className="text-rose-700 dark:text-rose-300 leading-relaxed">
              Deleting your account will permanently wipe your Communication ID (<strong>{profile?.communication_id}</strong>), contacts, encrypted private vault messages, thoughts, and settings.
            </p>
          </div>
        </div>

        {/* Confirmation Phrase Instruction */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            To proceed and confirm account deletion, please type the confirmation phrase exactly as shown:
          </p>
          <div className="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-dashed border-rose-300 dark:border-rose-800 text-center font-mono font-bold text-sm text-rose-600 dark:text-rose-400 select-all">
            {requiredPhrase}
          </div>
        </div>

        {/* Retype Input Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
            Type phrase to confirm
          </label>
          <input
            type="text"
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
            placeholder={`Type "${requiredPhrase}"`}
            className={`w-full px-4 py-2.5 rounded-xl text-xs font-mono transition-all outline-none border ${
              isMatch
                ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100 ring-2 ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-rose-400'
            }`}
            autoFocus
          />
          {confirmationInput.length > 0 && !isMatch && (
            <p className="text-[11px] text-rose-500 font-medium">
              Phrase does not match yet. Please type exactly: <code>{requiredPhrase}</code>
            </p>
          )}
          {isMatch && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Confirmation phrase matched. You can now permanently delete the account.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={!isMatch || isLoading}
            isLoading={isLoading}
            onClick={handleDelete}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="shadow-md shadow-rose-500/20"
          >
            Delete My Account
          </Button>
        </div>
      </div>
    </Modal>
  );
};

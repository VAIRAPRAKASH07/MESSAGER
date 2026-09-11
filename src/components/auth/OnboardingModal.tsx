import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Copy, Check, Share2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { formatCommunicationId, copyToClipboard } from '../../lib/utils';

interface OnboardingModalProps {
  isOpen: boolean;
  communicationId: string;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  communicationId,
  onComplete,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0C80F2', '#8B5CF6', '#10B981', '#F59E0B'],
        });
      } catch {
        // ignore if not supported
      }
    }
  }, [isOpen]);

  const handleCopy = async () => {
    const success = await copyToClipboard(communicationId);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My MESSAGER Communication ID',
          text: `Connect with me on MESSAGER using my private Communication ID: ${communicationId}`,
          url: window.location.origin,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onComplete}
      showCloseButton={false}
      maxWidth="md"
    >
      <div className="text-center space-y-6 pt-2">
        {/* Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-brand-600 to-privacy-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-brand-500/25 animate-scale-in">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Your Communication ID is ready!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            This ID is permanently associated with your account and is used by others to find and communicate with you.
          </p>
        </div>

        {/* Communication ID Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-slate-50 to-brand-50/40 dark:from-slate-900 dark:to-brand-950/30 border border-brand-200/80 dark:border-brand-800/60 shadow-inner">
          <span className="text-xs uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
            Permanent Communication ID
          </span>

          <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-widest text-slate-900 dark:text-white my-3 select-all">
            {formatCommunicationId(communicationId)}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? 'Copied ID' : 'Copy ID'}
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              leftIcon={<Share2 className="w-3.5 h-3.5" />}
            >
              Share ID
            </Button>
          </div>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Your Google email and phone number will never be revealed.</span>
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          variant="primary"
          onClick={onComplete}
          className="w-full rounded-2xl py-3.5 text-base shadow-lg shadow-brand-500/25"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Enter MESSAGER
        </Button>
      </div>
    </Modal>
  );
};

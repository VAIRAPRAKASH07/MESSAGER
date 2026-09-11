import React from 'react';

interface ReactionPickerProps {
  onSelectEmoji: (emoji: string) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['👍', '❤️', '🔒', '😂', '🔥', '👏', '👀', '✨'];

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSelectEmoji,
  onClose,
}) => {
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} />
      <div className="absolute -top-10 left-0 z-30 flex items-center gap-1 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200 dark:border-slate-800 animate-scale-in">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelectEmoji(emoji);
              onClose();
            }}
            className="w-7 h-7 flex items-center justify-center hover:scale-125 active:scale-95 transition-transform text-sm select-none"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};

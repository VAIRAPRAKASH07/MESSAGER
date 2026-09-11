import React, { useState } from 'react';
import { X } from 'lucide-react';

interface StickerPickerProps {
  onSelectSticker: (stickerUrl: string, altText: string) => void;
  onClose: () => void;
}

// Curated sticker sets using inline emoji art as SVG data URLs to avoid external dependencies
const STICKER_CATEGORIES = [
  {
    label: '😊 Feelings',
    stickers: [
      { emoji: '😂', alt: 'Laughing' },
      { emoji: '😍', alt: 'Love Eyes' },
      { emoji: '😎', alt: 'Cool' },
      { emoji: '🥺', alt: 'Pleading' },
      { emoji: '😭', alt: 'Crying' },
      { emoji: '🤩', alt: 'Star Struck' },
      { emoji: '😤', alt: 'Frustrated' },
      { emoji: '🥳', alt: 'Party Face' },
      { emoji: '😴', alt: 'Sleepy' },
      { emoji: '🤔', alt: 'Thinking' },
      { emoji: '😇', alt: 'Angel' },
      { emoji: '🫶', alt: 'Heart Hands' },
    ],
  },
  {
    label: '❤️ Love',
    stickers: [
      { emoji: '❤️', alt: 'Red Heart' },
      { emoji: '💕', alt: 'Two Hearts' },
      { emoji: '💖', alt: 'Sparkling Heart' },
      { emoji: '💝', alt: 'Heart Ribbon' },
      { emoji: '💘', alt: 'Heart Arrow' },
      { emoji: '🫂', alt: 'Hug' },
      { emoji: '💌', alt: 'Love Letter' },
      { emoji: '🌹', alt: 'Rose' },
      { emoji: '💐', alt: 'Bouquet' },
      { emoji: '😘', alt: 'Kiss' },
      { emoji: '🥰', alt: 'Smiling Hearts' },
      { emoji: '💑', alt: 'Couple' },
    ],
  },
  {
    label: '🎉 Celebrate',
    stickers: [
      { emoji: '🎉', alt: 'Party' },
      { emoji: '🎊', alt: 'Confetti' },
      { emoji: '🏆', alt: 'Trophy' },
      { emoji: '🥂', alt: 'Cheers' },
      { emoji: '🎁', alt: 'Gift' },
      { emoji: '🎂', alt: 'Cake' },
      { emoji: '✨', alt: 'Sparkles' },
      { emoji: '🌟', alt: 'Star' },
      { emoji: '🎶', alt: 'Music' },
      { emoji: '🚀', alt: 'Rocket' },
      { emoji: '🔥', alt: 'Fire' },
      { emoji: '💯', alt: '100' },
    ],
  },
  {
    label: '👍 Reactions',
    stickers: [
      { emoji: '👍', alt: 'Thumbs Up' },
      { emoji: '👎', alt: 'Thumbs Down' },
      { emoji: '👏', alt: 'Clapping' },
      { emoji: '🙌', alt: 'Hands Up' },
      { emoji: '🤝', alt: 'Handshake' },
      { emoji: '✌️', alt: 'Peace' },
      { emoji: '🤞', alt: 'Fingers Crossed' },
      { emoji: '☝️', alt: 'Point Up' },
      { emoji: '👊', alt: 'Fist Bump' },
      { emoji: '🫡', alt: 'Salute' },
      { emoji: '💪', alt: 'Strong' },
      { emoji: '🙏', alt: 'Pray' },
    ],
  },
  {
    label: '🐾 Fun',
    stickers: [
      { emoji: '🐶', alt: 'Dog' },
      { emoji: '🐱', alt: 'Cat' },
      { emoji: '🦊', alt: 'Fox' },
      { emoji: '🐼', alt: 'Panda' },
      { emoji: '🐸', alt: 'Frog' },
      { emoji: '🦄', alt: 'Unicorn' },
      { emoji: '🐙', alt: 'Octopus' },
      { emoji: '🌈', alt: 'Rainbow' },
      { emoji: '☀️', alt: 'Sun' },
      { emoji: '🌊', alt: 'Wave' },
      { emoji: '🍕', alt: 'Pizza' },
      { emoji: '🍦', alt: 'Ice Cream' },
    ],
  },
];

/**
 * Converts an emoji to a lightweight sticker-style "URL" by encoding it
 * as a reference to the emoji string itself. The MessageBubble renders
 * stickers from attachment_meta.sticker_emoji.
 */
function emojiToStickerUrl(emoji: string): string {
  return `sticker:${emoji}`;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({
  onSelectSticker,
  onClose,
}) => {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up w-72 sm:w-80">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
          Stickers
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-100 dark:border-slate-800 no-scrollbar">
        {STICKER_CATEGORIES.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(i)}
            className={`flex-shrink-0 px-3 py-2 text-base transition-colors ${
              activeCategory === i
                ? 'border-b-2 border-brand-500 bg-brand-50 dark:bg-brand-950/40'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
            title={cat.label}
          >
            {cat.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Sticker Grid */}
      <div className="grid grid-cols-6 gap-1 p-2 max-h-44 overflow-y-auto">
        {STICKER_CATEGORIES[activeCategory].stickers.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelectSticker(emojiToStickerUrl(s.emoji), s.alt)}
            title={s.alt}
            className="flex items-center justify-center text-2xl w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-125 active:scale-95"
          >
            {s.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

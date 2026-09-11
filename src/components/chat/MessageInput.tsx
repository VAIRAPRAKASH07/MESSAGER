import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Paperclip,
  Image as ImageIcon,
  X,
  Sticker,
  Film,
} from 'lucide-react';
import { StickerPicker } from './StickerPicker';
import type { Message } from '../../types';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'video' | 'file' | 'audio', replyToId?: string, attachmentUrl?: string) => Promise<void>;
  replyingToMessage: Message | null;
  onCancelReply: () => void;
  isPrivateVault?: boolean;
}

type AttachmentPreview = {
  url: string;
  type: 'image' | 'video' | 'file';
  fileName?: string;
  isSticker?: boolean;
};

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  replyingToMessage,
  onCancelReply,
  isPrivateVault = false,
}) => {
  const [content, setContent] = useState('');
  const [showEmojiQuickBar, setShowEmojiQuickBar] = useState(false);
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<AttachmentPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleSend = async () => {
    if (!content.trim() && !attachmentPreview) return;
    const msgType = attachmentPreview?.type || 'text';
    const attachUrl = attachmentPreview?.url;

    const sendingContent = attachmentPreview?.isSticker ? '' : content.trim();
    setContent('');
    setAttachmentPreview(null);
    setUploadError(null);
    if (replyingToMessage) onCancelReply();

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await onSendMessage(sendingContent, msgType, replyingToMessage?.id, attachUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Handle real file selection from device.
   * Creates a local object URL for preview; in production this would upload to Supabase Storage.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file size: 50MB max
    const MAX_BYTES = 50 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setUploadError('File too large. Maximum size is 50 MB.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);

    // Create local preview URL (in production, upload to Supabase Storage bucket here)
    const previewUrl = URL.createObjectURL(file);

    // Determine actual type
    let detectedType: 'image' | 'video' | 'file' = fileType;
    if (file.type.startsWith('image/')) detectedType = 'image';
    else if (file.type.startsWith('video/')) detectedType = 'video';

    setAttachmentPreview({
      url: previewUrl,
      type: detectedType,
      fileName: file.name,
    });

    setIsUploading(false);

    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  const handleSelectSticker = (stickerUrl: string, altText: string) => {
    setShowStickerPicker(false);
    setAttachmentPreview({
      url: stickerUrl,
      type: 'image',
      fileName: altText,
      isSticker: true,
    });
  };

  const quickEmojis = ['😊', '👍', '🔒', '❤️', '🔥', '✨', '👋', '🎉'];

  const canSend = Boolean(content.trim() || attachmentPreview) && !isUploading;

  return (
    <div className="p-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
      {/* Replying-To Banner */}
      {replyingToMessage && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-l-2 border-brand-500 text-xs text-slate-700 dark:text-slate-300 animate-slide-up">
          <div className="min-w-0">
            <span className="font-semibold text-brand-600 dark:text-brand-400 block">
              Replying to {replyingToMessage.sender_profile?.display_name || 'User'}
            </span>
            <p className="truncate text-slate-500 dark:text-slate-400">
              {replyingToMessage.content}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center justify-between gap-2 px-3 py-2 mb-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)}><X className="w-3 h-3" /></button>
        </div>
      )}

      {/* Attachment Preview Banner */}
      {attachmentPreview && (
        <div className="relative inline-block mb-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
          {attachmentPreview.isSticker ? (
            /* Sticker preview */
            <div className="w-24 h-24 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-6xl">
              {attachmentPreview.url.replace('sticker:', '')}
            </div>
          ) : attachmentPreview.type === 'image' ? (
            <img
              src={attachmentPreview.url}
              alt="Upload preview"
              className="w-24 h-24 object-cover"
            />
          ) : attachmentPreview.type === 'video' ? (
            <video
              src={attachmentPreview.url}
              className="w-24 h-24 object-cover"
              muted
            />
          ) : (
            /* Generic file */
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 max-w-[200px]">
              <Paperclip className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                {attachmentPreview.fileName}
              </span>
            </div>
          )}
          <button
            onClick={() => setAttachmentPreview(null)}
            className="absolute top-1 right-1 p-1 bg-slate-900/80 text-white rounded-full hover:bg-slate-900"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Quick Emoji Strip */}
      {showEmojiQuickBar && (
        <div className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar">
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setContent((prev) => prev + emoji);
                textareaRef.current?.focus();
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Sticker Picker Overlay */}
      {showStickerPicker && (
        <div className="mb-2">
          <StickerPicker
            onSelectSticker={handleSelectSticker}
            onClose={() => setShowStickerPicker(false)}
          />
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file?.type.startsWith('video/')) {
            handleFileChange(e, 'video');
          } else {
            handleFileChange(e, 'image');
          }
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'file')}
      />

      {/* Composer Row */}
      <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 transition-all focus-within:border-brand-500 focus-within:bg-white dark:focus-within:bg-slate-950">
        <div className="flex items-center gap-0.5 pb-1 pl-1 text-slate-400 dark:text-slate-500">
          {/* Emoji Quick Bar Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowEmojiQuickBar(!showEmojiQuickBar);
              setShowStickerPicker(false);
            }}
            className={`p-2 rounded-xl transition-colors ${
              showEmojiQuickBar
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950/40'
                : 'hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
            title="Emoji quick-bar"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Sticker Picker Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowStickerPicker(!showStickerPicker);
              setShowEmojiQuickBar(false);
            }}
            className={`p-2 rounded-xl transition-colors ${
              showStickerPicker
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950/40'
                : 'hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800'
            }`}
            title="Stickers"
          >
            <Sticker className="w-4 h-4" />
          </button>

          {/* Photo / Video from Device */}
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="p-2 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="Attach photo or video"
          >
            <ImageIcon className="w-4 h-4" />
          </button>

          {/* Any File from Device */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
        </div>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder={isPrivateVault ? 'Message in private vault...' : 'Write a private message...'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none max-h-32 min-h-[38px]"
        />

        {/* Uploading Spinner */}
        {isUploading && (
          <div className="pb-1 pr-1 text-brand-500">
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        )}

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={`p-2.5 rounded-xl transition-all duration-150 flex items-center justify-center flex-shrink-0 ${
            canSend
              ? isPrivateVault
                ? 'bg-privacy-600 hover:bg-privacy-700 text-white shadow-sm active:scale-95'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-sm active:scale-95'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

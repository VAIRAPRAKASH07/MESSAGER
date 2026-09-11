import React, { useState } from 'react';
import { 
  Check, 
  CheckCheck, 
  Smile, 
  Reply, 
  Pencil, 
  Trash2, 
  Copy, 
  FileText,
  Lock
} from 'lucide-react';
import { ReactionPicker } from './ReactionPicker';
import { formatMessageTime, copyToClipboard } from '../../lib/utils';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  onReply,
  onEdit,
  onDelete,
  onReact,
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (message.content) {
      const ok = await copyToClipboard(message.content);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div
      className={`group relative flex flex-col mb-3 select-text ${
        isMe ? 'items-end' : 'items-start'
      }`}
    >
      {/* Floating Hover Action Menu */}
      {!message.is_deleted && (
        <div
          className={`absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm ${
            isMe ? 'right-0' : 'left-0'
          }`}
        >
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="React"
          >
            <Smile className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onReply(message)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reply"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {isMe && (
            <>
              <button
                onClick={() => onEdit(message)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit message"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(message.id)}
                className="p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {showReactionPicker && (
            <ReactionPicker
              onSelectEmoji={(emoji) => onReact(message.id, emoji)}
              onClose={() => setShowReactionPicker(false)}
            />
          )}
        </div>
      )}

      {/* Bubble Container */}
      <div
        className={`relative max-w-[85%] sm:max-w-md md:max-w-lg rounded-2xl p-3 shadow-xs ${
          message.is_deleted
            ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 italic text-xs border border-dashed border-slate-300 dark:border-slate-700'
            : isMe
            ? 'bg-brand-500 text-white rounded-tr-xs'
            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs'
        }`}
      >
        {/* Reply Quote Banner */}
        {message.reply_to_message && !message.is_deleted && (
          <div
            className={`mb-2 p-2 rounded-xl text-xs border-l-2 ${
              isMe
                ? 'bg-brand-600/60 border-brand-200 text-white/90'
                : 'bg-slate-50 dark:bg-slate-950 border-brand-500 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="font-semibold text-[11px] block text-brand-300 dark:text-brand-400">
              {message.reply_to_message.sender_name}
            </span>
            <p className="truncate text-[11px] mt-0.5 opacity-90">
              {message.reply_to_message.content}
            </p>
          </div>
        )}

        {/* Sticker — detected by sticker: url prefix */}
        {message.message_type === 'image' &&
          message.attachment_url?.startsWith('sticker:') && (
          <div className="mb-1 text-6xl leading-tight select-none">
            {message.attachment_url.replace('sticker:', '')}
          </div>
        )}

        {/* Image Attachment */}
        {message.message_type === 'image' &&
          message.attachment_url &&
          !message.attachment_url.startsWith('sticker:') && (
          <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
            <img
              src={message.attachment_url}
              alt="Attachment"
              className="w-full h-auto object-cover max-h-64 rounded-xl"
              loading="lazy"
            />
          </div>
        )}

        {/* Video Attachment */}
        {message.message_type === 'video' && message.attachment_url && (
          <div className="mb-2 rounded-xl overflow-hidden max-w-sm">
            <video
              src={message.attachment_url}
              controls
              className="w-full h-auto max-h-64 rounded-xl bg-black"
              preload="metadata"
            />
          </div>
        )}

        {/* File Attachment */}
        {message.message_type === 'file' && (
          <a
            href={message.attachment_url || '#'}
            download={message.attachment_meta?.file_name || 'file'}
            target="_blank"
            rel="noopener noreferrer"
            className={`mb-2 flex items-center gap-2 p-2 rounded-xl text-xs cursor-pointer hover:opacity-80 transition-opacity ${
              isMe ? 'bg-brand-600/50' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-medium truncate block">
                {message.attachment_meta?.file_name || 'Attached document'}
              </span>
              <span className="text-[10px] opacity-75">Tap to download</span>
            </div>
          </a>
        )}

        {/* Message Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>

        {/* Message Footer: Timestamp, Edited badge, Read status */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
            isMe ? 'text-brand-100' : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {message.is_edited && <span className="italic">edited</span>}
          <span>{formatMessageTime(message.created_at)}</span>

          {isMe && !message.is_deleted && (
            <span className="ml-0.5">
              {message.status === 'read' || message.is_read ? (
                <CheckCheck className="w-3.5 h-3.5 text-brand-100" />
              ) : (
                <Check className="w-3 h-3 text-brand-200" />
              )}
            </span>
          )}
        </div>
      </div>

      {/* Reaction Badges */}
      {Boolean(message.reactions && message.reactions.length > 0) && (
        <div className="flex flex-wrap gap-1 mt-1 -mb-1 z-10">
          {message.reactions?.map((reaction) => (
            <button
              key={reaction.id}
              onClick={() => onReact(message.id, reaction.emoji)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border shadow-2xs transition-transform hover:scale-105 active:scale-95 ${
                isMe
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
              }`}
            >
              <span>{reaction.emoji}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

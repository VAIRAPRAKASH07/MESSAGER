import React, { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import type { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isPrivateVault?: boolean;
  onReply: (message: Message) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isPrivateVault = false,
  onReply,
  onEdit,
  onDelete,
  onReact,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by day
  const renderDateBadge = (dateString: string) => {
    try {
      const date = new Date(dateString);
      let label = format(date, 'MMMM d, yyyy');
      if (isToday(date)) label = 'Today';
      if (isYesterday(date)) label = 'Yesterday';

      return (
        <div className="flex items-center justify-center my-4 select-none">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-[11px] font-medium shadow-2xs">
            {label}
          </span>
        </div>
      );
    } catch {
      return null;
    }
  };

  let lastDate = '';

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
      {/* Privacy Guarantee Header inside conversation */}
      <div className="my-6 max-w-sm mx-auto p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-center select-none">
        <div className="w-7 h-7 rounded-lg bg-brand-50 dark:bg-brand-950/80 text-brand-500 flex items-center justify-center mx-auto mb-2">
          {isPrivateVault ? <Lock className="w-4 h-4 text-privacy-500" /> : <ShieldCheck className="w-4 h-4" />}
        </div>
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
          {isPrivateVault ? 'Private Chat Vault Thread' : 'Privacy-Guaranteed Direct Channel'}
        </span>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
          {isPrivateVault
            ? 'This conversation is isolated inside your PIN vault and hidden from the normal chat list.'
            : 'Messages are routed via Communication IDs. Phone numbers and email addresses remain strictly unexposed.'}
        </p>
      </div>

      {/* Messages */}
      {messages.map((msg) => {
        const msgDate = new Date(msg.created_at).toDateString();
        const showDateBadge = msgDate !== lastDate;
        lastDate = msgDate;

        return (
          <React.Fragment key={msg.id}>
            {showDateBadge && renderDateBadge(msg.created_at)}
            <MessageBubble
              message={msg}
              isMe={msg.sender_id === currentUserId}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReact={onReact}
            />
          </React.Fragment>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

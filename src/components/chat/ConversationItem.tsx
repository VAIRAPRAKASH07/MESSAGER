import React from 'react';
import { Avatar } from '../common/Avatar';
import { Pin, VolumeX, Shield, Check, CheckCheck } from 'lucide-react';
import { formatConversationTime, formatCommunicationId } from '../../lib/utils';
import type { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  isTyping?: boolean;
  isCloseFriend?: boolean;
  onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  isTyping = false,
  isCloseFriend = false,
  onClick,
}) => {
  const partner = conversation.other_member;
  const lastMsg = conversation.last_message;
  const name = partner?.display_name || 'Contact';
  const commId = partner?.communication_id;

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3.5 py-3 rounded-2xl cursor-pointer transition-all duration-150 select-none ${
        isActive
          ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/20'
          : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
      }`}
    >
      {/* Partner Avatar */}
      <Avatar
        name={name}
        avatarUrl={partner?.avatar_url}
        isOnline={partner?.is_online}
        showOnlineStatus={!isActive}
        size="md"
        isCloseFriend={isCloseFriend}
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`font-semibold text-sm truncate ${
                isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {name}
            </span>
            {conversation.is_private_vault && (
              <Shield className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-white' : 'text-privacy-500'}`} />
            )}
          </div>

          <span
            className={`text-[10px] font-medium flex-shrink-0 ${
              isActive ? 'text-brand-100' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {formatConversationTime(conversation.updated_at)}
          </span>
        </div>

        {/* Snippet / Typing Indicator */}
        <div className="flex items-center justify-between gap-2">
          {isTyping ? (
            <span
              className={`text-xs italic font-medium animate-pulse truncate ${
                isActive ? 'text-brand-100' : 'text-brand-600 dark:text-brand-400'
              }`}
            >
              typing...
            </span>
          ) : (
            <p
              className={`text-xs truncate ${
                isActive
                  ? 'text-brand-100'
                  : conversation.unread_count
                  ? 'font-semibold text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {lastMsg?.is_deleted
                ? 'Message deleted'
                : lastMsg?.message_type === 'image'
                ? '📷 Photo'
                : lastMsg?.content || `ID #${formatCommunicationId(commId)}`}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {conversation.is_muted && (
              <VolumeX className={`w-3 h-3 ${isActive ? 'text-brand-200' : 'text-slate-400'}`} />
            )}
            {conversation.is_pinned && (
              <Pin className={`w-3 h-3 ${isActive ? 'text-brand-200' : 'text-brand-500'}`} />
            )}
            {Boolean(conversation.unread_count && conversation.unread_count > 0 && !isActive) && (
              <span className="min-w-4 h-4 px-1 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {conversation.unread_count}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

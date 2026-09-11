import React from 'react';
import { ConversationItem } from './ConversationItem';
import { MessageSquarePlus, Shield } from 'lucide-react';
import { Button } from '../common/Button';
import type { Conversation } from '../../types';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  typingUsers: Record<string, boolean>;
  closeFriends: string[];
  onSelectConversation: (id: string) => void;
  onOpenSearch: () => void;
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  typingUsers,
  closeFriends,
  onSelectConversation,
  onOpenSearch,
  emptyTitle = 'No conversations yet',
  emptySubtitle = 'Search for a Communication ID to start your first private chat.',
}) => {
  // Sort conversations: Pinned first, then by updated_at descending
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  if (sortedConversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-3">
          <MessageSquarePlus className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          {emptyTitle}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
          {emptySubtitle}
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={onOpenSearch}
          className="mt-4 rounded-xl"
        >
          Find by Communication ID
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
      {sortedConversations.map((convo) => {
        const otherUserId = convo.other_member?.id || '';
        const isCF = closeFriends.includes(otherUserId);
        const isTyping = Boolean(typingUsers[convo.id]);

        return (
          <ConversationItem
            key={convo.id}
            conversation={convo}
            isActive={convo.id === activeConversationId}
            isTyping={isTyping}
            isCloseFriend={isCF}
            onClick={() => onSelectConversation(convo.id)}
          />
        );
      })}
    </div>
  );
};

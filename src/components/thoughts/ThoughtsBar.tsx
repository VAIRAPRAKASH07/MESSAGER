import React from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import type { Thought } from '../../types';

interface ThoughtsBarProps {
  onOpenCreateThought: () => void;
  onSelectThought: (thought: Thought) => void;
}

export const ThoughtsBar: React.FC<ThoughtsBarProps> = ({
  onOpenCreateThought,
  onSelectThought,
}) => {
  const { profile } = useAuth();
  const { thoughts, myThought, closeFriends } = useRealtime();

  // Filter thoughts: don't include expired or my own in the contacts row
  const now = new Date();
  const contactThoughts = thoughts.filter((t) => {
    return t.user_id !== profile?.id && new Date(t.expires_at) > now;
  });

  return (
    <div className="py-2.5 px-3 border-b border-slate-100 dark:border-slate-800/80">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
        {/* My Thought Tile */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
          <div
            className="relative"
            onClick={() => (myThought ? onSelectThought(myThought) : onOpenCreateThought())}
          >
            <Avatar
              name={profile?.display_name || 'You'}
              avatarUrl={profile?.avatar_url}
              size="md"
              hasUnseenThought={Boolean(myThought)}
              className="transition-transform group-hover:scale-105"
            />
            {!myThought && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateThought();
                }}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-sm border-2 border-white dark:border-slate-900 transition-transform active:scale-95"
                title="Add Thought"
              >
                <Plus className="w-3 h-3 stroke-[3]" />
              </button>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[56px] truncate">
            {myThought ? 'My Thought' : 'Add Thought'}
          </span>
        </div>

        {/* Contact Thoughts */}
        {contactThoughts.map((thought) => {
          const isCF = closeFriends.includes(thought.user_id);
          const authorName = thought.user_profile?.display_name || 'Contact';

          return (
            <div
              key={thought.id}
              onClick={() => onSelectThought(thought)}
              className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
            >
              <Avatar
                name={authorName}
                avatarUrl={thought.user_profile?.avatar_url}
                size="md"
                hasUnseenThought={!thought.has_viewed}
                isCloseFriend={isCF}
                className="transition-transform group-hover:scale-105"
              />
              <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 max-w-[56px] truncate text-center">
                {authorName.split(' ')[0]}
              </span>
            </div>
          );
        })}

        {contactThoughts.length === 0 && !myThought && (
          <div
            onClick={onOpenCreateThought}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span className="whitespace-nowrap">Share a 24h Thought</span>
          </div>
        )}
      </div>
    </div>
  );
};

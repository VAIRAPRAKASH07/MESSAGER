import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Shield, 
  VolumeX, 
  Volume2, 
  Sparkles, 
  UserX, 
  Copy, 
  Check,
  Phone,
  Video,
  Lock,
  Unlock
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { formatCommunicationId, copyToClipboard } from '../../lib/utils';
import type { Conversation, Profile } from '../../types';

interface ChatHeaderProps {
  conversation: Conversation;
  isCloseFriend?: boolean;
  isTyping?: boolean;
  onBack?: () => void;
  onTogglePrivateVault: () => void;
  onToggleCloseFriend: () => void;
  onToggleMute: () => void;
  onBlockUser: () => void;
  onViewProfile: (profile: Profile) => void;
  onStartVoiceCall?: () => void;
  onStartVideoCall?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  isCloseFriend = false,
  isTyping = false,
  onBack,
  onTogglePrivateVault,
  onToggleCloseFriend,
  onToggleMute,
  onBlockUser,
  onViewProfile,
  onStartVoiceCall,
  onStartVideoCall,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const partner = conversation.other_member;
  const name = partner?.display_name || 'User';
  const commId = partner?.communication_id;

  const handleCopyId = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (commId) {
      const ok = await copyToClipboard(commId);
      if (ok) {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
    }
  };

  return (
    <div className="h-16 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 z-20 select-none">
      {/* Left: Back button (mobile) + Avatar + Partner Info */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div
          onClick={() => partner && onViewProfile(partner)}
          className="flex items-center gap-3 cursor-pointer min-w-0 group"
        >
          <Avatar
            name={name}
            avatarUrl={partner?.avatar_url}
            isOnline={partner?.is_online}
            showOnlineStatus
            size="md"
            isCloseFriend={isCloseFriend}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400">
                {name}
              </span>
              {conversation.is_private_vault && (
                <span
                  className="px-1.5 py-0.5 rounded bg-privacy-50 dark:bg-privacy-950 text-privacy-700 dark:text-privacy-300 text-[10px] font-bold flex items-center gap-0.5 shadow-2xs"
                  title="Protected in Private Chat Vault"
                >
                  <Lock className="w-2.5 h-2.5" /> Private Vault
                </span>
              )}
              {isCloseFriend && (
                <span
                  className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-0.5"
                  title="In your Close Friends list"
                >
                  <Sparkles className="w-2.5 h-2.5" /> Close Friend
                </span>
              )}
            </div>

            {/* Subtitle: Typing indicator or Communication ID */}
            <div className="flex items-center gap-2 text-xs">
              {isTyping ? (
                <span className="text-brand-600 dark:text-brand-400 font-medium animate-pulse">
                  typing...
                </span>
              ) : (
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-brand-500 transition-colors"
                  title="Communication ID (Click to copy)"
                >
                  <span>ID #{formatCommunicationId(commId)}</span>
                  {copiedId ? (
                    <Check className="w-2.5 h-2.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-50" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions: Voice Call, Video Call, Direct Private Toggle, Menu */}
      <div className="flex items-center gap-1 sm:gap-2 relative">
        {/* Direct Private Chat Toggle Button */}
        <button
          onClick={onTogglePrivateVault}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            conversation.is_private_vault
              ? 'bg-privacy-600 text-white shadow-sm hover:bg-privacy-700'
              : 'bg-slate-100 hover:bg-privacy-50 text-slate-600 hover:text-privacy-700 dark:bg-slate-800 dark:hover:bg-privacy-950 dark:text-slate-300 dark:hover:text-privacy-300'
          }`}
          title={
            conversation.is_private_vault
              ? 'Click to remove from Private Chat'
              : 'Click to move conversation to Private Chat'
          }
        >
          {conversation.is_private_vault ? (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Private Active</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5 text-privacy-500" />
              <span className="hidden sm:inline">Make Private</span>
            </>
          )}
        </button>

        {/* 1. Voice Call Button (Instagram Style) */}
        <button
          onClick={onStartVoiceCall}
          className="p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Voice Call"
          aria-label="Start voice call"
        >
          <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 2. Video Call Button with Active Dot (Instagram Style) */}
        <button
          onClick={onStartVideoCall}
          className="relative p-2 text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Video Call"
          aria-label="Start video call"
        >
          <Video className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900" />
        </button>

        {/* 3. More Options Menu */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Conversation options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-12 w-60 glass-dropdown p-1.5 z-40 animate-scale-in text-xs font-medium">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onTogglePrivateVault();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Shield className="w-4 h-4 text-privacy-500" />
                <span>
                  {conversation.is_private_vault
                    ? 'Remove from Private Vault'
                    : 'Move to Private Vault'}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onToggleCloseFriend();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>
                  {isCloseFriend
                    ? 'Remove from Close Friends'
                    : 'Add to Close Friends'}
                </span>
              </button>

              <button
                onClick={() => {
                  setShowMenu(false);
                  onToggleMute();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                {conversation.is_muted ? (
                  <>
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <span>Unmute notifications</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span>Mute notifications</span>
                  </>
                )}
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                onClick={() => {
                  setShowMenu(false);
                  onBlockUser();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left font-semibold"
              >
                <UserX className="w-4 h-4" />
                <span>Block this user</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

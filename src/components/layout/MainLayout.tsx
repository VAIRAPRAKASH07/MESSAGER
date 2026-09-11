import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ChatHeader } from '../chat/ChatHeader';
import { MessageList } from '../chat/MessageList';
import { MessageInput } from '../chat/MessageInput';
import { SearchModal } from '../chat/SearchModal';
import { CreateThoughtModal } from '../thoughts/CreateThoughtModal';
import { ThoughtViewerModal } from '../thoughts/ThoughtViewerModal';
import { PrivateChatUnlock } from '../privateChat/PrivateChatUnlock';
import { PrivateChatSetupModal } from '../privateChat/PrivateChatSetupModal';
import { ContactListModal } from '../contacts/ContactListModal';
import { SettingsModal } from '../settings/SettingsModal';
import { CallModal } from '../chat/CallModal';
import { MessageSquare, ShieldCheck, KeyRound, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import { usePrivateChat } from '../../contexts/PrivateChatContext';
import type { Thought, Message, Profile } from '../../types';

export const MainLayout: React.FC = () => {
  const { user, profile } = useAuth();
  const {
    activeConversation,
    activeMessages,
    typingUsers,
    closeFriends,
    setActiveConversationId,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    togglePinConversation,
    toggleMuteConversation,
    moveToPrivateVault,
    toggleCloseFriend,
    blockUser,
    startConversationWithUser,
  } = useRealtime();

  const [activeTab, setActiveTab] = useState<'chats' | 'private' | 'contacts'>('chats');
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);

  // Modals & Calls
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateThoughtOpen, setIsCreateThoughtOpen] = useState(false);
  const [activeThoughtView, setActiveThoughtView] = useState<Thought | null>(null);
  const [isPrivateUnlockOpen, setIsPrivateUnlockOpen] = useState(false);
  const [isPrivateSetupOpen, setIsPrivateSetupOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<{ type: 'audio' | 'video'; partner: Profile } | null>(null);

  const isPartnerCF = Boolean(
    activeConversation?.other_member && closeFriends.includes(activeConversation.other_member.id)
  );
  const isTyping = Boolean(activeConversation && typingUsers[activeConversation.id]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans">
      {/* 1. Left Sidebar: Visible on Desktop or when no active conversation on mobile */}
      <div
        className={`${
          activeConversation ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 flex-shrink-0 h-full`}
      >
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenCreateThought={() => setIsCreateThoughtOpen(true)}
          onSelectThought={(t) => setActiveThoughtView(t)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenContacts={() => setIsContactsOpen(true)}
          onOpenPrivateChatUnlock={() => setIsPrivateUnlockOpen(true)}
        />
      </div>

      {/* 2. Main Chat Area: Full screen on mobile when active, right pane on desktop */}
      <main
        className={`${
          !activeConversation ? 'hidden md:flex' : 'flex'
        } flex-1 flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative`}
      >
        {activeConversation ? (
          <div className="flex flex-col h-full overflow-hidden">
            <ChatHeader
              conversation={activeConversation}
              isCloseFriend={isPartnerCF}
              isTyping={isTyping}
              onBack={() => setActiveConversationId(null)}
              onTogglePrivateVault={() => {
                const willBePrivate = !activeConversation.is_private_vault;
                moveToPrivateVault(activeConversation.id, willBePrivate);
                if (willBePrivate) {
                  setActiveTab('private');
                }
              }}
              onToggleCloseFriend={() => {
                if (activeConversation.other_member) {
                  toggleCloseFriend(activeConversation.other_member.id);
                }
              }}
              onToggleMute={() => toggleMuteConversation(activeConversation.id)}
              onStartVoiceCall={() => {
                if (activeConversation.other_member) {
                  setActiveCall({ type: 'audio', partner: activeConversation.other_member });
                }
              }}
              onStartVideoCall={() => {
                if (activeConversation.other_member) {
                  setActiveCall({ type: 'video', partner: activeConversation.other_member });
                }
              }}
              onBlockUser={() => {
                if (activeConversation.other_member) {
                  if (confirm(`Block ${activeConversation.other_member.display_name}? You will no longer receive messages.`)) {
                    blockUser(activeConversation.other_member.id);
                  }
                }
              }}
              onViewProfile={(p) => {
                // Open profile view
              }}
            />

            <MessageList
              messages={activeMessages}
              currentUserId={user?.id || ''}
              isPrivateVault={activeConversation.is_private_vault}
              onReply={(msg) => setReplyingToMessage(msg)}
              onEdit={(msg) => {
                const updated = prompt('Edit message:', msg.content);
                if (updated && updated.trim()) {
                  editMessage(msg.id, updated.trim());
                }
              }}
              onDelete={(msgId) => {
                if (confirm('Delete this message?')) {
                  deleteMessage(msgId);
                }
              }}
              onReact={(msgId, emoji) => reactToMessage(msgId, emoji)}
            />

            <MessageInput
              onSendMessage={sendMessage}
              replyingToMessage={replyingToMessage}
              onCancelReply={() => setReplyingToMessage(null)}
              isPrivateVault={activeConversation.is_private_vault}
            />
          </div>
        ) : (
          /* Desktop Empty State */
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center select-none">
            <div className="w-16 h-16 rounded-3xl bg-brand-50 dark:bg-brand-950/80 text-brand-500 flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              MESSAGER
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm leading-relaxed">
              Select a conversation from the sidebar or find a contact using their 8-digit Communication ID.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium text-xs shadow-sm transition-all"
              >
                Search by Communication ID
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onStartChat={(prof) => startConversationWithUser(prof)}
      />

      <CreateThoughtModal
        isOpen={isCreateThoughtOpen}
        onClose={() => setIsCreateThoughtOpen(false)}
      />

      <ThoughtViewerModal
        thought={activeThoughtView}
        onClose={() => setActiveThoughtView(null)}
        onReplyInChat={(targetUserId, text) => {
          // Open chat with target and send reply
          const targetConvo = [
            ...((useRealtime as any)().conversations || []),
          ].find((c: any) => c.other_member?.id === targetUserId);
          if (targetConvo) {
            setActiveConversationId(targetConvo.id);
            sendMessage(text);
          }
        }}
      />

      <PrivateChatUnlock
        isOpen={isPrivateUnlockOpen}
        onClose={() => setIsPrivateUnlockOpen(false)}
        onOpenSetup={() => setIsPrivateSetupOpen(true)}
      />

      <PrivateChatSetupModal
        isOpen={isPrivateSetupOpen}
        onClose={() => setIsPrivateSetupOpen(false)}
      />

      <ContactListModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onStartChat={(prof) => startConversationWithUser(prof)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenPrivateChatSetup={() => setIsPrivateSetupOpen(true)}
      />

      {/* Interactive Instagram-Style Voice & Video Calling */}
      {activeCall && (
        <CallModal
          isOpen={Boolean(activeCall)}
          callType={activeCall.type}
          partner={activeCall.partner}
          onEndCall={() => setActiveCall(null)}
        />
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { 
  Users, 
  Sparkles, 
  UserPlus, 
  Check, 
  X, 
  MessageSquare, 
  ShieldAlert, 
  Copy, 
  KeyRound 
} from 'lucide-react';
import { useRealtime } from '../../contexts/RealtimeContext';
import { formatCommunicationId, copyToClipboard } from '../../lib/utils';
import type { Contact, Profile } from '../../types';

interface ContactListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onStartChat: (profile: Profile) => void;
}

export const ContactListModal: React.FC<ContactListModalProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onStartChat,
}) => {
  const { 
    contacts, 
    contactRequests, 
    closeFriends, 
    toggleCloseFriend, 
    respondToContactRequest,
    blockUser 
  } = useRealtime();

  const [activeTab, setActiveTab] = useState<'contacts' | 'requests' | 'close_friends'>('contacts');

  const closeFriendsContacts = contacts.filter((c) => closeFriends.includes(c.contact_user_id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contacts & Relationships"
      subtitle="Manage your privacy network and Close Friends circle"
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-2 rounded-xl transition-all ${
              activeTab === 'contacts'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            All Contacts ({contacts.length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'requests'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>Requests</span>
            {contactRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] flex items-center justify-center">
                {contactRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('close_friends')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'close_friends'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Close Friends ({closeFriendsContacts.length})</span>
          </button>
        </div>

        {/* Tab 1: All Contacts */}
        {activeTab === 'contacts' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Connected by Communication ID
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              >
                Add by ID
              </Button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No contacts added yet. Search for a Communication ID to connect.
                </div>
              ) : (
                contacts.map((contact) => {
                  const isCF = closeFriends.includes(contact.contact_user_id);
                  const prof = contact.contact_profile;

                  return (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          name={prof.display_name}
                          avatarUrl={prof.avatar_url}
                          size="md"
                          isCloseFriend={isCF}
                        />
                        <div className="min-w-0 text-left">
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {prof.display_name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400 block">
                            ID #{formatCommunicationId(prof.communication_id)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleCloseFriend(contact.contact_user_id)}
                          className={`p-2 rounded-xl border transition-colors ${
                            isCF
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                              : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title={isCF ? 'Remove from Close Friends' : 'Add to Close Friends'}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            onClose();
                            onStartChat(prof);
                          }}
                          leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                        >
                          Chat
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Requests */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {contactRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No pending contact requests.
                </div>
              ) : (
                contactRequests.map((req) => {
                  const sender = req.sender_profile;
                  if (!sender) return null;

                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3 min-w-0 text-left">
                        <Avatar
                          name={sender.display_name}
                          avatarUrl={sender.avatar_url}
                          size="md"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {sender.display_name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            ID #{formatCommunicationId(sender.communication_id)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => respondToContactRequest(req.id, true)}
                          leftIcon={<Check className="w-3.5 h-3.5" />}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => respondToContactRequest(req.id, false)}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Close Friends */}
        {activeTab === 'close_friends' && (
          <div className="space-y-3 text-left">
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Private Close Friends Ring</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                Close Friends status is strictly private. Friends are never notified when added or removed, and no one else can see your list.
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {closeFriendsContacts.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No close friends selected. Mark contacts with the star icon to include them in your private circle.
                </div>
              ) : (
                closeFriendsContacts.map((contact) => {
                  const prof = contact.contact_profile;
                  return (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          name={prof.display_name}
                          avatarUrl={prof.avatar_url}
                          size="md"
                          isCloseFriend={true}
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {prof.display_name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            ID #{formatCommunicationId(prof.communication_id)}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleCloseFriend(contact.contact_user_id)}
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

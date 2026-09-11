import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { Search, KeyRound, MessageSquare, UserPlus, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useRealtime } from '../../contexts/RealtimeContext';
import { formatCommunicationId, isValidCommunicationId } from '../../lib/utils';
import type { Profile } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (profile: Profile) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onStartChat,
}) => {
  const { searchByCommunicationId, sendContactRequest, contacts } = useRealtime();

  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<Profile | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResult(null);
      setHasSearched(false);
      setRequestSent(false);
    }
  }, [isOpen]);

  const handleSearch = async (val: string) => {
    const clean = val.replace(/\s+/g, '');
    setQuery(clean);
    setRequestSent(false);

    if (clean.length < 6) {
      setResult(null);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    const found = await searchByCommunicationId(clean);
    setResult(found);
    setHasSearched(true);
    setIsSearching(false);
  };

  const handleSendRequest = async () => {
    if (result) {
      const ok = await sendContactRequest(result.id);
      if (ok) setRequestSent(true);
    }
  };

  const isAlreadyContact = contacts.some((c) => c.contact_user_id === result?.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Find User by Communication ID"
      subtitle="Connect securely using an 8-digit permanent ID"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Search Input */}
        <div>
          <Input
            label="Communication ID"
            placeholder="e.g. 48291045"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<KeyRound className="w-4 h-4 text-brand-500" />}
            maxLength={10}
            autoFocus
          />
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
            Communication IDs contain numbers only. No email or phone is required.
          </p>
        </div>

        {/* Quick Suggestion Chips for Demo */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Try test IDs:</span>
          <button
            onClick={() => handleSearch('48291045')}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
          >
            4829 1045 (Alex)
          </button>
          <button
            onClick={() => handleSearch('62740918')}
            className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]"
          >
            6274 0918 (Dr. Sam)
          </button>
        </div>

        {/* Result Area */}
        <div className="min-h-[140px] flex items-center justify-center">
          {isSearching ? (
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
              <span>Looking up Communication ID...</span>
            </div>
          ) : result ? (
            <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 animate-scale-in">
              <div className="flex items-center gap-3.5">
                <Avatar
                  name={result.display_name}
                  avatarUrl={result.avatar_url}
                  isOnline={result.is_online}
                  showOnlineStatus
                  size="lg"
                />

                <div className="min-w-0 flex-1 text-left">
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {result.display_name}
                  </h4>
                  <div className="font-mono text-xs text-brand-600 dark:text-brand-400 font-bold mt-0.5">
                    ID #{formatCommunicationId(result.communication_id)}
                  </div>
                  {result.bio && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {result.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-2">
                {!isAlreadyContact && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSendRequest}
                    disabled={requestSent}
                    leftIcon={requestSent ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <UserPlus className="w-3.5 h-3.5" />}
                  >
                    {requestSent ? 'Request Sent' : 'Add Contact'}
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    onClose();
                    onStartChat(result);
                  }}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Start Chat
                </Button>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center p-4">
              <AlertCircle className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                No user found with Communication ID "{query}"
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Double-check the 8-digit number with the recipient.
              </p>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs">
              Enter at least 6 digits to search.
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

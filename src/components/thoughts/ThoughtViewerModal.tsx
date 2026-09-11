import React, { useState, useEffect, useRef } from 'react';
import { Avatar } from '../common/Avatar';
import { 
  X, 
  Trash2, 
  Eye, 
  Sparkles, 
  Clock, 
  Send, 
  ChevronRight, 
  ShieldCheck 
} from 'lucide-react';
import { formatThoughtTimeRemaining, formatCommunicationId } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtime } from '../../contexts/RealtimeContext';
import type { Thought } from '../../types';

interface ThoughtViewerModalProps {
  thought: Thought | null;
  onClose: () => void;
  onReplyInChat?: (targetUserId: string, replyText: string) => void;
}

export const ThoughtViewerModal: React.FC<ThoughtViewerModalProps> = ({
  thought,
  onClose,
  onReplyInChat,
}) => {
  const { user } = useAuth();
  const { deleteThought, recordThoughtView, closeFriends } = useRealtime();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showViewersDrawer, setShowViewersDrawer] = useState(false);

  const isOwner = thought?.user_id === user?.id;

  // Record view on open
  useEffect(() => {
    if (thought && !isOwner) {
      recordThoughtView(thought.id);
    }
    setProgress(0);
    setIsPaused(false);
  }, [thought, isOwner]);

  // Timed progress bar (6 seconds total)
  useEffect(() => {
    if (!thought || isPaused || showViewersDrawer) return;

    const interval = 50; // 50ms tick
    const increment = 100 / (6000 / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onClose();
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [thought, isPaused, showViewersDrawer, onClose]);

  if (!thought) return null;

  const isCF = closeFriends.includes(thought.user_id);
  const author = thought.user_profile;
  const gradient = thought.background_style?.gradient || 'from-blue-600 to-indigo-800';
  const style = thought.background_style;

  const handleDelete = async () => {
    await deleteThought(thought.id);
    onClose();
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (onReplyInChat && thought.user_id) {
      onReplyInChat(thought.user_id, `Replying to your Thought: "${thought.content}"\n\n${replyText.trim()}`);
      onClose();
    }
  };

  // Font mapping
  const getFontClass = (font?: string) => {
    switch (font) {
      case 'serif': return 'font-serif italic font-semibold';
      case 'mono': return 'font-mono tracking-wider font-semibold';
      case 'headline': return 'font-black uppercase tracking-tight';
      case 'script': return 'font-serif font-light tracking-wide italic';
      default: return 'font-sans font-bold tracking-normal';
    }
  };

  // Text size mapping
  const getTextSizeClass = (size?: string) => {
    switch (size) {
      case 'sm': return 'text-sm sm:text-base';
      case 'md': return 'text-base sm:text-lg';
      case 'xl': return 'text-2xl sm:text-3xl font-extrabold';
      case '2xl': return 'text-3xl sm:text-4xl font-black';
      default: return 'text-xl sm:text-2xl font-bold';
    }
  };

  // Text styling class
  const getTextStyling = () => {
    let classes = `${getFontClass(style?.font)} ${getTextSizeClass(style?.textSize)} `;
    if (style?.textAlign === 'left') classes += 'text-left ';
    else if (style?.textAlign === 'right') classes += 'text-right ';
    else classes += 'text-center ';

    if (style?.textStyle === 'bubble') {
      classes += 'bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-2xl inline-block shadow-lg ';
    } else if (style?.textStyle === 'glow') {
      classes += 'drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] ';
    } else if (style?.textStyle === 'banner') {
      classes += 'bg-white text-slate-950 px-4 py-1.5 rounded-xl inline-block font-black shadow-md ';
    }
    return classes;
  };

  const getMediaAspectRatioCss = () => {
    switch (style?.aspectRatio) {
      case '9:16': return '9/16';
      case '4:5': return '4/5';
      case '1:1': return '1/1';
      case '16:9': return '16/9';
      default: return undefined;
    }
  };

  const getObjectPositionClass = () => {
    if (style?.mediaPosition === 'top') return 'object-top';
    if (style?.mediaPosition === 'bottom') return 'object-bottom';
    return 'object-center';
  };

  const mediaScale = style?.mediaScale ?? 1.0;
  const mediaFit = style?.mediaFit || 'cover';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      {/* Immersive Thought Card */}
      <div
        className={`relative w-full max-w-sm sm:max-w-md h-[540px] sm:h-[600px] rounded-3xl bg-gradient-to-br ${gradient} text-white flex flex-col justify-between p-5 shadow-2xl overflow-hidden animate-scale-in`}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top: Progress Bar + Header */}
        <div className="space-y-3 z-20">
          {/* Progress Strip */}
          <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75 ease-linear rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Avatar
                name={author?.display_name || 'Author'}
                avatarUrl={author?.avatar_url}
                size="sm"
                isCloseFriend={isCF}
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-white">
                    {author?.display_name || 'User'}
                  </span>
                  {thought.audience === 'close_friends' && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/80 text-[9px] font-bold tracking-wider">
                      CLOSE FRIENDS
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-white/80 font-mono">
                  {formatThoughtTimeRemaining(thought.expires_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
                  title="Delete Thought"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle: Media + Content Container */}
        <div className="my-auto w-full flex flex-col items-center justify-center relative z-10 space-y-3.5 px-3 overflow-hidden">
          {/* Media (image or video) with custom Instagram-style scale, aspect ratio & fit */}
          {thought.media_url && (
            <div
              className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 transition-all flex items-center justify-center bg-black/20"
              style={{
                width: `${Math.min(100, Math.round(mediaScale * (style?.aspectRatio === '9:16' ? 60 : (style?.aspectRatio === '4:5' ? 75 : 90))))}%`,
                aspectRatio: getMediaAspectRatioCss(),
                maxHeight: `${Math.round(mediaScale * (style?.aspectRatio === '9:16' ? 250 : 220))}px`,
              }}
            >
              {thought.media_type === 'image' ? (
                <img
                  src={thought.media_url}
                  alt="Thought media"
                  className={`w-full h-full rounded-2xl ${
                    mediaFit === 'cover' ? 'object-cover' : 'object-contain'
                  } ${getObjectPositionClass()}`}
                />
              ) : (
                <video
                  src={thought.media_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={`w-full h-full rounded-2xl bg-black ${
                    mediaFit === 'cover' ? 'object-cover' : 'object-contain'
                  } ${getObjectPositionClass()}`}
                />
              )}
            </div>
          )}

          {/* Custom Styled Text Content */}
          {thought.content && (
            <div className="w-full text-center">
              <p
                style={{ color: style?.textStyle === 'banner' ? undefined : (style?.textColor || '#FFFFFF') }}
                className={`leading-relaxed tracking-tight break-words drop-shadow-md ${getTextStyling()}`}
              >
                {thought.content}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Bar: Owner Viewers Trigger OR Non-Owner Reply Composer */}
        <div className="z-20 pt-2 border-t border-white/20">
          {isOwner ? (
            <button
              onClick={() => setShowViewersDrawer(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-xs font-semibold text-white transition-colors"
            >
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{thought.views_count || 0} Views</span>
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <form onSubmit={handleSendReply} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Reply to this Thought..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-white/20 placeholder-white/70 text-white text-xs px-3.5 py-2.5 rounded-2xl border border-white/30 focus:outline-none focus:bg-white/30 backdrop-blur-md"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="p-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Viewers Bottom Drawer */}
        {showViewersDrawer && (
          <div className="absolute inset-x-0 bottom-0 max-h-[70%] bg-slate-900/95 text-slate-100 rounded-t-3xl p-5 border-t border-slate-700 backdrop-blur-xl z-30 animate-slide-up flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Thought Viewers ({thought.views_count || 0})
              </span>
              <button
                onClick={() => setShowViewersDrawer(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3">
              {(thought.viewers && thought.viewers.length > 0) ? (
                thought.viewers.map((viewer) => (
                  <div key={viewer.viewer_id} className="flex items-center gap-3">
                    <Avatar
                      name={viewer.viewer_profile.display_name}
                      avatarUrl={viewer.viewer_profile.avatar_url}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1 text-left">
                      <div className="font-semibold text-xs truncate">
                        {viewer.viewer_profile.display_name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        ID #{formatCommunicationId(viewer.viewer_profile.communication_id)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No views yet. Connected contacts will appear here once viewed.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  SwitchCamera, 
  Sparkles, 
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { formatCommunicationId } from '../../lib/utils';
import type { Profile } from '../../types';

interface CallModalProps {
  isOpen: boolean;
  callType: 'audio' | 'video';
  partner: Profile;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  callType,
  partner,
  onEndCall,
}) => {
  const [callStatus, setCallStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize call state & connect simulation after 2.5s
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCallStatus('ringing');
      setCallDuration(0);
      return;
    }

    setCallStatus('ringing');
    setCallDuration(0);

    // If video call, attempt local media stream
    if (callType === 'video') {
      setIsVideoEnabled(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            streamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
          })
          .catch(() => {
            // Camera permission denied or not available, use avatar simulation
          });
      }
    }

    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2400);

    return () => {
      clearTimeout(connectTimer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, callType]);

  // Duration Timer
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  if (!isOpen) return null;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const toggleCamera = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => (t.enabled = !isVideoEnabled));
    }
  };

  const toggleMic = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = isMuted));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in select-none">
      {/* Container Card */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[580px] sm:h-[640px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between p-6 text-white animate-scale-in">
        
        {/* Remote Video Background (If Video Call Connected) */}
        {callType === 'video' && isVideoEnabled ? (
          <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
            {partner.avatar_url ? (
              <img
                src={partner.avatar_url}
                alt={partner.display_name}
                className="w-full h-full object-cover filter brightness-75 scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-slate-900 to-indigo-950 flex items-center justify-center">
                <Avatar name={partner.display_name} size="2xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900" />
        )}

        {/* Top Header info */}
        <div className="relative z-10 text-center space-y-1 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>ID Encrypted Call</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {partner.display_name}
          </h3>

          <div className="text-xs font-mono text-slate-300">
            ID #{formatCommunicationId(partner.communication_id)}
          </div>

          <div className="pt-1">
            {callStatus === 'ringing' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                Ringing...
              </span>
            ) : (
              <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/60">
                {formatDuration(callDuration)}
              </span>
            )}
          </div>
        </div>

        {/* Center: Audio Call Avatar Pulse OR Video Pip Window */}
        <div className="relative z-10 my-auto flex items-center justify-center">
          {callType === 'audio' || !isVideoEnabled ? (
            <div className="relative flex items-center justify-center">
              {callStatus === 'ringing' && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-brand-500/20 animate-ping" />
                  <div className="absolute w-48 h-48 rounded-full bg-brand-500/10 animate-pulse" />
                </>
              )}
              <Avatar
                name={partner.display_name}
                avatarUrl={partner.avatar_url}
                size="2xl"
                className="shadow-2xl ring-4 ring-white/10"
              />
            </div>
          ) : (
            /* Local Video Picture-in-Picture window */
            <div className="absolute right-4 top-4 w-28 h-36 sm:w-32 sm:h-44 rounded-2xl bg-black border border-white/20 shadow-xl overflow-hidden z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <span className="absolute bottom-1 left-2 text-[9px] font-semibold bg-black/60 px-1.5 py-0.5 rounded text-white/90">
                You
              </span>
            </div>
          )}
        </div>

        {/* Bottom Call Controls (Instagram style) */}
        <div className="relative z-10 pb-4 space-y-4">
          <div className="flex items-center justify-center gap-4">
            {/* Mute Mic */}
            <button
              onClick={toggleMic}
              className={`p-3.5 rounded-full transition-all duration-150 ${
                isMuted
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Video Camera Toggle */}
            <button
              onClick={toggleCamera}
              className={`p-3.5 rounded-full transition-all duration-150 ${
                !isVideoEnabled
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-3.5 rounded-full transition-all duration-150 ${
                !isSpeakerOn
                  ? 'bg-white/10 text-white/60'
                  : 'bg-white/15 hover:bg-white/25 text-white backdrop-blur-md'
              }`}
              title="Toggle speaker"
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={onEndCall}
              className="p-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white shadow-xl shadow-rose-600/40 transition-transform"
              title="End call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

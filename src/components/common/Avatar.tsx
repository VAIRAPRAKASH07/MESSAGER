import React from 'react';
import { getAvatarGradient, getInitials } from '../../lib/utils';

interface AvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  showOnlineStatus?: boolean;
  isCloseFriend?: boolean;
  hasUnseenThought?: boolean;
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'w-7 h-7 text-xs',
  sm: 'w-9 h-9 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
  '2xl': 'w-28 h-28 text-2xl',
};

const dotSizes = {
  xs: 'w-2 h-2 border',
  sm: 'w-2.5 h-2.5 border-[1.5px]',
  md: 'w-3 h-3 border-2',
  lg: 'w-3.5 h-3.5 border-2',
  xl: 'w-4 h-4 border-2',
  '2xl': 'w-5 h-5 border-2',
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  isOnline = false,
  showOnlineStatus = false,
  isCloseFriend = false,
  hasUnseenThought = false,
  className = '',
  onClick,
}) => {
  const gradient = getAvatarGradient(name);
  const initials = getInitials(name);

  const ringStyles = hasUnseenThought
    ? isCloseFriend
      ? 'ring-[2.5px] ring-teal-500 ring-offset-2 ring-offset-canvas-light dark:ring-offset-canvas-dark'
      : 'ring-[2.5px] ring-brand-500 ring-offset-2 ring-offset-canvas-light dark:ring-offset-canvas-dark'
    : '';

  return (
    <div
      className={`relative inline-flex flex-shrink-0 select-none items-center justify-center rounded-full transition-transform ${
        onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-full shadow-sm ${sizeClasses[size]} ${ringStyles}`}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} font-semibold text-white`}
          >
            {initials}
          </div>
        )}
      </div>

      {showOnlineStatus && isOnline && (
        <span
          className={`absolute bottom-0 right-0 rounded-full bg-teal-500 border-white dark:border-slate-900 shadow-sm ${dotSizes[size]}`}
          title="Online"
        />
      )}
    </div>
  );
};

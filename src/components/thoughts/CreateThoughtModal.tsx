import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { 
  Sparkles, 
  Clock, 
  Users, 
  Eye, 
  Image as ImageIcon, 
  Film, 
  X, 
  Type, 
  Maximize2, 
  Minimize2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Palette, 
  Sliders,
  ZoomIn,
  ZoomOut,
  Layers,
  Crop,
  Square,
  Smartphone,
  Tv,
  MoveVertical
} from 'lucide-react';
import { useRealtime } from '../../contexts/RealtimeContext';
import type { AudienceType, ThoughtStyleOptions } from '../../types';

interface CreateThoughtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRADIENT_THEMES = [
  { id: 'sunset', label: 'Instagram Sunset', class: 'from-pink-500 via-rose-500 to-amber-500' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', class: 'from-purple-600 via-indigo-600 to-cyan-500' },
  { id: 'ocean', label: 'Deep Ocean', class: 'from-blue-600 to-teal-700' },
  { id: 'aurora', label: 'Emerald Aurora', class: 'from-emerald-600 to-cyan-700' },
  { id: 'berry', label: 'Berry Crush', class: 'from-fuchsia-600 to-pink-600' },
  { id: 'solar', label: 'Solar Gold', class: 'from-yellow-400 via-orange-500 to-red-500' },
  { id: 'velvet', label: 'Midnight Velvet', class: 'from-slate-900 via-purple-950 to-slate-950' },
  { id: 'noir', label: 'Luxury Noir', class: 'from-neutral-900 to-stone-950' },
];

const TEXT_COLORS = [
  { label: 'White', color: '#FFFFFF', class: 'bg-white border-slate-300' },
  { label: 'Black', color: '#0F172A', class: 'bg-slate-900 border-slate-700' },
  { label: 'Neon Yellow', color: '#FDE047', class: 'bg-yellow-300 border-yellow-400' },
  { label: 'Rose Pink', color: '#FB7185', class: 'bg-rose-400 border-rose-500' },
  { label: 'Electric Cyan', color: '#38BDF8', class: 'bg-sky-400 border-sky-500' },
  { label: 'Neon Lime', color: '#A3E635', class: 'bg-lime-400 border-lime-500' },
  { label: 'Electric Violet', color: '#C084FC', class: 'bg-purple-400 border-purple-500' },
  { label: 'Sunset Orange', color: '#FB923C', class: 'bg-orange-400 border-orange-500' },
];

const FONT_FAMILIES = [
  { id: 'sans', label: 'Modern', class: 'font-sans font-bold tracking-normal' },
  { id: 'serif', label: 'Serif', class: 'font-serif italic font-semibold' },
  { id: 'mono', label: 'Mono', class: 'font-mono tracking-wider font-semibold' },
  { id: 'headline', label: 'Headline', class: 'font-black uppercase tracking-tight' },
  { id: 'script', label: 'Elegant', class: 'font-serif font-light tracking-wide italic' },
];

const TEXT_SIZES = [
  { id: 'sm', label: 'Small', class: 'text-sm sm:text-base' },
  { id: 'md', label: 'Medium', class: 'text-base sm:text-lg' },
  { id: 'lg', label: 'Large', class: 'text-xl sm:text-2xl font-bold' },
  { id: 'xl', label: 'Extra Large', class: 'text-2xl sm:text-3xl font-extrabold' },
  { id: '2xl', label: 'Hero', class: 'text-3xl sm:text-4xl font-black' },
];

const TEXT_STYLES: Array<{ id: 'clean' | 'bubble' | 'glow' | 'banner'; label: string }> = [
  { id: 'clean', label: 'Clean' },
  { id: 'bubble', label: 'Highlight' },
  { id: 'glow', label: 'Neon Glow' },
  { id: 'banner', label: 'Solid Banner' },
];

const ASPECT_RATIOS: Array<{ id: '9:16' | '4:5' | '1:1' | '16:9' | 'original'; label: string; icon: React.ReactNode; cssRatio?: string }> = [
  { id: 'original', label: 'Original', icon: <Maximize2 className="w-3.5 h-3.5" /> },
  { id: '9:16', label: '9:16 Story', icon: <Smartphone className="w-3.5 h-3.5" />, cssRatio: '9/16' },
  { id: '4:5', label: '4:5 Portrait', icon: <Crop className="w-3.5 h-3.5" />, cssRatio: '4/5' },
  { id: '1:1', label: '1:1 Square', icon: <Square className="w-3.5 h-3.5" />, cssRatio: '1/1' },
  { id: '16:9', label: '16:9 Wide', icon: <Tv className="w-3.5 h-3.5" />, cssRatio: '16/9' },
];

export const CreateThoughtModal: React.FC<CreateThoughtModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { createThought } = useRealtime();

  const [content, setContent] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(GRADIENT_THEMES[0]);
  const [audience, setAudience] = useState<AudienceType>('contacts');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Instagram-style Typography & Color Settings
  const [selectedFont, setSelectedFont] = useState(FONT_FAMILIES[0]);
  const [selectedSize, setSelectedSize] = useState(TEXT_SIZES[2]); // Large by default
  const [selectedColor, setSelectedColor] = useState(TEXT_COLORS[0]);
  const [textStyleMode, setTextStyleMode] = useState<'clean' | 'bubble' | 'glow' | 'banner'>('clean');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Instagram-style Media Resizing & Aspect Ratio Settings
  const [mediaPreview, setMediaPreview] = useState<{ url: string; type: 'image' | 'video'; fileName: string } | null>(null);
  const [mediaScale, setMediaScale] = useState<number>(1.0); // 0.5 to 1.4
  const [mediaFit, setMediaFit] = useState<'cover' | 'contain'>('cover');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '4:5' | '1:1' | '16:9' | 'original'>('original');
  const [mediaPosition, setMediaPosition] = useState<'center' | 'top' | 'bottom'>('center');
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Active editor tab
  const [editorTab, setEditorTab] = useState<'text' | 'media' | 'background' | 'audience'>('text');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>, mediaType: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaError(null);

    // 25 MB limit for thoughts
    const MAX_BYTES = 25 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      setMediaError('File too large. Maximum size is 25 MB.');
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setMediaPreview({ url: previewUrl, type: mediaType, fileName: file.name });
    setEditorTab('media');
    e.target.value = '';
  };

  const clearMedia = () => {
    if (mediaPreview?.url) URL.revokeObjectURL(mediaPreview.url);
    setMediaPreview(null);
    setMediaError(null);
  };

  const handleClose = () => {
    clearMedia();
    setContent('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaPreview) return;

    setIsSubmitting(true);
    await createThought(
      content.trim(),
      mediaPreview?.type || 'text',
      mediaPreview?.url,
      selectedTheme.class,
      audience,
      {
        theme: selectedTheme.id,
        gradient: selectedTheme.class,
        font: selectedFont.id,
        textSize: selectedSize.id,
        textColor: selectedColor.color,
        textStyle: textStyleMode,
        textAlign,
        mediaScale,
        mediaFit,
        aspectRatio,
        mediaPosition,
      }
    );
    setIsSubmitting(false);
    setContent('');
    clearMedia();
    onClose();
  };

  // Helper for text highlight styling
  const getTextStylingClasses = () => {
    let classes = `${selectedFont.class} ${selectedSize.class} `;
    if (textAlign === 'left') classes += 'text-left ';
    if (textAlign === 'center') classes += 'text-center ';
    if (textAlign === 'right') classes += 'text-right ';

    if (textStyleMode === 'bubble') {
      classes += 'bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-2xl inline-block shadow-lg ';
    } else if (textStyleMode === 'glow') {
      classes += 'drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] ';
    } else if (textStyleMode === 'banner') {
      classes += 'bg-white text-slate-950 px-4 py-1.5 rounded-xl inline-block font-black shadow-md ';
    }
    return classes;
  };

  const getMediaAspectRatioCss = () => {
    switch (aspectRatio) {
      case '9:16': return '9/16';
      case '4:5': return '4/5';
      case '1:1': return '1/1';
      case '16:9': return '16/9';
      default: return undefined;
    }
  };

  const getObjectPositionClass = () => {
    if (mediaPosition === 'top') return 'object-top';
    if (mediaPosition === 'bottom') return 'object-bottom';
    return 'object-center';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Instagram-Style Thought"
      subtitle="Customize aspect ratio, scale, fonts, colors, and text styles with live preview"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Visual Story Card Preview Canvas */}
        <div
          className={`w-full h-80 sm:h-96 p-5 rounded-3xl bg-gradient-to-br ${selectedTheme.class} text-white flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 select-none`}
        >
          {/* Top Story Header Bar */}
          <div className="flex items-center justify-between text-xs text-white/90 z-20">
            <span className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium">
              <Clock className="w-3.5 h-3.5" /> 24 Hours
            </span>
            <div className="flex items-center gap-2">
              {aspectRatio !== 'original' && (
                <span className="px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[9px] font-mono font-bold tracking-wider">
                  {aspectRatio}
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider">
                {audience.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Middle: Scalable, Resizable & Aspect-Ratio Framed Media + Text Area */}
          <div className="my-auto w-full flex flex-col items-center justify-center relative z-10 space-y-3 overflow-hidden">
            {/* Attached Media Container with Custom Scale, Fit & Aspect Ratio */}
            {mediaPreview && (
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-200 shadow-xl border border-white/20 flex items-center justify-center bg-black/20"
                style={{
                  width: `${Math.min(100, Math.round(mediaScale * (aspectRatio === '9:16' ? 55 : (aspectRatio === '4:5' ? 70 : 85))))}%`,
                  aspectRatio: getMediaAspectRatioCss(),
                  maxHeight: `${Math.round(mediaScale * (aspectRatio === '9:16' ? 210 : 180))}px`,
                }}
              >
                {mediaPreview.type === 'image' ? (
                  <img
                    src={mediaPreview.url}
                    alt="Thought preview"
                    className={`w-full h-full rounded-2xl ${
                      mediaFit === 'cover' ? 'object-cover' : 'object-contain'
                    } ${getObjectPositionClass()}`}
                  />
                ) : (
                  <video
                    src={mediaPreview.url}
                    className={`w-full h-full rounded-2xl bg-black ${
                      mediaFit === 'cover' ? 'object-cover' : 'object-contain'
                    } ${getObjectPositionClass()}`}
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                )}
                <button
                  type="button"
                  onClick={clearMedia}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full hover:bg-black transition-colors z-20"
                  title="Remove media"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Custom Styled Text Display / Textarea */}
            <div className="w-full text-center px-2">
              <textarea
                rows={2}
                placeholder="Type your story..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={180}
                style={{ color: textStyleMode === 'banner' ? undefined : selectedColor.color }}
                className={`w-full bg-transparent border-none focus:outline-none resize-none placeholder-white/60 transition-all ${getTextStylingClasses()}`}
                autoFocus
              />
            </div>
          </div>

          {/* Bottom Card Controls / Character count */}
          <div className="flex items-center justify-between text-[11px] text-white/80 z-20">
            <span className="font-mono text-[10px] bg-black/20 backdrop-blur-md px-2 py-0.5 rounded-md">
              Ratio: {aspectRatio} • Font: {selectedFont.label}
            </span>
            <span>{content.length}/180</span>
          </div>
        </div>

        {/* Media Error Notice */}
        {mediaError && (
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
            <span>{mediaError}</span>
            <button type="button" onClick={() => setMediaError(null)}><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Editor Customization Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setEditorTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              editorTab === 'text'
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text & Font</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorTab('media')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              editorTab === 'media'
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
            <span>Media, Ratio & Scale {mediaPreview ? '✓' : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorTab('background')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              editorTab === 'background'
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme Colors</span>
          </button>

          <button
            type="button"
            onClick={() => setEditorTab('audience')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              editorTab === 'audience'
                ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Audience</span>
          </button>
        </div>

        {/* Tab 1: Text & Font Customization */}
        {editorTab === 'text' && (
          <div className="space-y-3.5 text-left animate-fade-in">
            {/* Font Family Picker */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Font Family
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setSelectedFont(font)}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all ${
                      selectedFont.id === font.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Size Presets */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Text Size
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {TEXT_SIZES.map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border transition-all ${
                      selectedSize.id === sz.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color & Highlight Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Colors */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Text Color
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {TEXT_COLORS.map((col) => (
                    <button
                      key={col.color}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${col.class} ${
                        selectedColor.color === col.color
                          ? 'ring-2 ring-brand-500 scale-125'
                          : 'hover:scale-110'
                      }`}
                      title={col.label}
                    />
                  ))}
                </div>
              </div>

              {/* Text Highlight Style & Alignment */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Highlight & Alignment
                </span>
                <div className="flex items-center gap-1.5">
                  {TEXT_STYLES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTextStyleMode(st.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        textStyleMode === st.id
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}

                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                  {/* Alignment buttons */}
                  <button
                    type="button"
                    onClick={() => setTextAlign('left')}
                    className={`p-1 rounded-lg border ${
                      textAlign === 'left' ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextAlign('center')}
                    className={`p-1 rounded-lg border ${
                      textAlign === 'center' ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setTextAlign('right')}
                    className={`p-1 rounded-lg border ${
                      textAlign === 'right' ? 'border-brand-500 text-brand-600 bg-brand-50' : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Media, Aspect Ratio & Resizing Controls */}
        {editorTab === 'media' && (
          <div className="space-y-4 text-left animate-fade-in">
            {/* Upload Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-brand-500" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors shadow-xs"
              >
                <Film className="w-4 h-4 text-privacy-500" />
                <span>Upload Video</span>
              </button>

              {mediaPreview && (
                <button
                  type="button"
                  onClick={clearMedia}
                  className="px-3 py-2 rounded-xl text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 ml-auto"
                >
                  Remove Media
                </button>
              )}
            </div>

            {/* Aspect Ratio Selector & Sliders */}
            {mediaPreview ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5">
                {/* 1. Aspect Ratio Presets */}
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Aspect Ratio Frame
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => setAspectRatio(ratio.id)}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-center border transition-all ${
                          aspectRatio === ratio.id
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="mb-1">{ratio.icon}</div>
                        <span className="text-[10px] truncate">{ratio.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Scale & Zoom Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Media Scale & Zoom: {Math.round(mediaScale * 100)}%
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMediaScale((prev) => Math.max(0.5, prev - 0.1))}
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaScale((prev) => Math.min(1.4, prev + 0.1))}
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                      </button>
                    </div>
                  </div>

                  <input
                    type="range"
                    min="0.5"
                    max="1.4"
                    step="0.05"
                    value={mediaScale}
                    onChange={(e) => setMediaScale(parseFloat(e.target.value))}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>

                {/* 3. Fit Mode & Position Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
                  {/* Fit Mode */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Fit Mode</span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setMediaFit('cover')}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          mediaFit === 'cover'
                            ? 'bg-brand-500 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Cover (Fill)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaFit('contain')}
                        className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          mediaFit === 'contain'
                            ? 'bg-brand-500 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Contain (Fit)
                      </button>
                    </div>
                  </div>

                  {/* Position / Pan */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Focus Position</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setMediaPosition('top')}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold ${
                          mediaPosition === 'top'
                            ? 'bg-brand-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Top
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaPosition('center')}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold ${
                          mediaPosition === 'center'
                            ? 'bg-brand-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Center
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaPosition('bottom')}
                        className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold ${
                          mediaPosition === 'bottom'
                            ? 'bg-brand-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        Bottom
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-400">
                Attach an image or video from your device to enable Instagram-style 9:16, 4:5, 1:1, 16:9 aspect ratios & zoom resizing.
              </div>
            )}

            {/* Hidden Inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleMediaChange(e, 'image')}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleMediaChange(e, 'video')}
            />
          </div>
        )}

        {/* Tab 3: Background Themes */}
        {editorTab === 'background' && (
          <div className="space-y-3 text-left animate-fade-in">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Instagram Gradient Themes
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {GRADIENT_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-3 rounded-2xl bg-gradient-to-br ${theme.class} text-white font-bold text-xs text-left shadow-sm transition-all ${
                    selectedTheme.id === theme.id
                      ? 'ring-2 ring-brand-500 ring-offset-2 scale-105 shadow-md'
                      : 'hover:opacity-90'
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Audience */}
        {editorTab === 'audience' && (
          <div className="space-y-3 text-left animate-fade-in">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Who can view this Thought?
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAudience('contacts')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  audience === 'contacts'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 mb-1 text-brand-500" />
                <div>Contacts</div>
                <div className="text-[10px] text-slate-400 font-normal">All your contacts</div>
              </button>

              <button
                type="button"
                onClick={() => setAudience('close_friends')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  audience === 'close_friends'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-4 h-4 mb-1 text-emerald-500" />
                <div>Close Friends</div>
                <div className="text-[10px] text-slate-400 font-normal">Strictly private ring</div>
              </button>

              <button
                type="button"
                onClick={() => setAudience('everyone')}
                className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                  audience === 'everyone'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Eye className="w-4 h-4 mb-1 text-sky-500" />
                <div>Everyone</div>
                <div className="text-[10px] text-slate-400 font-normal">Anyone with your ID</div>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={!content.trim() && !mediaPreview}
            className="rounded-2xl px-6 shadow-md shadow-brand-500/20"
          >
            Post Thought
          </Button>
        </div>
      </form>
    </Modal>
  );
};

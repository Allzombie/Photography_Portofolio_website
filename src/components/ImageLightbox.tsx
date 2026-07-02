import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Calendar, Compass, Aperture, Eye } from 'lucide-react';
import { PhotoItem } from '../types';

interface ImageLightboxProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageLightbox({ photo, onClose, onPrev, onNext }: ImageLightboxProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [photo?.id]);

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [photo, onClose, onPrev, onNext]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col md:flex-row bg-neutral-950/98 backdrop-blur-md"
      >
        {/* Close Button Top Right (Mobile) */}
        <button
          id="lightbox-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-neutral-900/60 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Dynamic Image Display */}
        <div className="relative flex-1 flex items-center justify-center p-4 md:p-8 select-none">
          {/* Navigation Arrows */}
          <button
            id="lightbox-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 md:left-8 z-20 p-3 bg-neutral-900/40 rounded-full border border-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all focus:outline-none cursor-pointer hover:scale-105"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            id="lightbox-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 md:right-8 z-20 p-3 bg-neutral-900/40 rounded-full border border-neutral-800/40 text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all focus:outline-none cursor-pointer hover:scale-105"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main Visual Frame */}
          <div className="relative w-full h-full max-h-[80vh] md:max-h-[85vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {imageError ? (
                <motion.div
                  key="error-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-[420px] aspect-[3/4] bg-neutral-900/40 border border-white/10 rounded-xs flex flex-col items-center justify-center p-8 text-center relative"
                >
                  <div className="absolute inset-4 border border-white/5 pointer-events-none" />
                  <Camera className="w-12 h-12 text-neutral-500 mb-4 stroke-[1.2]" />
                  <h3 className="text-xl font-serif italic text-white mb-2">{photo.title}</h3>
                  <p className="text-neutral-400 text-xs font-sans font-light leading-relaxed mb-6">
                    This frame is mapped to a 0-byte placeholder file. Replace <code className="font-mono bg-neutral-950/80 px-1.5 py-0.5 rounded border border-white/5 text-neutral-300">/assets/photos/{photo.id === 'user-photo-1' ? 'DSCF3275' : photo.id === 'user-photo-2' ? 'DSCF3307' : photo.id === 'user-photo-3' ? 'DSCF3343' : photo.id === 'user-photo-4' ? 'DSCF3368' : 'DSCF3389'}.jpg</code> with your real high-resolution photo file to render.
                  </p>
                  <div className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
                    DRAG & DROP TO UPLOAD
                  </div>
                </motion.div>
              ) : (
                <motion.img
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  src={photo.imageUrl}
                  alt={photo.title}
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm selection:bg-transparent"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Editorial Metadata HUD Sidebar */}
        <motion.div
          id="lightbox-meta-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-full md:w-[380px] border-t md:border-t-0 md:border-l border-white/10 bg-neutral-950 p-6 md:p-8 flex flex-col justify-between overflow-y-auto"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-500 font-semibold">
                {photo.category} Category
              </span>
              <span className="hidden md:inline-flex items-center text-[9px] font-mono text-neutral-500 bg-neutral-900/40 border border-white/10 px-2.5 py-1 rounded-xs uppercase tracking-wider">
                EXIF HUD
              </span>
            </div>

            <h2 className="text-3xl font-serif text-white italic font-light mb-3">
              {photo.title}
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6 font-sans font-light">
              {photo.description}
            </p>

            {/* Shoot Metadata Details */}
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-neutral-500 mt-0.5" />
                <div>
                  <div className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider">Location</div>
                  <div className="text-sm text-neutral-200 font-light">{photo.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-neutral-500 mt-0.5" />
                <div>
                  <div className="text-[9px] text-neutral-500 font-mono uppercase tracking-wider">Captured Date</div>
                  <div className="text-sm text-neutral-200 font-light">{photo.date}</div>
                </div>
              </div>
            </div>

            {/* Technical Camera Gear Specs */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-500 font-semibold mb-4">
                Gear & Exposure Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-900/10 p-3 rounded-xs border border-white/5">
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 font-mono uppercase tracking-wider mb-1">
                    <Camera className="w-3.5 h-3.5" /> Body
                  </div>
                  <div className="text-xs text-neutral-200 font-medium font-sans truncate" title={photo.camera}>
                    {photo.camera}
                  </div>
                </div>

                <div className="bg-neutral-900/10 p-3 rounded-xs border border-white/5">
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 font-mono uppercase tracking-wider mb-1">
                    <Compass className="w-3.5 h-3.5" /> Glass
                  </div>
                  <div className="text-xs text-neutral-200 font-medium font-sans truncate" title={photo.lens}>
                    {photo.lens}
                  </div>
                </div>

                <div className="bg-neutral-900/10 p-3 rounded-xs border border-white/5">
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 font-mono uppercase tracking-wider mb-1">
                    <Aperture className="w-3.5 h-3.5" /> Aperture
                  </div>
                  <div className="text-xs text-neutral-200 font-medium font-mono">
                    {photo.aperture}
                  </div>
                </div>

                <div className="bg-neutral-900/10 p-3 rounded-xs border border-white/5">
                  <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 font-mono uppercase tracking-wider mb-1">
                    <Eye className="w-3.5 h-3.5" /> Exposure
                  </div>
                  <div className="text-xs text-neutral-200 font-medium font-mono">
                    {photo.shutterSpeed} @ ISO {photo.iso}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[9px] text-neutral-600 font-mono tracking-widest uppercase">
              M. BRADESCU © {new Date().getFullYear()} ALL RIGHTS RESERVED
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

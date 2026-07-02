import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Eye, MapPin, SlidersHorizontal, Camera } from 'lucide-react';
import { PhotoItem, Category } from '../types';
import { PHOTO_ITEMS } from '../data';

interface GalleryProps {
  photos: PhotoItem[];
  onPhotoClick: (photo: PhotoItem) => void;
}

export default function Gallery({ photos, onPhotoClick }: GalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const categories: Category[] = ['All', 'Architecture', 'Portrait', 'Landscape', 'Street'];

  const filteredItems = activeCategory === 'All'
    ? photos
    : photos.filter((item) => item.category === activeCategory);

  return (
    <section
      id="photography-section"
      className="py-24 md:py-32 bg-neutral-950 border-t border-white/10 px-6 md:px-12 relative"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] tracking-[0.35em] font-mono uppercase text-neutral-400">
                01 / STILL CHRONICLES
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white italic">
              Still Frames
            </h2>
            <p className="text-neutral-500 text-sm mt-3 max-w-lg font-sans font-light leading-relaxed">
              Curated exposures with full manual cameras, capturing the raw chemistry between brutalist architecture, silent shadows, and golden light.
            </p>
          </div>

          {/* Minimalist Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-900/20 p-1 border border-white/10 rounded-sm backdrop-blur-sm self-start">
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-500 font-mono text-[10px] uppercase tracking-widest border-r border-white/10 hidden sm:flex">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filter</span>
            </div>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  id={`filter-btn-${cat}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[10px] tracking-widest font-mono px-4 py-2 transition-all duration-300 focus:outline-none cursor-pointer uppercase ${
                    isSelected
                      ? 'bg-white text-neutral-950 font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Photography Grid */}
        <div className="relative">
          <motion.div
            layout
            id="photography-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => onPhotoClick(photo)}
                  className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 rounded-xs cursor-pointer select-none transition-colors"
                >
                  {/* Thumbnail Image */}
                  {failedImages[photo.id] ? (
                    <div className="absolute inset-0 bg-neutral-900/40 flex flex-col items-center justify-center p-6 text-center">
                      <div className="absolute inset-2 border border-white/5 pointer-events-none" />
                      <Camera className="w-8 h-8 text-neutral-500 mb-3 stroke-[1.2]" />
                      <span className="text-[9px] tracking-[0.25em] font-mono text-neutral-400 uppercase mb-1">
                        {photo.category} // CAMERA
                      </span>
                      <span className="text-[10px] text-neutral-300 font-mono tracking-wider uppercase">
                        [ Empty Capture File ]
                      </span>
                      <span className="text-[8px] text-neutral-500 font-mono mt-4 leading-normal max-w-[170px] uppercase tracking-wider">
                        Upload real JPEG to see frame
                      </span>
                    </div>
                  ) : (
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      onError={() => setFailedImages((prev) => ({ ...prev, [photo.id]: true }))}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                    />
                  )}

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/10 opacity-70 group-hover:opacity-85 transition-opacity duration-300" />

                  {/* Top Location HUD Card Tag */}
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] text-neutral-300 font-mono uppercase tracking-wider">
                    <MapPin className="w-3 h-3 text-neutral-400" />
                    <span className="truncate max-w-[120px]">{photo.location}</span>
                  </div>

                  {/* Bottom Text Details Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 z-10 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[9px] tracking-[0.2em] font-mono text-neutral-500 uppercase mb-1">
                      {photo.category} // EXIF {photo.aperture}
                    </span>
                    <h3 className="text-xl font-serif text-white italic font-normal leading-tight mb-2">
                      {photo.title}
                    </h3>
                    <p className="text-neutral-400 text-xs font-sans font-light line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      {photo.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-[10px] text-white/80 font-mono tracking-widest uppercase pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <Eye className="w-4 h-4" />
                      <span>Exif Metadata</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty fallback state */}
          {filteredItems.length === 0 && (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-sm">
              <Grid className="w-10 h-10 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-500 font-mono text-sm">No captures found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Play, Film, MapPin, Sparkles, Clock } from 'lucide-react';
import { VideoItem } from '../types';
import { VIDEO_ITEMS } from '../data';

interface VideoSectionProps {
  videos: VideoItem[];
  onVideoClick: (video: VideoItem) => void;
}

export default function VideoSection({ videos, onVideoClick }: VideoSectionProps) {
  return (
    <section
      id="cinematography-section"
      className="py-24 md:py-32 bg-neutral-950 border-t border-white/10 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.35em] font-mono uppercase text-neutral-400">
              02 / Motion Pictures
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white italic">
            Cinematic Movement
          </h2>
          <p className="text-neutral-500 text-sm mt-3 max-w-lg font-sans font-light leading-relaxed">
            Atmospheric digital shorts and commercial directing clips focused on raw geometry, serene settings, and high dynamic range lighting.
          </p>
        </div>

        {/* Video Cards Grid */}
        <div id="video-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              onClick={() => onVideoClick(video)}
              className="group relative aspect-video bg-neutral-900 border border-white/5 hover:border-white/20 rounded-xs overflow-hidden cursor-pointer select-none transition-all"
            >
              {/* Cover Image Thumbnail */}
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102 filter brightness-90 group-hover:brightness-75"
              />

              {/* Dark Linear Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/20 to-neutral-950/30 opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Top Floating Controls - Duration Overlay */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-xs text-[9px] text-white font-mono uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{video.duration}</span>
              </div>

              {/* Top Left Floating Category */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-2.5 py-1 bg-white text-neutral-950 rounded-xs text-[9px] tracking-[0.2em] uppercase font-mono font-bold">
                {video.category}
              </div>

              {/* Center Play Button Accent */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="p-4 bg-neutral-950/60 group-hover:bg-white group-hover:text-neutral-950 text-white rounded-full border border-white/10 group-hover:border-white transition-all duration-300 transform scale-100 group-hover:scale-105 shadow-xl">
                  <Play className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Bottom Metadata Details */}
              <div className="absolute inset-x-0 bottom-0 p-6 z-10">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{video.location}</span>
                </div>
                <h3 className="text-xl font-serif text-white italic font-normal leading-tight mb-2 group-hover:text-neutral-200 transition-colors">
                  {video.title}
                </h3>
                <p className="text-neutral-400 text-xs font-sans font-light line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  {video.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cinematography Statement banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-neutral-950 via-neutral-900/10 to-neutral-950 p-8 md:p-12 border border-white/10 rounded-xs flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-900/60 border border-white/10 rounded-xs mt-1 shrink-0">
              <Film className="w-6 h-6 text-neutral-400" />
            </div>
            <div>
              <h4 className="text-xl text-white font-serif italic mb-1">
                Looking for a director or cinematographer?
              </h4>
              <p className="text-neutral-400 text-sm font-sans font-light">
                I direct promotional shorts, custom brand launch clips, music reels, and interior walkthroughs. Available globally for freelance bookings.
              </p>
            </div>
          </div>

          <button
            id="statement-contact-cta"
            onClick={() => {
              const el = document.getElementById('inquire-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase font-mono font-medium text-neutral-950 bg-white hover:bg-neutral-200 transition-colors px-6 py-3.5 rounded-xs focus:outline-none cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 fill-neutral-950" />
            Request Showreel PDF
          </button>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';

interface HeroProps {
  onExplorePhotos: () => void;
  onExploreVideos: () => void;
}

export default function Hero({ onExplorePhotos, onExploreVideos }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen flex items-center justify-center bg-neutral-950 overflow-hidden"
    >
      {/* Background Visual Element - Darkened Cinematic Video/Photo Loop */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-neutral-950/70 to-neutral-950 z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://player.vimeo.com/external/434045526.sd.mp4?s=c1e1933c08b61c8c683b745a3038843c0b13cf76&profile_id=165&oauth2_token_id=57447761"
          className="w-full h-full object-cover scale-105 filter saturate-75 opacity-40 select-none pointer-events-none"
        />
      </div>

      {/* Hero Core Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12 flex flex-col items-center text-center">
        {/* Subtle Welcome Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex items-center gap-2 px-3 py-1 bg-neutral-900/60 rounded-full border border-neutral-800/80 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-neutral-300 font-medium">
            Fine Art Photography & Cinematography
          </span>
        </motion.div>

        {/* Master Heading Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="space-y-4 max-w-5xl"
        >
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif tracking-tight text-white leading-tight font-light select-none">
            Capturing the <span className="text-neutral-400 italic">soul</span> of silent spaces
          </h1>
        </motion.div>

        {/* Short Concept Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 max-w-2xl"
        >
          <p className="text-neutral-400 text-sm md:text-base font-sans font-light leading-relaxed tracking-widest uppercase text-[11px]">
            A visual archive of high-contrast brutalist lines, fine-art human expressions, and atmospheric short films, curated by independent artist <span className="text-white font-normal font-mono">M. Bradescu</span>.
          </p>
        </motion.div>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            id="hero-photos-cta"
            onClick={onExplorePhotos}
            className="group flex items-center justify-center gap-2.5 w-full sm:w-auto text-[10px] tracking-[0.3em] uppercase font-mono font-bold text-neutral-950 bg-white hover:bg-neutral-200 hover:scale-103 active:scale-98 transition-all px-8 py-4 rounded-xs border border-white cursor-pointer"
          >
            Explore Frames
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            id="hero-video-cta"
            onClick={onExploreVideos}
            className="flex items-center justify-center gap-2.5 w-full sm:w-auto text-[10px] tracking-[0.3em] uppercase font-mono font-bold text-white bg-transparent hover:bg-white/5 border border-white/20 hover:border-white hover:scale-103 active:scale-98 transition-all px-8 py-4 rounded-xs cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Watch Showreel
          </button>
        </motion.div>
      </div>

      {/* Artistic Flair Backdrop Number Accent '01' */}
      <div className="absolute bottom-6 left-12 font-serif italic text-[140px] md:text-[220px] opacity-10 text-white select-none pointer-events-none leading-none z-10 font-light">
        01
      </div>

      {/* Animated Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <motion.button
          id="hero-scroll-btn"
          onClick={onExplorePhotos}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-neutral-500 hover:text-white transition-colors focus:outline-none cursor-pointer"
          aria-label="Scroll Down"
        >
          <span className="text-[9px] tracking-[0.3em] font-mono uppercase">SCROLL</span>
          <ChevronDown className="w-4 h-4" />
        </motion.button>
      </div>
    </section>
  );
}

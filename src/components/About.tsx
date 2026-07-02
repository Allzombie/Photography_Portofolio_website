import { motion } from 'motion/react';
import { Award, Compass, Heart, MapPin, Feather, CheckCircle } from 'lucide-react';
import { AboutData } from '../types';

interface AboutProps {
  aboutData: AboutData;
}

export default function About({ aboutData }: AboutProps) {
  const { quote, bioParagraph1, bioParagraph2, locationLabel, services, exhibitions } = aboutData;

  return (
    <section
      id="about-section"
      className="py-24 md:py-32 bg-neutral-950 border-t border-white/10 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Block */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.35em] font-mono uppercase text-neutral-400">
              03 / Creative Mind
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-light tracking-tight text-white italic">
            The Artist & Vision
          </h2>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* Left Column: Philosophical bio */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <p className="text-2xl sm:text-3xl text-neutral-200 font-serif leading-relaxed italic font-light">
                {quote}
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans font-light">
                {bioParagraph1}
              </p>
              <p className="text-neutral-400 text-sm leading-relaxed font-sans font-light">
                {bioParagraph2}
              </p>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Compass className="w-5 h-5 text-neutral-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-serif italic text-white font-normal">Natural Lighting</h4>
                  <p className="text-neutral-500 text-xs mt-1 font-sans font-light">
                    Exclusively chasing the sun, using organic shadows to carve real depth without artificial synthetic gear.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Feather className="w-5 h-5 text-neutral-400 mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-serif italic text-white font-normal">Minimalist Composition</h4>
                  <p className="text-neutral-500 text-xs mt-1 font-sans font-light">
                    A strong adherence to negative space and structural symmetry, letting the viewer’s eye relax.
                  </p>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="pt-8 border-t border-white/10 space-y-6">
              <h3 className="text-[10px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-bold">
                Professional Photographic Services
              </h3>

              <div className="space-y-4">
                {services.map((srv, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3.5 p-4 bg-neutral-900/10 rounded-xs border border-white/5"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-neutral-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-serif italic text-white font-normal">{srv.title}</h4>
                      <p className="text-neutral-500 text-xs mt-1 font-sans font-light">{srv.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Picture & Exhibitions HUD */}
          <div className="lg:col-span-5 space-y-8">
            {/* Highly Aesthetic Profile Frame */}
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-white/10 rounded-xs">
              <img
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600"
                alt="M. Bradescu Portrait"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-95 filter sepia-[15%] transition-transform duration-700 hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent" />
              <div className="absolute bottom-6 left-6 z-10 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xs border border-white/10 text-[9px] font-mono text-neutral-300 uppercase tracking-widest">
                <MapPin className="w-3.5 h-3.5" />
                <span>{locationLabel}</span>
              </div>
            </div>

            {/* Exhibitions Timeline Card */}
            <div className="bg-neutral-900/10 p-6 rounded-xs border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                <Award className="w-4 h-4 text-neutral-400" />
                <h3 className="text-[10px] tracking-[0.2em] uppercase font-mono text-white font-bold">
                  Solo & Group Exhibitions
                </h3>
              </div>

              <div className="space-y-6">
                {exhibitions.map((exh, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-white/10">
                    <div className="absolute left-[-4.5px] top-[5px] w-2 h-2 bg-neutral-500 rounded-full" />
                    <span className="text-[9px] font-mono text-neutral-500 font-semibold uppercase tracking-widest block">
                      {exh.year} Exhibition
                    </span>
                    <h4 className="text-sm font-serif italic text-white font-normal mt-1">
                      {exh.title}
                    </h4>
                    <p className="text-neutral-400 text-xs font-sans font-light mt-0.5">
                      {exh.venue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Camera, Film, MessageSquare, Info } from 'lucide-react';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export default function Header({ onNavigate, activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Photography', id: 'photography-section', icon: Camera },
    { label: 'Cinematography', id: 'cinematography-section', icon: Film },
    { label: 'About', id: 'about-section', icon: Info },
    { label: 'Inquire', id: 'inquire-section', icon: MessageSquare }
  ];

  const handleLinkClick = (id: string) => {
    setIsMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        isScrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-white/10 py-4'
          : 'bg-transparent py-6 md:py-8 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Editorial Logo */}
        <button
          id="header-logo"
          onClick={() => handleLinkClick('hero-section')}
          className="group flex flex-col items-start font-sans text-left focus:outline-none cursor-pointer"
        >
          <span className="text-sm tracking-[0.4em] uppercase font-semibold text-white transition-colors group-hover:text-neutral-400">
            M. BRADESCU
          </span>
          <span className="text-[9px] tracking-[0.45em] uppercase font-mono text-neutral-500 font-medium">
            Visual Artist
          </span>
        </button>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <button
                    id={`nav-link-${item.id}`}
                    onClick={() => handleLinkClick(item.id)}
                    className={`relative text-[11px] tracking-[0.3em] uppercase font-mono py-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                      isActive ? 'text-white font-medium' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <button
            id="header-booking-cta"
            onClick={() => handleLinkClick('inquire-section')}
            className="flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase font-mono font-medium text-neutral-950 bg-white hover:bg-neutral-200 transition-all px-4 py-2.5 rounded-xs focus:outline-none cursor-pointer"
          >
            Inquire
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-neutral-400 hover:text-white p-1 focus:outline-none cursor-pointer"
          aria-label="Toggle Mobile Menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Slide Panel */}
      <div
        id="mobile-drawer"
        className={`fixed inset-0 top-[60px] md:hidden z-30 bg-neutral-950 transition-all duration-300 transform border-t border-neutral-900 ${
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="p-8 flex flex-col justify-between h-[calc(100vh-60px)] bg-neutral-950">
          <ul className="space-y-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const IconComp = item.icon;
              return (
                <li key={item.id}>
                  <button
                    id={`mobile-nav-link-${item.id}`}
                    onClick={() => handleLinkClick(item.id)}
                    className={`flex items-center gap-4 text-lg tracking-widest uppercase font-mono w-full text-left py-2.5 border-b border-neutral-900 focus:outline-none ${
                      isActive ? 'text-white font-bold' : 'text-neutral-400'
                    }`}
                  >
                    <IconComp className="w-4.5 h-4.5 text-neutral-500" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="space-y-6 pb-12">
            <button
              id="mobile-booking-cta"
              onClick={() => handleLinkClick('inquire-section')}
              className="flex items-center justify-center gap-2 text-sm tracking-widest uppercase font-mono font-medium text-neutral-950 bg-white hover:bg-neutral-200 transition-colors w-full py-4 rounded-sm focus:outline-none"
            >
              Book Direct Session
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-neutral-600 font-mono tracking-widest">
              M. BRADESCU PORTFOLIO © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

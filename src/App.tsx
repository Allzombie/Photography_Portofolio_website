import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import VideoSection from './components/VideoSection';
import About from './components/About';
import ContactSection from './components/ContactSection';
import ImageLightbox from './components/ImageLightbox';
import VideoPlayerModal from './components/VideoPlayerModal';
import AdminPanel from './components/AdminPanel';
import { PhotoItem, VideoItem, AboutData } from './types';
import { PHOTO_ITEMS, VIDEO_ITEMS, DEFAULT_ABOUT_DATA } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero-section');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Dynamic Content States persisted in localStorage as local cache
  const [photos, setPhotos] = useState<PhotoItem[]>(() => {
    const saved = localStorage.getItem('studio_photos');
    return saved ? JSON.parse(saved) : PHOTO_ITEMS;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('studio_videos');
    return saved ? JSON.parse(saved) : VIDEO_ITEMS;
  });

  const [aboutData, setAboutData] = useState<AboutData>(() => {
    const saved = localStorage.getItem('studio_about');
    return saved ? JSON.parse(saved) : DEFAULT_ABOUT_DATA;
  });

  // Fetch persistent catalog from server database on startup and seed if empty
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [photosRes, videosRes, aboutRes] = await Promise.all([
          fetch('/api/photos'),
          fetch('/api/videos'),
          fetch('/api/about')
        ]);

        if (photosRes.ok) {
          const serverPhotos = await photosRes.json();
          if (serverPhotos && serverPhotos.length > 0) {
            setPhotos(serverPhotos);
            localStorage.setItem('studio_photos', JSON.stringify(serverPhotos));
          } else {
            // Seed server
            await fetch('/api/photos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(PHOTO_ITEMS)
            });
          }
        }

        if (videosRes.ok) {
          const serverVideos = await videosRes.json();
          if (serverVideos && serverVideos.length > 0) {
            setVideos(serverVideos);
            localStorage.setItem('studio_videos', JSON.stringify(serverVideos));
          } else {
            // Seed server
            await fetch('/api/videos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(VIDEO_ITEMS)
            });
          }
        }

        if (aboutRes.ok) {
          const serverAbout = await aboutRes.json();
          if (serverAbout && Object.keys(serverAbout).length > 0) {
            setAboutData(serverAbout);
            localStorage.setItem('studio_about', JSON.stringify(serverAbout));
          } else {
            // Seed server
            await fetch('/api/about', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(DEFAULT_ABOUT_DATA)
            });
          }
        }
      } catch (err) {
        console.error('Database connection error; using local storage:', err);
      }
    };

    fetchCatalog();
  }, []);

  // Database-synced mutations
  const syncPhotos = async (newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
    localStorage.setItem('studio_photos', JSON.stringify(newPhotos));
    try {
      await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPhotos)
      });
    } catch (err) {
      console.error('Failed to sync photos to server DB:', err);
    }
  };

  const syncVideos = async (newVideos: VideoItem[]) => {
    setVideos(newVideos);
    localStorage.setItem('studio_videos', JSON.stringify(newVideos));
    try {
      await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideos)
      });
    } catch (err) {
      console.error('Failed to sync videos to server DB:', err);
    }
  };

  const syncAboutData = async (newAbout: AboutData) => {
    setAboutData(newAbout);
    localStorage.setItem('studio_about', JSON.stringify(newAbout));
    try {
      await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAbout)
      });
    } catch (err) {
      console.error('Failed to sync biography to server DB:', err);
    }
  };

  // Scrollspy logic to automatically update navigation focus states
  useEffect(() => {
    const sections = [
      'hero-section',
      'photography-section',
      'cinematography-section',
      'about-section',
      'inquire-section'
    ];

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 300; // Offset for triggers

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScrollSpy);
    // Initial trigger
    handleScrollSpy();

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, []);

  const handleNavigation = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = 80; // height of pinned header
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handleResetCatalog = async () => {
    localStorage.removeItem('studio_photos');
    localStorage.removeItem('studio_videos');
    localStorage.removeItem('studio_about');
    setPhotos(PHOTO_ITEMS);
    setVideos(VIDEO_ITEMS);
    setAboutData(DEFAULT_ABOUT_DATA);
    try {
      await Promise.all([
        fetch('/api/photos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(PHOTO_ITEMS)
        }),
        fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(VIDEO_ITEMS)
        }),
        fetch('/api/about', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(DEFAULT_ABOUT_DATA)
        })
      ]);
    } catch (err) {
      console.error('Failed to reset database on server:', err);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white select-none">
      {/* Editorial Floating Navigation */}
      <Header
        onNavigate={handleNavigation}
        activeSection={activeSection}
      />

      {/* Hero Welcome Showcase */}
      <Hero
        onExplorePhotos={() => handleNavigation('photography-section')}
        onExploreVideos={() => handleNavigation('cinematography-section')}
      />

      {/* Main Sections */}
      <main>
        {/* Photography Gallery Section */}
        <Gallery photos={photos} onPhotoClick={(photo) => setSelectedPhoto(photo)} />

        {/* Cinematography/Video Area Section */}
        <VideoSection videos={videos} onVideoClick={(video) => setSelectedVideo(video)} />

        {/* About Artist / Philosophy Section */}
        <About aboutData={aboutData} />

        {/* Studio Inquiries and Bookings Form Section */}
        <ContactSection />
      </main>

      {/* Elegant Footer Details */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-6 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-sm tracking-[0.3em] font-sans font-extrabold text-white">M. BRADESCU</span>
            <span className="text-[9px] tracking-[0.4em] font-mono text-neutral-500 uppercase mt-0.5">Photography & Cinema Studio</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[10px] text-neutral-400">
            <button
              id="footer-nav-photos"
              onClick={() => handleNavigation('photography-section')}
              className="hover:text-white transition-colors uppercase tracking-widest cursor-pointer focus:outline-none"
            >
              Exposures
            </button>
            <button
              id="footer-nav-videos"
              onClick={() => handleNavigation('cinematography-section')}
              className="hover:text-white transition-colors uppercase tracking-widest cursor-pointer focus:outline-none"
            >
              Motion Reels
            </button>
            <button
              id="footer-nav-about"
              onClick={() => handleNavigation('about-section')}
              className="hover:text-white transition-colors uppercase tracking-widest cursor-pointer focus:outline-none"
            >
              The Studio
            </button>
            <button
              id="footer-nav-admin"
              onClick={() => setIsAdminOpen(true)}
              className="hover:text-white text-neutral-500 transition-colors uppercase tracking-widest cursor-pointer focus:outline-none flex items-center gap-1.5"
            >
              <span className="w-1 h-1 bg-neutral-600 rounded-full" />
              Studio Admin
            </button>
          </div>

          <p className="text-[10px] text-neutral-600 font-mono tracking-wider">
            © {new Date().getFullYear()} M. BRADESCU. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Interactive Lightbox Portal (For EXIF photo checking) */}
      <ImageLightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onPrev={handlePrevPhoto}
        onNext={handleNextPhoto}
      />

      {/* Cinema Overlay Portal (For cinematic reels playback) */}
      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />

      {/* Custom Admin CMS Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        photos={photos}
        setPhotos={syncPhotos}
        videos={videos}
        setVideos={syncVideos}
        aboutData={aboutData}
        setAboutData={syncAboutData}
        onReset={handleResetCatalog}
      />
    </div>
  );
}


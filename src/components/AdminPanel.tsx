import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock, Unlock, Settings, Plus, Trash2, Edit3, Save, RotateCcw,
  Upload, X, Film, Camera, Award, Eye, EyeOff, Check, FileText, Layout,
  MapPin, Calendar, Compass, Aperture, Briefcase, Inbox
} from 'lucide-react';
import exifr from 'exifr';
import { compressImage } from '../utils/image';
import { PhotoItem, VideoItem, AboutData, ServiceItem, ExhibitionItem, Category, InquiryItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
  setPhotos: (photos: PhotoItem[]) => void;
  videos: VideoItem[];
  setVideos: (videos: VideoItem[]) => void;
  aboutData: AboutData;
  setAboutData: (about: AboutData) => void;
  onReset: () => void;
}

type AdminTab = 'photos' | 'videos' | 'about' | 'services' | 'exhibitions' | 'inquiries';

export default function AdminPanel({
  isOpen,
  onClose,
  photos,
  setPhotos,
  videos,
  setVideos,
  aboutData,
  setAboutData,
  onReset
}: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('photos');

  // Inquiries / Bookings Inbox state (Option B - Database-driven)
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const unreadCount = inquiries.filter(i => i.status === 'unread').length;

  const fetchInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error('Error fetching booking inquiries:', err);
    } finally {
      setInquiriesLoading(false);
    }
  };

  // Automatically fetch inquiries when clicking the tab
  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'inquiries') {
      fetchInquiries();
    }
  }, [isAuthenticated, activeTab]);

  const handleUpdateInquiryStatus = async (id: string, newStatus: 'unread' | 'read' | 'completed') => {
    const updated = inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq);
    setInquiries(updated);
    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Error updating inquiry status:', err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    const updated = inquiries.filter(inq => inq.id !== id);
    setInquiries(updated);
    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.error('Error deleting inquiry:', err);
    }
  };

  // Edit / Add states for Photos
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoPublishSuccess, setPhotoPublishSuccess] = useState<string | null>(null);
  const [photoForm, setPhotoForm] = useState<Partial<PhotoItem>>({
    title: '',
    category: 'Architecture',
    imageUrl: '',
    description: '',
    location: '',
    date: '',
    camera: '',
    lens: '',
    aperture: '',
    shutterSpeed: '',
    iso: ''
  });

  // Edit / Add states for Videos
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    duration: '',
    description: '',
    location: '',
    category: 'Cinematography Reel',
    aspectRatio: '16:9'
  });

  // Local About states
  const [localAbout, setLocalAbout] = useState<AboutData>({ ...aboutData });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoThumbInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'm.bradescu15@gmail.com' && password === 'studio2026') {
      setIsAuthenticated(true);
      setLoginError('');
      // Sync local about data when authenticating
      setLocalAbout({ ...aboutData });
    } else {
      setLoginError('Invalid credentials. Please verify your email and password.');
    }
  };

  // Image upload handling for Photo Form (Converts to Base64 and extracts EXIF)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isVideoThumb = false) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear previous success notice on a new file upload
      setPhotoPublishSuccess(null);

      if (isVideoThumb) {
        compressImage(file, 640, 360, 0.8)
          .then((compressedBase64) => {
            setVideoForm(prev => ({ ...prev, thumbnailUrl: compressedBase64 }));
          })
          .catch((err) => {
            console.error('Error compressing video thumbnail:', err);
            // Fallback to standard reader if compression fails
            const reader = new FileReader();
            reader.onload = (event) => {
              setVideoForm(prev => ({ ...prev, thumbnailUrl: event.target?.result as string }));
            };
            reader.readAsDataURL(file);
          });
      } else {
        compressImage(file, 1920, 1920, 0.82)
          .then((compressedBase64) => {
            setPhotoForm(prev => ({ ...prev, imageUrl: compressedBase64 }));
          })
          .catch((err) => {
            console.error('Error compressing main image:', err);
            // Fallback to standard reader if compression fails
            const reader = new FileReader();
            reader.onload = (event) => {
              setPhotoForm(prev => ({ ...prev, imageUrl: event.target?.result as string }));
            };
            reader.readAsDataURL(file);
          });

        // Extract EXIF data if this is the main photo upload (from original file preserving metadata)
        exifr.parse(file)
          .then((exif) => {
            if (exif) {
              const updates: Partial<PhotoItem> = {};

              // 1. Camera Body
              if (exif.Model) {
                const make = exif.Make || '';
                const model = exif.Model;
                updates.camera = model.toLowerCase().includes(make.toLowerCase()) 
                  ? model 
                  : `${make} ${model}`.trim();
              } else if (exif.Make) {
                updates.camera = exif.Make;
              }

              // 2. Lens/Glass Specs
              if (exif.LensModel) {
                updates.lens = exif.LensModel;
              } else if (exif.Lens) {
                updates.lens = exif.Lens;
              }

              // 3. Aperture Setting
              if (exif.FNumber !== undefined && exif.FNumber !== null) {
                updates.aperture = `f/${exif.FNumber}`;
              }

              // 4. Shutter Speed Setting
              if (exif.ExposureTime !== undefined && exif.ExposureTime !== null) {
                const sec = exif.ExposureTime;
                if (sec >= 1) {
                  updates.shutterSpeed = `${Math.round(sec * 10) / 10}s`;
                } else {
                  const fraction = Math.round(1 / sec);
                  updates.shutterSpeed = `1/${fraction}s`;
                }
              }

              // 5. ISO Speed
              if (exif.ISO !== undefined && exif.ISO !== null) {
                updates.iso = String(exif.ISO);
              } else if (exif.ISOSpeedRatings !== undefined && exif.ISOSpeedRatings !== null) {
                updates.iso = String(exif.ISOSpeedRatings);
              }

              // 6. Capture Date Formatting
              const capturedDate = exif.DateTimeOriginal || exif.CreateDate;
              if (capturedDate) {
                const d = capturedDate instanceof Date ? capturedDate : new Date(capturedDate);
                if (!isNaN(d.getTime())) {
                  const months = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ];
                  updates.date = `${months[d.getMonth()]} ${d.getFullYear()}`;
                }
              }

              // 7. Auto-fill title from filename if title is blank
              if (!photoForm.title) {
                const fileName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                updates.title = fileName
                  .split(/[-_]/)
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
              }

              setPhotoForm(prev => ({
                ...prev,
                ...updates
              }));
            }
          })
          .catch((err) => {
            console.error('Error extracting EXIF metadata:', err);
          });
      }
    }
  };

  // Submit Photo Form
  const handlePhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoForm.title || !photoForm.imageUrl) {
      alert('Please fill in the Photo Title and select or upload an Image File.');
      return;
    }

    if (editingPhotoId) {
      // Edit existing
      const updated = photos.map(p => p.id === editingPhotoId ? { ...p, ...photoForm } as PhotoItem : p);
      setPhotos(updated);
      try {
        localStorage.setItem('studio_photos', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      setShowPhotoForm(false);
      setPhotoPublishSuccess(null);
    } else {
      // Create new
      const newPhoto: PhotoItem = {
        id: `user-photo-${Date.now()}`,
        title: photoForm.title || 'Untitled Exposure',
        category: (photoForm.category || 'Architecture') as Exclude<Category, 'All'>,
        imageUrl: photoForm.imageUrl || '',
        description: photoForm.description || '',
        location: photoForm.location || 'Copenhagen, Denmark',
        date: photoForm.date || 'June 2026',
        camera: photoForm.camera || 'Fujifilm GFX 100S',
        lens: photoForm.lens || 'GF 32-64mm f/4 R LM WR',
        aperture: photoForm.aperture || 'f/8.0',
        shutterSpeed: photoForm.shutterSpeed || '1/125s',
        iso: photoForm.iso || '100'
      };
      const updated = [newPhoto, ...photos];
      setPhotos(updated);
      try {
        localStorage.setItem('studio_photos', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
      setPhotoPublishSuccess(`"${newPhoto.title}" has been successfully published to your active exposures!`);
      setShowPhotoForm(false); // Close the form upon publishing to see the updated gallery
    }

    // Reset Form
    setEditingPhotoId(null);
    setPhotoForm({
      title: '',
      category: 'Architecture',
      imageUrl: '',
      description: '',
      location: 'Bucharest, Romania',
      date: 'June 2026',
      camera: '',
      lens: '',
      aperture: '',
      shutterSpeed: '',
      iso: ''
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditPhoto = (photo: PhotoItem) => {
    setPhotoPublishSuccess(null);
    setEditingPhotoId(photo.id);
    setPhotoForm(photo);
    setShowPhotoForm(true);
  };

  const handleDeletePhoto = (id: string) => {
    if (confirm('Are you sure you want to delete this photograph from your active exposures?')) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      try {
        localStorage.setItem('studio_photos', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
    }
  };

  // Submit Video Form
  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.videoUrl) {
      alert('Please fill in the Video Title and specify a Video URL.');
      return;
    }

    const defaultThumb = videoForm.thumbnailUrl || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=600';

    if (editingVideoId) {
      const updated = videos.map(v => v.id === editingVideoId ? { ...v, ...videoForm, thumbnailUrl: defaultThumb } as VideoItem : v);
      setVideos(updated);
      try {
        localStorage.setItem('studio_videos', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
    } else {
      const newVideo: VideoItem = {
        id: `user-video-${Date.now()}`,
        title: videoForm.title || 'Untitled Motion Reel',
        videoUrl: videoForm.videoUrl || '',
        thumbnailUrl: defaultThumb,
        duration: videoForm.duration || '0:30',
        description: videoForm.description || '',
        location: videoForm.location || 'Copenhagen, Denmark',
        category: videoForm.category || 'Cinematography Reel',
        aspectRatio: (videoForm.aspectRatio || '16:9') as '16:9' | '9:16'
      };
      const updated = [...videos, newVideo];
      setVideos(updated);
      try {
        localStorage.setItem('studio_videos', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
    }

    setEditingVideoId(null);
    setShowVideoForm(false);
    setVideoForm({
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      duration: '',
      description: '',
      location: '',
      category: 'Cinematography Reel',
      aspectRatio: '16:9'
    });
  };

  const handleEditVideo = (video: VideoItem) => {
    setEditingVideoId(video.id);
    setVideoForm(video);
    setShowVideoForm(true);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('Are you sure you want to remove this cinematic motion film?')) {
      const updated = videos.filter(v => v.id !== id);
      setVideos(updated);
      try {
        localStorage.setItem('studio_videos', JSON.stringify(updated));
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
    }
  };

  // Submit Biography text edits
  const handleAboutSave = () => {
    setAboutData(localAbout);
    try {
      localStorage.setItem('studio_about', JSON.stringify(localAbout));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
    alert('Biography, quote, and location details saved successfully!');
  };

  // Services actions
  const handleAddService = () => {
    const title = prompt('Enter Service Title (e.g. Architectural Commissions):');
    if (!title) return;
    const desc = prompt('Enter Service Description:');
    if (!desc) return;

    const newServices = [...localAbout.services, { title, desc }];
    const updated = { ...localAbout, services: newServices };
    setLocalAbout(updated);
    setAboutData(updated);
    try {
      localStorage.setItem('studio_about', JSON.stringify(updated));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  const handleDeleteService = (index: number) => {
    const newServices = localAbout.services.filter((_, i) => i !== index);
    const updated = { ...localAbout, services: newServices };
    setLocalAbout(updated);
    setAboutData(updated);
    try {
      localStorage.setItem('studio_about', JSON.stringify(updated));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  // Exhibition actions
  const handleAddExhibition = () => {
    const year = prompt('Enter Exhibition Year (e.g. 2026):', new Date().getFullYear().toString());
    if (!year) return;
    const title = prompt('Enter Exhibition Title (e.g. Urban Monoliths):');
    if (!title) return;
    const venue = prompt('Enter Exhibition Venue (e.g. Kyoto House of Photo, JP):');
    if (!venue) return;

    const newExh = [...localAbout.exhibitions, { year, title, venue }];
    const updated = { ...localAbout, exhibitions: newExh };
    setLocalAbout(updated);
    setAboutData(updated);
    try {
      localStorage.setItem('studio_about', JSON.stringify(updated));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  const handleDeleteExhibition = (index: number) => {
    const newExh = localAbout.exhibitions.filter((_, i) => i !== index);
    const updated = { ...localAbout, exhibitions: newExh };
    setLocalAbout(updated);
    setAboutData(updated);
    try {
      localStorage.setItem('studio_about', JSON.stringify(updated));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }
  };

  // Hard factory reset of the whole portfolio back to baseline
  const handleFullReset = () => {
    if (confirm('CRITICAL: This will delete all your ingested photos, videos, custom bio details, and restore the default Danish Studio showcase. Are you sure?')) {
      onReset();
      setIsAuthenticated(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      {/* Container Frame */}
      <div className="bg-neutral-950 border border-white/10 w-full max-w-5xl h-[90vh] flex flex-col rounded-xs relative overflow-hidden text-white shadow-2xl">
        
        {/* Header Block */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-neutral-950/80 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-neutral-400" />
            <h2 className="text-sm font-mono uppercase tracking-[0.25em] text-white">
              Studio CMS & Design Customizer
            </h2>
            {isAuthenticated && (
              <span className="text-[9px] bg-white/10 text-neutral-300 font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                Authorized Admin Session
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-500 hover:text-white hover:bg-white/5 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Authentication Wall */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-5 h-5 text-neutral-400" />
            </div>
            <h3 className="text-xl font-serif italic text-white mb-2">Unlock Studio Admin Access</h3>
            <p className="text-xs text-neutral-500 font-sans leading-relaxed mb-6 font-light">
              Ingest custom high-definition exposures, add video reels, rewrite your bio, and adjust layout sections directly using a highly intuitive dashboard.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              {loginError && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 text-red-200 text-xs font-mono rounded-xs text-left">
                  {loginError}
                </div>
              )}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white px-3.5 py-2.5 rounded-xs focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                  Password PIN
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white px-3.5 py-2.5 rounded-xs focus:outline-none font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-white hover:bg-neutral-200 text-neutral-950 text-[10px] tracking-widest font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5 fill-neutral-950" />
                Authenticate Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Main Authorized CMS Area */
          <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar Tabs */}
            <div className="w-48 border-r border-white/10 flex flex-col justify-between bg-neutral-950/40">
              <div className="py-4 space-y-1">
                <button
                  onClick={() => { setActiveTab('photos'); setShowPhotoForm(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-left transition-all border-l-2 ${
                    activeTab === 'photos'
                      ? 'bg-white/5 border-white text-white font-bold'
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Exposures
                </button>

                <button
                  onClick={() => { setActiveTab('videos'); setShowVideoForm(false); }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-left transition-all border-l-2 ${
                    activeTab === 'videos'
                      ? 'bg-white/5 border-white text-white font-bold'
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  Motion Reels
                </button>

                <button
                  onClick={() => setActiveTab('about')}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-left transition-all border-l-2 ${
                    activeTab === 'about'
                      ? 'bg-white/5 border-white text-white font-bold'
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Artist Bio
                </button>

                <button
                  onClick={() => setActiveTab('services')}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-left transition-all border-l-2 ${
                    activeTab === 'services'
                      ? 'bg-white/5 border-white text-white font-bold'
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Services
                </button>

                <button
                  onClick={() => setActiveTab('exhibitions')}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-mono uppercase tracking-wider text-left transition-all border-l-2 ${
                    activeTab === 'exhibitions'
                      ? 'bg-white/5 border-white text-white font-bold'
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Exhibitions
                </button>

                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-mono uppercase tracking-wider text-left transition-all border-l-2 ${
                    activeTab === 'inquiries'
                      ? 'bg-white/5 border-white text-white font-bold'
                      : 'border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4" />
                    <span>Inquiries</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="bg-emerald-500 text-neutral-950 font-bold text-[9px] h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center font-mono animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Reset to Curated Default Button */}
              <div className="p-4 border-t border-white/10 space-y-2">
                <button
                  onClick={handleFullReset}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-red-900/40 hover:bg-red-950/20 text-red-200 text-[9px] tracking-widest font-mono uppercase rounded-xs transition-colors cursor-pointer"
                  title="Clear all local alterations and reload hardcoded photography catalog"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Catalog
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-950/10">
              
              {/* TAB 1: PHOTOGRAPHY EXPOSURES */}
              {activeTab === 'photos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">Active exposures ({photos.length})</h3>
                      <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                        Add, reconfigure, or delete camera captures appearing in your main grid.
                      </p>
                    </div>
                     {!showPhotoForm && (
                      <button
                        onClick={() => {
                          setPhotoPublishSuccess(null);
                          setEditingPhotoId(null);
                          setPhotoForm({
                            title: '',
                            category: 'Architecture',
                            imageUrl: '',
                            description: '',
                            location: 'Bucharest, Romania',
                            date: 'June 2026',
                            camera: '',
                            lens: '',
                            aperture: '',
                            shutterSpeed: '',
                            iso: ''
                          });
                          setShowPhotoForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white text-neutral-950 hover:bg-neutral-200 rounded-xs text-[10px] tracking-widest font-mono font-bold uppercase transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Exposure
                      </button>
                    )}
                  </div>

                  {photoPublishSuccess && !showPhotoForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 px-4 py-3 rounded-xs flex items-center gap-2.5 text-xs font-mono"
                    >
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{photoPublishSuccess}</span>
                    </motion.div>
                  )}

                  {showPhotoForm ? (
                    /* Photo Form Container */
                    <form onSubmit={handlePhotoSubmit} className="space-y-6 bg-neutral-900/10 border border-white/10 p-5 rounded-xs">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">
                          {editingPhotoId ? 'Modify Exposure Frame' : 'Ingest New Photographic Exposure'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPhotoForm(false);
                            setPhotoPublishSuccess(null);
                          }}
                          className="text-xs text-neutral-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      {photoPublishSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-emerald-950/20 border border-emerald-500/25 text-emerald-400 px-4 py-3 rounded-xs flex items-center gap-2.5 text-xs font-mono"
                        >
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{photoPublishSuccess}</span>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Exposure Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Obscured Daylight"
                            value={photoForm.title}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light"
                          />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Category Section
                          </label>
                          <select
                            value={photoForm.category}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, category: e.target.value as any }))}
                            className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light cursor-pointer"
                          >
                            <option value="Architecture">Architecture</option>
                            <option value="Portrait">Portrait</option>
                            <option value="Landscape">Landscape</option>
                            <option value="Street">Street</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Source */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                          Visual File (Durable local file selection OR Image URL)
                        </label>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* File Drag-and-Drop */}
                          <div className="md:col-span-5">
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={(e) => handlePhotoUpload(e)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="w-full flex flex-col items-center justify-center p-4 border border-dashed border-white/15 hover:border-white/45 bg-neutral-950/50 hover:bg-white/5 rounded-xs cursor-pointer transition-all"
                            >
                              <Upload className="w-5 h-5 text-neutral-400 mb-2" />
                              <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider">
                                Upload Local Image
                              </span>
                              <span className="text-[8px] text-neutral-500 font-mono uppercase mt-1">
                                JPG, PNG (Stores in state)
                              </span>
                            </button>
                          </div>

                          <div className="md:col-span-2 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
                            — OR —
                          </div>

                          {/* Image URL text input */}
                          <div className="md:col-span-5 space-y-1">
                            <input
                              type="text"
                              placeholder="Paste Unsplash or external CDN image URL..."
                              value={photoForm.imageUrl}
                              onChange={(e) => setPhotoForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                              className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white px-3 py-2.5 rounded-xs focus:outline-none font-sans font-light"
                            />
                            <p className="text-[9px] text-neutral-500 font-mono uppercase leading-none">
                              Provide any public image URL (e.g. from Unsplash)
                            </p>
                          </div>
                        </div>

                        {/* Upload Preview */}
                        {photoForm.imageUrl && (
                          <div className="mt-3 flex items-center gap-3 bg-neutral-950 p-2 border border-white/5 rounded-xs">
                            <img
                              src={photoForm.imageUrl}
                              alt="Upload preview"
                              className="w-12 h-16 object-cover rounded-xs border border-white/10"
                            />
                            <div className="overflow-hidden">
                              <div className="text-[9px] text-neutral-400 font-mono uppercase">Image source verified</div>
                              <div className="text-xs text-neutral-500 truncate font-mono max-w-[300px]">
                                {photoForm.imageUrl.startsWith('data:') ? 'Durable local base64 payload' : photoForm.imageUrl}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setPhotoForm(prev => ({ ...prev, imageUrl: '' }))}
                              className="ml-auto text-xs text-neutral-500 hover:text-red-400 p-1"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Photo Description */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                          Philosophical Description
                        </label>
                        <textarea
                          placeholder="Describe the mood, geometry, or environment of the capture..."
                          value={photoForm.description}
                          onChange={(e) => setPhotoForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light resize-none h-16"
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Location */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Location Label
                          </label>
                          <input
                            type="text"
                            placeholder="Copenhagen, DK"
                            value={photoForm.location}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light"
                          />
                        </div>

                        {/* Date */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Date Captured
                          </label>
                          <input
                            type="text"
                            placeholder="June 2026"
                            value={photoForm.date}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light"
                          />
                        </div>

                        {/* Camera */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Camera Body (EXIF)
                          </label>
                          <input
                            type="text"
                            placeholder="Fujifilm GFX 100S"
                            value={photoForm.camera}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, camera: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light"
                          />
                        </div>

                        {/* Lens */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Glass/Lens (EXIF)
                          </label>
                          <input
                            type="text"
                            placeholder="GF 32-64mm f/4"
                            value={photoForm.lens}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, lens: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-sans font-light"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Aperture */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Aperture Setting
                          </label>
                          <input
                            type="text"
                            placeholder="f/8.0"
                            value={photoForm.aperture}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, aperture: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-mono"
                          />
                        </div>

                        {/* Shutter Speed */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Shutter Speed
                          </label>
                          <input
                            type="text"
                            placeholder="1/125s"
                            value={photoForm.shutterSpeed}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, shutterSpeed: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-mono"
                          />
                        </div>

                        {/* ISO */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            ISO Speed
                          </label>
                          <input
                            type="text"
                            placeholder="100"
                            value={photoForm.iso}
                            onChange={(e) => setPhotoForm(prev => ({ ...prev, iso: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setShowPhotoForm(false)}
                          className="px-4 py-2 text-[10px] tracking-widest font-mono uppercase text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-white text-neutral-950 hover:bg-neutral-200 text-[10px] tracking-widest font-mono font-bold uppercase rounded-xs transition-all cursor-pointer"
                        >
                          {editingPhotoId ? 'Commit Frame Edits' : 'Publish Exposure Frame'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Photos Grid List */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="bg-neutral-900/40 border border-white/5 p-3 rounded-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="aspect-[3/4] overflow-hidden rounded-xs bg-neutral-950 relative border border-white/5 mb-3">
                              {photo.imageUrl ? (
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.title}
                                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-[9px] text-neutral-600">
                                  No Frame Asset
                                </div>
                              )}
                              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded-xs border border-white/5 text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
                                {photo.category}
                              </span>
                            </div>
                            <h4 className="text-sm font-serif italic text-white truncate" title={photo.title}>
                              {photo.title}
                            </h4>
                            <p className="text-[10px] text-neutral-500 font-mono truncate mt-1">
                              {photo.camera} • {photo.aperture}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-4">
                            <button
                              onClick={() => handleEditPhoto(photo)}
                              className="text-[9px] font-mono uppercase text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-[9px] font-mono uppercase text-red-400/80 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">Active motion films ({videos.length})</h3>
                      <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                        Manage cinematic video showcases and commercial reels displayed on the portfolio.
                      </p>
                    </div>
                    {!showVideoForm && (
                      <button
                        onClick={() => {
                          setEditingVideoId(null);
                          setVideoForm({
                            title: '',
                            videoUrl: '',
                            thumbnailUrl: '',
                            duration: '0:30',
                            description: '',
                            location: 'Copenhagen, Denmark',
                            category: 'Cinematography Reel',
                            aspectRatio: '16:9'
                          });
                          setShowVideoForm(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white text-neutral-950 hover:bg-neutral-200 rounded-xs text-[10px] tracking-widest font-mono font-bold uppercase transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Motion Picture
                      </button>
                    )}
                  </div>

                  {showVideoForm ? (
                    <form onSubmit={handleVideoSubmit} className="space-y-6 bg-neutral-900/10 border border-white/10 p-5 rounded-xs">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider">
                          {editingVideoId ? 'Modify Motion Details' : 'Ingest New Cinematographic Reel'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowVideoForm(false)}
                          className="text-xs text-neutral-500 hover:text-white"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Reel Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Whispering Tides"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Category Label
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Fine Art Short, Commercial Reel"
                            value={videoForm.category}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Video Stream MP4 URL *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="https://player.vimeo.com/external/..."
                            value={videoForm.videoUrl}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none font-mono"
                          />
                          <p className="text-[9px] text-neutral-500 font-mono">
                            Must be a direct MP4 link (e.g. from Vimeo external, Pexels, or direct storage)
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Clip Duration Label
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 0:30, 1:45"
                            value={videoForm.duration}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, duration: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Video Thumbnail Upload / Selection */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                          Reel Cover Thumbnail Image (Upload or CDN URL)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              ref={videoThumbInputRef}
                              onChange={(e) => handlePhotoUpload(e, true)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => videoThumbInputRef.current?.click()}
                              className="w-full flex items-center justify-center gap-2 p-3 border border-white/10 hover:border-white/30 bg-neutral-950 hover:bg-white/5 rounded-xs cursor-pointer text-xs font-mono text-neutral-300 uppercase tracking-wider"
                            >
                              <Upload className="w-4 h-4" /> Upload Local Thumbnail
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Paste external Unsplash image URL..."
                            value={videoForm.thumbnailUrl}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none"
                          />
                        </div>
                        {videoForm.thumbnailUrl && (
                          <div className="mt-2 text-[10px] font-mono text-neutral-500 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> Thumbnail set.
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Location Shot
                          </label>
                          <input
                            type="text"
                            placeholder="Kyoto, Japan"
                            value={videoForm.location}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                            Aspect Ratio
                          </label>
                          <select
                            value={videoForm.aspectRatio}
                            onChange={(e) => setVideoForm(prev => ({ ...prev, aspectRatio: e.target.value as any }))}
                            className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none cursor-pointer"
                          >
                            <option value="16:9">Horizontal (16:9)</option>
                            <option value="9:16">Vertical Social (9:16)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                          Short Synopsis / Description
                        </label>
                        <textarea
                          placeholder="A quick summary of the visual theme of the video reel..."
                          value={videoForm.description}
                          onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full bg-neutral-950 border border-white/10 text-xs text-white px-3 py-2 rounded-xs focus:outline-none h-16 resize-none font-sans font-light"
                        />
                      </div>

                      <div className="flex justify-end gap-3 pt-3 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => setShowVideoForm(false)}
                          className="px-4 py-2 text-[10px] tracking-widest font-mono uppercase text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-white text-neutral-950 hover:bg-neutral-200 text-[10px] tracking-widest font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                        >
                          {editingVideoId ? 'Save Reel Changes' : 'Publish Video Reel'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Video Grid List */
                    <div className="space-y-4">
                      {videos.map((video) => (
                        <div
                          key={video.id}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-neutral-900/40 border border-white/5 p-4 rounded-xs"
                        >
                          <div className="aspect-video w-32 shrink-0 bg-neutral-950 border border-white/10 rounded-xs overflow-hidden relative">
                            {video.thumbnailUrl && (
                              <img
                                src={video.thumbnailUrl}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/75 text-[8px] font-mono rounded-xs">
                              {video.duration}
                            </span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
                              {video.category} • {video.location}
                            </span>
                            <h4 className="text-base font-serif italic text-white truncate mt-0.5">
                              {video.title}
                            </h4>
                            <p className="text-xs text-neutral-400 truncate font-sans font-light max-w-xl mt-1">
                              {video.description}
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5 w-full sm:w-auto">
                            <button
                              onClick={() => handleEditVideo(video)}
                              className="text-[9px] font-mono uppercase text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video.id)}
                              className="text-[9px] font-mono uppercase text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ABOUT / BIOGRAPHY */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4">
                    <h3 className="text-lg font-serif italic text-white">Artist Biography & Vision</h3>
                    <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                      Rewrite the copy and artist statement displayed on the main studio segment.
                    </p>
                  </div>

                  {/* Philosophy Quote */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Artist Philosophy Statement / Quote (Serif display typography)
                    </label>
                    <textarea
                      value={localAbout.quote}
                      onChange={(e) => setLocalAbout(prev => ({ ...prev, quote: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white p-3 rounded-xs focus:outline-none h-16 resize-none font-serif italic"
                    />
                  </div>

                  {/* Bio Paragraph 1 */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Biography Paragraph 1
                    </label>
                    <textarea
                      value={localAbout.bioParagraph1}
                      onChange={(e) => setLocalAbout(prev => ({ ...prev, bioParagraph1: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white p-3 rounded-xs focus:outline-none h-24 resize-none font-sans font-light leading-relaxed"
                    />
                  </div>

                  {/* Bio Paragraph 2 */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Biography Paragraph 2
                    </label>
                    <textarea
                      value={localAbout.bioParagraph2}
                      onChange={(e) => setLocalAbout(prev => ({ ...prev, bioParagraph2: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white p-3 rounded-xs focus:outline-none h-24 resize-none font-sans font-light leading-relaxed"
                    />
                  </div>

                  {/* Location Label */}
                  <div className="space-y-1.5 max-w-xs">
                    <label className="block text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                      Studio Location Label
                    </label>
                    <input
                      type="text"
                      value={localAbout.locationLabel}
                      onChange={(e) => setLocalAbout(prev => ({ ...prev, locationLabel: e.target.value }))}
                      className="w-full bg-neutral-950 border border-white/10 focus:border-white/30 text-xs text-white p-3 rounded-xs focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      onClick={handleAboutSave}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-neutral-950 hover:bg-neutral-200 text-[10px] tracking-widest font-mono font-bold uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5 fill-neutral-950" /> Save Biography Settings
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">Photographic Services ({localAbout.services.length})</h3>
                      <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                        Define professional options and bespoke commissions for clients browsing your studio.
                      </p>
                    </div>
                    <button
                      onClick={handleAddService}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white text-neutral-950 hover:bg-neutral-200 rounded-xs text-[10px] tracking-widest font-mono font-bold uppercase transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Service
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localAbout.services.map((srv, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-neutral-900/40 border border-white/5 p-4 rounded-xs"
                      >
                        <div>
                          <h4 className="text-sm font-serif italic text-white font-normal">{srv.title}</h4>
                          <p className="text-xs text-neutral-500 font-sans font-light mt-0.5 max-w-xl">
                            {srv.desc}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteService(index)}
                          className="p-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: EXHIBITIONS */}
              {activeTab === 'exhibitions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">Solo & Group Exhibitions ({localAbout.exhibitions.length})</h3>
                      <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                        Add art gallery achievements, museum exhibits, and solo curation showcases.
                      </p>
                    </div>
                    <button
                      onClick={handleAddExhibition}
                      className="flex items-center gap-1 px-3 py-1.5 bg-white text-neutral-950 hover:bg-neutral-200 rounded-xs text-[10px] tracking-widest font-mono font-bold uppercase transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" /> Add Exhibition
                    </button>
                  </div>

                  <div className="space-y-3">
                    {localAbout.exhibitions.map((exh, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-neutral-900/40 border border-white/5 p-4 rounded-xs"
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-950 border border-white/10 px-2 py-0.5 rounded-xs mt-0.5 uppercase">
                            {exh.year}
                          </span>
                          <div>
                            <h4 className="text-sm font-serif italic text-white font-normal">
                              {exh.title}
                            </h4>
                            <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                              {exh.venue}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteExhibition(index)}
                          className="p-2 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: INQUIRIES / BOOKINGS INBOX */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h3 className="text-lg font-serif italic text-white">Studio Inquiries Inbox</h3>
                      <p className="text-xs text-neutral-500 font-sans font-light mt-0.5">
                        Manage prospective client bookings, prints procurement requests, and commercial commissions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchInquiries}
                      className="text-[9px] font-mono uppercase text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-0"
                      title="Refresh current bookings list"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Refresh Inbox
                    </button>
                  </div>

                  {inquiriesLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-500">
                      <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">Loading bookings...</span>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="py-16 text-center border border-dashed border-white/10 rounded-xs bg-neutral-900/10">
                      <Inbox className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                      <h4 className="text-sm font-serif italic text-neutral-400">No active inquiries</h4>
                      <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto font-sans font-light animate-pulse">
                        When visitors fill out your online bookings and inquire forms, their sessions will be stored here in real-time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inq) => {
                        const dateFormatted = new Date(inq.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });

                        return (
                          <div
                            key={inq.id}
                            className={`border transition-all rounded-xs overflow-hidden ${
                              inq.status === 'unread'
                                ? 'bg-neutral-900/60 border-emerald-500/20'
                                : 'bg-neutral-900/20 border-white/5'
                            }`}
                          >
                            {/* Inquiry Header Summary */}
                            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {inq.status === 'unread' && (
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                  )}
                                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xs">
                                    {inq.service}
                                  </span>
                                  <span className="text-[10px] font-mono text-neutral-500">
                                    {dateFormatted}
                                  </span>
                                </div>
                                <h4 className="text-sm font-serif italic text-white font-normal">
                                  {inq.subject || 'No Subject'}
                                </h4>
                                <div className="text-xs font-light text-neutral-400 font-sans">
                                  From: <span className="text-neutral-200 font-medium">{inq.name}</span> (<a href={`mailto:${inq.email}`} className="underline hover:text-white transition-colors">{inq.email}</a>)
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 sm:self-start">
                                {inq.status === 'unread' ? (
                                  <button
                                    onClick={() => handleUpdateInquiryStatus(inq.id, 'read')}
                                    className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] font-mono uppercase tracking-wider text-neutral-300 rounded-xs transition-all cursor-pointer"
                                  >
                                    Mark Read
                                  </button>
                                ) : inq.status === 'read' ? (
                                  <button
                                    onClick={() => handleUpdateInquiryStatus(inq.id, 'completed')}
                                    className="px-2.5 py-1.5 bg-emerald-950/20 hover:bg-emerald-900/20 border border-emerald-500/25 text-[9px] font-mono uppercase tracking-wider text-emerald-400 rounded-xs transition-all cursor-pointer"
                                  >
                                    Mark Completed
                                  </button>
                                ) : (
                                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500 px-2 py-1">
                                    ✓ Completed
                                  </span>
                                )}

                                <a
                                  href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Studio Booking Inquiry')}`}
                                  className="px-2.5 py-1.5 bg-white text-neutral-950 hover:bg-neutral-200 text-[9px] font-mono uppercase tracking-widest font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center"
                                >
                                  Reply
                                </a>

                                <button
                                  onClick={() => handleDeleteInquiry(inq.id)}
                                  className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-white/5 rounded-xs transition-colors cursor-pointer bg-transparent border-0"
                                  title="Delete inquiry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Inquiry Message Body */}
                            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-white/5 bg-black/20 text-xs font-light text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                              {inq.message}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

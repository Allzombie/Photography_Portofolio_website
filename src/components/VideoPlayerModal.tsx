import { useEffect, useRef, useState, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, MapPin, Clock } from 'lucide-react';
import { VideoItem } from '../types';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!video) return;

    // Reset player state
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime('0:00');

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [video, onClose]);

  // Handle controls visibility timer
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isPlaying) {
      videoEl.pause();
      setIsPlaying(false);
    } else {
      videoEl.play().catch(() => {});
      setIsPlaying(true);
    }
    resetControlsTimeout();
  };

  const toggleMute = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    videoEl.muted = !isMuted;
    setIsMuted(!isMuted);
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.volume = val;
      videoEl.muted = val === 0;
      setIsMuted(val === 0);
    }
    resetControlsTimeout();
  };

  const handleProgressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    const videoEl = videoRef.current;
    if (videoEl && videoEl.duration) {
      videoEl.currentTime = (val / 100) * videoEl.duration;
    }
    resetControlsTimeout();
  };

  const updateTime = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const current = videoEl.currentTime;
    const dur = videoEl.duration || 0;

    if (dur > 0) {
      setProgress((current / dur) * 100);
    }

    setCurrentTime(formatTime(current));
    setDuration(formatTime(dur));
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
    resetControlsTimeout();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!video) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="video-cinema-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex flex-col justify-center bg-neutral-950/99 backdrop-blur-xl"
        ref={containerRef}
        onMouseMove={resetControlsTimeout}
        onClick={togglePlay}
      >
        {/* Top Control HUD */}
        <div
          id="video-top-hud"
          className={`absolute top-0 inset-x-0 z-30 p-6 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-sm">
                {video.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-neutral-400 font-sans">
                <MapPin className="w-3 h-3" /> {video.location}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-sans tracking-tight text-white font-medium">
              {video.title}
            </h2>
          </div>

          <button
            id="video-close-btn"
            onClick={onClose}
            className="p-3 bg-neutral-900/60 rounded-full border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Exit Cinema Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative w-full h-full max-h-[85vh] flex items-center justify-center">
          <video
            ref={videoRef}
            src={video.videoUrl}
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            onTimeUpdate={updateTime}
            onLoadedMetadata={updateTime}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            autoPlay
            loop
            className="w-full h-full max-w-[90vw] object-contain shadow-2xl rounded-sm pointer-events-auto"
            style={{ maxHeight: '100%' }}
          />

          {/* Centered Large Play/Pause Notification Accent */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="p-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white shadow-xl">
                  <Play className="w-10 h-10 fill-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Cinema Controls Overlay */}
        <div
          id="video-bottom-hud"
          className={`absolute bottom-0 inset-x-0 z-30 p-6 md:px-12 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Timeline slider scrubber */}
          <div className="flex items-center gap-4 w-full">
            <span className="text-xs text-neutral-400 font-mono w-10 text-right">{currentTime}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
              style={{
                background: `linear-gradient(to right, #ffffff ${progress}%, #262626 ${progress}%)`
              }}
            />
            <span className="text-xs text-neutral-400 font-mono w-10 text-left">{duration}</span>
          </div>

          {/* Action buttons controls */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <button
                id="cinema-play-toggle"
                onClick={togglePlay}
                className="text-white hover:text-neutral-300 transition-colors p-1"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="cinema-audio-toggle"
                  onClick={toggleMute}
                  className="text-white hover:text-neutral-300 transition-colors p-1"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #ffffff ${volume * 100}%, #262626 ${volume * 100}%)`
                  }}
                />
              </div>

              <div className="hidden md:flex items-center gap-2 text-neutral-400 font-mono text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>Reel Loop Active</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-xs text-neutral-500 font-mono italic max-w-sm truncate">
                {video.description}
              </span>
              <button
                id="cinema-fullscreen-btn"
                onClick={toggleFullscreen}
                className="text-white hover:text-neutral-300 transition-colors p-1 cursor-pointer"
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

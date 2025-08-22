'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {
  ArrowLeft,
  Moon,
  Sun,
  SkipBack,
  SkipForward,
  BookOpen,
  Clock,
  User,
  List,
  Share2,
  Heart,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Audiobook {
  _id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  coverimage?: string;
  audio_files: string[];
  genre?: string;
  categories?: string[];
  keywords?: string;
}

// Helper functions
const replaceWithCDN = (url: string) => {
  // Your CDN replacement logic
  return url;
};

export default function AudiobookListenClient() {
  const [audiobook, setAudiobook] = useState<Audiobook | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // keep the ref simple; library exposes `audioRef` via this
  const playerRef = useRef<any>(null);

  const router = useRouter();
  const { id } = useParams();
  const { user } = useAuth();

  // Check for mobile
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch audiobook data
  useEffect(() => {
    const fetchAudiobookData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://yeeplatformbackend.azurewebsites.net/getAudiobook/${id}`
        );
        const data: Audiobook = await response.json();
        setAudiobook(data);
      } catch (error) {
        console.error('Error fetching audiobook:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAudiobookData();
  }, [id]);

  // Initialize dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(savedDarkMode);
      document.documentElement.classList.toggle('dark', savedDarkMode);
    }
  }, []);

  // Keep playback speed applied to the <audio> element
  useEffect(() => {
    const audioEl: HTMLAudioElement | undefined =
      playerRef.current?.audio?.current;
    if (audioEl) audioEl.playbackRate = playbackRate;
  }, [playbackRate, currentTrack]);

  const handleTrackChange = (direction: 'prev' | 'next') => {
    if (!audiobook) return;
    if (direction === 'prev' && currentTrack > 0) {
      setCurrentTrack((i) => i - 1);
    } else if (
      direction === 'next' &&
      currentTrack < audiobook.audio_files.length - 1
    ) {
      setCurrentTrack((i) => i + 1);
    }
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrack(index);
    setShowPlaylist(false);
  };

  const handleGoBack = () => router.push('/audiobooks');

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newDarkMode.toString());
      document.documentElement.classList.toggle('dark', newDarkMode);
    }
  };

  const toggleBookmark = () => setIsBookmarked((b) => !b);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share && audiobook) {
      navigator.share({
        title: audiobook.title,
        text: `Listen to "${audiobook.title}" by ${audiobook.author}`,
        url: window.location.href,
      });
    } else if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-200 dark:border-purple-600 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            Loading audiobook...
          </p>
        </div>
      </div>
    );
  }

  if (!audiobook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
            Audiobook not found
          </p>
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Audiobooks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900'
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/30">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="p-2 sm:p-3 rounded-full bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/70 transition-all duration-200 backdrop-blur-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <h1 className="text-base sm:text-lg font-bold text-center truncate max-w-[180px] sm:max-w-xs md:max-w-md text-gray-800 dark:text-gray-100">
            {audiobook.title}
          </h1>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={handleShare}
              className="p-2 sm:p-3 rounded-full bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/70 transition-all duration-200"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 sm:p-3 rounded-full bg-white/20 dark:bg-gray-800/50 hover:bg-white/30 dark:hover:bg-gray-700/70 transition-all duration-200"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className={`${isMobile ? '' : 'sticky top-28'}`}>
              <div className="relative group mb-4 sm:mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <img
                  src={
                    audiobook.coverImage ||
                    audiobook.coverimage ||
                    '/default-cover.jpg'
                  }
                  alt={`Cover for ${audiobook.title}`}
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-xl sm:shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={toggleBookmark}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-1.5 sm:p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isBookmarked ? 'text-red-500 fill-red-500' : 'text-white'
                    }`}
                  />
                </button>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-white/20">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-800 dark:text-gray-100">
                  {audiobook.title}
                </h2>
                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2 sm:mb-4">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="font-medium text-sm sm:text-base">
                    {audiobook.author}
                  </span>
                </div>
                {audiobook.description && (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {audiobook.description}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{audiobook.audio_files.length} chapters</span>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>~{audiobook.audio_files.length * 30} mins</span>
                  </div>
                </div>

                {(!isMobile || !showPlaylist) && (
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                      Playback Speed: {playbackRate}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.25"
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                      className="w-full h-1.5 sm:h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Now Playing
                </h3>
                <div className="flex items-center space-x-2">
                  {isMobile && (
                    <button
                      onClick={() =>
                        setPlaybackRate((prev) => {
                          const next = prev === 2 ? 0.5 : prev + 0.25;
                          return parseFloat(next.toFixed(2));
                        })
                      }
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md"
                    >
                      {playbackRate}x
                    </button>
                  )}
                  <button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 dark:text-gray-100">
                    Chapter {currentTrack + 1}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {audiobook.title}
                  </p>
                </div>
              </div>

              {/* Audio Player (default UI for reliable seeking) */}
              <div className="audio-player-container">
                <AudioPlayer
                  key={audiobook.audio_files[currentTrack]} // reload player on track change
                  ref={playerRef}
                  src={audiobook.audio_files[currentTrack]}
                  preload="metadata"
                  autoPlayAfterSrcChange={false}
                  // built-ins (click & drag seek works by default)
                  showJumpControls={true}          // forward/back 15s
                  showSkipControls={true}          // prev/next track buttons
                  onClickPrevious={() => handleTrackChange('prev')}
                  onClickNext={() => handleTrackChange('next')}
                  onEnded={() => handleTrackChange('next')}
                  onLoadedMetadata={() => {
                    // keep playback speed consistent after load
                    const el: HTMLAudioElement | undefined =
                      playerRef.current?.audio?.current;
                    if (el) el.playbackRate = playbackRate;
                  }}
                  layout={isMobile ? 'stacked' : 'horizontal-reverse'}
                  style={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    borderRadius: '12px',
                  }}
                />
              </div>

              {/* Track Navigation */}
              <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => handleTrackChange('prev')}
                  disabled={currentTrack === 0}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm"
                >
                  <SkipBack className="w-3 h-3 sm:w-4 sm:h-4" />
                  {!isMobile && <span className="font-medium">Previous</span>}
                </button>
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentTrack + 1} of {audiobook.audio_files.length}
                  </p>
                </div>
                <button
                  onClick={() => handleTrackChange('next')}
                  disabled={currentTrack === audiobook.audio_files.length - 1}
                  className="flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg text-xs sm:text-sm"
                >
                  {!isMobile && <span className="font-medium">Next</span>}
                  <SkipForward className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Playlist */}
            {showPlaylist && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-white/20">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
                  Chapters
                </h3>
                <div
                  className={`space-y-2 ${
                    isMobile ? 'max-h-[60vh]' : 'max-h-96'
                  } overflow-y-auto custom-scrollbar`}
                >
                  {audiobook.audio_files.map((_, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleTrackSelect(index)}
                      className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 ${
                        currentTrack === index
                          ? 'bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 shadow-md'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                            currentTrack === index
                              ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <span className="text-xs font-bold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base text-gray-800 dark:text-gray-100">
                            Chapter {index + 1}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {audiobook.title}
                          </p>
                        </div>
                        {currentTrack === index && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .audio-player-container .rhap_container {
          background-color: transparent !important;
          box-shadow: none !important;
          border: none !important;
          padding: ${isMobile ? '8px 0' : '8px 0 8px 8px'};
        }
        .audio-player-container .rhap_main {
          color: ${isDarkMode ? '#f3f4f6' : '#374151'} !important;
        }
        .audio-player-container .rhap_button-clear {
          color: ${isDarkMode ? '#f3f4f6' : '#374151'} !important;
        }
        .audio-player-container .rhap_progress-filled {
          background-color: #8b5cf6 !important;
        }
        .audio-player-container .rhap_progress-bar {
          background-color: ${isDarkMode ? '#4b5563' : '#e5e7eb'} !important;
        }
        .audio-player-container .rhap_time {
          color: ${isDarkMode ? '#d1d5db' : '#4b5563'} !important;
          font-size: ${isMobile ? '12px' : '14px'};
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #8b5cf6, #6366f1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7c3aed, #4f46e5);
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          cursor: pointer;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }
        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #6366f1);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        }
        @media (max-width: 640px) {
          .audio-player-container .rhap_progress-section {
            flex-direction: column;
            align-items: flex-start;
          }
          .audio-player-container .rhap_progress-container {
            margin: 4px 0;
            width: 100%;
          }
          .audio-player-container .rhap_controls-section {
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
}

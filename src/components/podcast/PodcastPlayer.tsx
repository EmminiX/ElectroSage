"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  ChevronDown,
  Podcast,
  Clock,
  Minimize2,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PodcastEpisode {
  id: string;
  title: string;
  section: string;
  duration: string;
  audioUrl: string;
  description?: string;
}

const podcastEpisodes: PodcastEpisode[] = [
  {
    id: "section-1",
    title: "The Atomic Ballet: Unveiling the Dance of Electrons", 
    section: "Section 1",
    duration: "18:24",
    audioUrl: "/podcasts/section-1.mp3",
    description: "Exploring the building blocks of matter and electrical fundamentals"
  },
  {
    id: "section-2", 
    title: "The Invisible Forces of Electricity Unveiled",
    section: "Section 2", 
    duration: "21:38",
    audioUrl: "/podcasts/section-2.mp3",
    description: "Understanding electrical potential and voltage concepts"
  },
  {
    id: "section-3",
    title: "The Hidden Dance of Electricity: Understanding Circuits",
    section: "Section 3",
    duration: "19:52", 
    audioUrl: "/podcasts/section-3.mp3",
    description: "Diving deep into electrical current and electron movement"
  },
  {
    id: "section-4",
    title: "Unveiling the Invisible: Mastering Electrical Measurements", 
    section: "Section 4",
    duration: "23:15",
    audioUrl: "/podcasts/section-4.mp3", 
    description: "Analyzing resistance effects and power calculations"
  },
  {
    id: "section-5",
    title: "The Invisible Dance of Electrical Power",
    section: "Section 5", 
    duration: "20:47",
    audioUrl: "/podcasts/section-5.mp3",
    description: "Mastering series circuit behavior and analysis techniques"
  },
  {
    id: "section-6", 
    title: "Shocking Truths: The Hidden Dangers of Electricity",
    section: "Section 6",
    duration: "22:33", 
    audioUrl: "/podcasts/section-6.mp3",
    description: "Understanding parallel circuits and current division"
  },
  {
    id: "section-7",
    title: "Unveiling the Secrets of Home Electrical Systems", 
    section: "Section 7",
    duration: "25:18",
    audioUrl: "/podcasts/section-7.mp3",
    description: "Exploring complex circuit analysis and advanced topics"
  },
  {
    id: "section-8",
    title: "The Tiny Titans of Technology: Transistors Unleashed",
    section: "Section 8", 
    duration: "19:55",
    audioUrl: "/podcasts/section-8.mp3",
    description: "Components, safety practices, and real-world applications"
  }
];

interface PodcastPlayerProps {
  currentSectionId?: string;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

export default function PodcastPlayer({ 
  currentSectionId, 
  isMinimized = false, 
  onToggleMinimize 
}: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [showEpisodeMenu, setShowEpisodeMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const autoMinimizeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const shouldBePlayingRef = useRef<boolean>(false);

  // Set initial episode based on current section
  useEffect(() => {
    if (currentSectionId) {
      const episodeIndex = podcastEpisodes.findIndex(ep => ep.id === currentSectionId);
      if (episodeIndex !== -1) {
        setCurrentEpisodeIndex(episodeIndex);
      }
    }
  }, [currentSectionId]);

  // Auto-minimize after 5 seconds when player first opens
  useEffect(() => {
    if (!isMinimized && onToggleMinimize) {
      // Clear any existing timer
      if (autoMinimizeTimerRef.current) {
        clearTimeout(autoMinimizeTimerRef.current);
      }
      
      // Set new timer for 5 seconds
      autoMinimizeTimerRef.current = setTimeout(() => {
        onToggleMinimize();
      }, 5000);
    }

    // Cleanup function
    return () => {
      if (autoMinimizeTimerRef.current) {
        clearTimeout(autoMinimizeTimerRef.current);
        autoMinimizeTimerRef.current = null;
      }
    };
  }, [isMinimized, onToggleMinimize]);

  // Keep shouldBePlayingRef in sync with isPlaying state
  useEffect(() => {
    shouldBePlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Simple minimize effect - just log, don't interfere with audio
  useEffect(() => {
    console.log('🔍 Minimize state changed:', {
      isMinimized,
      isPlaying,
      shouldBePlaying: shouldBePlayingRef.current
    });
  }, [isMinimized]);

  // Clear auto-minimize timer on user interaction
  const clearAutoMinimizeTimer = () => {
    if (autoMinimizeTimerRef.current) {
      clearTimeout(autoMinimizeTimerRef.current);
      autoMinimizeTimerRef.current = null;
    }
  };

  const handleMinimizeClick = () => {
    console.log('🔲 Minimize button clicked:', {
      currentlyMinimized: isMinimized,
      isPlaying,
      audioPaused: audioRef.current?.paused,
      currentTime: audioRef.current?.currentTime
    });
    
    if (onToggleMinimize) {
      onToggleMinimize();
    }
  };

  const currentEpisode = podcastEpisodes[currentEpisodeIndex];

  // Audio event handlers - remove dependency on currentEpisodeIndex to prevent recreation
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('🎧 Setting up audio event listeners for:', currentEpisode.title);

    const handleLoadedMetadata = () => {
      console.log('📊 Audio metadata loaded:', {
        duration: audio.duration,
        src: audio.src
      });
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      console.log('🏁 Audio ended, playing next track');
      handleNext();
    };

    const handleLoadStart = () => {
      console.log('⏳ Audio loading started');
      setIsLoading(true);
    };

    const handlePause = () => {
      console.log('⏸️ Audio PAUSE event triggered:', {
        isPlaying,
        shouldBePlaying: shouldBePlayingRef.current,
        isMinimized,
        currentTime: audio.currentTime,
        src: audio.src
      });
      
      // Only prevent unwanted pauses, not user-initiated ones
      if (shouldBePlayingRef.current && !audio.ended) {
        console.log('🔄 Unwanted pause detected, immediately resuming...');
        setTimeout(() => {
          if (audio && audio.paused && shouldBePlayingRef.current && !audio.ended) {
            console.log('▶️ Force resuming audio playback');
            audio.play().catch(error => {
              console.error('❌ Failed to resume audio:', error);
            });
          }
        }, 10);
      }
    };

    const handlePlay = () => {
      console.log('▶️ Audio PLAY event triggered:', {
        src: audio.src,
        currentTime: audio.currentTime
      });
      if (!isPlaying) {
        setIsPlaying(true);
      }
    };

    // Clean up previous listeners first
    audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('ended', handleEnded);
    audio.removeEventListener('loadstart', handleLoadStart);
    audio.removeEventListener('pause', handlePause);
    audio.removeEventListener('play', handlePlay);

    // Add new listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      console.log('🧹 Cleaning up audio event listeners');
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
    };
  }, [currentEpisodeIndex, isMinimized]); // Add isMinimized to prevent stale closures

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log('🎵 Play/Pause button clicked:', { 
      currentState: isPlaying, 
      willBe: !isPlaying,
      isMinimized 
    });

    // Clear auto-minimize timer on user interaction
    clearAutoMinimizeTimer();

    if (isPlaying) {
      console.log('⏸️ User clicked pause');
      shouldBePlayingRef.current = false; // Update ref first
      setIsPlaying(false);
      audio.pause();
    } else {
      console.log('▶️ User clicked play');
      shouldBePlayingRef.current = true; // Update ref first
      setIsPlaying(true);
      audio.play().catch(console.error);
    }
  };

  const handleNext = () => {
    console.log('⏭️ Next track clicked');
    // Clear auto-minimize timer on user interaction
    clearAutoMinimizeTimer();
    
    const audio = audioRef.current;
    if (audio) {
      // Stop current audio completely
      console.log('⏹️ Stopping current audio');
      audio.pause();
      audio.currentTime = 0;
    }
    
    const nextIndex = (currentEpisodeIndex + 1) % podcastEpisodes.length;
    console.log('⏭️ Switching to track:', nextIndex);
    setCurrentEpisodeIndex(nextIndex);
    setCurrentTime(0);
    
    // Always start playing the new track
    shouldBePlayingRef.current = true;
    setIsPlaying(true);
    
    // Wait for new audio source to load then play
    setTimeout(() => {
      if (audioRef.current) {
        console.log('▶️ Starting new track');
        audioRef.current.load(); // Force reload the new source
        audioRef.current.play().catch(console.error);
      }
    }, 100);
  };

  const handlePrevious = () => {
    console.log('⏮️ Previous track clicked');
    // Clear auto-minimize timer on user interaction
    clearAutoMinimizeTimer();
    
    const audio = audioRef.current;
    if (audio) {
      // Stop current audio completely
      console.log('⏹️ Stopping current audio');
      audio.pause();
      audio.currentTime = 0;
    }
    
    const prevIndex = currentEpisodeIndex === 0 ? podcastEpisodes.length - 1 : currentEpisodeIndex - 1;
    console.log('⏮️ Switching to track:', prevIndex);
    setCurrentEpisodeIndex(prevIndex);
    setCurrentTime(0);
    
    // Always start playing the new track
    shouldBePlayingRef.current = true;
    setIsPlaying(true);
    
    // Wait for new audio source to load then play
    setTimeout(() => {
      if (audioRef.current) {
        console.log('▶️ Starting new track');
        audioRef.current.load(); // Force reload the new source
        audioRef.current.play().catch(console.error);
      }
    }, 100);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current;
    const audio = audioRef.current;
    if (!progressBar || !audio) return;

    // Clear auto-minimize timer on user interaction
    clearAutoMinimizeTimer();

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const volumeBar = volumeRef.current;
    if (!volumeBar) return;

    // Clear auto-minimize timer on user interaction
    clearAutoMinimizeTimer();

    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    setVolume(percentage);
    if (audioRef.current) {
      audioRef.current.volume = percentage;
    }
  };

  const handleVolumeMouseDown = () => {
    setIsDraggingVolume(true);
  };

  const handleVolumeMouseUp = () => {
    setIsDraggingVolume(false);
  };

  const handleVolumeMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingVolume) return;
    
    const volumeBar = volumeRef.current;
    if (!volumeBar) return;

    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    
    setVolume(percentage);
    if (audioRef.current) {
      audioRef.current.volume = percentage;
    }
  };

  // Handle global mouse up for volume dragging
  useEffect(() => {
    if (isDraggingVolume) {
      const handleGlobalMouseUp = () => setIsDraggingVolume(false);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDraggingVolume]);

  const handleEpisodeSelect = (episodeIndex: number) => {
    console.log('📋 Episode selected:', episodeIndex);
    // Clear auto-minimize timer on user interaction
    clearAutoMinimizeTimer();
    
    const audio = audioRef.current;
    if (audio) {
      // Stop current audio completely
      console.log('⏹️ Stopping current audio');
      audio.pause();
      audio.currentTime = 0;
    }
    
    setCurrentEpisodeIndex(episodeIndex);
    setCurrentTime(0);
    setShowEpisodeMenu(false);
    
    if (isPlaying) {
      // Wait for new audio source to load then play
      setTimeout(() => {
        if (audioRef.current) {
          console.log('▶️ Starting selected track');
          audioRef.current.load(); // Force reload the new source
          audioRef.current.play().catch(console.error);
        }
      }, 100);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-50"
      >
        {/* Audio Element - SAME instance for minimized version */}
        <audio
          key={`audio-${currentEpisode.id}`}
          ref={audioRef}
          src={currentEpisode.audioUrl}
          preload="metadata"
          onLoadStart={() => console.log('🔄 Audio element loading (minimized):', currentEpisode.audioUrl)}
          onLoadedData={() => console.log('✅ Audio element loaded (minimized):', currentEpisode.audioUrl)}
          onError={(e) => console.error('❌ Audio element error (minimized):', e)}
        />
        <div className="bg-black dark:bg-gray-900 rounded-full shadow-2xl border border-gray-800 dark:border-gray-600 px-4 py-2">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <Podcast className="w-4 h-4 text-purple-400" />
            </div>
            
            <button
              onClick={handlePlayPause}
              className="w-8 h-8 bg-electric-600 hover:bg-electric-700 rounded-full flex items-center justify-center text-white transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3 ml-0.5" />
              )}
            </button>
            
            <div className="text-sm text-white min-w-0 max-w-32">
              <div className="font-medium truncate text-xs">{currentEpisode.section}</div>
            </div>
            
            <button
              onClick={handleMinimizeClick}
              className="w-6 h-6 rounded-full hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl overflow-hidden backdrop-blur-lg"
    >
      {/* Audio Element - key forces recreation on episode change */}
      <audio
        key={`audio-${currentEpisode.id}`}
        ref={audioRef}
        src={currentEpisode.audioUrl}
        preload="metadata"
        onLoadStart={() => console.log('🔄 Audio element loading:', currentEpisode.audioUrl)}
        onLoadedData={() => console.log('✅ Audio element loaded:', currentEpisode.audioUrl)}
        onError={(e) => console.error('❌ Audio element error:', e)}
      />

      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Podcast className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">ElectroSage Podcasts</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Educational Audio Series</p>
            </div>
          </div>
          {onToggleMinimize && (
            <button
              onClick={handleMinimizeClick}
              className="w-8 h-8 rounded-full hover:bg-white/50 dark:hover:bg-gray-800/50 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Episode Selection */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <button
            onClick={() => setShowEpisodeMenu(!showEpisodeMenu)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white text-sm">
                {currentEpisode.section}: {currentEpisode.title}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {currentEpisode.description}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showEpisodeMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showEpisodeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
              >
                {podcastEpisodes.map((episode, index) => (
                  <button
                    key={episode.id}
                    onClick={() => handleEpisodeSelect(index)}
                    className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                      currentEpisodeIndex === index ? 'bg-electric-50 dark:bg-electric-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {episode.section}: {episode.title}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {episode.description}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{episode.duration}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
        >
          <div
            className="h-full bg-gradient-to-r from-electric-500 to-blue-600 rounded-full transition-all group-hover:from-electric-600 group-hover:to-blue-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-600 dark:text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Previous/Play/Next */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={handlePlayPause}
              disabled={isLoading}
              className="w-12 h-12 bg-electric-600 hover:bg-electric-700 disabled:opacity-50 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <div 
              ref={volumeRef}
              className="relative w-20 h-6 flex items-center cursor-pointer group"
              onClick={handleVolumeClick}
              onMouseDown={handleVolumeMouseDown}
              onMouseUp={handleVolumeMouseUp}
              onMouseMove={handleVolumeMouseMove}
            >
              <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="h-full bg-gradient-to-r from-electric-500 to-blue-600 rounded-full transition-all duration-200"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              <div 
                className={`absolute w-3 h-3 bg-white border-2 border-electric-500 rounded-full shadow-md transition-all duration-200 group-hover:scale-110 ${
                  isDraggingVolume ? 'scale-125' : ''
                }`}
                style={{ left: `calc(${volume * 100}% - 6px)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showEpisodeMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowEpisodeMenu(false)}
        />
      )}
    </motion.div>
  );
}
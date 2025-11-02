'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PlayIcon, PauseIcon } from '@/icons';

interface AudioPreviewPlayerProps {
  src: string;
  isPlaying: boolean;
  onPlayStateChange: (isPlaying: boolean) => void;
}

const AudioPreviewPlayer: React.FC<AudioPreviewPlayerProps> = ({
  src,
  isPlaying,
  onPlayStateChange,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      onPlayStateChange(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPlayStateChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        onPlayStateChange(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, onPlayStateChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    onPlayStateChange(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="flex items-center gap-3 bg-gray-2 dark:bg-meta-4 p-3 rounded">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      <button
        onClick={handlePlayPause}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
      >
        {isPlaying ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4" />
        )}
      </button>

      <div className="flex-1 flex items-center gap-2">
        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
          {formatTime(currentTime)}
        </span>
        
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3C50E0 0%, #3C50E0 ${(currentTime / duration) * 100}%, #D1D5DB ${(currentTime / duration) * 100}%, #D1D5DB 100%)`,
          }}
        />
        
        <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[40px]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPreviewPlayer;

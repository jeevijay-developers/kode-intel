import { useState, useRef, useEffect, useCallback } from "react";
import { Brain, Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, RotateCw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface KodeIntelPlayerProps {
  videoId: string;
  title: string;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
  autoCompleteThreshold?: number; // percentage to trigger auto-complete (default 90)
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  setPlaybackRate: (rate: number) => void;
  getPlaybackRate: () => number;
  getPlayerState: () => number;
  destroy: () => void;
}

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function KodeIntelPlayer({
  videoId,
  title,
  onProgress,
  onComplete,
  autoCompleteThreshold = 90,
}: KodeIntelPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [hasTriggeredComplete, setHasTriggeredComplete] = useState(false);
  const [showBigPlay, setShowBigPlay] = useState(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [videoId]);

  const initPlayer = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    playerRef.current = new window.YT.Player("kode-intel-player", {
      videoId,
      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 0,
        disablekb: 1,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (event) => {
          setIsReady(true);
          setDuration(event.target.getDuration());
          setVolume(event.target.getVolume());
        },
        onStateChange: (event) => {
          const state = event.data;
          if (state === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            setShowBigPlay(false);
            startProgressTracking();
          } else if (state === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            stopProgressTracking();
          } else if (state === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            setShowBigPlay(true);
            stopProgressTracking();
          }
        },
      },
    });
  }, [videoId]);

  const startProgressTracking = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    progressInterval.current = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        setCurrentTime(time);
        setDuration(dur);

        const percent = (time / dur) * 100;
        onProgress?.(percent);

        // Auto-complete trigger
        if (percent >= autoCompleteThreshold && !hasTriggeredComplete && onComplete) {
          setHasTriggeredComplete(true);
          onComplete();
        }
      }
    }, 500);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!playerRef.current || !isReady) return;
    const seekTime = (value[0] / 100) * duration;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current || !isReady) return;
    const vol = value[0];
    playerRef.current.setVolume(vol);
    setVolume(vol);
    if (vol === 0) {
      playerRef.current.mute();
      setIsMuted(true);
    } else if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.setPlaybackRate(rate);
    setPlaybackRate(rate);
  };

  const skip = (seconds: number) => {
    if (!playerRef.current || !isReady) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Header Bar */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 backdrop-blur-sm rounded-full p-2">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-white/70 font-medium">Kode Intel</p>
            <p className="text-sm text-white font-semibold line-clamp-1">{title}</p>
          </div>
        </div>
      </div>

      {/* YouTube Player Container */}
      <div className="aspect-video relative">
        <div id="kode-intel-player" className="w-full h-full" />

        {/* Overlay to block YouTube interactions */}
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
        />

        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Brain className="h-16 w-16 text-primary animate-pulse" />
                <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping" />
              </div>
              <p className="text-white/70 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Big Play Button */}
        {isReady && showBigPlay && !isPlaying && (
          <div
            className="absolute inset-0 z-15 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          >
            <div className="bg-primary/90 hover:bg-primary rounded-full p-6 transition-all transform hover:scale-110 shadow-2xl">
              <Play className="h-12 w-12 text-primary-foreground fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Progress Bar */}
        <div className="px-4 pt-6">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-primary"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={() => skip(-10)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={() => skip(10)}
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-200">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Time */}
            <span className="text-white/90 text-sm font-medium ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-white hover:bg-white/20 text-sm font-medium"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  {playbackRate}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[100px]">
                {[0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={cn(
                      "cursor-pointer",
                      playbackRate === rate && "bg-primary/10 text-primary"
                    )}
                  >
                    {rate}x {rate === 1 && "(Normal)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-white hover:bg-white/20"
              onClick={toggleFullscreen}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Corner Branding Overlay (hides YouTube logo) */}
      <div className="absolute bottom-12 right-0 w-32 h-10 bg-gradient-to-l from-black/80 to-transparent z-15 pointer-events-none" />
    </div>
  );
}

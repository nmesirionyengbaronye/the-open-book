'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';

const TRACKS = [
  '/audio/01.mp3',
  '/audio/02.mp3',
  '/audio/03.mp3',
  '/audio/04.mp3',
];

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initializedRef = useRef(false);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio();
    audio.loop = false;
    audio.volume = 0.15;
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onEnded = () => {
      setTrackIndex((prev) => {
        const next = (prev + 1) % TRACKS.length;
        if (audioRef.current) {
          audioRef.current.src = TRACKS[next];
          audioRef.current.load();
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
    };
    const onCanPlay = () => setReady(true);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('canplay', onCanPlay);
    audio.src = TRACKS[0];
    audio.load();
    initializedRef.current = true;
    return audio;
  }, []);

  const toggle = useCallback(async () => {
    const audio = ensureAudio();
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      try {
        audio.load();
        await audio.play();
        setPlaying(true);
      } catch {
        // Still blocked or unavailable
      }
    }
  }, [playing, ensureAudio]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('canplay', () => {});
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={playing ? 'Pause music' : 'Play music'}
      className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-3 py-2 text-xs text-white/80 hover:bg-white/20"
    >
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <Music className="h-4 w-4" />
      <span className="hidden sm:inline">{playing ? 'Pause' : 'Play'}</span>
    </button>
  );
}

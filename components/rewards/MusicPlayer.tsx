'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Music, Pause, Play } from 'lucide-react';

const TRACKS = [
  '/audio/01.mp3',
  '/audio/02.mp3',
  '/audio/03.mp3',
  '/audio/04.mp3',
];

export default function MusicPlayer({ autoPlay = false }: { autoPlay?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio();
    audio.loop = false;
    audio.volume = 0.15;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onCanPlay = () => setReady(true);
    const onEnded = () => {
      setTrackIndex((prev) => {
        const next = (prev + 1) % TRACKS.length;
        if (audioRef.current) {
          audioRef.current.src = TRACKS[next];
          audioRef.current.load();
          if (playing) {
            audioRef.current.play().catch(() => {});
          }
        }
        return next;
      });
    };
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.src = TRACKS[trackIndex];
    audio.load();

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [playing, trackIndex]);

  // Attempt to autoplay when ready and autoPlay is requested.
  // This works because the user just interacted with the Share button,
  // which counts as a user gesture in Telegram's WebView.
  useEffect(() => {
    if (ready && autoPlay && !playing) {
      startPlay();
    }
  }, [ready, autoPlay]); // eslint-disable-line react-hooks/exhaustive-deps

  const startPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      // autoplay blocked
    }
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      // autoplay blocked — silently do nothing; user must click again
    }
  }, [playing]);

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


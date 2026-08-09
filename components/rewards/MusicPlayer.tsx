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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.loop = false;
    audio.volume = 0.15;
    audioRef.current = audio;

    const onEnded = () => {
      setTrackIndex((prev) => {
        const next = (prev + 1) % TRACKS.length;
        if (audioRef.current) {
          audioRef.current.src = TRACKS[next];
          audioRef.current.play().catch(() => {});
        }
        return next;
      });
    };
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        // Autoplay may be blocked until user interaction.
      }
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

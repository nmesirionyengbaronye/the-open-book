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
  // Mirror of the current track so the 'ended' handler (registered once) can
  // advance without going stale.
  const trackIndexRef = useRef(0);

  // Create the Audio element exactly ONCE. Putting `playing`/`trackIndex` in
  // here would tear down and rebuild the element on every play/pause, which
  // stopped playback cold. State changes only drive play/pause/src below.
  useEffect(() => {
    const audio = new Audio(TRACKS[0]);
    audio.loop = false;
    audio.volume = 0.15;
    audio.preload = 'auto';
    audioRef.current = audio;

    const onCanPlay = () => setReady(true);
    const onEnded = () => {
      const next = (trackIndexRef.current + 1) % TRACKS.length;
      trackIndexRef.current = next;
      setTrackIndex(next);
      audio.src = TRACKS[next];
      audio.load();
      audio.play().catch(() => {});
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    trackIndexRef.current = trackIndex;
  }, [trackIndex]);

  // Autoplay once the first track is ready. This is safe because the user has
  // already performed a gesture (tapping Share / the rules modal) by the time
  // the dashboard mounts, which satisfies the browser's autoplay policy.
  useEffect(() => {
    if (ready && autoPlay && !playing) {
      startPlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, autoPlay, playing]);

  const startPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      /* autoplay blocked — user can tap the button */
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
      /* blocked — silently ignore */
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

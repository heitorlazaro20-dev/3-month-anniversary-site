import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play } from "lucide-react";

import songAsset from "@/assets/a-nossa-praia.m4a.asset.json";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.6;
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={songAsset.url} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar nossa música"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg shadow-primary/30 transition hover:opacity-90"
      >
        {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        <span className="hidden text-sm font-medium sm:inline">
          {playing ? "Tocando: A nossa praia" : "Nossa música"}
        </span>
        <Music className={`h-4 w-4 ${playing ? "animate-pulse" : ""}`} />
      </button>
    </>
  );
}

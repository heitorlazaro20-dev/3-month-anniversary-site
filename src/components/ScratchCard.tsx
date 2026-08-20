import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

const THRESHOLD = 45;

function drawSilverLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.save();
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#e2e8f0");
  gradient.addColorStop(0.25, "#f1f5f9");
  gradient.addColorStop(0.5, "#cbd5e1");
  gradient.addColorStop(0.75, "#94a3b8");
  gradient.addColorStop(1, "#e2e8f0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RASPA AQUI ✨", width / 2, height / 2);
  ctx.restore();
}

export function ScratchCard({
  imageUrl,
  message,
}: {
  imageUrl: string;
  message: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [scratched, setScratched] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const size = container.getBoundingClientRect();
    const width = Math.max(1, Math.floor(size.width));
    const height = Math.max(1, Math.floor(size.height));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      ctx.drawImage(img, 0, 0, width, height);
      drawSilverLayer(ctx, width, height);
    };
  }, [imageUrl]);

  const getPos = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratch = (event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { x, y } = getPos(event);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparent = 0;
    const step = 16;
    for (let i = 3; i < pixels.length; i += step * 4) {
      if (pixels[i] === 0) transparent++;
    }
    const total = pixels.length / 4 / step;
    const percent = Math.round((transparent / total) * 100);

    if (percent >= THRESHOLD) {
      setRevealed(true);
      ctx.clearRect(0, 0, width, height);
      if (imageRef.current) {
        ctx.drawImage(
          imageRef.current,
          0,
          0,
          canvas.clientWidth,
          canvas.clientHeight,
        );
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleStart = (e: MouseEvent | TouchEvent) => {
      isDrawingRef.current = true;
      scratch(e);
    };
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      scratch(e);
    };
    const handleEnd = () => {
      if (!isDrawingRef.current) return;
      isDrawingRef.current = false;
      checkProgress();
    };

    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleEnd);
    canvas.addEventListener("touchstart", handleStart, { passive: false });
    canvas.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      canvas.removeEventListener("mousedown", handleStart);
      canvas.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      canvas.removeEventListener("touchstart", handleStart);
      canvas.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, []);

  return (
    <div className="mx-auto max-w-md">
      <div
        ref={containerRef}
        className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border-4 border-white bg-muted shadow-2xl shadow-primary/10"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-pointer touch-none"
          aria-label="Raspadinha: passe o dedo para revelar a foto"
        />
        {!scratched && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white/60" />
          </div>
        )}
      </div>

      <div
        className={`mt-6 text-center transition-all duration-700 ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <p className="rounded-2xl bg-card p-6 font-heading text-xl leading-relaxed text-foreground shadow-lg sm:text-2xl">
          {message}
        </p>
      </div>
    </div>
  );
}

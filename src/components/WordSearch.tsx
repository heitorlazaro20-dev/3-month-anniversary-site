import { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";

const SIZE = 8;
const WORD = "TEAMO";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Fixed diagonal placement so the puzzle is the same for everyone.
const PLACEMENT = { row: 6, col: 1, dr: -1, dc: 1 };

function buildGrid() {
  const grid: string[][] = Array.from({ length: SIZE }, () =>
    Array.from(
      { length: SIZE },
      () => LETTERS[Math.floor(Math.random() * LETTERS.length)] as string,
    ),
  );
  for (let i = 0; i < WORD.length; i++) {
    grid[PLACEMENT.row + PLACEMENT.dr * i]![
      PLACEMENT.col + PLACEMENT.dc * i
    ] = WORD[i]!;
  }
  return grid;
}

const TARGET_KEYS = Array.from(
  { length: WORD.length },
  (_, i) =>
    `${PLACEMENT.row + PLACEMENT.dr * i}-${PLACEMENT.col + PLACEMENT.dc * i}`,
);

function HeartsRain() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 2.5 + Math.random() * 2,
        size: 18 + Math.random() * 28,
        opacity: 0.6 + Math.random() * 0.4,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute fill-primary text-primary"
          style={{
            left: `${h.left}%`,
            top: "-10%",
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animation: `heart-fall ${h.duration}s linear ${h.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes heart-fall {
          0% { transform: translateY(0) rotate(-15deg); }
          100% { transform: translateY(115vh) rotate(25deg); }
        }
      `}</style>
    </div>
  );
}

export function WordSearch() {
  const [grid] = useState(buildGrid);
  const [selected, setSelected] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const draggingRef = useRef(false);
  const selectedRef = useRef<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!celebrating) return;
    const t = setTimeout(() => setCelebrating(false), 5000);
    return () => clearTimeout(t);
  }, [celebrating]);

  const addFromPoint = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    const key = el?.dataset?.['cell'];
    if (!key) return;
    setSelected((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      selectedRef.current = next;
      return next;
    });
  };

  const finish = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const prev = selectedRef.current;
    const ok =
      prev.length === TARGET_KEYS.length &&
      TARGET_KEYS.every((k) => prev.includes(k));
    if (ok) {
      setSelected(TARGET_KEYS);
      setFound(true);
      setCelebrating(true);
    } else {
      setSelected([]);
    }
  };

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const start = (e: PointerEvent) => {
      if (found) return;
      draggingRef.current = true;
      setSelected([]);
      selectedRef.current = [];
      addFromPoint(e.clientX, e.clientY);
    };
    const move = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      addFromPoint(e.clientX, e.clientY);
    };

    board.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    return () => {
      board.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", finish);
    };
  }, [found]);

  return (
    <div className="mx-auto max-w-md">
      {celebrating && <HeartsRain />}

      <div
        ref={boardRef}
        className="grid touch-none select-none gap-1 rounded-3xl bg-card p-3 shadow-xl shadow-primary/5 sm:gap-1.5 sm:p-4"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const key = `${r}-${c}`;
            const active = selected.includes(key);
            return (
              <div
                key={key}
                data-cell={key}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm font-semibold uppercase transition-colors sm:text-base ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground/70"
                }`}
              >
                {letter}
              </div>
            );
          }),
        )}
      </div>

      <p
        className={`mt-6 text-center font-heading text-2xl transition-all duration-500 sm:text-3xl ${
          found
            ? "translate-y-0 text-primary opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        Você achou: TE AMO ❤️
      </p>
    </div>
  );
}

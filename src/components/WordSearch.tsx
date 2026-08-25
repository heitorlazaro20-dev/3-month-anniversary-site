import { useEffect, useMemo, useRef, useState } from "react";
import { Heart } from "lucide-react";

const SIZE = 12;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const WORDS = [
  { word: "AMOR", row: 2, col: 1, dr: 0, dc: 1 },
  { word: "LINDA", row: 3, col: 8, dr: 1, dc: 0 },
  { word: "MARAVILHOSA", row: 10, col: 0, dr: 0, dc: 1 },
];

const WORD_KEYS = WORDS.map(({ word, row, col, dr, dc }) => ({
  word,
  keys: Array.from(
    { length: word.length },
    (_, i) => `${row + dr * i}-${col + dc * i}`,
  ),
}));

// Deterministic PRNG so SSR and client render the same grid.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildGrid() {
  const rand = mulberry32(20260822);
  const grid: string[][] = Array.from({ length: SIZE }, () =>
    Array.from(
      { length: SIZE },
      () => LETTERS[Math.floor(rand() * LETTERS.length)] as string,
    ),
  );
  for (const { word, row, col, dr, dc } of WORDS) {
    for (let i = 0; i < word.length; i++) {
      grid[row + dr * i]![col + dc * i] = word[i]!;
    }
  }
  return grid;
}

const ALL_TARGET_KEYS = WORD_KEYS.flatMap(({ keys }) => keys);

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
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [celebrating, setCelebrating] = useState(false);
  const draggingRef = useRef(false);
  const selectedRef = useRef<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);
  const hasCelebratedRef = useRef(false);

  const allFound = foundWords.length === WORD_KEYS.length;

  useEffect(() => {
    if (!celebrating) return;
    const t = setTimeout(() => setCelebrating(false), 5000);
    return () => clearTimeout(t);
  }, [celebrating]);

  useEffect(() => {
    if (allFound && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      setCelebrating(true);
    }
  }, [allFound]);

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

    const newlyFound = WORD_KEYS.filter(
      ({ word, keys }) =>
        !foundWords.includes(word) && keys.every((k) => prev.includes(k)),
    ).map(({ word }) => word);

    if (newlyFound.length > 0) {
      const nextFound = [...foundWords, ...newlyFound];
      setFoundWords(nextFound);
      setSelected([]);
      selectedRef.current = [];
    } else {
      setSelected([]);
      selectedRef.current = [];
    }
  };

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const start = (e: PointerEvent) => {
      if (allFound) return;
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
  }, [allFound, foundWords]);

  return (
    <div className="mx-auto max-w-md">
      {celebrating && <HeartsRain />}

      <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
        {WORD_KEYS.map(({ word }) => {
          const isFound = foundWords.includes(word);
          return (
            <span
              key={word}
              className={`relative rounded-full px-3 py-1 text-sm font-medium uppercase tracking-wide transition-colors ${
                isFound
                  ? "bg-primary/20 text-primary"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {word}
              {isFound && (
                <span className="absolute inset-x-2 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}
            </span>
          );
        })}
      </div>

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
                className={`flex aspect-square items-center justify-center rounded-lg text-xs font-semibold uppercase transition-colors sm:text-sm ${
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
          allFound
            ? "translate-y-0 text-primary opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        Você achou todas as palavras! ❤️
      </p>
    </div>
  );
}

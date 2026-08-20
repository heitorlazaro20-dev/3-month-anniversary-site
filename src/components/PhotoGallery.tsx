import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

export type GalleryPhoto = {
  key: string;
  src: string;
  alt: string;
  caption: string;
};

const MAX_LENGTH = 120;

function useCaptions() {
  return useQuery({
    queryKey: ["photo-captions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photo_captions")
        .select("photo_key, caption");
      if (error) throw error;
      const map: Record<string, string> = {};
      for (const row of data ?? []) map[row.photo_key] = row.caption;
      return map;
    },
  });
}

function CaptionEditor({
  photoKey,
  value,
}: {
  photoKey: string;
  value: string;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const mutation = useMutation({
    mutationFn: async (caption: string) => {
      const { error: dbError } = await supabase
        .from("photo_captions")
        .upsert({ photo_key: photoKey, caption }, { onConflict: "photo_key" });
      if (dbError) throw dbError;
      return caption;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photo-captions"] });
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: () => setError("Não consegui salvar. Tenta de novo."),
  });

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Escreve alguma coisa fofa 💙");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Máximo de ${MAX_LENGTH} caracteres.`);
      return;
    }
    setError(null);
    mutation.mutate(trimmed);
  };

  if (!editing) {
    return (
      <div className="flex items-center justify-center gap-2">
        <p className="font-heading text-lg text-foreground">{value}</p>
        <button
          type="button"
          aria-label="Editar legenda"
          onClick={() => {
            setDraft(value);
            setError(null);
            setEditing(true);
          }}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </button>
        {saved && (
          <span className="text-xs font-medium text-primary">salvo!</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2 text-left">
      <textarea
        autoFocus
        rows={2}
        value={draft}
        maxLength={MAX_LENGTH}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {draft.length}/{MAX_LENGTH}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
          >
            <X className="h-3.5 w-3.5" />
            Cancelar
          </button>
          <button
            type="button"
            onClick={save}
            disabled={mutation.isPending}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Check className="h-3.5 w-3.5" />
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const { data: captions } = useCaptions();

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {photos.map((photo) => (
        <div
          key={photo.key}
          className="group overflow-hidden rounded-2xl bg-card shadow-lg"
        >
          <div className="relative overflow-hidden">
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-4 text-center">
            <CaptionEditor
              photoKey={photo.key}
              value={captions?.[photo.key] ?? photo.caption}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

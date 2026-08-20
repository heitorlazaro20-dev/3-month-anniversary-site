CREATE TABLE public.photo_captions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  photo_key TEXT NOT NULL UNIQUE,
  caption TEXT NOT NULL CHECK (char_length(caption) <= 120),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.photo_captions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.photo_captions TO authenticated;
GRANT ALL ON public.photo_captions TO service_role;

ALTER TABLE public.photo_captions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view captions" ON public.photo_captions FOR SELECT USING (true);
CREATE POLICY "Anyone can add captions" ON public.photo_captions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can edit captions" ON public.photo_captions FOR UPDATE USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_photo_captions_updated_at
BEFORE UPDATE ON public.photo_captions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.photo_captions (photo_key, caption) VALUES
  ('IMG-20260703-WA0026', 'Nosso mundo particular'),
  ('IMG-20260818-WA0010', 'Esse sorriso é meu lugar favorito'),
  ('IMG-20260318-WA0629', 'Torcendo por você sempre'),
  ('IMG-20260818-WA0012', 'Tardes que eu queria pausar'),
  ('IMG-20260720-WA0052', 'Aventuras pra contar pra você'),
  ('IMG-20260615-WA0014', 'Rir com você é o melhor'),
  ('IMG-20260818-WA0011', 'Cada detalhe seu'),
  ('IMG-20260514-WA0049', 'Nós dois juntinhos');
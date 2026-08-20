import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Calendar, Clock, Sparkles } from "lucide-react";

import heroAsset from "../assets/IMG-20260514-WA0049.jpg.asset.json";
import minecraftAsset from "../assets/IMG-20260703-WA0026.jpg.asset.json";
import oncaAsset from "../assets/IMG-20260720-WA0052.jpg.asset.json";
import filtroAsset from "../assets/IMG-20260615-WA0014.jpg.asset.json";
import voleiAsset from "../assets/IMG-20260318-WA0629.jpg.asset.json";
import parque1Asset from "../assets/IMG-20260818-WA0012.jpg.asset.json";
import parque2Asset from "../assets/IMG-20260818-WA0010.jpg.asset.json";
import parque3Asset from "../assets/IMG-20260818-WA0011.jpg.asset.json";

import { PhotoGallery, type GalleryPhoto } from "@/components/PhotoGallery";

const photos: GalleryPhoto[] = [
  { key: "IMG-20260703-WA0026", src: minecraftAsset.url, alt: "Nós dois no cenário de Minecraft", caption: "Nosso mundo particular" },
  { key: "IMG-20260818-WA0010", src: parque2Asset.url, alt: "Ela sorrindo com uma flor no cabelo", caption: "Esse sorriso é meu lugar favorito" },
  { key: "IMG-20260318-WA0629", src: voleiAsset.url, alt: "Ela jogando vôlei na quadra", caption: "Torcendo por você sempre" },
  { key: "IMG-20260818-WA0012", src: parque1Asset.url, alt: "Ela no parque ao entardecer", caption: "Tardes que eu queria pausar" },
  { key: "IMG-20260720-WA0052", src: oncaAsset.url, alt: "Ele ao lado de uma onça", caption: "Aventuras pra contar pra você" },
  { key: "IMG-20260615-WA0014", src: filtroAsset.url, alt: "Nós dois com filtro engraçado", caption: "Rir com você é o melhor" },
  { key: "IMG-20260818-WA0011", src: parque3Asset.url, alt: "Ela olhando para a câmera no fim de tarde", caption: "Cada detalhe seu" },
];



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3 Meses de Nós" },
      { name: "description", content: "Uma carta de amor para celebrar três meses de namoro." },
      { property: "og:title", content: "3 Meses de Nós" },
      { property: "og:description", content: "Uma carta de amor para celebrar três meses de namoro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const START_DATE = new Date("2026-05-19T00:00:00");

function formatTimeSince(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30.44);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return { months, days, hours, minutes };
}

function CountUp() {
  const [elapsed, setElapsed] = useState<ReturnType<typeof formatTimeSince> | null>(null);

  useEffect(() => {
    setElapsed(formatTimeSince(START_DATE));
    const timer = setInterval(() => {
      setElapsed(formatTimeSince(START_DATE));
    }, 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { value: elapsed?.months, label: "meses" },
    { value: elapsed?.days, label: "dias" },
    { value: elapsed?.hours, label: "horas" },
    { value: elapsed?.minutes, label: "minutos" },
  ];


  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center rounded-2xl bg-card/80 p-4 shadow-sm backdrop-blur-sm"
        >
          <span className="font-heading text-3xl font-semibold text-primary sm:text-4xl">
            {item.value ?? "—"}
          </span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-soft/60 via-background to-background" />
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="order-2 flex flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                <span>3 meses de nós</span>
              </div>
              <h1 className="font-heading text-5xl leading-[1.1] text-foreground sm:text-6xl lg:text-7xl">
                Cada dia ao seu lado é uma página nova da nossa história
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Hoje celebramos três meses de sorrisos, abraços e sonhos
                compartilhados. Obrigado por tornar a minha vida tão mais bonita.
              </p>
              <div className="mt-8 flex items-center gap-2 text-sm font-medium text-primary">
                <Calendar className="h-4 w-4" />
                <span>Desde 19 de maio de 2026</span>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
                <img
                  src={heroAsset.url}
                  alt="Nós dois juntinhos"
                  className="h-full w-full object-cover"
                  loading="eager"
                />

                <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-sm">
                  <Heart className="h-4 w-4 fill-primary text-primary" />
                  <span>Te amo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Letter */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-3xl bg-card p-8 shadow-xl shadow-primary/5 sm:p-12">
            <div className="absolute -top-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Heart className="h-5 w-5 fill-current" />
            </div>

            <h2 className="mb-8 text-center font-heading text-3xl text-foreground sm:text-4xl">
              Uma carta para você
            </h2>

            <div className="space-y-5 text-base leading-relaxed text-foreground/90 sm:text-lg">
              <p>
                Quando penso nos últimos três meses, sinto que o tempo voou e,
                ao mesmo tempo, parece que já foram tantas memórias que não
                caberiam em anos.
              </p>
              <p>
                Você chegou na minha vida com aquela leveza que só o verdadeiro
                carinho tem. Cada conversa, cada olhar, cada silêncio
                confortável ao seu lado me mostrou que o amor pode ser simples,
                seguro e profundamente bonito.
              </p>
              <p>
                Eu amo a forma como você ri das minhas piadas ruins, como me
                apoia nos dias difíceis e como me faz querer ser uma pessoa
                melhor só para te acompanhar.
              </p>
              <p>
                Nesses 90 dias, aprendi que o amor não está apenas nos grandes
                gestos, mas nas pequenas coisas do dia a dia: uma mensagem de
                bom dia, um café dividido, uma mão dada no momento certo.
              </p>
              <p className="font-heading text-xl text-primary sm:text-2xl">
                Obrigado por ser você. Obrigado por ser minha. Que venham
                muitos, muitos meses ao seu lado.
              </p>
            </div>

            <div className="mt-10 text-center">
              <p className="font-heading text-2xl text-foreground">Com amor,</p>
              <p className="mt-1 text-lg text-muted-foreground">Eu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
              Momentos que guardo com carinho
            </h2>
            <p className="mt-3 text-muted-foreground">
              Alguns dos instantes que fazem o nosso amor tão especial
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.src}
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
                  <p className="font-heading text-lg text-foreground">
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Counter */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-gradient-to-br from-sky-soft/70 to-peach-soft/70 p-8 text-center shadow-xl shadow-primary/5 sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-background/80 shadow-sm">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
              Nosso tempo juntos
            </h2>
            <p className="mt-2 text-muted-foreground">
              E cada segundo só aumenta o quanto eu te amo
            </p>
            <div className="mt-8">
              <CountUp />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <Heart className="mx-auto h-6 w-6 fill-primary text-primary" />
          <p className="mt-4 font-heading text-2xl text-foreground">
            Para sempre, nós.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Feito com carinho para celebrar 3 meses de amor.
          </p>
        </div>
      </footer>
    </main>
  );
}

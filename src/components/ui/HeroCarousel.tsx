'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { heroSlides } from '@/lib/data';

export function HeroCarousel() {
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const timer = setInterval(() => {
      setAtivo((atual) => (atual + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [pausado]);

  const anterior = () => setAtivo((atual) => (atual - 1 + heroSlides.length) % heroSlides.length);
  const proximo = () => setAtivo((atual) => (atual + 1) % heroSlides.length);

  return (
    <div
      className="relative grid overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/20 lg:grid-cols-[1.4fr_0.6fr]"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      <div className="relative aspect-[16/9] min-h-[280px] sm:min-h-[340px] lg:aspect-auto lg:min-h-[420px]">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              index === ativo ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
            }`}
          >
            <Image src={slide.src} alt={slide.alt} fill priority={index === 0} sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <p className="max-w-xs rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            {heroSlides[ativo].legenda}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={anterior}
              aria-label="Slide anterior"
              className="grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/35"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={proximo}
              aria-label="Próximo slide"
              className="grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/35"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden flex-col gap-2 bg-black/20 p-3 backdrop-blur-sm lg:flex">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setAtivo(index)}
            className={`relative flex-1 overflow-hidden rounded-xl transition-all duration-300 ${
              index === ativo ? 'ring-2 ring-white/80 scale-[1.02]' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Image src={slide.src} alt={slide.alt} fill sizes="200px" className="object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <span className="absolute bottom-2 left-2 right-2 text-left text-xs font-semibold text-white">
              {slide.legenda}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 lg:hidden">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir para slide ${index + 1}`}
            onClick={() => setAtivo(index)}
            className={`h-2 rounded-full transition-all ${index === ativo ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

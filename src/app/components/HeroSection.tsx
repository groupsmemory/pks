'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BeritaItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string | null;
  published_at: string;
}

interface HeroSectionProps {
  berita: BeritaItem[];
}

const QUOTE = {
  text: '"Kita sebagai kader partai Islam rahmatan lil\'alamin, jangan bosan menjadi pelopor kebaikan di masyarakat: Kebaikan ritual, sosial, susila, sampai kebaikan profesional."',
  author: 'H. Mohamad Sohibul Iman, Ph.D.',
  role: 'Presiden PKS',
};

export default function HeroSection({ berita }: HeroSectionProps) {
  const [current, setCurrent] = useState(0);
  const slides = berita.slice(0, 5);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3">
              Selamat Datang di Portal Resmi
            </h1>
            <p className="text-lg opacity-90">
              Dewan Pengurus Daerah PKS Kabupaten Pamekasan
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* News Slider */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-2xl bg-black/20">
            <div className="relative aspect-[16/9] lg:aspect-[16/10]">
              {slides.map((item, i) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  {item.image_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-900 flex items-center justify-center">
                      <span className="text-6xl opacity-30" aria-hidden="true">📰</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                    <Link href={`/berita/${item.slug}`} className="block group">
                      <p className="text-xs text-blue-200 mb-1">
                        {new Date(item.published_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                      <h2 className="text-[1.125em] lg:text-[1.5em] font-bold group-hover:underline line-clamp-2">
                        {item.title}
                      </h2>
                      {item.excerpt && (
                        <p className="text-sm text-gray-200 mt-2 line-clamp-2 hidden sm:block">
                          {item.excerpt}
                        </p>
                      )}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
              <button
                onClick={prev}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white text-sm transition"
                aria-label="Berita sebelumnya"
              >
                ◀
              </button>
              <div className="flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white' : 'bg-white/40'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur flex items-center justify-center text-white text-sm transition"
                aria-label="Berita selanjutnya"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Quote Card */}
          <div className="lg:col-span-2 flex">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-6 lg:p-8 flex flex-col justify-center w-full">
              <div className="mb-4">
                <span className="text-4xl leading-none opacity-50" aria-hidden="true">❝</span>
              </div>
              <blockquote className="text-[1.0625em] lg:text-[1.125em] leading-relaxed font-light">
                {QUOTE.text}
              </blockquote>
              <div className="mt-6 pt-4 border-t border-white/20">
                <p className="font-bold">{QUOTE.author}</p>
                <p className="text-sm opacity-70">{QUOTE.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

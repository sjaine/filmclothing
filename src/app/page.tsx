'use client'

import MovieCard from '@/app/components/MovieCard';
import movies from '@/app/data/movies';

import Image from 'next/image';

export default function Home() {
  return (
    <main className="w-screen h-screen flex flex-col justify-between items-center overflow-hidden">
      <header className="text-[13vw] leading-none">{"{FILMSCLOTHING.CA}"}</header>
      <Image src="/dancing2.gif" width={170} height={150} alt="Dancing Ascii Art" className="pb-2" />

      <section className="flex flex-row gap-4 overflow-x-auto w-full p-4 max-w-full">
        {movies.map((movie, index) => (
          <div key={index} className="shrink-0">
            <MovieCard {...movie} />
          </div>
        ))}
      </section>
    </main>
  );
}

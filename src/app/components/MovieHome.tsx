'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';

import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  year: string;
  ratings: string[];
  poster: string;
}

export default function MovieScroller({ posts }: { posts: Post[] }) {
  const itemsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!itemsRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - itemsRef.current.offsetLeft);
    setScrollLeft(itemsRef.current.scrollLeft);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!itemsRef.current || !isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - itemsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    itemsRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <main className="w-screen h-screen flex flex-col justify-between items-center overflow-hidden">
      <motion.header
        className="text-[12vw] leading-none"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {'{FILMSCLOTHING.ONE}'}
      </motion.header>

      <Image src="/dancing2.gif" width={170} height={150} alt="Dancing Ascii Art" className="pb-2" />

      <section
        ref={itemsRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex flex-row gap-4 overflow-x-auto w-full p-4 max-w-full"
      >
        {posts.map((movie, index) => (
          <motion.div
            key={movie.id}
            className="shrink-0 cursor-grab"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              duration: 0.8,
              delay: 0.1 * index,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{ rotate: -5, transition: { duration: 0.4 } }}
            whileTap={{ rotate: -5, transition: { duration: 0.4 } }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </section>
    </main>
  );
}

'use client'

import React, { useRef, useState } from 'react';
import MovieCard from '@/app/components/MovieCard';
import movies from '@/app/data/movies';
import { motion } from "framer-motion"

import Image from 'next/image';

// https://www.youtube.com/watch?v=uj1LLh-IahM Scroll

export default function Home() {
  const itemsRef = useRef(null);
  const [ isMouseDown, setIsMouseDown ] = useState(false);
  const [ startX, setStartX]  = useState(0);
  const [ scrollLeft, setScrollLeft ] = useState(0);

  const handleMouseDown = (e: { pageX: number; }) => {
    setIsMouseDown(true);
    setStartX(e.pageX - itemsRef.current.offsetLeft);
    setScrollLeft(itemsRef.current.scrollLeft);
  }

  const handleMouseLeave = (e: { preventDefault: () => void; pageX: number; }) => {
    if(!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - itemsRef.current.offsetLeft;
    const walk = (x-startX)*2; 
    itemsRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsMouseDown(false);
  }

  const handleMouseMove = (e: { preventDefault: () => void; pageX: number; }) => {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - itemsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    itemsRef.current.scrollLeft = scrollLeft - walk;
  };
  

  return (
    <main className="w-screen h-screen flex flex-col justify-between items-center overflow-hidden">
      <motion.header 
        className="text-[13vw] leading-none"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {"{FILMSCLOTHING.CA}"}
      </motion.header>
      <Image src="/dancing2.gif" width={170} height={150} alt="Dancing Ascii Art" className="pb-2" />

      <section 
        ref={itemsRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex flex-row gap-4 overflow-x-auto w-full p-4 max-w-full"
      >
        {movies.map((movie, index) => (
          <motion.div 
            key={index} 
            className="shrink-0 cursor-grab"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              duration: 0.8,
              delay: 0.1 * index,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              rotate: -5,
              transition: { duration: 0.4 },
            }}
            whileTap={{
              rotate: -5,
              transition: { duration: 0.4 },
            }}
          >
            <MovieCard {...movie} />
          </motion.div>
        ))}
      </section>
    </main>
  );
}

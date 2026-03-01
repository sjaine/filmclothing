"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  year: string;
  ratings: string[];
  poster: string;
}

interface MovieScrollerProps {
  initialData: {
    posts: Post[];
    nextCursor: string | null;
    hasMore: boolean;
  };
}

export default function MovieScroller({ initialData }: MovieScrollerProps) {
  const [movies, setMovies] = useState<Post[]>(initialData.posts);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData.nextCursor
  );
  const [hasMore, setHasMore] = useState<boolean>(initialData.hasMore);
  const [isLoading, setIsLoading] = useState(false);

  const itemsRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api?cursor=${nextCursor}`);
      const data = await response.json();

      setMovies((prev) => [...prev, ...data.posts]); 
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
        {"{FILMSCLOTHING.ONE}"}
      </motion.header>

      <Image
        src="/dancing2.gif"
        width={170}
        height={150}
        alt="Dancing Ascii Art"
        className="pb-2"
      />

      <section
        ref={itemsRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex flex-row gap-4 overflow-x-auto w-full p-4 max-w-full"
      >
        {movies.map((movie, index) => (
          <motion.div
            key={`${movie.id}-${index}`} 
            className="shrink-0 cursor-grab"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              duration: 0.8,
              delay: 0.05, 
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{ rotate: -5, transition: { duration: 0.4 } }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}

        {hasMore && (
          <div className="shrink-0 flex items-center justify-center pr-10">
            <button
              onClick={fetchMorePosts}
              disabled={isLoading}
              className="text-[3vw] pl-5 hover:italic transition-all disabled:opacity-30 cursor-pointer"
            >
              {isLoading ? "[LOADING]" : "[MORE]"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

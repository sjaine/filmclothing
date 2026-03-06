"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MovieCard from "./MovieCard";
import Image from "next/image";
import FilterMenu from "./FilteredMovies";

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
  const skeletonCount = 10;

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

  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [filterRating, setFilterRating] = useState<string | null>(null);

  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      const res = await fetch("/api?type=counts");
      const data = await res.json();
      setCounts(data);
    };
    fetchCounts();
  }, []);

  const handleFilterChange = (selectedRating: string | null) => {
    setFilterRating(selectedRating);
  };

  const handleMouseMoveGlobal = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });

    if (!itemsRef.current || !isMouseDown) return;
    const x = e.pageX - itemsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    itemsRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleGlobalWheel = (e: WheelEvent) => {
    if (!itemsRef.current) return;
    itemsRef.current.scrollLeft += e.deltaY;
  };

  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }
    resetAndFetch();
  }, [filterRating]);

  const displayedMovies = Array.isArray(movies) ? movies : [];

  const resetAndFetch = async () => {
    setIsLoading(true);
    try {
      const ratingQuery = filterRating
        ? `&rating=${encodeURIComponent(filterRating)}`
        : "";
      const response = await fetch(`/api?cursor=${ratingQuery}`);
      const data = await response.json();

      if (data && Array.isArray(data.posts)) {
        setMovies(data.posts);
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
        if (itemsRef.current) itemsRef.current.scrollLeft = 0;
      }
    } catch (error) {
      console.error("Filter fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const resetAndFetch = async () => {
      setIsLoading(true);
      setMovies([]);

      try {
        const ratingQuery = filterRating
          ? `&rating=${encodeURIComponent(filterRating)}`
          : "";
        const response = await fetch(`/api?cursor=${ratingQuery}`);
        const data = await response.json();

        if (data && Array.isArray(data.posts)) {
          setMovies(data.posts);
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
        }
      } catch (error) {
        console.error("Filter fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    resetAndFetch();
  }, [filterRating]);

  useEffect(() => {
    window.addEventListener("wheel", handleGlobalWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleGlobalWheel);
  }, []);

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const query = filterRating
        ? `&rating=${encodeURIComponent(filterRating)}`
        : "";
      const response = await fetch(`/api?cursor=${nextCursor}${query}`);
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
    <main
      className="w-screen h-screen flex flex-col justify-between items-center overflow-y-scroll md:overflow-hidden"
      onMouseMove={handleMouseMoveGlobal}
    >
      {hoveredTitle && (
        <motion.div
          className="fixed pointer-events-none z-50 bg-white text-black px-2 py-1 font-bold border border-black"
          style={{
            left: mousePos.x + 15,
            top: mousePos.y + 15,
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {hoveredTitle}
        </motion.div>
      )}
      <motion.header
        className="text-[12vw] leading-none"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {"{FILMSCLOTHING.ONE}"}
      </motion.header>

      <div className="w-[50vw] max-w-[250px] min-w-[150px] relative pb-2 flex justify-center items-center">
        <Image 
          src="/dancing2.gif"
          width={170}
          height={150}
          alt="Dancing Ascii Art"
          className="w-full h-auto object-contain"
          unoptimized
        />
      </div>

      <div className="w-full flex flex-col items-start">
        <FilterMenu
          onFilterChange={handleFilterChange}
          counts={counts}
          activeFilter={filterRating}
        />

        <section
          ref={itemsRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex flex-row gap-4 overflow-x-auto w-full p-4 max-w-full"
        >
          <AnimatePresence mode="popLayout">
            {isLoading && movies.length === 0
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <motion.div
                    key={`skeleton-${i}`}
                    initial={{ opacity: 0, filter: "blur(5px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    className="shrink-0 md:w-[270px] md:h-[380px] bg-black/5 rounded-lg overflow-y-scroll md:overflow-hidden relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                ))
              : displayedMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    layout
                    className="shrink-0 cursor-grab"
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.98,
                      filter: "blur(3px)",
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.95,
                      filter: "blur(3px)",
                      transition: { duration: 0.3 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 70,
                      damping: 15,
                      mass: 1,
                      delay: 0.05,
                    }}
                    whileHover={{ rotate: -5, transition: { duration: 0.4 } }}
                  >
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onMouseEnter={() => setHoveredTitle(movie.title)}
                      onMouseLeave={() => setHoveredTitle(null)}
                    />
                  </motion.div>
                ))}
          </AnimatePresence>

          {hasMore && (
            <div className="shrink-0 flex items-center justify-center pr-10">
              <button
                onClick={fetchMorePosts}
                disabled={isLoading}
                className="text-lg md:text-[3vw] pl-5 hover:italic transition-all disabled:opacity-30 cursor-pointer"
              >
                {isLoading ? "[LOADING]" : "[MORE]"}
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

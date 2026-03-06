import Image from "next/image";

const getOptimizedImageUrl = (url: string) => {
  if (!url) return "";

  if (url.includes("m.media-amazon.com")) {
    const baseUrl = url.split("._V1_")[0];
    return `${baseUrl}._V1_UX500_.webp`;
  }

  return url;
};
interface Post {
  id: string;
  title: string;
  year: string;
  ratings: string[];
  poster: string;
}

interface MovieCardProps {
  movie: Post;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MovieCard({
  movie,
  onMouseEnter,
  onMouseLeave,
}: MovieCardProps) {
  const optimizedPoster = getOptimizedImageUrl(movie.poster);

  return (
    <div
      className="movie-card select-none"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex justify-between">
        <p className="text-base md:text-xl">{movie.year}</p>
        <p className="text-base md:text-xl">{movie.ratings}</p>
      </div>
      <div className="relative w-[210px] h-[310px] md:w-[270px] md:h-[380px] overflow-y-scroll md:overflow-hidden select-none">
        <Image
          src={optimizedPoster}
          alt={movie.title}
          fill
          sizes="270px"
          className="object-cover select-none pointer-events-none"
          quality={50}
          priority={false}
        />
      </div>
    </div>
  );
}

import Image from "next/image";

const getOptimizedImageUrl = (url: string) => {
  if (!url) return "";

  if (url.includes("m.media-amazon.com")) {
    const baseUrl = url.split("._V1_")[0];
    return `${baseUrl}._V1_UX300_.webp`;
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

export default function MovieCard({ movie }: { movie: Post }) {
  const optimizedPoster = getOptimizedImageUrl(movie.poster);
  
  return (
    <div className="movie-card select-none pointer-events-none">
      <div className="flex justify-between">
        <p className="text-xl">{movie.year}</p>
        <p className="text-xl">{movie.ratings}</p>
      </div>
      <div className="relative w-[270px] h-[380px] overflow-hidden">
        <Image
          src={optimizedPoster}
          alt={movie.title}
          fill
          sizes="270px"
          className="object-cover"
          quality={50}
          priority={false}
        />
      </div>
    </div>
  );
}

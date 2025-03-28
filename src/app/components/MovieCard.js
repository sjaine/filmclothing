export default function MovieCard({ title, year, ratings, poster }) {
    return (
      <div className="movie-card">
        <div className="flex justify-between">
            <p className="text-xl">{year}</p>
            <p className="text-xl">{ratings}</p>
        </div>
        <img src={poster} alt={title} className="w-[270px] h-[380px] object-cover" />
      </div>
    );
  }
  
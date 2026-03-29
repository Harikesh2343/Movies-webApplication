import React, { useState, useEffect, useCallback } from "react";
import { getCombinedMovies } from "../../api-helpers/api-helpers";
import MovieItem from "./MovieItem";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const data = await getCombinedMovies(page);
      setTimeout(() => {
        setMovies((prev) => [...prev, ...data.movies]);
        setHasMore(data.hasMore);
        setLoading(false);
        setLoadingMore(false);
      }, 400);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore]);

  useEffect(() => {
    fetchMovies();
  }, [page]);

  const handleScroll = useCallback(() => {
    const distanceFromBottom =
      document.documentElement.scrollHeight -
      (window.scrollY + window.innerHeight);
    if (distanceFromBottom < 100 && !loadingMore && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loadingMore, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at top, #1a0505 0%, #0d0000 40%, #0a0000 100%)",
      }}
    >
      {/* ── Page header ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[100px] opacity-20"
            style={{
              background:
                "radial-gradient(ellipse, #dc2626 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="relative z-10 text-center py-12 px-2">
          
          <p className="text-red-500/70 text-xs font-bold tracking-[0.3em] uppercase mb-4">
            ✦ Now Showing ✦
          </p>

          {/* Main title */}
          <h1
            className="text-white font-bold leading-none mb-3"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(50px, 6vw, 72px)",
              letterSpacing: "-0.02em",
            }}
          >
            All{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #dc2626 0%, #f97316 50%, #dc2626 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Movies
            </span>
          </h1>

        </div>
      </div>

      {/* ── Content area ─────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 pb-20">

          <>
            {/* ── Movie grid ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-15 p-5">
              {movies.map((movie, index) => (
                <div
                  key={movie._id || index}
                  className="opacity-0 animate-[fadeSlideUp_0.5s_ease_forwards]"
                 
                >
                  <MovieItem
                    id={movie._id}
                    title={movie.title}
                    posterUrl={movie.fullPosterUrl}
                    releaseDate={movie.release_date}
                    source={movie.source}
                    voteAverage={movie.vote_average}
                  />
                </div>
              ))}
            </div>

            {/* ── Load-more spinner ________ */}
            {loadingMore && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-red-900/30" />
                  <div
                    className="absolute inset-0 rounded-full border-2 border-transparent
                      border-t-red-500 animate-spin"
                  />
                  <div className="absolute inset-2 rounded-full bg-red-500/10 animate-pulse" />
                </div>
                <p className="text-white/30 text-sm font-medium tracking-widest uppercase">
                  Loading more...
                </p>
              </div>
            )}

        
          </>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');

        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Movies;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCombinedMovies } from "../api-helpers/api-helpers";
import MovieItem from "./Movies/MovieItem";

const GENRE_LABELS = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 18: "Drama", 14: "Fantasy", 27: "Horror",
  10749: "Romance", 878: "Sci-Fi", 53: "Thriller", 37: "Western",
};

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    getCombinedMovies()
      .then((data) => setMovies(data.movies || []))
      .catch(console.log);
  }, []);

  const heroPool = movies.slice(0, 5);
  const featured = heroPool[featuredIdx];

  // Auto-cycle
  useEffect(() => {
    if (heroPool.length < 2) return;
    const t = setInterval(() => changeFeatured((featuredIdx + 1) % heroPool.length), 6000);
    return () => clearInterval(t);
  }, [heroPool.length, featuredIdx]);

  const changeFeatured = (idx) => {
    setFading(true);
    setTimeout(() => { setFeaturedIdx(idx); setFading(false); }, 300);
  };

  const poster = featured?.fullPosterUrl || featured?.posterUrl || "";
  const year = featured?.release_date ? new Date(featured.release_date).getFullYear() : "";
  const rating = featured?.vote_average ? parseFloat(featured.vote_average).toFixed(1) : null;
  const genres = (featured?.genre_ids || []).slice(0, 3).map((id) => GENRE_LABELS[id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex items-end pb-16 overflow-hidden">

        {/* Blurred backdrop */}
        {poster && (
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 transition-opacity duration-700"
            style={{ backgroundImage: `url(${poster})`, opacity: fading ? 0 : 1 }}
          />
        )}

        {/* Dark scrim layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent" />

        {/* Slide dots */}
        {heroPool.length > 1 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroPool.map((_, i) => (
              <button
                key={i}
                onClick={() => changeFeatured(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === featuredIdx
                    ? "w-8 h-2 bg-red-500"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Hero body ───────────────────────────── */}
        <div
          className={`relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12
            flex flex-col lg:flex-row items-end lg:items-center gap-12
            transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          {/* Left – text */}
          <div className="flex-1 space-y-5 max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400 text-2xl font-bold tracking-[0.25em] uppercase">
                Now Showing
              </span>
            </div>

            {/* Title */}
           <h1 className="text-5xl lg:text-7xl font-black leading-none tracking-tight text-white drop-shadow-2xl"
              style={{ fontFamily: "'Georgia', serif" }}>
              {featured?.title || "Loading…"}
            </h1>

            {/* Genre pills + meta */}
            <div className="flex flex-wrap items-center gap-2">
              
              {year && (
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm
                  border border-white/15 text-white/60 text-xs font-medium">
                  {year}
                </span>
              )}
              
            </div>

            {/* Overview */}
            <p className="text-white/60 text-sm lg:text-base leading-relaxed line-clamp-3 max-w-xl">
              {featured?.overview || featured?.description || "A cinematic experience awaits."}
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-3 pt-2">
              {featured && (
                <Link
                  to={`/booking/${featured._id || featured.id}?source=${featured.source || "tmdb"}`}
                  className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm
                    bg-red-600 hover:bg-red-500 text-white
                    shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)]
                    transition-all duration-300 active:scale-95"
                >
                
                  Book Tickets
                </Link>
              )}
              <Link
                to="/movies"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm
                  border border-white/20 text-white/80 hover:bg-white/10 hover:border-white/40
                  backdrop-blur-sm transition-all duration-300 active:scale-95"
              >
                Browse All
              </Link>
            </div>
          </div>

          {/* Right – floating poster */}
          {poster && (
            <div className="hidden lg:block flex-shrink-0">
              <div className={`relative transition-all duration-300 ${fading ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
                {/* Glow behind poster */}
                <div className="absolute -inset-4 rounded-3xl bg-red-600/20 blur-2xl" />
                <img
                  src={poster}
                  alt={featured?.title}
                  className="relative w-56 xl:w-64 aspect-[2/3] object-cover rounded-2xl
                    shadow-[0_32px_64px_rgba(0,0,0,0.8)] border border-white/10"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                {/* Corner brackets */}
                {["top-2 left-2 border-t-2 border-l-2 rounded-tl-lg",
                  "top-2 right-2 border-t-2 border-r-2 rounded-tr-lg",
                  "bottom-2 left-2 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-2 right-2 border-b-2 border-r-2 rounded-br-lg"
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-5 h-5 border-white/50 ${cls}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom fade into rest of page */}
        <div className="absolute bottom-0 left-0 right-0 h-32
          bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════ */}
      <div className="relative z-10 -mt-8 mx-4 lg:mx-auto max-w-4xl">
        <div className="grid grid-cols-3 divide-x divide-white/10
          bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {[
            { value: `${movies.length}+`, label: "Movies" },
            { value: "5", label: "Genres" },
            { value: "4K", label: "Quality" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-5 px-4">
              <span className="text-2xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}>
                {value}
              </span>
              <span className="text-white/40 text-xs font-medium tracking-widest uppercase mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          LATEST RELEASES
      ══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-12">
        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-2">
              ✦ Fresh in cinemas
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-none"
              style={{ fontFamily: "'Georgia', serif" }}>
              Latest <span className="text-transparent bg-clip-text
                bg-gradient-to-r from-red-500 to-orange-400">
                Releases
              </span>
            </h2>
          </div>
          <Link
            to="/movies"
            className="hidden md:flex items-center gap-2 text-white/50 hover:text-white
              text-sm font-semibold transition-colors group"
          >
            View all
           
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-red-600/50 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <div className="h-px w-16 bg-white/10" />
        </div>

        {/* Movie grid */}
        {movies.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="w-full aspect-[2/3] rounded-2xl
                  bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse" />
                <div className="h-3 bg-zinc-800 rounded-full animate-pulse w-3/4" />
                <div className="h-2.5 bg-zinc-900 rounded-full animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {movies.slice(0, 8).map((movie, index) => (
              <div
                key={movie._id || movie.id || index}
                className="opacity-0 animate-[fadeUp_0.5s_ease_forwards]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <MovieItem
                  id={movie._id || movie.id}
                  title={movie.title}
                  posterUrl={movie.fullPosterUrl || movie.posterUrl}
                  releaseDate={movie.release_date || movie.releaseDate}
                  source={movie.source}
                  voteAverage={movie.vote_average}
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex md:hidden justify-center mt-10">
          <Link to="/movies"
            className="flex items-center gap-2 px-6 py-3 rounded-full
              border border-white/15 text-white/70 hover:bg-white/8 hover:border-white/30
              text-sm font-semibold transition-all">
            View all movies →
          </Link>
        </div>
      </section>

     
      {/* ══════════════════════════════════════════════
          FOOTER CTA BANNER
      ══════════════════════════════════════════════ */}
      <div className="mx-4 lg:mx-auto max-w-7xl mb-16 lg:px-12">
        <div className="relative rounded-3xl overflow-hidden
          bg-gradient-to-br from-red-950/60 via-zinc-900 to-zinc-900
          border border-red-900/30 p-10 lg:p-14">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/4
            bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start
            lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-lg">
              <p className="text-red-400 text-xs font-bold tracking-[0.25em] uppercase">
                ✦ Quick Show
              </p>
              <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight"
                >
                Your seat is{" "}
                <span className="text-transparent bg-clip-text
                  bg-gradient-to-r from-red-400 to-orange-400">
                  waiting.
                </span>
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                Browse hundreds of films, pick your seat, and book in seconds.
              </p>
            </div>
            <Link
              to="/movies"
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-full
                bg-white text-zinc-900 font-black text-sm tracking-wide
                hover:bg-red-500 hover:text-white
                shadow-[0_8px_32px_rgba(0,0,0,0.4)]
                transition-all duration-300 active:scale-95"
            >
              Explore Movies
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
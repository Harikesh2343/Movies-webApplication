import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import WishlistDialog from "../Wishlist/WishlistDialog";

const MovieItem = ({title,releaseDate,posterUrl,id,source,rating,voteAverage,movieData,
  // Pass the full movie object so WishlistDialog has all details
  
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const imageUrl = posterUrl || "https://via.placeholder.com/300x450?text=No+Poster";
  const score = voteAverage || rating;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const isLoggedIn = !!localStorage.getItem("userId");

 const getRatingColor = () => "#eab308";

  // Build a minimal movie object for the dialog if full data isn't passed
  const movie = movieData || {
    id,
    _id: id,
    title,
    posterUrl,
    fullPosterUrl: posterUrl,
    source: source || "tmdb",
    release_date: releaseDate,
    vote_average: score,
  };

  const handleWishlistClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isLoggedIn) {
        alert("Please log in to save movies to a wishlist.");
        return;
      }
      setShowWishlist(true);
    },
    [isLoggedIn]
  );

  return (
    <>
      <div className="movie-card group relative overflow-hidden rounded-2xl cursor-pointer select-none">
        {/* ── Poster image ──────────────────────────────────────────────── */}
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-2xl">
          <img
            src={imageUrl}
            alt={title}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x450?text=No+Poster";
              setImgLoaded(true);
            }}
            className={`w-full h-full object-cover transition-all duration-700 ease-out
              group-hover:scale-110 group-hover:brightness-60
              ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />

          {/* ── Film-frame corner decorations ────────────────────────── */}
          {[
            "top-2 left-2 border-t-2 border-l-2 rounded-tl-lg",
            "top-2 right-2 border-t-2 border-r-2 rounded-tr-lg",
            "bottom-2 left-2 border-b-2 border-l-2 rounded-bl-lg",
            "bottom-2 right-2 border-b-2 border-r-2 rounded-br-lg",
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-5 h-5 border-white/60 ${cls}
                opacity-0 group-hover:opacity-100 transition-all duration-300`}
            />
          ))}

          {/* ── Rating badge (always visible) ────────────────────────── */}
          {score && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1
                backdrop-blur-md bg-black/60 rounded-full text-xl font-bold
                border border-white/10 shadow-lg z-10"
            >
              <span style={{ color: getRatingColor(score) }}>
                {parseFloat(score).toFixed(1)}
              </span>
            </div>
          )}

          {/* ── Admin-added badge ─────────────────────────────────────── */}
          {source === "database" && (
            <div
              className="absolute top-3 left-3 px-2 py-0.5 bg-emerald-500/90 backdrop-blur-sm
              text-white text-[10px] font-bold rounded-full tracking-wider z-10 shadow-lg"
            >
              ✦ ADDED
            </div>
          )}

          {/* ── Hover overlay – slides up from bottom ────────────────── */}
          <div
            className="absolute inset-0 flex flex-col justify-end p-5
              opacity-0 group-hover:opacity-100
              translate-y-4 group-hover:translate-y-0
              transition-all duration-500 ease-out z-20"
          >
            {/* Glowing spotlight */}
            <div
              className="absolute inset-0 bg-gradient-to-t
              from-black via-black/60 to-transparent pointer-events-none"
            />

            {/* Content */}
            <div className="relative z-10 space-y-2">
              {/* Year pill */}
              {year && (
                <span
                  className="inline-block px-2.5 py-0.5 bg-white/10 backdrop-blur-md
                  border border-white/20 rounded-full text-white text-[25px]
                  font-medium tracking-widest uppercase"
                >
                  {year}
                </span>
              )}

              {/* Title */}
              <h3
                className="text-white font-bold leading-snug tracking-wide
                group-hover:text-red-400 transition-colors duration-300"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "clamp(25px, 1.4vw, 18px)",
                  display: "-webkit-box",
                  overflow: "hidden",
                }}
              >
                {title}
              </h3>

              {/* Divider line that animates in */}
              <div
                className="h-px bg-gradient-to-r from-red-500 via-orange-400 to-transparent
                w-0 group-hover:w-full transition-all duration-700 delay-150"
              />

              {/* Book Now button */}
              <Link
                to={`/booking/${id}?source=${source || "tmdb"}`}
                className="block w-full text-center py-2 rounded-xl text-md font-bold
                  tracking-widest uppercase transition-all duration-300
                  bg-gradient-to-r from-red-600 to-rose-500
                  hover:from-red-500 hover:to-orange-500
                  hover:shadow-[0_0_24px_rgba(239,68,68,0.6)]
                  text-white border border-red-500/40
                  active:scale-95"
                style={{ letterSpacing: "0.2em" }}
              >
                Book Now 
              </Link>

              
              <button
                onClick={handleWishlistClick}
                className="w-full py-2 rounded-xl text-lg font-bold
                  tracking-wide uppercase transition-all duration-300
                  border border-white/20 text-white/80
                  hover:bg-white/10 hover:border-white/40
                  active:scale-95 backdrop-blur-sm"
                style={{ letterSpacing: "0.08em" }}
              >
                 Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* ── Below-card title (visible when not hovering) ─────────── */}
        <div className="mt-3 px-1 transition-all duration-300 group-hover:opacity-0 group-hover:translate-y-1">
          <h3
            className="text-white/90 font-semibold text-3xl leading-snug truncate"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {title}
          </h3>
          {year && (
            <p className="text-white/40 text-lg mt-0.5 font-medium">{year}</p>
          )}
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');
          .movie-card {
            will-change: transform;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          .movie-card:hover {
            transform: translateY(-6px);
          }
          .movie-card:active {
            transform: translateY(-2px) scale(0.99);
          }
        `}</style>
      </div>

 
      {showWishlist && (
        <WishlistDialog movie={movie} onClose={() => setShowWishlist(false)} />
      )}
    </>
  );
};

export default MovieItem;
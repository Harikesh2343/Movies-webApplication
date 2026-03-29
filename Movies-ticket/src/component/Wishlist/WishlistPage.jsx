import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getUserWishlists,
  deleteWishlist,
  renameWishlist,
  removeMovieFromWishlist,
} from "../../api-helpers/api-helpers";

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate("/auth");
  }, [userId, navigate]);

  const loadWishlists = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUserWishlists();
      setWishlists(res.wishlists || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlists();
  }, [loadWishlists]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDeleteWishlist = async (wlId, name) => {
    if (!window.confirm(`Delete wishlist "${name}"?`)) return;
    await deleteWishlist(wlId);
    setWishlists((prev) => prev.filter((w) => w._id !== wlId));
    setToast({ type: "success", msg: `"${name}" deleted` });
  };

  const startRename = (wl) => {
    setEditingId(wl._id);
    setEditName(wl.name);
  };

  const confirmRename = async (wlId) => {
    if (!editName.trim()) {
      setToast({ type: "error", msg: "Name cannot be empty" });
      return;
    }
    try {
      const res = await renameWishlist(wlId, editName.trim());
      if (res?.wishlist) {
        setWishlists((prev) =>
          prev.map((w) => (w._id === wlId ? res.wishlist : w))
        );
        setToast({ type: "success", msg: "Wishlist renamed!" });
      }
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setEditingId(null);
    }
  };

  const handleRemoveMovie = async (wlId, movieId, movieTitle) => {
    await removeMovieFromWishlist(wlId, movieId);
    setWishlists((prev) =>
      prev.map((w) =>
        w._id === wlId
          ? { ...w, movies: w.movies.filter((m) => m.movieId !== movieId) }
          : w
      )
    );
    setToast({ type: "success", msg: `"${movieTitle}" removed` });
  };

  const cardColors = [
    { bg: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.35)" },
    { bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.35)" },
    { bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" },
    { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1a0505,_#0d0000,_#0a0000)] pb-16">
      {/* Header */}
      <div className="text-center pt-12 pb-6">
        <p className="text-red-400/70 text-xs tracking-widest uppercase">
          My Collections
        </p>
        <h1 className="text-white text-4xl font-bold mt-2">
          My <span className="text-red-500">Watchlist</span>
        </h1>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-sm font-semibold
          ${
            toast.type === "success"
              ? "bg-green-500/10 border border-green-400 text-green-400"
              : "bg-red-500/10 border border-red-400 text-red-400"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center pt-16">
            <div className="w-10 h-10 border-2 border-white/10 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-white/40 mt-3">Loading...</p>
          </div>
        ) : wishlists.length === 0 ? (
          <div className="text-center pt-16 text-white/40">
            <h2 className="text-lg text-white/60 mb-2">No wishlists yet</h2>
            <Link to="/movies" className="px-6 py-2 bg-red-600 text-white rounded-full">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {wishlists.map((wl, idx) => {
              const color = cardColors[idx % cardColors.length];
              const isEditing = editingId === wl._id;

              return (
                <div
                  key={wl._id}
                  className="p-5 rounded-xl border"
                  style={{ background: color.bg, borderColor: color.border }}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => confirmRename(wl._id)}
                          onKeyDown={(e) => e.key === "Enter" && confirmRename(wl._id)}
                          className="bg-white/10 text-white px-2 py-1 rounded text-lg font-bold outline-none"
                        />
                      ) : (
                        <h3 className="text-white font-bold text-2xl">{wl.name}</h3>
                      )}
                      <p className="text-white/40 text-mf mt-0.5">
                        {wl.movies?.length || 0} Movies
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startRename(wl)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition"
                      >
                        Rename
                      </button>
                      <button
                        onClick={() => handleDeleteWishlist(wl._id, wl.name)}
                        className="px-3 py-1.5 bg-red-600/70 hover:bg-red-600 text-white text-sm rounded-lg transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Movies grid — always visible */}
                  {wl.movies?.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-2">
                      {wl.movies.map((m) => (

                        <div key={m.movieId} className="relative group">
                          
                          <img
                            src={m.posterUrl}
                            alt={m.title}
                            className="rounded-lg w-full object-cover  hover:opacity-80 transition"
                          />
                          
                          <button
                            onClick={() => handleRemoveMovie(wl._id, m.movieId, m.title)}
                            className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-black/60 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                          <p className="text-white/50 text-xs mt-1 truncate">{m.title}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm mt-2">No movies yet. Browse and add some!</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
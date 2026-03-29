import React, { useState, useEffect, useCallback } from "react";
import {
  getUserWishlists,
  createWishlist,
  addMovieToWishlist,
  getWishlistsContainingMovie,
} from "../../api-helpers/api-helpers";

const WishlistDialog = ({ movie, onClose }) => {
  const [wishlists, setWishlists] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [alreadyIn, setAlreadyIn] = useState(new Set());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const movieId = String(movie.id || movie._id);

  const loadWishlists = useCallback(async () => {
    setLoading(true);
    const [wlRes, containsRes] = await Promise.all([
      getUserWishlists(),
      getWishlistsContainingMovie(movieId),
    ]);

    setWishlists(wlRes.wishlists || []);

    const inSet = new Set(
      (containsRes.wishlists || []).map((w) => w._id)
    );
    setAlreadyIn(inSet);
    setSelected(new Set(inSet));
    setLoading(false);
  }, [movieId]);

  useEffect(() => {
    loadWishlists();
  }, [loadWishlists]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleSelect = (id) => {
    if (alreadyIn.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      setToast({ type: "error", msg: "Wishlist name cannot be empty" });
      return;
    }
    setCreateLoading(true);
    try {
      const res = await createWishlist(newName.trim());
      if (res?.wishlist) {
        setWishlists((prev) => [res.wishlist, ...prev]);
        setSelected((prev) => new Set([...prev, res.wishlist._id]));
        setNewName("");
        setShowCreate(false);
        setToast({ type: "success", msg: `"${res.wishlist.name}" created!` });
      }
    } catch (err) {
      setToast({ type: "error", msg: err.message });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSave = async () => {
    const toAdd = [...selected].filter((id) => !alreadyIn.has(id));

    if (toAdd.length === 0) {
      setToast({ type: "error", msg: "No new wishlists selected" });
      return;
    }

    setSaving(true);
    const movieData = {
      movieId,
      title: movie.title,
      posterUrl:
        movie.fullPosterUrl ||
        movie.posterUrl ||
        (movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : ""),
      source: movie.source || "tmdb",
      releaseDate: movie.release_date || movie.releaseDate || "",
      voteAverage: movie.vote_average || null,
    };

    let successCount = 0;
    let errors = [];

    await Promise.all(
      toAdd.map(async (wid) => {
        try {
          await addMovieToWishlist(wid, movieData);
          successCount++;
        } catch (err) {
          errors.push(err.message);
        }
      })
    );

    setSaving(false);

    if (successCount > 0) {
      setToast({
        type: "success",
        msg: `Added to ${successCount} wishlist${successCount > 1 ? "s" : ""}! 🎬`,
      });
      await loadWishlists();
      setTimeout(onClose, 1200);
    } else {
      setToast({ type: "error", msg: errors[0] || "Something went wrong" });
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const posterUrl =
    movie.fullPosterUrl ||
    movie.posterUrl ||
    (movie.poster_path
      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
      : "https://via.placeholder.com/92x138?text=?");

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
    >
      <div className="bg-gradient-to-br from-[#0f0f14] to-[#1a1a2e] border border-red-600/30 rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-white/10">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-[80px] h-[100px] object-cover rounded-md border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-[13px] font-semibold tracking-widest uppercase mb-1">
              Add to Wishlist
            </p>
            <h3 className="text-white font-bold text-lg truncate">
              {movie.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-700 text-white  "
          >
            ✕
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mx-6 mt-3 px-4 py-2 rounded text-sm font-medium border ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-400/40 text-green-400"
                : "bg-red-500/10 border-red-400/40 text-red-400"
            }`}
          >
            {toast.msg}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {loading ? (
            <div className="flex flex-col items-center py-8 gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-red-600 animate-spin"></div>
              <p className="text-white/40 text-sm">Loading wishlists…</p>
            </div>
          ) : (
            <>
              {wishlists.length === 0 && !showCreate && (
                <p className="text-center text-white text-lg py-6">
                  You have no wishlists yet. Create one below!
                </p>
              )}

              {wishlists.map((wl) => {
                const isAlready = alreadyIn.has(wl._id);
                const isChecked = selected.has(wl._id);

                return (
                  <label
                    key={wl._id}
                    onClick={() => toggleSelect(wl._id)}
                    className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition border cursor-pointer
                      ${isChecked ? "bg-red-600/10 border-red-500/40" : "bg-white/5 border-white/10"}
                      ${isAlready ? "opacity-70 cursor-default" : ""}
                    `}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                      ${isChecked ? "bg-red-600 border-red-600" : "border-white/30"}`}
                    >
                      {isChecked && (
                        <svg width="11" height="9" viewBox="0 0 11 9">
                          <path
                            d="M1 4L4 7.5L10 1"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-sm truncate">
                        {wl.name}
                      </p>
                      <p className="text-white/40 text-xs">
                        {wl.movies?.length || 0} movie
                      </p>
                    </div>

                    {isAlready && (
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-400/30 px-2 py-[2px] rounded-full">
                        Added ✓
                      </span>
                    )}
                  </label>
                );
              })}

              {/* Create */}
              {showCreate ? (
                <div className="mt-3 p-4 bg-white/5 border border-red-500/30 rounded-xl">
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Romantic, Horror..."
                    className="w-full mb-3 px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreate}
                      className="flex-1 bg-red-600 text-white py-2 rounded font-bold text-sm"
                    >
                      {createLoading ? "Creating…" : "Create"}
                    </button>
                    <button
                      onClick={() => setShowCreate(false)}
                      className="px-3 py-2 bg-white/10 text-white/60 border border-white/20 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowCreate(true)}
                  className="w-full mt-2 py-3 border-2 border-dashed border-red-500/50 text-red-400 rounded-lg font-semibold text-lg hover:bg-red-500/10 transition"
                >
                  + Create New Wishlist
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            className=" font-bold text-lg flex-1 py-3 bg-white/10 text-white/60 border border-white/20 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="flex-1 py-3 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl font-bold shadow-lg disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save to Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistDialog;
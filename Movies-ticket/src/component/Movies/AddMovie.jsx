import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addMovie } from "../../api-helpers/api-helpers";

const AddMovie = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
  });
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddActor = () => {
    if (actor.trim()) {
      setActors((prev) => [...prev, actor.trim()]);
      setActor("");
    }
  };

  const handleRemoveActor = (index) => {
    setActors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addMovie({ ...inputs, actors });
      showToast("success", "Movie added successfully! 🎬");
      setTimeout(() => navigate("/movies"), 1200);
    } catch (err) {
      console.log(err);
      showToast("error", "Error adding movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1a0505,_#0d0000,_#0a0000)] pb-20 px-4">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-full text-lg font-semibold border
          ${toast.type === "success"
            ? "bg-green-500/10 border-green-400 text-green-400"
            : "bg-red-500/10 border-red-400 text-red-400"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <p className="text-red-400/70 text-xs tracking-widest uppercase mb-2">
          Admin Panel
        </p>
        <h1 className="text-white text-4xl font-bold">
          Add <span className="text-red-500">New Movie</span>
        </h1>
        <div className="w-16 h-0.5 bg-red-800 mx-auto mt-3" />
      </div>

      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-black/40 border border-red-900/30 rounded-2xl p-8 flex flex-col gap-6"
        >

          {/* Poster URL + live preview */}
          <div className="flex gap-5 items-start">
            {/* Preview box */}
            <div className="flex-shrink-0 w-24 h-36 rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
              {inputs.posterUrl ? (
                <img
                  src={inputs.posterUrl}
                  alt="Poster preview"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="text-white/20 text-xs text-center px-2">
                  Poster Preview
                </span>
              )}
            </div>

            {/* Title + Poster URL stacked */}
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">
                  Movie Title
                </label>
                <input
                  value={inputs.title}
                  onChange={handleChange}
                  name="title"
                  type="text"
                  placeholder="e.g. Inception"
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-red-500/60 text-white placeholder-white/20 rounded-xl px-4 py-3 text-lg outline-none transition"
                />
              </div>
              <div>
                <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">
                  Poster URL
                </label>
                <input
                  value={inputs.posterUrl}
                  onChange={handleChange}
                  name="posterUrl"
                  type="url"
                  placeholder="https://..."
                  required
                  className="w-full bg-white/5 border border-white/10 focus:border-red-500/60 text-white placeholder-white/20 rounded-xl px-4 py-3 text-lg outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">
              Description
            </label>
            <textarea
              value={inputs.description}
              onChange={handleChange}
              name="description"
              rows={4}
              placeholder="Write a short synopsis..."
              required
              className="w-full bg-white/5 border border-white/10 focus:border-red-500/60 text-white placeholder-white/20 rounded-xl px-4 py-3 text-lg outline-none transition resize-none"
            />
          </div>

          {/* Release Date */}
          <div>
            <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">
              Release Date
            </label>
            <input
              type="date"
              value={inputs.releaseDate}
              onChange={handleChange}
              name="releaseDate"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-red-500/60 text-white rounded-xl px-4 py-3 text-lg outline-none transition
                [color-scheme:dark]"
            />
          </div>

          {/* Actors */}
          <div>
            <label className="text-white/50 text-xs tracking-widest uppercase mb-2 block">
              Cast
            </label>
            <div className="flex gap-2">
              <input
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddActor())}
                type="text"
                placeholder="Actor name..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-red-500/60 text-white placeholder-white/20 rounded-xl px-4 py-3 text-lg outline-none transition"
              />
              <button
                type="button"
                onClick={handleAddActor}
                className="px-5 py-3 bg-red-600/80 hover:bg-red-600 text-white text-lg font-semibold rounded-xl transition"
              >
                + Add
              </button>
            </div>

            {actors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {actors.map((name, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-900/20 border border-red-900/40 text-red-300 text-xs rounded-full"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => handleRemoveActor(i)}
                      className="text-red-400 hover:text-white transition text-base leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="featured"
                checked={inputs.featured}
                onChange={(e) =>
                  setInputs((prev) => ({ ...prev, featured: e.target.checked }))
                }
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full border transition-all duration-200 ${
                  inputs.featured
                    ? "bg-red-600 border-red-500"
                    : "bg-white/10 border-white/20"
                }`}
              />
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                  inputs.featured ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <div>
              <p className="text-white text-lg font-medium">Featured Movie</p>
              <p className="text-white/30 text-xs">
                Show on the homepage spotlight
              </p>
            </div>
          </label>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/movies")}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white rounded-xl text-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white rounded-xl text-lg font-bold shadow-lg shadow-red-900/40 disabled:opacity-50 transition"
            >
              {loading ? "Adding Movie…" : "Add Movie"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddMovie;
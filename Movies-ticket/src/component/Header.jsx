import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovies, searchMovies } from "../api-helpers/api-helpers";
import { adminActions, userActions } from "../store";

/* Only fonts + ::before grain — Tailwind can't do these */
const FONT_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  .qs-nav-root { font-family: 'DM Sans', sans-serif; }
  .qs-nav-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
    z-index: 0;
  }
`;

const Header = () => {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [value, setValue] = useState(0);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const tag = document.createElement("style");
    tag.textContent = FONT_STYLES;
    document.head.appendChild(tag);
    return () => document.head.removeChild(tag);
  }, []);

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      searchMovies(query)
        .then((data) => setMovies(data.movies))
        .catch((err) => console.log(err));
    } else {
      getAllMovies()
        .then((data) => setMovies(data.movies))
        .catch((err) => console.log(err));
    }
  };

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };

  const navLink = (to, label, idx) => (
    <Link
      to={to}
      onClick={() => setValue(idx)}
      className={`
        relative px-4 py-1.5 text-sm font-medium rounded-lg no-underline
        transition-all duration-150 whitespace-nowrap
        ${value === idx
          ? "text-[#e8c060] bg-[#e8c060]/10"
          : "text-white/50 hover:text-white hover:bg-white/10"
        }
      `}
    >
      {label}
      {value === idx && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#e8c060] rounded-full shadow-red-600" />
      )}
    </Link>
  );

  return (
    <nav
      className="qs-nav-root sticky top-0 z-[1000] bg-[#080a0f] border-b border-red-700 backdrop-blur-md shadow-[0_2px_24px_rgba(0,0,0,0.5)] relative"
    >
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between h-16 gap-10">

          {/* ── Logo ── */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="flex items-center gap-2 no-underline group">
              {/* Wordmark */}
              <span
                className="text-[45px] leading-none tracking-[2.5px] text-[#e8eaf0]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Quick<span className="text-[#e8c060]">Show</span>
              </span>
            </Link>
          </div>

          {/* ── Search ── */}
          <div className="flex-1 max-w-[400px] mx-auto relative">



            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search movies…"
              className="
                w-full pl-9 pr-4 py-2
                bg-gray-700 border border-red-400 rounded-xl
                text-[#e8eaf0] text-lg placeholder:text-white/30
                outline-none transition-all duration-200
                focus:bg-[#e8c060]/[0.04] focus:border-[#e8c060]/35
                focus:shadow-[0_0_0_3px_rgba(232,192,96,0.07)]
              "
            />
          </div>

          {/* ── Nav links ── */}
          <div className="flex items-center gap-1 shrink-0">
            {navLink("/movies", "Movies", 0)}

            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                {navLink("/admin", "Admin", 1)}

                {/* Divider */}
                <div className="w-px h-5 bg-red-600 mx-1 shrink-0" />

                <Link
                  to="/auth"
                  onClick={() => setValue(2)}
                  className="
                    px-4 py-1.5 rounded-lg text-lg font-semibold no-underline
                    bg-[#e8c060] text-[#0a0a0a] tracking-wide
                    transition-all duration-150 hover:opacity-85 hover:-translate-y-px
                  "
                >
                  Sign In
                </Link>
              </>
            )}

            {isUserLoggedIn && (
              <>
                <Link
                  to="/wishlist"
                  title="My Wishlists"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-3xl font-medium no-underline text-[#e03050] hover:bg-white hover:text-[#ff0429] transition-colors duration-150"
                >
                  
                  <span className="hidden sm:inline text-lg">Watchlist</span>
                </Link>

                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                <Link
                  to="/user"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-lg font-medium no-underline text-red-700  hover:bg-white transition-colors duration-150"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e03050] to-[#6a0a1f] flex items-center justify-center text-xs font-bold text-white shrink-0">
                    UP
                  </div>
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={() => logout(false)}
                  className="px-3.5 py-1.5 text-lg font-medium text-red-700 bg-transparent border-0 rounded-lg cursor-pointer transition-colors duration-150 hover:text-[#e03050] hover:bg-white"
                >
                  Logout
                </button>
              </>
            )}

            {isAdminLoggedIn && (
              <>
                <Link
                  to="/add"
                  className="
                    flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold no-underline
                    bg-[#e8c060] text-[#0a0a0a] tracking-wide
                    transition-all duration-150 hover:opacity-85 hover:-translate-y-px
                  "
                >
                  + Add Movie
                </Link>

                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium no-underline text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-150"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6a30e0] to-[#2a0a6f] flex items-center justify-center text-xs font-bold text-white shrink-0">
                    AP
                  </div>
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={() => logout(true)}
                  className="px-3.5 py-1.5 text-lg font-medium text-red-700 bg-transparent border-0 rounded-lg cursor-pointer transition-colors duration-150 hover:text-[#e03050] hover:bg-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Header;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovies, searchMovies } from "../api-helpers/api-helpers";
import { adminActions, userActions } from "../store";

const Header = () => {
  const dispatch = useDispatch();
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [value, setValue] = useState(0);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <nav className="bg-[#2b2d42] sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
         
          <div className="flex items-center w-1/5">
            <Link to="/" className="text-white flex items-center">
              {/* <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg> */}
              <span className="ml-2 text-xl font-bold">MovieApp</span>
            </Link>
          </div>

         
          <div className="w-2/5 mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search across movies"
              className="w-full px-4 py-2 bg-transparent border-b-2 border-gray-400 text-white placeholder-gray-400 focus:border-white focus:outline-none transition-colors"
            />
          </div>

       
          <div className="flex items-center space-x-4">
            <Link
              to="/movies"
              className={`px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors ${
                value === 0 ? 'border-b-2 border-purple-400' : ''
              }`}
              onClick={() => setValue(0)}
            >
              Movies
            </Link>

            {!isAdminLoggedIn && !isUserLoggedIn && (
              <>
                <Link
                  to="/admin"
                  className={`px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors ${
                    value === 1 ? 'border-b-2 border-purple-400' : ''
                  }`}
                  onClick={() => setValue(1)}
                >
                  Admin
                </Link>
                <Link
                  to="/auth"
                  className={`px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors ${
                    value === 2 ? 'border-b-2 border-purple-400' : ''
                  }`}
                  onClick={() => setValue(2)}
                >
                  Auth
                </Link>
              </>
            )}

            {isUserLoggedIn && (
              <>
                <Link
                  to="/user"
                  className="px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => logout(false)}
                  className="px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {isAdminLoggedIn && (
              <>
                <Link
                  to="/add"
                  className="px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors"
                >
                  Add Movies
                </Link>
                <Link
                  to="/admin"
                  className="px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={() => logout(true)}
                  className="px-4 py-2 text-white hover:bg-[#1f2130] rounded transition-colors"
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
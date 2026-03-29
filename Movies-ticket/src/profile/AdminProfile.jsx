import React, { useEffect, useState } from 'react';
import { deleteBooking, getAdminBooking, getAdminDetails } from '../api-helpers/api-helpers';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const AdminProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [admin, setAdmin] = useState(null);
  const [myMovies, setMyMovies] = useState([]);

  useEffect(() => {
    getAdminBooking()
      .then((res) => setBookings(res.bookings))
      .catch((err) => console.log(err));
    
    getAdminDetails()
      .then((res) => {
        setAdmin(res.admin);
        
       
        if (res.admin && res.admin._id) {
          axios.get('/movie')
            .then((movieRes) => {
              const adminMovies = movieRes.data.movies.filter(
                movie => movie.admin === res.admin._id
              );
              setMyMovies(adminMovies);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    deleteBooking(id)
      .then((res) => {
        console.log(res);
        getAdminBooking()
          .then((res) => setBookings(res.bookings))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-stone-200 py-12 px-4"
         style={{
           background: "radial-gradient(ellipse at 20% 60%, #2d0808 0%, #0a0a0a 50%), radial-gradient(ellipse at 80% 20%, #1a0404 0%, transparent 50%)",
           backgroundColor: "#0a0a0a",
         }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center pb-12">
          <p className="text-xs tracking-[6px] text-red-800 uppercase mb-2 font-medium">Headquarters</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-100 uppercase">
            Admin Profile
          </h1>
          <div className="w-16 h-0.5 bg-red-800 mx-auto mt-3" />
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Admin Info Section (Left) */}
          {admin && (
            <div className="lg:w-1/3 flex-shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 sticky top-24 shadow-2xl backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="p-4 rounded-full bg-red-900/20 mb-4 border border-red-900/30 shadow-[0_0_30px_rgba(153,27,27,0.3)]">
                    <AccountCircleIcon 
                      sx={{ fontSize: '6rem', color: '#ef4444' }} 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <span className="px-5 py-1.5 bg-red-900 text-white border border-red-700 rounded-full text-xs tracking-widest uppercase font-bold">
                      Administrator
                    </span>
                  </div>
                  
                  <div className="w-full space-y-4 mt-4">
                    <div className="bg-[#0a0a0a]/50 p-4 border border-white/5 rounded-xl text-center">
                      <p className="text-xs tracking-[3px] text-stone-500 uppercase mb-1">Email</p>
                      <p className="font-semibold text-stone-300 break-all">{admin.email}</p>
                    </div>
                    <div className="bg-[#0a0a0a]/50 p-4 border border-white/5 rounded-xl text-center">
                      <p className="text-xs tracking-[3px] text-stone-500 uppercase mb-1">Movies Added</p>
                      <p className="text-3xl font-light text-stone-200">{myMovies.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Column (Movies & Bookings) */}
          <div className="lg:w-2/3 flex-1 xl:w-full space-y-16">
          
            {/* Added Movies Section */}
            <div>
              <h2 className="text-xl tracking-[4px] text-stone-400 uppercase mb-6 font-medium border-b border-white/10 pb-4">
                My Added Movies
              </h2>
              
              {myMovies && myMovies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myMovies.map((movie, index) => (
                    <div
                      key={index}
                      className="group bg-white/5 border border-white/10 hover:border-red-800/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex"
                    >
                      <div className="w-1/3 min-w-[100px] overflow-hidden">
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-lg text-stone-100 mb-2 truncate group-hover:text-red-400 transition-colors">{movie.title}</h3>
                        <p className="text-xs tracking-widest text-stone-500 uppercase mb-3">
                          {new Date(movie.releaseDate).toDateString()}
                        </p>
                        <div className="mt-auto">
                          <span className="inline-block px-3 py-1 bg-[#1a0404] border border-red-900/50 rounded text-xs font-semibold text-red-300">
                            {movie.bookings?.length || 0} Bookings
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl shadow-lg">
                  <p className="text-stone-500 tracking-wide text-sm">No movies added yet.</p>
                </div>
              )}
            </div>

            {/* Bookings Section */}
            <div>
              <h2 className="text-xl tracking-[4px] text-stone-400 uppercase mb-6 font-medium border-b border-white/10 pb-4">
                All User Bookings
              </h2>
              
              {bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking, index) => (
                    <div
                      key={index}
                      className="group flex flex-col sm:flex-row bg-white/5 border border-white/10 hover:border-blue-900/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:bg-white/10"
                    >
                      {/* Ticket poster stub / accent */}
                      <div className="sm:w-32 bg-[#040a1a] flex flex-col justify-center items-center py-4 border-r border-white/10 border-dashed relative">
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a0a] rounded-full" />
                        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0a0a0a] rounded-full" />
                        
                        <p className="text-xs tracking-[4px] text-blue-700 uppercase rotate-0 sm:-rotate-90 whitespace-nowrap font-bold">
                          Global Ticket
                        </p>
                      </div>

                      <div className="p-6 flex-1 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                        <div className="w-full">
                          <h3 className="text-xl sm:text-2xl font-bold text-stone-100 mb-2 group-hover:text-blue-400 transition-colors">
                            {booking.movie?.title || 'Movie Title'}
                          </h3>
                          
                          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-3 mt-4 text-sm">
                            <div>
                              <p className="text-stone-500 text-[10px] tracking-widest uppercase mb-1">User</p>
                              <p className="text-stone-300 mt-1">{booking.user?.name || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-stone-500 text-[10px] tracking-widest uppercase mb-1">Seat</p>
                              <p className="text-stone-300 font-medium bg-white/10 px-3 py-1 rounded inline-block">
                                {booking.seatNumber}
                              </p>
                            </div>
                            <div>
                              <p className="text-stone-500 text-[10px] tracking-widest uppercase mb-1">Date</p>
                              <p className="text-stone-300 mt-1">
                                {new Date(booking.date).toDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-stone-500 text-[10px] tracking-widest uppercase mb-1">Time</p>
                              <p className="text-stone-300 mt-1">
                                {booking.time || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="mt-6 sm:mt-0 sm:ml-6 p-3 sm:p-4 rounded-full bg-transparent border border-white/10 text-stone-500 hover:text-red-500 hover:border-red-900/50 hover:bg-red-950/30 transition-all duration-200"
                          title="Delete global booking"
                        >
                          <DeleteForeverIcon sx={{ fontSize: '1.75rem' }} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <p className="text-stone-300 font-medium text-lg tracking-wide">No bookings found system-wide</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
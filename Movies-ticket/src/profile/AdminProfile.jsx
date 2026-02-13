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
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Info Section */}
          {admin && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex flex-col items-center">
                  <AccountCircleIcon 
                    sx={{ fontSize: '10rem', color: '#a78bfa', marginBottom: 2 }} 
                  />
                  
                  <div className="mb-4">
                    <span className="px-4 py-1 bg-purple-600 text-white rounded-full text-sm font-medium">
                      Admin
                    </span>
                  </div>
                  
                  <div className="w-full space-y-3">
                    <div className="p-3 border border-gray-300 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-800">{admin.email}</p>
                    </div>
                    <div className="p-3 border border-gray-300 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Movies Added</p>
                      <p className="font-semibold text-gray-800 text-2xl">{myMovies.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          <div className="lg:w-2/3 space-y-8">
          
            <div>
              <h2 className="text-3xl font-bold text-center mb-6 font-verdana">
                My Added Movies
              </h2>
              
              {myMovies && myMovies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myMovies.map((movie, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="flex">
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title}
                          className="w-24 h-32 object-cover"
                        />
                        <div className="p-4 flex-1">
                          <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">
                            {new Date(movie.releaseDate).toDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {movie.bookings?.length || 0} bookings
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <p className="text-gray-500 text-lg">No movies added yet</p>
                </div>
              )}
            </div>

           
            <div>
              <h2 className="text-3xl font-bold text-center mb-6 font-verdana">
                All User Bookings
              </h2>
              
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-3">
                              {booking.movie?.title || 'Movie Title'}
                            </h3>
                            
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <span className="font-semibold mr-2">User:</span>
                                <span>{booking.user?.name || 'N/A'}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <span className="font-semibold mr-2">Seat:</span>
                                <span>{booking.seatNumber}</span>
                              </div>
                              
                              <div className="flex items-center">
                                <span className="font-semibold mr-2">Date:</span>
                                <span>
                                  {new Date(booking.date).toDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="ml-4 p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Delete booking"
                          >
                            <DeleteForeverIcon sx={{ fontSize: '1.5rem' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                  <p className="text-gray-500 text-lg">No bookings yet</p>
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
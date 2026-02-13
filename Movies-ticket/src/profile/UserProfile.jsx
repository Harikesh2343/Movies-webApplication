import React, { useEffect, useState } from "react";
import {
  deleteBooking,
  getUserBooking,
  getUserDetails,
} from "../api-helpers/api-helpers";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const UserProfile = () => {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserBooking()
      .then((res) => setBookings(res.bookings))
      .catch((err) => console.log(err));

    getUserDetails()
      .then((res) => setUser(res.user))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    deleteBooking(id)
      .then((res) => {
        console.log(res);
        getUserBooking()
          .then((res) => setBookings(res.bookings))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {user && (
            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex flex-col items-center">
                  <AccountCircleIcon
                    sx={{
                      fontSize: "10rem",
                      color: "#9ca3af",
                      marginBottom: 2,
                    }}
                  />

                  <div className="w-full space-y-3">
                    <div className="p-3 border border-gray-300 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Name</p>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>
                    <div className="p-3 border border-gray-300 rounded-lg text-center">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-semibold text-gray-800">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold text-center mb-8 font-verdana">
              My Bookings
            </h2>

            {bookings && bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div
                    key={booking._id || index}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-3">
                            {booking.movie?.title || "Movie Title"}
                          </h3>

                          <div className="space-y-2">
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
                          <DeleteForeverIcon sx={{ fontSize: "1.5rem" }} />
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
  );
};

export default UserProfile;

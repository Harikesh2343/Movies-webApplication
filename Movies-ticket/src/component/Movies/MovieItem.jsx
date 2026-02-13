import React from "react";
import { Link } from "react-router-dom";

const MovieItem = ({ title, releaseDate, posterUrl, id, source }) => {
  const imageUrl = posterUrl || 'https://via.placeholder.com/300x450';

  return (
    <div className="w-80 h-[500px] rounded-2xl m-4 overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 bg-white flex flex-col relative">
     
      {source === 'database' && (
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Admin Added
          </span>
        </div>
      )}
      
      <img 
        className="w-full h-[300px] object-cover" 
        src={imageUrl} 
        alt={title} 
      />
      <div className="flex-grow"></div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {new Date(releaseDate).toDateString()}
        </p>
        <Link 
          to={`/booking/${id}?source=${source}`} 
          className="block w-full text-center py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default MovieItem;
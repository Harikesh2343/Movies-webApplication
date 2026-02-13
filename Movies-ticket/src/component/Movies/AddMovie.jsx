import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { addMovie } from '../../api-helpers/api-helpers';

const AddMovie = () => {
  const navigate = useNavigate(); 
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false
  });
  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs, actors);
    addMovie({ ...inputs, actors })
      .then(res => {
        console.log(res);
        alert("Movie added successfully!");
        navigate("/movies");
      })
      .catch(err => {
        console.log(err);
        alert("Error adding movie. Please try again."); 
      });
  };

  const handleAddActor = () => {
    if (actor.trim()) {
      setActors([...actors, actor]);
      setActor("");
    }
  };

  const handleRemoveActor = (indexToRemove) => { 
    setActors(actors.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-center text-3xl font-bold mb-8 text-gray-800 font-verdana">
            Add New Movie
          </h2>

          <div className="space-y-6">
        
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                value={inputs.title}
                onChange={handleChange}
                name="title"
                type="text"
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

       
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={inputs.description}
                onChange={handleChange}
                name="description"
                rows="4"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Poster URL
              </label>
              <input
                value={inputs.posterUrl}
                onChange={handleChange}
                name="posterUrl"
                type="url"
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

          
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date
              </label>
              <input
                type="date"
                value={inputs.releaseDate}
                onChange={handleChange}
                name="releaseDate"
                className="w-full px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

               <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actors
              </label>
              <div className="flex gap-2">
                <input
                  value={actor}
                  onChange={(e) => setActor(e.target.value)}
                  name="actor"
                  type="text"
                  placeholder="Enter actor name"
                  className="flex-1 px-4 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddActor}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
              {actors.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {actors.map((actorName, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2"
                    >
                      {actorName}
                 
                      <button
                        type="button"
                        onClick={() => handleRemoveActor(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

   
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={inputs.featured}
                onChange={(e) =>
                  setInputs((prevState) => ({
                    ...prevState,
                    featured: e.target.checked
                  }))
                }
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-3 text-sm font-medium text-gray-700">
                Featured Movie
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2b2d42] text-white py-3 rounded-full hover:bg-[#121217] transition-colors font-medium text-lg mt-6"
            >
              Add New Movie
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
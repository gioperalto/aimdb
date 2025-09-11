"use client";

// SimilarMovies.tsx - Component to fetch and display similar movies
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SimilarMoviesProps {
  movieId: string;
  moviePlot: string;
}

// SimilarMovies Component
const SimilarMovies: React.FC<SimilarMoviesProps> = ({ movieId, moviePlot }) => {
  interface Movie {
    _id: string;
    title: string;
    year: number;
    directors?: string[];
    poster?: string;
    plot?: string;
    score: number;
  }
  
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (movieId) {
      fetchSimilarMovies();
    }
  }, [movieId]);

  const navigateToMovie = (id: string) => {
    navigate(`/details/${id}`);
  };

  const fetchSimilarMovies = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${API_BASE_URL}/api/movies/similar`, {
        plot: moviePlot,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setSimilarMovies(response.data.similar_movies);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching similar movies'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl mt-8">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
          </svg>
          Similar Movies based on Overview
          <div className="flex">
            <div className="inline-flex items-center ml-4" onClick={() => {
              fetchSimilarMovies();
            }}>
            </div>
          </div>
        </h2>

        {loading ? (
          <div className="w-full flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-red-400">{error}</p>
          </div>
        ) : similarMovies.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-400">No similar movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {similarMovies.map((movie) => (
              <div 
                key={movie._id} 
                className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => navigateToMovie(movie._id)}
              >
                <div className="p-4 flex items-center">
                  <div className="w-16 h-24 bg-gray-600 mr-4 flex-shrink-0 rounded overflow-hidden">
                    {movie.poster ? (
                      <img className="w-full h-full object-cover" src={movie.poster} alt={movie.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-white">{movie.title}</h3>
                        <p className="text-gray-400 text-sm">{movie.year} • {movie.directors?.join(', ')}</p>
                      </div>
                      <div className="bg-blue-500 px-3 py-1 rounded-full text-sm font-bold">
                        {Math.round(movie.score * 100)}%
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                      {movie.plot}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimilarMovies;
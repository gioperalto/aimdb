"use client";

// App.js - Main application component
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import SimilarMovies from './similar';

// Detail Page Component
const DetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [favorited, setFavorited] = useState<boolean>(false);
    const [showSimilar, setShowSimilar] = useState(false);
    const [item, setItem] = useState< any | null>(null);
    const API_BASE_URL = 'http://localhost:5000/api';

    React.useEffect(() => {
      const fetchMovie = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/movies/${id}`);

          if (response.data.status === 'success') {
            setItem(response.data.movie);
            
            // Check local storage for favorited status
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setFavorited(favorites.includes(id));
          }
        } catch (error) {
          console.error("Error fetching movie:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMovie();
    }, [id]);

    const toggleFavorited = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favorited) {
        favorites.splice(favorites.indexOf(id), 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      } else {
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
      setFavorited(!favorited);
    };

    const visitWebsite = () => {
      if (item && item.website) {
        window.open(item.website, '_blank');
      }
    };
  
    const toggleSimilarMovies = () => {
      setShowSimilar(!showSimilar);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <header className="w-full p-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-400 cursor-pointer" onClick={() => navigate('/')}><span className="text-red-400">AI</span><span className="text-blue-400">MDB</span></h1>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            Back to Search
          </button>
        </header>
        
        <main className="w-full max-w-4xl mx-auto px-4 py-8">
          {loading ? (
            <div className="w-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : item ? (
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold">{item.title}</h1>
                    <div className="flex items-center mt-2">
                      <span className="text-gray-400 mr-4">{item.year}</span>
                    </div>
                  </div>
                  <div className="bg-blue-500 hover:bg-blue-400 transition-colors rounded-full p-3 cursor-pointer" onClick={toggleFavorited}>
                    { favorited ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-gray-700 rounded-lg aspect-w-2 aspect-h-3 overflow-hidden">
                      <div className="w-full h-64 bg-gray-600 flex items-center justify-center">
                        <img className="w-auto max-h-full" src={item.poster} alt="image description" />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-2">Details</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400">Director(s):</span> {item.directors.join(', ')}
                        </div>
                        <div>
                          <span className="text-gray-400">Release Year:</span> {item.year}
                        </div>
                        <div>
                          <span className="text-gray-400">Rating:</span> {item.imdb.rating}/10
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">Overview</h3>
                    <p className="text-gray-300 leading-relaxed">{item.plot}</p>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium border-b border-gray-700 pb-2 mb-4">Accolades</h3>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex mb-4">
                          <div className="flex items-center">
                            <div className="bg-yellow-500 p-2 rounded-full mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" stroke="currentColor">
                                <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-lg font-medium">{item.awards.wins} wins</span>
                          </div>
                          <div className="flex items-center ml-4">
                            <div className="bg-orange-500 p-2 rounded-full mr-3">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                              </svg>
                            </div>
                            <span className="text-lg font-medium">{item.awards.nominations} nominations</span>
                          </div>
                        </div>
                        <p className="text-gray-300">{item.title}. {item.awards.text}</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex space-x-4">
                      <button 
                        className="flex-1 bg-blue-500 hover:bg-blue-400 transition-colors py-3 rounded-lg font-medium flex items-center justify-center cursor-pointer"
                        onClick={visitWebsite}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                        Visit Website
                      </button>
                      <button 
                        className="flex-1 bg-gray-700 hover:bg-gray-600 transition-colors py-3 rounded-lg font-medium flex items-center justify-center cursor-pointer"
                        onClick={toggleSimilarMovies}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                        </svg>

                        Similar Movies
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-xl text-gray-400">Item not found</p>
            </div>
          )}

          {showSimilar && item && (
            <SimilarMovies movieId={id || '[]'} moviePlot={item.plot}  />
          )}
        </main>
      </div>
    );
  };

  export default DetailPage;
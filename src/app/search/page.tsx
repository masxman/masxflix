'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { searchMovies, getTmdbConfig, getImageUrl } from '@/lib/tmdb'; // Assuming tmdb utils are in src/lib

// --- DEBUGGING --- 
console.log("CLIENT-SIDE Check: NEXT_PUBLIC_TMDB_API_KEY =", process.env.NEXT_PUBLIC_TMDB_API_KEY);
// --- END DEBUGGING ---

interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
}

interface SearchResponse {
  results: MovieResult[];
  page: number;
  total_pages: number;
  total_results: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [tmdbConfig, setTmdbConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch TMDb configuration on component mount for image URLs
  useEffect(() => {
    getTmdbConfig()
      .then(config => setTmdbConfig(config))
      .catch(err => {
        console.error("Failed to fetch TMDb config:", err);
        setError('Could not load TMDb configuration.');
      });
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim() || !tmdbConfig) return;

    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const data: SearchResponse = await searchMovies(query);
      setResults(data.results || []);
      if (data.results.length === 0) {
        setError('No movies found for your query.');
      }
    } catch (err) {
      console.error("Failed to search movies:", err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Search Movies</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="border border-gray-300 p-2 rounded w-full md:w-1/2 mr-2"
          disabled={!tmdbConfig} // Disable input until config is loaded
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={isLoading || !query.trim() || !tmdbConfig}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {results.map((movie) => {
          const imageUrl = getImageUrl(movie.poster_path, 'w342', tmdbConfig);
          return (
            <Link key={movie.id} href={`/movie/${movie.id}`} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 block bg-white text-black">
              <div className="relative w-full h-64"> {/* Fixed height container */}
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={`${movie.title} poster`}
                    layout="fill" // Changed to fill
                    objectFit="cover" // Changed to cover for better aspect ratio handling
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Poster
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate" title={movie.title}>{movie.title}</h3>
                <p className="text-sm text-gray-600">
                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 
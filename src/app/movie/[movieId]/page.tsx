import Image from 'next/image';
import { getMovieDetails, getTmdbConfig, getImageUrl } from '@/lib/tmdb';
import { notFound } from 'next/navigation';

interface MovieDetailsPageProps {
  params: {
    movieId: string; // Movie ID from the URL
  };
}

// Opt out of static generation during development/build
export const dynamic = 'force-dynamic'; 

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  // Delay accessing params until after the first await inside try block
  try {
    // Access and parse params here
    const movieId = parseInt(params.movieId, 10);
    if (isNaN(movieId)) {
      notFound();
    }

    // Fetch movie details and TMDb configuration in parallel
    const [movieData, tmdbConfig] = await Promise.all([
      getMovieDetails(movieId), // Fetch specific movie details
      getTmdbConfig()           // Fetch config for image URLs
    ]);

    // Handle cases where movie data might not be found by TMDb
    if (!movieData || movieData.success === false) {
      // TMDb API sometimes returns { success: false, status_code: 34, status_message: '...' }
      console.warn(`Movie not found on TMDb for ID: ${movieId}`, movieData);
      notFound(); 
    }

    const posterUrl = getImageUrl(movieData.poster_path, 'w500', tmdbConfig);
    const backdropUrl = getImageUrl(movieData.backdrop_path, 'w1280', tmdbConfig);

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Backdrop Image (Optional) */}
        {backdropUrl && (
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8 shadow-lg">
            <Image
              src={backdropUrl}
              alt={`${movieData.title} backdrop`}
              fill
              className="object-cover"
              priority // Prioritize loading backdrop
            />
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            <h1 className="absolute bottom-4 left-4 text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
              {movieData.title}
            </h1>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster Image */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${movieData.title} poster`}
                width={500} // Provide explicit width
                height={750} // Provide explicit height (adjust aspect ratio if needed)
                className="rounded-lg shadow-md w-full"
                style={{ height: 'auto' }} // Maintain aspect ratio
              />
            ) : (
              <div className="w-full bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 aspect-[2/3]">
                No Poster
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="w-full md:w-2/3">
            {!backdropUrl && (
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                {movieData.title}
              </h1>
            )}
            <p className="text-lg text-gray-300 mb-4 italic">{movieData.tagline}</p>
            <p className="mb-6 text-gray-100">{movieData.overview}</p>

            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <span className="font-semibold text-gray-400">Release Date:</span>
                <span className="ml-2">{movieData.release_date ? new Date(movieData.release_date).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Runtime:</span>
                <span className="ml-2">{movieData.runtime ? `${movieData.runtime} minutes` : 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Rating:</span>
                <span className="ml-2">
                  {movieData.vote_average ? `${movieData.vote_average.toFixed(1)} / 10` : 'N/A'}
                  {movieData.vote_count ? ` (${movieData.vote_count} votes)` : ''}
                </span>
              </div>
              {movieData.budget > 0 && (
                <div>
                  <span className="font-semibold text-gray-400">Budget:</span>
                  <span className="ml-2">${movieData.budget.toLocaleString()}</span>
                </div>
              )}
               {movieData.revenue > 0 && (
                <div>
                  <span className="font-semibold text-gray-400">Revenue:</span>
                  <span className="ml-2">${movieData.revenue.toLocaleString()}</span>
                </div>
              )}
            </div>

            {movieData.genres && movieData.genres.length > 0 && (
              <div className="mb-6">
                <span className="font-semibold text-gray-400">Genres:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {movieData.genres.map((genre: { id: number; name: string }) => (
                    <span key={genre.id} className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

             {/* TODO: Add Watchlist/Rating buttons here later */}

          </div>
        </div>
      </div>
    );

  } catch (error) {
    // Access params here as well for error logging, ensuring parsing happens first
    const movieIdForError = parseInt(params.movieId, 10);
    console.error(`Failed to fetch movie details for ID ${isNaN(movieIdForError) ? params.movieId : movieIdForError}:`, error);
    notFound();
  }
}

// Optional: Generate Metadata for SEO
export async function generateMetadata({ params }: MovieDetailsPageProps) {
  // Delay accessing params until after the first await inside try block
  try {
    // Access and parse params here
    const movieId = parseInt(params.movieId, 10);
    if (isNaN(movieId)) {
      return { title: 'Movie Not Found' };
    }

    const movieData = await getMovieDetails(movieId);
    if (!movieData || movieData.success === false) {
      return { title: 'Movie Not Found' };
    }
    return {
      title: `${movieData.title} - masxflix`,
      description: movieData.overview || `Details for the movie ${movieData.title}`,
    };
  } catch (error) {
    const movieIdForError = parseInt(params.movieId, 10);
    console.error(`Failed to generate metadata for movie ID ${isNaN(movieIdForError) ? params.movieId : movieIdForError}:`, error);
    return {
      title: 'Error Loading Movie'
    };
  }
} 
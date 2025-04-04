const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error("Missing TMDb API Key config. Ensure NEXT_PUBLIC_TMDB_API_KEY is set in .env.local and the server was restarted.");
  throw new Error("Missing TMDb API Key config.");
}

// Helper function to fetch data from TMDb API
async function fetchTMDb(endpoint: string, params: Record<string, string | number | boolean> = {}) {
  const apiKey = TMDB_API_KEY;

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', apiKey as string);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  try {
    const response = await fetch(url.toString(), {
      // Optional: Add caching headers or revalidation logic if needed
      // next: { revalidate: 3600 } // Example: Revalidate every hour
    });
    if (!response.ok) {
      console.error('TMDb API Error:', await response.text());
      throw new Error(`Failed to fetch from TMDb: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDb:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

// --- API Functions ---

/**
 * Searches for movies on TMDb.
 * @param query The search query string.
 * @param page The page number to retrieve.
 * @returns A promise resolving to the search results.
 */
export async function searchMovies(query: string, page: number = 1) {
  return fetchTMDb('/search/movie', { query, page });
}

/**
 * Gets detailed information for a specific movie.
 * @param movieId The TMDb ID of the movie.
 * @returns A promise resolving to the movie details.
 */
export async function getMovieDetails(movieId: number) {
  // Optional: Append extra details like credits, videos, etc.
  // Example: { append_to_response: 'credits,videos' }
  return fetchTMDb(`/movie/${movieId}`);
}

/**
 * Gets the configuration details from TMDb, including base URLs for images.
 * Useful for constructing image paths.
 * @returns A promise resolving to the configuration data.
 */
export async function getTmdbConfig() {
  // Cache this response if possible, as it rarely changes.
  return fetchTMDb('/configuration');
}

// --- Helper to construct Image URLs ---

/**
 * Constructs the full URL for a TMDb image.
 * You'll need to call getTmdbConfig() once to get the base URL.
 * @param imagePath The path of the image (e.g., poster_path, backdrop_path).
 * @param size The desired image size (e.g., 'w500', 'original').
 * @param config The configuration object from getTmdbConfig().
 * @returns The full image URL or null if path/config is missing.
 */
export function getImageUrl(imagePath: string | null | undefined, size: string = 'w500', config: any): string | null {
  if (!imagePath || !config?.images?.secure_base_url) {
    return null; // Or return a placeholder image URL
  }
  return `${config.images.secure_base_url}${size}${imagePath}`;
} 
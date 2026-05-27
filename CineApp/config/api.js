// ⚠️ No subas esta key a GitHub
export const API_KEY = '3edd9b331a5828952671b71de07c683f';

export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

export const ENDPOINTS = {
  popularMovies: `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-AR&page=1`,
  topRated:      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-AR&page=1`,
  movieDetail:   (id) => `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-AR`,
};

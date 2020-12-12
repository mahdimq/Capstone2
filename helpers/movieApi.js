const axios = require('axios');
const BASE_URL = 'https://api.themoviedb.org/3';

const API = 'a19fde14eb2f33b545cd78125e338397';

const latest = 'movie/latest';
const topRated = 'movie/top_rated';
const discover = 'discover/movie';
const trending = 'trending/all/week';
const popular = 'movie/popular';
const search = 'search/movie';

class MovieApi {
	// Get Latest
	static async getLatest() {
		const result = await axios.get(`${BASE_URL}/${latest}`, {
			params: { api_key: API, total_results: 5 }
		});
		return result.data.results;
	}

	// Get Popular
	static async getPopular(page) {
		const result = await axios.get(`${BASE_URL}/${popular}`, {
			params: { api_key: API, page, include_adult: false }
		});
		return result.data;
	}

	// Get similar movies
	static async getSimilar(id) {
		const result = await axios.get(`${BASE_URL}/${id}/similar`, {
			params: { api_key: API, include_image_language: 'en' }
		});
		return result.data;
	}

	// Get movies by ID
	static async getById(movie_id) {
		const result = await axios.get(`${BASE_URL}/movie/${movie_id}`, {
			params: { api_key: API, movie_id, include_image_language: 'en' }
		});
		const film = result.data;
		return film;
	}

	// Get Movie credits by movie ID
	static async getMovieCredits(movie_id) {
		const result = await axios.get(`${BASE_URL}/movie/${movie_id}/credits`, {
			params: { api_key: API, movie_id, include_image_language: 'en' }
		});
		const film = result.data;
		return film;
	}

	// Get Top Rated
	static async getTopRated() {
		const result = await axios.get(`${BASE_URL}/${topRated}`, {
			params: { api_key: API }
		});
		return result.data;
	}

	// Get Trending
	static async getTrending() {
		const result = await axios.get(`${BASE_URL}/${trending}`, {
			params: { api_key: API }
		});
		return result.data;
	}

	// Get Action
	static async getAction(genre) {
		const result = await axios.get(`${BASE_URL}/${discover}`, {
			params: { api_key: API, with_genres: 28 }
		});
		return result.data;
	}

	// Get Comedy
	static async getComedy() {
		const result = await axios.get(`${BASE_URL}/${discover}`, {
			params: { api_key: API, with_genres: 35 }
		});
		return result.data;
	}

	// Search Movies
	static async search(query, page) {
		const result = await axios.get(`${BASE_URL}/${search}`, {
			params: { api_key: API, query, language: 'en', include_adult: false, page }
		});
		return result.data;
	}
}

module.exports = MovieApi;

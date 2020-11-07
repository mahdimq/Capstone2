const axios = require('axios');
const { application } = require('express');
const BASE_URL = 'https://api.themoviedb.org/3';

const API = 'a19fde14eb2f33b545cd78125e338397';
const API2 = '19f84e11932abbc79e6d83f82d6d1045';

const latest = 'movie/latest';
const topRated = 'movie/top_rated';
const discover = 'discover/movie';
const trending = 'trending/all/week';
const popular = 'movie/popular';

// IMAGES: /movies/{movie_id}/images

class MovieApi {
	// Get Latest
	static async getLatest() {
		const result = await axios.get(`${BASE_URL}/${latest}`, {
			params: { api_key: API, total_results: 5 }
		});
		// return result.data.results;
		return result.data.results.map((film) => ({
			TITLE: film.title,
			DESCRIPTION: film.overview,
			RATING: film.vote_average,
			ID: film.id,
			RELEASED: film.release_date
		}));
	}

	// GET POPULAR
	static async getPopular() {
		const result = await axios.get(`${BASE_URL}/${popular}`, {
			params: { api_key: API, total_results: 5 }
		});
		return result.data.results.map((film) => ({
			TITLE: film.title,
			DESCRIPTION: film.overview,
			RATING: film.vote_average,
			ID: film.id,
			RELEASED: film.release_date
		}));
	}

	// Get similar movies
	static async getSimilar(id) {
		const result = await axios.get(`${BASE_URL}/${id}/similar`, {
			params: { api_key: API, movie_id: id, include_image_language: 'en' }
		});
		return result.data;
		// return result.data.results.map((film) => ({
		// 	TITLE: film.title,
		// 	DESCRIPTION: film.overview,
		// 	RATING: film.vote_average,
		// 	ID: film.id,
		// 	RELEASED: film.release_date
		// }));
	}

	// Get movies by ID
	static async getById(movie_id) {
		const result = await axios.get(`${BASE_URL}/movie/${movie_id}`, {
			params: { api_key: API, movie_id, include_image_language: 'en' }
		});
		const film = result.data;
		return {
			TITLE: film.title,
			DESCRIPTION: film.overview,
			RATING: film.vote_average,
			IMAGE: film.backdrop_path,
			ID: film.id,
			RELEASED: film.release_date
		};
	}

	// Get Top Rated
	static async getTopRated() {
		const result = await axios.get(`${BASE_URL}/${topRated}`, {
			params: { api_key: API }
		});
		return result.data.results.map((film) => ({
			TITLE: film.title,
			DESCRIPTION: film.overview,
			RATING: film.vote_average,
			ID: film.id,
			IMAGE: film.backdrop_path,
			RELEASED: film.release_date
		}));
	}

	// Get Trending
	static async getTrending() {
		const result = await axios.get(`${BASE_URL}/${trending}`, {
			params: { api_key: API }
		});
		return result.data.results;
	}

	// Get Action
	static async getAction() {
		const result = await axios.get(`${BASE_URL}/${discover}`, {
			params: { api_key: API, with_genres: 28 }
		});
		return result.data.results.map((film) => ({
			TITLE: film.title,
			DESCRIPTION: film.overview,
			RATING: film.vote_average,
			IMAGE: film.backdrop_path,
			ID: film.id,
			RELEASED: film.release_date
		}));
	}

	// Get Comedy
	static async getComedy() {
		const result = await axios.get(`${BASE_URL}/${discover}`, {
			params: { api_key: API, with_genres: 35 }
		});
		return result.data.results.map((film) => ({
			TITLE: film.title,
			DESCRIPTION: film.overview,
			RATING: film.vote_average,
			IMAGE: film.backdrop_path,
			ID: film.id,
			RELEASED: film.release_date
		}));
	}

	// // TEST GET UPC
	// static async getUpc() {
	// 	const result = await axios.get(`https://api.upcitemdb.com/prod/trial/lookup`, {
	// 		header: { 'Content-Type': 'application/json' },
	// 		params: { upc: '0885909950805' }
	// 	});
	// 	return result;
	// }
}

module.exports = MovieApi;

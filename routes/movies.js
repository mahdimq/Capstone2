const express = require('express');
// const MovieApi = require('../helpers/movieApi');
const Movie = require('../models/movie');
const { ensureLoggedIn } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// ######################################################
// ################# MOVIES TABLE IN DB #################
// ######################################################

// ADD NEW MOVIE TO DATABASE
router.post('/add', ensureLoggedIn, async (req, res, next) => {
	try {
		const { id, title, description, image, rating } = req.body;
		const movie = await Movie.addMovie(id, title, description, image, rating);
		return res.json({ movie });
	} catch (err) {
		return next(err);
	}
});

// GET MOVIE BY MOVIE ID FROM DATABASE
router.get('/:id', async (req, res, next) => {
	try {
		const movie = await Movie.getMovieById(req.params.id);
		return res.json({ movie });
	} catch (err) {
		return next(err);
	}
});

// ######################################################
// #################### DATA FROM API ###################
// ######################################################

// // GET
// router.get('/toprated', async (req, res, next) => {
// 	try {
// 		// const result = await MovieApi.getTopRated();
// 		// return res.json(result);
// 		const result = await axios.get(`'https://api.themoviedb.org/3'/movie/top_rated`, {
// 			params: { api_key: API }
// 		});
// 		return result.data.results.map((film) => ({
// 			TITLE: film.title,
// 			DESCRIPTION: film.overview,
// 			RATING: film.vote_average,
// 			ID: film.id,
// 			IMAGE: film.backdrop_path,
// 			RELEASED: film.release_date
// 		}));
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // GET ONE
// router.get('/trending', async (req, res, next) => {
// 	try {
// 		const result = await MovieApi.getTrending();
// 		return res.json(result);
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // GET COMEDY
// router.get('/comedy', async (req, res, next) => {
// 	try {
// 		const result = await MovieApi.getComedy();
// 		return res.json(result);
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // search by category
// router.get('/latest', async (req, res, next) => {
// 	try {
// 		const result = await MovieApi.getLatest();
// 		return res.json(result);
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // Get trending movies
// router.get('/trending', async (req, res, next) => {
// 	try {
// 		const result = await MovieApi.getTrending();
// 		return res.json(result);
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // get similar movies
// router.get('/similar', async (req, res, next) => {
// 	try {
// 		console.log('REQUEST: ', req.body.movie_id);
// 		const result = await MovieApi.getSimilar(req.body.movie_id);
// 		return res.json(result);
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // GET BY ID
// router.get('/:id', async (req, res, next) => {
// 	try {
// 		console.log(req.params.id);
// 		const result = await MovieApi.getById(req.params.id);
// 		return res.json(result);
// 	} catch (err) {
// 		return next(err);
// 	}
// });

// // GET ACTION
// router.get('/action', async (req, res, next) => {
// 	try {
// 		const result = await MovieApi.getAction();
// 		console.log(result);
// 		return res.json(result);
// 	} catch (err) {
// 		console.log(err);
// 		return next(err);
// 	}
// });

module.exports = router;

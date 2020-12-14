const express = require('express');
const Movie = require('../models/movie');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// ######################################################
// ################# MOVIES TABLE IN DB #################
// ######################################################

// ADD NEW MOVIE TO DATABASE /movies/add
router.post('/add', isAuthenticated, async (req, res, next) => {
	try {
		const {
			id,
			original_title,
			overview,
			poster_path,
			vote_average,
			release_date,
			runtime,
			backdrop_path,
			tagline
		} = req.body;
		const movie = await Movie.addMovie(
			id,
			original_title,
			overview,
			poster_path,
			vote_average,
			release_date,
			runtime,
			backdrop_path,
			tagline
		);
		return res.json({ movie, message: 'Movie successfully added to DB' });
	} catch (err) {
		return next(err);
	}
});

// GET MOVIE BY MOVIE ID FROM DATABASE /movies/:movie
router.get('/:movie_id', async (req, res, next) => {
	try {
		const movie = await Movie.getMovieById(req.params.movie_id);
		return res.json({ movie });
	} catch (err) {
		return next(err);
	}
});

// GET ALL MOVIES FROM DATABASE /movies/
router.get('/', isAuthenticated, async (req, res, next) => {
	try {
		const movie = await Movie.getAllMovies();
		return res.json(movie);
	} catch (err) {
		return next(err);
	}
});

// REMOVE MOVIE FROM DATABASE BY ID /movies/:movie
router.delete('/:movie_id', isAuthenticated, async (req, res, next) => {
	try {
		await Movie.removeMovieById(req.params.movie_id);
		return res.json({ message: `Movie with id: ${req.params.movie_id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

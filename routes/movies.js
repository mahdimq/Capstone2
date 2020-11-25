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
		const { id, title, description, image, rating } = req.body;
		const movie = await Movie.addMovie(id, title, description, image, rating);
		return res.json({ movie });
	} catch (err) {
		return next(err);
	}
});

// GET MOVIE BY MOVIE ID FROM DATABASE /movies/:movie
router.get('/:movie_id', isAuthenticated, async (req, res, next) => {
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

module.exports = router;

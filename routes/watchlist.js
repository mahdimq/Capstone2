const express = require('express');
const Watchlist = require('../models/watchlist');
const { ensureLoggedIn } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// ADD MOVIE TO WATCHLIST /watchlist/:user/add
router.post('/:user_id/add', ensureLoggedIn, async (req, res, next) => {
	try {
		const { user_id } = req.params;
		const { id } = req.body;
		const newMovie = await Watchlist.addToWatchlist(user_id, id);
		return res.status(201).json({ newMovie });
	} catch (err) {
		return next(err);
	}
});

// GET MOVIE FROM WATCHLIST /watchlist/:user
router.get('/:user_id', async (req, res, next) => {
	try {
		const movie = await Watchlist.getFromWatchlist(req.params.user_id);
		return res.json(movie);
	} catch (err) {
		return next(err);
	}
});

// REMOVE MOVIE FROM WATCHLIST /watchlist/:user/:movie
router.delete('/:user_id/:movie_id', ensureLoggedIn, async (req, res, next) => {
	try {
		const { user_id, movie_id } = req.params;
		const result = await Watchlist.removeFromWatchlist(user_id, movie_id);
		return res.json({ message: 'Movie removed from watchlist' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

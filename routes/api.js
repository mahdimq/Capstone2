const express = require('express');
const router = express.Router({ mergeParams: true });
const MovieApi = require('../helpers/movieApi');

// GET POPULAR
router.get('/popular', async (req, res, next) => {
	try {
		const result = await MovieApi.getPopular();
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// // GET TOPRATED
router.get('/toprated', async (req, res, next) => {
	try {
		const result = await MovieApi.getTopRated();
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// GET TRENDING
router.get('/trending', async (req, res, next) => {
	try {
		const result = await MovieApi.getTrending();
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// GET COMEDY
router.get('/comedy', async (req, res, next) => {
	try {
		const result = await MovieApi.getComedy();
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// GET ACTION
router.get('/action', async (req, res, next) => {
	try {
		const result = await MovieApi.getAction();
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// GET LATEST
router.get('/latest', async (req, res, next) => {
	try {
		const result = await MovieApi.getLatest();
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// get similar movies
router.get('/similar', async (req, res, next) => {
	try {
		console.log('REQUEST: ', req.body.movie_id);
		const result = await MovieApi.getSimilar(req.body.movie_id);
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

// GET BY ID
router.get('/:id', async (req, res, next) => {
	try {
		console.log(req.params.id);
		const result = await MovieApi.getById(req.params.id);
		return res.json(result);
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

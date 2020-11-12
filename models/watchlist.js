const db = require('../db');
const ExpressError = require('../helpers/expressError');
const Movie = require('./movie');

/** Related functions for users. */

class Watchlist {
	// ADD MOVIES TO WATCHLIST, AUTH REQUIRED
	static async addToWatchlist(user_id, movie_id) {
		if (!user_id || !movie_id) throw new ExpressError('User or Movie not found', 400);
		// Check if movie already exists
		const duplicateCheck = await db.query(
			`SELECT user_id, movie_id
      FROM watchlist
      WHERE user_id = $1 AND movie_id = $2`,
			[user_id, movie_id]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Movie ${movie_id} already exists in the watchlist`);
			err.status = 409;
			throw err;
		}

		// If no duplicates found, add current movie to watchlist
		const result = await db.query(
			`INSERT INTO watchlist (user_id, movie_id)
			VALUES ($1, $2)
			RETURNING *`,
			[user_id, movie_id]
		);
		if (!result.rows[0]) throw new ExpressError('Unable to add to watchlist', 500);
		return await Movie.getMovieById(movie_id);
	}

	// Get list of movies from watchlist
	static async getFromWatchlist(user_id) {
		if (!user_id) throw new ExpressError('User not found', 400);

		const result = await db.query(
			`SELECT m.id, m.title, m.description, m.image
			FROM movies AS m
			JOIN watchlist as w
			ON m.id = w.movie_id
			WHERE w.user_id = $1`,
			[user_id]
		);
		if (result.rows.length === 0) throw new ExpressError('No movies found', 400);
		return result.rows;
	}

	// Remove movie from watchlist. Auth required.
	static async removeFromWatchlist(user_id, movie_id) {
		if (!user_id || !movie_id) throw new ExpressError('User or Movie not found', 400);
		const result = await db.query(
			`DELETE FROM watchlist
			WHERE user_id = $1
			AND movie_id = $2`,
			[user_id, movie_id]
		);
		return 'Movie deleted from watchlist'; //<-- Fix error showing message even when user doesn't exist
	}
}

module.exports = Watchlist;

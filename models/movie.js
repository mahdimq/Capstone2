const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Movie {
	// Create movies in DB
	static async addMovie(id = null, title = null, description = null, image = null, rating = null) {
		// Check if movie already exists
		const duplicateMovie = await db.query(`SELECT * FROM movies WHERE id = $1`, [id]);
		// if movie exists, return that
		if (duplicateMovie.rows[0])
			return {
				message: 'Duplicate movie already exists!',
				movie_info: duplicateMovie.rows[0]
			};
		// if movie doesn't exist, add it to the DB
		const result = await db.query(
			`INSERT INTO movies (id, title, description, image, rating)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description`,
			[id, title, description, image, rating]
		);
		return result.rows[0];
	}

	// Get movie by id
	static async getMovieById(id) {
		const result = await db.query(`SELECT * FROM movies WHERE id = $1`, [id]);

		// if movie not found, throw error
		if (!result) throw new ExpressError('Movie not found in DB', 404);

		return result.rows[0];
	}

	// Get all movies
	static async getAllMovies() {
		const result = await db.query(`SELECT * FROM movies ORDER BY title`);
		// if movie not found, throw error
		if (!result) throw new ExpressError('Movie not found in DB', 404);

		return result.rows;
	}

	// ###########################################################################
	// **** Find out how to remove movie from DB once the movie has been removed
	// **** from the watchlist, and does not exist for any user's watchlist.
	// ###########################################################################
}

module.exports = Movie;

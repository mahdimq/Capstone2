const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Movie {
	// Create movies in DB
	static async addMovie(
		id = null,
		original_title = null,
		overview = null,
		poster_path = null,
		vote_average = null,
		release_date = null,
		runtime = null,
		backdrop_path = null
	) {
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
			`INSERT INTO movies (id, original_title, overview, poster_path, vote_average, release_date, runtime, backdrop_path)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, original_title, overview`,
			[
				id,
				original_title,
				overview,
				poster_path,
				vote_average,
				release_date,
				runtime,
				backdrop_path
			]
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
		const result = await db.query(`SELECT * FROM movies ORDER BY original_title`);
		// if movie not found, throw error
		if (!result) throw new ExpressError('Movie not found in DB', 404);

		return result.rows;
	}

	static async removeMovieById(id) {
		const result = await db.query(
			`DELETE FROM movies
      WHERE id = $1
      RETURNING original_title`,
			[id]
		);
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

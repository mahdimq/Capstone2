const db = require('../db');
const bcrypt = require('bcrypt');
const partialUpdate = require('../helpers/partialUpdate');
const ExpressError = require('../helpers/expressError');
const { BCRYPT_WORK_FACTOR } = require('../config');

/** Related functions for users. */

class User {
	/** authenticate user with username, password. Returns user or throws err. */

	static async authenticate(data) {
		// try to find the user first
		const result = await db.query(
			`SELECT username, email, password
      FROM users
      WHERE username = $1`,
			[data.username]
		);

		const user = result.rows[0];

		if (user) {
			// compare hashed password to a new hash from password
			const isValid = await bcrypt.compare(data.password, user.password);
			if (isValid) {
				return user;
			}
		}

		const invalidPass = new ExpressError('Invalid Credentials');
		invalidPass.status = 401;
		throw invalidPass;
	}

	/** Register user with data. Returns new user data. */

	static async register(data) {
		const duplicateCheck = await db.query(
			`SELECT username, email
      FROM users
      WHERE username = $1 OR email = $2`,
			[data.username, data.email]
		);

		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(
				`User with the username/email: '${data.username}/${data.email}' already exists`
			);
			err.status = 409;
			throw err;
		}

		const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users
      (username, password, firstname, lastname, email)
      VALUES ($1, $2, $3, $4, $5)
    	RETURNING username, password, firstname, lastname, email`,
			[data.username, hashedPassword, data.firstname, data.lastname, data.email]
		);

		return result.rows[0];
	}

	/** Find all user. */

	static async findAll() {
		const result = await db.query(
			`SELECT id, username, firstname, lastname, email
      FROM users
      ORDER BY username`
		);

		return result.rows;
	}

	/** Given a username, return data about user. */

	static async findOne(username) {
		const userRes = await db.query(
			`SELECT username, firstname, lastname, email
      FROM users
      WHERE username = $1`,
			[username]
		);

		const user = userRes.rows[0];

		if (!user) {
			const error = new ExpressError(`User with username: '${username}' does not exist`);
			error.status = 404; // 404 NOT FOUND
			throw error;
		}

		return user;
	}

	/** Update user data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Return data for changed user.
	 *
	 */

	static async update(username, data) {
		if (data.password) {
			data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		}

		let { query, values } = partialUpdate('users', data, 'username', username);

		const result = await db.query(query, values);
		const user = result.rows[0];

		if (!user) {
			let notFound = new ExpressError(`User with username: '${username}' does not exist`);
			notFound.status = 404;
			throw notFound;
		}

		delete user.password;
		delete user.is_admin;

		return result.rows[0];
	}

	/** Delete given user from database; returns undefined. */

	static async remove(username) {
		const result = await db.query(
			`DELETE FROM users
      WHERE username = $1
      RETURNING username`,
			[username]
		);

		if (result.rows.length === 0) {
			const notFound = new ExpressError(`User with username: '${username}' does not exist`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = User;

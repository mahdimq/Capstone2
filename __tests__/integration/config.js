// npm packages
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// app imports
const app = require('../app');
const db = require('../db');

// Database DDL (for tests)
const DB_TABLES = {
	users: `
  CREATE TABLE users(
		id PRIMARY KEY
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    firstname TEXT,
    lastname TEXT,
    email TEXT
  )`,
	movies: `
  CREATE TABLE movies(
    id PRIMARY KEY,
    title TEXT,
		description TEXT,
		image TEXT
		rating DECIMAL
    user_handle TEXT NOT NULL REFERENCES users(handle) ON DELETE CASCADE
  )`,
	watchlist: `
  CREATE TABLE watchlist(
		id PRIMARY KEY
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INTEGER  NOT NULL REFERENCES movies(id) ON DELETE CASCADE
    PRIMARY KEY(user_id, movie_id)
  )`
};

// global auth variable to store things for all the tests
const TEST_DATA = {};

async function beforeAllHook() {
	try {
		await db.query(DB_TABLES['users']);
		await db.query(DB_TABLES['movies']);
		await db.query(DB_TABLES['watchlist']);
	} catch (error) {
		console.error(error);
	}
}

/**
 * Hooks to insert a user, company, and job, and to authenticate
 *  the user and the company for respective tokens that are stored
 *  in the input `testData` parameter.
 * @param {Object} TEST_DATA - build the TEST_DATA object
 */
async function beforeEachHook(TEST_DATA) {
	try {
		// login a user, get a token, store the user ID and token
		const hashedPassword = await bcrypt.hash('secret', 1);
		await db.query(
			`INSERT INTO users (username, password, firstname, lastname, email)
                  VALUES ('test', $1, 'testFirst', 'testLast', 'test@test.com')`,
			[hashedPassword]
		);

		const response = await request(app).post('/login').send({
			username: 'test',
			password: 'secret'
		});

		TEST_DATA.userToken = response.body.token;
		TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;
	} catch (error) {
		console.error(error);
	}
}

async function afterEachHook() {
	try {
		await db.query('DELETE FROM users');
	} catch (error) {
		console.error(error);
	}
}

async function afterAllHook() {
	try {
		await db.query('DROP TABLE IF EXISTS users');
		await db.query('DROP TABLE IF EXISTS movies');
		await db.query('DROP TABLE IF EXISTS watchlist');
		await db.end();
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	afterAllHook,
	afterEachHook,
	TEST_DATA,
	beforeAllHook,
	beforeEachHook
};

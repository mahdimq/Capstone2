process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../../app');
const db = require('../../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const DATA = {};

beforeEach(async function () {
	try {
		// Create a test user with token
		const hashedPW = await bcrypt.hash('testpassword', 1);
		await db.query(
			`INSERT INTO users (username, password, firstname, lastname, email)
        VALUES ('testUser', $1, 'testFirstname', 'testLastname', 'test@demo.com')`,
			[hashedPW]
		);

		const res = await request(app)
			.post('/login')
			.send({ username: 'testUser', password: 'testpassword' });

		DATA.token = res.body.token;
		DATA.username = jwt.decode(DATA.token).username;
		DATA.id = jwt.decode(DATA.token).id;

		// Insert a test movie into "movies"
		const result = await db.query(
			`INSERT INTO movies (id, original_title, overview, poster_path, vote_average, release_date, runtime, backdrop_path, tagline)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, original_title, overview`,
			[
				111,
				'Test Movie One',
				'Lorem ipsum',
				'/betExZlgK0l7CZ9CsCBVcwO1OjL.jpg',
				5,
				'15-07-2020',
				60,
				'/gEjNlhZhyHeto6Fy5wWy5Uk3A9D.jpg',
				'Test Tagline'
			]
		);

		DATA.movies = result.rows[0];
	} catch (err) {
		console.error(err);
	}
});

afterEach(async () => {
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM movies');
});

afterAll(async () => {
	await db.end();
});

describe('Add a movie to the DB', () => {
	test('Add a movie to the DB, success', async () => {
		const result = await request(app).post('/movies/add').send({
			id: 789,
			original_title: 'Test Movie Two',
			overview: 'Lorem ipsum',
			poster_path: '/betExZlgK0l7CZ9CsCBVcwO1OjL.jpg',
			vote_average: 5,
			release_date: '15-07-2020',
			runtime: 100,
			backdrop_path: '/gEjNlhZhyHeto6Fy5wWy5Uk3A9D.jpg',
			tagline: 'Test Tagline.',
			_token: DATA.token
		});
		expect(result.statusCode).toEqual(200);
		expect(result.body).toHaveProperty('message', 'Movie successfully added to DB');
		expect(result.body).toEqual(expect.anything());
	});

	test('Add a movie to the DB, failed', async () => {
		const result = await request(app).post('/movies/add').send({
			id: 789,
			original_title: 'Test Movie Two',
			overview: 'Lorem ipsum',
			poster_path: '/betExZlgK0l7CZ9CsCBVcwO1OjL.jpg',
			vote_average: 5,
			release_date: '15-07-2020',
			runtime: 100,
			backdrop_path: '/gEjNlhZhyHeto6Fy5wWy5Uk3A9D.jpg',
			tagline: 'Test Tagline.',
			_token: 'fake_token'
		});
		expect(result.statusCode).toEqual(401);
	});
});

describe('Get a movie from the DB', () => {
	test('Get a movie from the DB, success', async () => {
		const result = await request(app).get(`/movies/${DATA.movies.id}`);

		expect(result.statusCode).toEqual(200);
		expect(result.body).toEqual(expect.anything());
	});
});

describe('Get all movies from the DB', () => {
	test('Get all movie from the DB, success', async () => {
		const result = await request(app).get(`/movies/`).send({ _token: DATA.token });

		expect(result.statusCode).toEqual(200);
		expect(result.body).toEqual(expect.anything());
	});

	test('Get all movie from the DB, failed, wrong token', async () => {
		const result = await request(app).get(`/movies/`).send({ _token: 'fake_token' });

		expect(result.statusCode).toEqual(401);
		expect(result.body).toHaveProperty('error', {
			message: 'You must authenticate first.',
			status: 401
		});
	});
});

describe('Delete a movie from the DB', () => {
	test('Delete a movie from the DB, success', async () => {
		const result = await request(app)
			.delete(`/movies/${DATA.movies.id}`)
			.send({ _token: DATA.token });

		expect(result.statusCode).toEqual(200);
		expect(result.body).toHaveProperty(
			'message',
			`Movie with id: ${DATA.movies.id} has been deleted`
		);
	});

	test('Delete a movie from the DB, failed, wrong token', async () => {
		const result = await request(app)
			.delete(`/movies/${DATA.movies.id}`)
			.send({ _token: 'fake_token' });

		expect(result.statusCode).toEqual(401);
		expect(result.body).toHaveProperty('error', {
			message: 'You must authenticate first.',
			status: 401
		});
	});
});

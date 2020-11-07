process.env.NODE_ENV === 'test';
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require('../../config');
const app = require('../../app');
const User = require('../../models/user');
// const db = require('../../db');

let testUserToken;
let testAdminToken;

beforeAll(async function () {
	try {
		// login a user, get a token, store the user ID and token
		const hashedPassword = await bcrypt.hash('secret', BCRYPT_WORK_FACTOR);
		await db.query(
			`INSERT INTO users (username, password, firstname, lastname, email)
                  VALUES ('test', $1, 'testFirst', 'testLast', 'test@test.com')`,
			[hashedPassword]
		);
		await db.query(
			`INSERT INTO users (username, password, firstname, lastname, email)
                  VALUES ('admin', $1, 'testFirst', 'testLast', 'test@test.com')`,
			[hashedPassword]
		);
		// We will need tokens for future requests
		const testUser = { username: 'test' };
		const testAdmin = { username: 'admin' };
		testUserToken = jwt.sign(testUser, SECRET_KEY);
		testAdminToken = jwt.sign(testAdmin, SECRET_KEY);

		// const response = await request(app).post('/login').send({
		// 	username: 'test',
		// 	password: 'secret'
		// });

		// TEST_DATA.userToken = response.body.token;
		// TEST_DATA.currentUsername = jwt.decode(TEST_DATA.userToken).username;
	} catch (error) {
		console.error(error);
	}
});

// beforeEach(async function () {
// 	await beforeEachHook(TEST_DATA);
// });

// afterEach(async function () {
// 	await afterEachHook();
// });

// afterAll(async function () {
// 	await afterAllHook();
// });

describe('POST /users', function () {
	test('Creates a new user', async function () {
		const testUser = {
			username: 'testuser',
			firstname: 'userFirst',
			last_name: 'userLast',
			password: 'password',
			email: 'test@test.com'
		};
		const response = await request(app).post('/users').send(testUser);
		expect(response.statusCode).toBe(201);
		expect(response.body).toEqual({ username: 'testuser' });
		expect(response.body).toHaveProperty('token');
		// const testUserInDB = await User.findOne('testuser');
		// ['username', 'firstname', 'lastname'].forEach((key) => {
		// 	expect(testUser[key]).toEqual(testUserInDB[key]);
		// });
	});
});

describe('POST /login', function () {
	it('returns logged in message', async function () {
		const response = await request(app)
			.post('/login')
			.send({ username: 'test', password: 'fakePW' });
		expect(response.statusCode).toBe(400);
	});
});

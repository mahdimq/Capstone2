// process.env.NODE_ENV === 'test';
const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require('../../config');
const app = require('../../app');
const User = require('../../models/user');
// const db = require('../../db');
const {TEST_DATA, beforeAllHook, beforeEachHook, afterEachHook, afterAllHook} = require("./config")

// let testUserToken;
// let testAdminToken;

beforeAll(async function () {
	await beforeAllHook()
});

beforeEach(async function() {
	await beforeEachHook(TEST_DATA)
})

describe('POST /users', () => {
	test('Creates a new user', async () => {
		const data = {
			email: 'test@test.com',
			password: 'password',
			first_name: 'Tester',
			last_name: 'Testson',
			skill_level: 'rookie',
			image_url: 'www.testurl.com'
		};
		const response = await request(app).post('/users').send(data);
		expect(response.statusCode).toBe(201);
		expect(response.body).toHaveProperty('token');
		const testId = jwt.decode(response.body.token).id;
		const userInDb = await User.findOne(testId);
		Object.keys(userInDb).forEach((key) => {
			expect(data[key]).toEqual(userInDb[key]);
		});
	});
	test('Prevents creating a user with duplicate email', async function () {
		const response = await request(app).post('/users').send({
			email: 'user@test.com',
			password: 'password',
			first_name: 'Tester',
			last_name: 'Testson',
			skill_level: 'rookie',
			image_url: 'www.testurl.com'
		});
		expect(response.statusCode).toBe(409);
	});



afterEach(async function () {
	await afterEachHook();
});
afterAll(async function () {
	await afterAllHook();
});

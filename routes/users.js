/** Routes for users. */

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const getToken = require('../helpers/createToken');
const { validate } = require('jsonschema');
const { userNewSchema, userUpdateSchema } = require('../schemas');
const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

/** GET / => {users: [user, ...]} */

router.get('/', isAuthenticated, async function (req, res, next) {
	try {
		const users = await User.findAll();
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

/** GET /[username] => {user: user} */

router.get('/:username', isAuthenticated, async function (req, res, next) {
	try {
		const user = await User.findOne(req.params.username);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** POST / {userdata}  => {token: token} */

router.post('/', async function (req, res, next) {
	try {
		delete req.body._token;
		// Validate schema from json schema
		const validation = validate(req.body, userNewSchema);

		if (!validation.valid) {
			return next({
				status: 400,
				message: validation.errors.map((e) => e.stack)
			});
		}

		const newUser = await User.register(req.body);
		const token = getToken(newUser);
		return res.status(201).json({ token });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /[handle] {userData} => {user: updatedUser} */

router.patch('/:username', ensureLoggedIn, async function (req, res, next) {
	try {
		if ('username' in req.body || 'is_admin' in req.body) {
			return next({ status: 400, message: 'Not allowed' });
		}
		await User.authenticate({
			username: req.params.username,
			password: req.body.password
		});
		delete req.body.password;
		const validation = validate(req.body, userUpdateSchema);
		if (!validation.valid) {
			return next({
				status: 400,
				message: validation.errors.map((e) => e.stack)
			});
		}

		const user = await User.update(req.params.username, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[handle]  =>  {message: "User deleted"}  */

router.delete('/:username', ensureLoggedIn, async function (req, res, next) {
	try {
		await User.remove(req.params.username);
		return res.json({ message: `User: ${req.params.username} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

/** Routes for users. */

const express = require('express');
const router = new express.Router();

const User = require('../models/user');
const getToken = require('../helpers/createToken');
const { validate } = require('jsonschema');
const { userNewSchema, userUpdateSchema } = require('../schemas');
const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

/** GET / => {users: [user, ...]} */

// GET ALL USERS /user/
router.get('/', isAuthenticated, async function (req, res, next) {
	try {
		const users = await User.findAll();
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

/** GET /[username] => {user: user} */
// GET A SINGLE USER BY ID /user/:id
router.get('/:user_id', ensureLoggedIn, async function (req, res, next) {
	try {
		const user = await User.findOne(req.params.user_id);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** POST / {userdata}  => {token: token} */
// REGISTER A USER /user/
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
		return res.status(201).json({ token, username: newUser.username, id: newUser.id });
	} catch (e) {
		return next(e);
	}
});

/** PATCH /[handle] {userData} => {user: updatedUser} */
// UPDATE A SINGLE USER /user/:username
router.patch('/:user_id', async function (req, res, next) {
	try {
		if ('id' in req.body) {
			return next({ status: 400, message: 'Not allowed' });
		}

		await User.authenticate({
			id: req.params.user_id,
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

		const user = await User.update(req.params.user_id, req.body);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[handle]  =>  {message: "User deleted"}  */
// DELETE A SINGLE USER users/:id
router.delete('/:user_id', ensureLoggedIn, async function (req, res, next) {
	try {
		await User.remove(req.params.user_id);
		return res.json({ message: `User: ${req.params.user_id} has been deleted` });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

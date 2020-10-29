const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const ExpressError = require('../helpers/expressError');

/** Middleware to use when they must provide a valid token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

const isAuthenticated = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);
		if (!payload) return new ExpressError('Invalid Token', 401);
		req.user = payload;
		return next();
	} catch (err) {
		return next(new ExpressError('Token not supplied', 401));
	}
};

/** Middleware to use when they must provide a valid token & be user matching
 *  username provided as route param.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */

const ensureLoggedIn = (req, res, next) => {
	// if (!req.user) {
	// 	const err = new ExpressError('Unauthorized', 401);
	// 	return next(err);
	// } else {
	// 	return next();
	// }

	try {
		const tokenStr = req.body._token || req.query._token;

		let token = jwt.verify(tokenStr, SECRET);
		req.username = token.username;

		if (token.username === req.params.username) {
			return next();
		}

		// throw an error, so we catch it in our catch, below
		throw new Error();
	} catch (err) {
		const unauthorized = new ExpressError('Unauthorized, token required!', 401);
		return next(unauthorized);
	}
};

/** Middleware to use when they must provide a valid token that is an admin token.
 *
 * Add username onto req as a convenience for view functions.
 *
 * If not, raises Unauthorized.
 *
 */
const ensureIsAdmin = (req, res, next) => {
	try {
		const tokenStr = req.body._token || req.query._token;
		const payload = jwt.verify(tokenStr, SECRET);
		req.username = token.username;

		if (payload.is_admin || payload.username === req.params.username) {
			return next();
		}
		throw new ExpressError();
	} catch (err) {
		return next(new ExpressError('Must be an admin to access this!', 401));
	}
};

module.exports = { isAuthenticated, ensureLoggedIn, ensureIsAdmin };

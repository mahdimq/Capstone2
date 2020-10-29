/** Routes for users. */

const express = require('express');
const router = express.Router();

const Cart = require('../models/cart');
const User = require('../models/user');

const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

/** POST TO CART (Add items to cart) */
router.post('/:username/add', isAuthenticated, ensureLoggedIn, async (req, res, next) => {
	try {
		const { id } = await User.findOne(req.params.username);
		console.log('THE ID FOR USERNAME', id);

		product_id = 1234; //<-- don't have data from backend yet
		await Cart.addToCart(id, product_id);
		return res.json({ message: 'item added' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

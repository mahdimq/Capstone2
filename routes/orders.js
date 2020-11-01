const express = require('express');
const router = express.Router();

const { ensureLoggedIn, isAuthenticated } = require('../middleware/auth');

const User = require('../models/user');
const Order = require('../models/order');

/** POST A NEW ORDER*/
router.post('/:username/new', ensureLoggedIn, isAuthenticated, async (req, res, next) => {
	try {
		const { id } = await User.findOne(req.params.username);
		const newOrder = await Order.makeOrder(id);
		return res.json({ message: 'Order Submitted' });
	} catch (err) {
		return next(err);
	}
});

// Get an Order
router.post('/:username/history', ensureLoggedIn, isAuthenticated, async (req, res, next) => {
	try {
		const { id } = await User.findOne(req.params.username);
		const orders = await Order.getOrders(id);
		console.log('###########################');
		console.log('ID', id);
		console.log('ORDERS', orders);
		console.log('###########################');
		return res.json(orders);
	} catch (err) {
		return next(err);
	}
});

// Delete an order
router.delete('/:username/delete', ensureLoggedIn, isAuthenticated, async (req, res, next) => {
	try {
		const order_id = 1 || req.body.order_id;
		const result = await deleteOrder(order_id);
		return res.json({ message: 'Order Deleted!' });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;

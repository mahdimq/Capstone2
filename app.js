/** Express app for capstone. */

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const ExpressError = require('./helpers/expressError');

app.use(express.json());
app.use(cors());

// add logging system
app.use(morgan('dev'));
app.use(morgan('tiny'));

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/carts');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./helpers/productApi');

app.use('/users', userRoutes);
app.use('/carts', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/api', productRoutes);
app.use('/', authRoutes);

// CUSTOM 404 NOT FOUND ERROR
app.use((req, res, next) => {
	const err = new ExpressError('Page not found', 404);
	return next(err);
});

// GENERAL ERROR HANDLING
app.use((error, req, res, next) => {
	// set default status to 500 Internal Server Error
	if (error.stack) console.log(error.stack);

	const status = error.status || 500;
	const message = error.message;
	// display error and alert user
	res.status(status).json({ error: { message, status } });
});

module.exports = app;

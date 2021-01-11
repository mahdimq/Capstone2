/** Express app for capstone. */

const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const ExpressError = require('./helpers/expressError');

app.use(express.json());
// app.use(cors());

const whitelist = [
	'http://localhost:3000',
	'https://thewatchlist.netlify.app',
	'https://thewatchlist-backend.herokuapp.com/'
]; // list of allowed domains

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) {
			return callback(null, true);
		}

		if (whitelist.indexOf(origin) === -1) {
			var msg =
				'The CORS policy for this site does not ' +
				'allow access from the specified Origin.';
			return callback(new ExpressError(msg), false);
		}
		return callback(null, true);
	}
};

// app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

// add logging system
// app.use(morgan('dev'));
app.use(morgan('tiny'));

const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const watchlistRoutes = require('./routes/watchlist');
const movieRoutes = require('./routes/movies');
const apiRoutes = require('./routes/api');

app.use('/users', userRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/movies', movieRoutes);
app.use('/', authRoutes);
app.use('/api', apiRoutes);

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

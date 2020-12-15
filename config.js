/** Shared config for application; can be required in many places. */

require('dotenv').config();

const SECRET = process.env.SECRET_KEY || 'test';
const BCRYPT_WORK_FACTOR = 12;
const PORT = +process.env.PORT || 3001;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'watchlist-test'
// - else: 'watchlist'

let DB_URI;

if (process.env.NODE_ENV === 'test') {
	DB_URI = 'watchlist_test';
} else {
	DB_URI = process.env.DATABASE_URL || 'watchlist';
}

console.log('Using database', DB_URI);

module.exports = {
	SECRET,
	PORT,
	DB_URI,
	BCRYPT_WORK_FACTOR
};

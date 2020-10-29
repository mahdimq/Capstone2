/** Shared config for application; can be req'd many places. */

require('dotenv').config();

const SECRET = process.env.SECRET_KEY || 'test';
const BCRYPT_WORK_FACTOR = 12;
const PORT = +process.env.PORT || 3000;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'capstone2-test'
// - else: 'capstone2'

let DB_URI;

if (process.env.NODE_ENV === 'test') {
	DB_URI = 'capstone2-test';
} else {
	DB_URI = process.env.DATABASE_URL || 'capstone2';
}

console.log('Using database', DB_URI);

module.exports = {
	SECRET,
	PORT,
	DB_URI,
	BCRYPT_WORK_FACTOR
};

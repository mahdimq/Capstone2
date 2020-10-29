const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

/** return signed JWT from user data. */

// const getToken = (user) => {
// 	return jwt.sign(
// 		{
// 			_id: user._id,
// 			name: user.name,
// 			email: user.email,
// 			is_admin: user.is_admin
// 		},
// 		SECRET_KEY,
// 		{
// 			expiresIn: '12h'
// 		}
// 	);
// };

const getToken = (user) => {
	let payload = {
		_id: user._id,
		username: user.username,
		email: user.email,
		is_admin: user.is_admin
	};
	return jwt.sign(payload, SECRET, { expiresIn: '12h' });
};

module.exports = getToken;

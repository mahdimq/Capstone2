const db = require('../db');
const ExpressError = require('../helpers/expressError');

class Cart {
	// /** Get the cart information */
	// //  Check for duplicates
	static async duplicateCheck(user_id) {
		const cart = await db.query(
			`SELECT id
      FROM cart
      WHERE user_id = $1`,
			[user_id]
		);
		return cart.rows[0];
	}

	/** Create a new cart */

	static async newCart(user_id) {
		console.log('at the cart model', user_id);
		// check for duplicate carts
		const duplicateCheck = await db.query(
			`SELECT id
      FROM cart
      WHERE user_id = $1`,
			[user_id]
		);

		console.log('DUPLICATE CHECK', duplicateCheck);
		// if duplicates found, throw error
		if (duplicateCheck.rows[0]) {
			const err = new ExpressError(`Cart already exists`, 409);
			throw err;
		} else {
			// else add items to cart
			await db.query(
				`INSERT INTO cart
        (user_id)
        VALUES ($1)`,
				[user_id]
			);
		}
	}

	// Add item to cart

	static async addToCart(user_id, product_id) {
		// check for duplicates
		const cart = await this.duplicateCheck(user_id);
		console.log(cart);

		let cart_id;
		const cartItem = await this.cartItem(user_id, product_id);
		if (cartItem.rowCount === 0) {
			cartId = cart[0].id;
			await db.query(
				`INSERT INTO cart
        (user_id, product_id, quantity)
        VALUES
        ($1, $2, $3)`,
				[user_id, product_id, 1]
			);
		} else {
			cartId = cart[0].id;
			await db.query(
				`UPDATE cart
        SET quantity - quantity + 1
        WHERE product_id = $1`,
				[product_id]
			);
		}
	}

	// Remove one item from cart
	static async deleteFromCart(user_id, product_id) {
		const cart = await this.duplicateCheck(user_id);

		console.log(cart);

		let cartId;
		const cartItem = await this.cartItem(user_id, product_id);
		if (cartItem.rows.length === 0) throw new ExpressError(`Item not in the cart!`, 404);
		if (cartItem.rows[0].quantity === 1) {
			// delete entire row
			cartId = cart[0].id;
			await db.query(
				`DELETE FROM cart
        WHERE product_id = $1`,
				[product_id]
			);
		} else {
			// if quantity is more than one, remove one
			cartId = cart[0].id;
			await db.query(
				`UPDATE cart
        SET quantity = quantity - 1
        WHERE product_id = $1`,
				[product_id]
			);
		}
	}

	// Delete entire cart
	static async deleteCart(user_id) {
		const result = await db.query(
			`DELETE FROM cart
      WHERE user_id = $1
      RETURNING user_id`,
			[user_id]
		);

		if (result.rows.length === 0) {
			let notFound = new ExpressError(`Cart does not exist`, 404);
			throw notFound;
		}
	}
}

module.exports = Cart;

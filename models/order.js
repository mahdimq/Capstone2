const db = require('../db');
const Cart = require('./cart');
const ExpressError = require('../helpers/expressError');

/** Related functions for orders. */

class Order {
	static async makeOrder(user_id) {
		const result = await db.query(
			`INSERT INTO order (user_id)
          VALUES ($1)
          RETURNING id AS order_id`,
			[user_id]
		);

		if (!result) return new ExpressError('Error adding order', 404);

		const { order_id } = result.rows[0];

		// get the cart_id
		const cartResult = await Cart.getCartId(user_id);

		if (!cartResult) return new ExpressError('Error selecting from cart', 404);

		const cart_id = cartResult[0].id;

		await this.updateOrder(order_id, cart_id);
	}

	static async updateOrder(order_id, cart_id) {
		// maybe check here if the cart_id has anything on the item table
		const cartItems = await db.query(
			`SELECT * FROM item
          WHERE cart_id = $1`,
			[cart_id]
		);
		console.log(cartItems.rows[0]);
		// if(cartItems.rows[0].product_id === null) throw new ExpressError('can not make an order with an empty cart', 404)
		if (!cartItems.rows[0].product_id)
			throw new ExpressError('Cart is Empty, order cannot be made', 404);

		await db.query(
			`UPDATE item
          SET order_id = $1
          WHERE cart_id = $2`,
			[order_id, cart_id]
		);

		//  nullify the cart_id on item
		await db.query(
			`UPDATE item
          SET order_id = $1
          WHERE cart_id = $2`,
			[null, cart_id]
		);
	}

	static async getOrders(user_id) {
		// Join order table to retreive date
		const result = await db.query(
			`SELECT  order_id, product_id , quantity, order_date
          FROM item
          JOIN order
          USING (user_id)
          WHERE user_id = $1`,
			[user_id]
		);

		console.log(user_id);
		return result.rows;
	}

	static async deleteOrder(order_id) {
		const result = await db.query(
			`DELETE FROM order
        WHERE id = $1`,
			[order_id]
		);

		if (result.rows.length === 0) {
			let notFound = new ExpressError(`Order not found`, 404);
			throw notFound;
		}
	}
}

module.exports = Order;

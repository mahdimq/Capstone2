const axios = require('axios');
const BASE_URL = 'https://fakestoreapi.com/products';

class ProductApi {
	// Get all products limit to 10
	static async getProducts() {
		const result = await axios.get('https://fakestoreapi.com/products', {
			params: { limit: 10 }
		});
		console.log(result.data);
		console.log(result.json());
		return result.json();
	}

	// // Get product by category
	// static async category(item) {
	// 	const result = await axios.get(`${BASE_URL}/category/${item}`, {
	// 		params: { limit: 10 }
	// 	});
	// 	return result.data;
	// }
}

module.exports = ProductApi;

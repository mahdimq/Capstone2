const express = require('express');
const router = express.Router({ mergeParams: true });

const ProductAPI = require('../helpers/productApi');

// GET
router.get('/products', async (req, res, next) => {
	try {
		const items = await ProductAPI.getProducts();
		return res.json(items);
	} catch (err) {
		return next(err);
	}
});

// router.get('/products/:category', async (req, res, next) => {
// 	try {
// 		const results = await category(req.params.body);
// 		return res.json({ results });
// 	} catch (err) {
// 		return next(err);
// 	}
// });

module.exports = router;

const Cart = require('../models/cart');
const connectDB = require("../config/connection");
const mongoose = require('mongoose');
const Product = require('../models/product');

module.exports={
    addToCart:async (proId, userId) => {
		const product = await Product.findOne({_id: proId})
		let proObj = {
			item: proId,
			quantity: 1,
			price:product.Price
		}
		console.log(product,"pro in addto cart")
		return new Promise(async (resolve, reject) => {
			console.log(userId, "addtocart");
			if(product.Stock>=1){
			try {
				
				let userCart = await Cart.findOne({ user: userId });
				if (userCart) {
					console.log(userCart, "usercart");
					try {
						const proExist = userCart.products.some(product => product.item.toString() === proId.toString());
						// console.log(proExist,"proexisst");

						if (proExist) {

							await Cart.updateOne(
								{ user: (userId), 'products.item': proId },
								{
									$inc: { 'products.$.quantity': 1 }
								}
							).then(() => {
								resolve({ status: true})
							})
								.catch((err) => {
									console.error(err);
								})
						}
						else {
							// console.log("herre");
							await Cart.updateOne(
								{ user: userId },
								{
									$push: { products: proObj }
								}
							)
								.then(() => {
									// console.log("resolved in addtocart");
									resolve({ status: true})
								})
								.catch((err) => {
									console.error(err);
								})
						}
					} catch (error) {
						console.log("Failed to update cart:", error);
						reject(error);
					}
				}
				else {
					let cartObj = {
						user: userId,
						products: [proObj]
					};
					let newCart = new Cart(cartObj);
					await newCart.save();
					resolve({ status: true});
				}
			} catch (error) {
				console.log("Failed to add to cart:", error);
				reject(error);
			}
		}else{
			resolve({status: 'outOfStock'})
		}
		});
	},

    isCartEmpty: async (userId) => {
		console.log(userId, "here is cart empty u-c");
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					Cart.findOne({ user: userId })
						.then((data) => {
							const productArrayLength = data?.products?.length;
							console.log(data, "cart isempty");
							resolve(productArrayLength)
						}).catch((error) => {
							console.log(error);
							reject(false);
						})
				})
		})

	},

    getCartProducts: (userId) => {
		return new Promise(async (resolve, reject) => {
			try {
				const cartItems = await Cart.aggregate([
					{
						$match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
					},
					{
						$unwind: '$products'
					},
					{
						$project: {
							item: '$products.item',
							quantity: '$products.quantity'
						}
					},
					{
						$lookup: {
							from: 'products',
							localField: 'item',
							foreignField: '_id',
							as: 'product'
						}
					},
					{
						$project: {
							item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
						}
					},
				]).exec();
				console.log(cartItems[0]?.product, "getcart pro u-h");
				resolve(cartItems);
			} catch (error) {
				reject(error);
			}
		});
	},

    changeProductQuantity: (details) => {

		quantity = parseInt(details.quantity)
		count = parseInt(details.count)
		stockCount = parseInt(details.stockcount)
		proId = (details.product)
		console.log(proId, "details");
		return new Promise(async (resolve, reject) => {
			if (count === -1 && quantity === 1) {
				await Cart.updateOne(
					{ _id: (details.cart) },
					{
						$pull: { products: { item: (details.product) } }
					}
				).then((response) => {
					resolve({ removeProduct: true })
				})
			} else {
				await Cart.updateOne(
					{ _id: (details.cart), 'products.item': details.product },
					{
						$inc: { 'products.$.quantity': count }
					}
				)
					// .then(async ()=>{
					// 	await Product.findByIdAndUpdate(proId,{$inc:{Stock:stockCount}})
					// })
					.then((response) => {
						resolve(response)
					})
					.catch((err) => {
						console.error(err);
						reject(err);
					})
			}
		})
	},

    removeCartProduct: (details) => {
		return new Promise(async (resolve, reject) => {
			await Cart.updateOne(
				{ _id: (details.cart) },
				{
					$pull: { products: { item: (details.product) } }
				}
			).then((response) => {
				resolve({ removeProduct: true })
			})
				.catch((err) => {
					console.error(err);
					reject(err);
				})
		});
	},



}
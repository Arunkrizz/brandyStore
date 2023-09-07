const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const connectDB = require("../config/connection");
const User = require('../models/user');
const Cart = require('../models/cart');
const { findByIdAndUpdate } = require('../models/coupon');
// const nodemailer = require('nodemailer')
// const Otp = require('../models/otp')
// const Order = require('../models/order')
// const Product = require('../models/product');
// const { ObjectId } = require("mongodb");


// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = {

	 addCouponToUser : (couponCode, userId) => {
		try {
		  return new Promise(async(resolve, reject) => {
			const updated = await User.updateOne(
				{ _id:userId },
				{$push: { coupons: couponCode}}
			  )
			  .then((couponAdded) => {
				resolve(couponAdded);
			  });
			console.log(updated,"couponAdded");
		  });
		} catch (error) {
		  console.log(error.message);
		}
	  },

	checkoutaddAddress:async(details,userId)=>{
		const newAddress = {
			_id: new mongoose.Types.ObjectId(),
			firstname: details.fname,
			lastname: details.lname,
			state: details.state,
			address1: details.address1,
			address2: details.address2,
			city: details.city,
			pincode: details.pincode,
			mobile: details.mobile,
			email: details.email,
		};
		//   console.log(newAddress,"addreessssss");
		try {

			const user = await User.findById(userId);

			if (!user) {
				console.log('User not found.');

			}

			//   console.log( user.Address.primary,"user");

			// if (!user.Address.primary) {
				if (user) {
				return new Promise((resolve, reject) => {
					connectDB()
						.then(() => {
							User.updateOne({ _id: userId }, { $push: { Address: newAddress } })
							// User.updateOne({ _id: userId }, { Address: { ...newAddress, primary: true } })
								// User.findOne({_id:userId})
								.then((data) => {
									console.log(data,"addaddress u-c");
									resolve(true)
								}).catch((error) => {
									console.log(error);
									reject(error)
								})
						})
				})
			}



		} catch (error) {
			console.log(error);
		}

	},


	fetchPrimaryAddress: async (userId)=>{
		return new Promise ((resolve, reject)=>{
			connectDB()
			.then(()=>{
				User.findById(userId)
				.then((data)=>{
					const primaryAddress = data.Address.find((address) => address.primary);

					if (primaryAddress) {
					  resolve(primaryAddress) ; // Return the primary address object
					} else {
					  throw new Error('Primary address not found.');
					}
				})
			})
		})
	},

	changePrimaryAddress: async(userId,addressId)=>{
		try {
			const user = await User.findById(userId);
		
			if (!user) {
			  console.error('User not found.');
			  return;
			}
		
			// Update all addresses and set 'primary' to false
			user.Address.forEach(address => {
			  if (address._id.toString() !== addressId) {
				address.primary = false;
			  } else {
				address.primary = true;
			  }
			});
		
			// Save the updated user document
			const updatedUser = await user.save();
			console.log('User updated successfully:', updatedUser);
		  } catch (err) {
			console.error('Error updating user:', err);
		  }
	},

	deleteAddress: async (userId, addressId) => {
		try {

			console.log(userId, addressId," u-h deleteaddress herre");
		  return new Promise(async (resolve, reject) => {
			// Find the user by its ObjectId
			const user = await User.findByIdAndUpdate(userId, { $pull: { Address: { _id: addressId} } })
			.then(()=>{
				resolve(true)
			}).catch((error)=>{
				console.log(error);
			reject(error)
			})
			
		  });
		} catch (error) {
		  console.error("Error deleting address:", error);
		}
	  },
	  

	updateAddress:async (userId,addressId,updatedAddress)=>{
		try {
			return new Promise (async (resolve,reject)=>{
				// Find the user by its ObjectId
			const user = await User.findById(userId);
		
			// Find the index of the Address with the specified ObjectId
			const addressIndex = user.Address.findIndex(addr => String(addr._id) === addressId);
		
			if (addressIndex !== -1) {
			  // Update the Address object fields with the provided values
			  Object.assign(user.Address[addressIndex], updatedAddress);
		
			  // Save the changes to the database
			  await user.save().then (()=>{
				resolve(true)
			  })
			} else {
			  console.log("Address not found!");
			  reject()
			}
			})
			
		  } catch (error) {
			console.error("Error updating address:", error);
		  }
	},

	fetchAddress: async (userId,addressId) =>{
		return new Promise ((resolve,reject)=>{
			connectDB()
			.then(()=>{
				User.findById(userId)
				.then((user)=>{
					const addressIndex = user.Address.findIndex(addr => String(addr._id) === addressId);
					
					console.log(user,"data in fetch address ",addressIndex,"add index");
					if (addressIndex !== -1) {
					const address= user.Address[addressIndex]
					// console.log(address,"address here");
						resolve(address)
					}else{
						reject()
					}
				
				}) 	
			})
		})
	},

	updatePassword: async (userId, password) => {

		const newPassword = await bcrypt.hash(password, 10);
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findByIdAndUpdate(userId, { Password: newPassword }).then(() => {
						resolve({ updated: true })
					}).catch((error) => {
						console.log(error);
						reject(error)
					})
				})
		})
	},


	confirmPassword: async (details) => {
		const oldPassword = details.oldpassword
		const newPassword = details.newpassword
		const userId = details.userid

		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findById(userId).then((user) => {
						if (user) {
							// Compare the entered password with the hashed password in the database
							bcrypt.compare(oldPassword, user.Password, (err, result) => {
								if (err) {
									// Handle the bcrypt comparison error
									console.log('Password comparison error:', err);
									reject(err);
								}
								if (result) {
									// If passwords match, resolve the promise with the admin
									resolve(user);
								} else {
									// If passwords don't match, resolve the promise with null
									resolve(null);
								}
							});
						} else {
							// If no admin found with the given email, resolve the promise with null
							resolve(null);
						}




					}).catch((error) => {
						console.log(error);
						reject()
					})
				})
		})

	},

	changeAddress: async (details) => {
		const userId = details.userId
		const newAddress = {
			firstname: details.firstname,
			lastname: details.lastname,
			state: details.state,
			address1: details.address1,
			address2: details.address2,
			city: details.city,
			pincode: details.pincode,
			mobile: details.mobile,
			email: details.email,
		};
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findByIdAndUpdate(userId, { Address: { ...newAddress } }).then(() => {
						resolve({ updated: true })
					}).catch((error) => {
						console.log(error);
						reject(error)
					})
				})
		})
	},

	getProfile: async (userId) => {
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findById(userId).then((data) => {
						resolve(data)
					}).catch((error) => {
						console.log(error);
						reject(error)
					})
				})
		})
	},

	getAddress: async (userId) => {
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findById(userId).then((data) => {
						console.log(data.Address,"getaddress");
						resolve(data.Address)
					}).catch((error) => {
						console.log(error);
						reject(error)
					})
				})
		})
	},


	addAddress: async (details, userId) => {
		console.log(details, "details", userId, "user in add address");
		const newAddress = {
			_id: new mongoose.Types.ObjectId(),
			firstname: details.fname,
			lastname: details.lname,
			state: details.state,
			address1: details.address1,
			address2: details.address2,
			city: details.city,
			pincode: details.pincode,
			mobile: details.mobile,
			email: details.email,
		};
		//   console.log(newAddress,"addreessssss");
		try {

			const user = await User.findById(userId);

			if (!user) {
				console.log('User not found.');

			}

			//   console.log( user.Address.primary,"user");

			// if (!user.Address.primary) {
				if (user) {
				return new Promise((resolve, reject) => {
					connectDB()
						.then(() => {
							User.updateOne({ _id: userId }, { $push: { Address: newAddress } })
							// User.updateOne({ _id: userId }, { Address: { ...newAddress, primary: true } })
								// User.findOne({_id:userId})
								.then((data) => {
									console.log(data,"addaddress u-c");
									resolve(true)
								}).catch((error) => {
									console.log(error);
									reject(error)
								})
						})
				})
			}



		} catch (error) {
			console.log(error);
		}

	},


	addUser: async (user, callback) => {
		// console.log(user ,"jj adduser");
		const user1 = {
			Name: user.name,
			Email: user.email,
			Mobile: user.mobile,
			Password: user.password
		};
		user1.Password = await bcrypt.hash(user.password, 10);
		// console.log(user1, "kkk");
		connectDB().then(() => {
			User.create(user1)
				.then(() => {
					callback("DONE");
				})
				.catch(() => {
					callback("FAILED");
				});
		});
	},



	getUserById: (_id) => {
		return new Promise((resolve, reject) => {
			connectDB().then(() => {
				console.log(_id);
				User.findById(_id)
					.then((user) => {
						if (user) {
							// If user found, resolve the promise with the user
							resolve(user);
						} else {
							// If no user found with the given ID, resolve the promise with null
							resolve(null);
						}
					})
					.catch((error) => {
						// Handle the error
						console.log('Failed to retrieve user:', error);
						reject(error);
					});
			});
		});
	},


	updateUser: (userId, userDetails) => {
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findByIdAndUpdate(userId, userDetails, { new: true })
						.then((updatedUser) => {
							if (updatedUser) {
								// If user updated successfully, resolve the promise with the updated user
								resolve(updatedUser);
							} else {
								// If no user found with the given ID, resolve the promise with null
								resolve(null);
							}
						})
						.catch((error) => {
							// Handle the error
							console.log('Failed to update user:', error);
							reject(error);
						});
				})
				.catch((error) => {
					// Handle the error
					console.log('Failed to connect to the database:', error);
					reject(error);
				});
		});
	},

	updateUserBlockedStatus: (userId) => {
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findByIdAndUpdate(userId, { Blocked: true }, { new: true })
						.then((updatedUser) => {
							if (updatedUser) {
								// If user updated successfully, resolve the promise with the updated user
								resolve(updatedUser);
							} else {
								// If no user found with the given ID, resolve the promise with null
								resolve(null);
							}
						})
						.catch((error) => {
							// Handle the error
							console.log('Failed to update user:', error);
							reject(error);
						});
				})
				.catch((error) => {
					// Handle the error
					console.log('Failed to connect to the database:', error);
					reject(error);
				});
		});
	},

	updateUserUnBlockedStatus: (userId) => {
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					User.findByIdAndUpdate(userId, { Blocked: false }, { new: true })
						.then((updatedUser) => {
							if (updatedUser) {
								// If user updated successfully, resolve the promise with the updated user
								resolve(updatedUser);
							} else {
								// If no user found with the given ID, resolve the promise with null
								resolve(null);
							}
						})
						.catch((error) => {
							// Handle the error
							console.log('Failed to update user:', error);
							reject(error);
						});
				})
				.catch((error) => {
					// Handle the error
					console.log('Failed to connect to the database:', error);
					reject(error);
				});
		});
	},



	deleteUserById: (_id) => {
		return new Promise((resolve, reject) => {
			connectDB().then(() => {
				User.findByIdAndDelete(_id)
					.then((deletedUser) => {
						if (deletedUser) {
							// If user deleted successfully, resolve the promise with the deleted user
							resolve(deletedUser);
						} else {
							// If no user found with the given ID, resolve the promise with null
							resolve(null);
						}
					})
					.catch((error) => {
						// Handle the error
						console.log('Failed to delete user:', error);
						reject(error);
					});
			});
		});
	},


	getTotal: (userId) => {
		return new Promise(async (resolve, reject) => {
			try {
				console.log("herere in get total ");
				const total = await Cart.aggregate([
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
					{
						$group: {
							_id: null,
							total: { $sum: { $multiply: ['$quantity', '$product.Price'] } }
						}
					}
				]).exec();

				const cartTotal=await Cart.findOneAndUpdate({user:userId},{$set:{total:total[0]?.total}})

				// console.log(total,"total u-h ");
				resolve(total[0]?.total);
			} catch (error) {
				reject(error);
			}
		}); 
	},

	getSubTotal: (userId) => {
		return new Promise(async (resolve, reject) => {
			try {
				console.log("herere in get Subtotal ");
				const subTotal = await Cart.aggregate([
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
					{
						$project: {
							_id: 1,
							SubTotal: { $sum: { $multiply: ['$quantity', '$product.Price'] } }
						}
					},

				]).exec();
				// console.log(total[0].total);
				resolve(subTotal);
			} catch (error) {
				reject(error);
			}
		});
	},

	//////////////////get admin credentials ///////////////////////


	getAdminByMail: (email) => {
		return new Promise((resolve, reject) => {
			let Email = email.email
			let password = email.password
			console.log(Email, password, "in uh-gtadbyml");
			connectDB().then(() => {
				User.findOne({ Email })
					.then((admin) => {
						console.log("user helper get adbymail", admin);
						if (admin) {
							// Compare the entered password with the hashed password in the database
							bcrypt.compare(password, admin.Password, (err, result) => {
								if (err) {
									// Handle the bcrypt comparison error
									console.log('Password comparison error:', err);
									reject(err);
								}
								if (result) {
									// If passwords match, resolve the promise with the admin
									resolve(admin);
								} else {
									// If passwords don't match, resolve the promise with null
									resolve(null);
								}
							});
						} else {
							// If no admin found with the given email, resolve the promise with null
							resolve(null);
						}
					})
					.catch((error) => {
						// Handle the error
						console.log('Failed to retrieve admin:', error);
						reject(error);
					});
			});
		});
	},


}


module.exports.getUsers = (data) => {
	console.log(data, "at the userhelpergetuser");
	return new Promise((resolve, reject) => {
		connectDB()
			.then(() => {
				User.find({ Email: data.Email })
					.then((user) => {
						if (user) {
							console.log("At get users - password:", data.Password, "&&&&&", "user.Password:", user[0].Password);
							bcrypt.compare(data.Password, user[0].Password)
								.then((isMatch) => {
									if (isMatch) {
										resolve(user);
									} else {
										resolve(null);
									}
								})
								.catch((error) => {
									console.log('Error comparing passwords:', error);
									reject(error);
								});
						} else {
							resolve(null);
						}
					})
					.catch((error) => {
						console.log('Failed to retrieve users:', error);
						reject(error);
					});
			})
			.catch((error) => {
				console.log('Failed to connect to the database:', error);
				reject(error);
			});
	});
};


module.exports.getAllUsers = () => {

	console.log("here in gaU");

	return new Promise((resolve, reject) => {
		connectDB()
			.then(() => {
				User.find({})
					.then((user) => {
						// console.log(user);
						resolve(user);
					}
					)
					.catch((error) => {
						console.log('Failed to retrieve users:', error);
						reject(error);
					});
			})
			.catch((error) => {
				console.log('Failed to connect to the database:', error);
				reject(error);
			});
	});
};


	// removeCartProduct: (details) => {
	// 	return new Promise(async (resolve, reject) => {
	// 		await Cart.updateOne(
	// 			{ _id: (details.cart) },
	// 			{
	// 				$pull: { products: { item: (details.product) } }
	// 			}
	// 		).then((response) => {
	// 			resolve({ removeProduct: true })
	// 		})
	// 			.catch((err) => {
	// 				console.error(err);
	// 				reject(err);
	// 			})
	// 	});
	// },

	
	// addToCart: (proId, userId) => {
	// 	let proObj = {
	// 		item: proId,
	// 		quantity: 1
	// 	}
	// 	return new Promise(async (resolve, reject) => {
	// 		console.log(userId, "addtocart");
	// 		try {
	// 			let userCart = await Cart.findOne({ user: userId });
	// 			if (userCart) {
	// 				console.log(userCart, "usercart");
	// 				try {
	// 					const proExist = userCart.products.some(product => product.item.toString() === proId.toString());
	// 					// console.log(proExist,"proexisst");

	// 					if (proExist) {

	// 						await Cart.updateOne(
	// 							{ user: (userId), 'products.item': proId },
	// 							{
	// 								$inc: { 'products.$.quantity': 1 }
	// 							}
	// 						).then(() => {
	// 							resolve()
	// 						})
	// 							.catch((err) => {
	// 								console.error(err);
	// 							})
	// 					}
	// 					else {
	// 						// console.log("herre");
	// 						await Cart.updateOne(
	// 							{ user: userId },
	// 							{
	// 								$push: { products: proObj }
	// 							}
	// 						)
	// 							.then(() => {
	// 								// console.log("resolved in addtocart");
	// 								resolve()
	// 							})
	// 							.catch((err) => {
	// 								console.error(err);
	// 							})
	// 					}
	// 				} catch (error) {
	// 					console.log("Failed to update cart:", error);
	// 					reject(error);
	// 				}
	// 			}
	// 			else {
	// 				let cartObj = {
	// 					user: userId,
	// 					products: [proObj]
	// 				};
	// 				let newCart = new Cart(cartObj);
	// 				await newCart.save();
	// 				resolve();
	// 			}
	// 		} catch (error) {
	// 			console.log("Failed to add to cart:", error);
	// 			reject(error);
	// 		}
	// 	});
	// },



	// getCartProducts: (userId) => {
	// 	return new Promise(async (resolve, reject) => {
	// 		try {
	// 			const cartItems = await Cart.aggregate([
	// 				{
	// 					$match: { user: mongoose.Types.ObjectId.createFromHexString(userId) }
	// 				},
	// 				{
	// 					$unwind: '$products'
	// 				},
	// 				{
	// 					$project: {
	// 						item: '$products.item',
	// 						quantity: '$products.quantity'
	// 					}
	// 				},
	// 				{
	// 					$lookup: {
	// 						from: 'products',
	// 						localField: 'item',
	// 						foreignField: '_id',
	// 						as: 'product'
	// 					}
	// 				},
	// 				{
	// 					$project: {
	// 						item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
	// 					}
	// 				},
	// 			]).exec();
	// 			console.log(cartItems[0].product, "getcart pro u-h");
	// 			resolve(cartItems);
	// 		} catch (error) {
	// 			reject(error);
	// 		}
	// 	});
	// },
	// changeProductQuantity: (details) => {

	// 	quantity = parseInt(details.quantity)
	// 	count = parseInt(details.count)
	// 	stockCount = parseInt(details.stockcount)
	// 	proId = (details.product)
	// 	console.log(proId, "details");
	// 	return new Promise(async (resolve, reject) => {
	// 		if (count === -1 && quantity === 1) {
	// 			await Cart.updateOne(
	// 				{ _id: (details.cart) },
	// 				{
	// 					$pull: { products: { item: (details.product) } }
	// 				}
	// 			).then((response) => {
	// 				resolve({ removeProduct: true })
	// 			})
	// 		} else {
	// 			await Cart.updateOne(
	// 				{ _id: (details.cart), 'products.item': details.product },
	// 				{
	// 					$inc: { 'products.$.quantity': count }
	// 				}
	// 			)
	// 				// .then(async ()=>{
	// 				// 	await Product.findByIdAndUpdate(proId,{$inc:{Stock:stockCount}})
	// 				// })
	// 				.then((response) => {
	// 					resolve(response)
	// 				})
	// 				.catch((err) => {
	// 					console.error(err);
	// 					reject(err);
	// 				})
	// 		}
	// 	})
	// },




	// resetPassword: async (email, password) => {
	// 	console.log("in reset pass");
	// 	let Password = await bcrypt.hash(password, 10);
	// 	return new Promise((resolve, reject) => {
	// 		connectDB()
	// 			.then(() => {
	// 				console.log(email, password, "dbbbb");
	// 				User.updateOne({ Email: email }, { $set: { Password: Password } })
	// 					.then((data) => {
	// 						console.log(data, "password changed");
	// 						resolve()
	// 					}).catch((error) => {
	// 						console.log("error resetting password :", error);
	// 						reject(error)
	// 					})
	// 			})
	// 	})
	// },

	// createOtp: async (newOtp) => {
	// 	console.log(newOtp, "createOtp");
	// 	connectDB().then(() => {
	// 		Otp.create(newOtp)
	// 			.then((data) => {
	// 				console.log(data);

	// 			})
	// 			.catch((error) => {
	// 				console.log('Failed to create otp:', error);

	// 			});
	// 		// await newOtp.save()
	// 	})
	// },

	// hashData: async (data, saltRounds = 10) => {
	// 	try {
	// 		console.log("hash data");
	// 		const hashedData = await bcrypt.hash(data, saltRounds)
	// 		return hashedData
	// 	} catch (error) {
	// 		throw error
	// 	}
	// },


	// verifyHashedData: async (unhashed, hashed) => {
	// 	try {
	// 		const match = await bcrypt.compare(unhashed, hashed)
	// 		return match
	// 	} catch (error) {
	// 		throw error
	// 	}
	// },


	// generateOtp: async () => {
	// 	try {
	// 		console.log("gen_otp");
	// 		return (otp = `${Math.floor(1000 + Math.random() * 9000)}`)
	// 	} catch (error) {
	// 		throw error
	// 	}
	// },

	// deleteOtp: async (email) => {
	// 	console.log("del_otp");

	// 	connectDB().then(() => {
	// 		Otp.deleteOne({ Email: email })
	// 			.then((data) => {
	// 				console.log(data);

	// 			})
	// 			.catch((error) => {
	// 				console.log('Failed to delete otp ', error);

	// 			});
	// 	})

	// },

	// findOtpRecord: async (email) => {
	// 	try {
	// 		return new Promise((resolve, reject) => {
	// 			connectDB().then(() => {
	// 				Otp.findOne({ Email: email })
	// 					.then((data) => {
	// 						console.log(data, "otp record found ");
	// 						resolve(data)

	// 					})
	// 					.catch((error) => {
	// 						console.log('Failed to create otp:', error);
	// 						reject(error)

	// 					});
	// 				// await newOtp.save()
	// 			})
	// 		})
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// },
	// deleteOtpRecord: async (email) => {
	// 	try {
	// 		return new Promise((resolve, reject) => {
	// 			connectDB().then(() => {
	// 				Otp.deleteOne({ Email: email }).then((data) => {
	// 					console.log("otp record deleted after expiry");
	// 					resolve(data)
	// 				}).catch((error) => {
	// 					console.log("failed to delete otp record");
	// 					reject(error)
	// 				})
	// 			})
	// 		})
	// 	}
	// 	catch (error) {
	// 		throw error
	// 	}
	// },





	// send mail helper
	// sendOtpMail: async (mailOptions) => {
	// 	console.log("send otp mail");

	// 	const { AUTH_EMAIL, AUTH_PASS } = process.env
	// 	console.log(AUTH_EMAIL, AUTH_PASS, "avvaaddaaa");
	// 	// let transporter=nodemailer.createTransport({
	// 	// 	host: 'smtp-mail.outlook.com',
	// 	// port:587,
	// 	// 	secure:false,
	// 	// 	requireTLS:true,
	// 	// 	auth:{
	// 	// 		user:AUTH_EMAIL,
	// 	// 		pass:AUTH_PASS
	// 	// 	},
	// 	// })
	// 	let transporter = nodemailer.createTransport({
	// 		host: 'smtp.gmail.com',
	// 		port: 587,
	// 		secure: false,
	// 		requireTLS: true,
	// 		auth: {
	// 			user: AUTH_EMAIL,
	// 			pass: AUTH_PASS
	// 		}
	// 	});
	// 	// TEST TRANSPORTER
	// 	transporter.verify((error, success) => {
	// 		if (error) {
	// 			console.log(error);
	// 		} else {
	// 			console.log('Ready for messages');
	// 			console.log(success);
	// 		}
	// 	})
	// 	try {
	// 		await transporter.sendMail(mailOptions)
	// 		return;
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// },

	// sendEmail: async(mailOptions)=>{
	// 	try {
	// 		await transporter.sendMail(mailOptions)
	// 		return;
	// 	} catch (error) {

	// 	}
	// },

	
	// cancelOrder: async (orderId) => {
	// 	return new Promise((resolve, reject) => {
	// 		connectDB()
	// 			.then(() => {
	// 				Order.findByIdAndUpdate(orderId, { $set: { status: 'cancelled' } }).then(() => {
	// 					resolve()
	// 				}).catch((error) => {
	// 					console.log(error);
	// 					reject(error)
	// 				})
	// 			})
	// 	})
	// },

	// getOrders: async (userId) => {
	// 	return new Promise((resolve, reject) => {
	// 		console.log("in u-h getOrders");
	// 		connectDB()
	// 			.then(async () => {
	// 				const orders = await Order.find({ userId: userId })
	// 					// Order.findById(orderId)
	// 					.populate('products.product') // Populate the 'product' field within the 'products' array
	// 					.exec()
	// 					.then((data) => {
	// 						console.log(data, "in u-h getorders");
	// 						resolve(data)
	// 					}).catch((error) => {
	// 						console.log(error);
	// 						reject(error)
	// 					})
	// 			})
	// 	})
	// },


	// placeOrder: async (details, products, total, user_Id, userName) => {
	// 	return new Promise(async (resolve, reject) => {
	// 		console.log(details, products, total);
	// 		let status = details['paymentMethod'] === 'COD' ? 'placed' : 'pending'

	// 		const productsWithQuantity = products.map(product => {
	// 			return {
	// 				product: product.item,
	// 				quantity: product.quantity,
	// 			};
	// 		});

	// 		let orderObj = {
	// 			deliveryDetails: {
	// 				firstname: details.firstname,
	// 				lastname: details.lastname,
	// 				state: details.state,
	// 				address1: details.address1,
	// 				address2: details.address2,
	// 				city: details.city,
	// 				pincode: details.pincode,
	// 				mobile: details.mobile,
	// 				email: details.email,
	// 			},
	// 			userName: userName,
	// 			userId: user_Id,
	// 			paymentMethod: details['paymentMethod'],
	// 			products: productsWithQuantity,
	// 			totalAmount: total,
	// 			status: status,
	// 			date: new Date()
	// 		}


	// 		//   const items = Products.products.map((item) => {
	// 		// 	const product = item.product;
	// 		// 	const quantity = item.quantity;
	// 		// 	return {
	// 		// 		proId: product._id,
	// 		// 		quantity: quantity,

	// 		// 	  };
	// 		//   })

			

	// 		connectDB()
	// 			.then(async () => {
	// 				let cartId
	// 				await Order.create(orderObj)
	// 					.then(async (response) => {
	// 						cartId=response._id
	// 						const deleteResult = await Cart.deleteOne({ user: user_Id })
							
	// 						resolve()
	// 					}).then(async (response) => {
	// 						console.log("+++++++++",cartId, "u-hhhhh");
							
	// 						const Products = await Order
	// 							.findOne({ _id: cartId })
	// 							.populate("products.product");

	// 						console.log("+++++++++",Products, "u-hhhhh");

	// 						 Products.products.map(async (item) => {
	// 							console.log(item,"item");
	// 							let stock = item.product.Stock - item.quantity;
	// 							console.log(item.product.Stock, "prostock", item.quantity, "quantity", stock, "stock");
				
	// 							await Product.findByIdAndUpdate(
	// 								item.product._id,
	// 								{
	// 									Stock: stock,
	// 								},
	// 								{ new: true }
	// 							);
	// 						});

	// 					}).catch((error) => {
	// 						console.log(error);
	// 						reject(error)
	// 					})
	// 			})
	// 	})
	// },

	// getCartProductList: async (userId) => {
	// 	return new Promise(async (resolve, reject) => {
	// 		connectDB()
	// 			.then(async () => {
	// 				let cart = await Cart.findOne({ user: userId }).then((data) => {
	// 					console.log(data, "u-h getcartprolist");
	// 					resolve(data.products)
	// 				})




	// 			})


	// 	})
	// },


	// isCartEmpty: async (userId) => {
	// 	console.log(userId, "here is cart empty u-c");
	// 	return new Promise((resolve, reject) => {
	// 		connectDB()
	// 			.then(() => {
	// 				Cart.findOne({ user: userId })
	// 					.then((data) => {
	// 						const productArrayLength = data?.products?.length;
	// 						console.log(data, "cart isempty");
	// 						resolve(productArrayLength)
	// 					}).catch((error) => {
	// 						console.log(error);
	// 						reject(false);
	// 					})
	// 			})
	// 	})

	// },





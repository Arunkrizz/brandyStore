const connectDB = require("../config/connection");
const User = require('../models/user');
const Otp = require('../models/otp')
const nodemailer = require('nodemailer')
const bcrypt = require("bcrypt")


module.exports = { 

    deleteOtp: async (email) => {
		console.log("del_otp");

		connectDB().then(() => {
			Otp.deleteOne({ Email: email })
				.then((data) => {
					console.log(data);

				})
				.catch((error) => {
					console.log('Failed to delete otp ', error);

				});
		})

	},

    generateOtp: async () => {
		try {
			console.log("gen_otp");
			return (otp = `${Math.floor(1000 + Math.random() * 9000)}`)
		} catch (error) {
			throw error
		}
	},

    // send mail helper
	sendOtpMail: async (mailOptions) => {
		console.log("send otp mail");

		const { AUTH_EMAIL, AUTH_PASS } = process.env
		console.log(AUTH_EMAIL, AUTH_PASS, "avvaaddaaa");
		// let transporter=nodemailer.createTransport({
		// 	host: 'smtp-mail.outlook.com',
		// port:587,
		// 	secure:false,
		// 	requireTLS:true,
		// 	auth:{
		// 		user:AUTH_EMAIL,
		// 		pass:AUTH_PASS
		// 	},
		// })
		let transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			requireTLS: true,
			auth: {
				user: AUTH_EMAIL,
				pass: AUTH_PASS
			}
		});
		// TEST TRANSPORTER
		transporter.verify((error, success) => {
			if (error) {
				console.log(error);
			} else {
				console.log('Ready for messages');
				console.log(success);
			}
		})
		try {
			await transporter.sendMail(mailOptions)
			return;
		} catch (error) {
			console.log(error);
		}
	},

    hashData: async (data, saltRounds = 10) => {
		try {
			console.log("hash data");
			const hashedData = await bcrypt.hash(data, saltRounds)
			return hashedData
		} catch (error) {
			throw error
		}
	},


    createOtp: async (newOtp) => {
		console.log(newOtp, "createOtp");
		connectDB().then(() => {
			Otp.create(newOtp)
				.then((data) => {
					console.log(data);

				})
				.catch((error) => {
					console.log('Failed to create otp:', error);

				});
			// await newOtp.save()
		})
	},

    findOtpRecord: async (email) => {
		try {
			return new Promise((resolve, reject) => {
				connectDB().then(() => {
					Otp.findOne({ Email: email })
						.then((data) => {
							console.log(data, "otp record found ");
							resolve(data)

						})
						.catch((error) => {
							console.log('Failed to create otp:', error);
							reject(error)

						});
					// await newOtp.save()
				})
			})
		} catch (error) {
			console.log(error);
		}
	},

    deleteOtpRecord: async (email) => {
		try {
			return new Promise((resolve, reject) => {
				connectDB().then(() => {
					Otp.deleteOne({ Email: email }).then((data) => {
						console.log("otp record deleted after expiry");
						resolve(data)
					}).catch((error) => {
						console.log("failed to delete otp record");
						reject(error)
					})
				})
			})
		}
		catch (error) {
			throw error
		}
	},

    verifyHashedData: async (unhashed, hashed) => {
		try {
			const match = await bcrypt.compare(unhashed, hashed)
			return match
		} catch (error) {
			throw error
		}
	},

    resetPassword: async (email, password) => {
		console.log("in reset pass");
		let Password = await bcrypt.hash(password, 10);
		return new Promise((resolve, reject) => {
			connectDB()
				.then(() => {
					console.log(email, password, "dbbbb");
					User.updateOne({ Email: email }, { $set: { Password: Password } })
						.then((data) => {
							console.log(data, "password changed");
							resolve()
						}).catch((error) => {
							console.log("error resetting password :", error);
							reject(error)
						})
				})
		})
	},


}
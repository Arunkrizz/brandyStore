// const { MongoClient } = require("mongodb")
// const state = { db: null }

// module.exports.connect = callback => {
// 	const uri = "mongodb://127.0.0.1:27017"
// 	const dbname = "Week11"

// 	try {
// 		const client = new MongoClient(uri)
// 		state.db = client.db(dbname)
// 		callback(false)
// 	} catch (e) {
// 		console.log(e)
// 		callback(true)
// 	}
// }

// module.exports.get = () => state.db

// ////////////////////////////////////////////////////////////////////////////////////////////////
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const{MONGO_URL}=process.env

const connectDB = () => {
  return mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("MongoDB connected");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
};

module.exports = connectDB;

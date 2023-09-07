const Category = require('../models/category');
const Product = require('../models/product');
const connectDB = require("../config/connection");
// const mongoose = require('mongoose');

module.exports = {
    addCategoryOffer: async (category, offer) => {
       let Offer=parseFloat(offer)
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Category.findOneAndUpdate({ Category: category }, { $set: { OfferPercentage: Offer } }).then(() => {

                                resolve()
                            

                    })
                })
        })
    },
    categoryCount: async () => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Category.find({ Listed: true }).count().then((data) => {
                        resolve(data)
                    })
                })
        })
    }
}
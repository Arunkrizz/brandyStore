const connectDB = require("../config/connection");
const Order = require('../models/order')

module.exports = {

    getOrderTotal:async(details)=>{
        const orderId=details.orderId.trim()
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.findById(orderId).then((data)=>{
                    resolve(data)
                })
            })
        })
    },

    updatedelivered:async (details)=>{
        const status =details.status;
        const orderId=details.orderId.trim()
        const date = Date.now()
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(()=>{
                Order.findByIdAndUpdate(orderId, { delivered: {status:true ,deliveredDate:date} }).then(()=>{
                    resolve()
                })
            })
        })
    }, 

    allOrders: async () => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.find({}).sort({ date: -1 }).then((data) => {
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
                })
        })
    },

    updateDeliveryStatus: async (details) => {
        const status =details.status;
        const orderId=details.orderId.trim()
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findByIdAndUpdate(orderId, { status: status }).then(() => {
                        resolve({updated:true})
                    }).catch((error) => {
                        reject(error)
                    })
                })
        })

    },


    getOrderDetails: async (orderId) => {

        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findById(orderId)
                        .populate('products.product') // Populate the 'product' field within the 'products' array
                        .populate('userId')
                        .exec()
                        .then((data) => {
                            resolve(data)
                        }).catch((error) => {
                            console.log(error);
                            reject(error)
                        })
                })
        })
    },

}
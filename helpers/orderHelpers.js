const connectDB = require("../config/connection");
const Product = require('../models/product');
const Order = require('../models/order')
const Cart = require('../models/cart');
const Razorpay = require('razorpay');
const Wallet = require('../models/wallet');
const dotenv = require('dotenv').config();
const SECRET = process.env.RAZPAY_SECRET;
const { ObjectId } = require("mongodb");

let instance = new Razorpay({
  key_id: 'rzp_test_dnjs6k85WVuHl7',
  key_secret: SECRET,
});

module.exports = {

  invoiceGetOrder:async (orderId)=>{
    return new Promise ((resolve ,reject)=>{
        connectDB()
        .then(()=>{
            Order.findById(orderId)
            .populate('products.product')
            .then((order)=>{
                resolve (order)
            }).catch((err)=>{
                reject(err)
            })
        })
    })
},

  
findOrder  :(orderId, userId) => {
  try {
    return new Promise((resolve, reject) => {
      Order.aggregate([
        {  
          $match: {
            "_id": new ObjectId(orderId),
            userId: new ObjectId(userId),
          },
        },
        { $unwind: "$products" },
      ]).then((response) => {
        let orders = response
          .filter((element) => {
            if (element._id == orderId) {
              return true;
            }
            return false;
          })
          .map((element) => element.products);

        resolve(orders);
      });
    });
  } catch (error) {
    console.log(error.message);
  }
},

  findOrdersDelivered_populated:()=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB().then(()=>{
          Order.find({status:"delivered"})
          .populate({ path: "userId", model: "users" })
          // .populate({ path: "address", model: "addres" })
          .populate({ path: "products.product", model: "Product" })
      .exec().then((data)=>{
        resolve(data)
        console.log(data,"data")
      })
        })
      })
     
    } catch (error) {
      console.log(error)
    }
  },

  findOrderByDate:(startDate,endDate)=>{
try {
  return new Promise ((resolve ,reject)=>{
    connectDB()
    .then(()=>{
      Order.find({
        // status: "Delivered",
        date: {
          $gte: startDate, 
          $lte: endDate,
        },
      })
        .populate({ path: "userId", model: "users" })
        // .populate({ path: "address", model: "addres" })
        .populate({ path: "products.product", model: "Product" })
        .exec().then((data)=>{
          resolve(data)
        })
    })
  })
} catch (error) {
  console.log(error)
}
  },

  getAllOrders:()=>{
    try {
     return new Promise ((resolve,reject)=>{
      connectDB()
      .then(()=>{
        Order.find({}).then((data)=>{
          resolve(data)
        })
      })
     }) 
    } catch (error) {
      console.log(error)
    }
  },

  findOrdersDelivered:()=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB()
        .then(()=>{
          Order.find({status:"delivered"}).then((data)=>{
            resolve(data)
          })
        })
      })
    } catch (error) {
      console.log(error)
    }
  },

  totalSaleToday:()=>{

    try {
      const currentDate = new Date();
     const yesterday = currentDate;
      yesterday.setDate(yesterday.getDate()-1);
      //  yesterday.setHours(0, 0, 0, 0); 
      // const today = new Date();
      // today.setHours(0, 0, 0, 0);
      // console.log(today,"date")
      return new Promise ((resolve , reject)=>{
        Order.aggregate([
          {
            $match: {
              "delivered.deliveredDate": {
                $gte: yesterday,
                $lte: new Date()
              }
            }
          }
        ]).then((data)=>{
          resolve(data)
        })
      })
    } catch (error) {
      console.log(error)
    }
  },

    latestorders: ()=>{
        try {
            return new Promise ((resolve,reject)=>{
                connectDB()
                .then(()=>{
                    Order.aggregate([
                        {
                          $unwind: "$products", 
                        },
                        {
                          $sort: {
                            "date": -1, 
                          },
                        },
                        {
                          $limit: 10,
                        },
                      ])
                       .then((data)=>{
                        resolve(data)
                      })
                })
            })
            
        } catch (error) {
            console.log(error)
        }
    },

    getCodCount:()=>{
        try {
            return new Promise ((resolve,reject)=>{
                Order.aggregate([
                    
                    {
                      $match: {
                        "paymentMethod": "COD",
                        "status": "delivered", // Use lowercase for status based on the enum values
                      },
                    },
                    {
                      $group: {
                        _id: null,
                        totalPriceSum: { $sum: "$totalAmount" }, // Assuming totalAmount contains the price for each product
                        count: { $sum: 1 },
                      },
                    },
                  ]).then((data)=>{
                    resolve(data)
                  })
            })  
        } catch (error) {
           console.log(error) 
        }
    },

    getOnlineCount:()=>{
        try {
            return new Promise ((resolve,reject)=>{
                connectDB()
                .then(()=>{
                    Order.aggregate([
                    
                        {
                          $match: {
                            "paymentMethod": "ONLINE",
                            "status": "delivered", // Use lowercase for status based on the enum values
                          },
                        },
                        {
                          $group: {
                            _id: null,
                            totalPriceSum: { $sum: "$totalAmount" }, // Assuming totalAmount contains the price for each product
                            count: { $sum: 1 },
                          },
                        },
                      ]).then((data)=>{
                        resolve(data)
                      })
                      
                })
            })  
        } catch (error) {
           console.log(error) 
        }
    },

    salesCount: async () => {
        try {
            return new Promise ((resolve,reject)=>{
                connectDB()
                .then(()=>{
                    Order.aggregate([
                        {
                          $match: {
                            "status": "delivered" // Match orders with "delivered" status
                          }
                        },
                        {
                          $group: {
                            _id: {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: "$date" // Group by the "date" field
                              }
                            },
                            orderCount: { $sum: 1 } // Calculate the count of orders per date
                          }
                        },
                        {
                          $sort: {
                            _id: 1 // Sort the results by date in ascending order
                          }
                        }
                      ])
                      .then ((data)=>{
                        resolve(data)
                      })
                })  
            }) 
        } catch (error) {
          console.log(error)  
        }
    },

    salesData: async () => {
       try {
        return new Promise ((resolve,reject)=>{
            connectDB()
             .then(()=>{
                Order.aggregate([
                    {
                      $match: {
                        status: "delivered", // Match only delivered orders
                      },
                    },
                    {
                      $group: {
                        _id: {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$date", // Group by the date field
                          },
                        },
                        dailySales: {
                          $sum: "$totalAmount", // Calculate the daily sales using totalAmount
                        },
                      },
                    },
                    {
                      $sort: {
                        _id: 1, // Sort the results by date in ascending order
                      },
                    },
                  ])
                  .then((data)=>{
                    resolve(data)
                  })
             })
        })
       } catch (error) {
        console.log(error)
       } 
    },

    categorySales: async () => {
        try {
            return new Promise ((resolve,reject)=>{
                connectDB()
                .then(()=>{
                    Order.aggregate([
                        {
                          $unwind: "$products"
                        },
                        {
                          $lookup: {
                            from: "products",
                            localField: "products.product",
                            foreignField: "_id",
                            as: "productDetails"
                          }
                        },
                        {
                          $unwind: "$productDetails"
                        },
                        {
                          $match: {
                            "status": "delivered"
                          }
                        },
                        {
                          $lookup: {
                            from: "categories",
                            localField: "productDetails.CategoryId",
                            foreignField: "_id",
                            as: "categoryDetails"
                          }
                        },
                        {
                          $unwind: "$categoryDetails"
                        },
                        {
                          $project: {
                            CategoryId: "$productDetails.CategoryId",
                            categoryName: "$categoryDetails.Category",
                            totalPrice: {
                              $multiply: [
                                { $toDouble: "$productDetails.Price" },
                                "$products.quantity"
                              ]
                            }
                          }
                        },
                        {
                          $group: {
                            _id: "$CategoryId",
                            categoryName: { $first: "$categoryName" },
                            PriceSum: { $sum: "$totalPrice" }
                          }
                        },
                        {
                          $project: {
                            categoryName: 1,
                            PriceSum: 1,
                            _id: 0
                          }
                        }
                      ])
                      .then((data)=>{
                        resolve(data)
                      })
                })
            })
        } catch (error) {
            console.log(error)
        }
    },


    getOrdertotal: async () => {
        try {
            return new Promise ((resolve,reject)=>{
                connectDB()
                .then(()=>{
                    Order.aggregate([
                       
                        {
                          $match: {
                            "status": "delivered"  // Consider only completed orders
                          }
                        },
                        {
                          $group: {
                            _id: null,
                            totalPriceSum: { $sum:  "$totalAmount" },
                            count: { $sum: 1 }
                          }
                        }
                  
                      ]).then((data)=>{
                        resolve(data)
                      })
                })
            })
        } catch (error) {
           console.log(error) 
        }
    },

    returnOrder: async (orderId) => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findByIdAndUpdate(orderId, { $set: { status: 'return requested' } }).then((data) => {
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
                })
        })
    },

    updateStockQuantity:async(orderId)=>{
        console.log("here in up stck qty");
        connectDB().then(()=>{
            Order.findById(orderId)
            .then((order) => {
              if (!order) {
                console.log('Order not found');
                return;
              }
          
              // Increment product stocks based on the order's products
              order.products.forEach((orderProduct) => {
                console.log("here in up stck qty2222");
                Product.findByIdAndUpdate(orderProduct.product, {
                  $inc: { Stock: orderProduct.quantity }
                })
                  .then((data) => {
                    console.log(`Stock incremented for product ${orderProduct.product}`);
                  })
                  .catch((error) => {
                    console.error(`Error incrementing stock for product ${orderProduct.product}:`, error);
                  });
              });
            })
            .catch((error) => {
              console.error('Error retrieving order:', error);
            });
        })
      
    },

    countDocuments:async ()=>{
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(async()=>{
                await Order.countDocuments().then((data)=>[
                    resolve(data)
                ])
            })
        })
    },

    updateCartTotal:async (userId,couponAmount)=>{
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(async ()=>{
               await Cart.findOne({user:userId}).then(async (data)=>{
                let total =data.total
                const couponDiscount=couponAmount
                const newTotal=total-couponDiscount
                await Cart.findOneAndUpdate({user:userId},{$set:{total:newTotal}})
                resolve()
               })
            })
        })
    }
    ,

    getOrder:async (orderId)=>{
        return new Promise ((resolve ,reject)=>{
            connectDB()
            .then(()=>{
                Order.findById(orderId)
                .then((order)=>{
                    resolve (order)
                }).catch((err)=>{
                    reject(err)
                })
            })
        })
    },

    changePaymentStatus:async(orderId)=>{
        console.log(orderId,"chngPyStat");
        return new Promise ((resolve,reject)=>{
           connectDB()
           .then (()=>{
            Order.findByIdAndUpdate(orderId,
                {
                    $set:{
                        status:'placed'
                    }
                }
                ).then((data)=>{
                    console.log(data);
                    resolve()
                }).catch((err)=>{
                    console.log(err);
                    reject(err)
                })
           }) 
        })
    },

    verifyPayment:async(details)=>{
        console.log(details,'chkkkkkkk details');
        console.log("veri pay o-h ");
        return new Promise (async (resolve,reject)=>{
            const secret =SECRET
            const crypto =require('crypto')
            let hmac = await crypto.createHmac('sha256', secret)
            hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]'])
           hmac= hmac.digest('hex')
           console.log(hmac,'chkkkkkkk hmac');
            if(hmac==details['payment[razorpay_signature]']){
                console.log("veri pay o-h resolved");
                resolve()
            }else{
                console.log("veri pay o-h rejected");
                reject()
            }
        })                    
    },

    generateRazorpay:async (orderId,total)=>{
        console.log("in o-h genraz pay ");
        if(total===0){
            total=1
        }
        return new Promise ((resolve,reject)=>{
            instance.orders.create({
                amount: total*100 ,
                currency: "INR",
                receipt: ""+orderId,
                notes: {
                  key1: "value3",
                  key2: "value2"
                }
              }).then((order)=>{
                console.log(order,"order in razorpay");
                resolve(order)
              }).catch ((error)=>{
                console.log(error);
                reject(error)
              })
        })
    },

    cancelOrder: async (orderId) => {
        return new Promise((resolve, reject) => {
            connectDB()
                .then(() => {
                    Order.findByIdAndUpdate(orderId, { $set: { status: 'cancelled' } }).then((data) => {
                        resolve(data)
                    }).catch((error) => {
                        console.log(error);
                        reject(error)
                    })
                })
        })
    },

    getOrders: async (userId,page) => {
        const ITEMS_PER_PAGE = 5;
        return new Promise((resolve, reject) => {
            console.log("in u-h getOrders");
            connectDB()
                .then(async () => {
                    const orders = await Order.find({ userId: userId }).sort({ date: -1 }) .skip((page - 1) * ITEMS_PER_PAGE)
                    .limit(ITEMS_PER_PAGE)
                        // Order.findById(orderId)
                        .populate('products.product') // Populate the 'product' field within the 'products' array
                        .exec()
                        .then((data) => {
                            console.log(data, "in u-h getorders");
                            resolve(data)
                        }).catch((error) => {
                            console.log(error);
                            reject(error)
                        })
                })
        })
    },

    getCartProductList: async (userId) => {
        return new Promise(async (resolve, reject) => {
            connectDB()
                .then(async () => {
                    let cart = await Cart.findOne({ user: userId }).then((data) => {
                        console.log(data, "u-h getcartprolist");
                        resolve(data?.products)
                    })




                })


        })
    },

    placeOrder: async (details,data, products, total, user_Id, userName,couponDiscount) => {
       try {
        return new Promise(async (resolve, reject) => {
            console.log(details, products, total);
            let status = data['paymentMethod'] === 'COD' ? 'placed' : 'pending'

            const productsWithQuantity = products?.map(product => {
                return {
                    product: product.item,
                    quantity: product.quantity,
                    price:product.price
                };
            }); 

            let orderObj = {
                deliveryDetails: {
                    firstname: details.firstname,
                    lastname: details.lastname,
                    state: details.state,
                    address1: details.address1,
                    address2: details.address2,
                    city: details.city,
                    pincode: details.pincode,
                    mobile: details.mobile,
                    email: details.email,
                },
                userName: userName,
                userId: user_Id,
                paymentMethod:data['paymentMethod'],
                products: productsWithQuantity,
                couponDiscountUsed:couponDiscount,
                totalAmount: total,
                status: status,
                date: new Date()
            }
    
            connectDB()
                .then(async () => {
                    let cartId
                    await Order.create(orderObj)
                        .then(async (response) => {
                            cartId = response._id
                            const deleteResult = await Cart.deleteOne({ user: user_Id })

                            resolve(cartId)
                        }).then( async (response) => {
                            console.log("+++++++++", cartId, "o-h cartid");

                            const Products = await Order
                                .findOne({ _id: cartId })
                                .populate("products.product")

                            console.log("+++++++++", Products, "o-h product");

                            Products.products.map(async (item) => {
                                console.log(item, "item");
                                let stock = item.product.Stock - item.quantity;
                                console.log(item.product.Stock, "prostock", item.quantity, "quantity", stock, "stock");

                                await Product.findByIdAndUpdate(
                                    item.product._id,
                                    {
                                        Stock: stock,
                                    },
                                    { new: true }
                                );

                                
                            });

                           
                            if(data.walletUsed=='true'){
                                
                                await Wallet.findOne({userId:user_Id}).then(async (details)=>{
                                    
                                    let balance= details.balance
                                   let  balanceUsed=details.balance
                                    if(total>balance){
                                        balance=0
                                    }else if(total<balance){
                                        balance=balance-total
                                        balanceUsed=total-1
                                    }
                                    let updated=  await Wallet.findOneAndUpdate({userId:user_Id},
                                        {$set:{balance:balance},
                                         $push: {
                                            transaction: {
                                              orderUsed: cartId,
                                              balanceUsed: balanceUsed 
                                            }
                                          }}, 
                                )
                                    
                                })
 
                          
                           
                            }

                        }).catch((error) => {
                            console.log(error);
                            reject(error)
                        })
                })
        })
       } catch (error) {
        console.log(error);
       }
    },







}
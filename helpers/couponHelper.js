const Coupon = require("../models/coupon")
const connectDB = require("../config/connection");
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports={

    applyCoupon :async  (couponCode, total) => {
        try {
            return new Promise((resolve, reject) => {
            Coupon.findOne({ couponCode: couponCode }).then(
              (couponExist) => {
                if (couponExist) {
                  if (new Date(couponExist.validity) - new Date() > 0) {
                    if (total >= couponExist.minPurchase) {
                      let discountAmount =
                        (total * couponExist.minDiscountPercentage) / 100;
                      if (discountAmount > couponExist.maxDiscountValue) {
                        discountAmount = couponExist.maxDiscountValue;
                        resolve({
                          status: true,
                          discountAmount: discountAmount,
                          discount: couponExist.minDiscountPercentage,
                          couponCode: couponCode,
                        });
                      } else {
                        resolve({
                          status: true,
                          discountAmount: discountAmount,
                          discount: couponExist.minDiscountPercentage,
                          couponCode: couponCode,
                        });
                      }
                    } else {
                      resolve({
                        status: false,
                        message: `Minimum purchase amount is ${couponExist.minPurchase}`,
                      });
                    }
                  } else {
                    resolve({
                      status: false,
                      message: "Coupon expired",
                    });
                  }
                } else {
                  resolve({
                    status: false,
                    message: "Coupon doesn't Exist",
                  });
                }
              }
            );
          })
        } catch (error) {
            console.log(error.message)
        }
      },

    verifyCoupon: async (userId, couponCode)=>{
        try {
            return new Promise(async(resolve, reject) => {
              const couponExist = await Coupon.findOne({ couponCode: couponCode })
                  // console.log("code:",couponExist.length);
                if (couponExist) {
                  console.log(couponExist);
                  if (new Date(couponExist.validity) - new Date() > 0) {
                    const usersCoupon = await User.findOne({
                      _id: userId,
                      coupons: { $in: [couponCode] },
                    });
                    // console.log(usersCoupon,"couponExist");
    
                    if (usersCoupon) {
                      resolve({
                        status: false,
                        message: "Coupon already used by the user",
                      });
                    } else {
                      resolve({
                        status: true,
                        message: "Coupon added successfully",
                      });
                    }
                  } else {
                    resolve({ status: false, message: "Coupon have expired" });
                  }
                } else {
                  resolve({ status: false, message: "Coupon doesn't exist" });
                } 
          });
        } catch (error) {
          console.log(error.message)
          reject(error)
        }
    },

    isCouponUsed: async (code,userId)=>{
        return new Promise ((resolve ,reject )=>{
            connectDB()
            .then(async ()=>{
               
Coupon.findOne({code:code},{ 'users.userId': userId })
.then(async coupon => {
    if (coupon.users.length) {
        console.log('Coupon with matching userId found:', coupon);
        resolve({isUsed:true})
        // You can access the userId and other coupon properties here
    } else {
        console.log('No coupon found with matching userId. Adding userId to users array...');

        await  Coupon.findOneAndUpdate({code:code},
            { $addToSet: { users: { userId: userId } } }, 
            { new: true }).then((response)=>{
                const couponAmount=response.couponAmount
                // console.log(couponAmount,"is coup used");
                resolve({isUsed:false,couponAmount:couponAmount})
            })
            
    }
})
.catch(err => {
    console.error('Error:', err);
});
            }) 
        })
    },

    fetchCoupon: async (code)=>{
        console.log(code,"ERror");
        return new Promise ((resolve ,reject )=>{
            connectDB()
            .then(async ()=>{
                await Coupon.find({code:code}).then((data)=>{
                    resolve(data)
                }).catch((error)=>{
                    console.log(error,"ERror");
                    reject(error)
                })
            })
        })
    },

    deleteCoupon: async (id)=>{
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(async ()=>{
                await Coupon.deleteOne({ _id: id })
            //    await Coupon.findByIdAndUpdate(id,{delete:true})
               .then(()=>{
                    resolve({status: true})
                }).catch((error)=>{
                    console.log(error,"ERror");
                })
            })
        })
    },

    editCoupon: async (data,couponId)=>{
        try {
            return new Promise ((resolve , reject )=>{
                connectDB()
                .then(async ()=>{
                   
                    console.log(data,couponId,"edit coupon")
                    const updatedProduct = await Coupon.findByIdAndUpdate(couponId, data).then((data)=>{
                        
                    })
                    resolve({status:true})
                })
            })
        } catch (error) {
            console.log(error)
        }
 
    },

    findCoupon : async (id)=>{
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then( async ()=>{
            const coupon=  await  Coupon.findById(id).then ((data )=>{
                resolve (data)
            })
             
            })
        })
    },

    getCouponList:async ()=>{
        return new Promise ((resolve,reject)=>{
            connectDB()
            .then(async()=>{
                await Coupon.find({}).then((data)=>{
                    resolve(data)
                })
            })
        })
    },

    addcoupons: async(data)=>{
        return new Promise ((resolve ,reject )=>{
            connectDB()
            .then(async()=>{
                try {
                   
                        Coupon.findOne({ couponCode: data.couponCode })
                            .then((coupon) => {
                                if (coupon) {
                                resolve({status: false})
                                } else {
                                    new Coupon(data).save()
                                        .then((response) => {
                                        resolve({status:true})
                                    })
                                }
                            })
                   
                    
                
                  } catch (error) {
                    console.log(error.message)
                  }
            })
        })
    },
}

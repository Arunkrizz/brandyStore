const mongoose = require('mongoose');
const connectDB = require("../config/connection");
const Wallet = require('../models/wallet');

module.exports ={

  getWalletBalance:async (userId)=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB()
        .then(()=>{
          Wallet.find({userId:userId}).then((data)=>{
            console.log(data,"wall amt");
            resolve(data[0].balance)
          })
        })
      })
    } catch (error) {
      console.log(error)
    }
  },

  getWallet:async (userId )=>{
    try {
      return new Promise ((resolve , reject )=>{
        connectDB()
        .then(async ()=>{
          await Wallet.findbyId(userId).then((data)=>{
            resolve(data)
          })
        })
      })
    } catch (error) {
      
    }
  },

  updateWallet: async (data,userId)=>{
    let balance = parseInt(data.walletBalance)
   return new Promise ((resolve , reject )=>{
    connectDB()
    .then(async ()=>{
      await Wallet.findByIdAndUpdate({userId:userId},{$set:{balance:balance}})
      resolve(true) 
    })
   })

  },

  reduceWalletBalance: async (userId,orderTotal)=>{
    try {
      let wallet=await  Wallet.findOne({ userId: userId })
      let balance =wallet.balance
      if(orderTotal>balance){
        balance = 0
      }else if(orderTotal<balance){
        balance = (wallet.balance)-orderTotal
      }
      await Wallet.findOneAndUpdate({ userId: userId },
        {
            $set:{
                balance:balance
            }
        })
    } catch (error) {
      console.log(error);
    }
  },

  getWallet:async (userId)=>{
    try {
      return new Promise ((resolve,reject)=>{
        connectDB()
        .then(async ()=>{
          let wallet= await  Wallet.findOne({ userId: userId })
          if (!wallet) {
            wallet = new Wallet({
                userId: userId,
                balance: 0
            });
            await wallet.save();
        }else{
          resolve(wallet)
        }
        })
      })
    } catch (error) {
      
    }
  },

    updateWalletAmount:async (total,userId)=>{
      try {
        return new Promise (async (resolve, reject)=>{
            connectDB()
            .then (async ()=>{
             let wallet= await  Wallet.findOne({ userId: userId })
              if (!wallet) {
                wallet = new Wallet({
                    userId: userId,
                    balance: total
                });
                await wallet.save();
            }else{
                let  updatedAmount=wallet.balance+total
                console.log(wallet.balance,total,updatedAmount,"walleet")
               await Wallet.findOneAndUpdate({ userId: userId },
                    {
                        $set:{
                            balance:updatedAmount
                        }
                    })
            }
            console.log("Wallet amount updated successfully.");
               resolve()    
               
                
            }).catch((err)=>{
                console.log(err);
                reject(err)
            })
        })
      } catch (error) {
        console.log(error);
      }
    },
}
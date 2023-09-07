const mongoose = require('mongoose');
// const collection=require('../config/collections')
const USER_COLLECTION = "users"


const loginSchema= new mongoose.Schema({
    Name:{
     type:String,
    required:true 
 },
 Email:{
  type:String,
  required:true, 
  
},
Mobile:{
  type:Number,
  required:true
},

 Password:{
     type:String,
     required:true
 },
 Admin:{
   type:Boolean,
   default:false
 },
 Blocked:{
  type:Boolean,
  default:false
},
coupons: {
    type: Array
},
Address:[ {
  // Define the address properties directly here
  
  _id: mongoose.Schema.Types.ObjectId,

  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  primary:{
    type:Boolean,
    default:false
  },
}],
 
 })
  
  const User = mongoose.model(USER_COLLECTION,loginSchema);
  
  module.exports = User;
  
const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({
  deliveryDetails: {
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
    address2: String,
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  userName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users', // Assuming you have a User model defined
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // You can set a default quantity if needed
    },
    price:{
      type:Number
    }
  }],
  couponDiscountUsed:{
    type: Number,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['placed','pending', 'shipped', 'delivered','cancelled','return requested','returned'],
    default: 'pending',
  },
  date: {
    type: Date, 
    default: Date.now, 
  },
  delivered: {
    status: {
      type: Boolean,
      default: false
    },
    deliveredDate:{
      type:Date
    }
  },
  // Add more properties as needed
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

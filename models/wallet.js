const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transaction:[{
    orderUsed:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', 
      required: true
    },
    balanceUsed:{
      type: Number,
     default :0
    }, 
    date: {
      type: Date, 
      default: Date.now, 
    },
  }]
 

});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;

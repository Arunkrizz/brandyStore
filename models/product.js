const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: true
  },
  Price: {
    type: Number,
    required: true,
  },
  OfferPrice: {
    type: Number,
    default:0
  },
  RealPrice:{
    type: Number,
    // default:0
  },
  Description: {
    type: [String], // Array of strings
    default: [], // Default value as an empty array
  },
  // Image: {
  //   data: Buffer,
  //   contentType: {
  //     type: String,
  //     default: 'image/jpeg',
  //   },
  Images: [{
    data: Buffer,
    contentType: {
      type: String,
      default: 'image/jpeg',
    }
  }],
  Stock: {
    type: Number,
    default: 0, // Default stock value is 0
  },
  Deleted:{
    type:Boolean,
    default:false
  },
  
  

  // Add more properties as needed
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

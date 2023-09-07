
const connectDB = require("../config/connection");
const Product = require('../models/product');
const Category = require('../models/category');
const Cart = require('../models/cart');
// const collection=require('../config/collections');

module.exports = {

 

  addOffer:async(category,offer)=>{
    return new Promise ((resolve,reject)=>{
      connectDB()
      .then(()=>{
        Product.updateMany(
          { Category: category },
          [
            {
              $set: {
                Price: {
                  $subtract: [
                    "$RealPrice",
                    {
                      $multiply: ["$RealPrice", { $divide: [offer, 100] }],
                    },
                  ],
                },
              },
            },
          ],
          { upsert: true }
        ) .then(resolve())
      })
    })
  },

  findCategory:(cName)=>{
return new Promise ((resolve ,reject)=>{
  connectDB()
  .then(()=>{
    Category.find(cName).then((data)=>{
      console.log(data, 'find cat')
      resolve(data)
    }).catch((err)=>{
      reject(err)
      console.log(err)
    })
  })
})
  },

  productsCount:()=>{
    return new Promise ((resolve , reject )=>{
      connectDB()
      .then(()=>{
        Product.find({}).count().then ((data)=>{
          resolve(data)
        })
      })
    })
  },

  checkStock:(userId)=>{
    return new Promise ((resolve ,reject )=>{
      connectDB()
      .then(async ()=>{
        const products = await Cart.findOne({user:userId})
        const cartProducts = products.products
        for(const cartProduct of cartProducts ){
          const productId = cartProduct.item;
          const product = await Product.findOne({_id:productId})
          if(product.Stock < cartProduct.quantity ){
            resolve({status:false}) 
          }
        }
        resolve({status:true})
      }).catch((error)=>{
        console.log(error);
      })
    })
  },

  filteredProducts: (details) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(async () => {

          let minPrice=0 // Minimum price for the range
          let maxPrice=20000000 // Maximum price for the range
          let sort=1

          console.log(details.categoryValue,"caatval");

          if(details.sortByValue==='sortByHigh'){
            sort=-1
          }

        
         

          let match = {}
          if (details.categoryValue) {
            match.Category = details.categoryValue
          }else {
            match.Deleted =false
          }

          if(details.searchData){
            match.$or =[{Name:new RegExp(details.searchData,"i")},{Description:new RegExp(details.searchData,"i")},{Category:new RegExp(details.searchData,"i")}]
           
          }

          if (details.priceRangeValue) {
            const inputString = details.priceRangeValue;
            const pattern = /minPrice:(\d+),maxPrice:(\d+)/;

            const match = inputString.match(pattern);


            if (match) {
              minPrice = parseInt(match[1]);
              maxPrice = parseInt(match[2]);
             
              
            }
          }



          await Product.aggregate([
            {
              $match: {
                Price: { $gte: minPrice, $lte: maxPrice },
                
              }
            },
            {
              $match: match
             },
            {
              $sort: { Price: sort } // Sort by price in descending order
            }
          ]).then((data) => {
            console.log(data,"data filtered")
            resolve(data)
          })

        })
    })
  },

  changeProductCategoryName: (prevName, newName) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.updateMany({ Category: prevName }, { $set: { Category: newName } })
            .then(() => {
              console.log("product category updated");
              resolve()
            })
            .catch((error) => {
              console.log("error in product category updation :", error);
              reject(error)
            })
        })
    })
  },




  changeCategoryName: (prevName, newName) => {
    return new Promise((resolve, reject) => {
      connectDB().
        then(() => {
          Category.updateOne({ Category: prevName }, { $set: { Category: newName } })
            .then(() => {
              console.log("category edit succeeded");
              resolve()
            })
            .catch((error) => {
              console.log("category edit failed:", error);
              reject(error)
            })
        })
    })
  },

  UndeleteCategoryProducts: (catName) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.updateMany(catName, { $set: { Deleted: false } }
          )
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },



  deleteCategoryProducts: (catName) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.updateMany(catName, { $set: { Deleted: true } }
          )
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },



  categoryRelist: (catId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Category.findByIdAndUpdate(catId, { Listed: true }, { new: true })
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },


  categoryUnlist: (catId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Category.findByIdAndUpdate(catId, { Listed: false }, { new: true })
            .then((updatedList) => {
              if (updatedList) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedList);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },



  getcategoryById: (_id) => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Category.findById(_id)
          .then((category) => {
            if (category) {
              // If product found, resolve the promise with the product
              resolve(category);
            } else {
              // If no product found with the given ID, resolve the promise with null
              resolve(null);
            }
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to retrieve category:', error);
            reject(error);
          });
      });
    });
  },

  addCategory: (cName) => {
    console.log(cName, "//here p-c addcategory");
    return new Promise((resolve, reject) => {

      connectDB().then(() => {
        Category.create(cName)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getAllListedCategory: () => {
    return new Promise((resolve, reject) => {
      console.log("// p-c get all category ");
      connectDB().then(() => {
        Category.find({ Listed: true })
          .then((category) => {
            resolve(category);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getAllCategory: () => {
    return new Promise((resolve, reject) => {
      console.log("// p-c get all category ");
      connectDB().then(() => {
        Category.find()
          .then((category) => {
            resolve(category);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  addProduct: (product, callback) => {
    console.log(product);
    connectDB().then(async () => {

      let newProduct = {
        Name: product.Name,
        Category: product.Category.split(',')[0],
        CategoryId: product.Category.split(',')[1],
        Price: product.Price,
        RealPrice:product.Price,
        Description: product.Description
      }

      Product.create(newProduct)
        .then((data) => {
          console.log(data);
          callback(data._id);
        })
        .catch((error) => {
          console.log('Failed to add product:', error);
          callback(false);
        });
    });
  },

  // getAllProducts: (callback) => {
  //   connectDB().then(() => {
  //     Product.find({ Deleted: false })
  //       .then((products) => {
  //         callback(products);
  //       })
  //       .catch((error) => {
  //         console.log('Failed to get products:', error);
  //         callback(null);
  //       });
  //   });
  // },
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.find({ Deleted: false })
            .then((products) => {
              resolve(products);
            })
            .catch((error) => {
              console.log('Failed to get products:', error);
              reject(error);
            });
        })
        .catch((error) => {
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },




  // Query products with category "Electronics"
  getNecklace_Products: () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'Necklace', Deleted: false })
          .then((eproducts) => {
            resolve(eproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  // Query products with category "Clothes"
  getBangles_Products: () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'Bangles', Deleted: false })
          .then((clothproducts) => {
            resolve(clothproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  // Query products with category "Jewellery"
  getEarRings_Products: () => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: 'EarRings', Deleted: false })
          .then((EarRingsproducts) => {
            resolve(EarRingsproducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  getCategory: (cName) => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.find({ Category: cName })
          .then((cProducts) => {
            resolve(cProducts);
          })
          .catch((error) => {
            console.log('Failed to get products:', error);
            reject(error);
          });
      });
    });
  },

  // Function to find a single product by ID
  getProductById: (_id) => {
    return new Promise((resolve, reject) => {
      connectDB().then(() => {
        Product.findById(_id)
          .then((product) => {
            if (product) {
              // If product found, resolve the promise with the product
              resolve(product);
            } else {
              // If no product found with the given ID, resolve the promise with null
              resolve(null);
            }
          })
          .catch((error) => {
            // Handle the error
            console.log('Failed to retrieve product:', error);
            reject(error);
          });
      });
    });
  },

  updateProduct: (proId, proDetails,deletedImages) => {
    return new Promise((resolve, reject) => {
      proDetails.RealPrice=proDetails.Price;
      connectDB()
        .then(() => {
          // console.log(proDetails,"p-h upd pro");
          Product.findByIdAndUpdate(proId, proDetails, { new: true })
            .then((updatedProduct) => {
              if (updatedProduct) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedProduct);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },

  softDeleteProduct: (proId) => {
    return new Promise((resolve, reject) => {
      connectDB()
        .then(() => {
          Product.findByIdAndUpdate(proId, { Deleted: true }, { new: true })
            .then((updatedProduct) => {
              if (updatedProduct) {
                // If product updated successfully, resolve the promise with the updated product
                resolve(updatedProduct);
              } else {
                // If no product found with the given ID, resolve the promise with null
                resolve(null);
              }
            })
            .catch((error) => {
              // Handle the error
              console.log('Failed to update product:', error);
              reject(error);
            });
        })
        .catch((error) => {
          // Handle the error
          console.log('Failed to connect to the database:', error);
          reject(error);
        });
    });
  },






  // deleteProductById: (_id) => {
  //   return new Promise((resolve, reject) => {
  //     connectDB().then(() => {
  //       Product.findByIdAndDelete(_id)
  //         .then((deletedProduct) => {
  //           if (deletedProduct) {
  //             // If product deleted successfully, resolve the promise with the deleted product
  //             resolve(deletedProduct);
  //           } else {
  //             // If no product found with the given ID, resolve the promise with null
  //             resolve(null);
  //           }
  //         })
  //         .catch((error) => {
  //           // Handle the error
  //           console.log('Failed to delete product:', error);
  //           reject(error);
  //         });
  //     });
  //   });
  // },





};


const userHelper = require("../helpers/userHelpers")
const cartHelper = require("../helpers/cartHelpers")


const addToCart=async (req,res)=>{
    try {
       await cartHelper.addToCart(req.params.id,req.session.user._id)
       .then((response) => {
        console.log(response ,"addtocart response");
        res.send(response)
    })
      // res.redirect('/cart')
    } catch (error) {
      console.log(error);
    }
  }
  // ////////////////////////////////////////////////////////////////////////////////////////////

  
const getCart=async (req,res)=>{
  
  try {
    let cartIsEmpty= await cartHelper.isCartEmpty(req.session.user._id)

    console.log(cartIsEmpty,"ingetCart");
    if(cartIsEmpty){

  // if(req.session.user){
    const promises = [
        cartHelper.getCartProducts(req.session.user._id),
      userHelper.getTotal(req.session.user._id),
      userHelper.getSubTotal(req.session.user._id)
    ];
    
    Promise.all(promises)
    .then(([products,total,subTotal]) => {
      // console.log(data,"/cart products");
      // res.render('cart',{products,total,subTotal})
      res.render('cart', {products,total,subTotal});
      // res.render('home', {products,category });
    })
    .catch((error) => {
      console.log('Failed to get cart:', error);
      // Handle error
    })

    
    }

    else {
      res.render('cartisEmpty')
    }
    
  }
  catch (error) {
    console.log(error);
  }
} 
  // ////////////////////////////////////////////////////////////////////////////////////////////
 
  const changeQuantity=async (req,res,next)=>{
  
    try {
      // console.log(req.body,"chngeqty");
     await cartHelper.changeProductQuantity(req.body).then((response)=>{
        // console.log(response,"chngeqty2");
        res.json(response)
      })
    }
    catch (error) {
      console.log(error);
    }
  }

  // ////////////////////////////////////////////////////////////////////////////////////////////
  
  
  const getTotalAmount=async (req,res,next)=>{
  
    try {
      console.log("herer in u-c gt tot amt");
      await userHelper.getTotal(req.session.user._id)
    }
    catch (error) {
      console.log(error);
    }
  }
  
  // ////////////////////////////////////////////////////////////////////////////////////////////
 
  const  removeCartProduct=async (req,res,next)=>{
  
    try {
      // console.log(req.body,"removecart product");
     await cartHelper.removeCartProduct(req.body).then((response)=>{
       
        res.json(response)
      })
    }
    catch (error) {
      console.log(error);
    }
  }
  
  module.exports={
    addToCart,
    getCart,
    changeQuantity,
    getTotalAmount,
    removeCartProduct,

  }
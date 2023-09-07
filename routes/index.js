const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const cartController = require('../controllers/cartController');
const categoryController = require('../controllers/categoryController');
const orderController = require('../controllers/orderController');
const otpController = require('../controllers/otpController');
const productController = require('../controllers/productController');
const couponController = require('../controllers/couponController');
const walletController = require('../controllers/walletController');
const auth=require ('../middleware/auth')
 

////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/',userController.landingPage)
// router.get('/',(req,res)=>{res.render('productDetailsPage')})
router.post('/verify',userController.verify)
router.post('/verifys',userController.verifys)
router.post("/signup",userController.signup)
router.get('/login',auth.isLogin,userController.login)
router.post('/login',userController.getuserlogin)   
router.get('/logout',userController.logout)
router.get('/home',auth.isLogout,auth.isBlocked,userController.home)
router.get('/profile',auth.isLogout,auth.isBlocked,userController.getProfile)
router.post('/changeAddress',auth.isLogout,auth.isBlocked,userController.changeAddress)
router.get('/changePassword',auth.isLogout,auth.isBlocked,userController.changePasswordPage) 
router.post('/changePassword',auth.isLogout,auth.isBlocked,userController.changePassword)
router.post('/filter',auth.isLogout,auth.isBlocked,userController.filter)
router.get('/wallet',auth.isLogout,auth.isBlocked,userController.walletPage)

router.get('/productdetails/:id',auth.isLogout,auth.isBlocked,productController.getProductDetails)
router.get('/getCategoryProduct',auth.isLogout,auth.isBlocked,productController.getCategoryProduct) 
router.get('/getCategoryProducts',auth.isLogout,auth.isBlocked,productController.getCategoryProducts) 

router.post('/addTocart/:id',auth.isLogout,auth.isBlocked,cartController.addToCart)
router.get('/cart',auth.isLogout,auth.isBlocked,cartController.getCart)
router.post('/changeProductQuantity',auth.isLogout,auth.isBlocked,cartController.changeQuantity)
router.post('/removeCartProduct',auth.isLogout,auth.isBlocked,cartController.removeCartProduct)
router.get('/applyCoupon',auth.isLogout,auth.isBlocked,couponController.applyCoupon)
router.get('/verifyCoupon/:id',auth.isLogout,auth.isBlocked,couponController.verifyCoupon)
 
router.get('/placeorder',auth.isLogout,auth.isBlocked,orderController.placeOrder)
router.get('/orderSuccess',orderController.orderSuccess)
router.get('/orders',auth.isLogout,auth.isBlocked,orderController.orderPage)
router.get('/cancelOrder',auth.isLogout,auth.isBlocked,orderController.cancelOrder)
router.post('/checkout',auth.isLogout,auth.isBlocked,orderController.checkOut)
router.get('/checkoutaddAddress',auth.isLogout,auth.isBlocked,userController.checkoutaddAddressPage)
router.post('/checkoutAddAddress',auth.isLogout,auth.isBlocked,userController.checkoutaddAddress)
router.post('/verify-payment',auth.isLogout,auth.isBlocked,orderController.verifyPayment) 
router.get('/checkStock',auth.isLogout,auth.isBlocked,orderController.checkStock)
router.get('/returnOrder',auth.isLogout,auth.isBlocked,orderController.returnOrder)
router.get('/invoice',auth.isLogout,auth.isBlocked,orderController.getOrderInvoice)
  
  
router.post('/forgotPassword',auth.isLogout,auth.isBlocked, otpController.sendOtp) 
router.post('/verifyForgotPass',auth.isLogout,auth.isBlocked,otpController.verifyOtp)
router.get('/forgotPassword',auth.isLogout,auth.isBlocked,otpController.forgotPassword)
router.post('/resetPassword',auth.isLogout,auth.isBlocked,otpController.resetPassword)  

router.get('/manageAddress',auth.isLogout,auth.isBlocked,userController.manageAddress)
router.get('/editAddress',auth.isLogout,auth.isBlocked,userController.editAddress)
router.post('/editAddress',auth.isLogout,auth.isBlocked,userController.updateAddress) 
router.get('/addAddress',auth.isLogout,auth.isBlocked,userController.addAddress)
router.post('/addNewAddress',auth.isLogout,auth.isBlocked,userController.addNewAddress)  
router.get('/deleteAddress',auth.isLogout,auth.isBlocked,userController.deleteAddress)
router.post('/changePrimaryAddress',auth.isLogout,auth.isBlocked,userController.changePrimaryAddress)
router.get('/checkoutPageDeleteAddress',auth.isLogout,auth.isBlocked,userController.checkoutPageDeleteAddress)
router.get('/checkoutPageEditAddress',auth.isLogout,auth.isBlocked,userController.checkoutPageEditAddress)
router.post('/checkoutPageEditAddress',auth.isLogout,auth.isBlocked,userController.updateCheckoutAddress) 

router.post('/changeWalletBalance',auth.isLogout,auth.isBlocked,walletController.updateWallet)

// ///////////////////////////////////////////////////////////////////////////////////////////////////


// ///////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = router;

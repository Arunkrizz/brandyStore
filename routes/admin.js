const express = require('express');
const router = express();
const adminController = require('../controllers/admincontroller');
const couponController = require('../controllers/couponController');
const multer = require("../multer/multer");
const auth=require ('../middleware/adminAuth')

// const multer = require('multer');
/////////////////////////////////////////////////////////////////////////////////////////
router.get('/',adminController.getAdminLogin) 
router.post('/admin-login',adminController.verifyAdmin)  
router.get('/logout',adminController.logOut)
router.get('/admineditproduct',auth.isLogout,adminController.adminGetProduct) 
router.get('/adminedituser',auth.isLogout,adminController.adminGetUser)
router.post('/edit-user/:id',auth.isLogout,adminController.adminEditUser)
router.get('/adminblock_user',auth.isLogout,adminController.adminBlockUser) 
router.get('/adminUn_block_user',auth.isLogout,adminController.adminUnBlockUser)
router.get('/admindeleteuser',auth.isLogout,adminController.adminDeleteUser) 
router.get('/admindeleteproduct',auth.isLogout,adminController.adminDeleteProduct)
router.post('/edit-product/:id',auth.isLogout,adminController.adminEditProduct)
router.get('/add-product',auth.isLogout,adminController.adminAddProductPage)
router.post('/add-product',auth.isLogout,adminController.adminAddProduct)
router.get('/add-user',auth.isLogout,adminController.adminAddUserPage)
router.post('/add-user',auth.isLogout,adminController.adminAddUser)
router.get('/allUsers',auth.isLogout,adminController.getAllUsers )
router.get('/allOrders',auth.isLogout,adminController.getAllOrders )
router.get('/adminViewOrderDetails',auth.isLogout,adminController.getOrderDetails )
router.get('/dashboard',auth.isLogout,adminController.getDashboard)
router.get('/totalSaleExcel',auth.isLogout,adminController.totalSaleExcel)
router.get('/todayRevenueExcel',auth.isLogout,adminController.totalRevenueExcel)
router.get('/allProductExcel',auth.isLogout,adminController.productListExcel)
router.get('/allOrderStatusExcel',auth.isLogout,adminController.allOrderStatus)
router.get('/orderDetailPDF',auth.isLogout,adminController.orderDetailPDF)
router.get('/customDate',auth.isLogout,adminController.customPDF)

router.get('/addBanner',auth.isLogout,adminController.addBannerPage) 
router.post('/addBanner',auth.isLogout,adminController.addBanner)
router.get('/bannerList',auth.isLogout,adminController.bannerListPage)
router.get('/editBanner',auth.isLogout,adminController.editBannerPage)
router.post('/editBanner',auth.isLogout,adminController.editBanner) 
router.get('/deleteBanner',auth.isLogout,adminController.deleteBanner)

router.post('/updateDeliveryStatus',auth.isLogout,adminController.updateDeliveryStatus) 

router.get('/categoryUnlist',auth.isLogout,adminController.categoryUnlist)
router.get('/categoryRelist',auth.isLogout,adminController.categoryRelist)
router.get('/editCategoryPage',auth.isLogout,adminController.editCategoryPage)
router.post('/editCategory',auth.isLogout,adminController.editCategory)
router.get('/addCategoryOffer',auth.isLogout,adminController.addCategoryOfferPage)
router.post('/addCategoryOffer',auth.isLogout,adminController.addCategoryOffer)
 
router.get('/adminAllproducts',auth.isLogout,adminController.allproducts)
router.get('/getCategoryProduct',auth.isLogout,adminController.getCategory)
router.get('/getAllCategory',auth.isLogout,adminController.getAllCategory)
router.post('/addCategory',auth.isLogout,adminController.InsertCategory)
router.get('/addCategory',auth.isLogout,adminController.addCategory)

router.get('/getCouponPage',auth.isLogout,couponController.getCouponManager)
router.get('/addCoupon',auth.isLogout,couponController.addcouponPage)
router.post('/addCoupon',auth.isLogout,couponController.addcoupons)
router.get('/listCoupons',auth.isLogout,couponController.listCoupons)
router.get('/editcoupon',auth.isLogout,couponController.editCouponPage)
router.post('/editcoupon',auth.isLogout,couponController.editCoupon)
router.get('/removeCoupon',auth.isLogout,couponController.deleteCoupon)


// //////////////////////////////////////////////////////////////////////////////////////


module.exports = router;







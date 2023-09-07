const couponHelper = require("../helpers/couponHelper")
const orderHelper = require("../helpers/orderHelpers")


const verifyCoupon =async (req,res)=>{
  const couponCode = req.params.id.toUpperCase()
  const userId = req.session.user._id
  couponHelper.verifyCoupon(userId, couponCode)
      .then((response) => {
          res.send(response)
      })
}

const addcouponPage =async (req,res)=>{
  res.render('./admin/admin-addCoupon')
}

const applyCoupon = async (req,res)=>{
  console.log("apply");
    const couponCode = req.query.coupon
    const total = req.query.total
    const userId = req.session.user._id
   
    couponHelper.applyCoupon(couponCode, total)
        .then((response) => {
            console.log(response);
            res.send(response)
        })
}

const deleteCoupon = async (req,res)=>{


    try {
        console.log("here");
        const id = req.query.couponId
         await couponHelper.deleteCoupon(id).then((response)=>{
          res.json(response)
         })
      
       
      } catch (error) {
        console.log(error.message)
      }
}

const editCoupon = async (req,res)=>{
  // console.log("in edit coupon")
  const data = {
    couponCode: req.body.coupon,
    validity: req.body.validity,
    minPurchase: req.body.minAmount,
    minDiscountPercentage: req.body.discountPercentage,
    maxDiscountValue: req.body.maxDiscount,
    description: req.body.description
  }
  let couponId = req.query.id
  // console.log(couponId,"edit c-c coupon")
   await couponHelper.editCoupon(data,couponId).then((response)=>{
    res.json(response)
   })
  //  res.redirect("/admin/listCoupons")
}


const editCouponPage = async (req,res)=>{
    try {
        const id = req.query.id
      
        const coupon = await couponHelper.findCoupon(id) 
        console.log(coupon,"c-c edit coupon");
        return res.render("./admin/editcoupon", { coupon})
    } catch (error) {
        console.log(error);
    }
    
}

const getCouponManager= async (req,res)=>{
    res.redirect('/admin/listCoupons')
}

const addcoupons= async (req,res)=>{
console.log(req.body,"in c-c add coupons");
const data = {
  couponCode: req.body.coupon,
  validity: req.body.validity,
  minPurchase: req.body.minAmount,
  minDiscountPercentage: req.body.discountPercentage,
  maxDiscountValue: req.body.maxDiscount,
  description: req.body.description
}
await couponHelper.addcoupons(data)
  .then((response) => {
                res.json(response)
        })
// res.redirect("/admin/listCoupons")
}

const listCoupons = async (req, res) => {
    try {
      const coupons = await couponHelper.getCouponList()
      res.render('./admin/admin-couponList', { coupons })
    } catch (error) {
      console.log(error.message)
    }
  }

 

module.exports={
    getCouponManager,
    addcoupons,
    listCoupons,
    editCouponPage,
    editCoupon,
    deleteCoupon,
    applyCoupon,
    addcouponPage,
    verifyCoupon
}
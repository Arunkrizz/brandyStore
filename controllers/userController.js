const productHelpers = require("../helpers/productHelpers")
const userHelper = require("../helpers/userHelpers")
const cartHelper =require("../helpers/cartHelpers")
const walletHelper = require("../helpers/walletHelper")
const bannerHelper = require('../helpers/bannerHelper');
// const Otp=require ('../models/otp')
// const{AUTH_EMAIL}=process.env
// ///////////////////////////////////////////////////////////
// twilio otp
const dotenv = require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require('twilio')(accountSid, authToken);
// ///////////////////////////////////////////////////////////

const walletPage=async (req,res)=>{
  let wallet = await walletHelper.getWallet(req.session.user._id)
  console.log(wallet,"wallet")
res.render('wallet',{wallet})
}

const filter= async (req,res)=>{ 
  // console.log(req.body,"filter")
  // let filteredProduct = await productHelpers.filteredProducts(req.body)
  // console.log(filteredProduct,"filtered Pro")
  try {
    try {
      // if(req.session.user){

      const promises = [
        productHelpers.filteredProducts(req.body),
        // productHelpers.getAllListedCategory(),
        // cartHelper.getCartProducts(req.session.user._id),
        // userHelper.getTotal(req.session.user._id),
      ];

      // Wait for all promises to resolve
      Promise.all(promises)
        // .then(([products, category,cartProducts,total]) 
        .then(([products])=> {
          // console.log(EarRingsProduct);
          // res.render('home', { products, category,cartProducts,total });
          res.json({products})
        })
        .catch((error) => {
          console.log('Failed to retrieve products:', error);
          // Handle error
        });

      // }
      // else {
      //   res.redirect('/')
      // }
    }
    catch (err) {
      console.log(err);
      console.log("error occured !!!! !here @get home");
      // res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {
    console.log(error.message);
  }

}

const checkoutaddAddress =async (req,res)=>{
  const userId =req.session.user._id
  const data =req.body
  const status= await userHelper.checkoutaddAddress(data,userId)
  res.redirect('/placeorder')
}

const checkoutaddAddressPage=async(req,res)=>{
  res.render('checkoutAddAddress')
}

const changePrimaryAddress = async (req,res)=>{
await userHelper.changePrimaryAddress(req.session.user._id,req.body.addressId)

}


const checkoutPageDeleteAddress = async (req,res)=>{
  // console.log(" u-c deleteaddress herre",userId,addressId);
  const userId =req.session.user._id
  const addressId = req.query.id
  const firstName = req.query.fname
  const lastName = req.query.lname
   console.log(" u-c deleteaddress herre",userId,addressId);
  const status = await userHelper.deleteAddress(userId,addressId,firstName,lastName)
  console.log(status);
  if (status){
    res.redirect('/placeorder')
  }else{
    res.redirect('/home')  
  }

}

const deleteAddress = async (req,res)=>{
  // console.log(" u-c deleteaddress herre",userId,addressId);
  const userId =req.session.user._id
  const addressId = req.query.id
  const firstName = req.query.fname
  const lastName = req.query.lname
   console.log(" u-c deleteaddress herre",userId,addressId);
  const status = await userHelper.deleteAddress(userId,addressId,firstName,lastName)
  console.log(status);
  if (status){
    res.redirect('/manageAddress')
  }else{
    res.redirect('/home')  
  }

}

const addNewAddress =async (req,res)=>{
  const userId =req.session.user._id
  const data =req.body
  // console.log(req.body,"here");
  const status =await userHelper.addAddress(data,userId)
  // console.log(status);
  if (status){
    res.redirect('/manageAddress')
  }else{
    res.redirect('/home')
  }
}

const addAddress =async (req,res)=>{
  res.render('addnewAddress')
}




const updateCheckoutAddress =async (req,res)=>{

  const addressId=req.body.id
  const userId=req.session.user._id
 
  const updatedAddress={
   
    firstname:req.body.fname,
    lastname:req.body.lname,
    state:req.body.state,
    address1:req.body.address1,
    address2:req.body.address2,
    city:req.body.city,
    pincode:req.body.pincode,
    mobile:req.body.mobile,
    email:req.body.email,

  }
  console.log(updatedAddress,"updated address",addressId,"addId",userId,"userId");
 const updated= await userHelper.updateAddress(userId,addressId,updatedAddress)
//  console.log(updated,"ll");
 if(updated){
  res.redirect('/placeorder') 
 }
}  
 
const updateAddress =async (req,res)=>{

  const addressId=req.body.id
  const userId=req.session.user._id
 
  const updatedAddress={
   
    firstname:req.body.fname,
    lastname:req.body.lname,
    state:req.body.state,
    address1:req.body.address1,
    address2:req.body.address2,
    city:req.body.city,
    pincode:req.body.pincode,
    mobile:req.body.mobile,
    email:req.body.email,

  }
  console.log(updatedAddress,"updated address",addressId,"addId",userId,"userId");
 const updated= await userHelper.updateAddress(userId,addressId,updatedAddress)
//  console.log(updated,"ll");
 if(updated){
  res.redirect('/manageAddress') 
 }
}

const editAddress =async (req,res)=>{ 
  const addressId = req.query.id
  const userId = req.session.user._id
  // console.log(addressId,"addid",userId,"userId");
  const address = await  userHelper.fetchAddress(userId,addressId)
  // console.log(address,"u-c addressfetched"); 
  res.render('editAddress',{address})
} 

const checkoutPageEditAddress =async (req,res)=>{ 
  const addressId = req.query.id
  const userId = req.session.user._id
  // console.log(addressId,"addid",userId,"userId");
  const address = await  userHelper.fetchAddress(userId,addressId)
  // console.log(address,"u-c addressfetched"); 
  res.render('checkoutPageEditAddress',{address})
} 

const changePassword = async (req, res) => {
  const userId = req.body.userid
  const newPassword = req.body.newpassword
  try {
    const user = await userHelper.confirmPassword(req.body)
    console.log(user, "u-c changePass ");
    if (user) {
      await userHelper.updatePassword(userId, newPassword).then((response) => {
        res.json(response)
      })

    } else {

      req.session.passwordErr = true
      // res.render('changePasswordPage',{"passwordErr":req.session.passwordErr})
      res.redirect('/changePassword')
      // passwordErr=false
    }
  } catch (error) {
    console.log(error);
  }
}

const changePasswordPage = async (req, res) => {
  try {

    // console.log(passwordErr,"passerr");
    const user = await userHelper.getProfile(req.session.user._id)
    if (!req.session.passwordErr) {
      res.render('changePasswordPage', { user })
    } else {
      let passwordErr = req.session.passwordErr
      console.log(passwordErr, "ll");
      res.render('changePasswordPage', { user, passwordErr })
      req.session.passwordErr = false

    }

  } catch (error) {
    console.log(error);
  }
}

const changeAddress = async (req, res) => {
  try {
    await userHelper.changeAddress(req.body)
  } catch (error) {
    console.log(error);
  }
}

const manageAddress = async (req, res) => {
  try {
    const profile = await userHelper.getProfile(req.session.user._id)
    const address= profile.Address
    console.log(profile.Address, "in u-c manageAddress");
    
    res.render('manageAddress', { profile,address })
    // res.render('s1', { profile,address })
  } catch (error) {
    console.log(error);
  }
}

const getProfile = async (req, res) => {
  try {
    const profile = await userHelper.getProfile(req.session.user._id)
    const address= profile.Address
    console.log(profile.Address, "in u-c getprofile");
    res.render('userProfile',{profile})
    // res.render('manageAddress', { profile,address })
  } catch (error) {
    console.log(error);
  }
}


////////////////////////////////////////////////////////////////////
const verify = async (req, res) => {
  try {

    const mobileNumber = req.body.mobileNumber
    client.verify.v2
      .services(verifySid)
      .verifications.create({ to: mobileNumber, channel: 'sms' })
      .then((verification) => {
        console.log(verification.status);
        res.render('verify_otp', { mobileNumber });
      })
      .catch((error) => {
        console.log(error);
        res.send('Error occurred during OTP generation');
      });
  }
  catch (error) {
    console.log(error.message);
  }
};

////////////////////////////////////////////////////////////////////////////////
const verifys = async (req, res) => {
  try {

    const mobile = req.body.mobileNumber
    const otpCode = req.body.otp
    // let verified=false;
    console.log(otpCode, "otp", mobile, "mobile")
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: mobile, code: otpCode })
      .then((verificationCheck) => {
        console.log(verificationCheck.status);
        // verified=true               // verified is made true here check for bugs

        res.render('signup', { mobile })
        // res.redirect('/login')

      })
      .catch((error) => {
        console.log(error);
        res.send('Error occurred during OTP verification');
      });

  }
  catch (error) {
    console.log(error.message);
  }
}

// /////////////////////////////////////////////////////////////////////////////////////////
const signup = async (req, res) => {
  try {
    const name = req.body.name
    const email = req.body.email
    const mobile = req.body.mobile
    const password = req.body.password

    // const { user:name, email,mobile, password } = req.body
    let user = { name, email, mobile, password }
    // console.log(req.body);
    userHelper.addUser(user, stat => {
      if (stat === "DONE") {
        // res.redirect(`/login`)
        res.render('login', { email })
      }
      else if (stat === "USER_ALREADY_EXISTS")
        res.redirect("/login")
    })
  }
  catch (error) {
    console.log(error.message);
  }

}

// /////////////////////////////////////////////////////////////////////////////////////////////
const login = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect('/home')
    }

    res.render('signup&login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
  catch (error) {
    console.log(error.message);
  }
}


// /////////////////////////////////////////////////////////////////////////////////////////////

// /////////////////////////////////////////////////////////////////////////////////////////////
const getuserlogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password
    // let user = { email, password }

    console.log("at post login");
    const user = await userHelper.getUsers({ Email: email, Password: password });
    // const blockedStatus=user.blocked

    if (!user) {
      // Handle the case when the product is not found
      req.session.loginErr = true
      return res.redirect('/login');
    }
    if (user) {
      // console.log(user[0],"kkkk");
      req.session.user = user[0]
      // console.log(req.session.user._id,"user");
      return res.redirect('/home');
      // console.log(user.Blocked,"userblock");

    }

  } catch (err) {
    console.log(err);
    console.log("error occured !!!!!here @post login");
    res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
  }
}
// /////////////////////////////////////////////////////////////////////////////////////////////
const logout = async (req, res) => {
  try {
    req.session.user = false
    res.redirect('/')
  }
  catch (error) {
    console.log(error.message);
  }
}
// /////////////////////////////////////////////////////////////////////////////////////////////
const home = async (req, res) => {
  try {
    try {
      // if(req.session.user){

      const promises = [
        bannerHelper.bannerListHelper(),
        productHelpers.getAllProducts(),
        productHelpers.getAllListedCategory(),
        cartHelper.getCartProducts(req.session.user._id),
        userHelper.getTotal(req.session.user._id),
      ];

      // Wait for all promises to resolve
      Promise.all(promises)
        .then(([banner,products, category,cartProducts,total]) => {
          // console.log(EarRingsProduct);
          res.render('home', {banner, products, category,cartProducts,total });
        })
        .catch((error) => {
          console.log('Failed to retrieve products:', error);
          // Handle error
        });

      // }
      // else {
      //   res.redirect('/')
      // }
    }
    catch (err) {
      console.log(err);
      console.log("error occured !!!! !here @get home");
      // res.redirect('/login'); // Handle the error, e.g., redirect to the admin panel
    }
  }
  catch (error) {
    console.log(error.message);
  }
}
// /////////////////////////////////////////////////////////////////////////////////////////////

// ////////////////////////////////////////////////////////////////////////////////////////////

const changeQuantity = async (req, res, next) => {

  try {
    // console.log(req.body,"chngeqty");
    await userHelper.changeProductQuantity(req.body).then((response) => {
      // console.log(response,"chngeqty2");
      res.json(response)
    })
  }
  catch (error) {
    console.log(error);
  }
}


const landingPage = async (req, res) => {
  try {
      if(req.session.user){
          res.redirect('/home')
        }
        // Create an array of promises

        const promises = [
          productHelpers.getAllProducts()

        ];

        // Wait for all promises to resolve
        Promise.all(promises)
          .then(([products]) => {
            // console.log(EarRingsProduct);

            res.render('LandingPage', {products });
            // res.render('tester')
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });

  } catch (error) {
    console.log(error.message);
  }
};


// ////////////////////////////////////////////////////////////////////////////////////////////


// const getTotalAmount=async (req,res,next)=>{

//   try {
//     console.log("herer in u-c gt tot amt");
//     await userHelper.getTotal(req.session.user._id)
//   }
//   catch (error) {
//     console.log(error);
//   }
// }

// ////////////////////////////////////////////////////////////////////////////////////////////

// const  removeCartProduct=async (req,res,next)=>{

//   try {
//     // console.log(req.body,"removecart product");
//    await userHelper.removeCartProduct(req.body).then((response)=>{

//       res.json(response)
//     })
//   }
//   catch (error) {
//     console.log(error);
//   }
// }


// const getProductDetails=async (req,res)=>{

//   try {
//     // console.log("here /admineditproduct");
//     let id=req.params.id
//     const product = await productHelpers.getProductById({ _id: id });
//     console.log("here /productdetails",product);
//     if (!product) {
//       // Handle the case when the product is not found
//       return res.redirect('/login');
//     }

//     // res.render('productDetailsPage',  { product: product });
//     res.render('productDetailsPage',  { product: product });
//     // res.render('s1',  { product: product });
//   } catch (err) {
//     console.log(err);
//     res.redirect('/home'); // Handle the error, e.g., redirect to the admin panel
//   }
// }

// ////////////////////////////////////////////////////////////////////////////////////////////

// const addToCart=async (req,res)=>{
//   try {
//     userHelper.addToCart(req.params.id,req.session.user._id)
//     res.redirect('/cart')
//   } catch (error) {
//     console.log(error);
//   }
// }
// ////////////////////////////////////////////////////////////////////////////////////////////


// const getCart=async (req,res)=>{

//   try {
//     let cartIsEmpty= await userHelper.isCartEmpty(req.session.user._id)

//     console.log(cartIsEmpty,"ingetCart");
//     if(cartIsEmpty){

//   // if(req.session.user){
//     const promises = [
//       userHelper.getCartProducts(req.session.user._id),
//       userHelper.getTotal(req.session.user._id),
//       userHelper.getSubTotal(req.session.user._id)
//     ];

//     Promise.all(promises)
//     .then(([products,total,subTotal]) => {
//       // console.log(data,"/cart products");
//       // res.render('cart',{products,total,subTotal})
//       res.render('cart', {products,total,subTotal});
//       // res.render('home', {products,category });
//     })
//     .catch((error) => {
//       console.log('Failed to get cart:', error);
//       // Handle error
//     })


//     }

//     else {
//       res.render('cartisEmpty')
//     }

//   }
//   catch (error) {
//     console.log(error);
//   }
// } 

// // forgot pass
// const sendOtp =async (req,res)=>{
//  try {
//   const {email}=req.body
//   const duration=1
//   const subject="Forgot password Verification "
//   console.log(email,"send otpp");
//   if(!(email)){
//     throw Error ('Provide values for email') 
//   }
//   //  clear any old record 
//   await userHelper.deleteOtp(email)

//   // generate pin
//   const generatedOtp=await userHelper.generateOtp();
// console.log(generatedOtp);
//   // send email
//   const mailOptions={
//     from:AUTH_EMAIL,
//     to:email,
//     subject,
//     html:`<p>Verify your email with the code given below</p><p style="color:tomato;
//     font-size:25px;letter-spacing:2px;"><b>${generatedOtp}</b></p><p>This code <b> expires in ${duration} hour (s)</b>.</p>`,
//   }
//   await userHelper.sendOtpMail(mailOptions)

//   // save otp record
//   const hashedOtp=await userHelper.hashData(generatedOtp)
//   // console.log(email,"send otpp email");
//   const newOtp= new Otp({
//     Email:email,
//     otp:hashedOtp,
//     createdAt:Date.now(),
//     expiresAt:Date.now()+ 3600000 *+duration,
//   })
//   const createdOtpRecord=await userHelper.createOtp(newOtp)

//   res.render('forgotPasswordVerify',{email})
//   // const createdOtpRecord_ = await newOtp.save()
//   // return createdOtpRecord



//  } catch (error) {
//   throw error
//  } 
// }
// // /////////////////////////////////////////////////////////////////////////////////////////////
// // verify forgot pass
// const verifyOtp=async(req,res)=>{

//   try {
//     let{email,otp}= req.body;
//     console.log(email,otp,"in verify otp");
//     if(!(email&&otp)){
//       throw Error ("Provide values for email ,otp")
//     }

//     // ensure otp record exists
//     // const matchedOtpRecord=await Otp.findOne({Email:email})
//     const matchedOtpRecord=await userHelper.findOtpRecord(email)
//     console.log(matchedOtpRecord,"otp record match found");
//     if(!matchedOtpRecord){
//       throw Error ("No otp records found.")
//     }

//     const {expiresAt}= matchedOtpRecord
//     console.log(expiresAt,"expires at ");

//     // checking for expired code
//     if(expiresAt<Date.now()){
//       await userHelper.deleteOtpRecord(email)

//       console.log("Code has expired. Request for a new one."); 
//     }

//     // not expired yet ,verify value 
//     const hashedOtp=matchedOtpRecord.otp
//     const validOtp=await userHelper.verifyHashedData(otp,hashedOtp)
//     if(validOtp){
//       // res.send('otp verified')
//       res.render('resetPassword',{email})
//    }
//     // return validOtp

//   } catch (error) {
//     throw error;
//   }
// }


// const cancelOrder =async(req,res)=>{
//   try {

//     console.log(req.query.id,"here in u-c cancelorder");
//     await userHelper.cancelOrder(req.query.id)
//     res.redirect('/orders')
//   } catch (error) {
//     console.log(error);
//   }
// }

// const orderPage= async(req,res)=>{
//   try {
//     let orders =await userHelper.getOrders(req.session.user._id)

//     console.log("-------------",orders[0].products,"in u-c orderpage");


//       res.render('ordersPage',{orders})
//   } catch (error) {
//     console.log(error);
//   }
// }

// const orderSuccess= async(req,res)=>{
//   try {
//     res.render('orderConfirmed')
//   } catch (error) {
//     console.log(error);
//   }

// }

// const checkOut =async (req,res)=>{
// try {
//   console.log("in checkout u-c");
//   const user=req.session.user

//   let products=await userHelper.getCartProductList(user._id)
//   console.log(products,"in checkout u-c");
//   let totalPrice= await userHelper.getTotal(user._id)
//   await userHelper.addAddress(req.body,user._id)
//   await userHelper.placeOrder(req.body,products,totalPrice,user._id,user.Name).then((response)=>{
//     res.json({checkoutcomplete:true})

//   })
//   console.log("here");
// } catch (error) {
//   console.log(error);
// }
// }

// const place_order= async(req,res)=>{
// try {
//   console.log("here");
//   console.log("place_order",req.body);
// } catch (error) {
//   console.log(error);
// }
// }

// const placeOrder = async (req, res) => {
//   try {

//   // if(req.session.user){
//     const promises = [
//       userHelper.getTotal(req.session.user._id),
//       userHelper.getSubTotal(req.session.user._id),
//       userHelper.getAddress(req.session.user._id)
//     ];

//     Promise.all(promises)
//     .then(([total,subTotal,address]) => {
//       console.log(address,"address u-c placeorder");
//       res.render('checkoutPage',{total,subTotal,address})
//     })
//     .catch((error) => {
//       console.log('Failed to get checkout page:', error);
//       // Handle error
//     })
//   } catch (error) {

//   }
// }

// const resetPassword = async (req, res) => {
//   try {

//     const email=req.body.email
//     const password=req.body.password
//     console.log(email,password,"in u-c resetpassword ");
//     await userHelper.resetPassword(email,password)
//     res.redirect('/login')
//   } catch (error) {

//   }
// }


// const forgotPassword = async (req, res) => {
//   try {
//     res.render('forgotPassword')
//   } catch (error) {

//   }
// }

// ===================================================================
// const getCategoryProduct = async (req, res) => {
//   try {
//     if(req.session.user){

//       cName=req.query.category
//     const promises = [
//       productHelpers.getCategory(cName),
//       productHelpers.getAllCategory()
//     ];

//       // Wait for all promises to resolve
//       Promise.all(promises)
//         .then(([products,category]) => {
//           // console.log(EarRingsProduct);
//           res.render('home', {products,category });
//         })
//         .catch((error) => {
//           console.log('Failed to retrieve products:', error);
//           // Handle error
//         });

//     }
//     else {
//       res.redirect('/')
//     }
//   }
//   catch (error) {
//     console.log(error.message);
//   }
// }

// ////////////////////////////////////////////////////////////////////////////////////////////
module.exports = {
  landingPage,
  verify,
  verifys,
  signup,
  login,
  getuserlogin,
  logout,
  home,
  changeQuantity,
   getProfile,
  changeAddress,
  changePasswordPage,
  changePassword,
  editAddress,
  updateAddress,
  manageAddress,
  addAddress,
  addNewAddress,
  deleteAddress,
  changePrimaryAddress,
  checkoutaddAddress,
  checkoutaddAddressPage,
  filter,
  checkoutPageDeleteAddress,
  checkoutPageEditAddress,
  updateCheckoutAddress,
  walletPage
   // getTotalAmount,
  // removeCartProduct,
  // sendOtp,
  // verifyOtp,
  // getCategoryProduct,
  // forgotPassword ,
  // resetPassword,
  // placeOrder,
  // checkOut,
  // orderSuccess,
  // orderPage,
  // cancelOrder,
  // getProductDetails,
  // addToCart,
  // getCart,



}
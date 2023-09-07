// const userHelper = require("../helpers/user-helpers")
const otpHelper = require("../helpers/otpHelpers")
const{AUTH_EMAIL}=process.env
const Otp=require ('../models/otp')


// forgot pass
const sendOtp =async (req,res)=>{
    try {
     const {email}=req.body
     const duration=1
     const subject="Forgot password Verification "
     console.log(email,"send otpp");
     if(!(email)){
       throw Error ('Provide values for email') 
     }
     //  clear any old record 
     await otpHelper.deleteOtp(email)
   
     // generate pin
     const generatedOtp=await otpHelper.generateOtp();
   console.log(generatedOtp);
     // send email
     const mailOptions={
       from:AUTH_EMAIL,
       to:email,
       subject,
       html:`<p>Verify your email with the code given below</p><p style="color:tomato;
       font-size:25px;letter-spacing:2px;"><b>${generatedOtp}</b></p><p>This code <b> expires in ${duration} hour (s)</b>.</p>`,
     }
     await otpHelper.sendOtpMail(mailOptions)
   
     // save otp record
     const hashedOtp=await otpHelper.hashData(generatedOtp)
     // console.log(email,"send otpp email");
     const newOtp= new Otp({
       Email:email,
       otp:hashedOtp,
       createdAt:Date.now(),
       expiresAt:Date.now()+ 3600000 *+duration,
     })
     const createdOtpRecord=await otpHelper.createOtp(newOtp)
   
     res.render('forgotPasswordVerify',{email})
     // const createdOtpRecord_ = await newOtp.save()
     // return createdOtpRecord
   
   
   
    } catch (error) {
     throw error
    } 
   }
   // /////////////////////////////////////////////////////////////////////////////////////////////
   // verify forgot pass
   const verifyOtp=async(req,res)=>{
     
     try {
       let{email,otp}= req.body;
       console.log(email,otp,"in verify otp");
       if(!(email&&otp)){
         throw Error ("Provide values for email ,otp")
       }
   
       // ensure otp record exists
       // const matchedOtpRecord=await Otp.findOne({Email:email})
       const matchedOtpRecord=await otpHelper.findOtpRecord(email)
       console.log(matchedOtpRecord,"otp record match found");
       if(!matchedOtpRecord){
         throw Error ("No otp records found.")
       }
   
       const {expiresAt}= matchedOtpRecord
       console.log(expiresAt,"expires at ");
   
       // checking for expired code
       if(expiresAt<Date.now()){
         await otpHelper.deleteOtpRecord(email)
         
         console.log("Code has expired. Request for a new one."); 
       }
   
       // not expired yet ,verify value 
       const hashedOtp=matchedOtpRecord.otp
       const validOtp=await otpHelper.verifyHashedData(otp,hashedOtp)
       if(validOtp){
         // res.send('otp verified')
         res.render('resetPassword',{email})
      }
       // return validOtp
   
     } catch (error) {
       throw error;
     }
   }

   const forgotPassword = async (req, res) => {
    try {
      res.render('forgotPassword')
    } catch (error) {
      
    }
  }

  const resetPassword = async (req, res) => {
    try {
     
      const email=req.body.email
      const password=req.body.password
      console.log(email,password,"in u-c resetpassword ");
      await otpHelper.resetPassword(email,password)
      res.redirect('/login')
    } catch (error) {
      
    }
  }

   module.exports={
    sendOtp,
    verifyOtp,
    forgotPassword,
    resetPassword
   }
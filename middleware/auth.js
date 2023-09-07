const userHelper = require("../helpers/userHelpers")
const isLogin=(req,res,next)=>{
    try {
        if(req.session.user){
            res.redirect('/home')
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

const isLogout=(req,res,next)=>{
    try {
        if(!req.session.user){
            res.redirect('/login')  
        }
        next()
    } catch (error) {
        console.log(error);
    }
}

const isBlocked=(async(req,res,next)  =>{
    // console.log(req.session.user1._id,'chkkk usr session')
    try {
    const u1= await userHelper.getUserById (req.session.user._id)
    // console.log(u1.,'chkk usr  details')
    // console.log(u1.  Blocked,'chkkk u1');      
    const check= u1.Blocked    
    // console.log(u1,"blockcheck");
    if(check){
        // console.log('blkdddddddd')
        res.render('signup&login', { "blocked": true })       
    }
    else{
        // console.log('not blkdddddddd')     
        next()
    }
    } catch (error) {
        console.log(error);
    }
})

module.exports={
    isLogin,
    isLogout,
    isBlocked
}
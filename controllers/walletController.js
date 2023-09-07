const walletHelper = require("../helpers/walletHelper")
const cartHelper = require("../helpers/cartHelpers")

module.exports={
    updateWallet: async (req,res)=>{
        await walletHelper.updateWallet(req.body,req.session.user._id).then ((response)=>{
            res.json(response)
    })
    
        console.log(req.body,"wallet update")
    }
}

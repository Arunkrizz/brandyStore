const productHelpers=require("../helpers/productHelpers")




const getProductDetails=async (req,res)=>{
  
    try {
      // console.log("here /admineditproduct");
      let id=req.params.id
      const product = await productHelpers.getProductById({ _id: id });
      console.log("here /productdetails",product);
      if (!product) {
        // Handle the case when the product is not found
        return res.redirect('/login');
      }
  
      // res.render('productDetailsPage',  { product: product });
      res.render('productDetailsPage',  { product: product });
      // res.render('s1',  { product: product });
    } catch (err) {
      console.log(err);
      res.redirect('/home'); // Handle the error, e.g., redirect to the admin panel
    }
  }

  const getCategoryProduct = async (req, res) => {
    try {
      if(req.session.user){
              
        cName=req.query.category
      const promises = [
        productHelpers.getCategory(cName),
        productHelpers.getAllListedCategory()
      ];
      
        // Wait for all promises to resolve
        Promise.all(promises)
          .then(([products,category]) => {
            // console.log(EarRingsProduct);
            res.render('home', {products,category });
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });
    
      }
      else {
        res.redirect('/')
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }
  
  const getCategoryProducts = async (req, res) => {
    try {
      if(req.session.user){
              
        cName=req.query.category
      const promises = [
        productHelpers.getCategory("Necklace"),
        // productHelpers.getAllListedCategory()
      ];
      
        // Wait for all promises to resolve
        Promise.all(promises)
          .then(([products]) => {
            console.log(products);
            // res.render('home', {products });
            res.json({products})
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });
    
      }
      else {
        res.redirect('/')
      }
    }
    catch (error) {
      console.log(error.message);
    }
  }
  

  module.exports={
    getProductDetails,
    getCategoryProduct,
    getCategoryProducts, 
  }
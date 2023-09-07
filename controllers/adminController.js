const productHelpers = require('../helpers/productHelpers');
const userHelpers = require("../helpers/userHelpers")
const adminHelpers = require("../helpers/adminHelpers");
const orderHelpers = require('../helpers/orderHelpers');
const categoryHelpers = require('../helpers/categoryHelpers');
const bannerHelper = require('../helpers/bannerHelper');
const exceljs=require('exceljs')
const PdfPrinter=require('pdfmake');
const fs=require('fs');
const walletHelper = require('../helpers/walletHelper');

const addCategoryOffer = async (req,res)=>{
  try {
    const category= req.body.Category
    const offer =parseFloat( req.body.offer)
    console.log(category,offer,"offer cat");
    await categoryHelpers.addCategoryOffer(category,offer)
    await productHelpers.addOffer(category,offer)
  } catch (error) {
    console.log(error);
  }
}

const addCategoryOfferPage = async(req,res)=>{
  try {
    
    const category= await productHelpers.getAllListedCategory()
    res.render('./admin/addCategoryOffer',{category})
  } catch (error) {
    console.log(error)
  }
}

const deleteBanner = async (req,res)=>{
try {
  await bannerHelper.deleteBanner(req.query.id).then((response)=>{
    if(response){
      res.redirect('/admin/bannerList')
    }
  })
} catch (error) {
  console.console.log(error);
}
}

const editBanner = async (req,res)=>{
  try {
    console.log(req.body,"body")
    await bannerHelper.editBannerHelper(req.body, req.files['image']).then(( response) => {
      if (response) {
          res.redirect("/admin/bannerList");
      } else {
          res.status(505);
      }
  })
  } catch (error) {
    console.log(error);
  }
}

const editBannerPage = async (req,res)=>{
  try {
   await  bannerHelper.fetchBanner(req.query.id).then (async (response)=>{
    const category = await productHelpers.getAllListedCategory()
    res.render('./admin/editBanner',{banner:response,category})
    console.log(response,category)
   })
  } catch (error) {
    console.log(error)
  }
}

const bannerListPage = async (req,res)=>{
  try{
    bannerHelper.bannerListHelper().then((response)=> {
        res.render('./admin/bannerList',{banners:response})

    })
    
}
catch(error){
    console.log(error);
}
}

const addBanner = async (req,res)=>{
try { 
 
  // console.log(req.body,"kk",req.files,"file",req.files['image'],"lll")
  await bannerHelper.addBannerHelper(req.body, req.files['image']).then(( response) => {
    if (response) {
        res.redirect("/admin/addBanner");
    } else {
        res.status(505);
    }
})
   
   
  
} catch (error) {
  console.log(error)
}
}

const addBannerPage = async (req,res)=>{
  const category = await productHelpers.getAllListedCategory()
  res.render('./admin/addBanner',{category})
}

const orderDetailPDF = async (req,res)=>{
try {
  const allOrder =await orderHelpers.findOrdersDelivered_populated() 
  let totalAmount = 0;
if (allOrder && allOrder.length > 0) {
  totalAmount = allOrder.reduce((total, order) => total + order.totalAmount, 0);
}

console.log(allOrder,totalAmount,"orderdetail pdf")
  res.render('./admin/salesPdf',{orders:allOrder,totalAmount})
} catch (error) {
  console.log(error)
}
}

const customPDF = async (req,res)=>{
try {
  const startDate = req.query.start; // Get the starting date from the query parameters
    const endDate = req.query.end; // Get the ending date from the query parameters
    const allOrder = await orderHelpers.findOrderByDate(startDate,endDate)

    console.log(allOrder.length,allOrder,"order pdf")

    let startY = 150;
    const writeStream = fs.createWriteStream("order.pdf");
    const printer = new PdfPrinter({
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    });

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Create document definition
    const docDefinition = {
      content: [
        { text: "Brandy STORE", style: "header" },
        { text: "\n" },
        { text: "Order Information", style: "header1" },
        { text: "\n" },
        { text: "\n" },
      ],
      styles: {
        header: {
          fontSize: 25,
          alignment: "center",
        },
        header1: {
          fontSize: 12,
          alignment: "center",
        },
        total: {
          fontSize: 18,
          alignment: "center",
        },
      },
    };

    // Create the table data
    const tableBody = [
      ["Index", "Date", "User", "address" ,"Status", "PayMode",  "Amount"], // Table header
    ];
    let totalAmount=0
    for (let i = 0; i < allOrder.length; i++) {
      const data = allOrder[i];
      totalAmount=totalAmount+data.totalAmount
      const formattedDate = new Intl.DateTimeFormat(
        "en-US",
        dateOptions
      ).format(new Date(data.date));
      tableBody.push([
        (i + 1).toString(), // Index value
        formattedDate,
        data.deliveryDetails.firstname,
        data.deliveryDetails.address1,
        data.status,
        data.paymentMethod,
        data.totalAmount,
      ]);
    }
    const table = {
      table: {
        widths: ["auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        headerRows: 1,
        body: tableBody,
      },
    };

    // Add the table to the document definition
    docDefinition.content.push(table);
    docDefinition.content.push([
      { text: "\n" },
      { text: `Total:${totalAmount}`, style: "total" },
    ]);
    // Generate PDF from the document definition
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Pipe the PDF document to a write stream
    pdfDoc.pipe(writeStream);

    // Finalize the PDF and end the stream
    pdfDoc.end();

    writeStream.on("finish", () => {
      res.download("order.pdf", "order.pdf");
    });
} catch (error) {
  console.log(error)
}
}

const allOrderStatus = async (req,res)=>{
try {
  const allOrder = await orderHelpers.getAllOrders() 
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('orders');
  const columns = [
    { header: "S:no", key: "s_no" },
    { header: "Order Id", key: "_id" },
    { header: "User Id", key: "userId" },
    { header: 'Product', key: "product" },
    { header: "Quantity", key: "quantity" },
    { header: "Total", key: "totalAmount" },
    { header: "Payment Method", key: "paymentMethod" },
    { header: "Delivered Status", key: "deliveredStatus" },
    { header: "Order Date", key: "date" },
  
  ];

    worksheet.columns = columns;
      
      let s_no = 1; // Initialize a counter
      
      // Flatten and add data to the worksheet
      allOrder.forEach(order => {
        order.products.forEach(product => {
          worksheet.addRow({
            s_no: s_no++,
            _id: order._id,
            userId: order.userId,
            product: product.product, // Access 'product' from the nested structure
            quantity: product.quantity, // Access 'quantity' from the nested structure
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveredStatus: order.delivered ? order.delivered.status : '',
            date: order.date,
            
          });
        });
      });
      
      // Style the header row
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", 'attachment;filename=orders.xlsx');
  return workbook.xlsx.write(res).then(() => {
    res.status(200);
  });
} catch (error) {
  console.log(error)
}
}


const productListExcel= async (req,res)=>{

  try {
    const productModellist = await productHelpers.getAllProducts()
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('orders');
    worksheet.columns = [
      { header: "S no", key: "s_no" },
      { header: "Id", key: "_id" },
      { header: "productName", key: "Name" },
      { header: "Category", key: "Category" },
      { header: "Description", key: "Description"},
      { header: "Price", key: "Price" }
    ];
    let counter = 1;
    productModellist.forEach(element => {
      element.s_no = counter;
      worksheet.addRow(element);
      counter++;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader("Content-Disposition", 'attachment;filename=productList.xlsx');
    return workbook.xlsx.write(res).then(() => {
      res.status(200);

    });
  } catch (error) {
    console.log(error.message)
  }

}

const totalRevenueExcel =async (req,res)=>{
  console.log("tdy revenue");
try {
  const allOrder = await orderHelpers.findOrdersDelivered() 
  console.log(allOrder,"tdy revenue");
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('orders');
  const columns = [
    { header: "S:no", key: "s_no" },
    { header: "Order Id", key: "_id" },
    { header: "User Id", key: "userId" },
    { header: "Total", key: "totalAmount" },
    { header: "Payment Method", key: "paymentMethod" },
    { header: "Delivered Status", key: "deliveredStatus" },
    { header: "Order Date", key: "date" },
    { header: "__v", key: "__v" }
  ];
    
      // Set the columns
      worksheet.columns = columns;
      
      let s_no = 1; // Initialize a counter
      
      // Flatten and add data to the worksheet
      allOrder.forEach(order => {
        order.products.forEach(product => {
          worksheet.addRow({
            s_no: s_no++,
            _id: order._id,
            userId: order.userId,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveredStatus: order.delivered ? order.delivered.status : '',
            date: order.date,
            __v: order.__v
          });
        });
      });
      
      // Style the header row
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader("Content-Disposition", 'attachment;filename=revenue.xlsx');
  return workbook.xlsx.write(res).then(() => {
    res.status(200);
  });
} catch (error) {
  console.log(error)
}
}

const totalSaleExcel= async(req,res)=>{
  try {
  

      const totalSaleToday= await orderHelpers.totalSaleToday()
    
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet('orders');
      
      // Define the header columns
      const columns = [
        { header: "S:no", key: "s_no" },
        { header: "Id", key: "_id" },
        { header: "User Id", key: "userId" },
        { header: 'Product', key: "product" },
        { header: "Quantity", key: "quantity" },
        { header: "Total", key: "totalAmount" },
        { header: "Payment Method", key: "paymentMethod" },
        { header: "Delivered Status", key: "deliveredStatus" },
        { header: "Order Date", key: "date" },
      
      ];
      
      // Set the columns
      worksheet.columns = columns;
      
      let s_no = 1; // Initialize a counter
      
      // Flatten and add data to the worksheet
      totalSaleToday.forEach(order => {
        order.products.forEach(product => {
          worksheet.addRow({
            s_no: s_no++,
            _id: order._id,
            userId: order.userId,
            product: product.product, // Access 'product' from the nested structure
            quantity: product.quantity, // Access 'quantity' from the nested structure
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            deliveredStatus: order.delivered ? order.delivered.status : '',
            date: order.date,
            
          });
        });
      });
      
      // Style the header row
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });
      
      // Set response headers for download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      
      res.setHeader("Content-Disposition", 'attachment;filename=todaysales.xlsx');
      
      // Send the workbook as a response
      return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
      });
      
  } catch (error) {
    console.log(error)
  }
}

const getDashboard =async (req,res)=>{
try {
  
  const ordersData= await orderHelpers.getOrdertotal()
  const orders =ordersData[0]
   const categorySales =await orderHelpers.categorySales()
   const salesData = await orderHelpers.salesData()
    const salesCount = await orderHelpers.salesCount()
   const categoryCount  = await categoryHelpers.categoryCount()
   const productsCount  = await productHelpers.productsCount()
   const onlinePay = await orderHelpers.getOnlineCount()
   const codPay = await orderHelpers.getCodCount()
   const latestorders = await orderHelpers.latestorders()
  //  console.log(orders,categorySales,salesData,salesCount,categoryCount,productsCount,onlinePay,codPay,latestorders,"orders total")
   console.log(categorySales,"get dashB")
   res.render('./admin/dashboard',{orders,productsCount,categoryCount,
        onlinePay:onlinePay[0],salesData,order:latestorders,salesCount,
        codPay:codPay[0],categorySales})
  
}
 catch (error) {
  console.log(error)
}

// res.render('./admin/dashboard')
}

const allproducts = async (req,res)=>{
  try {
    if(req.session.admin){
      const promises = [
        productHelpers.getAllProducts(),
        productHelpers.getAllListedCategory()
      ];
      Promise.all(promises)
      .then(([products,category]) => {
        console.log(category,"category");
        res.render('./admin/adminPanel', { products,category });
      })
      .catch((error) => {
        console.log('Failed to retrieve products:', error);
        // Handle error
      });

      }
      else{
        res.render('admin/admin-login');
      }
}
catch (error) {
    console.log(error.message);
  }
}

const getOrderDetails= async(req,res)=>{
  const orderId = req.query.OrderId
  const order = await adminHelpers.getOrderDetails(orderId)
  // console.log(req.query,"in ac getorderdetails");
  console.log(order,"in ac getorderdetails");
  res.render('./admin/admin-orderdetails',{order})

}

const updateDeliveryStatus=async(req,res)=>{
  try {
    console.log(req.body,"in a-c updatedeliverystat");
    // const status = req.query.status
    // const orderId =req.query.orderId
    if(req.body.status==='delivered'){
      adminHelpers.updatedelivered(req.body)
    }
    if(req.body.status==='returned'){
      adminHelpers.getOrderTotal(req.body).then((data)=>{
        console.log(data,"order tot")
        walletHelper.updateWalletAmount(data.totalAmount,data.userId)
      })
    }
  
   await  adminHelpers.updateDeliveryStatus(req.body).then((response)=>{
    
    res.json(response)
  })
  } catch (error) {
    console.log(error);

  }
}

const getAllOrders=async (req,res)=>{
  try {
    
    console.log("here in a-c getallorders");
  const orders=  await adminHelpers.allOrders()
    res.render('./admin/adminPanel-orders',{orders})
  } catch (error) {
    console.log(error);
  }
}

const editCategory=async (req,res)=>{
  try {
    let prevName=req.body.cName
    let newName=req.body.newcName

    let CategoryExist= await productHelpers.findCategory({Category:newName})
    let category= prevName
    // console.log(CategoryExist,"catExist");
    if(CategoryExist.length===0){
      console.log("!categoryExist")
    await productHelpers.changeCategoryName(prevName,newName)
    await productHelpers.changeProductCategoryName(prevName,newName)
    res.redirect('/admin/getAllCategory');
    }else{
      console.log("categoryExist")
      res.render('./admin/admin-editcategory',{category,"message":"Category already exists"})
    }

  } catch (error) {
    
  }
}

const editCategoryPage=async (req,res)=>{
  try {
    let categoryId=req.query.categoryId
    let category=req.query.categoryName
    // console.log(category,"catt");
    res.render('./admin/admin-editcategory',{category})
  } catch (error) {
    
  }

}


const categoryRelist=async (req,res)=>{
  try {
    
console.log("a_c cat relist");

    try {
      const categoryId = req.query.categoryId;
      const categoryName= req.query.categoryName
      const category = await productHelpers.getcategoryById({ _id: categoryId });
      await productHelpers.UndeleteCategoryProducts({Category:categoryName})
      
      if (!category) {
        console.log(category,"no category");
        // Handle the case when the product is not found
        return res.redirect('/admin/getAllCategory');
      }
  
      // Assuming you have a deleteProductById function in your productHelpers
     let reListed= await productHelpers.categoryRelist(categoryId);
     
     console.log(reListed,"relisted logged");
  
      // Handle the success case, e.g., redirect to the admin panel with a success message
      res.redirect('/admin/getAllCategory');
    } catch (err) {
      console.log(err);
      // Handle the error, e.g., redirect to the admin panel with an error message
      res.redirect('/admin');
    }



  } catch (error) {
    console.log(error);
  }
}


const categoryUnlist=async (req,res)=>{
  try {
    
console.log("a_c cat unlist");

    try {
      const categoryId = req.query.categoryId;
      const categoryName= req.query.categoryName
     const category= await productHelpers.getcategoryById({ _id: categoryId });
      await productHelpers.deleteCategoryProducts({Category:categoryName})
      if (!category) {
        console.log(category,"no category");
        // Handle the case when the product is not found
        return res.redirect('/admin/getAllCategory');
      }
  
      // Assuming you have a deleteProductById function in your productHelpers
      await productHelpers.categoryUnlist(categoryId);

     
  
      // Handle the success case, e.g., redirect to the admin panel with a success message
      res.redirect('/admin/getAllCategory');
    } catch (err) {
      console.log(err);
      // Handle the error, e.g., redirect to the admin panel with an error message
      res.redirect('/admin');
    }



  } catch (error) {
    console.log(error);
  }
}



const addCategory = async (req, res) => {
  try {
    res.render('./admin/adminaddCategory')
  }catch (error) {
    console.log(error.message);
  }
}

const InsertCategory= async (req, res) => {
  try {
    console.log(req.body.cName,"// here insertcategory");
      try {
        let category={ Category: req.body.cName }
        await productHelpers.findCategory(category).then(async (data)=>{
          console.log(data,"data in insrt cat");
          if(!data){
            console.log(data,"inside if data in insrt cat");
            await productHelpers.addCategory(category).then(()=>{
              // res.render('./admin/add-product');
              res.redirect('/admin/add-product')
            })
          }
        })
        res.render('./admin/adminaddCategory',{"message":"Category already exists"})
          // console.log(eproducts,"here");
         
        } catch (error) {
          console.log('Failed to add Category:', error);
          res.status(500).send('Internal Server Error');
        }
  }
  catch (error) {
      console.log(error.message);
    }
}




const getAllCategory = async (req, res) => {
  try {
   const category=await productHelpers.getAllCategory()
    res.render('./admin/adminPanel-category',{category})
  }catch (error) {
    console.log(error.message);
  }
}

const getAdminLogin = async (req, res) => {
    try {
        if(req.session.admin){
          const promises = [
            productHelpers.getAllProducts(),
            productHelpers.getAllListedCategory()
          ];
          Promise.all(promises)
          .then(([products,category]) => {
            // console.log(EarRingsProduct);
            res.render('./admin/adminPanel', { products,category });
          })
          .catch((error) => {
            console.log('Failed to retrieve products:', error);
            // Handle error
          });


            // productHelpers.getAllProducts((products) => {
            //   if (products) {
            //     res.render('./admin/adminPanel', { products });
            //     console.log(products);
            //   } else {
            //     // Handle error
            //     console.log('Failed to retrieve products');
            //   }
            //   // res.render('./admin/adminPanel')
            // });
          }
          else{
            res.render('admin/admin-login');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const verifyAdmin = async (req, res) => {
    try {
        try {
            const email = req.body.email;
            const password=req.body.password
            const admin = await userHelpers.getAdminByMail({ email,password});
            console.log("here /getadminbymail", admin);
            if (admin.Admin) {
              // Handle the case when the admin is not found
              req.session.admin=true
              return res.redirect('/admin');
            }
          else{
            // Render the admin profile page with the retrieved admin data
            res.render('admin/admin-login');
          }
          } catch (err) {
            console.log(err);
            res.redirect('/'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const logOut = async (req, res) => {
    try {
        req.session.admin=false
        res.redirect('/admin')
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminGetProduct = async (req, res) => {
    try {
        try {
            // console.log("here /admineditproduct");
            const productId = req.query.productId;
            const product = await productHelpers.getProductById({ _id: productId });
            console.log("here /admineditproduct",product);
            if (!product) {
              // Handle the case when the product is not found
              return res.redirect('/admin');
            }
        
            res.render('admin/admineditproduct',  { product: product });
          } catch (err) {
            console.log(err);
            res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminGetUser = async (req, res) => {
    try {
        try {
            const userId = req.query.userId; 
            const user = await userHelpers.getUserById({ _id: userId }); 
            console.log("here /adminedituser", user);
            if (!user) {
              // Handle the case when the user is not found
              return res.redirect('/admin');
            }
        
            res.render('admin/adminedituser', { user: user }); 
          } catch (err) {
            console.log(err);
            res.redirect('/admin'); // Handle the error, e.g., redirect to the admin panel
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminEditUser = async (req, res) => {
    try {
        userHelpers.updateUser(req.params.id, req.body).then(() => {
            res.redirect('/admin/allUsers');
          }); 
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminBlockUser = async (req, res) => {
    try {
        console.log(req.query.userId,"blockkkk");
        userHelpers.updateUserBlockedStatus(req.query.userId).then(()=>{
          res.redirect('/admin/allUsers');
        })
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminUnBlockUser = async (req, res) => {
    try {
        console.log(req.query.userId,"Unnn_blockkkk");
        userHelpers.updateUserUnBlockedStatus(req.query.userId).then(()=>{
          res.redirect('/admin/allUsers');
        })
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminDeleteUser = async (req, res) => {
    try {
        try {
            const userId = req.query.userId; 
            const user = await userHelpers.getUserById(userId); 
            
            if (!user) {
              // Handle the case when the user is not found
              return res.redirect('/admin');
            }
        
            
            await userHelpers.deleteUserById(userId);
        
            // Handle the success case, e.g., redirect to the admin panel with a success message
            res.redirect('/admin/allUsers');
          } catch (err) {
            console.log(err);
            // Handle the error, e.g., redirect to the admin panel with an error message
            res.redirect('/admin');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminDeleteProduct = async (req, res) => {
    try {
        try {
            const productId = req.query.productId;
            const product = await productHelpers.getProductById({ _id: productId });
            
            if (!product) {
              // Handle the case when the product is not found
              return res.redirect('/admin');
            }
        
            // Assuming you have a deleteProductById function in your productHelpers
            await productHelpers.softDeleteProduct(productId);
        
            // Handle the success case, e.g., redirect to the admin panel with a success message
            res.redirect('/admin');
          } catch (err) {
            console.log(err);
            // Handle the error, e.g., redirect to the admin panel with an error message
            res.redirect('/admin');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminEditProduct= async (req, res) => {
    // try {
    //     productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    //         res.redirect('/admin')
    //         if(req.files){
    //           let image =req.files.Image
    //           console.log(image,"//image");
    //           image.mv('./public/product-images/'+req.params.id+'.jpg')
    //         }
    //       }) 
    // }
    // catch (error) {
    //     console.log(error.message);
    //   }
    try {
      const deletedImages = req.body.deletedImages ? req.body.deletedImages.split(",") : [];
      console.log(deletedImages,"del imgs");
      productHelpers.updateProduct(req.params.id,req.body,deletedImages).then((data)=>{
          console.log(req.files, "in here multer");

          if (deletedImages && deletedImages.length > 0) {
            deletedImages.forEach(imgName => {
                console.log("Attempting to delete:", imgName);
                const imagePath = `./public/product-images/${imgName}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, err => {
                        if (err) {
                            console.error("Error deleting image: ", err.message);
                        } else {
                            console.log("Successfully deleted image:", imgName);
                        }
                    });
                } else {
                    console.error("Image not found on server:", imgName);
                }
                
                
             
            });
        }
          if (req.files && req.files['images[]']) {
            
            const images = req.files['images[]'];
            console.log(images,"entered");
            // const destinationPath = './public/product-images/';
            const movePromises = [];
            let id=data.id
            console.log(id,"id");
        
            for (let i = 0; i < images.length; i++) {
              const image = images[i];
              const movePromise = new Promise((resolve, reject) => {
                image.mv('./public/product-images/'+id+i+'.jpg', (err) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve();
                  }
                });
              });
              movePromises.push(movePromise);
            }
        
            // Wait for all file moves to complete
            Promise.all(movePromises)
              .then(() => {
                // All files moved successfully
                // Perform any other actions you need to do after file upload
        
                // Send response or redirect
                res.redirect('/admin')
              })
              .catch((error) => {
                console.log('Failed to move images:', error);
                // Handle the error
                res.status(500).send('Failed to add product');
              });
          } else {
            // Handle case where no images were uploaded
            productHelpers.updateProduct(req.params.id,req.body) .then(() => {
              // All files moved successfully
              // Perform any other actions you need to do after file upload
      
              // Send response or redirect
              res.redirect('/admin')
            })
            .catch((error) => {
              console.log('Failed to update product:', error);
              // Handle the error
              res.status(500).send('Failed to add product');
            });

            
          }
        });
        
          }
          catch (error) {
              console.log(error.message);
            }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddProductPage= async (req, res) => {
    try {
      const category= await productHelpers.getAllListedCategory()
      console.log(category,"add-product");
        res.render('admin/add-product',{category})
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddProduct= async (req, res) => {
    try {
        
productHelpers.addProduct(req.body, (id) => {
    console.log(req.files, "in here multer");
    if (req.files && req.files['images[]']) {
      
      const images = req.files['images[]'];
      console.log(images,"entered");
      // const destinationPath = './public/product-images/';
      const movePromises = [];
  
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const movePromise = new Promise((resolve, reject) => {
          image.mv('./public/product-images/'+id+i+'.jpg', (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        movePromises.push(movePromise);
      }
  
      // Wait for all file moves to complete
      Promise.all(movePromises)
        .then(() => {
          // All files moved successfully
          // Perform any other actions you need to do after file upload
  
          // Send response or redirect
          res.render("admin/add-product")
        })
        .catch((error) => {
          console.log('Failed to move images:', error);
          // Handle the error
          res.status(500).send('Failed to add product');
        });
    } else {
      // Handle case where no images were uploaded
      // ...
    }
  });
  
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddUserPage= async (req, res) => {
    try {
        res.render('admin/add-user')
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const adminAddUser= async (req, res) => {
    try {
        console.log(req.body,"herein ad adduser");
  
        userHelpers.addUser(req.body,(id)=>{
          
          // let id=req.body._id
          res.redirect("/admin/add-User")
          
            })
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const getAllUsers= async (req, res) => {
    try {
        userHelpers.getAllUsers()
        .then((users) => {
          // console.log("in/getusersadminp");
          if (users) {
            console.log(users[0].Email,"usercheck");
            res.render('./admin/adminPanel-users', { users });
            console.log(users);
          } else {
            // Handle error
            console.log('Failed to retrieve users');
          }
        })
        .catch((error) => {
          console.log('Error retrieving users:', error);
          // Handle error
        });
    }
    catch (error) {
        console.log(error.message);
      }

}

/////////////////////////////////////////////////////////////////////////////////////

const getNecklaces= async (req, res) => {
    try {
        try {
            const nproducts = await productHelpers.getNecklace_Products();
            // console.log(eproducts,"here");
            res.render('./admin/adminPanel', { products: nproducts });
          } catch (error) {
            console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
          }
    }
    catch (error) {
        console.log(error.message);
      }
}
/////////////////////////////////////////////////////////////////////////////////////

const getBangles= async (req, res) => {
    try {
        try {
            const Bangleproducts = await productHelpers.getBangles_Products();
            // console.log(clothproducts,"here");
            res.render('./admin/adminPanel', { products: Bangleproducts });
          } catch (error) {
            console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}

/////////////////////////////////////////////////////////////////////////////////////

const getEarRings= async (req, res) => {
    try {
        try {
            const EarRingproducts = await productHelpers.getEarRings_Products();
            // console.log(clothproducts,"here");
            res.render('./admin/adminPanel', { products: EarRingproducts });
          } catch (error) {
            console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
          }  
    }
    catch (error) {
        console.log(error.message);
      }
}

/////////////////////////////////////////////////////////////////////////////////////

const getCategory= async (req, res) => {
  try {
    cName=req.query.category
    const promises = [
      productHelpers.getCategory(cName),
      productHelpers.getAllListedCategory()
    ];
    
    Promise.all(promises)
    .then(([products,category]) => {
      // console.log(EarRingsProduct);
      res.render('./admin/adminPanel', { products,category });
    })
    .catch((error) => {
      console.log('Failed to retrieve products:', error);
      // Handle error
    });


    
  //   cName=req.query.category
  //   const categoryProducts = await productHelpers.getCategory(cName);
  //  let  products= categoryProducts
  //   res.render('./admin/adminPanel', { products });
  }
  catch (error) {
    console.log('Failed to get products:', error);
            res.status(500).send('Internal Server Error');
  }
}
  

    
/////////////////////////////////////////////////////////////////////////////////////

module.exports={
  addCategoryOfferPage,
    getAdminLogin,
    verifyAdmin,
    logOut,
    adminGetProduct,
    adminGetUser,
    adminEditUser,
    adminBlockUser,
    adminUnBlockUser,
    adminDeleteUser,
    adminDeleteProduct,
    adminEditProduct,
    adminAddProductPage,
    adminAddProduct,
    adminAddUserPage,
    adminAddUser,
    getAllUsers,
    getNecklaces,
    getBangles,
    getEarRings,
    getCategory,
    getAllCategory,
    InsertCategory,
    addCategory,
    categoryUnlist,
    categoryRelist,
    editCategoryPage,
    editCategory,
    getAllOrders,
    updateDeliveryStatus,
    getOrderDetails,
    allproducts,
    getDashboard,
    totalSaleExcel,
    totalRevenueExcel,
    productListExcel,
    allOrderStatus,
    customPDF,
    orderDetailPDF,
    addBannerPage,
    addBanner,
    bannerListPage,
    editBannerPage,
    editBanner,
    deleteBanner,
    addCategoryOffer
    

}
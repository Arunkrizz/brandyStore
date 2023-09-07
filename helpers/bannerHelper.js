const connectDB = require("../config/connection");
const mongoose = require('mongoose');
const Banner = require('../models/banner');
const { findByIdAndDelete } = require("../models/product");

const deleteBanner = async (id)=>{
    return new Promise ((resolve,reject)=>{
        console.log(id,"id in delete banner");
        connectDB()
        .then(()=>{
          Banner.findByIdAndDelete(id).then ((response)=>{
                resolve(response)
            })
        })
    })
}

const editBannerHelper = async (details,Image)=>{
    return new Promise(async (resolve, reject) => {
        console.log(Image,"jjj");
        const imageName= details.img
        connectDB().then (async ()=>{
            Banner.findByIdAndUpdate(details.id,{$set:{
                title:details.title,
                image:imageName,
                link: details.link
            }})
           .then((response) => {
                console.log(Image,response, "in here multer");
                if ( Image) {
                  
                  const images = Image;
                  console.log(images,"entered");
                  // const destinationPath = './public/product-images/';
                  const movePromises = [];
              
                  
                    const image = images;
                    const movePromise = new Promise((resolve, reject) => {
                      image.mv('./public/banner-images/'+imageName, (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      });
                    });
                    movePromises.push(movePromise);
                  
              
                  // Wait for all file moves to complete
                  Promise.all(movePromises)
                    .then(() => {
                      // All files moved successfully
                      // Perform any other actions you need to do after file upload
              
                      // Send response or redirect
                    //   res.redirect("/admin/addBanner");
                    })
                    .catch((error) => {
                      console.log('Failed to move images:', error);
                      // Handle the error
                    //   res.status(500).send('Failed to add Banner');
                    });
                } else {
                  // Handle case where no images were uploaded
                  // ...
                }
                resolve(response);
            });
        })
       
    });
}

const fetchBanner = async (id)=>{
    return new Promise ((resolve,reject)=>{
        connectDB()
        .then(()=>{
            console.log(id,"in fetch banner");
            Banner.findById(id).then((response) => {
                resolve(response);
            });  
        })
    })
}

const bannerListHelper =async ()=>{
    return new Promise ((resolve ,reject)=>{
        connectDB()
        .then(()=>{
            Banner.find().then((response) => {
                resolve(response);
            });
        })
    })
}

const addBannerHelper=async(texts, Image) => {
    return new Promise(async (resolve, reject) => {
        console.log(Image,"jjj");
        const imageName= Date.now() +Image.name
        connectDB().then (async ()=>{
            const banner = new Banner({
                title: texts.title,
                link: texts.link,
                image: imageName ,
            });
            await banner.save().then((response) => {
                console.log(Image,response, "in here multer");
                if ( Image) {
                  
                  const images = Image;
                  console.log(images,"entered");
                  // const destinationPath = './public/product-images/';
                  const movePromises = [];
              
                  
                    const image = images;
                    const movePromise = new Promise((resolve, reject) => {
                      image.mv('./public/banner-images/'+imageName, (err) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve();
                        }
                      });
                    });
                    movePromises.push(movePromise);
                  
              
                  // Wait for all file moves to complete
                  Promise.all(movePromises)
                    .then(() => {
                      // All files moved successfully
                      // Perform any other actions you need to do after file upload
              
                      // Send response or redirect
                    //   res.redirect("/admin/addBanner");
                    })
                    .catch((error) => {
                      console.log('Failed to move images:', error);
                      // Handle the error
                    //   res.status(500).send('Failed to add Banner');
                    });
                } else {
                  // Handle case where no images were uploaded
                  // ...
                }
                resolve(response);
            });
        })
       
    });
}

module.exports={
    addBannerHelper, 
    bannerListHelper,
    fetchBanner,
    editBannerHelper,
    deleteBanner
}
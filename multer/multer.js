const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/product-images/');
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  });

  const addBanner = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/banner-images"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const editBanner = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage: storage });
  const addBannerupload = multer({ storage: addBanner }).single("image");
  const editBannerupload = multer({ storage: editBanner }).single("image");
  
  module.exports = {
    upload: multer({ storage: storage }).array("file"),
    update: multer({ storage: storage }).array("images"),
    addBannerupload,
    editBannerupload,
  };
  
  // Example error handling middleware
  function errorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      res.status(err.status).send(err.message);
    } else {
      console.log(err);
      next(err);
    }
  }
  
  module.exports.errorHandler = errorHandler;
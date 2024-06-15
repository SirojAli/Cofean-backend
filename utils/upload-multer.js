const path = require("path");
const multer = require("multer");
const uuid = require("uuid");

/* MULTER IMAGES UPLOADER*/
function getTargetImageStorage(address) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/${address}`);
    },
    filename: (req, file, cb) => {
      console.log(file);
      const extension = path.parse(file.originalname).ext;
      const random_name = uuid.v4() + extension;
      cb(null, random_name);
    },
  });
}
const makeUploader = (address) => {
  const storage = getTargetImageStorage(address);
  return multer({ storage: storage });
};
module.exports = makeUploader;

// const product_storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads/products");
//   },
//   filename: (req, file, cb) => {
//     console.log(file);
//     const extension = path.parse(file.originalname).ext;
//     const random_name = uuid.v4() + extension;
//     cb(null, random_name);
//   },
// });
// module.exports.uploadProductImage = multer({ storage: product_storage });

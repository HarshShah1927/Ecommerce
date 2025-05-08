const cloudinary = require("cloudinary").v2;
const multer = require("multer");

cloudinary.config({
  cloud_name: "dm700djba",
  api_key: "197158717287625",
  api_secret: "ZCpwhs6wRNowUlrBwpmInL-pQ-Y",
});

cloudinary.config({
  cloud_name: "dibhaf2iz",
  api_key: "466631793684929",
  api_secret: "WmIbrdY-qQ7GMYH2INB0GHLknJU",
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  const result = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });

  return result;
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };

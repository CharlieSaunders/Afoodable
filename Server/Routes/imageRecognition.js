const express = require('express');
const imageRecognitionRoutes = express.Router();
const multer = require('multer');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

let storage = multer.diskStorage({
  destination: function(req, file, callBack){
    callBack(null, '../Client/src/assets/images/temp/');
  },
  filename: function(req, file, callBack){
    callBack(null, file.originalname);
  }
});

let upload = multer({storage: storage});

// Test OCR
imageRecognitionRoutes.route('/api/ai/uploadReceipt').post(upload.single('image'), async function (_req, res){
  res.json("uploaded image");
});

imageRecognitionRoutes.route('/api/ai/deleteReceipt').post(upload.single('image'), async function (_req, res){
  fs.readdir('../Client/src/assets/images/temp/', (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      console.log(file)
      unlinkAsync(`../Client/src/assets/images/temp/${file}`);
    }
  });

  res.json("deleted image");
});

module.exports = imageRecognitionRoutes;
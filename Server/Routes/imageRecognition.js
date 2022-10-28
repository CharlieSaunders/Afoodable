const tesseract = require('tesseract.js');
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
imageRecognitionRoutes.route('/api/ai/imageRecognition').post(upload.single('image'), async function (_req, res){
  
  let imageUrl = `../Client/src/assets/images/temp/${_req.file.originalname}`;
  tesseract.recognize(
  imageUrl,
  'eng',
  {}
  ).then(({ data: { text } }) => {
    unlinkAsync(imageUrl);
    res.json(text);
  })
});


module.exports = imageRecognitionRoutes;
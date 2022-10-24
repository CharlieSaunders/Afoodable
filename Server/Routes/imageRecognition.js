const tesseract = require('tesseract.js');
const express = require('express');
const imageRecognitionRoutes = express.Router();
const dbo = require('../Data/conn');

// Test OCR
imageRecognitionRoutes.route('/api/ai/imageRecognition').post(async function (_req, res){
  console.log(_req.file);
  var response = await getTextFromImage(_req.file);
  res.json(response);
});

async function getTextFromImage(file) {
  tesseract.recognize(
  '../Client/src/assets/testReceipt.jpeg',
  'eng',
  { 
    logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
  })
}

module.exports = imageRecognitionRoutes;
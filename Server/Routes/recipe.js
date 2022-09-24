const express = require('express');
const recipeRoutes = express.Router();
const dbo = require('../Data/conn');

recipeRoutes.route('/api/recipe').get(async function (_req, res) {
  console.log("Get recipes has been disabled from hitting the db live. (recipe.js)")
  var hardcodedResult = [{"_id":"632dcdc55f58ec0a46ed73b9","reference":"f69e49d1-971c-473e-af7e-d3a0346fffd3","name":"Sea Bass & Salad","type":"Dinner","rating":4,"imageUrl":"sea-bass.jpg","ingredients":{}},{"_id":"632dcff95f58ec0a46ed73be","reference":"7cd663ed-e716-44a0-be11-f16ebc664327","name":"*Pepperoni Pizza","type":"Lunch","rating":3,"imageUrl":"pepperoni-pizza.jpg","ingredients":{}},{"_id":"632dd0585f58ec0a46ed73bf","reference":"499d881c-a7cc-4532-aa0f-4165d1f5b37d","name":"Baked Potato","type":"Dinner","rating":5,"imageUrl":"baked-potato-cheese-beans.jpg","ingredients":{}},{"_id":"632dd09f5f58ec0a46ed73c1","reference":"6146378e-98f4-4741-897e-a11d9e81c71c","name":"Mushroom Risotto","type":"Dinner","rating":5,"imageUrl":"risotto.jpg","ingredients":{}},{"_id":"632dd0df5f58ec0a46ed73c2","reference":"d81533d6-77ff-4615-b2dd-3ab5c5be333a","name":"Poached Egg on Toast","type":"Breakfast","rating":5,"imageUrl":"poached-eggs-on-toast.jpeg","ingredients":{}},{"_id":"632dd1205f58ec0a46ed73c4","reference":"bfa4b4f6-ee06-4da4-ac2b-9684746ebd68","name":"Steak & Mash","type":"Dinner","rating":5,"imageUrl":"steak-and-mash.jpg","ingredients":{}},{"_id":"632dd18f5f58ec0a46ed73c6","reference":"3cde0ecc-00d1-4876-b3a8-1b7d6bd6e9bb","name":"Spaghetti Carbonara","type":"Dinner","rating":4,"imageUrl":"carbonara.jpg","ingredients":{}},{"_id":"632dd1bd5f58ec0a46ed73c7","reference":"3d8d5956-25f5-4b4c-84a2-398a536a9bc5","name":"Camembert & Garlic Bread","type":"Dinner","rating":4,"imageUrl":"camembert-garlic-bread.jpg","ingredients":{}},{"_id":"632dd1ef5f58ec0a46ed73c8","reference":"2552dbba-5f8d-4c35-a36e-9ee8321cee42","name":"Overnight Weetabix","type":"Breakfast","rating":4,"imageUrl":"overnight-weetabix.jpg","ingredients":{}}];
  await res.json(hardcodedResult);
  //const dbConnect = dbo.getDb();
  // dbConnect
  //   .collection('recipes')
  //   .find({})
  //   .limit(50)
  //   .toArray(function (err, result) {
  //     if (err) {
  //       res.status(400).send('Error fetching listings!');
  //     } else {
  //       res.json(result);
  //     }
  //   });
});

module.exports = recipeRoutes;
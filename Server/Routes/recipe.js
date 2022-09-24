const express = require('express');
const recipeRoutes = express.Router();
const dbo = require('../Data/conn');
var mongoDb = require('mongodb');

recipeRoutes.route('/api/recipes').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('recipes')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
    if (err) {
      res.status(400).send('Error fetching listings!');
      } else {
      res.json(result);
    }
  });
});

recipeRoutes.route('/api/recipes/:recipe').get(async function (_req, res) {
  let docReference = _req.params.recipe;
  const dbConnect = dbo.getDb();
  dbConnect
    .collection('recipes')
    .find({"_id": new mongoDb.ObjectId(docReference)})
    .limit(1)
    .toArray(function (err, result) {
    if (err) {
      res.status(400).send('Error fetching listings!');
      } else {
      res.json(result);
    }
  });
});

module.exports = recipeRoutes;
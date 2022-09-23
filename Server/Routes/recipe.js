const express = require('express');
const recipeRoutes = express.Router();
const dbo = require('../Data/conn');

recipeRoutes.route('/recipe').get(async function (_req, res) {
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

module.exports = recipeRoutes;
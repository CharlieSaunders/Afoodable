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

recipeRoutes.route('/api/recipes').patch(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect.collection('recipes').updateOne(
      { 
        _id: new mongoDb.ObjectId(_req.body._id) 
      },
      {
        $set: { 
          'description': _req.body.description, 
          'imageUrl': _req.body.imageUrl,
          'ingredients': _req.body.ingredients,
          'name': _req.body.name,
          'rating': _req.body.rating,
          'reference': _req.body.reference,
          'type': _req.body.type,
          'steps': _req.body.steps
        }
      }
    );
});

recipeRoutes.route('/api/recipes').post(async function (_req, res) {
  const dbConnect = dbo.getDb();
  dbConnect.collection('recipes').insertOne(
  {
    'reference': _req.body.reference,
    'name': _req.body.name,
    'type': _req.body.type,
    'rating': _req.body.rating,
    'imageUrl': _req.body.imageUrl,
    'description': _req.body.description,
    'steps': [],
    'ingredients': []
  })
})

recipeRoutes.route('/api/recipes/:id').delete(async function(_req, res) {
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  adbConnect.collection('recipes').deleteOne({
    _id: new mongoDb.ObjectId(docReference) 
  });
})

module.exports = recipeRoutes;
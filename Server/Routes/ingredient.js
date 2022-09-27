const express = require('express');
const ingredientRoutes = express.Router();
const dbo = require('../Data/conn');
var mongoDb = require('mongodb');

ingredientRoutes.route('/api/ingredients').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  await dbConnect.collection('ingredients')
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

ingredientRoutes.route('/api/ingredients').post(async function (_req, res) {
  const dbConnect = dbo.getDb();
  await dbConnect.collection('ingredients').insertOne(
      { 
        'name': _req.body.name, 
        'cost': _req.body.cost,
        'servingSize': _req.body.servingSize,
        'servingMetric': _req.body.servingMetric
      }
  );
})

ingredientRoutes.route('/api/ingredients').patch(async function(_req, res) {
  const dbConnect = dbo.getDb();
  await dbConnect.collection('ingredients').updateOne(
    { 
      _id: new mongoDb.ObjectId(_req.body._id) 
    },
    {
      $set: { 
        'name': _req.body.name, 
        'cost': _req.body.cost,
        'servingSize': _req.body.servingSize,
        'servingMetric': _req.body.servingMetric
      }
    }
  );
})

ingredientRoutes.route('/api/ingredients/:id').delete(async function(_req, res){
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  await dbConnect.collection('ingredients').deleteOne({ 
    _id: new mongoDb.ObjectId(docReference) 
  });
})

module.exports = ingredientRoutes;
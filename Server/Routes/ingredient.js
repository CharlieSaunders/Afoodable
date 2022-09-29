const express = require('express');
const ingredientRoutes = express.Router();
const dbo = require('../Data/conn');
const GenericCache = require('./Caches/genericCache');

let mongoDb = require('mongodb');
let ingredientsCache = new GenericCache("Ingredient Cache")

// GET ALL INGREDIENTS
ingredientRoutes.route('/api/ingredients').get(async function (_req, res) {
  if(ingredientsCache.setup){
    res.json(ingredientsCache.get());
  }else{
    const dbConnect = dbo.getDb();
    await dbConnect.collection('ingredients')
      .find({})
      .limit(50)
      .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
        } else {
        res.json(result);
        ingredientsCache.set(result);
      }
    });
  }
});

// CREATE NEW INGREDIENT
ingredientRoutes.route('/api/ingredients').post(async function (_req, res) {
  const dbConnect = dbo.getDb();
  let newIngredient = await dbConnect.collection('ingredients').insertOne(
      { 
        'name': _req.body.name, 
        'cost': _req.body.cost,
        'servingSize': _req.body.servingSize,
        'servingMetric': _req.body.servingMetric
      }
  );
  ingredientsCache.setSingle(await getSingleIngredient(newIngredient.insertedId.toString()));
})

// UPDATE INGREDIENT
ingredientRoutes.route('/api/ingredients').patch(async function(_req, res) {
  let docId = _req.body._id;
  const dbConnect = dbo.getDb();
  await dbConnect.collection('ingredients').updateOne(
    { 
      _id: new mongoDb.ObjectId(docId) 
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

  ingredientsCache.setSingle(await getSingleIngredient(docId));
})

// DELETE INGREDIENT
ingredientRoutes.route('/api/ingredients/:id').delete(async function(_req, res){
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  await dbConnect.collection('ingredients').deleteOne({ 
    _id: new mongoDb.ObjectId(docReference) 
  });

  ingredientsCache.unset(docReference);
})

async function getSingleIngredient(id){
  const dbConnect = dbo.getDb();
  let ingredient = await dbConnect
    .collection('ingredients')
    .findOne({"_id": new mongoDb.ObjectId(id)});
  return ingredient;
}

module.exports = ingredientRoutes;
const express = require('express');
const dbo = require('../Data/conn');
const GenericCache = require('./Caches/genericCache');

let mongoDb = require('mongodb');
let recipeTagRoutes = express.Router();
let recipesTagCache = new GenericCache("Recipe Tag Cache");

// GET ALL RECIPES
recipeTagRoutes.route('/api/recipes/tags').get(async function (_req, res) {
    if(recipesTagCache.setup){
      res.json(recipesTagCache.get());
    }else{
      const dbConnect = dbo.getDb();
      await dbConnect
        .collection('recipeTags')
        .find({})
        .toArray(function (err, result) {
        if (err) {
            res.status(400).send('Error fetching listings!');
          } else {
            res.json(result);
            recipesTagCache.set(result);
        }
      });
    }
});
 
// CREATE NEW RECIPE TAG
recipeTagRoutes.route('/api/recipes/tags').post(async function (_req, res) {
    const dbConnect = dbo.getDb();
    let newRecipeTag = await dbConnect.collection('recipeTags').insertOne(
    {
      'name': _req.body.Name,
    });
    recipesTagCache.setSingle(await getSingleRecipeTag(newRecipeTag.insertedId.toString()));
    res.json(newRecipeTag);
  });

  
async function getSingleRecipeTag(id){
    const dbConnect = dbo.getDb();
    let recipe = await dbConnect
      .collection('recipeTags')
      .findOne({"_id": new mongoDb.ObjectId(id)});
    return recipe;
  }
  

module.exports = recipeTagRoutes;
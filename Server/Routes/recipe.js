const express = require('express');
const recipeRoutes = express.Router();
const multer = require('multer');
const dbo = require('../Data/conn');
const GenericCache = require('./Caches/genericCache');

let mongoDb = require('mongodb');
const { ingredientsCache } = require('./ingredient');
let recipesCache = new GenericCache("Recipe Cache");

let storage = multer.diskStorage({
  destination: function(req, file, callBack){
    callBack(null, '../Client/src/assets/images/recipes/');
  },
  filename: function(req, file, callBack){
    callBack(null, `${file.originalname}.${file.mimetype.split("/")[1]}`);
  }
});

let upload = multer({storage: storage});

// GET ALL RECIPES
recipeRoutes.route('/api/recipes').get(async function (_req, res) {
  let recipes;
  let ingredients;

  if(!recipesCache.setup){
    const dbConnect = dbo.getDb();
    let getRecipesCall = dbConnect
      .collection('recipes')
      .find({})
      .toArray();

    recipesCache.set(await getRecipesCall);
  }

  if(!ingredientsCache.setup){
    const dbConnect = dbo.getDb();
    let getIngredientsCall = dbConnect
    .collection('ingredients')
    .find({})
    .toArray();

    ingredientsCache.set(await getIngredientsCall);
  }

  recipes = recipesCache.get();
  ingredients = ingredientsCache.get();
  
  recipes.forEach(async recipe => {
    recipe = await addRecipeData(recipe);
  })

  recipesCache.set(recipes);
  res.json(recipesCache.get());
});

// GET RECIPE BY ID
recipeRoutes.route('/api/recipes/:recipe').get(async function (_req, res) {
  let docReference = _req.params.recipe;
  let recipe = recipesCache.getSingle(docReference);

  if(recipe == undefined){
    const dbConnect = dbo.getDb();
    recipe = await dbConnect
      .collection('recipes')
      .findOne({"_id": new mongoDb.ObjectId(docReference)});
  }

  let recipeWithIngredients = await addRecipeData(recipe);
  res.json(recipeWithIngredients);
  recipesCache.setSingle(recipeWithIngredients);
});

// UPDATE RECIPE
recipeRoutes.route('/api/recipes').patch(async function (_req, res) {
  let docId = _req.body._id;
  const dbConnect = dbo.getDb();
  var response = await dbConnect.collection('recipes').updateOne(
      { 
        _id: new mongoDb.ObjectId(docId) 
      },
      {
        $set: { 
          'description': _req.body.description, 
          'imageUrl': _req.body.imageUrl,
          'ingredients': _req.body.ingredients,
          'name': _req.body.name,
          'rating': _req.body.rating,
          'type': _req.body.type,
          'steps': _req.body.steps,
          'serves': _req.body.serves,
          'favourite': _req.body.favourite
        }
      }
    );
  recipesCache.setSingle(await getSingleRecipe(docId));
  res.json(response);
});

// CREATE NEW RECIPE
recipeRoutes.route('/api/recipes').post(async function (_req, res) {
  const dbConnect = dbo.getDb();
  let newRecipe = await dbConnect.collection('recipes').insertOne(
  {
    'reference': _req.body.reference,
    'name': _req.body.name,
    'type': _req.body.type,
    'rating': _req.body.rating,
    'ratings': 0,
    'imageUrl': _req.body.imageUrl,
    'description': _req.body.description,
    'steps': [],
    'ingredients': [],
    'serves': _req.body.serves,
    'favourite': false
  });
  recipesCache.setSingle(await getSingleRecipe(newRecipe.insertedId.toString()));
  res.json(newRecipe);
});

// DELETE RECIPE
recipeRoutes.route('/api/recipes/:id').delete(async function(_req, res) {
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  let deleted = await dbConnect.collection('recipes').deleteOne({
    _id: new mongoDb.ObjectId(docReference) 
  });
  recipesCache.unset(docReference);
  res.json(deleted);
})

// RATE RECIPE
recipeRoutes.route('/api/recipes/rating/:id').post(async function(_req, res){
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  let updated = await dbConnect.collection('recipes').updateOne(
    { 
      _id: new mongoDb.ObjectId(docReference) 
    },
    {
      $set: { 
        'rating': _req.body.rating,
        'ratings': _req.body.ratings
      }
    }
  );
  recipesCache.setSingle(await getSingleRecipe(docReference));
  res.json(updated);
});

// UPDATE RECIPE IMAGE
recipeRoutes.route('/api/recipes/image/:id').post(upload.single('recipeImage'), async function (_req, res){
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  let udpated = await dbConnect.collection('recipes').updateOne(
    { 
      _id: new mongoDb.ObjectId(docReference) 
    },
    {
      $set: { 
        'imageUrl': _req.file.filename
      }
    }
  );
  recipesCache.setSingle(await getSingleRecipe(docReference));
  res.json(udpated);
});


async function getSingleRecipe(id){
  const dbConnect = dbo.getDb();
  let recipe = await dbConnect
    .collection('recipes')
    .findOne({"_id": new mongoDb.ObjectId(id)});
  return recipe;
}

async function addRecipeData(recipe){
  if(!ingredientsCache.setup){
    const dbConnect = dbo.getDb();
    let getIngredientsCall = dbConnect
    .collection('ingredients')
    .find({})
    .toArray();

    ingredientsCache.set(await getIngredientsCall);
  }

  let newIngredients = [];
  recipe.macros = {
    protein: 0,
    fat: 0,
    carbohydrates: 0,
    calories: 0
  }
  recipe.ingredients.forEach(ingredient => {
    let ingredientObject = JSON.parse(ingredient);
    let matchingIngredient = ingredientsCache.getSingle(ingredientObject._id);
    matchingIngredient.quantity = ingredientObject.quantity;
    recipe.macros.protein += matchingIngredient.protein * matchingIngredient.quantity;
    recipe.macros.fat += matchingIngredient.fat * matchingIngredient.quantity;
    recipe.macros.carbohydrates += matchingIngredient.carbohydrates * matchingIngredient.quantity;
    recipe.macros.calories += matchingIngredient.calories * matchingIngredient.quantity;
    newIngredients.push(JSON.stringify(matchingIngredient));
  })
  recipe.ingredients = newIngredients;

  return recipe;
}

module.exports.recipeRoutes = recipeRoutes;
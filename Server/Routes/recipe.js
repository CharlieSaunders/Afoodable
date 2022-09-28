const express = require('express');
const recipeRoutes = express.Router();
const dbo = require('../Data/conn');
const multer = require('multer');
var mongoDb = require('mongodb');

const storage = multer.diskStorage({
  destination: function(req, file, callBack){
    callBack(null, '../Client/src/assets/images/recipes/');
  },
  filename: function(req, file, callBack){
    callBack(null, `${file.originalname}.${file.mimetype.split("/")[1]}`);
  }
});

const upload = multer({storage: storage});

recipeRoutes.route('/api/recipes').get(async function (_req, res) {
  const dbConnect = dbo.getDb();
  await dbConnect
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
  await dbConnect
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
  await dbConnect.collection('recipes').updateOne(
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
          'type': _req.body.type,
          'steps': _req.body.steps,
        }
      }
    );
});

recipeRoutes.route('/api/recipes').post(async function (_req, res) {
  const dbConnect = dbo.getDb();
  await dbConnect.collection('recipes').insertOne(
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
  await dbConnect.collection('recipes').deleteOne({
    _id: new mongoDb.ObjectId(docReference) 
  });
})

recipeRoutes.route('/api/recipes/rating/:id').post(async function(_req, res){
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  await dbConnect.collection('recipes').updateOne(
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
})

recipeRoutes.route('/api/recipes/image/:id').post(upload.single('recipeImage'), (_req, res, next) => {
  let docReference = _req.params.id;
  const dbConnect = dbo.getDb();
  dbConnect.collection('recipes').updateOne(
    { 
      _id: new mongoDb.ObjectId(docReference) 
    },
    {
      $set: { 
        'imageUrl': _req.file.filename
      }
    }
  );
});

module.exports = recipeRoutes;
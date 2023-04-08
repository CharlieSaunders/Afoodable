const express = require('express');
const nodemailer = require('nodemailer');
const dbo = require('../Data/conn');
const mongoDb = require('mongodb');
const GenericCache = require('./Caches/genericCache');
const emailTemplater = require('./Services/emailTemplater');
const { ShoppingListItem, Recipe } = require('./Types/ShoppingListTypes');

const emailRoutes = express.Router();
const emailCache = new GenericCache("Email Cache", true);

emailRoutes.route('/api/email').get(async function (_req, res){
  if(emailCache.setup){
    res.json(emailCache.get()[0]);
  }else{
    res.json(await getSecretsObject());
  }
})

emailRoutes.route('/api/email').patch(async function (_req, res){
  let docId = _req.body._id;
  const dbConnect = dbo.getDb();
  await dbConnect.collection('secrets').updateOne(
    { 
      _id: new mongoDb.ObjectId(docId) 
    },
    {
      $set: { 
        'emailName': _req.body.EmailName, 
        'emailSubject': _req.body.Subject,
        'emailTo': _req.body.Recipients,
        'emailTemplate': _req.body.Template,
        'emailEnabled': _req.body.EmailEnabled
      }
    }
  );

  emailCache.setSingle(await getSecretsObject());
  res.json("Success");
})

emailRoutes.route('/api/email').post(async function (_req, res) {
    let shoppingListItems = _req.body.ShoppingList.items
    if(shoppingListItems.length == 0){
      return res.json("No shopping list items");
    }

    let shoppingList = [];
    for(const key in shoppingListItems){
      const item = shoppingListItems[key];
      shoppingList.push(new ShoppingListItem(item.name, item.amount, item.servingMetric, item.servingSize));
    };

    let recipeItems = _req.body.Recipes;
    let recipes = [];
    recipeItems.forEach(recipe => {
      recipes.push(new Recipe(recipe.name, recipe.selectedAmount));
    })

    let emailCacheResults;
    if(emailCache.setup){
      emailCacheResults = emailCache.get()[0];
    }else{
      emailCacheResults = await getSecretsObject();
    }
    
    if(!emailCacheResults.emailEnabled){
      console.log("Emails disabled through config");
      return res.json("Disabled through config");
    }

    const transporter = nodemailer.createTransport({
      service: emailCacheResults.emailService,
      auth: {
        user: emailCacheResults.emailUser,
        pass: emailCacheResults.emailSecret,
      },
    });

    transporter.sendMail({
        from: `${emailCacheResults.emailName} ${emailCacheResults.emailUser}`,
        to: emailCacheResults.emailTo,
        subject: emailCacheResults.emailSubject, 
        html: emailTemplater.buildHtml(shoppingList, recipes, emailCacheResults),
      })
      .then(info => {
        console.log("Email Sent");
      })
      .catch(console.error);

    return res.json("Email attempted");
})

async function getSecretsObject(){
  const dbConnect = dbo.getDb();
  let secret = await dbConnect
    .collection('secrets')
    .find({})
    .toArray();
 
  emailCache.set(secret);
  return secret[0];
}

module.exports = emailRoutes;
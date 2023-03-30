const express = require('express');
const nodemailer = require('nodemailer');
const dbo = require('../Data/conn');
const GenericCache = require('./Caches/genericCache');
const emailTemplater = require('./Services/emailTemplater');
const { ShoppingListItem, Recipe } = require('./Types/ShoppingListTypes');

const emailRoutes = express.Router();
const emailCache = new GenericCache("Email Cache", true);

emailRoutes.route('/api/email').post(async function (_req, res) {
    let shoppingListItems = _req.body.ShoppingList.items
    if(shoppingListItems.length == 0){
      return res.json("No shopping list items");
    }

    let shoppingList = [];
    shoppingListItems.forEach(item => {
      shoppingList.push(new ShoppingListItem(item.name, item.amount, item.servingMetric, item.servingSize));
    });

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
        html: emailTemplater.buildHtml(shoppingList, recipes),
      })
      .then(info => {
        console.log("Email Sent");
      })
      .catch(console.error);

    return res.json("Success");
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
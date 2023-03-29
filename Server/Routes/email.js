const express = require('express');
const nodemailer = require('nodemailer');
const dbo = require('../Data/conn');
const emailTemplater = require('./Services/emailTemplater');
const { ShoppingListItem, Recipe } = require('./Types/ShoppingListTypes');
const emailRoutes = express.Router();

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

    const dbConnect = dbo.getDb();
    await dbConnect.collection('secrets')
    .find({})
    .limit(1)
    .toArray(function (err, result) {
        if (err) {
            console.log(`There was an error connecting to MongoDB Secrets. The application hasn't been terminated:\n${err}`);
        } else {
            var ingredients = "";
            var secret = result[0].gmailPassword;
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'afoodable.dev@gmail.com',
                pass: secret,
              },
            });
        
            transporter.sendMail({
                from: '"Afoodable" afoodable.dev@gmail.com',
                to: "charlie.g.saunders@gmail.com",
                subject: "🌟 Here's the shopping list you asked for...", 
                html: emailTemplater.buildHtml(shoppingList, recipes),
              })
              .then(info => {
                console.log({info});
              })
              .catch(console.error);
        }
    });

    return res.json("Success");
})

module.exports = emailRoutes;
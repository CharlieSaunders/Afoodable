const express = require('express');
const nodemailer = require('nodemailer');
const dbo = require('../Data/conn');
const mongoDb = require('mongodb');
const emailTemplater = require('./Services/emailTemplater');
const { ShoppingListItem, Recipe } = require('./Types/ShoppingListTypes');
const _moduleName = "Email";
const emailRoutes = express.Router();
const GenericCache = require('./Caches/genericCache');
const emailCache = new GenericCache("Email Cache")

emailRoutes.route('/api/email').get(async function (_req, res){
  if(!emailCache.setup){
    res.json(await getEmailModule());
  }else{
    res.json(emailCache.get()[0]);
  }
})

emailRoutes.route('/api/email').patch(async function (_req, res){
  let docId = _req.body._id;
  const dbConnect = dbo.getDb();
  await dbConnect.collection('modules').updateOne(
    { 
      _id: new mongoDb.ObjectId(docId) 
    },
    {
      $set: { 
        'name': _req.body.Name, 
        'subject': _req.body.Subject,
        'recipients': _req.body.Recipients,
        'template': _req.body.Template,
        'enabled': _req.body.Enabled
      }
    }
  );

  await getEmailModule();
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

    let module = await getEmailModule();
    if(!module.enabled){
      console.log("Emails disabled through config");
      return res.json("Disabled through config");
    }

    const transporter = nodemailer.createTransport({
      service: module.emailService,
      auth: {
        user: module.sender,
        pass: module.secret,
      },
    });

    transporter.sendMail({
        from: `${module.name} ${module.sender}`,
        to: module.recipients,
        subject: module.subject, 
        html: emailTemplater.buildHtml(shoppingList, recipes, module),
      })
      .then(info => {
        console.log("Email Sent");
      })
      .catch(console.error);

    return res.json("Email attempted");
})

async function getEmailModule(){
  const dbConnect = dbo.getDb();
  let modules = await dbConnect
    .collection('modules')
    .find({})
    .toArray();
  
  emailCache.set(modules.filter(x => x.moduleName === _moduleName));
  return emailCache.get()[0];
}

module.exports = emailRoutes;
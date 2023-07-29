const express = require('express');
const mongoDb = require('mongodb');
const usersRoutes = express.Router();
const dbo = require('../Data/conn');
const DoubleIndexCache = require('./Caches/doubleIndexCache');
const usersCache = new DoubleIndexCache("Users Cache", "id")

// GET USER BY DETAIL
usersRoutes.route('/api/users/:id').get(async function (_req, res) {
    let credential = _req.params.id;
    if(!usersCache.setup){
        const dbConnect = dbo.getDb();
        let getUsersCall = dbConnect.collection('users')
          .find({})
          .toArray();
        usersCache.set(await getUsersCall);
    }

    res.json(usersCache.getSecondIndex())
});

module.exports.usersRoutes = usersRoutes;
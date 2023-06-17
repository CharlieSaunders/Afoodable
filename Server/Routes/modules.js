const express = require('express');
const moduleRoutes = express.Router();
const dbo = require('../Data/conn');
const DoubleIndexCache = require('./Caches/doubleIndexCache');
const modulesCache = new DoubleIndexCache("Modules Cache", "moduleName")

// GET ALL MODULES
moduleRoutes.route('/api/modules').get(async function (_req, res) {
    res.json(await get());
});

async function get(){
    if(modulesCache.setup){
        return modulesCache.get();
    }else{
        const dbConnect = dbo.getDb();
        await dbConnect.collection('modules')
          .find({})
          .toArray(function (err, result) {
          if (err) {
            return 'Error fetching listings!';
            } else {
            modulesCache.set(result);
            return result;
          }
        });
    }
}

module.exports.moduleRoutes = moduleRoutes;
exports.modulesCache = modulesCache;
exports.getAllModules = get;
const express = require('express');
const mongoDb = require('mongodb');
const moduleRoutes = express.Router();
const dbo = require('../Data/conn');
const DoubleIndexCache = require('./Caches/doubleIndexCache');
const modulesCache = new DoubleIndexCache("Modules Cache", "moduleName")

// GET ALL MODULES
moduleRoutes.route('/api/modules').get(async function (_req, res) {
    if(modulesCache.setup){
        res.json(modulesCache.get())
    }else{
        let modules = await getModules();
        res.json(modulesCache.get());
    }
});

moduleRoutes.route('/api/modules/:id').post(async function(_req, res) {
    if(!modulesCache.setup){
        await getModules();
    }
    let id = _req.params.id;
    let selectedModule = modulesCache.getSingle(id);
    selectedModule.value = !selectedModule.value;
    const dbConnect = dbo.getDb();
    await dbConnect.collection('modules').updateOne(
    { 
      _id: new mongoDb.ObjectId(id) 
    },
    {
      $set: { 
        'value': selectedModule.value, 
      }
    }
  );
    modulesCache.setSingle(selectedModule)
    res.json(selectedModule)
})

async function getModules(){
    if(modulesCache.setup){
        return modulesCache.get();
    }else{
        const dbConnect = dbo.getDb();
        let response = dbConnect.collection('modules')
          .find({})
          .toArray(function (err, result) {
          if (err) {
            return 'Error fetching listings!';
            } else {
            modulesCache.set(result);
            return modulesCache.get();
          }
        });
        return await response;
    }
}

module.exports.moduleRoutes = moduleRoutes;
exports.modulesCache = modulesCache;
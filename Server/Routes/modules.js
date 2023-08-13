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
        const results = await getModules();
        modulesCache.set(results);
        res.json(modulesCache.get());
    }
});

moduleRoutes.route('/api/modules/:id').post(async function(_req, res) {
    if(!modulesCache.setup){
      modulesCache.set(await getModules());
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
  const dbConnect = dbo.getDb();
  let response = await dbConnect.collection('modules')
    .find({})
    .toArray();
  return response;
}

module.exports.moduleRoutes = moduleRoutes;
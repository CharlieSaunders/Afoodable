const express = require('express');
const moduleRoutes = express.Router();
const dbo = require('../Data/conn');
const DoubleIndexCache = require('./Caches/doubleIndexCache');
const modulesCache = new DoubleIndexCache("Modules Cache", "moduleName")

// GET ALL MODULES
moduleRoutes.route('/api/modules').get(async function (_req, res) {
    res.json(await get());
});

moduleRoutes.route('/api/modules/:id').post(async function(_req, res) {
    if(!modulesCache.setup){
        await get();
    }
    
    let id = _req.params.id;
    let selectedModule = modulesCache.filter(x => x._id === id);
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
    res.json(selectedModule)
})

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
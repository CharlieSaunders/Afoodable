class DoubleIndexCache {
    constructor(cacheName, secondIndexValue){
        this.setup = false;
        this.cacheName = cacheName;
        this.firstIndex = {};
        this.secondIndex = {};
        this.secondIndexValue = secondIndexValue;
    }

    set(cacheObjects){
        if(this.setup)
            CacheLogger.LogResetting(this.cacheName);

        this.setup = true;
        cacheObjects.forEach(element => {
            this.firstIndex[element._id] = element;
            this.secondIndex[element[this.secondIndexValue]] = element;
        });
        CacheLogger.LogSetup(this.cacheName);
    }

    setSingle(object){
        CacheLogger.LogSet(this.cacheName, object._id);
        this.firstIndex[object._id] = object;
        this.secondIndex[object.secondIndexValue] = object;
    }

    get(){
        CacheLogger.LogGet(this.cacheName, null);
        return Object.values(this.firstIndex);
    }

    getSecondIndex(){
        CacheLogger.LogGet(this.cacheName, null);
        return Object.values(this.secondIndex);
    }

    getSingleByIndex(value){
        CacheLogger.LogGet(this.cacheName, value);
        let id = this.secondIndex[value]._id;
        return this.getSingle(id);
    }

    getSingle(id){
        CacheLogger.LogGet(this.cacheName, id);
        return this.firstIndex[id];
    }

    unset(id){
        CacheLogger.LogDelete(this.cacheName, id);
        let values = this.get();
        let index = values.map(x => x._id.toString()).indexOf(id);
        values.splice(index, 1);
        this.set(values);
    }
}

class CacheLogger {
    static LogSetup(cacheName){
        console.log('\x1b[32m%s\x1b[0m', `==> Setup cache objects for ${cacheName}`);
    }

    static LogSet(cacheName, id){
        console.log('\x1b[34m%s\x1b[0m', `==> Setting ${cacheName} object: ID --> ${id}`);
    }

    static LogGet(cacheName, id){
        if(id == null)
            console.log('\x1b[35m%s\x1b[0m', `==> Getting ${cacheName} objects`);
        else
            console.log('\x1b[35m%s\x1b[0m', `==> Getting ${cacheName} object. ID --> ${id}`);
    }

    static LogDelete(cacheName, id){
        console.log(`\x1b[31m%s\x1b[0m`, `==> Deleting ${cacheName} object. ID --> ${id}`);
    }

    static LogResetting(cacheName){
        console.log('\x1b[32m%s\x1b[0m', `==> Resetting cache objects for ${cacheName}. This is due to a deletion`);
    }
}

module.exports = DoubleIndexCache;
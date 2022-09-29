class GenericCache {
    constructor(cacheName){
        this.setup = false;
        this.cacheName = cacheName;
        this.objects = {};
    }

    set(cacheObjects){
        this.setup = true;
        this.objects = {};
        cacheObjects.forEach(element => {
            this.objects[element._id] = element;
        });
        CacheLogger.LogSetup(this.cacheName);
    }

    setSingle(object){
        CacheLogger.LogSet(this.cacheName, object._id);
        this.objects[object._id] = object;
    }

    get(){
        CacheLogger.LogGet(this.cacheName, null);
        return Object.values(this.objects);
    }

    getSingle(id){
        CacheLogger.LogGet(this.cacheName, id);
        return this.objects[id];
    }

    unset(id){
        CacheLogger.LogDelete(this.cacheName, id);
        let values = this.getObjects();
        let index = values.map(x => x._id.toString()).indexOf(id);
        values.splice(index, 1);
        this.set(values);
    }
}

class CacheLogger {
    // Set foreground colour, then use string interpolation '%s' then set the text colour back to white
    static LogSetup(cacheName){
        console.log('\x1b[32m%s\x1b[0m', `==> Setup cache objects for ${cacheName}`);
    }

    static LogSet(cacheName, id){
        console.log('\x1b[34m%s\x1b[0m', `==> Getting ${cacheName} object: ID --> ${id}`);
    }

    static LogGet(cacheName, id){
        if(id == null)
            console.log('\x1b[35m%s\x1b[0m', `==> Getting ${cacheName} objects`);
        else
            console.log('\x1b[35m%s\x1b[0m', `==> Getting ${cacheName} object. ID --> ${id}`);
    }

    static LogDelete(cacheName){
        console.log(`\x1b[31m%s\x1b[0m`, `==> Deleting ${cacheName} object. ID --> ${id}`);
    }
}

module.exports = GenericCache;
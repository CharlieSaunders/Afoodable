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
        console.log(`SET* ==> Setting cache objects for ${this.cacheName}`)
    }

    setSingle(object){
        console.log(`SET ==> ${this.cacheName} set for: ID --> ${object._id}`);
        this.objects[object._id] = object;
    }

    get(){
        console.log(`GET* ==> Getting ${this.cacheName} objects`)
        return Object.values(this.objects);
    }

    getSingle(id){
        console.log(`GET ==> Getting ${this.cacheName} object: ID --> ${id}`)
        return this.objects[id];
    }

    unset(id){
        console.log(`DELETE ==> ${this.cacheName} delete for: ID --> ${id}`);
        let values = this.getObjects();
        let index = values.map(x => x._id.toString()).indexOf(id);
        values.splice(index, 1);
        this.set(values);
    }
}

module.exports = GenericCache;
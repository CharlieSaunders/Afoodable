module.exports.ShoppingListItem = class ShoppingListItem {

    constructor(name, amount, servingMetric, servingSize){
        this.Name = name;
        this.Amount = amount - 0;
        this.ServingMetric = servingMetric;
        this.ServingSize = servingSize - 0;
    }

    getAmount() {
        return this.ServingSize * this.Amount;
    }
}

module.exports.Recipe = class Recipe {
    constructor(name, amount){
        this.Name = name;
        this.Amount = amount;
    }
}
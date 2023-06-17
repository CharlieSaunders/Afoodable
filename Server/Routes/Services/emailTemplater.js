module.exports.buildHtml = function buildHtml (shoppingListItems, selectedRecipes, config) {
    let shoppingList = "";
    shoppingListItems.forEach(item => {
        shoppingList += `<input style='float: right' type='checkbox' id='${item.Name}' name='${item.Name}' value='${item.Name}'><label style='float: left' for='${item.Name}'> ${item.Name} - ${item.getAmount()} ${item.ServingMetric}</label><br><hr>`;
    });

    let recipes = "";
    selectedRecipes.forEach(recipe => {
        recipes += `<p> ${recipe.Name} (x${recipe.Amount}) </p>`;
    })
    return config.template.replace("[title]", config.subject).replace("[recipes]", recipes).replace("[shopping_list]", shoppingList);
}
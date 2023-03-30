module.exports.buildHtml = function buildHtml (shoppingListItems, selectedRecipes, emailTemplate) {
    const title = "Your Afoodable shopping list";
    const welcomeLine = "Hey Charlotte & Charlie 👋";

    let shoppingList = "";
    shoppingListItems.forEach(item => {
        shoppingList += `<input style='float: right' type='checkbox' id='${item.Name}' name='${item.Name}' value='${item.Name}'><label style='float: left' for='${item.Name}'> ${item.Name} - ${item.getAmount()} ${item.ServingMetric}</label><br><hr>`;
    });

    let recipes = "";
    selectedRecipes.forEach(recipe => {
        recipes += `<p> ${recipe.Name} (x${recipe.Amount}) </p>`;
    })

    return emailTemplate.replace("_welcome_line_", welcomeLine).replace("_title_", title).replace("_recipes_array_", recipes).replace("_shopping_list_array_", shoppingList)
}
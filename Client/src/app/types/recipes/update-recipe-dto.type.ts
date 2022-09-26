import { Recipe } from './recipe.type';

export class UpdateRecipeDto {
	description: string;
	imageUrl: string;
	ingredients: Array<string>;
	name: string;
	rating: number;
	reference: string;
	type: string;
	steps: Array<string>;
	_id: string;
	constructor(_recipe: Recipe){
		this.description = _recipe.description;
		this.imageUrl = _recipe.imageUrl;
		this.ingredients = new Array<string>;
		_recipe.ingredients.forEach((ingredient) => {
			this.ingredients.push(JSON.stringify(ingredient));
		});
		this.name = _recipe.name;
		this.type = _recipe.type;
		this.reference = _recipe.reference;
		this.rating = _recipe.rating;
		this.steps = _recipe.steps;
		this._id = _recipe._id;
	}
}
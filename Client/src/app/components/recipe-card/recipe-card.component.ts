import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from '../../types/recipes/recipe.type'

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css']
})
export class RecipeCardComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() navigateToRecipe!: (args: string) => void;
  @Input() selectRecipe!: (args: Recipe) => void;
  @Input() unselectRecipe!: (args: Recipe) => void;
  @Input() updateShoppingList!: (args: Recipe) => void;
  @Input() removeFromShoppingList!: (args: Recipe) => void;

  constructor() { }

  ngOnInit(): void {
  }

}

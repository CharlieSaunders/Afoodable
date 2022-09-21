import { Component } from '@angular/core';
import { RecipeItem } from '../types/recipes/recipe-item.type';
import { Recipe } from '../types/recipes/recipe.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public recipes!: Array<Recipe>;

  public ngOnInit(): void {
    this.recipes = [
      new Recipe("Poached Egg on Toast", "Breakfast", 4, "poached-eggs-on-toast.jpeg", [new RecipeItem("Egg", 2, 0.2)])
    ]
  }
}


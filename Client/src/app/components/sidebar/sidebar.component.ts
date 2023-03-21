import { Component, Input } from "@angular/core";
import { ShoppingList } from "../../types/recipes/shopping-list.type";
import { Recipe } from "../../types/recipes/recipe.type";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent{
  @Input() display!: boolean;
  @Input() toggleSidebar!: () => void;
  @Input() shoppingList!: ShoppingList;
  @Input() recipes!: Array<Recipe>;

  constructor() {}
}

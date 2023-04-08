import { Component, Input } from "@angular/core";
import { ShoppingList } from "../../types/recipes/shopping-list.type";
import { Recipe } from "../../types/recipes/recipe.type";
import { EmailService } from "src/app/services/emails/emails.service";
import { PageHelpers } from "src/app/helpers/page-helpers";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
  providers: [EmailService],
})
export class SidebarComponent{
  @Input() display!: boolean;
  @Input() toggleSidebar!: () => void;
  @Input() shoppingList!: ShoppingList;
  @Input() recipes!: Array<Recipe>;

  constructor(private emailService: EmailService) {}

  public sendEmail(): void {
    let selectedRecipes = new Array<Recipe>();
    this.recipes.forEach(recipe => {
      if(recipe.selectedAmount > 0){
        selectedRecipes.push(recipe);
      }
    })
    this.emailService.send(this.shoppingList, selectedRecipes).subscribe(() => { PageHelpers.RefreshPage() });
  }

  public shoppingListHasAtLeastOneItem(): boolean {
    return Object.keys(this.shoppingList.items).length > 0;
  }
}

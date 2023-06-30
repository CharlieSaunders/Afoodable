import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { IngredientService } from "src/app/services/ingredients/ingredient.service";
import { Ingredient } from "src/app/types/ingredients/ingredient.type";
import { RecipeItem, RecipeItemBuilder } from "src/app/types/recipes/recipe.type";

@Component({
    selector: "app-recipe-add-ingredient-modal",
    templateUrl: "./add-ingredient.component.html",
    styleUrls: [],
    providers: [IngredientService]
})
export class AddIngredientToRecipeModalComponent implements OnInit {
    private readonly subscriptions: Subscription = new Subscription();

    @Input() display = false;

    @Output() closeWithValueEvent = new EventEmitter<RecipeItem>();
    @Output() closeWithoutValueEvent = new EventEmitter<null>();

    public allIngredients!: Array<Ingredient>;
    public searchText!: string;

    constructor(private ingredientService: IngredientService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.ingredientService
              .getIngredients()
              .subscribe((data: Array<Ingredient>) => {
                this.allIngredients = data;
              })
          );
    }

    public closeWithValue(value: Ingredient) {
        this.closeWithValueEvent.emit(RecipeItemBuilder.fromIngredient(value));
    }

    public closeWithoutValue() {
        this.closeWithoutValueEvent.emit();
    }
}

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
export class AddIngredientToRecipeModal implements OnInit {
    private readonly subscriptions: Subscription = new Subscription();

    @Input() display: boolean = false;

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

    public close(): void {
        this.display = false;
    }

    public closeWithValue(value: Ingredient) {
        this.close();
        this.closeWithValueEvent.emit(RecipeItemBuilder.fromIngredient(value));
    }

    public closeWithoutValue() {
        this.close();
        this.closeWithoutValueEvent.emit();
    }
}

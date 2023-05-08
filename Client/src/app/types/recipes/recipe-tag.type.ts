import { FormGroup } from "@angular/forms";

export class RecipeTag {
    Name: string;
    _id: string;

    constructor(name: string, id: string) {
        this.Name = name;
        this._id = id;
    }
}

export class CreateRecipeTag {
    Name: string;
    constructor(formGroup: FormGroup){
        this.Name = formGroup.value.Name;
    }
}
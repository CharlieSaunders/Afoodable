import { FormControl, FormGroup } from "@angular/forms";

export class FormHelpers {
	public static NewIngredientForm() : FormGroup {
		return new FormGroup({
		    name: new FormControl(""),
		    cost: new FormControl(""),
		    servingSize: new FormControl(""),
		    servingMetric: new FormControl(""),
		    _id: new FormControl(""),
		  });
	}

	public static UpdateIngredientForm() : FormGroup {
		return new FormGroup({
		    name: new FormControl(""),
		    cost: new FormControl(0),
		    servingSize: new FormControl(0),
		    servingMetric: new FormControl(""),
		    _id: new FormControl(""),
		  })
	}
}
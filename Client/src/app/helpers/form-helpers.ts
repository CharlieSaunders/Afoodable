import { FormControl, FormGroup } from "@angular/forms";
import { EmailConfiguration } from "../types/generics/email-configuration.type";

export class FormHelpers {
	public static NewIngredientForm(): FormGroup {
		return new FormGroup({
			name: new FormControl(""),
			cost: new FormControl(""),
			servingSize: new FormControl(""),
			servingMetric: new FormControl(""),
			calories: new FormControl(""),
			carbohydrates: new FormControl(""),
			fat: new FormControl(""),
			protein: new FormControl(""),
			_id: new FormControl(""),
		});
	}

	public static UpdateIngredientForm(): FormGroup {
		return FormHelpers.NewIngredientForm();
	}

	public static EmailConfigForm(emailConfig: EmailConfiguration): FormGroup {
		const form = new FormGroup({
			Name: new FormControl(""),
			Subject: new FormControl(""),
			Recipients: new FormControl(""),
			Sender: new FormControl(""),
			EmailService: new FormControl(""),
			Template: new FormControl(""),
			_id: new FormControl(""),
			Enabled: new FormControl()
		});

		form.setValue({
			Name: emailConfig.Name,
			Subject: emailConfig.Subject,
			Recipients: emailConfig.Recipients,
			Sender: emailConfig.Sender,
			EmailService: emailConfig.EmailService,
			Template: emailConfig.Template,
			_id: emailConfig._id,
			Enabled: emailConfig.Enabled
		});

		form.controls.Sender.disable();
		form.controls.EmailService.disable();

		return form;
	}


	public static RecipeTagForm(): FormGroup {
		return new FormGroup({
			Name: new FormControl("")
		});
	}
}
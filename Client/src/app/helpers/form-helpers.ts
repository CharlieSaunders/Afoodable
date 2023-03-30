import { FormControl, FormGroup } from "@angular/forms";
import { EmailConfiguration } from "../types/generics/email-configuration.type";

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

	public static EmailConfigForm(emailConfig: EmailConfiguration): FormGroup {
		let form = new FormGroup({
			EmailName: new FormControl(""),
			Subject: new FormControl(""),
			Recipients: new FormControl(""),
			EmailUser: new FormControl(""),
			Service: new FormControl(""),
			Template: new FormControl(""),
			_id: new FormControl("")
		  });
		 
		form.controls['EmailUser'].disable();
		form.controls['Service'].disable();

		form.setValue({
			EmailName: emailConfig.EmailName,
			Subject: emailConfig.Subject,
			Recipients: emailConfig.Recipients,
			EmailUser: emailConfig.EmailUser,
			Service: emailConfig.Service,
			Template: emailConfig.Template,
			_id: emailConfig._id
		})

		return form;
	}
}
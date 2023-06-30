import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormHelpers } from "../helpers/form-helpers";
import { PageHelpers } from "../helpers/page-helpers";
import { EmailService } from "../services/emails/emails.service";
import { RecipeTagService } from "../services/recipes/recipe-tag.service";
import { EmailConfiguration, UpdateEmailConfiguration } from "../types/generics/email-configuration.type";
import { CreateRecipeTag, RecipeTag } from "../types/recipes/recipe-tag.type";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  providers: [EmailService, RecipeTagService],
})
export class ConfigurationComponent implements OnInit {
  private readonly subscriptions: Subscription = new Subscription();

  public emailConfig!: EmailConfiguration;
  public emailConfigForm!: FormGroup;
  public recipeTags!: Array<RecipeTag>;
  public recipeTagForm!: FormGroup;

  public code = "";
  public codeEditorOptions = {
    theme: "vs-dark",
    language: "html",
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false
  };

  constructor(
    private emailService: EmailService,
    private recipeTagService: RecipeTagService
    ) {
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.emailService.getConfig().subscribe((data: EmailConfiguration) => {
        this.emailConfig = data;
        this.emailConfigForm = FormHelpers.EmailConfigForm(data);
      })
    );

    this.subscriptions.add(
      this.recipeTagService.getAll().subscribe((data: Array<RecipeTag>) => {
        this.recipeTags = data;
        this.recipeTagForm = FormHelpers.RecipeTagForm();
      })
    );
  }

  public saveConfig(): void {
    const updateRequest = new UpdateEmailConfiguration(this.emailConfigForm, this.emailConfig.Template);
    this.emailService.update(updateRequest).subscribe(() => { PageHelpers.RefreshPage(); });
  }

  public addNewTag(): void {
    const newRecipeTag = new CreateRecipeTag(this.recipeTagForm);
    this.recipeTagService.create(newRecipeTag).subscribe(() => { PageHelpers.RefreshPage(); });
  }
}

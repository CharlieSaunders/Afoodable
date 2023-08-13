import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormHelpers } from "../helpers/form-helpers";
import { PageHelpers } from "../helpers/page-helpers";
import { EmailService } from "../services/emails/emails.service";
import { ModulesService } from "../services/modules/modules.service";
import { EmailConfiguration, UpdateEmailConfiguration } from "../types/generics/email-configuration.type";
import { CreateRecipeTag, RecipeTag } from "../types/recipes/recipe-tag.type";
import { ApplicationModule, ApplicationModulesMapper } from "../types/generics/application-module.type"
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  providers: [EmailService, ModulesService, ToastrService],
})
export class ConfigurationComponent implements OnInit, OnDestroy {
  private readonly subscriptions: Subscription = new Subscription();

  public emailConfig!: EmailConfiguration;
  public emailConfigForm!: FormGroup;
  public modules!: Array<ApplicationModule>;

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
    private modulesService: ModulesService,
    private toasterService: ToastrService
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
      this.modulesService.getModules().subscribe((data: Array<ApplicationModule>) => {
        this.modules = data;
      }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }

  public saveConfig(): void {
    const updateRequest = new UpdateEmailConfiguration(this.emailConfigForm, this.emailConfig.Template);
    this.emailService.update(updateRequest).subscribe(() => { PageHelpers.RefreshPage(); });
  }

  public toggle(id: string): void {
    this.modulesService.toggle(id).subscribe(() => { this.toasterService.success("Toggled"); });
  }
}

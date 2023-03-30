import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormHelpers } from "../helpers/form-helpers";
import { PageHelpers } from "../helpers/page-helpers";
import { EmailService } from "../services/emails/emails.service";
import { EmailConfiguration, UpdateEmailConfiguration } from "../types/generics/email-configuration.type";

@Component({
  selector: "app-configuration",
  templateUrl: "./configuration.component.html",
  providers: [EmailService],
})
export class ConfigurationComponent implements OnInit {
  private readonly subscriptions: Subscription = new Subscription();

  public emailConfig!: EmailConfiguration;
  public emailConfigForm!: FormGroup;
  
  public code: string = '';
  public codeEditorOptions = {
    theme: 'vs-dark',
    language: 'html',
    minimap: { enabled: false },
    automaticLayout: true,
    scrollBeyondLastLine: false
  };

  constructor(private emailService: EmailService) {
  }

  public ngOnInit(): void {
    this.subscriptions.add(
      this.emailService.getConfig().subscribe((data: EmailConfiguration) => {
        this.emailConfig = data;
        this.emailConfigForm = FormHelpers.EmailConfigForm(data);
      })
    );
  }

  public saveConfig(): void {
    var updateRequest = new UpdateEmailConfiguration(this.emailConfigForm, this.emailConfig.Template);
    this.emailService.update(updateRequest).subscribe(() => { PageHelpers.RefreshPage() })
  }
}

import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { FormHelpers } from "../helpers/form-helpers";
import { EmailService } from "../services/emails/emails.service";
import { EmailConfiguration } from "../types/generics/email-configuration.type";

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
}

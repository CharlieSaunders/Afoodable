import { FormGroup } from "@angular/forms";

export class EmailConfiguration {
    Name: string;
    Subject: string;
    Recipients: string;
    Sender: string;
    EmailService: string;
    Template: string;
    _id: string;
    Enabled: boolean;
    constructor(emailName: string, subject: string, recipients: string, emailUser: string, service: string, template: string, id: string, enabled: boolean){
        this.Name = emailName;
        this.Subject = subject;
        this.Recipients = recipients;
        this.Sender = emailUser;
        this.EmailService = service;
        this.Template = template;
        this._id = id;
        this.Enabled = enabled;
    }
}

export class UpdateEmailConfiguration {
    Name: string;
    Subject: string;
    Recipients: string;
    Sender: string;
    EmailService: string;
    Template: string;
    _id: string;
    Enabled: boolean;
    constructor(formGroup: FormGroup, template: string){
        this.Name = formGroup.value.Name;
        this.Subject = formGroup.value.Subject;
        this.Recipients = formGroup.value.Recipients;
        this.Sender = formGroup.value.Sender;
        this.EmailService = formGroup.value.Service;
        this.Template = template;
        this._id = formGroup.value._id;
        this.Enabled = formGroup.value.Enabled;
    }
}

export class EmailConfigurationMapper {
    public static Map(result: any): EmailConfiguration {
        return new EmailConfiguration(result.name, result.subject, result.recipients, result.sender, result.emailService, result.template, result._id, result.enabled);
    }
}
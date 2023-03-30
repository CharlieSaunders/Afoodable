import { FormGroup } from "@angular/forms";

export class EmailConfiguration {
    EmailName: string;
    Subject: string;
    Recipients: string;
    EmailUser: string;
    Service: string;
    Template: string;
    _id: string;
    EmailEnabled: boolean;
    constructor(emailName: string, subject: string, recipients: string, emailUser: string, service: string, template: string, id: string, enabled: boolean){
        this.EmailName = emailName;
        this.Subject = subject;
        this.Recipients = recipients;
        this.EmailUser = emailUser;
        this.Service = service;
        this.Template = template;
        this._id = id;
        this.EmailEnabled = enabled;
    }
}

export class UpdateEmailConfiguration {
    EmailName: string;
    Subject: string;
    Recipients: string;
    EmailUser: string;
    Service: string;
    Template: string;
    _id: string;
    EmailEnabled: boolean;
    constructor(formGroup: FormGroup, template: string){
        this.EmailName = formGroup.value.EmailName;
        this.Subject = formGroup.value.Subject;
        this.Recipients = formGroup.value.Recipients;
        this.EmailUser = formGroup.value.EmailUser;
        this.Service = formGroup.value.Service;
        this.Template = template;
        this._id = formGroup.value._id;
        this.EmailEnabled = formGroup.value.EmailEnabled;
    }
}

export class EmailConfigurationMapper {
    public static Map(result: any): EmailConfiguration {
        return new EmailConfiguration(result.emailName, result.emailSubject, result.emailTo, result.emailUser, result.emailService, result.emailTemplate, result._id, result.emailEnabled);
    }
}
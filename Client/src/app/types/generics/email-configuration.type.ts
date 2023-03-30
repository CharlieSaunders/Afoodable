import { FormGroup } from "@angular/forms";

export class EmailConfiguration {
    EmailName: string;
    Subject: string;
    Recipients: string;
    EmailUser: string;
    Service: string;
    Template: string;
    _id: string;
    constructor(emailName: string, subject: string, recipients: string, emailUser: string, service: string, template: string, id: string){
        this.EmailName = emailName;
        this.Subject = subject;
        this.Recipients = recipients;
        this.EmailUser = emailUser;
        this.Service = service;
        this.Template = template;
        this._id = id;
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
    constructor(formGroup: FormGroup, template: string){
        this.EmailName = formGroup.value.EmailName;
        this.Subject = formGroup.value.Subject;
        this.Recipients = formGroup.value.Recipients;
        this.EmailUser = formGroup.value.EmailUser;
        this.Service = formGroup.value.Service;
        this.Template = template;
        this._id = formGroup.value._id;
    }
}

export class EmailConfigurationMapper {
    public static Map(result: any): EmailConfiguration {
        return new EmailConfiguration(result.emailName, result.emailSubject, result.emailTo, result.emailUser, result.emailService, result.emailTemplate, result._id);
    }
}
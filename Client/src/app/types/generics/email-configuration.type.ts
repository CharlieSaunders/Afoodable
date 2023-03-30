export class EmailConfiguration {
    EmailName: string;
    Subject: string;
    Recipients: string;
    EmailUser: string;
    Service: string;
    Template: string;
    constructor(emailName: string, subject: string, recipients: string, emailUser: string, service: string, template: string){
        this.EmailName = emailName;
        this.Subject = subject;
        this.Recipients = recipients;
        this.EmailUser = emailUser;
        this.Service = service;
        this.Template = template;
    }
}

export class EmailConfigurationMapper {
    public static Map(result: any): EmailConfiguration {
        return new EmailConfiguration(result.emailName, result.emailSubject, result.emailTo, result.emailUser, result.emailService, result.emailTemplate);
    }
}
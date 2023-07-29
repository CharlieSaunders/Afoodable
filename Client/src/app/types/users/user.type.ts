export class User {
    firstName: string;
    secondName: string;
    id: string;
    email: string;
    authenticated: boolean

    constructor(_firstName: string, _secondName: string, _id: string, _email: string, _authenticated: boolean) {
        this.firstName = _firstName;
        this.secondName = _secondName;
        this.id = _id;
        this.email = _email;
        this.authenticated = _authenticated;
    }
}
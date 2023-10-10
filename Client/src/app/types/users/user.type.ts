export class User {
    firstName: string;
    secondName: string;
    id: string;
    email: string;
    authenticated: boolean;
    authenticationToken: string;
    reference: string;


    constructor(_firstName: string, _secondName: string, _id: string, _email: string, _authenticated: boolean, _authenticationToken: string, _reference: string) {
        this.firstName = _firstName;
        this.secondName = _secondName;
        this.id = _id;
        this.email = _email;
        this.authenticated = _authenticated;
        this.authenticationToken = _authenticationToken;
        this.reference = _reference;
    }
}
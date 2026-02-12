export class User{
    constructor(firstName, surname, username, password) {
        this.id = crypto.randomUUID();
        this.firstName = firstName;
        this.surname = surname;
        this.username = username;
        this.password = btoa(password);
    }
    
}

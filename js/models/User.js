export class User{
    constructor(firstName, surname, username, password, securityQuestion, securityAnswer) {
        this.id = Date.now() + "-" + Math.floor(Math.random() * Date.now());
        this.firstName = firstName;
        this.surname = surname;
        this.username = username;
        this.password = password;
        this.securityQuestion = securityQuestion;
        this.securityAnswer = securityAnswer;
        this.isOnline = false;
    }
    
}

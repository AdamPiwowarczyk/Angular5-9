export class Person {
  personId: string;
  firstName: string;
  lastName: string;
  occupation: string;
  avatarUrl: string;

   constructor(personId?: string, firstName?: string, lastName?: string, occupation?: string, avatarUrl?: string) {
    this.personId = personId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.occupation = occupation;
    this.avatarUrl = avatarUrl || '/assets/elephant.jpg';
  }
}

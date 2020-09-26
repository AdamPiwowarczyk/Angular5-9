import { Component, OnInit } from '@angular/core';
import {Person} from "../models/person";
import {Router} from "@angular/router";
import {PeopleService} from "../services/people/people.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {DetailsComponent} from "../details/details.component";
import { AuthService } from '../services/people/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  person = new Person();

  constructor(
    private router: Router,
    private service: PeopleService,
    private auth: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit(): void {}

  add(): void {
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '300px',
      data: this.person
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.isAdmin()) {
        if (result) {
          this.service.addPerson(result).subscribe(response => {
            this._snackBar.open("Dodano");
            window.location.reload();
          }, error => {
            this._snackBar.open("Błąd podczas dodawania");
            console.log(error);
          })
        }
      } else {
        this._snackBar.open("Brak uprawnień aby dodać nowego użytkownika")
      }
    })
  }

  logout(): void {
    this.auth.logout();
    this._snackBar.open("Wylogowano");
    this.router.navigate(['/']);
  }

  loggedIn(): boolean {
    return this.auth.loggedIn();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }
}

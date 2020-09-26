import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/people/auth.service';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Przeglądarka ludzi';
  jwtHelper = new JwtHelperService();

  constructor(private auth: AuthService, private _snackBar: MatSnackBar, private router: Router) {}

  ngOnInit() {
    const tokenFromLocalStorage = localStorage.getItem('token');
    if (tokenFromLocalStorage) {
      if (this.jwtHelper.isTokenExpired(tokenFromLocalStorage)) {
        this.auth.logout();
        this._snackBar.open("Dane logowania są przedawnione, wylogowano");
        this.router.navigate(['/']);
      } else {
        this.auth.decodedToken = this.jwtHelper.decodeToken(tokenFromLocalStorage);
      }
    }
  }

  loggedIn() {
    return !!this.auth.loggedIn();
  }
}

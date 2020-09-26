import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AuthService } from '../services/people/auth.service';
import { Credentials } from '../models/Credentials';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: Credentials

  constructor(private auth: AuthService, private snackbar: MatSnackBar, private router: Router) {
    this.credentials = {login: "", password: ""};
  }

  ngOnInit(): void {
    if (this.auth.loggedIn()) {
      this.router.navigate(['/list']);
    }
  }

  submitForm() {
    this.auth.login(this.credentials).subscribe(next => {
      this.snackbar.open("Zalogowano!");
      this.router.navigate(["/list"]);
    }, error => {
      this.snackbar.open("Nie udało się zalogować");
      console.log(error);
    });
  }
}

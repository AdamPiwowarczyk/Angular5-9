import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/people/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  canActivate(): boolean {
    if (this.auth.loggedIn()) {
      return true;
    }

    this.snackbar.open("Brak uprawnień do tej części aplikacji");
    this.router.navigate(['/']);
  }
}

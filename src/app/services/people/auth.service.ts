import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from 'src/app/models/Credentials';
import { map } from "rxjs/operators";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  private url = 'http://localhost:5000/api/auth/';
  public decodedToken: any;

  constructor(private http: HttpClient) { }
  login(credentials: Credentials) {
    return this.http.post(this.url + 'login', credentials).pipe(
      map((response: any) => {
        const userData = response;
        if (userData) {
          localStorage.setItem('token', userData.token);
          this.decodedToken = this.jwtHelper.decodeToken(userData.token);
        }
      })
    );
  }

  loggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAdmin(): boolean {
    if (!this.loggedIn())
      return false;
    
    if (this.decodedToken && this.decodedToken.role == "Admin") {
      return true;
    } else {
      return false;
    }
  }
}

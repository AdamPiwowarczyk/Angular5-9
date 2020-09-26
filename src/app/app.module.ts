import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { LoginComponent } from './login/login.component';
import {PeopleService} from './services/people/people.service';
import {MatListModule} from '@angular/material/list';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { DetailsComponent } from './details/details.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import { NavbarComponent } from './navbar/navbar.component';
import { ListComponent } from './list/list.component';
import {MatSelectModule} from "@angular/material/select";
import { JwtModule } from "@auth0/angular-jwt";
import { environmentDevelopement } from './environments/environments';
import {MatPaginatorModule} from '@angular/material/paginator';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DetailsComponent,
    NavbarComponent,
    ListComponent,
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatSelectModule,
        MatListModule,
        HttpClientModule,
        AppRoutingModule,
        MatSnackBarModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatSelectModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: [environmentDevelopement.serverUrl],
                blacklistedRoutes: [environmentDevelopement.apiUrl + 'auth']
            }
        }),
        MatPaginatorModule
    ],
  providers: [
    PeopleService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

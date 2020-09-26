import { Component, OnInit } from '@angular/core';
import {PeopleService} from "../services/people/people.service";
import {Person} from "../models/person";
import { PaginatedResults, Pagination } from 'src/app/models/pagination';
import { PageEvent } from '@angular/material/paginator';
import { Filters } from 'src/app/models/filters';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/people/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from 'src/app/details/details.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  response: PaginatedResults<Person[]>;
  peopleArray: Person[];
  paginationSettings: Pagination;

  pageEvent = new PageEvent();
  pageSizeOptions: number[] = [3, 5, 7, 10, 50];

  filters: Filters;
  orderBy: string;

  constructor(private service: PeopleService,
              private _snackBar: MatSnackBar,
              private auth: AuthService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPeople();
    this.filters = { firstName: "", lastName: "", occupation: ""};
  }

  getPeople(event?: PageEvent, filters?: Filters, orderBy?: string) {
    if(event) {
      this.service.getPeopleAll(event.pageIndex + 1, event.pageSize, filters, orderBy).subscribe(data => {
        this.response = data;
        this.peopleArray = this.response.data;
        this.paginationSettings = this.response.pagination;
      }, error => {
        console.log("Błąd przy pobieraniu danych");
        console.log(error);
      })
      return event;
    } else {
      this.service.getPeopleAll().subscribe(data => {
        this.response = data;
        this.peopleArray = this.response.data;
        this.paginationSettings = this.response.pagination;
      }, error => {
        console.log("Błąd przy pobieraniu danych");
        console.log(error);
      })
      return event;
    }
  }

  listChanged(): void {
    this.ngOnInit();
  }

  filterResults() {
    this.getPeople(this.pageEvent, this.filters, this.orderBy);
  }

  resetFilters() {
    this.filters = { firstName: "", lastName: "", occupation: ""};
    this.getPeople(this.pageEvent, null, this.orderBy);
  }

  orderByChanged() {
    this.getPeople(this.pageEvent, this.filters, this.orderBy);
  }

  getCsvFile() {
    this.service.getPeopleAllCsv(this.filters, this.orderBy).subscribe(data => {
      const blob = new Blob([data], {type: 'text/csv'});
      var downloadURL = window.URL.createObjectURL(data);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'people.csv';
      link.click();
    })
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  removeSelectedItem(id: string) {
    if (this.auth.isAdmin()) {
      this.service.deleteUser(id).subscribe(response => {
        this._snackBar.open("Usunięto");
      }, error => {
        this._snackBar.open("Błąd podczas usuwania");
        console.log(error);
      })
    } else {
      this._snackBar.open("Brak masz uprawnień do usuwania")
    }
    this.listChanged();
  }

  openDialog(person: Person): void {
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '300px',
      data: person
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.auth.isAdmin()) {
        if (result) {
          this.service.editPerson(result).subscribe(response => {
            this._snackBar.open("Zedytowano");
          }, error => {
            this._snackBar.open("Błąd podczas edytowania");
            console.log(error);
          })
        }
      } else {
        this._snackBar.open("Brak uprawnień do edytowania");
      }
    })
  }
}

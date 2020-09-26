import { Injectable } from '@angular/core';
import {Person} from '../../models/person';
import {environmentDevelopement} from "../../environments/environments";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import { PaginatedResults } from 'src/app/models/pagination';
import { map } from 'rxjs/operators';
import { Filters } from 'src/app/models/filters';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  url: string = environmentDevelopement.apiUrl + 'people/';

  constructor(private http: HttpClient) {}

  getPeopleAll(page?, itemsPerPage?, filters?: Filters, orderBy?: string): Observable<PaginatedResults<Person[]>> {
    const paginatedResult: PaginatedResults<Person[]> = new PaginatedResults<Person[]>();

    let params = new HttpParams
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (filters) {
      if (filters.firstName) {
        params = params.append('firstName', filters.firstName);
      }
      if (filters.lastName) {
        params = params.append('lastName', filters.lastName);
      }
      if (filters.occupation) {
        params = params.append('occupation', filters.occupation);
      }
    }
    if (orderBy) {
      params = params.append('orderBy', orderBy);
    }

    return this.http.get<Person[]>(this.url, {observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.data = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      })
    );
  }

  getPeopleAllCsv(filters?: Filters, orderBy?: string): Observable<Blob> {
    let params = new HttpParams
    
    if (filters) {
      if (filters.firstName) {
        params = params.append('firstName', filters.firstName);
      }
      if (filters.lastName) {
        params = params.append('lastName', filters.lastName);
      }
      if (filters.occupation) {
        params = params.append('occupation', filters.occupation);
      }
    }
    if (orderBy) {
      params = params.append('orderBy', orderBy);
    }
    
    return this.http.get<Blob>(this.url + 'csv', {params, responseType: 'blob' as 'json'});
  }

  getPerson(id: string): Observable<Person> {
    return this.http.get<Person>(this.url + id);
  }

  addPerson(person: Person) {
    return this.http.post(this.url, person);
  }

  editPerson(person: Person) {
    return this.http.put(this.url, person);
  }

  deleteUser(id: string) {
    return this.http.delete(this.url + id, {});
  }
}

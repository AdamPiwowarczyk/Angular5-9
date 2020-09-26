import {Component, Inject, OnInit} from '@angular/core';
import {Person} from "../models/person";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { AuthService } from '../services/people/auth.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  personEdit: Person;

  pictures = [
    {
      address:"/assets/sum-ryba.jpg",
      name:"Sum"
    },
    {
      address:"/assets/lion.jpg",
      name:"Lion"
    },
    {
      address:"/assets/elephant.jpg",
      name:"Elephant"
    },
    {
      address:"/assets/snake.jpg",
      name:"Snake"
    }
  ]

  constructor(
    public dialogRef: MatDialogRef<Person>,
    private auth: AuthService,
    @Inject(MAT_DIALOG_DATA) public person: Person
  ) { this.personEdit = this.person; }

  ngOnInit(): void {}
  onCancel(): void {
    this.dialogRef.close();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }
}

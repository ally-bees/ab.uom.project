import { Component, OnInit } from '@angular/core';
import {tableservice} from './table.service';
import { NgModule } from '@angular/core';
import { NgFor } from '@angular/common';

interface tableRecords {
  auditId: string;
  name: string;
  value: number;
  tax: number;
  netValue: number;
  status: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
      NgFor
    ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent  implements OnInit {
  tableRecords: tableRecords[] = [];
  
  constructor(private tableservice: tableservice) {
    
   }
  
  ngOnInit(): void {
    this.getTaxRecords();
  }
  
  getTaxRecords(): void {
    this.tableservice.getTaxRecords()  //here it return record from tax-summary.service to here
      .subscribe(records => this.tableRecords = records); //.subscribe() used to consume observables
  }

  printReport(): void {
    window.print();
  }
}
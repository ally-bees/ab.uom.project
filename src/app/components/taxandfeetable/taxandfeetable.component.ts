import { Component, OnInit } from '@angular/core';
import { TaxTableService } from './taxtable.service';
import { CommonModule } from '@angular/common';

interface TaxRecord {
  date: Date;
  auditId: string;
  salesId: string;  // ✅ Corrected (matches API)
  name: string;
  value: number;
  tax: number;
  netValue: number;  // ✅ Corrected (matches API)
  status?: string;  // ❓ Backend doesn't return this, so make it optional
}



@Component({
  selector: 'app-taxandfeetable',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './taxandfeetable.component.html',
  styleUrl: './taxandfeetable.component.css'
})
export class TaxandfeetableComponent {

  taxRecords: TaxRecord[] = [];
  
  constructor(private TaxTableService: TaxTableService) {}

  ngOnInit(): void {
    this.getTaxRecords();
  }
  
  getTaxRecords(): void {
    this.TaxTableService.getTaxRecords()  //here it return record from tax-summary.service to here
      .subscribe(records => this.taxRecords = records); //.subscribe() used to consume observables
    
      console.log(this.taxRecords); // To check the actual data in the array

  }
            /*.subscribe(function(records) {
                    this.taxRecords = records;
              })
            */
  
  printReport(): void {
    window.print();
  }
}

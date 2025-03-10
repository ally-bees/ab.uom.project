import { Component, OnInit } from '@angular/core';
import { TaxTableService } from './taxtable.service';
import { CommonModule } from '@angular/common';

interface TaxRecord {
  auditId: string;
  name: string;
  value: number;
  tax: number;
  netValue: number;
  status: string;
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
  }
            /*.subscribe(function(records) {
                    this.taxRecords = records;
              })
            */
  
  printReport(): void {
    window.print();
  }
}

import { Component, OnInit } from '@angular/core';
import { TaxTableService } from './taxtable.service';
import { CommonModule } from '@angular/common';
import { DateRangeService } from '../date-rangeaudit.service';

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

export class TaxandfeetableComponent implements OnInit{

  taxRecords: TaxRecord[] = [];
  
  constructor(
    private TaxTableService: TaxTableService,
    private dateRangeService: DateRangeService
  ) {}

  ngOnInit(): void {
    this.dateRangeService.currentRange$.subscribe(range => {
      if (range.fromDate && range.toDate) {
        this.getTaxRecords(range.fromDate, range.toDate);
      } else {
        // When no dates are selected, pass empty strings or null to the API to load all records
        this.getTaxRecords('', ''); // Or use null based on your API expectations
      }
    });
  }
  
  
  
  getTaxRecords(from?: string, to?: string): 
  void {
    console.log("Calling getTaxRecords with:", from, to);
  
    if (from && to) {
      // Both dates are selected correctly
      this.TaxTableService.getTaxRecords(from, to)
        .subscribe(
          records => {
            this.taxRecords = records;
            console.log(this.taxRecords);
          },
          error => {
            console.error("Error fetching tax records:", error);
          }
        );
    } else {
      // No dates selected, fetch all records without any filter
      this.TaxTableService.getAllTaxRecords()
        .subscribe(
          records => {
            this.taxRecords = records;
            console.log(this.taxRecords);
          },
          error => {
            console.error("Error fetching all tax records:", error);
          }
        );
    }
  }
  
  
            /*.subscribe(function(records) {
                    this.taxRecords = records;
              })
            */
  
  printReport(): void {
    window.print();
  }
}

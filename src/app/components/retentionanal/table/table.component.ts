import { Component, OnInit } from '@angular/core';
import {tableservice} from './table.service';
import { NgModule } from '@angular/core';
import { NgFor } from '@angular/common';
import { DateRangeService } from '../../date-rangeaudit.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrintReportService } from '../../../services/printreport.service'; // Adjust path based on your structure

interface tableRecords {
  customer_id: string;
  name: string;
  active_date: string;
  estimate_date: string;
  location: string;
  status: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
      NgFor,
      FormsModule 
    ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent  implements OnInit {
  
  fromDate: string = '';
toDate: string = '';


  tableRecords: tableRecords[] = [];
  
  constructor(
    private tableservice: tableservice,
    private dateRangeService: DateRangeService,
    private router: Router,
  private printReportService: PrintReportService
  ) {
    
   }
  
  ngOnInit(): void {
    this.dateRangeService.currentRange$.subscribe(range => {
      if (range.fromDate && range.toDate) {
        this.getRecords(range.fromDate, range.toDate);
      } else {
        // When no dates are selected, pass empty strings or null to the API to load all records
        this.getRecords('', ''); // Or use null based on your API expectations
      }
    });
  }
  
  getRecords(from?: string, to?: string): 
  void {
    console.log("Calling getTaxRecords with:", from, to);
  
    if (from && to) {
      // Both dates are selected correctly
      this.tableservice.getRecords(from, to)
        .subscribe(
          records => {
            this.tableRecords = records;
            console.log(this.tableRecords);
          },
          error => {
            console.error("Error fetching tax records:", error);
          }
        );
    } else {
      // No dates selected, fetch all records without any filter
      this.tableservice.getAllRecords()
        .subscribe(
          records => {
            this.tableRecords = records;
            console.log(this.tableRecords);
          },
          error => {
            console.error("Error fetching all tax records:", error);
          }
        );
    }
  }

  printReport(): void {
  if (!this.tableRecords || this.tableRecords.length === 0) {
    alert('No data available to print.');
    return;
  }

  const tableColumns = ['Customer ID', 'Name', 'Active Date', 'Estimate Date', 'Location', 'Status'];

  const tableData = this.tableRecords.map(record => ({
    'Customer ID': record.customer_id,
    'Name': record.name,
    'Active Date': record.active_date,
    'Estimate Date': record.estimate_date,
    'Location': record.location,
    'Status': record.status
  }));

  const reportPayload = {
    reportType: 'Customer Estimate Report',
    exportFormat: 'PDF Document (.pdf)',
    startDate: this.fromDate,
    endDate: this.toDate,
    pageOrientation: 'Portrait',
    tableColumns,
    tableData
  };

  this.router.navigate(['/businessowner/printreport'], {
    state: reportPayload
  });

  this.printReportService.setReportData(reportPayload); // Store data for print page
}

}
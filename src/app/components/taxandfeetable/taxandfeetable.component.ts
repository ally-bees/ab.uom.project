import { Component, OnInit } from '@angular/core';
import { TaxTableService } from './taxtable.service';
import { CommonModule } from '@angular/common';
import { DateRangeService } from '../date-rangeaudit.service';
import { PrintReportService } from '../../services/printreport.service';
import { Router } from '@angular/router';
import { Invoice } from '../../models/invoice.model';

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
  imports: [CommonModule],
  templateUrl: './taxandfeetable.component.html',
  styleUrl: './taxandfeetable.component.css'
})

export class TaxandfeetableComponent implements OnInit {



  fromDate: string | undefined;
  toDate: string | undefined;

  // Filtered invoices list
  filteredInvoices: Invoice[] = [];

  // UI state flags
  loading = false;
  error = false;


  taxRecords: TaxRecord[] = [];

  constructor(
    private router: Router,
    private TaxTableService: TaxTableService,
    private dateRangeService: DateRangeService,
    private printReportService: PrintReportService,
  ) { }

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
    console.log('Tax Records:', this.taxRecords);

    if (!this.taxRecords || this.taxRecords.length === 0) {
      alert('No data available to print.');
      return;
    }

    const tableColumns = ['Date', 'Audit ID', 'Sales ID', 'Name', 'Value', 'Tax', 'Net Value', 'Status'];

    const tableData = this.taxRecords.map(record => ({
      'Date': new Date(record.date).toLocaleDateString(),
      'Audit ID': record.auditId,
      'Sales ID': record.salesId,
      'Name': record.name,
      'Value': record.value.toFixed(2),
      'Tax': record.tax.toFixed(2),
      'Net Value': record.netValue.toFixed(2),
      'Status': record.status ?? 'N/A'
    }));

    console.log('Table Data to Pass:', tableData);

    const reportPayload = {
      reportType: 'Tax and Fee Report',
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
    this.printReportService.setReportData(reportPayload);
  }


}

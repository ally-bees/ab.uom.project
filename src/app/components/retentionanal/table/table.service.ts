import { Injectable } from '@angular/core'; //use to inject one component to another component
import { Observable, of } from 'rxjs'; //observable handle multiple data asynchronously  and create observable from static data

interface tableRecords {
  auditId: string;
  name: string;
  value: number;
  tax: number;
  netValue: number;
  status: string;
}

@Injectable({               //how we use injectable
  providedIn: 'root'
})


export class tableservice {
  // Mock data to simulate database response
  private tableRecords: tableRecords[] = [  //taxRecords is array of object(tax records) and TaxRecord[] is how we create a array of object
    { auditId: '00001A', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Paid' }, //every thing is an object
    { auditId: '00002B', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Pend' },
    { auditId: '00003C', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Paid' },
    { auditId: '00004D', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Paid' },
    { auditId: '00005E', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'pend' },
    { auditId: '00005E', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Pend' }
  ];
  
  constructor() { }
  
  getTaxRecords(): Observable<tableRecords[]> {   //Observable<TaxRecord[]> is return type. method returns an Observable that emits an array of TaxRecord objects.
    // Return mock data as an Observable (simulating HTTP request)
    return of(this.tableRecords); //of() is an RxJS function that creates an Observable from the given data.this.taxRecords stores inside the service
  }
}
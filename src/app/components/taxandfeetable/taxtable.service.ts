import { Injectable } from '@angular/core'; //use to inject one component to another component
import { Observable, of } from 'rxjs'; //observable handle multiple data asynchronously  and create observable from static data
import { HttpClient } from '@angular/common/http'; // HTTP requests to a backend API 

interface TaxRecord {
  date: Date;
  auditId: string;
  salesId: string;  
  name: string;
  value: number;
  tax: number;
  netValue: number;  
  status?: string;  // ❓ Backend doesn't return this, so make it optional
}

@Injectable({               //how we use injectable
  providedIn: 'root'
})

export class TaxTableService {
    // Mock data to simulate database response

/*  private taxRecords: TaxRecord[] = [  //taxRecords is array of object(tax records) and TaxRecord[] is how we create a array of object
    { auditId: '00001A', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Paid' }, //every thing is an object
    { auditId: '00002B', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Pend' },
    { auditId: '00003C', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Paid' },
    { auditId: '00004D', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Paid' },
    { auditId: '00005E', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'pend' },
    { auditId: '00005E', name: 'Kumar', value: 1000, tax: 100, netValue: 900, status: 'Pend' }
  ]; */
  
  
  private apiUrl = 'http://localhost:5110/Table/table'; // Change to match your backend API

  constructor(private http: HttpClient) {}
  
  // Fetch all tax records from the backend
  getTaxRecords(): Observable<TaxRecord[]> {
    return this.http.get<TaxRecord[]>(this.apiUrl);
  }
}
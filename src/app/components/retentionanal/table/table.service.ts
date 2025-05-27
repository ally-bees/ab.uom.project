import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface tableRecords {
  customer_id: string;
  name: string;
  active_date: string;
  estimate_date: string;
  location: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class tableservice {
  private apiUrl = 'http://localhost:5241/Customer/custable';

  constructor(private http: HttpClient) {}

  getRecords(from: string, to: string): Observable<tableRecords[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<tableRecords[]>(this.apiUrl, { params });
  }

  getAllRecords(): Observable<tableRecords[]> {
    return this.http.get<tableRecords[]>(this.apiUrl);
  }
}

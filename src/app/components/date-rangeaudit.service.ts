import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {
  private dateRangeSource = new BehaviorSubject<{ fromDate: string, toDate: string }>({ fromDate: '', toDate: '' });
  currentRange$ = this.dateRangeSource.asObservable();

  updateDateRange(fromDate: string, toDate: string) {
    this.dateRangeSource.next({ fromDate, toDate });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:5241/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getCompanyId(): string | null {
    return this.authService.getCurrentUser()?.CompanyId ?? null;
  }

  getCustomerCount(): Observable<number> {
    const companyId = this.getCompanyId();
    if (!companyId) return of(0);

    // ✅ Correct URL to match your backend (with query param)
    return this.http.get<number>(`${this.baseUrl}/CustomerCount/count?companyId=${companyId}`);
  }

  getIncomeTotal(): Observable<number> {
    const companyId = this.getCompanyId();
    if (!companyId) return of(0);

    // ✅ Updated to use query param for filtering by company
    return this.http.get<any[]>(`${this.baseUrl}/finance/company/${companyId}`).pipe(
      map(data =>
        data
          .filter(entry => entry.status === 'income')
          .reduce((total, item) => total + item.amount, 0)
      )
    );
  }

  getTotalProductsSold(): Observable<number> {
    const companyId = this.getCompanyId();
    if (!companyId) return of(0);

    // ✅ Updated to use query param
    return this.http.get<any[]>(`${this.baseUrl}/orders/company/${companyId}`).pipe(
      map(orders =>
        orders.reduce((total, order) => {
          const items = order.orderDetails || [];
          return total + items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
        }, 0)
      )
    );
  }
}

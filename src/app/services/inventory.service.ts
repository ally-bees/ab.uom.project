import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';
import { SalesViewModel } from '../models/sale.model';
import { product } from '../models/product.model';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:5241/api/Inventory';

  constructor(private http: HttpClient, private authService: AuthService) { }


  getAllProducts(): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}`);
  }


  getProductById(id: string): Observable<product> {
    return this.http.get<product>(`${this.apiUrl}/${id}`);
  }


  addProduct(product: product): Observable<product> {
    return this.http.post<product>(`${this.apiUrl}`, product);
  }


  updateProduct(id: string, product: product): Observable<product> {
    return this.http.put<product>(`${this.apiUrl}/${id}`, product);
  }


  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  getLowStockProducts(): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/lowstock`);
  }


  getOutOfStockProducts(): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/outofstock`);
  }


  getBestSellingProducts(limit: number = 5): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/bestselling?limit=${limit}`);
  }

  getInventoryByCompany(): Observable<product[]> {
    // You may need to inject AuthService in the constructor if not already present
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<product[]>(`${this.apiUrl}/company/${companyId}`);
  }

  updateProductStock(productId: string, addQuantity: number): Observable<any> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    // First, get the current product to know its stock
    return this.getProductById(productId).pipe(
      switchMap(product => {
        const newStockQuantity = product.stockQuantity + addQuantity;
        return this.http.patch(
          `${this.apiUrl}/company/${companyId}/product/${productId}/stock`,
          newStockQuantity,
          { responseType: 'text' }
        );
      })
    );
  }

  getBestSellingProductsByCompany(limit: number = 10): Observable<product[]> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<product[]>(`${this.apiUrl}/bestselling?limit=51`).pipe(
      map(products => products.filter(p => p.companyId === companyId).slice(0, limit))
    );
  }
}
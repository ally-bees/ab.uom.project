import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/sale.model';
import { SalesViewModel } from '../models/sale.model';
import { product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:5241/api/Inventory'; 

  constructor(private http: HttpClient) { }


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
}
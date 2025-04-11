import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'https://localhost:7143/api/Inventory';

  constructor(private http: HttpClient) { }

  getAllInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getInventoryById(id: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  getInventoryByProductId(productId: string): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/product/${productId}`);
  }

  createInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, inventory);
  }

  updateInventory(id: string, inventory: Inventory): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, inventory);
  }

  deleteInventory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
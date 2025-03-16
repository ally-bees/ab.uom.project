import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Topproduct{
    proid : string,
    name: string,
    imgurl :string
}

@Injectable({
    providedIn: 'root' 
  })

export class productservice{

    // Mock data to simulate database response
        private topproduct: Topproduct = {
            proid: "OR1211",
            name: "Marshall Headphone",
            imgurl:"'https://example.com/cat-image.jpg'"
        };  
        
        constructor() { }
        
        getproRecords(): Observable<Topproduct> {
          return of(this.topproduct); 
        }
} 
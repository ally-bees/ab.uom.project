import { Component } from '@angular/core';
import { valuerateservice } from './valuerate.service';

interface pur{
  value : number,
  rate: number,
}

@Component({
  selector: 'app-valuerate',
  standalone: true,
  imports: [],
  templateUrl: './valuerate.component.html',
  styleUrl: './valuerate.component.css',
  providers: [valuerateservice] 
  
})

export class ValuerateComponent {
  pur: pur | null = null;
  
    constructor(private valuerateservice:valuerateservice){
      
    }
    ngOnInit(): void {
      this.getpur();
    }
  
    getpur(): void {
      this.valuerateservice.getpur().subscribe(records => {
        this.pur = records;
      });
    }
}

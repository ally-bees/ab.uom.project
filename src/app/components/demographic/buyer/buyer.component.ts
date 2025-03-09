import { Component, OnInit } from '@angular/core';
import { buyerService } from './buyer.service';

interface Topbuyer{
  name : string;
  orders: number;
  location: string;
  img:string;
}

@Component({
  selector: 'app-buyer',
  standalone: true,
  imports: [],
  templateUrl: './buyer.component.html',
  styleUrl: './buyer.component.css',
  providers: [buyerService] 
})
export class BuyerComponent implements OnInit {

  buyerrecord: Topbuyer | null = null;

  constructor(private buyerservice:buyerService){
    
  }
  ngOnInit(): void {
    this.getbuyRecords();
  }

  getbuyRecords(): void {
    this.buyerservice.getbuyRecords().subscribe(records => {
      this.buyerrecord = records;
    });
  }
}

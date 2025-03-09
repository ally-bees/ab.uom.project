import { Component ,OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ CommonModule,RouterModule],
  templateUrl: './customer-insight.component.html',
  styleUrl: './customer-insight.component.css'
})
export class customerinsightComponent{
}

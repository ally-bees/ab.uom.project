import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CourierDashboardComponent } from './pages/courier/courier-dashboard.component';
import { MarketingDashboardComponent } from './pages/marketing-dashboard/marketing-dashboard.component';
import { ShippingDashboardComponent } from './pages/shipping-dashboard/shipping-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { SalesComponent } from './pages/sales/sales.component';
import { AgGridModule } from 'ag-grid-angular';
import { ExpenseFormComponent } from './pages/expense-form/expense-form.component';

import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';


ModuleRegistry.registerModules([ClientSideRowModelModule]);

@NgModule({
  declarations: [
    MarketingDashboardComponent,
  ],
  imports: [
    BrowserModule,
    SalesComponent,
    BrowserAnimationsModule,
    CommonModule,
    FormComponent,
    AppComponent,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,  
    MatCardModule,
    MatDividerModule,
    ShippingDashboardComponent,
    CourierDashboardComponent,
    HttpClientModule,
    AgGridModule,
    ExpenseFormComponent
  ],
  providers: [
    DatePipe,
    
  ],

})
export class AppModule { }

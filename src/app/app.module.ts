import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form/form.component';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CourierDashboardComponent } from './pages/courier/courier-dashboard.component';

@NgModule({
  declarations: [
    CourierDashboardComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormComponent,
    AppComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DatePipe
  ],
  // bootstrap: [AppComponent]  // Bootstrap with AppComponent
})
export class AppModule { }
export class CourierModule {}

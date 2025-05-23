import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingDashboardComponent } from './shipping-dashboard.component';

describe('ShippingDashboardComponent', () => {
  let component: ShippingDashboardComponent;
  let fixture: ComponentFixture<ShippingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersummaryComponent } from './customersummary.component';

describe('CustomersummaryComponent', () => {
  let component: CustomersummaryComponent;
  let fixture: ComponentFixture<CustomersummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

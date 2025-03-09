import { ComponentFixture, TestBed } from '@angular/core/testing';

import { customerinsightComponent } from './customer-insight.component';

describe('customerinsightComponent', () => {
  let component: customerinsightComponent;
  let fixture: ComponentFixture<customerinsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [customerinsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(customerinsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

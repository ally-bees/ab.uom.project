import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDashComponent } from './businessowner.component';

describe('BusinessownerComponent', () => {
  let component: BusinessDashComponent;
  let fixture: ComponentFixture<BusinessDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

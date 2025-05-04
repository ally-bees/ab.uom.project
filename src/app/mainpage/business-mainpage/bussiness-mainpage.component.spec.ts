import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMainpageComponent } from './bussiness-mainpage.component';

describe('BussinessMainpageComponent', () => {
  let component: BusinessMainpageComponent;
  let fixture: ComponentFixture<BusinessMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessMainpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

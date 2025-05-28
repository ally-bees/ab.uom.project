import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestbusinessDashboardComponent } from './testbusiness-dashboard.component';

describe('TestbusinessDashboardComponent', () => {
  let component: TestbusinessDashboardComponent;
  let fixture: ComponentFixture<TestbusinessDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestbusinessDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestbusinessDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

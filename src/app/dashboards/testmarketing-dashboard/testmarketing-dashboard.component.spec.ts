import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestmarketingDashboardComponent } from './testmarketing-dashboard.component';

describe('TestmarketingDashboardComponent', () => {
  let component: TestmarketingDashboardComponent;
  let fixture: ComponentFixture<TestmarketingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestmarketingDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestmarketingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsalesDashboardComponent } from './testsales-dashboard.component';

describe('TestsalesDashboardComponent', () => {
  let component: TestsalesDashboardComponent;
  let fixture: ComponentFixture<TestsalesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestsalesDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestsalesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestinventoryDashboardComponent } from './testinventory-dashboard.component';

describe('TestinventoryDashboardComponent', () => {
  let component: TestinventoryDashboardComponent;
  let fixture: ComponentFixture<TestinventoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestinventoryDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestinventoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

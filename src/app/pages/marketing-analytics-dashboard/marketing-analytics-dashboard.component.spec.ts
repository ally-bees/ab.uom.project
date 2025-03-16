import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAnalyticsDashboardComponent } from './marketing-analytics-dashboard.component';

describe('MarketingAnalyticsDashboardComponent', () => {
  let component: MarketingAnalyticsDashboardComponent;
  let fixture: ComponentFixture<MarketingAnalyticsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingAnalyticsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingAnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarketingAnalyticsDashboardComponent } from './marketing-analytics-dashboard.component';

describe('MarketingAnalyticsDashboardComponent', () => {
  let component: MarketingAnalyticsDashboardComponent;
  let fixture: ComponentFixture<MarketingAnalyticsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketingAnalyticsDashboardComponent],  // Use declarations, not imports
      // Add any necessary modules here in the imports array, like CommonModule, FormsModule, etc., if needed
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

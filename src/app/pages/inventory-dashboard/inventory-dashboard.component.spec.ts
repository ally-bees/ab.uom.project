import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryDashboardComponent } from './inventory-dashboard.component';
import { FormsModule } from '@angular/forms';

describe('InventoryDashboardComponent', () => {
  let component: InventoryDashboardComponent;
  let fixture: ComponentFixture<InventoryDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryDashboardComponent, FormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InventoryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter stock alerts based on search term', () => {
    // Set search term
    component.searchTerm = '1233';
    
    // Check filtered results
    const filteredAlerts = component.filterStockAlerts();
    expect(filteredAlerts.length).toBe(1);
    expect(filteredAlerts[0].orderId).toBe('1233');
    
    // Change search term
    component.searchTerm = 'In Stock';
    
    // Check new filtered results
    const newFilteredAlerts = component.filterStockAlerts();
    expect(newFilteredAlerts.length).toBe(1);
    expect(newFilteredAlerts[0].status).toBe('In Stock');
  });
});
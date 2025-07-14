import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourierDashboardComponent } from './courier-dashboard.component';

describe('CourierDashboardComponent', () => {
  let component: CourierDashboardComponent;
  let fixture: ComponentFixture<CourierDashboardComponent>;

  // Setup the testing module before running any tests
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierDashboardComponent ] // Declare the component to be tested
    })
    .compileComponents(); // Compile component's template and CSS
  });

  // Create the component instance and trigger initial change detection
  beforeEach(() => {
    fixture = TestBed.createComponent(CourierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Run change detection
  });

  // Basic creation test to ensure component initializes properly
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test for correct class returned for 'Completed' status
  it('should return correct class for completed status', () => {
    expect(component.getStatusClass('Completed')).toBe('completed');
  });

  // Test for correct class returned for 'Pending' status
  it('should return correct class for pending status', () => {
    expect(component.getStatusClass('Pending')).toBe('pending');
  });

  // Test for correct class returned for 'Rejected' status
  it('should return correct class for rejected status', () => {
    expect(component.getStatusClass('Rejected')).toBe('rejected');
  });
});

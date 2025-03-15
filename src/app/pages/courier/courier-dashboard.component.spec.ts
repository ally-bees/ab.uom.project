import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourierDashboardComponent } from './courier-dashboard.component';

describe('CourierDashboardComponent', () => {
  let component: CourierDashboardComponent;
  let fixture: ComponentFixture<CourierDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourierDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct class for completed status', () => {
    expect(component.getStatusClass('Completed')).toBe('completed');
  });

  it('should return correct class for pending status', () => {
    expect(component.getStatusClass('Pending')).toBe('pending');
  });

  it('should return correct class for rejected status', () => {
    expect(component.getStatusClass('Rejected')).toBe('rejected');
  });
});

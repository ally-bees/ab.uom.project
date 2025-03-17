import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditdashboardcomponentComponent } from './auditdashboardcomponent.component';

describe('AuditdashboardcomponentComponent', () => {
  let component: AuditdashboardcomponentComponent;
  let fixture: ComponentFixture<AuditdashboardcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditdashboardcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditdashboardcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

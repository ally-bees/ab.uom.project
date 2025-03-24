import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditdashboardComponent } from './auditdashboard.component';

describe('AuditdashboardComponent', () => {
  let component: AuditdashboardComponent;
  let fixture: ComponentFixture<AuditdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditstatustrackerComponent } from './auditstatustracker.component';

describe('AuditstatustrackerComponent', () => {
  let component: AuditstatustrackerComponent;
  let fixture: ComponentFixture<AuditstatustrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditstatustrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditstatustrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

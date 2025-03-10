import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditpageComponent } from './auditpage.component';

describe('AuditpageComponent', () => {
  let component: AuditpageComponent;
  let fixture: ComponentFixture<AuditpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

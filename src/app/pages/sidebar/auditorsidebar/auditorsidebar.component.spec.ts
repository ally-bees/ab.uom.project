import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorsidebarComponent } from './auditorsidebar.component';

describe('AuditorsidebarComponent', () => {
  let component: AuditorsidebarComponent;
  let fixture: ComponentFixture<AuditorsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditorsidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

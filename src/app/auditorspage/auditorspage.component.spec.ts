import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorspageComponent } from './auditorspage.component';

describe('AuditorspageComponent', () => {
  let component: AuditorspageComponent;
  let fixture: ComponentFixture<AuditorspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditorspageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

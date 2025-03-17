import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorpageComponent } from './auditorpage.component';

describe('AuditorpageComponent', () => {
  let component: AuditorpageComponent;
  let fixture: ComponentFixture<AuditorpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditorpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

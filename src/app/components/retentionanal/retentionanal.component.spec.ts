import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetentionanalComponent } from './retentionanal.component';

describe('RetentionanalComponent', () => {
  let component: RetentionanalComponent;
  let fixture: ComponentFixture<RetentionanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetentionanalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetentionanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

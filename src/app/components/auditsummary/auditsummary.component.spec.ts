import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditsummaryComponent } from './auditsummary.component';

describe('AuditsummaryComponent', () => {
  let component: AuditsummaryComponent;
  let fixture: ComponentFixture<AuditsummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditsummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditsummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

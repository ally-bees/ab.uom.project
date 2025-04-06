import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicComponent } from './demographic.component';

describe('DemographicComponent', () => {
  let component: DemographicComponent;
  let fixture: ComponentFixture<DemographicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemographicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemographicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

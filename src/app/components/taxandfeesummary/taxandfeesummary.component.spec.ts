import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxandfeesummaryComponent } from './taxandfeesummary.component';

describe('TaxandfeesummaryComponent', () => {
  let component: TaxandfeesummaryComponent;
  let fixture: ComponentFixture<TaxandfeesummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxandfeesummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxandfeesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

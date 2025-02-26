import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesHeatmapComponent } from './sales-heatmap.component';

describe('SalesHeatmapComponent', () => {
  let component: SalesHeatmapComponent;
  let fixture: ComponentFixture<SalesHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesHeatmapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

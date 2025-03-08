import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInsightComponent } from './sales-insight.component';

describe('SalesInsightComponent', () => {
  let component: SalesInsightComponent;
  let fixture: ComponentFixture<SalesInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

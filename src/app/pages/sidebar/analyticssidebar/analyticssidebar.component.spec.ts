import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticssidebarComponent } from './analyticssidebar.component';

describe('AnalyticssidebarComponent', () => {
  let component: AnalyticssidebarComponent;
  let fixture: ComponentFixture<AnalyticssidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticssidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticssidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

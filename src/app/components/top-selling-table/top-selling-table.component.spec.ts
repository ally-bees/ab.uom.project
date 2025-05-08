import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSellingTableComponent } from './top-selling-table.component';

describe('TopSellingTableComponent', () => {
  let component: TopSellingTableComponent;
  let fixture: ComponentFixture<TopSellingTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopSellingTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopSellingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

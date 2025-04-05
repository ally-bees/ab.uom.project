import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesMainpageComponent } from './sales-mainpage.component';

describe('SalesMainpageComponent', () => {
  let component: SalesMainpageComponent;
  let fixture: ComponentFixture<SalesMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesMainpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

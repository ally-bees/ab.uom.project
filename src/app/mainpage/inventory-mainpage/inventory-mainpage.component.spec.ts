import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryMainpageComponent } from './inventory-mainpage.component';

describe('InventoryMainpageComponent', () => {
  let component: InventoryMainpageComponent;
  let fixture: ComponentFixture<InventoryMainpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryMainpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

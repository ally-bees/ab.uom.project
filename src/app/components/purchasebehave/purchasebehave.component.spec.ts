import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasebehaveComponent } from './purchasebehave.component';

describe('PurchasebehaveComponent', () => {
  let component: PurchasebehaveComponent;
  let fixture: ComponentFixture<PurchasebehaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasebehaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasebehaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

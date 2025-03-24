import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxandfeetableComponent } from './taxandfeetable.component';

describe('TaxandfeetableComponent', () => {
  let component: TaxandfeetableComponent;
  let fixture: ComponentFixture<TaxandfeetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxandfeetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxandfeetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

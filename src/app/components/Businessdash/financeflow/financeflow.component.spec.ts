import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceflowComponent } from './financeflow.component';

describe('FinanceflowComponent', () => {
  let component: FinanceflowComponent;
  let fixture: ComponentFixture<FinanceflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceflowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

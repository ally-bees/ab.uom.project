import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceFlowComponent } from './financeflow.component';

describe('FinanceflowComponent', () => {
  let component: FinanceFlowComponent;
  let fixture: ComponentFixture<FinanceFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BochatpanelComponent } from './bochatpanel.component';

describe('BochatpanelComponent', () => {
  let component: BochatpanelComponent;
  let fixture: ComponentFixture<BochatpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BochatpanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BochatpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMchatpanelComponent } from './imchatpanel.component';

describe('IMchatpanelComponent', () => {
  let component: IMchatpanelComponent;
  let fixture: ComponentFixture<IMchatpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IMchatpanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IMchatpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

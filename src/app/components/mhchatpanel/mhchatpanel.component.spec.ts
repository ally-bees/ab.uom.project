import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MhchatpanelComponent } from './mhchatpanel.component';

describe('MhchatpanelComponent', () => {
  let component: MhchatpanelComponent;
  let fixture: ComponentFixture<MhchatpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MhchatpanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MhchatpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

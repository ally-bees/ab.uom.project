import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AimessagepanelComponent } from './aimessagepanel.component';

describe('AimessagepanelComponent', () => {
  let component: AimessagepanelComponent;
  let fixture: ComponentFixture<AimessagepanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AimessagepanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AimessagepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

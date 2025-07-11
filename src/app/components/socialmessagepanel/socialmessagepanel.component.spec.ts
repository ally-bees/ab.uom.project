import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialmessagepanelComponent } from './socialmessagepanel.component';

describe('SocialmessagepanelComponent', () => {
  let component: SocialmessagepanelComponent;
  let fixture: ComponentFixture<SocialmessagepanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialmessagepanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialmessagepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

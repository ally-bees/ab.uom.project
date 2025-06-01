import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatpanelComponent } from './chatpanel.component';

describe('ChatpanelComponent', () => {
  let component: ChatpanelComponent;
  let fixture: ComponentFixture<ChatpanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatpanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

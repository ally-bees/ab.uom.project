import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatpanelinvenComponent } from './chatpanelinven.component';

describe('ChatpanelinvenComponent', () => {
  let component: ChatpanelinvenComponent;
  let fixture: ComponentFixture<ChatpanelinvenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatpanelinvenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatpanelinvenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

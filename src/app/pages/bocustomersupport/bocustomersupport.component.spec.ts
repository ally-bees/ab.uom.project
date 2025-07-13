import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BocustomersupportComponent } from './bocustomersupport.component';

describe('BocustomersupportComponent', () => {
  let component: BocustomersupportComponent;
  let fixture: ComponentFixture<BocustomersupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BocustomersupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BocustomersupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

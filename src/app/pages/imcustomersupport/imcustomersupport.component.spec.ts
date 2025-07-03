import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMcustomersupportComponent } from './imcustomersupport.component';

describe('IMcustomersupportComponent', () => {
  let component: IMcustomersupportComponent;
  let fixture: ComponentFixture<IMcustomersupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IMcustomersupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IMcustomersupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MhcustomersupportComponent } from './mhcustomersupport.component';

describe('MhcustomersupportComponent', () => {
  let component: MhcustomersupportComponent;
  let fixture: ComponentFixture<MhcustomersupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MhcustomersupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MhcustomersupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

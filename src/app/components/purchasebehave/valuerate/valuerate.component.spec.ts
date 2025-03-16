import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuerateComponent } from './valuerate.component';

describe('ValuerateComponent', () => {
  let component: ValuerateComponent;
  let fixture: ComponentFixture<ValuerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuerateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

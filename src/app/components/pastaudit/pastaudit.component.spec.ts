import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastauditComponent } from './pastaudit.component';

describe('PastauditComponent', () => {
  let component: PastauditComponent;
  let fixture: ComponentFixture<PastauditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastauditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastauditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

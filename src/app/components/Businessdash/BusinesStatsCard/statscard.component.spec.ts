import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatscardComponent } from './statscard.component';

describe('StatscardComponent', () => {
  let component: StatscardComponent;
  let fixture: ComponentFixture<StatscardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatscardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatscardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

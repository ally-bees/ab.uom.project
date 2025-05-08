import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouriersidebarComponent } from './couriersidebar.component';

describe('CouriersidebarComponent', () => {
  let component: CouriersidebarComponent;
  let fixture: ComponentFixture<CouriersidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CouriersidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouriersidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BOSidebarComponent  } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: BOSidebarComponent ;
  let fixture: ComponentFixture<BOSidebarComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BOSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BOSidebarComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

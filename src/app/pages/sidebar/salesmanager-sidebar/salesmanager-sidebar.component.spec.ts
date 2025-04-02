import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanagerSidebarComponent } from './salesmanager-sidebar.component';

describe('SalesmanagerSidebarComponent', () => {
  let component: SalesmanagerSidebarComponent;
  let fixture: ComponentFixture<SalesmanagerSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesmanagerSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesmanagerSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

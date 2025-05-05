import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySidebarComponent } from './inventory-sidebar.component';

describe('InventorySidebarComponent', () => {
  let component: InventorySidebarComponent;
  let fixture: ComponentFixture<InventorySidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorySidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorySidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

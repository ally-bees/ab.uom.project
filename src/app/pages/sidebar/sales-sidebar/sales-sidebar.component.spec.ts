import { ComponentFixture, TestBed } from '@angular/core/testing';
import { salesSidebarComponent } from './sales-sidebar.component';


describe('salesSidebarComponent', () => {
  let component: salesSidebarComponent;
  let fixture: ComponentFixture<salesSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [salesSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(salesSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

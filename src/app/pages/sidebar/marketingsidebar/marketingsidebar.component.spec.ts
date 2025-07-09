import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingsidebarComponent } from './marketingsidebar.component';

describe('MarketingsidebarComponent', () => {
  let component: MarketingsidebarComponent;
  let fixture: ComponentFixture<MarketingsidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketingsidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingsidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

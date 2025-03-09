import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailgraphComponent } from './detailgraph.component';

describe('DetailgraphComponent', () => {
  let component: DetailgraphComponent;
  let fixture: ComponentFixture<DetailgraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailgraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

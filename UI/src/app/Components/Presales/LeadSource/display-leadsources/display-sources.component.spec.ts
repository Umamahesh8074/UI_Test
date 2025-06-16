import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayLeadSourcesComponent } from './display-sources.component';


describe('DisplaySourcesComponent', () => {
  let component: DisplayLeadSourcesComponent;
  let fixture: ComponentFixture<DisplayLeadSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayLeadSourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLeadSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayLeadSubSourcesComponent } from './display-subsources.component';


describe('DisplayLeadSubSourcesComponent', () => {
  let component: DisplayLeadSubSourcesComponent;
  let fixture: ComponentFixture<DisplayLeadSubSourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayLeadSubSourcesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayLeadSubSourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

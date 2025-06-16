import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayduplicateleadhistoryComponent } from '../displayduplicateleadhistory/displayduplicateleadhistory.component';

describe('DuplicateleadhistoryComponent', () => {
  let component: DisplayduplicateleadhistoryComponent;
  let fixture: ComponentFixture<DisplayduplicateleadhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayduplicateleadhistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayduplicateleadhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

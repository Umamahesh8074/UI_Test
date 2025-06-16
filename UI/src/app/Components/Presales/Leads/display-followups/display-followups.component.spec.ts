import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayFollowupsComponent } from './display-followups.component';

describe('DisplayFollowupsComponent', () => {
  let component: DisplayFollowupsComponent;
  let fixture: ComponentFixture<DisplayFollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayFollowupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

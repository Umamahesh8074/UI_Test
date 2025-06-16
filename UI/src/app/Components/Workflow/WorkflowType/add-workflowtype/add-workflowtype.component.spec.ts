import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkflowtypeComponent } from './add-workflowtype.component';

describe('AddWorkflowtypeComponent', () => {
  let component: AddWorkflowtypeComponent;
  let fixture: ComponentFixture<AddWorkflowtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkflowtypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkflowtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

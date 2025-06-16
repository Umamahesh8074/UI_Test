import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockUnitComponent } from './block-unit.component';

describe('BlockUnitComponent', () => {
  let component: BlockUnitComponent;
  let fixture: ComponentFixture<BlockUnitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockUnitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlockUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

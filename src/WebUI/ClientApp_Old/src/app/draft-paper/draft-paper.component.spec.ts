import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraftPaperComponent } from './draft-paper.component';

describe('DraftPaperComponent', () => {
  let component: DraftPaperComponent;
  let fixture: ComponentFixture<DraftPaperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraftPaperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraftPaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

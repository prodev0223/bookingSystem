import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntMultiCheckboxComponent } from './ant-multi-checkbox.component';

describe('AntMultiCheckboxComponent', () => {
  let component: AntMultiCheckboxComponent;
  let fixture: ComponentFixture<AntMultiCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntMultiCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AntMultiCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

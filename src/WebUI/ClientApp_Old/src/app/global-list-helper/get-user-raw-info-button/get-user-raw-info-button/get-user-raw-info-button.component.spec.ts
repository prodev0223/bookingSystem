import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUserRawInfoButtonComponent } from './get-user-raw-info-button.component';

describe('GetUserRawInfoButtonComponent', () => {
  let component: GetUserRawInfoButtonComponent;
  let fixture: ComponentFixture<GetUserRawInfoButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetUserRawInfoButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUserRawInfoButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

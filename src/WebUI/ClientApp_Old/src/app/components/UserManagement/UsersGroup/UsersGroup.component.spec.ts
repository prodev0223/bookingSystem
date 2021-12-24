/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { UsersGroupComponent } from "./UsersGroup.component";

describe("UsersGroupComponent", () => {
  let component: UsersGroupComponent;
  let fixture: ComponentFixture<UsersGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

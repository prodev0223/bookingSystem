/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RoomExtraFieldsComponent } from "./RoomExtraFields.component";

describe("RoomExtraFieldsComponent", () => {
  let component: RoomExtraFieldsComponent;
  let fixture: ComponentFixture<RoomExtraFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RoomExtraFieldsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomExtraFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

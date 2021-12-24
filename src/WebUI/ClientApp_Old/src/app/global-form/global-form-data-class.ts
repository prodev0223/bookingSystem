import {FormlyFieldConfig} from "@ngx-formly/core";
import {GlobalVariable} from "./form-templates/room-create";

export class GlobalFormDataClass {
  public formName: string = "No form name";
  public formModel: object = {};
  public formFields: FormlyFieldConfig[];
  public formData: object = {};
  public formType: GlobalFormType = GlobalFormType.Unknown;
  public formVisible: boolean = false;
  public formViewControl: GlobalViewOptions = new GlobalViewOptions();

  constructor(show?: boolean) {
    this.formVisible = show;
    const a = GlobalVariable.BASE_API_URL;
    this.formViewControl = new GlobalViewOptions();
  }
}

export enum GlobalFormType {
  Unknown = "Unknown",
  Building = "Building",
  NewBooking = "NewBooking",
  NewRoom = "NewRoom",
  Permission = "Permission",
  RoomSet = "RoomSet",
  UserRole = "UserRole",
  UserGroup = "UserGroup",
  NewSimpleUser = "NewSimpleUser"
}

export enum GlobalFormActionType {
  New = "New",
  NewBooking = "New Booking",
  Update = "Update",
}
export class GlobalViewOptions {
  public Editable: boolean = false;
}

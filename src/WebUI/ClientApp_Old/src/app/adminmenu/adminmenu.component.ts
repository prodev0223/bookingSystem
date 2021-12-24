import { Component, OnInit } from "@angular/core";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { MenuItem } from "primeng/api";
import { WinBoxService } from "../dynamicwinbox/winboxservice";
import { Pathname } from "../enums/pathname";
import { GlobalSimpleCreateUser } from "../global-form/form-templates/for-create-simple-user";
import {
  GlobalFormActionType,
  GlobalFormDataClass,
  GlobalFormType,
} from "../global-form/global-form-data-class";
import { RoomExtraSettingsComponent } from "../settings-forms/room-extra-settings/room-extra-settings.component";
import { SmtpSettingsComponent } from "../settings-forms/smtp-settings/smtp-settings.component";

@Component({
  selector: "app-adminmenu",
  templateUrl: "./adminmenu.component.html",
  styleUrls: ["./adminmenu.component.css"],
})
export class AdminmenuComponent implements OnInit {
  items: MenuItem[];

  formDataPackage: GlobalFormDataClass = new GlobalFormDataClass();

  constructor(private winBoxService: WinBoxService) {}

  ngOnInit(): void {
    console.log("admin menu init");
    this.items = [
      {
        label: "Room settings",
        items: [
          //          {label: `buildings`, routerLink: [`/${Pathname.GlobalList}/${Pathname.Buildings}`]},
          {
            label: "Rooms",
            routerLink: [`/${Pathname.GlobalList}/${Pathname.Rooms}`],
          },
          {
            label: "Rooms (New)",
            routerLink: [`/${Pathname.Rooms}`],
          },
          {
            label: "Room Extra Fields",
            command: () => this.showRoomExtraFieldSettings(),
          },
          {
            label: "Room Extra Fields (New)",
            routerLink: [`/${Pathname.RoomExtraFields}`],
          },
          {
            label: "Rooms Groups",
            routerLink: [`/${Pathname.GlobalList}/${Pathname.RoomGroup}`],
          },
          {
            label: "Rooms Groups (New)",
            routerLink: [`/${Pathname.RoomGroup}`],
          },
          {
            label: "Permission Groups",
            routerLink: [`/${Pathname.GlobalList}/${Pathname.PermissionGroup}`],
          },
          {
            label: "Permission Groups (New)",
            routerLink: [`/${Pathname.PermissionGroup}`],
          },
          {
            label: "Roles",
            routerLink: [`/${Pathname.GlobalList}/${Pathname.UserRole}`],
          },
          {
            label: "Roles (New)",
            routerLink: [`/${Pathname.UserRole}`],
          },
        ],
      },
      {
        label: "User Settings",
        items: [
          {
            label: "Users",
            routerLink: [`/${Pathname.AllSimpleUserInfoList}`],
          },
          {
            label: "Users (New)",
            routerLink: [`/${Pathname.SimpleUserInfoList}`],
          },
          {
            label: "User Groups",
            routerLink: [`/${Pathname.GlobalList}/${Pathname.UserGroup}`],
          },
          {
            label: "User Groups (New)",
            routerLink: [`/${Pathname.UserGroup}`],
          },
        ],
      },
      {
        label: "Report",
        items: [
          { label: "Equipment Report", routerLink: ["/"] },
          { label: "Booking Report", routerLink: ["/"] },
          { label: "Unit Booking Report", routerLink: ["/"] },
          { label: "Loan Report", routerLink: ["/"] },
        ],
      },

      {
        label: "Logs",
        items: [
          { label: "Sign In", routerLink: ["/"] },
          { label: "Audit", routerLink: ["/"] },
        ],
      },

      {
        label: "Closed Day Management",
        items: [
          {
            label: "Closed Day",
            routerLink: [`/${Pathname.GlobalList}/${Pathname.ClosedDayList}`],
          },
          {
            label: "Closed Day (New)",
            routerLink: [`/${Pathname.ClosedDay}`],
          },
        ],
      },
      {
        label: "Booking",
        items: [
          { label: "View all Booking", routerLink: ["/"] },
          { label: "View Booking Equipment", routerLink: ["/"] },
        ],
      },
      {
        label: "Email",
        items: [
          {
            label: "SMTP Server Setting",
            command: () => this.showEmailSettingsWinBox(),
          },
          {
            label: "SMTP Server Setting (New)",
            routerLink: [`/${Pathname.SmtpSetting}`],
          },
        ],
      },
    ];
  }

  showEmailSettingsWinBox() {
    this.winBoxService.open(SmtpSettingsComponent, {});
  }

  showRoomExtraFieldSettings() {
    this.winBoxService.open(RoomExtraSettingsComponent, {});
  }

  newUser() {
    let newBookingForm = new GlobalFormDataClass();
    newBookingForm.formType = GlobalFormType.NewSimpleUser;
    newBookingForm.formName = GlobalFormActionType.New;
    let formFields: FormlyFieldConfig[] = GlobalSimpleCreateUser;
    newBookingForm.formVisible = true;
    newBookingForm.formFields = formFields;
    this.formDataPackage = newBookingForm;
  }

  getDataFormChildren($event: object) {}
}

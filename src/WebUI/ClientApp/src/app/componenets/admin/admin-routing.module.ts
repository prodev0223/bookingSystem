import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AllBookingsComponent } from "./AllBookings/AllBookings.component";
import { ClosedDayComponent } from "./CloseDay/ClosedDay/ClosedDay.component";
import { SMTPSettingComponent } from "./Email/SMTPSetting/SMTPSetting.component";
import { AuditComponent } from "./RoomSettings/audit/audit.component";
import { PermissionGroupsComponent } from "./RoomSettings/PermissionGroups/PermissionGroups.component";
import { RolesComponent } from "./RoomSettings/Roles/Roles.component";
import { RoomExtraFieldsComponent } from "./RoomSettings/RoomExtraFields/RoomExtraFields.component";
import { RoomGroupsComponent } from "./RoomSettings/RoomGroups/RoomGroups.component";
import { RoomsComponent } from "./RoomSettings/Rooms/Rooms.component";
import { UserInfoComponent } from "./RoomSettings/user-info/user-info.component";
import { UserGroupsComponent } from "./UserSettings/UserGroups/UserGroups.component";
import { UsersComponent } from "./UserSettings/Users/Users.component";
const routes: Routes = [
  {
    path: "roomsettings/rooms",
    component: RoomsComponent,
  },
  {
    path: "roomsettings/extrafields",
    component: RoomExtraFieldsComponent,
  },
  {
    path: "roomsettings/roomgroups",
    component: RoomGroupsComponent,
  },
  {
    path: "roomsettings/permissiongroups",
    component: PermissionGroupsComponent,
  },
  {
    path: "roomsettings/roles",
    component: RolesComponent,
  },
  {
    path: "roomsettings/userinfo",
    component: UserInfoComponent,
  },
  {
    path: "roomsettings/audit",
    component: AuditComponent,
  },
  {
    path: "usersettings/users",
    component: UsersComponent,
  },
  {
    path: "usersettings/groups",
    component: UserGroupsComponent,
  },
  {
    path: "closeday/closedday",
    component: ClosedDayComponent,
  },
  {
    path: "email/smtpsettings",
    component: SMTPSettingComponent,
  },
  {
    path: "allbookings",
    component: AllBookingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

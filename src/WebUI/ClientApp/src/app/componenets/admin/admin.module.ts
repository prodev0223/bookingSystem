import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import {
  OwlDateTimeModule,
  OwlNativeDateTimeModule,
  OWL_DATE_TIME_FORMATS,
} from "ng-pick-datetime";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgxMaskModule } from "ngx-mask";
import { AdminRoutingModule } from "./admin-routing.module";
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

export const OWL_CUSTOM_FORMATS = {
  timePickerInput: { hour: "numeric", minute: "numeric", hour12: false },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgxMaskModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    ModalModule.forRoot(),
  ],
  declarations: [
    RoomsComponent,
    RolesComponent,
    RoomExtraFieldsComponent,
    RoomGroupsComponent,
    PermissionGroupsComponent,
    UsersComponent,
    UserGroupsComponent,
    UserInfoComponent,
    AuditComponent,
    AllBookingsComponent,
    ClosedDayComponent,
    SMTPSettingComponent,
  ],
  providers: [
    DatePipe,
    { provide: OWL_DATE_TIME_FORMATS, useValue: OWL_CUSTOM_FORMATS },
  ],
})
export class AdminModule {}

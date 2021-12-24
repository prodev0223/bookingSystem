import { DatePipe, registerLocaleData } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import en from "@angular/common/locales/en";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timegrid";
import { NgSelectModule } from "@ng-select/ng-select";
import { FormlyModule } from "@ngx-formly/core";
import { FormlySelectModule } from "@ngx-formly/core/select";
import { FormlyNgZorroAntdModule } from "@ngx-formly/ng-zorro-antd";
import { AgGridModule } from "ag-grid-angular";
import { DataTablesModule } from "angular-datatables";
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCalendarModule } from "ng-zorro-antd/calendar";
import { NzCheckboxModule } from "ng-zorro-antd/checkbox";
import { NzDatePickerModule } from "ng-zorro-antd/date-picker";
import { NzDescriptionsModule } from "ng-zorro-antd/descriptions";
import { NzFormModule } from "ng-zorro-antd/form";
import { en_US, NZ_I18N } from "ng-zorro-antd/i18n";
import { NzIconModule } from "ng-zorro-antd/icon";
import { NzInputModule } from "ng-zorro-antd/input";
import { NzInputNumberModule } from "ng-zorro-antd/input-number";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzMenuModule } from "ng-zorro-antd/menu";
import { NzRadioModule } from "ng-zorro-antd/radio";
import { NzSelectModule } from "ng-zorro-antd/select";
import { NzTimePickerModule } from "ng-zorro-antd/time-picker";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { TimepickerModule } from "ngx-bootstrap/timepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { CookieService } from "ngx-cookie-service";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { ChipsModule } from "primeng/chips";
import { ColorPickerModule } from "primeng/colorpicker";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { DialogService, DynamicDialogModule } from "primeng/dynamicdialog";
import { InputMaskModule } from "primeng/inputmask";
import { InputTextModule } from "primeng/inputtext";
import { MegaMenuModule } from "primeng/megamenu";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { MultiSelectModule } from "primeng/multiselect";
import { OrganizationChartModule } from "primeng/organizationchart";
import { PanelModule } from "primeng/panel";
import { PickListModule } from "primeng/picklist";
import { SkeletonModule } from "primeng/skeleton";
import { SpeedDialModule } from "primeng/speeddial";
import { SplitterModule } from "primeng/splitter";
import { TableModule } from "primeng/table";
import { TabMenuModule } from "primeng/tabmenu";
import { ToastModule } from "primeng/toast";
import { ApiAuthorizationModule } from "src/api-authorization/api-authorization.module";
import { AuthorizeGuard } from "src/api-authorization/authorize.guard";
import { AuthorizeInterceptor } from "src/api-authorization/authorize.interceptor";
import { AdminmenuComponent } from "./adminmenu/adminmenu.component";
import { AppComponent } from "./app.component";
import {
  OnlyDecimals,
  OnlyDecimalsNG,
  OnlyNumbers,
  OnlyNumbersNG,
} from "./common/CustomDirectives";
import { RoomBookingComponent } from "./components/Bookings/RoomBooking/RoomBooking.component";
import { RoomReservationComponent } from "./components/Bookings/RoomReservation/RoomReservation.component";
import { ClosedDayComponent } from "./components/closed-day-management/ClosedDay/ClosedDay.component";
import { SmtpSettingComponent } from "./components/email/SmtpSetting/SmtpSetting.component";
import { MyBookingsComponent } from "./components/MyBookings/MyBookings.component";
import { PermissionGroupComponent } from "./components/room-management/PermissionGroup/PermissionGroup.component";
import { RolesComponent } from "./components/room-management/Roles/Roles.component";
import { RoomExtraFieldsComponent } from "./components/room-management/RoomExtraFields/RoomExtraFields.component";
import { RoomGroupComponent } from "./components/room-management/RoomGroup/RoomGroup.component";
import { RoomsListComponent } from "./components/room-management/RoomsList/RoomsList.component";
import { UserSettingComponent } from "./components/UserManagement/UserSetting/UserSetting.component";
import { UsersGroupComponent } from "./components/UserManagement/UsersGroup/UsersGroup.component";
import { DraftPaperComponent } from "./draft-paper/draft-paper.component";
import { WinBoxService } from "./dynamicwinbox/winboxservice";
import { EditBookingsComponent } from "./edit-bookings/edit-bookings.component";
import { Pathname } from "./enums/pathname";
import { AntCheckboxComponent } from "./formly-form-custom-field/ant-checkbox/ant-checkbox.component";
import { DatePickerComponent } from "./formly-form-custom-field/ant-design-date-picker/date-picker/date-picker.component";
import { AntDropdownComponent } from "./formly-form-custom-field/ant-dropdown/ant-dropdown.component";
import { AntInputComponent } from "./formly-form-custom-field/ant-input/ant-input.component";
import { AntMultiCheckboxComponent } from "./formly-form-custom-field/ant-multi-checkbox/ant-multi-checkbox.component";
import { DatetimePickerPrimeNgComponent } from "./formly-form-custom-field/datetime-picker-prime-ng/datetime-picker-prime-ng.component";
import { FormlyTabFieldComponent } from "./formly-form-custom-field/formly-tab-field/formly-tab-field.component";
import { TimePickerPrimeNgComponent } from "./formly-form-custom-field/time-picker-prime-ng/time-picker-prime-ng.component";
import { GenericListComponent } from "./generic-list/generic-list.component";
import { GlobalFormComponent } from "./global-form/global-form.component";
import { GetUserRawInfoButtonComponent } from "./global-list-helper/get-user-raw-info-button/get-user-raw-info-button/get-user-raw-info-button.component";
import { MyDatetimePipe } from "./helper/my-datetime.pipe";
import { MyTimeOnlyPipe } from "./helper/my-time-only.pipe";
import { HomeComponent } from "./home/home.component";
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { PermissionFormComponent } from "./permission-form/permission-form.component";
import { ChangeOneUserGroupSettingsComponent } from "./settings-forms/change-one-user-group-settings/change-one-user-group-settings.component";
import { PermissionSetComponent } from "./settings-forms/permission-set/permission-set.component";
import { RoomExtraSettingsComponent } from "./settings-forms/room-extra-settings/room-extra-settings.component";
import { RoomSetSettingsComponent } from "./settings-forms/room-set-settings/room-set-settings.component";
import { RoomSettingsComponent } from "./settings-forms/room-settings/room-settings.component";
import { SmtpSettingsComponent } from "./settings-forms/smtp-settings/smtp-settings.component";
import { UserGroupSettingsComponent } from "./settings-forms/user-group-settings/user-group-settings.component";
import { UserRoleSetFormComponent } from "./settings-forms/user-role-set-form/user-role-set-form.component";
import { TokenComponent } from "./token/token.component";
import { UserDetailsSettingsComponent } from "./user-details-settings/user-details-settings.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserOrganizationChartComponent } from "./user-organization-chart/user-organization-chart.component";
import { UserInfoPageComponent } from "./UserInfo/userinfo-page.component";

registerLocaleData(en);

const appRoutes: Routes = [
  { path: "", redirectTo: `/${Pathname.Home}`, pathMatch: "full" },
  {
    path: `${Pathname.Home}`,
    component: HomeComponent,
    // component: RoomReservationComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.AdminMenu}`,
    component: AdminmenuComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.Rooms}`,
    component: RoomsListComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.RoomExtraFields}`,
    component: RoomExtraFieldsComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.RoomGroup}`,
    component: RoomGroupComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.PermissionGroup}`,
    component: PermissionGroupComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.UserRole}`,
    component: RolesComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.GlobalList}`,
    component: GenericListComponent,
    runGuardsAndResolvers: `always`,
  },
  {
    path: `${Pathname.GlobalList}/:${Pathname.GlobalListName}`,
    component: GenericListComponent,
    runGuardsAndResolvers: `always`,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.MyInfo}`,
    component: UserInfoPageComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.MyBookings}`,
    component: MyBookingsComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.DraftPaper}`,
    component: DraftPaperComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.AllSimpleUserInfoList}`,
    component: UserListComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.UserOrgChart}`,
    component: UserOrganizationChartComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.UserGroup}`,
    component: UsersGroupComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.SimpleUserInfoList}`,
    component: UserSettingComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.RoomGroup}`,
    component: RoomGroupComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.ClosedDay}`,
    component: ClosedDayComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.SmtpSetting}`,
    component: SmtpSettingComponent,
    canActivate: [AuthorizeGuard],
  },
  {
    path: `${Pathname.RoomReservation}`,
    component: RoomReservationComponent,
    canActivate: [AuthorizeGuard],
  },
];

FullCalendarModule.registerPlugins([
  // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  resourceTimelinePlugin,
]);

@NgModule({
  declarations: [
    DatetimePickerPrimeNgComponent,
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    OnlyNumbers,
    OnlyNumbersNG,
    OnlyDecimals,
    OnlyDecimalsNG,
    SmtpSettingComponent,
    MyBookingsComponent,
    RoomsListComponent,
    UserSettingComponent,
    ClosedDayComponent,
    RoomReservationComponent,
    PermissionGroupComponent,
    AdminmenuComponent,
    GenericListComponent,
    GlobalFormComponent,
    TokenComponent,
    RoomBookingComponent,
    UsersGroupComponent,
    RolesComponent,
    RoomGroupComponent,
    RoomExtraFieldsComponent,
    UserInfoPageComponent,
    PermissionFormComponent,
    DraftPaperComponent,
    TimePickerPrimeNgComponent,
    MyDatetimePipe,
    UserListComponent,
    MyTimeOnlyPipe,
    UserOrganizationChartComponent,
    GetUserRawInfoButtonComponent,
    RoomSettingsComponent,
    RoomSetSettingsComponent,
    PermissionSetComponent,
    UserRoleSetFormComponent,
    UserGroupSettingsComponent,
    FormlyTabFieldComponent,
    UserDetailsSettingsComponent,
    EditBookingsComponent,
    ChangeOneUserGroupSettingsComponent,
    SmtpSettingsComponent,
    DatePickerComponent,
    AntMultiCheckboxComponent,
    AntInputComponent,
    AntDropdownComponent,
    AntCheckboxComponent,
    RoomExtraSettingsComponent,
  ],
  imports: [
    FormsModule,
    OrganizationChartModule,
    PickListModule,
    NgxJsonViewerModule,
    DynamicDialogModule,
    ToastModule,
    TabsModule.forRoot(),
    CardModule,
    DataTablesModule,
    ReactiveFormsModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    SkeletonModule,
    MenubarModule,
    ChipsModule,
    TabMenuModule,
    ConfirmDialogModule,
    ButtonModule,
    NgSelectModule,
    MessagesModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    ButtonsModule.forRoot(),
    ApiAuthorizationModule,
    RouterModule.forRoot(appRoutes, {
      relativeLinkResolution: "corrected",
      onSameUrlNavigation: "reload",
    }),

    BrowserAnimationsModule,

    FullCalendarModule,
    MenuModule,
    MegaMenuModule,
    ReactiveFormsModule,
    DropdownModule,
    ColorPickerModule,

    TableModule,
    //ModalModule.forRoot()
    AgGridModule.withComponents([GetUserRawInfoButtonComponent]),
    FormlyModule.forRoot({
      extras: { lazyRender: true },
      types: [
        { name: "tabs", component: FormlyTabFieldComponent },
        { name: "datetimeprimeng", component: DatetimePickerPrimeNgComponent },
        { name: "timeprimeng", component: TimePickerPrimeNgComponent },
        { name: "multicheckbox", component: AntMultiCheckboxComponent },
        { name: "antInput", component: AntInputComponent },
        { name: "antSelect", component: AntDropdownComponent },
        { name: "antCheckbox", component: AntCheckboxComponent },
      ],
    }),
    FormlyNgZorroAntdModule,
    SplitterModule,
    PanelModule,
    CalendarModule,
    InputMaskModule,
    MultiSelectModule,
    NzDatePickerModule,
    NzCalendarModule,
    MatSidenavModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    SpeedDialModule,
    MatListModule,
    MatTabsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzRadioModule,
    FormlySelectModule,
    NzCheckboxModule,
    NzDescriptionsModule,
    NzSelectModule,
    NzInputNumberModule,
    NzTimePickerModule,
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true },
    DatePipe,
    DialogService,
    WinBoxService,
    MessageService,
    MyDatetimePipe,
    MyTimeOnlyPipe,
    CookieService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

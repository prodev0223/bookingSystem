import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {format} from 'date-fns'

import {HttpClient} from "@angular/common/http";
import {
  BookingClient,
  BookingStatus,
  DeletePermissionSetCommand,
  DeleteRoomSetCommand,
  DeleteUserGroupCommand,
  DeleteUserRoleCommand,
  GetAllRoomSets,
  GetMarkedAsClosedCommand,
  RoomClient,
  UserClient,
  UserGroup,
  UserPermission,
  UserPermissionClient
} from "../web-api-client";
import {GridOptions} from "ag-grid-community";
import {GlobalFormActionType, GlobalFormDataClass, GlobalFormType} from "../global-form/global-form-data-class";
import {Pathname} from "../enums/pathname";
import {filter} from "rxjs/operators";
import {MyDatetimePipe} from "../helper/my-datetime.pipe";
import {TitleService} from "../service/title-service.service";
import {GlobalSimpleUpdateBooking} from "../global-form/form-templates/for-update-simple-booking";
import {PermissionsService} from "../service/permissions.service";
import {GetUserRawInfoButtonComponent} from "../global-list-helper/get-user-raw-info-button/get-user-raw-info-button/get-user-raw-info-button.component";
import {RoomInfoService} from "../service/room-info.service";
import {WinBoxService} from "../dynamicwinbox/winboxservice";
import {RoomSettingsComponent} from "../settings-forms/room-settings/room-settings.component";
import {RoomSetSettingsComponent} from "../settings-forms/room-set-settings/room-set-settings.component";
import {PermissionSetComponent} from "../settings-forms/permission-set/permission-set.component";
import {UserRoleSetFormComponent} from "../settings-forms/user-role-set-form/user-role-set-form.component";
import {UserGroupSettingsComponent} from "../settings-forms/user-group-settings/user-group-settings.component";
import {GlobalListEventService} from "../service/global-list-event.service";
import {WinBoxRef} from "../dynamicwinbox/win-box-ref";
import {EditBookingsComponent} from "../edit-bookings/edit-bookings.component";
import {ToastService} from "../service/toast.service";

@Component({
  selector: 'app-generic-list',
  templateUrl: './generic-list.component.html',
})
export class GenericListComponent implements OnInit, OnDestroy {
  public screenHeight: number;
  public screenWidth: number;
  public pathName: Pathname;
  public columnDefs;

  public gridApi;
  public gridColumnApi;

  public defaultColDef;
  public defaultColGroupDef;
  public columnTypes;
  public rowData: any;

  public gridOptions: GridOptions;

  public frameworkComponents;
  public childFormType: string;
  styleExp: any;
  gloablFormDataPackage: GlobalFormDataClass;
  deleteVisible: boolean = false;


  testMessage(){
    this.toastService.add(
      {
        severity: 'success',
        summary: `Create Booking OK`,
        detail: `Create Booking OK`,
      }
    );
  }

  constructor(
    private globalListEventService: GlobalListEventService,
    private winBoxService: WinBoxService,
    private roomInfoService: RoomInfoService,
    private permissionsService: PermissionsService,
    private titleService: TitleService,
    private myDatetimePipe: MyDatetimePipe,
    private userClient: UserClient,
    private userPermissionClient: UserPermissionClient,
    private toastService: ToastService, private router: Router, private route: ActivatedRoute, private http: HttpClient, private roomClient: RoomClient, private bookingClient: BookingClient) {
    const firstPathChangeEvent = router.events.pipe(filter(i => i instanceof NavigationEnd));
    this.pathName = this.route.snapshot.params[`${Pathname.GlobalListName}`];
    this.titleService.setTitle(this.pathName);
    this.getList();
    this.frameworkComponents = {
      GetUserRawInfoButtonComponent: GetUserRawInfoButtonComponent,
    };
  }

  ngOnDestroy(): void {
    //this.router.events.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight - 200;
    this.screenWidth = window.innerWidth;

    this.styleExp = this.screenHeight.toString() + "px";
    console.log(this.screenHeight, this.screenWidth);
    console.log(this.styleExp);
  }

  myrowclick(arg): void {
  }

  toTimeOnly(params) {
    return format(params.value, 'HH:mm');
  }

  toDateTimeOnly(params) {
    return format(params.value, 'yyyy-MM-dd HH:mm');
  }

  private static toBookingStatusString(params): string {
    return BookingStatus[params.value];
  };

  getList(): void {

    this.pathName = this.route.snapshot.params[`${Pathname.GlobalListName}`];

    if (this.pathName == Pathname.PermissionGroup) {
      this.setPermissionSetList();
    } else if (this.pathName == Pathname.UserGroup) {
      this.setUserGroupSetList();
    } else if (this.pathName == Pathname.RoomGroup) {
      this.setRoomSetList();
    } else if (this.pathName == Pathname.UserRole) {
      this.setUserRoleSetList();
    } else if (this.pathName == Pathname.MyBookings) {
      this.setMyBookingList();
    } else if (this.pathName == Pathname.ClosedDayList) {
      this.setClosedList();
    } else {
      this.setRoomList();
    }

    this.gridOptions = {
      // Properties
      // Objects like myRowData and myColDefs would be created in your application
      defaultColDef: {
        // set filtering on for all columns
        filter: true,
        sortable: true,
        unSortIcon: true,
        resizable: true,
      },
      rowData: this.rowData,
      columnDefs: this.columnDefs,
      pagination: true,
      rowSelection: 'single',

      // EVENTS
      // Add event handlers
      onRowClicked: (event) => {
        if (this.pathName == Pathname.MyBookings) {
          this.setBookingDetailsForms(event);
        } else if (this.pathName == Pathname.ClosedDayList) {
          this.setBookingDetailsForms(event);
        } else if (this.pathName == Pathname.Rooms) {
          this.setRoomForms(event);
        } else if (this.pathName == Pathname.PermissionGroup) {
          this.setPermissionFormForms(event);
        } else if (this.pathName == Pathname.RoomGroup) {
          this.setRoomSetForm(event);
        } else if (this.pathName == Pathname.UserRole) {
          this.setUserRoleForms(event);
        } else if (this.pathName == Pathname.UserGroup) {
          this.setUserGroupForms(event);
        }
      },
      onColumnResized: event => console.log('A column was resized'),
      onGridReady: (event) => {
        this.gridApi = event.api;
      },

      ///CALLBACKS
      frameworkComponents: {
        GetUserRawInfoButtonComponent: GetUserRawInfoButtonComponent
      }
    }
  }

  setRoomList(): void {
    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: true,
      },
      {
        field: "id",
        headerName: 'ID',
        width: 80,
      },
      {field: "name"},
      {field: "shortName"},
      {field: "chineseName"},
      {field: "mappingKey"},
      {field: "start", valueFormatter: this.toTimeOnly,  width: 120},
      {field: "end", valueFormatter: this.toTimeOnly, width: 120},
    ];
    this.roomClient.getFullList().subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    );
  }

  ngOnInit(): void {
    this.globalListEventService.onUpdateList.subscribe(i => {
      this.getList();
    });
  }

  ngOnChanges(): void {
    //console.log("from ngOnChanges");
    //this.getList();
  }

  setBookingDetailsForms(event) {
    this.winBoxService.open(EditBookingsComponent, {data:event});
  }

  setPermissionSetList() {
    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: (params) => params.data.id > 1,
      },
      {field: 'id'},
      {field: 'name'},
      {field: 'permissions', headerName: 'Settings'}
    ]
    this.userPermissionClient.getPermissionSetList().subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    )
  }

  toJsonString(params) {
    return JSON.stringify(params.value);
  }

  toRoomIdsListString(params) {
    return JSON.stringify(params.value);
  }

  setRoomSetList() {
    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: (params) => params.data.id > 1,
      },
      {
        field: 'id',
        width: 100,
      },
      {field: 'name'},
      {field: 'allRooms'},
      /*
      {field: 'rooms'},
      {
        headerName: 'Room formatted',
        field: 'rooms',
        valueFormatter: this.toJsonString,
      },
      {
        headerName: 'Room Ids',
        field: 'rooms',
        valueFormatter: this.toRoomIdsListString,
      },
      {field: 'created'},
      {field: 'createdBy'},
      {field: 'lastModified'},
      {field: 'lastModifiedBy'},
      */
    ]
    this.roomClient.getAllRoomSet(new GetAllRoomSets()).subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    )
  }

  setMyBookingList() {
    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: true,
      },
      {
        width: 100, field: 'id', headerName: 'BID'
      },
      {
        field: 'room.name', headerName: 'Room Name'
      },
      {
        field: 'start',
        sort: 'desc',
        valueFormatter: this.toDateTimeOnly,
        filter: 'agDateColumnFilter',
      },
      {
        field: 'end',
        valueFormatter: this.toDateTimeOnly,
        filter: 'agDateColumnFilter',
      },
      {field: 'bookingStatus', valueFormatter: GenericListComponent.toBookingStatusString},
      {
        field: 'bookingDetails',
        valueGetter: (params) => {
          return params.data.bookingDetails.description;
        },
      },
      {
        field: 'roomId',
      },
    ]
    this.bookingClient.getMyRawBooking(0).subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    );
  }

  setClosedList() {
    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: true,
      },
      {
        width: 100, field: 'id', headerName: 'BID'
      },
      {
        field: 'room.name', headerName: 'Room Name'
      },
      {
        field: 'start',
        sort: 'desc',
        valueFormatter: this.toDateTimeOnly,
        filter: 'agDateColumnFilter',
      },
      {
        field: 'end',
        valueFormatter: this.toDateTimeOnly,
        filter: 'agDateColumnFilter',
      },
      {field: 'bookingStatus', valueFormatter: GenericListComponent.toBookingStatusString},
      {
        field: 'bookingDetails',
        valueGetter: (params) => {
          return params.data.bookingDetails.description;
        },
      },
      {
        field: 'roomId',
      },
    ]
    let cmd = new GetMarkedAsClosedCommand();
    cmd.from = new Date(2020,0,1);
    cmd.to = new Date(2022,0,1);
    this.bookingClient.getMarkedAsClosed(cmd).subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    );
  }

  getDataFormChildren(arg) {
    this.toastService.add(
      {
        severity: 'success',
        summary: `got something from child`,
        detail: `${JSON.stringify(arg)}`,
      }
    );
    this.getList();
  }

  setRoomForms(event) {
    if (event) {
      this.winBoxRef = this.winBoxService.open(RoomSettingsComponent, {data: {roomID: event.data.id, title: "Room: " + event.data.id}});
    } else {
      this.winBoxRef = this.winBoxService.open(RoomSettingsComponent, {data: {roomID: 0, title: "New Room"}});
    }
  }
  winBoxRef: WinBoxRef;

  newClick() {
    if (this.pathName == Pathname.Rooms) {
      this.setRoomForms(null);
    } else if (this.pathName == Pathname.PermissionGroup) {
      this.setPermissionFormForms(null);
    } else if (this.pathName == Pathname.RoomGroup) {
      this.setRoomSetForm(null);
    } else if (this.pathName == Pathname.UserRole) {
      this.setUserRoleForms(null);
    } else if (this.pathName == Pathname.UserGroup) {
      this.setUserGroupForms(null);
    } else if (this.pathName == Pathname.ClosedDayList) {
      this.setBookingDetailsForms(this.templateDataForClosedForm());
    }
  }

  templateDataForClosedForm() {
    return {'event': {'extendedProps': {'status': BookingStatus.ForBooking, 'markAsClosed': true}}};
  }

  rowClick() {
    this.setBookingDetailsForms(null);
  }

  setUserGroupSetList() {
    let t: UserGroup;
    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: (params) => params.data.id > 1,
      },
      {field: 'id'},
      {field: 'name', sort: 'asc'},
      /*
      {field: 'userRoles'},
      {
        headerName: 'Json User Roles',
        field: 'userRoles',
        valueFormatter: this.toJsonString
      },
      {field: 'created'},
      {field: 'createdBy'},
      {field: 'lastModified'},
      {field: 'lastModifiedBy'},
      */
    ]
    this.userClient.getAllUserGroups().subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    );
  }

  private setUserRoleSetList() {

    this.columnDefs = [
      {
        width: 50,
        headerName: '',
        field: '',
        checkboxSelection: (params) => params.data.id > 1,
      },
      {field: 'id'},
      {field: 'name', sort: 'asc'},
      /*
      {
        headerName: 'raw JsonRoomSet',
        field: 'roomSet',
        sortable: true,
        unSortIcon: true,
        resizable: true,
        valueFormatter: this.toJsonString
      },
      {
        headerName: 'raw JsonPermission',
        field: 'permission',
        sortable: true,
        unSortIcon: true,
        resizable: true,
        valueFormatter: this.toJsonString
      },
      */
      /*
      {field: 'roomSet'},
      {field: 'permission'},
      {field: 'roomSetId'},
      {field: 'permissionId'},
      {field: 'created'},
      {field: 'createdBy'},
      {field: 'lastModified'},
      {field: 'lastModifiedBy'},
      */
    ]
    this.userClient.getAllUserRole().subscribe(
      result => {
        this.rowData = result;
      },
      error => console.error(error)
    );
  }

  private setPermissionFormForms(event) {
    if (event) {
      this.winBoxRef = this.winBoxService.open(PermissionSetComponent, {
        data: {
          setID: event.data.id,
          title: "PermissionSet: " + event.data.id
        }
      });
    } else {
      this.winBoxRef = this.winBoxService.open(PermissionSetComponent, {data: {setID: 0, title: "New PermissionSet"}});
    }
  }

  private setRoomSetForm(event) {
    if (event) {
      this.winBoxRef = this.winBoxService.open(RoomSetSettingsComponent, {
        data: {
          roomSetID: event.data.id,
          title: "RoomSet: " + event.data.id
        }
      });
    } else {
      this.winBoxRef = this.winBoxService.open(RoomSetSettingsComponent, {data: {roomSetID: 0, title: "New Room"}});
    }
  }

  private setUserRoleForms(event) {
    if (event) {
      this.winBoxRef = this.winBoxService.open(UserRoleSetFormComponent, {
        data: {
          ID: event.data.id,
          title: "UserRole: " + event.data.id
        }
      });
    } else {
      this.winBoxRef = this.winBoxService.open(UserRoleSetFormComponent, {data: {ID: 0, title: "New UserRole"}});
    }
  }

  private setUserGroupForms(event) {
    if (event) {
      this.winBoxRef = this.winBoxService.open(UserGroupSettingsComponent, {
        data: {
          groupId: event.data.id,
          title: "UserGroup: " + event.data.id
        }
      });
    } else {
      this.winBoxRef = this.winBoxService.open(UserGroupSettingsComponent, {data: {groupId: 0, title: "New UserGroup"}});
    }
  }

  deleteClick() {
    let yesDelete : boolean;
    if (this.pathName == Pathname.PermissionGroup) {
      if(this.selectedNodes.length > 0) {
        yesDelete = confirm("Delete PermissionSet: " + this.selectedNodes[0]);
        if(yesDelete) {
          this.deletePermissionSet(this.selectedNodes[0]);
        }
      }
    } else if (this.pathName == Pathname.UserGroup) {
      if(this.selectedNodes.length > 0) {
        yesDelete = confirm("Delete UserGroupSet: " + this.selectedNodes[0]);
        if(yesDelete) {
          this.deleteUserGroup(this.selectedNodes[0]);
        }
      }
    } else if (this.pathName == Pathname.RoomGroup) {
      if(this.selectedNodes.length > 0) {
        yesDelete = confirm("Delete RoomSet: " + this.selectedNodes[0]);
        if(yesDelete) {
          this.deleteRoomSet(this.selectedNodes[0]);
        }
      }
    } else if (this.pathName == Pathname.UserRole) {
      if(this.selectedNodes.length > 0) {
        yesDelete = confirm("Delete UserRoleSet: " + this.selectedNodes[0]);
        if(yesDelete) {
          this.deleteUserRoleSet(this.selectedNodes[0]);
        }
      }
    } else if (this.pathName == Pathname.Rooms) {
      if(this.selectedNodes.length > 0) {
        yesDelete = confirm("Delete room: " + this.selectedNodes[0]);
        if(yesDelete) {
          this.deleteRoom(this.selectedNodes[0]);
        }
      }
    } else if (this.pathName == Pathname.MyBookings) {
    } else {
    }
  }

  deleteRoom(roomId: number){
    this.roomClient.deleteRoom(roomId).subscribe(res => {
      console.log(res);
      this.globalListEventService.updateList();
      this.winBoxRef.close();
    });
  }

  deletePermissionSet(setId: number) {
    var deletePermissionSetCommand = new DeletePermissionSetCommand()
    deletePermissionSetCommand.id = setId;
    this.userPermissionClient.deletePermissionSet(deletePermissionSetCommand).subscribe(res => {
      console.log(res);
      this.globalListEventService.updateList();
      this.winBoxRef.close();
    });
  }

  deleteUserRoleSet(setId: number) {
    var deleteUserRoleCommand = new DeleteUserRoleCommand()
    deleteUserRoleCommand.id = setId;
    this.userClient.deleteUserRole(deleteUserRoleCommand).subscribe(res => {
      console.log(res);
      this.globalListEventService.updateList();
      this.winBoxRef.close();
    });
  }

  deleteRoomSet(setId: number) {
    var deleteRoomSetCommand = new DeleteRoomSetCommand()
    deleteRoomSetCommand.id = setId;
    this.roomClient.deleteRoomSet(deleteRoomSetCommand).subscribe(res => {
      console.log(res);
      this.globalListEventService.updateList();
      this.winBoxRef.close();
    });
  }

  deleteUserGroup(groupId: number) {
    var deleteUserGroupCommand = new DeleteUserGroupCommand();
    deleteUserGroupCommand.id = groupId;
    this.userClient.deleteUserGroup(deleteUserGroupCommand).subscribe(res => {
      console.log(res);
      this.globalListEventService.updateList();
      this.winBoxRef.close();
    });
  }

  selectedNodes: number[];
  DeleteLabel: string = 'Delete!';

  onSelectionChanged($event: any) {
    //console.log('onSelectionChanged');
    let selectedNodes = this.gridApi.getSelectedNodes();
    let selectedNodesCnt = selectedNodes.length;
    this.selectedNodes = selectedNodes.map(i => i.data.id);
    console.log(this.selectedNodes);
    this.deleteVisible = selectedNodesCnt > 0 && this.selectedNodes.indexOf(1) === -1;
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { FormHelper } from "src/app/common/FormHelper";
import {
  CreateUserRoleCommand,
  DeleteUserRoleCommand,
  PermissionSetDto,
  RoomClient,
  RoomSetSimpleDto,
  UpdateUserRoleCommand,
  UserClient,
  UserPermissionClient,
  UserRole,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-Roles",
  templateUrl: "./Roles.component.html",
  styleUrls: ["./Roles.component.sass"],
})
export class RolesComponent implements OnInit {
  fh: FormHelper;
  selected = [];
  userRoleId = -1;
  formCaption = "";
  filteredData = [];
  IsFormValid = false;
  ColumnMode = ColumnMode;
  userRoleForm!: FormGroup;
  SelectionType = SelectionType;
  columns = [{ name: "name" }];
  dt_datas: Array<UserRole> = [];
  roleGroupModalRef?: BsModalRef;
  roomsList: Array<RoomSetSimpleDto> = [];
  permissionsList: Array<PermissionSetDto> = [];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private userClient: UserClient,
    private roomClient: RoomClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private sweetAlert: SweetAlertService,
    private userPermissionClient: UserPermissionClient
  ) {}

  ngOnInit() {
    this.GetUserRoles();
    this.CreateRoleForm();
    this.GetRoomSetSimple();
    this.GetPermissionSetName();
    this.fh = new FormHelper(this.userRoleForm);
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  filterDatatable(event) {
    const all_columns = this.columns;
    // get the value of the key pressed and make it lowercase
    const val = event.target.value.toLowerCase();
    // get the amount of columns in the table
    const colsAmt = this.columns.length;
    // get the key names of each column in the dataset
    const keys = Object.keys(this.filteredData[0]);
    // assign filtered matches to the active datatable

    this.dt_datas = this.filteredData.filter(function (item) {
      // iterate through each row's column data
      for (let i = 0; i < colsAmt; i++) {
        // check for a match
        if (
          item[all_columns[i].name].toString().toLowerCase().indexOf(val) !==
            -1 ||
          !val
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  CreateRoleForm() {
    this.userRoleForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      roomSetId: new FormControl(null, Validators.required),
      permissionSetId: new FormControl(null, Validators.required),
    });
  }

  GetUserRoles() {
    this.userClient.getAllUserRole().subscribe(
      (result) => {
        this.selected = [];
        this.dt_datas = result;
        this.filteredData = result;
      },
      (error) => console.error(error)
    );
  }

  GetRoomSetSimple() {
    this.roomClient.getRoomSetSimple().subscribe(
      (result) => {
        this.roomsList = result;
      },
      (error) => console.error(error)
    );
  }

  GetPermissionSetName() {
    this.userPermissionClient.getPermissionSetNameList().subscribe(
      (result) => {
        this.permissionsList = result;
      },
      (error) => console.error(error)
    );
  }

  AddNewUserRole(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.ResetModal();
    }

    this.roleGroupModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  SetModalData(data: any) {
    this.fh.setValue("name", data.name);
    this.fh.setValue("roomSetId", data.roomSetId);
    this.fh.setValue("permissionSetId", data.permissionSetId);
  }

  EditUserRole(itemData: any, template: TemplateRef<any>) {
    this.ResetModal();
    let itemDataId = itemData.id;
    this.userRoleId = Number(itemDataId);
    this.fh.setValue("id", Number(itemDataId));

    if (itemDataId > 0) {
      this.userClient.getRoleById(itemDataId).subscribe(
        (result: any) => {
          this.SetModalData(result);
          this.AddNewUserRole(template, false);
          this.formCaption = `Edit User Role : ${result.name}`;
        },
        (error) => console.error(error)
      );
    }
  }

  DeleteUserRole(UserRole: any) {
    this.sweetAlert
      .ConfirmDelete(`Are you sure to delete user role : ${UserRole.name}`)
      .subscribe((result) => {
        this.DeleteUserRoleById(UserRole);
      });
  }

  DeleteUserRoleById(UserRole: any) {
    var deleteUserRoleCommand = new DeleteUserRoleCommand();
    deleteUserRoleCommand.id = UserRole.id;
    this.userClient.deleteUserRole(deleteUserRoleCommand).subscribe((res) => {
      this.GetUserRoles();
      this.snackbar.showNotification(
        "success",
        "Permission group deleted successfully"
      );
    });
  }

  BulkDeleteUserRole() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected
      .filter((item) => Number(item.id) > 1)
      .map((data) => data.id);

    if (lstSelected.length > 0) {
      this.sweetAlert
        .ConfirmDelete(`Are you sure to delete selected room groups ?`)
        .subscribe((result) => {
          this.userClient.deleteUserRoles(lstSelected).subscribe((res) => {
            this.GetUserRoles();
            this.snackbar.showNotification(
              "success",
              "Selected User Role deleted successfully"
            );
          });
        });
    }
  }

  GetModalData(): any {
    var createUpdateRoomDto: any = {
      name: this.fh.getValue("name"),
      id: Number(this.fh.getValue("id")),
      roomSetId: Number(this.fh.getValue("roomSetId")),
      permissionSetId: Number(this.fh.getValue("permissionSetId")),
    };

    return createUpdateRoomDto;
  }

  ResetModal() {
    this.fh.resetForm();
    this.userRoleId = -1;
    this.formCaption = "New User Role";
  }

  SaveUserRole() {
    if (this.userRoleId <= 0) {
      let cmd: CreateUserRoleCommand = this.GetModalData();
      this.userClient.createUserRole(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.snackbar.showNotification(
            "success",
            "User role created successfully"
          );
          this.GetUserRoles();
          this.roleGroupModalRef.hide();
        },
        (error) => {
          let errors = JSON.parse(error.response);
          this.snackbar.showNotification(
            "error",
            `${JSON.stringify(errors.errors)}`
          );
        }
      );
    } else if (this.userRoleId > 0) {
      let cmd: UpdateUserRoleCommand = this.GetModalData();
      this.userClient.updateUserRole(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.snackbar.showNotification(
            "success",
            "User role updated successfully"
          );
          this.GetUserRoles();
          this.roleGroupModalRef.hide();
        },
        (error) => {
          let errors = JSON.parse(error.response);
          this.snackbar.showNotification(
            "error",
            `${JSON.stringify(errors.errors)}`
          );
        }
      );
    }
  }
}

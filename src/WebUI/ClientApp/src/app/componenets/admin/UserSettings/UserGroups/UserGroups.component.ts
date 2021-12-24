import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import {
  CreateUserGroupCommand,
  DeleteUserGroupCommand,
  UpdateUserGroupCommand,
  UserClient,
  UserGroup,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-UserGroups",
  templateUrl: "./UserGroups.component.html",
  styleUrls: ["./UserGroups.component.sass"],
})
export class UserGroupsComponent implements OnInit {
  id?: number;
  selected = [];
  formCaption = "";
  filteredData = [];
  ColumnMode = ColumnMode;
  name?: string | undefined;
  userRoles: Array<any> = [];
  columns = [{ name: "name" }];
  simpleUsers: Array<any> = [];
  userIds?: string[] | undefined;
  SelectionType = SelectionType;
  userGRoupModalRef?: BsModalRef;
  dt_datas: Array<UserGroup> = [];
  userRoleIds?: number[] | undefined;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private userClient: UserClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private swalService: SweetAlertService
  ) {}

  ngOnInit() {
    this.getAllUsers();
    this.getAllUserRoles();
    this.GetUserGroupsList(false);
  }

  GetUserGroupsList(isReRender: boolean = true) {
    this.userClient.getAllUserGroups().subscribe(
      (result) => {
        this.selected = [];
        this.dt_datas = result;
        this.filteredData = result;
      },
      (error) => console.error(error)
    );
  }

  getAllUsers() {
    this.userClient.getUserAll().subscribe(
      (result) => {
        result.forEach((element: any) => {
          this.simpleUsers.push({
            isSelected: false,
            userId: element.userId,
            username: element.username,
          });
        });
      },
      (error) => console.error(error)
    );
  }

  getAllUserRoles() {
    this.userClient.getAllUserRole().subscribe(
      (result) => {
        result.forEach((element: any) => {
          this.userRoles.push({
            id: element.id,
            isSelected: false,
            name: element.name,
          });
        });
      },
      (error) => console.error(error)
    );
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  displayCheck(row) {
    return Number(row.id) > 1;
  }

  AddNewUserGroup(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.id = 0;
      this.name = null;
      this.ResetModal();
      this.formCaption = "New User Group";
      this.userRoles.map((data) => (data.isSelected = false));
      this.simpleUsers.map((data) => (data.isSelected = false));
    }

    this.userGRoupModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  SetModalData(data: any) {
    this.id = data.id;
    this.name = data.name;

    if (data.userIds && Array.isArray(data.userIds)) {
      data.userIds.forEach((element: string) => {
        let indexOf = this.simpleUsers.findIndex(
          (data) => data.userId == element
        );
        if (indexOf >= 0) {
          this.simpleUsers[indexOf].isSelected = true;
        }
      });
    }

    if (data.userRoleIds && Array.isArray(data.userRoleIds)) {
      data.userRoleIds.forEach((element: number) => {
        let indexOf = this.userRoles.findIndex((data) => data.id == element);
        if (indexOf >= 0) {
          this.userRoles[indexOf].isSelected = true;
        }
      });
    }

    this.userIds = data.userIds;
    this.userRoleIds = data.userRoleIds;
  }

  EditUserGroup(itemData: any, template: TemplateRef<any>) {
    let itemDataId = itemData.id;
    this.id = Number(itemDataId);

    if (itemDataId > 0) {
      this.userClient.getSimpleUserGroupById(itemDataId).subscribe(
        (data: any) => {
          this.SetModalData(data);
          this.AddNewUserGroup(template, false);
          this.formCaption = `Edit User Group : ${data.name}`;
        },
        (error) => console.error(error)
      );
    }
  }

  DeleteUserGroup(UserGroup: any) {
    this.swalService
      .ConfirmDelete(`Are you sure to delete user group : ${UserGroup.name}`)
      .subscribe((result) => {
        if (result) {
          this.DeleteUserGroupById(UserGroup);
        }
      });
  }

  DeleteUserGroupById(UserGroup: any) {
    var deleteUserGroupCommand = new DeleteUserGroupCommand();
    deleteUserGroupCommand.id = UserGroup.id;
    this.userClient.deleteUserGroup(deleteUserGroupCommand).subscribe((res) => {
      this.GetUserGroupsList();
      this.snackbar.showNotification(
        "success",
        "User group deleted successfully"
      );
    });
  }

  BulkDeleteUserGroups() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected
      .filter((item) => Number(item.id) > 1)
      .map((data) => data.id);

    if (lstSelected.length > 0) {
      this.swalService
        .ConfirmDelete(`Are you sure to delete selected user groups ?`)
        .subscribe((result) => {
          if (result) {
            this.userClient.deleteUserGroups(lstSelected).subscribe((res) => {
              this.GetUserGroupsList();
              this.snackbar.showNotification(
                "success",
                "Selected User groups deleted successfully"
              );
            });
          }
        });
    }
  }

  GetModalData(): any {
    this.userIds = [];
    this.userRoleIds = [];

    this.simpleUsers.forEach((item) => {
      if (item.isSelected) {
        this.userIds.push(item.userId);
      }
    });

    this.userRoles.forEach((item) => {
      if (item.isSelected) {
        this.userRoleIds.push(item.id);
      }
    });

    let cmd: any = {
      id: this.id,
      name: this.name,
      userIds: this.userIds,
      userRoleIds: this.userRoleIds,
    };

    return cmd;
  }

  ResetModal() {
    this.id = 0;
    this.name = null;
    this.userIds = [];
    this.userRoleIds = [];
  }

  SaveUserGroups() {
    if (this.id <= 0) {
      let cmd: CreateUserGroupCommand = this.GetModalData();
      this.userClient.createUserGroup(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.snackbar.showNotification(
            "success",
            "User role created successfully"
          );
          this.GetUserGroupsList();
          this.userGRoupModalRef.hide();
        },
        (error) => {
          let errors = JSON.parse(error.response);
          this.snackbar.showNotification(
            "error",
            `${JSON.stringify(errors.errors)}`
          );
        }
      );
    } else if (this.id > 0) {
      let cmd: UpdateUserGroupCommand = this.GetModalData();

      this.userClient.updateUserGroup(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.snackbar.showNotification(
            "success",
            "User role updated successfully"
          );
          this.GetUserGroupsList();
          this.userGRoupModalRef.hide();
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
}

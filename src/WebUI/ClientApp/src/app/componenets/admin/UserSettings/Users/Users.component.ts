import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ColumnMode, DatatableComponent } from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ItsNumber } from "src/app/common/CommonFunctions";
import {
  SimpleUser,
  UpdateSimpleUserGroupCommand,
  UserClient,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";

@Component({
  selector: "app-Users",
  templateUrl: "./Users.component.html",
  styleUrls: ["./Users.component.sass"],
})
export class UsersComponent implements OnInit {
  formCaption = "";
  filteredData = [];
  IsFormValid = false;
  ColumnMode = ColumnMode;
  groupList: Array<any> = [];
  userId?: string | undefined;
  userGroupModalRef?: BsModalRef;
  columns = [{ name: "username" }];
  dt_datas: Array<SimpleUser> = [];
  selGroupIds?: string[] | undefined;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private userClient: UserClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.GetUsersList();
    this.GetUserGroups();
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

  GetUsersList() {
    this.userClient.getUserAll().subscribe(
      (result) => {
        this.dt_datas = result;
        this.filteredData = result;
      },
      (error) => console.error(error)
    );
  }

  GetUserGroups() {
    this.userClient.getUserGroupList().subscribe(
      (result) => {
        result.forEach((element: any) => {
          this.groupList.push({
            id: element.id,
            isSelected: false,
            name: element.name,
          });
        });
      },
      (error) => console.error(error)
    );
  }

  UpdateUserGroupModal(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.ResetModal();
    }

    this.userGroupModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  SetModalData(data: any) {
    this.selGroupIds = [];

    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        let indexOf = this.groupList.findIndex((data) => data.id == item.id);
        if (indexOf > -1) {
          this.selGroupIds.push(item.id);
          this.groupList[indexOf].isSelected = true;
        }
      });
    }

    this.IsFormValid = this.selGroupIds.length > 0;
  }

  UpdateUserGroup(userData: any, template: TemplateRef<any>) {
    if (userData) {
      this.userId = userData.userId;
      this.userClient.getSimpleUserGroup(this.userId).subscribe(
        (result: any) => {
          this.SetModalData(result);
          this.UpdateUserGroupModal(template, false);
          this.formCaption = `Update User Group : ${userData.username}`;
        },
        (error) => console.error(error)
      );
    }
  }

  AddRemoveUserGroup(isSelected: boolean, groupId: number) {
    if (this.groupList && Array.isArray(this.groupList)) {
      let userGroup = this.groupList.find(
        (userGroup) => userGroup.id === groupId
      );

      if (userGroup) {
        if (isSelected) {
          if (userGroup && ItsNumber(userGroup.id) > 0) {
            this.selGroupIds.push(userGroup.id);
          }
        } else {
          if (userGroup && ItsNumber(userGroup.id) > 0) {
            this.selGroupIds.splice(
              this.selGroupIds.findIndex((id) => ItsNumber(id) === groupId),
              1
            );
          }
        }
      }
      this.IsFormValid = this.selGroupIds.length > 0;
    }
  }

  GetModalData(): any {
    let cmd: any = {
      userId: this.userId,
      groupIds: this.selGroupIds,
    };

    return cmd;
  }

  ResetModal() {
    this.userId = null;
    this.selGroupIds = [];

    if (this.groupList && Array.isArray(this.groupList)) {
      this.groupList.forEach((group) => {
        group.isSelected = false;
      });
    }
  }

  SaveUserGroups() {
    if (this.userId) {
      let cmd: UpdateSimpleUserGroupCommand = this.GetModalData();
      this.userClient.updateSimpleUserGroup(cmd).subscribe(
        (result) => {
          this.snackbar.showNotification(
            "success",
            "User group updated successfully"
          );
          this.ResetModal();
          this.GetUsersList();
          this.userGroupModalRef.hide();
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

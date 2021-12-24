import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { ItsNumber } from "src/app/common/CommonFunctions";
import { ToastService } from "src/app/service/toast.service";
import {
  SimpleUser,
  UpdateSimpleUserGroupCommand,
  UserClient,
} from "src/app/web-api-client";

@Component({
  selector: "app-UserSetting",
  templateUrl: "./UserSetting.component.html",
  styleUrls: ["./UserSetting.component.css"],
})
export class UserSettingComponent implements OnInit {
  formCaption = "";
  IsFormValid = false;
  groupList: Array<any> = [];
  userGroupModalRef?: BsModalRef;
  dt_datas: Array<SimpleUser> = [];

  userId?: string | undefined;
  selGroupIds?: string[] | undefined;

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
    private userClient: UserClient,
    private toastService: ToastService,
    private modalService: BsModalService
  ) {
    this.dtOptions = CommonConfig.getDataTableSettings();
    this.dtOptions.columnDefs = [{ orderable: false, targets: [-1] }];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.GetUserGroups();
    this.GetUsersList(false);
  }

  GetUsersList(isReRender: boolean = true) {
    this.userClient.getUserAll().subscribe(
      (result) => {
        this.dt_datas = result;
        if (isReRender) {
          this.ReRenderDatatable();
        } else {
          this.dtTrigger.next();
        }
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

  ReRenderDatatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
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
          this.toastService.add({
            severity: "success",
            detail: `User group updated successfully`,
            summary: `User group updated successfully`,
          });
          this.ResetModal();
          this.GetUsersList();
          this.userGroupModalRef.hide();
        },
        (error) => {
          let errors = JSON.parse(error.response);
          this.toastService.add({
            severity: "error",
            summary: `${errors.title}`,
            detail: `${JSON.stringify(errors.errors)}`,
          });
        }
      );
    }
  }
}

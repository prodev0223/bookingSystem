import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { ToastService } from "src/app/service/toast.service";
import {
  CreateUserGroupCommand,
  DeleteUserGroupCommand,
  UpdateUserGroupCommand,
  UserClient,
  UserGroup,
} from "src/app/web-api-client";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: "app-UsersGroup",
  templateUrl: "./UsersGroup.component.html",
  styleUrls: ["./UsersGroup.component.css"],
})
export class UsersGroupComponent implements OnInit, OnDestroy {
  formCaption = "";
  IsCheckAll: false;
  userRoles: Array<any> = [];
  simpleUsers: Array<any> = [];
  userGRoupModalRef?: BsModalRef;
  dt_datas: Array<UserGroup> = [];

  id?: number;
  name?: string | undefined;
  userIds?: string[] | undefined;
  userRoleIds?: number[] | undefined;

  // Datatables Properties
  dtOptions: DataTables.Settings = {
    columnDefs: [{ orderable: false, targets: 0 }],
  };
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
    private userClient: UserClient,
    private toastService: ToastService,
    private modalService: BsModalService
  ) {
    this.dtOptions = CommonConfig.getDataTableSettings();
    this.dtOptions.columnDefs = [{ orderable: false, targets: [0, -1] }];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.getAllUsers();
    this.getAllUserRoles();
    this.GetUserGroupsList(false);
  }

  GetUserGroupsList(isReRender: boolean = true) {
    this.userClient.getAllUserGroups().subscribe(
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

  ReRenderDatatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  checkAll() {
    this.dt_datas.forEach((element) => {
      if (element.id != 1) {
        element.isChecked = this.IsCheckAll;
      }
    });
  }

  AddNewUserGroup(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.id = 0;
      this.formCaption = "New User Group";
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
    Swal.fire({
      title: "Not able to recover",
      text: `Are you sure to delete user group : ${UserGroup.name}`,
      icon: "warning",
      confirmButton: "btn btn-danger",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result: { value: any }) => {
      if (result.value) {
        this.DeleteUserGroupById(UserGroup);
      }
    });
  }

  DeleteUserGroupById(UserGroup: any) {
    var deleteUserGroupCommand = new DeleteUserGroupCommand();
    deleteUserGroupCommand.id = UserGroup.id;
    this.userClient.deleteUserGroup(deleteUserGroupCommand).subscribe((res) => {
      this.GetUserGroupsList();
      this.toastService.add({
        severity: "success",
        summary: `Delete User Group`,
        detail: `User group deleted successfully`,
      });
    });
  }

  BulkDeleteUserGroups() {
    var lstSelected: Array<number> = [];
    this.dt_datas.forEach((item: any) => {
      if (item?.isChecked == true) {
        lstSelected.push(Number(item.id));
      }
    });

    if (lstSelected.length > 0) {
      Swal.fire({
        title: "Not able to recover",
        text: `Are you sure to delete selected user groups ?`,
        icon: "warning",
        confirmButton: "btn btn-danger",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "No, keep them",
      }).then((result: { value: any }) => {
        if (result.value) {
          this.userClient.deleteUserGroups(lstSelected).subscribe((res) => {
            this.GetUserGroupsList();
            this.toastService.add({
              severity: "success",
              summary: `Delete User Groups`,
              detail: `Selected User groups deleted successfully`,
            });
          });
        }
      });
    }

    this.IsCheckAll = false;
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
          this.toastService.add({
            severity: "success",
            detail: `User role created successfully.`,
            summary: `User role created successfully.`,
          });
          this.GetUserGroupsList();
          this.userGRoupModalRef.hide();
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
    } else if (this.id > 0) {
      let cmd: UpdateUserGroupCommand = this.GetModalData();

      this.userClient.updateUserGroup(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.toastService.add({
            severity: "success",
            detail: `User role updated successfully`,
            summary: `User role updated successfully`,
          });
          this.GetUserGroupsList();
          this.userGRoupModalRef.hide();
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

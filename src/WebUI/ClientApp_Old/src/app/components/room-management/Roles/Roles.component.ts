import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { FormHelper } from "src/app/common/FormHelper";
import { ToastService } from "src/app/service/toast.service";
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
} from "src/app/web-api-client";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: "app-Roles",
  templateUrl: "./Roles.component.html",
  styleUrls: ["./Roles.component.css"],
})
export class RolesComponent implements OnInit {
  fh: FormHelper;
  userRoleId = -1;
  formCaption = "";
  IsCheckAll: false;
  IsFormValid = false;
  userRoleForm!: FormGroup;
  dt_datas: Array<UserRole> = [];
  roleGroupModalRef?: BsModalRef;
  roomsList: Array<RoomSetSimpleDto> = [];
  permissionsList: Array<PermissionSetDto> = [];

  // Datatables Properties
  dtOptions: DataTables.Settings = {
    columnDefs: [{ orderable: false, targets: 0 }],
  };
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
    private userClient: UserClient,
    private roomClient: RoomClient,
    private toastService: ToastService,
    private modalService: BsModalService,
    private userPermissionClient: UserPermissionClient
  ) {
    this.dtOptions = CommonConfig.getDataTableSettings();
    this.dtOptions.columnDefs = [{ orderable: false, targets: [0, -1] }];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.CreateRoleForm();
    this.GetRoomSetSimple();
    this.GetUserRoles(false);
    this.GetPermissionSetName();
    this.fh = new FormHelper(this.userRoleForm);
  }

  CreateRoleForm() {
    this.userRoleForm = new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null, Validators.required),
      roomSetId: new FormControl(null, Validators.required),
      permissionSetId: new FormControl(null, Validators.required),
    });
  }

  GetUserRoles(isReRender: boolean = true) {
    this.userClient.getAllUserRole().subscribe(
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

  ReRenderDatatable() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  checkAll() {
    this.dt_datas.forEach((item) => {
      if (item.id != 1) {
        item.isChecked = this.IsCheckAll;
      }
    });
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
    Swal.fire({
      title: "Not able to recover",
      text: `Are you sure to delete user role : ${UserRole.name}`,
      icon: "warning",
      confirmButton: "btn btn-danger",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result: { value: any }) => {
      if (result.value) {
        this.DeleteUserRoleById(UserRole);
      }
    });
  }

  DeleteUserRoleById(UserRole: any) {
    var deleteUserRoleCommand = new DeleteUserRoleCommand();
    deleteUserRoleCommand.id = UserRole.id;
    this.userClient.deleteUserRole(deleteUserRoleCommand).subscribe((res) => {
      this.GetUserRoles();
      this.toastService.add({
        severity: "success",
        summary: `Delete User Role`,
        detail: `Permission group deleted successfully`,
      });
    });
  }

  BulkDeleteUserRole() {
    var lstSelected: Array<number> = [];
    this.dt_datas.forEach((item: any) => {
      if (item?.isChecked == true) {
        lstSelected.push(Number(item.id));
      }
    });

    if (lstSelected.length > 0) {
      Swal.fire({
        title: "Not able to recover",
        text: `Are you sure to delete selected room groups ?`,
        icon: "warning",
        confirmButton: "btn btn-danger",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "No, keep them",
      }).then((result: { value: any }) => {
        if (result.value) {
          this.userClient.deleteUserRoles(lstSelected).subscribe((res) => {
            this.GetUserRoles();
            this.toastService.add({
              severity: "success",
              summary: `Delete User Role`,
              detail: `Selected User Role deleted successfully`,
            });
          });
        }
      });
    }

    this.IsCheckAll = false;
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
          this.toastService.add({
            severity: "success",
            detail: `User role created successfully.`,
            summary: `User role created successfully.`,
          });
          this.GetUserRoles();
          this.roleGroupModalRef.hide();
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
    } else if (this.userRoleId > 0) {
      let cmd: UpdateUserRoleCommand = this.GetModalData();
      this.userClient.updateUserRole(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.toastService.add({
            severity: "success",
            detail: `User role updated successfully.`,
            summary: `User role updated successfully.`,
          });
          this.GetUserRoles();
          this.roleGroupModalRef.hide();
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

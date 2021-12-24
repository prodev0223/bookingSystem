import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { ItsNumber } from "src/app/common/CommonFunctions";
import { ToastService } from "src/app/service/toast.service";
import {
  CreatePermissionSetCommand,
  DeletePermissionSetCommand,
  UpdatePermissionSetCommand,
  UserPermissionClient,
} from "src/app/web-api-client";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: "app-PermissionGroup",
  templateUrl: "./PermissionGroup.component.html",
  styleUrls: ["./PermissionGroup.component.css"],
})
export class PermissionGroupComponent implements OnInit {
  formCaption = "";
  IsCheckAll: false;
  IsFormValid = false;
  allPermissionId = 1;
  allPermission?: boolean;
  dt_datas: Array<any> = [];
  permissionList: Array<any> = [];
  permissionGroupModalRef?: BsModalRef;

  id?: number;
  name?: string | undefined;
  selPermissionIds?: number[] | undefined;

  // Datatables Properties
  dtOptions: DataTables.Settings = {
    columnDefs: [{ orderable: false, targets: 0 }],
  };
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
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
    this.getPermissions();
    this.GetPermissionGroupsList(false);
  }

  GetPermissionGroupsList(isReRender: boolean = true) {
    this.userPermissionClient.getPermissionSetList().subscribe(
      (result) => {
        this.dt_datas = [];
        if (result && Array.isArray(result)) {
          result.forEach((item: any) => {
            let permissionNames = this.GetPermissionDetails(item.permissions);
            this.dt_datas.push({
              id: item.id,
              name: item.name,
              isChecked: item.isChecked,
              permissionNames: permissionNames,
            });
          });
        }
        if (isReRender) {
          this.ReRenderDatatable();
        } else {
          this.dtTrigger.next();
        }
      },
      (error) => console.error(error)
    );
  }

  GetPermissionDetails(permissions: Array<number>): string {
    let result: string = "";

    if (permissions && Array.isArray(permissions)) {
      permissions.forEach((permissionId: any) => {
        result += `${
          this.permissionList.find((data) => data.id == permissionId).name
        }, `;
      });
    }

    return result;
  }

  getPermissions() {
    this.permissionList.push({
      id: 1,
      isSelected: false,
      name: "All Permission",
    });
    this.permissionList.push({
      id: 2,
      isSelected: false,
      name: "Booking View Only",
    });
    this.permissionList.push({
      id: 3,
      isSelected: false,
      name: "Booking Make For Myself",
    });
    this.permissionList.push({
      id: 4,
      isSelected: false,
      name: "Booking Make Any Time",
    });
    this.permissionList.push({
      id: 5,
      isSelected: false,
      name: "Booking Make Fixed Time",
    });
    this.permissionList.push({
      id: 6,
      isSelected: false,
      name: "Booking Make As Other User Group",
    });
    this.permissionList.push({
      id: 7,
      isSelected: false,
      name: "Booking Modify Cancel",
    });
    this.permissionList.push({
      id: 8,
      isSelected: false,
      name: "Booking Make As Other User",
    });
    this.permissionList.push({
      id: 9,
      isSelected: false,
      name: "Booking Approval Pending",
    });
    this.permissionList.push({
      id: 10,
      isSelected: false,
      name: "Booking Modify Cancel View Regional",
    });
    this.permissionList.push({
      id: 11,
      isSelected: false,
      name: "Booking Modify Cancel View All",
    });
    this.permissionList.push({
      id: 12,
      isSelected: false,
      name: "Booking View Equipment",
    });
    this.permissionList.push({
      id: 13,
      isSelected: false,
      name: "Booking View Any Booking",
    });
    this.permissionList.push({
      id: 14,
      isSelected: false,
      name: "Booking View My Booking",
    });
    this.permissionList.push({
      id: 100,
      isSelected: false,
      name: "Booking Extra Item",
    });
    this.permissionList.push({
      id: 110,
      isSelected: false,
      name: "Facility Management",
    });
    this.permissionList.push({
      id: 130,
      isSelected: false,
      name: "Account Management",
    });
    this.permissionList.push({
      id: 190,
      isSelected: false,
      name: "Smtp Setting",
    });
    this.permissionList.push({
      id: 1000,
      isSelected: false,
      name: "Reports All Unit",
    });
    this.permissionList.push({
      id: 2000,
      isSelected: false,
      name: "Reports Own Unit",
    });
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

  AddNewPermissionGroup(
    template: TemplateRef<any>,
    resetModal: boolean = true
  ) {
    if (resetModal) {
      this.ResetModal();
    }

    this.permissionGroupModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  SetModalData(data: any) {
    this.id = data.id;
    this.name = data.name;

    if (data.permissions && Array.isArray(data.permissions)) {
      data.permissions.forEach((itemId: number) => {
        let indexOf = this.permissionList.findIndex(
          (data) => data.id == itemId
        );
        if (indexOf >= 0 || data.allPermissions) {
          this.selPermissionIds.push(itemId);
          this.permissionList[indexOf].isSelected = true;
        }
      });
    }

    this.IsFormValid = this.selPermissionIds.length > 0;
  }

  EditPermissionGroup(itemData: any, template: TemplateRef<any>) {
    let itemDataId = itemData.id;
    this.id = Number(itemDataId);

    if (itemDataId > 0) {
      this.userPermissionClient.getOnePermissionSetQuery(itemDataId).subscribe(
        (result: any) => {
          this.ResetModal();
          this.SetModalData(result);
          this.AddNewPermissionGroup(template, false);
          this.formCaption = `Edit Permission Group : ${result.name}`;
        },
        (error) => console.error(error)
      );
    }
  }

  DeletePermissionGroup(PermissionGroup: any) {
    Swal.fire({
      title: "Not able to recover",
      text: `Are you sure to delete room group : ${PermissionGroup.name}`,
      icon: "warning",
      confirmButton: "btn btn-danger",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result: { value: any }) => {
      if (result.value) {
        this.DeletePermissionGroupById(PermissionGroup);
      }
    });
  }

  DeletePermissionGroupById(PermissionGroup: any) {
    var deletePermissionSetCommand = new DeletePermissionSetCommand();
    deletePermissionSetCommand.id = PermissionGroup.id;
    this.userPermissionClient
      .deletePermissionSet(deletePermissionSetCommand)
      .subscribe((res) => {
        this.GetPermissionGroupsList();
        this.toastService.add({
          severity: "success",
          summary: `Delete Permission Group`,
          detail: `Permission group deleted successfully`,
        });
      });
  }

  BulkDeletePermissionGroups() {
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
          this.userPermissionClient
            .deletePermissionSets(lstSelected)
            .subscribe((res) => {
              this.GetPermissionGroupsList();
              this.toastService.add({
                severity: "success",
                summary: `Delete Permission Groups`,
                detail: `Selected Permission groups deleted successfully`,
              });
            });
        }
      });
    }

    this.IsCheckAll = false;
  }

  AddRemoveAllPermissions(checkedAll: boolean) {
    if (this.permissionList && Array.isArray(this.permissionList)) {
      if (checkedAll) {
        this.permissionList.forEach((room) => {
          this.selPermissionIds.push(room.id);
        });
      } else {
        this.selPermissionIds = [];
        if (this.permissionList && Array.isArray(this.permissionList)) {
          this.permissionList.forEach((room) => {
            room.isSelected = false;
          });
        }
      }
    }

    this.IsFormValid = this.selPermissionIds.length > 0;
  }

  AddRemovePermissions(isSelected: boolean, roomId: number) {
    if (this.permissionList && Array.isArray(this.permissionList)) {
      let room = this.permissionList.find((room) => room.id === roomId);

      if (room) {
        if (isSelected) {
          if (room && ItsNumber(room.id) > 0) {
            this.selPermissionIds.push(room.id);
          }
        } else {
          if (room && ItsNumber(room.id) > 0) {
            this.selPermissionIds.splice(
              this.selPermissionIds.findIndex((id) => ItsNumber(id) === roomId),
              1
            );
          }
        }
      }
      this.IsFormValid = this.selPermissionIds.length > 0;
    }
  }

  GetModalData(): any {
    let cmd: any = {
      id: this.id,
      name: this.name,
      permissions: this.selPermissionIds,
      allPermission:
        this.selPermissionIds.findIndex(
          (data) => ItsNumber(data) == this.allPermissionId
        ) >= 0,
    };

    return cmd;
  }

  ResetModal() {
    this.id = 0;
    this.name = null;
    this.selPermissionIds = [];
    this.formCaption = "New Permission Group";

    if (this.permissionList && Array.isArray(this.permissionList)) {
      this.permissionList.forEach((room) => {
        room.isSelected = false;
      });
    }
  }

  SavePermissionGroups() {
    if (this.id <= 0) {
      let cmd: CreatePermissionSetCommand = this.GetModalData();
      this.userPermissionClient.createPermissionSet(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.toastService.add({
            severity: "success",
            detail: `Permission group created successfully.`,
            summary: `Permission group created successfully.`,
          });
          this.GetPermissionGroupsList();
          this.permissionGroupModalRef.hide();
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
      let cmd: UpdatePermissionSetCommand = this.GetModalData();
      this.userPermissionClient.updatePermissionSet(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.toastService.add({
            severity: "success",
            detail: `Permission group updated successfully`,
            summary: `Permission group updated successfully`,
          });
          this.GetPermissionGroupsList();
          this.permissionGroupModalRef.hide();
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

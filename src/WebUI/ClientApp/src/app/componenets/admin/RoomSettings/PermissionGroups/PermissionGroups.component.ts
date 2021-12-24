import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ItsNumber } from "src/app/common/CommonFunctions";
import {
  CreatePermissionSetCommand,
  DeletePermissionSetCommand,
  UpdatePermissionSetCommand,
  UserPermissionClient,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-PermissionGroups",
  templateUrl: "./PermissionGroups.component.html",
  styleUrls: ["./PermissionGroups.component.sass"],
})
export class PermissionGroupsComponent implements OnInit {
  id?: number;
  selected = [];
  filteredData = [];
  formCaption = "";
  IsFormValid = false;
  allPermissionId = 1;
  ColumnMode = ColumnMode;
  allPermission?: boolean;
  name?: string | undefined;
  dt_datas: Array<any> = [];
  SelectionType = SelectionType;
  permissionList: Array<any> = [];
  permissionGroupModalRef?: BsModalRef;
  selPermissionIds?: number[] | undefined;
  columns = [{ name: "name" }, { name: "permissionNames" }];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private sweetAlert: SweetAlertService,
    private userPermissionClient: UserPermissionClient
  ) {}

  ngOnInit() {
    this.getPermissions();
    this.GetPermissionGroupsList();
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

  GetPermissionGroupsList() {
    this.userPermissionClient.getPermissionSetList().subscribe(
      (result) => {
        this.dt_datas = [];
        this.selected = [];
        if (result && Array.isArray(result)) {
          result.forEach((item: any) => {
            let itemData = {
              id: item.id,
              name: item.name,
              isChecked: item.isChecked,
              permissionNames: this.GetPermissionDetails(item.permissions),
            };
            this.dt_datas.push(itemData);
            this.filteredData.push(itemData);
          });
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
    this.sweetAlert
      .ConfirmDelete(
        `Are you sure to delete room group : ${PermissionGroup.name}`
      )
      .subscribe((result) => {
        if (result) {
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
        this.snackbar.showNotification(
          "success",
          "Permission group deleted successfully"
        );
      });
  }

  BulkDeletePermissionGroups() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected.map((item) => item.id);

    if (lstSelected.length > 0) {
      this.sweetAlert
        .ConfirmDelete(`Are you sure to delete selected room groups ?`)
        .subscribe((result) => {
          if (result) {
            this.userPermissionClient
              .deletePermissionSets(lstSelected)
              .subscribe((res) => {
                this.GetPermissionGroupsList();
                this.snackbar.showNotification(
                  "success",
                  "Selected Permission groups deleted successfully"
                );
              });
          }
        });
    }
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
    this.IsFormValid = false;
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
          this.snackbar.showNotification(
            "success",
            "Permission group created successfully"
          );
          this.GetPermissionGroupsList();
          this.permissionGroupModalRef.hide();
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
      let cmd: UpdatePermissionSetCommand = this.GetModalData();
      this.userPermissionClient.updatePermissionSet(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.snackbar.showNotification(
            "success",
            "Permission group updated successfully"
          );
          this.GetPermissionGroupsList();
          this.permissionGroupModalRef.hide();
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

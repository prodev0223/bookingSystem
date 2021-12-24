import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { ItsNumber } from "src/app/common/CommonFunctions";
import { SweetAlertService } from "src/app/common/SweetAlert.service";
import { ToastService } from "src/app/service/toast.service";
import {
  CreateRoomSetCommand,
  DeleteRoomSetCommand,
  GetAllRoomSets,
  RoomClient,
  RoomSet,
  UpdateRoomSetCommand,
} from "src/app/web-api-client";

@Component({
  selector: "app-RoomGroup",
  templateUrl: "./RoomGroup.component.html",
  styleUrls: ["./RoomGroup.component.css"],
})
export class RoomGroupComponent implements OnInit {
  formCaption = "";
  IsCheckAll: false;
  IsFormValid = false;
  roomsList: Array<any> = [];
  dt_datas: Array<RoomSet> = [];
  roomGroupModalRef?: BsModalRef;

  id?: number;
  allRoom?: boolean;
  name?: string | undefined;
  selRoomIds?: string[] | undefined;

  // Datatables Properties
  dtOptions: DataTables.Settings = {
    columnDefs: [{ orderable: false, targets: 0 }],
  };
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
    private roomClient: RoomClient,
    private toastService: ToastService,
    private modalService: BsModalService,
    private swalAlert: SweetAlertService
  ) {
    this.dtOptions = CommonConfig.getDataTableSettings();
    this.dtOptions.columnDefs = [{ orderable: false, targets: [0, -1] }];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.getAllRooms();
    this.GetRoomGroupsList(false);
  }

  GetRoomGroupsList(isReRender: boolean = true) {
    this.roomClient.getAllRoomSet(new GetAllRoomSets()).subscribe(
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

  getAllRooms() {
    this.roomClient.getFullList().subscribe(
      (result) => {
        result.forEach((element: any) => {
          this.roomsList.push({
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

  AddNewRoomGroup(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.ResetModal();
    }

    this.roomGroupModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  SetModalData(data: any) {
    this.id = data.id;
    this.selRoomIds = [];
    this.name = data.name;
    this.allRoom = data.allRoom;

    if (data.roomIds && Array.isArray(data.roomIds)) {
      data.roomIds.forEach((element: string) => {
        let indexOf = this.roomsList.findIndex((data) => data.id == element);
        if (indexOf >= 0 || data.allRoom) {
          this.selRoomIds.push(element);
          this.roomsList[indexOf].isSelected = true;
        }
      });
    }

    this.IsFormValid = this.selRoomIds.length > 0;
  }

  EditRoomGroup(itemData: any, template: TemplateRef<any>) {
    let itemDataId = itemData.id;
    this.id = Number(itemDataId);

    if (itemDataId > 0) {
      this.roomClient.getOneRoomSet(itemDataId).subscribe(
        (result: any) => {
          this.SetModalData(result);
          this.AddNewRoomGroup(template, false);
          this.formCaption = `Edit Room Group : ${result.name}`;
        },
        (error) => console.error(error)
      );
    }
  }

  DeleteRoomGroup(RoomGroup: any) {
    this.swalAlert
      .ConfirmDelete(
        "Not able to recover",
        `Are you sure to delete room group : ${RoomGroup.name}`
      )
      .subscribe((result) => {
        if (result) {
          this.DeleteRoomGroupById(RoomGroup);
        }
      });
  }

  DeleteRoomGroupById(RoomGroup: any) {
    var deleteRoomSetCommand = new DeleteRoomSetCommand();
    deleteRoomSetCommand.id = RoomGroup.id;
    this.roomClient.deleteRoomSet(deleteRoomSetCommand).subscribe((res) => {
      this.GetRoomGroupsList();
      this.toastService.add({
        severity: "success",
        summary: `Delete Room Group`,
        detail: `Room group deleted successfully`,
      });
    });
  }

  BulkDeleteRoomGroups() {
    var lstSelected: Array<number> = [];
    this.dt_datas.forEach((item: any) => {
      if (item?.isChecked == true) {
        lstSelected.push(Number(item.id));
      }
    });

    if (lstSelected.length > 0) {
      this.swalAlert
        .ConfirmDelete(
          "Not able to recover",
          `Are you sure to delete selected room groups ?`
        )
        .subscribe((result) => {
          if (result) {
            this.roomClient.deleteRoomSets(lstSelected).subscribe((res) => {
              this.GetRoomGroupsList();
              this.toastService.add({
                severity: "success",
                summary: `Delete Room Groups`,
                detail: `Selected Room groups deleted successfully`,
              });
            });
          }
        });
    }

    this.IsCheckAll = false;
  }

  AddRemoveAllRooms(checkedAll: boolean) {
    if (this.roomsList && Array.isArray(this.roomsList)) {
      if (checkedAll) {
        this.roomsList.forEach((room) => {
          this.selRoomIds.push(room.id);
        });
      } else {
        this.selRoomIds = [];
        if (this.roomsList && Array.isArray(this.roomsList)) {
          this.roomsList.forEach((room) => {
            room.isSelected = false;
          });
        }
      }
    }

    this.IsFormValid = this.selRoomIds.length > 0;
  }

  AddRemoveRooms(isSelected: boolean, roomId: number) {
    if (this.roomsList && Array.isArray(this.roomsList)) {
      let room = this.roomsList.find((room) => room.id === roomId);

      if (room) {
        if (isSelected) {
          if (room && ItsNumber(room.id) > 0) {
            this.selRoomIds.push(room.id);
          }
        } else {
          if (room && ItsNumber(room.id) > 0) {
            this.selRoomIds.splice(
              this.selRoomIds.findIndex((id) => ItsNumber(id) === roomId),
              1
            );
          }
        }
      }
      this.IsFormValid = this.selRoomIds.length > 0;
    }
  }

  GetModalData(): any {
    let cmd: any = {
      id: this.id,
      name: this.name,
      allRoom: this.allRoom,
      roomIds: this.selRoomIds,
    };

    return cmd;
  }

  ResetModal() {
    this.id = 0;
    this.name = null;
    this.selRoomIds = [];
    this.allRoom = false;
    this.IsFormValid = false;
    this.formCaption = "New Room Group";

    if (this.roomsList && Array.isArray(this.roomsList)) {
      this.roomsList.forEach((room) => {
        room.isSelected = false;
      });
    }
  }

  SaveRoomGroups() {
    if (this.id <= 0) {
      let cmd: CreateRoomSetCommand = this.GetModalData();
      this.roomClient.createRoomSet(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.toastService.add({
            severity: "success",
            detail: `Room group created successfully.`,
            summary: `Room group created successfully.`,
          });
          this.GetRoomGroupsList();
          this.roomGroupModalRef.hide();
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
      let cmd: UpdateRoomSetCommand = this.GetModalData();
      this.roomClient.updateRoomSet(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.toastService.add({
            severity: "success",
            detail: `Room group updated successfully`,
            summary: `Room group updated successfully`,
          });
          this.GetRoomGroupsList();
          this.roomGroupModalRef.hide();
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

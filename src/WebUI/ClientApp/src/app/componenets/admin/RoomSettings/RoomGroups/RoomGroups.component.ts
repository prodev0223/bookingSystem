import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ItsNumber } from "src/app/common/CommonFunctions";
import {
  CreateRoomSetCommand,
  DeleteRoomSetCommand,
  GetAllRoomSets,
  RoomClient,
  RoomSet,
  UpdateRoomSetCommand,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-RoomGroups",
  templateUrl: "./RoomGroups.component.html",
  styleUrls: ["./RoomGroups.component.sass"],
})
export class RoomGroupsComponent implements OnInit {
  id?: number;
  selected = [];
  formCaption = "";
  filteredData = [];
  allRoom?: boolean;
  IsFormValid = false;
  ColumnMode = ColumnMode;
  name?: string | undefined;
  roomsList: Array<any> = [];
  columns = [{ name: "name" }];
  SelectionType = SelectionType;
  dt_datas: Array<RoomSet> = [];
  roomGroupModalRef?: BsModalRef;
  selRoomIds?: string[] | undefined;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private roomClient: RoomClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private swalAlert: SweetAlertService
  ) {}

  ngOnInit() {
    this.getAllRooms();
    this.GetRoomGroupsList();
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

  GetRoomGroupsList() {
    this.roomClient.getAllRoomSet(new GetAllRoomSets()).subscribe(
      (result) => {
        this.selected = [];
        this.dt_datas = result;
        this.filteredData = result;
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

    this.IsFormValid = this.selRoomIds.length > 0 || data.allRoom;
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
      .ConfirmDelete(`Are you sure to delete room group : ${RoomGroup.name}`)
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
      this.snackbar.showNotification(
        "success",
        "Room group deleted successfully"
      );
    });
  }

  BulkDeleteRoomGroups() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected.map((item) => item.id);

    if (lstSelected.length > 0) {
      this.swalAlert
        .ConfirmDelete(`Are you sure to delete selected room groups ?`)
        .subscribe((result) => {
          if (result) {
            this.roomClient.deleteRoomSets(lstSelected).subscribe((res) => {
              this.GetRoomGroupsList();
              this.snackbar.showNotification(
                "success",
                "Selected Room groups deleted successfully"
              );
            });
          }
        });
    }
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
          this.snackbar.showNotification(
            "success",
            "Room group created successfully"
          );
          this.GetRoomGroupsList();
          this.roomGroupModalRef.hide();
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
      let cmd: UpdateRoomSetCommand = this.GetModalData();
      this.roomClient.updateRoomSet(cmd).subscribe(
        (result) => {
          this.ResetModal();
          this.snackbar.showNotification(
            "success",
            "Room group updated successfully"
          );
          this.GetRoomGroupsList();
          this.roomGroupModalRef.hide();
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

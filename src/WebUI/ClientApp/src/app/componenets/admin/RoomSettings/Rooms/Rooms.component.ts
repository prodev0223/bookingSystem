import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AddTodayDate } from "src/app/common/CommonFunctions";
import { FormHelper } from "src/app/common/FormHelper";
import {
  CreateUpdateRoomDto,
  RoomClient,
  RoomExtraInfoField,
  RoomExtraInfoTemplate,
  RoomNameListDto,
} from "src/app/common/web-api-client";
import { SnackbarService } from "src/app/service/Snackbar.service";
import { SweetAlertService } from "src/app/service/SweetAlert.service";

@Component({
  selector: "app-Rooms",
  templateUrl: "./Rooms.component.html",
  styleUrls: ["./Rooms.component.sass"],
})
export class RoomsComponent implements OnInit {
  selected = [];
  fh: FormHelper;
  filteredData = [];
  minToStep = 5;
  roomId: number = 0;
  roomForm!: FormGroup;
  ColumnMode = ColumnMode;
  formCaption = "New Room";
  roomModalRef?: BsModalRef;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  columns = [
    { name: "name" },
    { name: "shortName" },
    { name: "chineseName" },
    { name: "mappingKey" },
  ];
  SelectionType = SelectionType;
  roomExtraFields: Array<any> = [];
  dt_datas: Array<RoomNameListDto> = [];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    public roomClient: RoomClient,
    private snackbar: SnackbarService,
    private modalService: BsModalService,
    private swalService: SweetAlertService
  ) {
    this.minDate.setHours(7);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0);
    this.maxDate.setHours(23);
    this.maxDate.setMinutes(55);
    this.maxDate.setSeconds(0);
  }

  ngOnInit() {
    this.GetRoomsList();
    this.CreateRoomForm();
    this.fh = new FormHelper(this.roomForm);
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

  GetRoomsList() {
    this.roomClient.getFullList().subscribe(
      (result: any) => {
        this.selected = [];
        this.dt_datas = result;
        this.filteredData = result;
      },
      (error) => console.error(error)
    );
  }

  CreateRoomForm() {
    this.roomForm = new FormGroup({
      roomId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      shortName: new FormControl(null, Validators.required),
      chineseName: new FormControl(null, Validators.required),
      mappingKey: new FormControl(null, Validators.required),
      startDate: new FormControl(new Date(), [Validators.required]),
      endDate: new FormControl(new Date(), Validators.required),
      timeSpanMinutes: new FormControl("60", Validators.required),
      bookingUserModeId: new FormControl("0", Validators.required),
      autoRelease: new FormControl("15", Validators.required),
      disabled: new FormControl(false),
      defaultBookingTypeId: new FormControl("2", Validators.required),
      inAdvanceDay: new FormControl("10", Validators.required),
    });
  }

  AddNewRoom(template: TemplateRef<any>, resetModal: boolean = true) {
    if (resetModal) {
      this.roomId = 0;
      this.GetRoomExtraFields();
      this.formCaption = "New Room";
      this.setControlValue("name", null);
      this.setControlValue("shortName", null);
      this.setControlValue("chineseName", null);
      this.setControlValue("mappingKey", null);
      this.setControlValue("autoRelease", 15);
      this.setControlValue("inAdvanceDay", 10);
      this.setControlValue("endDate", this.maxDate);
      this.setControlValue("startDate", this.minDate);
      this.setControlValue("timeSpanMinutes", 60);
      this.setControlValue("bookingUserModeId", 0);
      this.setControlValue("defaultBookingTypeId", 2);
    }

    this.setControlValue("roomId", this.roomId);
    this.roomModalRef = this.modalService.show(template, {
      class: "modal-lg",
    });
  }

  ResetExtraFieldValue() {
    if (this.roomExtraFields && this.roomExtraFields.length > 0) {
      this.roomExtraFields.forEach((element: RoomExtraInfoField) => {
        element.value = null;
      });
    }
  }

  GetRoomExtraFields() {
    this.roomExtraFields = [];
    this.roomClient.getRoomExtraFields().subscribe((res) => {
      res.forEach((item: RoomExtraInfoTemplate) => {
        this.roomExtraFields.push(<RoomExtraInfoTemplate>{
          key: item.key,
          type: item.type,
        });
      });
    });
  }

  GetRoomExtraFieldsWithData(data: any) {
    this.roomExtraFields = [];
    if (data && Array.isArray(data.roomExtraInfoFields)) {
      let roomExtraInfoFields = data.roomExtraInfoFields;
      roomExtraInfoFields.forEach((item: RoomExtraInfoField) => {
        this.roomExtraFields.push(item.toJSON());
      });
    }

    this.roomClient.getRoomExtraFields().subscribe((res) => {
      res.forEach((item: RoomExtraInfoTemplate) => {
        if (
          this.roomExtraFields.findIndex((data) => data.key === item.key) < 0
        ) {
          this.roomExtraFields.push(<RoomExtraInfoTemplate>{
            key: item.key,
            type: item.type,
          });
        }
      });
    });
  }

  EditRoom(itemData: any, template: TemplateRef<any>) {
    this.roomForm.reset();
    let itemDataId = itemData.id;
    this.roomId = Number(itemDataId);
    this.setControlValue("roomId", Number(itemDataId));
    this.formCaption = "Edit Room: " + itemData?.name ?? "";

    if (itemDataId > 0) {
      this.roomClient.getOne(itemDataId).subscribe(
        (data: any) => {
          this.roomForm.patchValue({
            roomId: data.roomId,
            name: data.name,
            shortName: data.shortName,
            chineseName: data.chineseName,
            mappingKey: data.mappingKey,
            startDate: data.start,
            endDate: data.end,
            timeSpanMinutes: data.timeSpanMinutes,
            bookingUserModeId: data.bookingUserModeId,
            autoRelease: data.autoRelease,
            defaultBookingTypeId: data.defaultBookingTypeId,
            inAdvanceDay: data.inAdvanceDay,
          });

          this.GetRoomExtraFieldsWithData(data);
          this.AddNewRoom(template, false);
        },
        (error) => console.error(error)
      );
    }
  }

  DeleteRoom(RoomData: any) {
    this.swalService
      .ConfirmDelete(`Are you sure to delete room : ${RoomData.name}`)
      .subscribe((result) => {
        if (result) {
          this.DeleteRoomById(RoomData);
        }
      });
  }

  DeleteRoomById(RoomData: any) {
    this.roomClient.deleteRoom(RoomData.id).subscribe((res) => {
      this.GetRoomsList();
      this.snackbar.showNotification("success", "Room deleted successfully");
    });
  }

  BulkDeleteRooms() {
    var lstSelected: Array<number> = [];
    lstSelected = this.selected.map((room) => room.id);

    this.swalService
      .ConfirmDelete(`Are you sure to delete selected rooms ?`)
      .subscribe((result) => {
        if (result) {
          this.roomClient.bulkDeleteRooms(lstSelected).subscribe((res) => {
            this.GetRoomsList();
            this.snackbar.showNotification(
              "success",
              `Selected rooms deleted successfully`
            );
          });
        }
      });
  }

  getControlValue(controlName: string): any {
    return this.roomForm.controls[controlName].value;
  }

  setControlValue(controlName: string, value: any) {
    this.roomForm.controls[controlName].setValue(value);
  }

  GetFormData() {
    var createUpdateRoomDto: any = {
      roomId: Number(this.getControlValue("roomId")),
      name: this.getControlValue("name"),
      shortName: this.getControlValue("shortName"),
      chineseName: this.getControlValue("chineseName"),
      mappingKey: this.getControlValue("mappingKey"),
      start: AddTodayDate(new Date(this.getControlValue("startDate"))),
      end: AddTodayDate(new Date(this.getControlValue("endDate"))),
      timeSpanMinutes: Number(this.getControlValue("timeSpanMinutes")),
      bookingUserModeId: Number(this.getControlValue("bookingUserModeId")),
      autoRelease: Number(this.getControlValue("autoRelease")),
      disabled: false,
      defaultBookingTypeId: Number(
        this.getControlValue("defaultBookingTypeId")
      ),
      inAdvanceDay: Number(this.getControlValue("inAdvanceDay")),
      roomExtraInfoFields: this.roomExtraFields,
    };

    return createUpdateRoomDto;
  }

  SaveRoom() {
    if (this.roomForm.valid) {
      if (this.roomId <= 0) {
        let createUpdateRoomDto = new CreateUpdateRoomDto();
        createUpdateRoomDto = this.GetFormData();
        this.roomClient.createUpdateRoom(createUpdateRoomDto).subscribe(
          (result) => {
            this.GetRoomsList();

            this.snackbar.showNotification(
              "success",
              `Room created successfully`
            );
          },
          (error) => {
            console.log(error.response);
            let errors = JSON.parse(error.response);
            this.snackbar.showNotification(
              "error",
              `${JSON.stringify(errors.errors)}`
            );
          }
        );
      } else if (this.roomId > 0) {
        let createUpdateRoomDto = new CreateUpdateRoomDto();
        createUpdateRoomDto = this.GetFormData();
        this.roomClient.updateRoom(createUpdateRoomDto).subscribe(
          (result) => {
            this.GetRoomsList();
            this.snackbar.showNotification(
              "success",
              `Room updated successfully`
            );
          },
          (error) => {
            console.log(error.response);
            let errors = JSON.parse(error.response);
            this.snackbar.showNotification(
              "error",
              `${JSON.stringify(errors.errors)}`
            );
          }
        );
      }
      this.roomModalRef.hide();
    }
  }
}

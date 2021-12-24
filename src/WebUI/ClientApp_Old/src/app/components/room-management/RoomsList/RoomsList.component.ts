import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DataTableDirective } from "angular-datatables";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ConfirmationService } from "primeng/api";
import { Subject } from "rxjs";
import { CommonConfig } from "src/app/common/CommonConfig";
import { AddTodayDate } from "src/app/common/CommonFunctions";
import { FormHelper } from "src/app/common/FormHelper";
import { ToastService } from "src/app/service/toast.service";
import {
  CreateUpdateRoomDto,
  RoomClient,
  RoomExtraInfoField,
  RoomExtraInfoTemplate,
  RoomNameListDto,
} from "src/app/web-api-client";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: "app-RoomsList",
  templateUrl: "./RoomsList.component.html",
  styleUrls: ["./RoomsList.component.css"],
  providers: [ConfirmationService],
})
export class RoomsListComponent implements OnDestroy, OnInit {
  fh: FormHelper;
  IsCheckAll: false;
  roomId: number = 0;
  roomForm!: FormGroup;
  formCaption = "New Room";
  roomModalRef?: BsModalRef;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  roomExtraFields: Array<any> = [];
  dt_datas: Array<RoomNameListDto> = [];

  // Datatables Properties
  dtOptions: DataTables.Settings = {
    columnDefs: [{ orderable: false, targets: 0 }],
  };
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(
    public roomClient: RoomClient,
    private toastService: ToastService,
    private modalService: BsModalService
  ) {
    this.minDate.setHours(7);
    this.minDate.setMinutes(0);
    this.minDate.setSeconds(0);
    this.maxDate.setHours(23);
    this.maxDate.setMinutes(55);
    this.maxDate.setSeconds(0);
    this.dtOptions = CommonConfig.getDataTableSettings();
    this.dtOptions.columnDefs = [{ orderable: false, targets: [0, -1] }];
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit() {
    this.CreateRoomForm();
    this.GetRoomsList(false);
    this.fh = new FormHelper(this.roomForm);
  }

  GetRoomsList(isReRender: boolean = true) {
    this.roomClient.getFullList().subscribe(
      (result: any) => {
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
      element.isChecked = this.IsCheckAll;
    });
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
          console.log(JSON.stringify(data.roomExtraInfoFields));

          this.roomForm.patchValue({
            roomId: data.roomId,
            name: data.name,
            shortName: data.shortName,
            chineseName: data.chineseName,
            mappingKey: data.mappingKey,
            startDate: new Date(data.start),
            endDate: new Date(data.end),
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
    Swal.fire({
      title: "Not able to recover",
      text: `Are you sure to delete room : ${RoomData.name}`,
      icon: "warning",
      confirmButton: "btn btn-danger",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result: { value: any }) => {
      if (result.value) {
        this.DeleteRoomById(RoomData);
      }
    });
  }

  DeleteRoomById(RoomData: any) {
    this.roomClient.deleteRoom(RoomData.id).subscribe((res) => {
      this.GetRoomsList();
      this.toastService.add({
        severity: "success",
        summary: `Delete Room`,
        detail: `Room deleted successfully`,
      });
    });
  }

  BulkDeleteRooms() {
    var lstSelected: Array<number> = [];
    this.dt_datas.forEach((item: any) => {
      if (item?.isChecked == true) {
        lstSelected.push(Number(item.id));
      }
    });

    if (lstSelected.length > 0) {
      Swal.fire({
        title: "Not able to recover",
        text: `Are you sure to delete selected rooms ?`,
        icon: "warning",
        confirmButton: "btn btn-danger",
        showCancelButton: true,
        confirmButtonText: "Yes, delete them!",
        cancelButtonText: "No, keep them",
      }).then((result: { value: any }) => {
        if (result.value) {
          this.roomClient.bulkDeleteRooms(lstSelected).subscribe((res) => {
            this.GetRoomsList();
            this.toastService.add({
              severity: "success",
              summary: `Delete Room`,
              detail: `Selected rooms deleted successfully`,
            });
          });
        }
      });
    }

    this.IsCheckAll = false;
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
            this.toastService.add({
              severity: "success",
              summary: `Create Room`,
              detail: `Room created successfully`,
            });
          },
          (error) => {
            console.log(error.response);

            let errors = JSON.parse(error.response);
            this.toastService.add({
              severity: "error",
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            });
          }
        );
      } else if (this.roomId > 0) {
        let createUpdateRoomDto = new CreateUpdateRoomDto();
        createUpdateRoomDto = this.GetFormData();
        this.roomClient.updateRoom(createUpdateRoomDto).subscribe(
          (result) => {
            this.GetRoomsList();
            this.toastService.add({
              severity: "success",
              summary: `Update Room`,
              detail: `Room updated successfully`,
            });
          },
          (error) => {
            console.log(error.response);
            let errors = JSON.parse(error.response);
            this.toastService.add({
              severity: "error",
              summary: `${errors.title}`,
              detail: `${JSON.stringify(errors.errors)}`,
            });
          }
        );
      }
      this.roomModalRef.hide();
    }
  }
}

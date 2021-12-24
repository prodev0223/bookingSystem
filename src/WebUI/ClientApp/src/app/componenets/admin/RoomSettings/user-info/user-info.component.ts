import { Component, OnInit, ViewChild } from "@angular/core";
import {
  ColumnMode,
  DatatableComponent,
  SelectionType,
} from "@swimlane/ngx-datatable";
import { Observable } from "rxjs";
import { UserClient, UserInfomodel } from "src/app/common/web-api-client";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.sass"],
})
export class UserInfoComponent implements OnInit {
  selected = [];
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  obj: Observable<UserInfomodel[]>;
  dt_datas: Array<UserInfomodel> = [];
  filteredData: Array<UserInfomodel> = [];
  columns = [
    { name: "userName" },
    { name: "normalizedEmail" },
    { name: "normalizedUserName" },
  ];
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(private userClient: UserClient) {}

  ngOnInit(): void {
    this.getUserGroup();
  }

  getUserGroup() {
    this.userClient.getUserInfo().subscribe((result) => {
      this.selected = [];
      this.dt_datas = result;
      this.filteredData = result;
    });
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
}

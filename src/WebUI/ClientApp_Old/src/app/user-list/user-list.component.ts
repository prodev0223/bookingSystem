import {Component, OnInit} from '@angular/core';
import {UserClient} from "../web-api-client";
import {MyTimeOnlyPipe} from "../helper/my-time-only.pipe";
import {DialogService, DynamicDialogConfig} from "primeng/dynamicdialog";
import {UserInfoPageComponent} from "../UserInfo/userinfo-page.component";
import {GetUserRawInfoButtonComponent} from "../global-list-helper/get-user-raw-info-button/get-user-raw-info-button/get-user-raw-info-button.component";
import {UserDetailsSettingsComponent} from "../user-details-settings/user-details-settings.component";
import {WinBoxService} from "../dynamicwinbox/winboxservice";
import {ChangeOneUserGroupSettingsComponent} from "../settings-forms/change-one-user-group-settings/change-one-user-group-settings.component";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  gridOptions: any;
  rowData: any;
  columnDefs: any =
    [
      {field: "username", width: '500px'},
      {field: "userId", width: '400px'},
      {
        field: 'show row data',
        cellRenderer: 'GetUserRawInfoButtonComponent',
        cellRendererParams: {
          label: "Show row data",
          onClick: (field: any) => {
            alert(JSON.stringify(field))
            //console.log('asdfadsf')
            //this.dialogService.open(
            //  UserInfoPageComponent, {}
            //);
          }
        },
        minWidth: 150,
      },
      {
        field: 'UserInfoPageComponent',
        cellRenderer: 'GetUserRawInfoButtonComponent',
        cellRendererParams: {
          label: "UserInfoPageComponent",
          onClick: (field: any) => {
            //console.log(JSON.stringify(field))
            this.winBoxService.open(
              UserDetailsSettingsComponent, {data: {userId: field.rowData.userId, title: field.rowData.userId}}
            );
          }
        },
        minWidth: 150,
      },
      {
        field: 'UserInfoPageComponent',
        cellRenderer: 'GetUserRawInfoButtonComponent',
        cellRendererParams: {
          label: "Update user's group",
          onClick: (field: any) => {
            this.winBoxService.open(
              ChangeOneUserGroupSettingsComponent, {data: {userId: field.rowData.userId, title: field.rowData.userId}}
            );
          }
        },
        minWidth: 150,
      }
      //{field: "start", valueFormatter: (data) => this.myTimeOnlyPipe.transform(data), resizable: true},
      //{field: "end", valueFormatter: (data) => this.myTimeOnlyPipe.transform(data), resizable: true},
    ]
  ;

  constructor(
    private winBoxService: WinBoxService,
    private dialogService: DialogService,
    private userClient: UserClient,
    private myTimeOnlyPipe: MyTimeOnlyPipe
  ) {
  }

  public dynamicDialogConfig: DynamicDialogConfig = new  DynamicDialogConfig();
  frameworkComponents: any;

  ngOnInit(): void {
    this.frameworkComponents = {
      GetUserRawInfoButtonComponent: GetUserRawInfoButtonComponent,
    };
    this.userClient.getUserAll().subscribe(result => {
        this.rowData = result;
      }, error => {
      }
    );
  }

  rowClick() {

  }

  myRowClick($event: any) {
    /*
    this.dialogService.open(
      UserInfoPageComponent, {}
    );
    */
  }
}

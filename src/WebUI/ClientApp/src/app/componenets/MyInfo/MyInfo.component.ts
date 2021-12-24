import { AfterViewInit, Component, OnInit } from "@angular/core";
import { UserClient } from "src/app/common/web-api-client";

@Component({
  selector: "app-MyInfo",
  templateUrl: "./MyInfo.component.html",
  styleUrls: ["./MyInfo.component.sass"],
})
export class MyInfoComponent implements OnInit, AfterViewInit {
  userId: string = "";
  panelOpenState = false;
  userGroups: Array<any> = [];
  constructor(private userClient: UserClient) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    this.getUserGroup();
  }

  getUserGroup() {
    let self = this;
    self.userClient
      .GetCallWithData("/api/User/GetLoggedUserGroup")
      .subscribe((result: any) => {
        self.userGroups = [];
        let data = result;
        if (data && Array.isArray(data)) {
          data.forEach((item: any) => {
            self.userGroups.push({
              groupId: item.id,
              groupName: item.name,
              roleName: item.userRoleNames.toString(),
            });
          });
        }
      });
  }
}

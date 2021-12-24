import {Component, OnInit} from '@angular/core';
import {UserClient} from "../web-api-client";
import {WinBoxRef} from "../dynamicwinbox/win-box-ref";
import {WinBoxConfig} from "../dynamicwinbox/winbox-config";

@Component({
  selector: 'app-user-details-settings',
  templateUrl: './user-details-settings.component.html',
  styleUrls: ['./user-details-settings.component.css']
})
export class UserDetailsSettingsComponent implements OnInit {

  constructor(
    private userClient: UserClient,
    private winBoxRef: WinBoxRef,
    private winBoxConfig: WinBoxConfig
  ) {
  }

  userId: string = "";
  rawJson: any;
  userGroup: any;

  ngOnInit(): void {
    this.userId = this.winBoxConfig.data.userId;
    this.userClient.getUserinfo(this.userId).subscribe(res => {
      this.rawJson = res;
    })

    this.userClient.getSimpleUserGroup(this.userId).subscribe(res => {
      this.userGroup = res;
    })
  }
}

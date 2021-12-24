import {Component, OnDestroy, Optional} from '@angular/core';
import {AuthorizeService} from "../../api-authorization/authorize.service";
import {UserClient, UserGroup, UserInfomodel} from "../web-api-client";
import {PermissionsService} from "../service/permissions.service";
import {SettingsService} from "../service/settings.service";
import {WinBoxRef} from "../dynamicwinbox/win-box-ref";
import { Observable } from 'rxjs';

@Component({
  selector: 'userinfo-token-page-component',
  templateUrl: './userinfo-page.component.html'
})

export class UserInfoPageComponent implements OnDestroy {
  public currentCount = 0;
  public testing:object;
  obj:Observable<UserInfomodel[]>
  public UserInfo:UserInfomodel[]=[];
  public userGroups: UserGroup[];
  private baseUrl: string;
  public globalCount: number = 1;

  ngOnDestroy():void{

    if(this.ref)
    {
      this.ref.close("asdf??");
    }
    else{
      console.log('no from dynamic win box');
    }
    console.log("no more UserInfoPageComponent")
  }

  constructor(

    @Optional()
    public ref: WinBoxRef,
    private settingsService: SettingsService,
    private userClient: UserClient, private permissionsService: PermissionsService) {
    this.globalCount = this.settingsService.userInfoCounter;

    this.settingsService.countListen.subscribe(n => {
      this.globalCount = n;
    });
  }

  ngOnInit(): void {
  this.getUserGroup();
  }
  public incrementCounter() {
    this.currentCount++;
  }


  getUserGroup() {
    debugger
    this.userClient.getUserInfo().subscribe(
      (result) => {
        console.log(result);
        this.UserInfo = result;
      },
      (error) => console.error(error)
    );
  }


  public ResetForm() {

  }

}

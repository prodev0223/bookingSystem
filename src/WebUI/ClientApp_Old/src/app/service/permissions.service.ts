import {Injectable} from '@angular/core';
import {PermissionSet, UserClient, UserGroup, UserPermission, UserPermissionClient, UserRole} from "../web-api-client";
import {BehaviorSubject, Observable, of} from "rxjs";
import {debounce, delay, map, skipUntil, skipWhile} from "rxjs/operators";
import {AuthorizeService} from "../../api-authorization/authorize.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private source = new BehaviorSubject<PermissionSet>(new PermissionSet());
  private userGroups: UserGroup[];
  private needUpdate: boolean = true;

  constructor(private userPermissionClient: UserPermissionClient, private userClient: UserClient, private authorizeService: AuthorizeService) {
    console.log("PermissionsService constructor");
    const onlyWhenAuthed = authorizeService.isAuthenticated().pipe(skipWhile((hero) => hero == false)).pipe(delay(10000));
    var waitForAuth = authorizeService.isAuthenticated();
    waitForAuth.subscribe(i => {
      if(i && this.needUpdate)
      {
        this.needUpdate = false;
        userPermissionClient.getMySystemPermission().subscribe(i => this.source.next(i[0]));
        userClient.getMyUserGroup().subscribe(result => {
          this.userGroups = result;
        });
      }
    });

  }

  get listenMySystemPermission(): Observable<PermissionSet> {
    return this.source;
  }

  get myGroups(): UserGroup[] {
    return this.userGroups;
  }

  checkRoomPermission(roomId: number, ...mustHavePermissions: UserPermission[]): boolean {
    let groupCnt = this.userGroups.length;
    for (let k = 0; k < groupCnt; k++) {

      const group: UserGroup = this.userGroups[k];
      const roleCnt: number = group.userRoles.length;

      for (let i = 0; i < roleCnt; i++) {
        let role: UserRole = group.userRoles[k];
        let haveRoom: boolean = role.roomSet.allRooms || role.roomSet.rooms.findIndex(j => j.id == roomId) > 0;
        if (haveRoom) {
          const permissionCheck =
            role.permissionSet.permissions.includes(UserPermission.AllPermission)
            || role.permissionSet.permissions.every(val => mustHavePermissions.includes(val));
          if (permissionCheck) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

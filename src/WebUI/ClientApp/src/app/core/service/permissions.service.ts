import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  PermissionSet,
  UserClient,
  UserGroup,
  UserPermission,
  UserPermissionClient,
  UserRole,
} from "src/app/common/web-api-client";
import { AuthService } from "src/app/core/service/auth.service";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
  private userGroups: UserGroup[];
  private needUpdate: boolean = true;
  private source = new BehaviorSubject<PermissionSet>(new PermissionSet());

  constructor(
    private userPermissionClient: UserPermissionClient,
    private userClient: UserClient,
    private authorizeService: AuthService
  ) {
    console.log("PermissionsService constructor");
    authorizeService.isAuthenticated().subscribe((result) => {
      if (result && this.needUpdate) {
        // this.needUpdate = false;
        userPermissionClient
          .getMySystemPermission()
          .subscribe((perms) => this.source.next(perms[0]));
        userClient.getMyUserGroup().subscribe((result) => {
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

  checkRoomPermission(
    roomId: number,
    ...mustHavePermissions: UserPermission[]
  ): boolean {
    let groupCnt = this.userGroups.length;
    for (let k = 0; k < groupCnt; k++) {
      const group: UserGroup = this.userGroups[k];
      const roleCnt: number = group.userRoles.length;

      for (let i = 0; i < roleCnt; i++) {
        let role: UserRole = group.userRoles[k];
        let haveRoom: boolean =
          role.roomSet.allRooms ||
          role.roomSet.rooms.findIndex((j) => j.id == roomId) > 0;
        if (haveRoom) {
          const permissionCheck =
            role.permissionSet.permissions.includes(
              UserPermission.AllPermission
            ) ||
            role.permissionSet.permissions.every((val) =>
              mustHavePermissions.includes(val)
            );
          if (permissionCheck) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

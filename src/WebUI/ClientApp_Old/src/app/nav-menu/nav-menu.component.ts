import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewContainerRef,
} from "@angular/core";
import { MenuItem } from "primeng/api";
import { WinBoxService } from "../dynamicwinbox/winboxservice";
import { Pathname } from "../enums/pathname";
import { PermissionsService } from "../service/permissions.service";
import { SettingsService } from "../service/settings.service";
import { UserInfoPageComponent } from "../UserInfo/userinfo-page.component";

declare const WinBox: any;

@Component({
  selector: "app-nav-menu",
  templateUrl: "./nav-menu.component.html",
  styleUrls: ["./nav-menu.component.scss"],
})
export class NavMenuComponent {
  isExpanded = false;

  constructor(
    private a: WinBoxService,
    //private winboxService: WinboxService,
    private settingsService: SettingsService,
    private cd: ChangeDetectorRef,
    private vcr: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private permissionsService: PermissionsService
  ) {
    //this.winboxService.viewContainerRef = this.vcr;
    //this.winboxService.resolver = this.resolver;
    if (this.settingsService.showDebug()) {
      this.items = this.defaultItems.concat(this.extraDebugMenu);
    } else {
      this.items = this.defaultItems;
    }
    permissionsService.listenMySystemPermission.subscribe((result) => {
      if (
        result !== undefined &&
        result.permissions !== undefined &&
        result.permissions.length > 0
      ) {
        this.items = this.items.concat(this.adminMenuItem);
        console.log("Got System Permission");
      } else if (result !== undefined && result.permissions === undefined) {
        //this.items = this.defaultItems;
        //this.items = this.defaultItems.concat([{label: 'No System Permission', routerLink: ['/']}])
        //console.log('No System Permission Yet');
      }
    });
  }

  adminMenuItem = [
    {
      label: "Admin Menu",
      routerLink: [`/${Pathname.AdminMenu}`],
    },
  ];

  extraDebugMenu = [
    {
      label: "Draft Paper",
      routerLink: [`/${Pathname.DraftPaper}`],
    },
    {
      label: "Tree",
      routerLink: [`/${Pathname.UserOrgChart}`],
    },
  ];

  defaultItems = [
    {
      label: "Room Reservation",
      routerLink: ["/"],
    },
    {
      label: "Room Reservation (New)",
      routerLink: [`/${Pathname.RoomReservation}`],
    },
    //{
    //  label: 'Home',
    //  routerLink: ['/']
    //},
    //{label: 'Todo', routerLink: ['/todo']},
    //{
    //  label: 'Small Form',
    //  routerLink: ['/smform']
    //},
    {
      label: "My Bookings",
      routerLink: [`/${Pathname.GlobalList}/${Pathname.MyBookings}`],
    },
    {
      label: "My Bookings (New)",
      routerLink: [`/${Pathname.MyBookings}`],
    },
    // {
    //   label: 'My Info',
    //   routerLink: [`/${Pathname.MyInfo}`]
    // },
  ] as MenuItem[];

  items: MenuItem[] = [];

  ngOnInit() {}

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  addOne() {
    this.settingsService.addUserInfoCounter();
  }

  showWindows() {
    const ref = this.a.open(UserInfoPageComponent, {});
    ref.onClose.subscribe((car) => {
      if (car) {
        console.log("car: " + car);
      }
    });
    /*
    //this.winboxService.showWindows();
    const factory = this.resolver.resolveComponentFactory(UserOrganizationChartComponent);
    let componentRef = this.vcr.createComponent(factory);
    const element = componentRef.location.nativeElement;
    //    viewContainerRef.clear();
    new WinBox({
      mount: element,
      title: "Custom Color",
      background: "#ff005d",
      border: 4,
      onclose:(force) => {
        this.vcr.remove(0);
        //this.vcr.clear();
      }
    });
    */
  }

  copyToClipboard() {
    this.showWindows();
  }
}

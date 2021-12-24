import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyBookingsComponent } from "src/app/componenets/Booking/MyBookings/MyBookings.component";
import { Page404Component } from "./authentication/page404/page404.component";
import { RoomReservationComponent } from "./componenets/Booking/RoomReservation/RoomReservation.component";
import { MyInfoComponent } from "./componenets/MyInfo/MyInfo.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
      {
        path: "dashboard",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
      },
      {
        path: "mybookings",
        canActivate: [AuthGuard],
        component: MyBookingsComponent,
      },
      {
        path: "roomreservation",
        canActivate: [AuthGuard],
        component: RoomReservationComponent,
      },
      {
        path: "myinfo",
        canActivate: [AuthGuard],
        component: MyInfoComponent,
      },
      {
        path: "admin",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./componenets/admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

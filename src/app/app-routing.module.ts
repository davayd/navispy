import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "cars",
    pathMatch: "full"
  },
  {
    path: "cars",
    loadChildren: "./cars/cars.module#CarsPageModule"
  },
  {
    path: "track/:carId",
    loadChildren: "./tracking/tracking.module#TrackingPageModule"
  },
  { path: "test", loadChildren: "./test/test.module#TestPageModule" },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

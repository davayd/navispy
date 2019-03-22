import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuardService } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    redirectTo: "cars",
    pathMatch: "full"
  },
  {
    path: "cars",
    loadChildren: "./cars/cars.module#CarsPageModule",
    canActivate: [AuthGuardService]
  },
  {
    path: "track/:carId",
    loadChildren: "./tracking/tracking.module#TrackingPageModule",
    canActivate: [AuthGuardService]
  },
  { path: "login", loadChildren: "./login/login.module#LoginPageModule" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

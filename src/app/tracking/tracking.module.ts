import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TrackingPage } from "./tracking.page";
import { CarActionHistoryComponent } from "../components/car-action-history/car-action-history.component";
import { CarTotalHistoryComponent } from '../components/total-history/total-history.component';
import { CarSensorIndicatorComponent } from '../components/sensor-indicator/sensor-indicator.component';

const routes: Routes = [
  {
    path: "",
    component: TrackingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TrackingPage,
    CarActionHistoryComponent,
    CarTotalHistoryComponent,
    CarSensorIndicatorComponent
  ]
})
export class TrackingPageModule {}

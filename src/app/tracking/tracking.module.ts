import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TrackingPage } from "./tracking.page";
import { CarActionHistoryComponent } from "../components/car-action-history/car-action-history.component";

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
  declarations: [TrackingPage, CarActionHistoryComponent]
})
export class TrackingPageModule {}

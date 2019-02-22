import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { TrackingPage } from "./tracking.page";

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
  declarations: [TrackingPage]
})
export class TrackingPageModule {}

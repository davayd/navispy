import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { TrackingPage } from "./tracking.page";
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: "",
    component: TrackingPage
  }
];

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, RouterModule.forChild(routes)],
  declarations: [TrackingPage]
})
export class TrackingPageModule {}

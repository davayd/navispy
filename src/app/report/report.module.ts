import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { ReportPage } from "./report.page";

const routes: Routes = [
  {
    path: "",
    component: ReportPage
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
    ReportPage,
  ]
})
export class ReportPageModule {}

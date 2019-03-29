import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { ReportPage } from "./report.page";
import { ReportService } from "../core/services/report.service";
import { ReportForDayComponent } from "../components/report-for-day/report-for-day.component";

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
  declarations: [ReportPage, ReportForDayComponent],
  providers: [ReportService]
})
export class ReportPageModule {}

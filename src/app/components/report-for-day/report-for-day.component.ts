import { Component, OnInit, Input } from "@angular/core";
import { Report } from 'src/app/core/models/report';

@Component({
  selector: "app-report-for-day",
  templateUrl: "./report-for-day.component.html",
  styleUrls: ["./report-for-day.component.scss"]
})
export class ReportForDayComponent implements OnInit {
  @Input() report: Report;

  constructor() {}

  ngOnInit() {}
}

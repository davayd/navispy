import { OnInit, Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReportService } from "../core/services/report.service";
import { Report, ReportType } from "../core/models/report";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { DatePicker } from "@ionic-native/date-picker/ngx";

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"]
})
export class ReportPage implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  carId: number;
  carName: string;
  reportId = "1";

  loading_Report = false;
  isError_Report = false;

  reports: Report[] = [];
  reportTypes: ReportType[] = [];

  dateOffset = 24 * 60 * 60 * 1000 * 7; // 7 days
  dateTo = new Date();
  dateFrom = new Date();

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService,
    private datePicker: DatePicker
  ) {
    this.dateFrom.setTime(this.dateFrom.getTime() - this.dateOffset);
  }

  ngOnInit() {
    this.carId = +this.route.snapshot.paramMap.get("carId");
    this.carName = this.route.snapshot.queryParamMap.get("name");

    this.getReports(
      this.carId,
      moment(this.dateFrom).format("YYYY-MM-DD"),
      moment(this.dateTo).format("YYYY-MM-DD"),
      this.reportId
    );
    this.getReportTypes();
  }

  getReports(
    carId: number,
    dateFrom: string,
    dateTo: string,
    reportId: string
  ) {
    this.loading_Report = true;
    this.isError_Report = false;
    this.reportService
      .getReport(carId, dateFrom, dateTo, reportId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(reports => {
        console.log(reports);
        this.loading_Report = false;
        this.reports = reports;
      }, error => {
        console.error(error);
        this.isError_Report = true;
      });
  }

  getReportTypes() {
    this.reportService
      .getReportTypes()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(types => {
        console.log(types);
        this.reportTypes = types;
      });
  }

  selectDateFrom() {
    this.datePicker
      .show({
        date: this.dateFrom,
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
      })
      .then(
        date => {
          console.log(date);
          this.dateFrom = date;
        },
        err => console.log("Error occurred while getting date: ", err)
      );
  }

  selectDateTo() {
    this.datePicker
      .show({
        date: this.dateTo,
        mode: "date",
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
      })
      .then(
        date => {
          console.log(date);
          this.dateTo = date;
        },
        err => console.log("Error occurred while getting date: ", err)
      );
  }

  generateReport() {
    this.getReports(
      this.carId,
      moment(this.dateFrom).format("YYYY-MM-DD"),
      moment(this.dateTo).format("YYYY-MM-DD"),
      this.reportId
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}

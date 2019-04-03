import { Injectable } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { Observable, from } from "rxjs";
import { Report, ReportType } from "../models/report";

import { map, catchError } from "rxjs/operators";
import { ErrorsHandler } from "./errors-handler.service";
import { KEY_LOGIN } from "./tracker.service";

@Injectable()
export class ReportService {
  private apiUrl = "http://www.navispy.com";

  constructor(private http: HTTP, private errorsHandler: ErrorsHandler) {}

  getReport(
    deviceId: number,
    dateFrom: string,
    dateTo: string,
    reportId: string
  ): Observable<Report[]> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/api/get_json_report_run.php?deviceID=${deviceId}&from=${dateFrom}&to=${dateTo}&reportID=${reportId}`,
        {},
        {}
      )
    ).pipe(
      map(res => JSON.parse(res.data)),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }

  getReportTypes(): Observable<ReportType[]> {
    const userName = localStorage.getItem(KEY_LOGIN);
    return from(
      this.http.get(
        this.apiUrl + `/php/api/get_json_report_list.php?userName=${userName}`,
        {},
        {}
      )
    ).pipe(
      map(res => JSON.parse(res.data)),
      catchError(error => this.errorsHandler.handleError(error))
    );
  }
}

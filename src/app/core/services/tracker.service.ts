import { Injectable } from "@angular/core";

import { Observable, of, from } from "rxjs";

import { CarInfo, CarHistory, Car } from "./../models/car";
import { HISTORY } from "./mock-history";
import { HTTP } from "@ionic-native/http/ngx";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class TrackerService {
  daysOfYear: string[] = [];
  apiUrl = " http://www.navispy.com";

  constructor(private http: HTTP) {
    this.generateDates();
  }

  login(userName: string, password: string): Observable<Car[] | any> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/android_test.php?userName=${userName}&password=${password}`,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)));
  }

  getCars(userName: string, password: string): Observable<Car[]> {
    return from(
      this.http.get(
        this.apiUrl +
          `/php/android_test.php?userName=${userName}&password=${password}`,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)));
  }

  getCar(id: number): Observable<CarInfo> {
    return from(
      this.http.get(
        this.apiUrl + "/php/android_get_dev_stat.php?deviceID=" + id,
        {},
        {}
      )
    ).pipe(map(res => JSON.parse(res.data)[0]));
  }

  getHistory(): Observable<CarHistory[]> {
    return of(HISTORY);
  }

  private generateDates() {
    const now = new Date();
    for (const d = new Date(2018, 1, 1); d <= now; d.setDate(d.getDate() + 1)) {
      this.daysOfYear.push(`${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`);
    }
  }
}

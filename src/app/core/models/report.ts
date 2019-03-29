import { Indicator } from "./car";

export interface Report {
  time: string;
  params: Indicator[];
}

export interface ReportType {
  ID: string;
  Name: string;
}

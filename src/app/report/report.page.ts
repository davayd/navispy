import { OnInit, Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-report",
  templateUrl: "./report.page.html",
  styleUrls: ["./report.page.scss"]
})
export class ReportPage implements OnInit {
  carId: number;
  carName: string;

  loading_Report = false;
  isError_Report = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.carId = +this.route.snapshot.paramMap.get("carId");
    this.carName = this.route.snapshot.queryParamMap.get("name");
  }

  getReport() {}
}

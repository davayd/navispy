import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-test",
  templateUrl: "./test.page.html",
  styleUrls: ["./test.page.scss"]
})
export class TestPage implements OnInit {
  segmentSpecification = "history";
  segmentHistory = "basket";
  constructor() {}

  ngOnInit() {}
}

import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuController, IonSlides, Platform } from "@ionic/angular";
import { TrackerService } from "../core/services/tracker.service";
import { CarInfo } from "../core/models/car";
import {
  Subject,
  Observable,
  timer,
  BehaviorSubject,
  interval,
  Subscription
} from "rxjs";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  ILatLng,
  Marker,
  BaseArrayClass,
  CameraPosition
} from "@ionic-native/google-maps";
import { HTTPResponse } from "@ionic-native/http/ngx";
import {
  merge,
  concatMap,
  map,
  takeUntil,
  switchMap,
  startWith
} from "rxjs/operators";

@Component({
  selector: "app-tracking",
  templateUrl: "./tracking.page.html",
  styleUrls: ["./tracking.page.scss"]
})
export class TrackingPage implements OnInit, AfterViewInit {
  private unsubscribe$ = new Subject<void>();
  private timerSub: Subscription;

  carInfo: CarInfo;
  carId: number;
  carName: string;
  defaultHref = "cars";
  segmentSpecification = "info";
  segmentHistory = "basket";
  map: GoogleMap;
  carMarker: Marker;

  daysOfYear: string[] = [];
  @ViewChild(IonSlides) slides: IonSlides;
  slidesOpts = {
    initialSlide: this.daysOfYear.length - 1,
    slidesPerView: 3
  };

  polledCarInfo$: Observable<CarInfo>;
  load$ = new BehaviorSubject("");

  constructor(
    private route: ActivatedRoute,
    private trackerService: TrackerService,
    private menu: MenuController,
    private platform: Platform
  ) {
    // tslint:disable-next-line:no-shadowed-variable
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
    this.carInfo = {
      DUT1: "",
      DUT2: "",
      DUT3: "",
      latitude: "",
      longitude: "",
      mileage: "",
      other: {},
      speed: "",
      time: "",
      course: 0
    };
  }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
    this.daysOfYear = this.trackerService.daysOfYear;
  }

  ngAfterViewInit() {
    // this.slides.slideTo(this.daysOfYear.length - 1);
    // this.slides.options = {
    //   initialSlide: this.daysOfYear.length - 1,
    //   slidesPerView: 3
    // };
  }

  ionViewWillEnter() {
    this.carId = +this.route.snapshot.paramMap.get("carId");
    this.carName = this.route.snapshot.queryParamMap.get("name");

    // this.timerSub = interval(10000)
    //   .pipe(
    //     startWith(0),
    //     switchMap(() => this.trackerService.getCar(this.carId))
    //   )
    //   .subscribe(res => {
    //     console.log(res);
    //     this.carInfo.other.open
    //       ? (res.other.open = true)
    //       : (res.other.open = false);

    //     this.carInfo = res;
    //     this.updateMap(this.carInfo);
    //   });

    const carInfoPolled$ = this.load$.pipe(
      switchMap(_ =>
        interval(10000).pipe(
          startWith(0),
          switchMap(() => this.trackerService.getCar(this.carId))
        )
      )
    );

    this.timerSub = carInfoPolled$.subscribe(res => {
      console.log(res);
      this.carInfo.other.open
        ? (res.other.open = true)
        : (res.other.open = false);

      this.carInfo = res;
      this.updateMap(this.carInfo);
    });
  }

  refreshDataClick() {
    this.load$.next("");
  }

  toggleSection(section: string) {
    this.carInfo[section].open = !this.carInfo[section].open;
  }

  ionViewWillLeave() {
    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
    this.timerSub.unsubscribe();
  }

  loadMap() {
    // const cameraPos: CameraPosition<ILatLng> = {
    //   target: { lat: +car.latitude, lng: +car.longitude },
    //   zoom: 16
    // };

    this.map = GoogleMaps.create("map_canvas", {
      camera: {
        zoom: 18,
        target: { lat: 53.901792, lng: 27.548565 }
      }
    });

    this.carMarker = this.map.addMarkerSync({
      position: { lat: +this.carInfo.latitude, lng: +this.carInfo.longitude },
      id: this.carId,
      icon: {
        url: "assets/img/arrow3.png",
        size: {
          width: 30,
          height: 30
        }
      },
      rotation: this.carInfo.course
    });
  }

  updateMap(carInfo: CarInfo) {
    if (this.map) {
      this.map.animateCamera({
        target: { lat: +carInfo.latitude, lng: +carInfo.longitude },
        duration: 1000
      });

      if (this.carMarker) {
        this.carMarker.setPosition({
          lat: +carInfo.latitude,
          lng: +carInfo.longitude
        });
        this.carMarker.setRotation(carInfo.course);
      }
    }
  }
}

import { Component } from "@angular/core";

import { Platform, MenuController, Events } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { TrackerService } from './core/services/tracker.service';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  public appPages = [
    {
      title: "Автомобили",
      url: "/cars",
      icon: "home"
    }
  ];
  public exitBtn = {
    title: "Выход",
    url: "/login",
    icon: "exit"
  };

  userName: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menu: MenuController,
    private router: Router,
    private events: Events,
    private trackerService: TrackerService
  ) {
    const isAuth = localStorage.getItem("auth");
    if (!isAuth) {
      localStorage.setItem("auth", "false");
    }
    if (isAuth === "true") {
      this.router.navigate(["/cars"]);
    } else {
      this.router.navigate(["/login"]);
    }
    this.initializeApp();
    // tslint:disable-next-line:no-shadowed-variable
    this.menu.get().then((menu: HTMLIonMenuElement) => {
      menu.swipeGesture = false;
    });
    this.userName = localStorage.getItem("login");
    this.events.subscribe("user:login", () => {
      this.userName = localStorage.getItem("login");
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString("356D92");
      this.splashScreen.hide();
    });
  }

  logout() {
    this.trackerService.logout();
    this.router.navigate(["/login"]);
  }
}

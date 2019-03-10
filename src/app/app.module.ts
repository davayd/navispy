import { NgModule, LOCALE_ID } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { HTTP } from "@ionic-native/http/ngx";
import { DatePicker } from '@ionic-native/date-picker/ngx';

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthGuardService } from './core/guards/auth.guard';

import localeRu from '@angular/common/locales/ru'
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeRu);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ mode: "md" }),
    AppRoutingModule
  ],
  providers: [
    HTTP,
    StatusBar,
    SplashScreen,
    AuthGuardService,
    DatePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: "ru-RU" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

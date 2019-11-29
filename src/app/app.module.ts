import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader,TranslateService }from '@ngx-translate/core';
import { TranslateHttpLoader }from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClientJsonpModule, HttpClient }from '@angular/common/http';
import {HashLocationStrategy , LocationStrategy} from '@angular/common';

import { SQLite } from '@ionic-native/sqlite/ngx';

import { TracklistPage } from "./model/tracklist.page";
import { SearchPage } from "./model/search.page";
import { NowplayingPage } from "./model/nowplaying.page";
import { SettingPage } from "./model/setting.page";
import { ShutdownPage } from "./model/shutdown.page";
import { Tab4PopoverPage } from "./model/tab4-popover.page";
import { TrackActionPage } from "./model/track-action.page";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/' ,'.json');
}

@NgModule({
  declarations: [AppComponent,
                TracklistPage,
                TrackActionPage,
                SearchPage,
                NowplayingPage,
                SettingPage,
                ShutdownPage,
                Tab4PopoverPage
  ],
  entryComponents: [TracklistPage,SearchPage,NowplayingPage,SettingPage,ShutdownPage,Tab4PopoverPage,TrackActionPage],
  // imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  imports: [BrowserModule, 
            IonicModule.forRoot({
              mode:'ios',  //配置android ios 都使用一个样式
              backButtonText:"返回"  //配置默认的返回按钮
            }), 
            AppRoutingModule,
            HttpClientModule,
            HttpClientJsonpModule,
            FormsModule,
            TranslateModule.forRoot({
                loader:{
                provide: TranslateLoader,
                useFactory:HttpLoaderFactory,
                deps: [HttpClient]
                }
            })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslateService,
    SQLite,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}



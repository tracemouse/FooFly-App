import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MyDBService}  from "./my-db.service";

import { AppConfig} from "./app.config";

 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private myDBService: MyDBService
  ) {
    
    this.initializeApp();
    this.initSettings();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.initGlobal();
      this.initStatusBar();
      this.splashScreen.hide();
    });
  }
  
  initStatusBar() {

    if (this.platform.is('android')) {
      this.statusBar.overlaysWebView(false);
      AppConfig.settings.platform = "android";
    }else if(this.platform.is('ios')){
      AppConfig.settings.platform = "ios";
    }else if(this.platform.is('cordova')){
      AppConfig.settings.platform = "cordova";
    }else if(this.platform.is('pwa')){
        AppConfig.settings.platform = "pwa";
    }else{
      AppConfig.settings.platform = "web";
    }
    console.log("platform=" + AppConfig.settings.platform);
    this.statusBar.styleDefault();
    // this.statusBar.styleBlackOpaque();
    // this.statusBar.styleLightContent();
    // this.statusBar.styleBlackOpaque();
    // this.statusBar.backgroundColorByHexString("#488aff");
    // this.statusBar.backgroundColorByHexString("#ef4b4b");
    this.statusBar.backgroundColorByHexString("#ffffff");
  }

  initSettings(){
    this.myDBService.createDb();
  }

  initGlobal() {
    var tablet = ["ipad", "xoom", "sch-i800", "playbook", "tablet", "kindle"];
    var mobile = ["mobile", "iphone", "ipod", "blackberry", "windows phone", "palm", "smartphone", "iemobile", "nokia"];
    var IOS = ["iphone", "ipod", "ipad"];
    var isTablet = false, isMobile = false, isIOS = false, isPC = false, isAndroid=false;
    var sUserAgent = navigator.userAgent.toLowerCase();
    for (let index in tablet) {
      isTablet = sUserAgent.indexOf(tablet[index]) != -1;
      if (isTablet) break;
    }
    for (let index in mobile) {
      isMobile = sUserAgent.indexOf(mobile[index]) != -1;
      if (isMobile) break;
    }
    for (let index in IOS) {
      isIOS = sUserAgent.indexOf(IOS[index]) != -1;
      if (isIOS) break;
    }
    if (!(isTablet || isMobile || isIOS)) {
      isPC = true;
    }

    if(isMobile && !isIOS){
      isAndroid = true;
    }

    AppConfig.global.isIOS = isIOS;
    AppConfig.global.isMobile = isMobile;
    AppConfig.global.isPC = isPC;
    AppConfig.global.isTablet = isTablet;
    AppConfig.global.isAndroid = isAndroid;

    AppConfig.global.scrollHeight = document.body.scrollHeight;

    console.log(AppConfig.global);
  
  }
 
    
}

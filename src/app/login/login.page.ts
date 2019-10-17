import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
// import { timeout } from 'rxjs/operators';

import { AppConfig } from '../app.config';
import { MyDBService } from "../my-db.service";
import { MyHttpService } from "../my-http.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  inputIp = AppConfig.settings.ip;
  inputPort = AppConfig.settings.port;
  inputPassword = AppConfig.settings.password;

  loginDisabled = false;

  public from: string;

  loading: any;
  // loadingDuration = AppConfig.settings.timeout * 60 * 1000;
  loadingDuration = 60 * 1000;

  bandIps = [];

  constructor(public navCtrl: NavController,
    public translateService: TranslateService,
    public alertController: AlertController,
    public myDBService: MyDBService,
    public activeRoute: ActivatedRoute,
    public myHttpService: MyHttpService,
    public loadingController: LoadingController) {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.from = params['from'];
    });
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    //console.log("login enter");

    this.inputIp = AppConfig.settings.ip;
    this.inputPort = AppConfig.settings.port;
    this.inputPassword = AppConfig.settings.password;

    if (this.bandIps.indexOf(this.inputIp) >= 0) {
      this.inputIp = "";
      this.inputPort = "";
    }

    // console.log(this.from);
    if ("exit" == this.from) {
      return;
    }

    // await this.initLoading();
    // await this.loading.present();

    this.testConn(AppConfig.settings.rootUrl);

    // let url = "";
    // this.myHttpService.http.get(url).subscribe(
    //   res => {
    //     console.log(res);

    //     this.loginDisabled = false;
    //     AppConfig.settings.ip = this.inputIp;
    //     AppConfig.settings.port = this.inputPort;
    //     AppConfig.settings.rootUrl = AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;

    //     this.myDBService.saveSettingsData();
    //     // this.navCtrl.navigateBack("");
    //     if (AppConfig.env == "dev") {
    //       this.navCtrl.navigateForward("/tabs/tab1");
    //     } else {
    //       location.href = AppConfig.settings.rootUrl + "/foofly/index.html#/tabs/tab1";
    //     }

    //   },
    //   error => {
    //     console.log('%c 请求处理失败 %c', 'color:red', 'err', error);

    //   }
    // );

  }

  async initLoading() {
    this.loading = await this.loadingController.create({
      duration: this.loadingDuration,
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    // return await this.loading.present();
  }

  async logIn() {

    await this.initLoading();
    await this.loading.present();

    AppConfig.settings.ip = this.inputIp;
    AppConfig.settings.port = this.inputPort;
    AppConfig.settings.rootUrl = AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;

    this.myDBService.saveSettingsData();
  
    this.loginDisabled = true;
    let url = AppConfig.settings.protocol + "//" + this.inputIp + ":" + this.inputPort;
    // var wsurl = AppConfig.global.ws_schema + this.inputIp + ":" + this.inputPort + "/wsjsonrpc?password=" + this.inputPassword; 

    this.testConn(url);
  }


  getIp(ip: any) {
    this.inputIp = ip.value;
  }

  getPort(port: any) {
    this.inputPort = port.value;
  }

  getPassword(password: any) {
    this.inputPassword = password.value;
  }

  async testConn(url: string) {

    url = url + AppConfig.urlRoot + "assets/version.js"
    var script = document.createElement('script');
    script.setAttribute("id","testConnScript");
    script.onload = function(e){
        document.getElementById("testConnScript").remove();
        let checkbox = document.getElementById("connCheckbox");
        checkbox.setAttribute("conn","true");
        var btn:any = checkbox.shadowRoot.lastElementChild;
        btn.click();
    }
    // script.addEventListener('load',this.scriptLoaded,false);
    script.onerror = function(){
      document.getElementById("testConnScript").remove();
      let checkbox = document.getElementById("connCheckbox");
      checkbox.setAttribute("conn","false");
      var btn:any = checkbox.shadowRoot.lastElementChild;
      btn.click();   
    }
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);

    // this.myHttpService.CallFoo(url).then(
    // this.myHttpService.http.get(url).subscribe(
    //   this.myHttpService.http.jsonp(url,'callback').subscribe(
    //   res => {
    //     console.log(res);
    //     this.loginDisabled = false;
    //     this.loading.dismiss();
    //     AppConfig.settings.ip = this.inputIp;
    //     AppConfig.settings.port = this.inputPort;
    //     AppConfig.settings.rootUrl = AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;

    //     this.myDBService.saveSettingsData();
    //     // this.navCtrl.navigateBack("");
    //     if (AppConfig.env == "dev") {
    //       this.navCtrl.navigateForward("/tabs/tab1");
    //     } else {
    //       location.href = AppConfig.settings.rootUrl + "/foofly/index.html#/tabs/tab1";
    //     }
    //   },
    //   error => {
    //     console.log('%c 请求处理失败 %c', 'color:red', 'err', error);
    //     this.loginDisabled = false;
    //     this.loading.dismiss();
    //   }
    // );


  }

  connChanged(event:any){
    var result = event.srcElement.getAttribute("conn");
    // console.log("result="+result);
    this.loginDisabled = false;
    if(this.loading != null)  this.loading.dismiss();

    if(result == "true") {
      //foobar is living
      if (AppConfig.env == "dev") {
        this.navCtrl.navigateForward("/tabs/tab1");
      } else {
        location.href = AppConfig.settings.rootUrl + "/foofly/index.html#/tabs/tab1";
      }
    }else{
      //foobar is closed
      this.presentConnError();
    }

  }

  async presentConnError() {
    var message;
    await this.translateService.get("message").subscribe(res => {
      message = res;
    })
    const alert = await this.alertController.create({
      header: message.error,
      subHeader: message['err-conn-fail'],
      message: message['err-conn-fail-msg'],
      buttons: [message.ok]
    });

    alert.onDidDismiss().then(res => {
      this.loginDisabled = false;
    });

    await alert.present();
  }
}

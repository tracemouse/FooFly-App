import { Component, OnInit } from '@angular/core';
import { NavController,AlertController,LoadingController  } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService }from "@ngx-translate/core";
// import { timeout } from 'rxjs/operators';

import { AppConfig } from '../app.config';
import { MyDBService}  from "../my-db.service";
import { WebsocketService} from "../websocket.service"; 

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

  public from:string;

  loading:any;
  // loadingDuration = AppConfig.settings.timeout * 60 * 1000;
  loadingDuration = 60 * 1000;

  bandIps = ["localhost","musicbeefly.tracemouse.top","musicbee-fly.tracemouse.top","musicbee.tracemouse.top"];

  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public alertController: AlertController,
              public myDBService: MyDBService,
              public activeRoute: ActivatedRoute,
              public loadingController: LoadingController,
              public wsService: WebsocketService) 
  {
    this.activeRoute.queryParams.subscribe((params: Params) => {
      this.from = params['from'];
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    //console.log("login enter");
 
    this.inputIp = AppConfig.settings.ip;
    this.inputPort = AppConfig.settings.port;
    this.inputPassword = AppConfig.settings.password;

    if(this.bandIps.indexOf(this.inputIp) >= 0){
      this.inputIp = "";
      this.inputPort = "";
    }

    // console.log(this.from);
    if("exit" == this.from){
      return;
    }

    var mydata = {"action":"getMB"};
    this.wsService.callMB(mydata,null,true)
    .subscribe(
      res => {
        // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
        // console.log(res);
        this.loginDisabled = false;
        if(!res.isSucc){
          return;
        }
        AppConfig.settings.ip = this.inputIp;
        AppConfig.settings.port = this.inputPort;
        AppConfig.settings.rootUrl = AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;
        AppConfig.settings.versionPlugin = res.pluginVersion;

        this.myDBService.saveSettingsData();
        // this.navCtrl.navigateBack("");
        this.navCtrl.navigateForward("/tabs/tab1");
        
      },error => {
        console.log('%c 请求处理失败 %c', 'color:red', 'err', error);
      }
      ); 
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

    this.loginDisabled = true;
    // var url = AppConfig.settings.protocol + "//" + this.inputIp + ":" + this.inputPort;
    var wsurl = AppConfig.global.ws_schema + this.inputIp + ":" + this.inputPort + "/wsjsonrpc?password=" + this.inputPassword; 

    this.testMB(wsurl);
  }


  getIp(ip:any){
    this.inputIp = ip.value;
  }

  getPort(port:any){
    this.inputPort = port.value;
  }

  getPassword(password:any){
    this.inputPassword = password.value;
  }

  async testMB(url:string){
    
    var mydata = {"action":"getMB"};
    this.wsService.callMB(mydata,url,true)
    .subscribe(
      res => {
        // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
        // console.log(res);
        this.loginDisabled = false;
        this.loading.dismiss();
        if(!res.isSucc){
          return;
        }
        AppConfig.settings.ip = this.inputIp;
        AppConfig.settings.port = this.inputPort;
        AppConfig.settings.password = this.inputPassword;
        AppConfig.settings.rootUrl = AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;
        AppConfig.settings.versionPlugin = res.pluginVersion;
        this.myDBService.saveSettingsData();
        // this.navCtrl.navigateBack("");
        // this.navCtrl.pop();
        this.navCtrl.navigateForward("/tabs/tab1");
        
      },error => {
        console.log('%c 请求处理失败 %c', 'color:red', 'url', url, 'err', error);
        this.loading.dismiss();
        this.presentConnError();
      }
      ); 
  }

  async presentConnError() {
    var message;
    await this.translateService.get("message").subscribe(res=>{
      message = res;
    })
    const alert = await this.alertController.create({
      header: message.error,
      subHeader: message['err-conn-fail'],
      message: message['err-conn-fail-msg'],
      buttons: [message.ok]
    });

    alert.onDidDismiss().then(res=>{
      this.loginDisabled = false;
     });

    await alert.present();
  }
}

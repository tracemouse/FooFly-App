import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams,AlertController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
import { TranslateService }from "@ngx-translate/core";
// import { timeout } from 'rxjs/operators';

import { AppConfig } from '../app.config';
// import { WebsocketService} from "../websocket.service"; 

@Component({
  selector: 'app-setting',
  templateUrl: './setting.page.html',
  styleUrls: ['./setting.page.scss'],
})
export class SettingPage implements OnInit {
  
  @Input() url: string;
  @Input() interval: string;

  inputInterval = AppConfig.settings.interval;
  inputIp = AppConfig.settings.ip;
  inputPort = AppConfig.settings.port;
  inputPassword = AppConfig.settings.password;
  loginDisabled = false;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              // public http:HttpClient,
              // public wsService: WebsocketService,
              public alertController: AlertController,
              public translateService: TranslateService) 
  { 
    navParams.get('url');
    navParams.get('interval');
  }

  ngOnInit() {
    // console.log(this.tracks);
 
  }

  ionViewWillEnter(){
    this.inputInterval = AppConfig.settings.interval;
    this.inputIp = AppConfig.settings.ip;
    this.inputPort = AppConfig.settings.port;
    this.inputPassword = AppConfig.settings.password;
    this.loginDisabled = false;
  }

  cancel() {
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'save': false
    });
  }

  async save() {

    if(!this.inputInterval || this.inputInterval < 100 || this.inputInterval > 5000){
      this.inputInterval = (this.inputInterval < 100)?100:this.inputInterval;
      this.inputInterval = (this.inputInterval > 5000)?5000:this.inputInterval;
      return;
    }

    AppConfig.settings.interval = this.inputInterval;

    this.modalController.dismiss({
      // result: 'modal_cancel'
      'save': true,
      'url': AppConfig.settings.rootUrl,
      'interval': this.inputInterval
    });

    // this.loginDisabled = true;
    // var url = AppConfig.settings.protocol + "//" + this.inputIp + ":" + this.inputPort;
    // var wsurl = "ws://" + this.inputIp + ":" + this.inputPort + "/wsjsonrpc"; 
    // var wsurl = AppConfig.global.ws_schema + this.inputIp + ":" + this.inputPort + "/wsjsonrpc?password=" + this.inputPassword; 

    // this.testMB(wsurl);
  }

  getIp(ip:any){
    this.inputIp = ip.value;
  }

  getPort(port:any){
    this.inputPort = port.value;
  }

  getInterval(interval:any){
    this.inputInterval = interval.value;
  }

  getPassword(password:any){
    this.inputPassword = password.value;
  }
  
  // async testMB(url:string){

  //   var mydata = {"action":"getMB"};
  //   this.wsService.callMB(mydata,url,true)
  //   .subscribe(
  //     res => {
  //       // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
  //       // console.log(res);
  //       this.loginDisabled = false;
  //       if(!res.isSucc){
  //         return;
  //       }

  //       AppConfig.settings.ip = this.inputIp;
  //       AppConfig.settings.port = this.inputPort;
  //       AppConfig.settings.interval = this.inputInterval;
  //       AppConfig.settings.rootUrl = AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;
  //       AppConfig.settings.versionPlugin = res.pluginVersion;
  //       this.modalController.dismiss({
  //         // result: 'modal_cancel'
  //         'save': true,
  //         'url': AppConfig.settings.rootUrl,
  //         'interval': this.inputInterval
  //       });
  //     },error => {
  //       console.log('%c 请求处理失败 %c', 'color:red', 'url', url, 'err', error);
  //       this.presentConnError();
  //     }
  //     ); 
  // }
 

  // async presentConnError() {
  //   var message;
  //   await this.translateService.get("message").subscribe(res=>{
  //     message = res;
  //   })
  //   const alert = await this.alertController.create({
  //     header: message.error,
  //     subHeader: message['err-conn-fail'],
  //     message: message['err-conn-fail-msg'],
  //     buttons: [message.ok]
  //   });

  //   alert.onDidDismiss().then(res=>{
  //     this.loginDisabled = false;
  //    });

  //   await alert.present();
  // }
}

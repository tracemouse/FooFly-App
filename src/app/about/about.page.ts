import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService }from "@ngx-translate/core";
import { AlertController,NavController  } from '@ionic/angular';

import { AppConfig} from "../app.config";

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  versionApp = AppConfig.version;
  versionPlugin = AppConfig.settings.versionPlugin;
  reading=false;
  
  message:any;

  officalSite = "musicbee-fly.tracemouse.top";

  constructor(public httpClient:HttpClient,
              public alertController: AlertController,
              public navController:NavController,
              public translateService: TranslateService) { }

  ngOnInit() {
    this.translateService.get("message").subscribe(res=>{
      this.message = res;
    })
  }

  ionViewDidEnter(){
    this.versionApp = AppConfig.version;
    this.versionPlugin = AppConfig.settings.versionPlugin;
  }

  async checkUpdate(){

    this.reading = true;
    var url = AppConfig.fooflyOffical + "version.json";
    this.httpClient.get(url).subscribe(
      (version:any) =>{
        this.reading = false;
        console.log(version);
        var versionApp = version.app;
        var versionPlugin = version.plugin;
        if(this.versionApp == versionApp){
          this.presentAlert(this.message.info,'',this.message['info-update-msg1'],this.message.ok);
          return;
        }else{
          this.presentAlert(this.message.info,'',this.message['info-update-msg5'],this.message.ok);
          return;
        }
      },
      error=>{
        this.reading = false;
        console.log("failed to get the json file from " + url);
        this.presentAlert(this.message.error,'',this.message['err-update-fail'],this.message.ok);
      }
    );
  }


  async presentAlert(header,subheader,message,button, action=null) {

    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: [button]
    });

    alert.onDidDismiss().then(res=>{
      if(action){
        action();
      }
    });

    await alert.present();
  }

  reload(){
    window.location.reload();
  }

  back(){
    this.navController.back();
  }
 
}

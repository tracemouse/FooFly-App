import { Component } from '@angular/core';
import { ModalController,ActionSheetController,NavController,PopoverController  } from '@ionic/angular';
import { TranslateService }from "@ngx-translate/core";

import { AppConfig} from "../app.config";
import { MyDBService}  from "../my-db.service";
// import { MyHttpService} from "../my-http.service";
import { WebsocketService} from "../websocket.service"; 

import { SettingPage } from "../model/setting.page";
import { Tab4PopoverPage } from "../model/tab4-popover.page";
import { ShutdownPage } from "../model/shutdown.page";

import { rightEnterAnimation } from "../modal-transitions";
import { rightLeaveAnimation } from "../modal-transitions";


@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {
  settings = AppConfig.settings;
  languages = AppConfig.languages;
  url = AppConfig.settings.rootUrl;
  interval = AppConfig.settings.interval;
  version = AppConfig.version;
  language = "en";
  animation = true;
  autoDJ = false;
  mute = false;
  volume = 0;
  mbLoaded = false;
  muteIcon = "volume-high";
  showTrackSeq = false;

  constructor(private translateService: TranslateService,
              private myDBService: MyDBService,
              public modalController: ModalController,
              public actionSheetController:ActionSheetController,
              public popoverController:PopoverController,
              // public myHttpService: MyHttpService,
              public wsService: WebsocketService,
              public navCtrl: NavController) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ionViewWillEnter(){

    this.url = AppConfig.settings.rootUrl;
    this.interval = AppConfig.settings.interval;
    this.language = AppConfig.settings.language;
    this.animation = (AppConfig.settings.animation == "true")?true:false;
    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;
    // console.log("tab4=" + JSON.stringify(AppConfig.settings));

    var mydata = {"action":"getNowPlaying"};
    this.wsService.callMB(mydata).subscribe(
      (data:any) =>{
          // console.log(data);
          if(!data.isSucc){
            return;
          }
          this.autoDJ = data.autoDjEnabled;
          this.mute = data.mute;
          this.volume = data.volume;
          this.mbLoaded = true;
      }
    );

  }

  ionViewWillLeave(){
   this.myDBService.saveSettingsData();
  }


  async setLanguage(event:any){
    // console.log(this.language);
    // console.log(event.target.value);
    var language = event.target.value;
    if(language == AppConfig.settings.language){
      return;
    }
    AppConfig.settings.language = language;
    this.myDBService.saveSettingsData();
    this.translateService.use(language);
  }

  async setConnection(){
    this.myDBService.saveSettingsData();
    const modal = await this.modalController.create({
      component: SettingPage,
      enterAnimation: rightEnterAnimation,
      leaveAnimation: rightLeaveAnimation,
      componentProps: {
        'url':this.url,
        'interval': this.interval,

      }
    });
    modal.onDidDismiss().then(res=>{
      if(res.data.save){
        this.url = AppConfig.settings.rootUrl;
        this.interval = AppConfig.settings.interval;
        // AppConfig.settings.rootUrl = this.url;
        // AppConfig.settings.interval = this.interval;
        this.myDBService.saveSettingsData();
        this.wsService.closeWSPlaying();
      }
     });
    await modal.present();
    return;
  }

  async more(ev:any){

    const popover = await this.popoverController.create({
      component: Tab4PopoverPage,
      event: ev,
      translucent: false
    });
    return await popover.present();

    // const modalShutdown = await this.modalController.create({
    //   component: ShutdownPage,
    //   backdropDismiss: false,
    //   enterAnimation: popEnterAnimation,
    //   leaveAnimation: popLeaveAnimation
    // });
    // await modalShutdown.present();
    // return;
  }

  // async more() {
  //   var more = "";
  //   var closescreen="";
  //   var shutdown30 = "";
  //   var shutdown60 = "";
  //   var shutdown0 = "";
  //   await this.translateService.get("tab4").subscribe(value=>{
  //     more = value.more;
  //     closescreen = value.closescreen;
  //     shutdown0 = value.shutdown0;
  //     shutdown30 = value.shutdown30;
  //     shutdown60 = value.shutdown60;
  //   });

  //   const actionSheet = await this.actionSheetController.create({
  //     header: more,
  //     buttons: [{
  //       text: closescreen,
  //       icon: '',
  //       handler: () => {
  //         this.closeScreen();
  //       }
  //     }, {
  //       text: shutdown0,
  //       icon: '',
  //       handler: () => {
  //         this.shutdown(0);
  //       }
  //     },{
  //       text: shutdown30,
  //       icon: '',
  //       handler: () => {
  //         this.shutdown(30);
  //       }
  //     }, {
  //       text: shutdown60,
  //       icon: '',
  //       handler: () => {
  //         this.shutdown(60);
  //       }
  //     }, {
  //       text: 'Cancel',
  //       icon: '',
  //       role: 'cancel',
  //       handler: () => {
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  setAnimation(event:any){
    AppConfig.settings.animation = (this.animation)?"true":"false";
    this.myDBService.saveSettingsData();
  }

  setAutoDJ(event:any){
    if(!this.mbLoaded){
      return;
    }
    var action = (this.autoDJ)?"startAutoDj":"endAutoDj";
    var mydata = {"action":action};
    this.wsService.callMB(mydata).subscribe(
      data=>{
        // console.log(data);
        if(!data.isSucc){
          return;
        }
      }
    ); 
  }
  
  setShowTrackSeq(event){
    AppConfig.settings.showTrackSeq = (this.showTrackSeq)?"true":"false";
    this.myDBService.saveSettingsData();
  }

  setMute(event:any){
    if(!this.mbLoaded){
      return;
    }
    this.mute = (this.mute)?false:true;
    this.muteIcon = (!this.mute)?"volume-high":"volume-off";
    var mydata = {"action":"setMute","mute":this.mute};
    this.wsService.callMB(mydata).subscribe(
      data=>{
        // console.log(data);
        if(!data.isSucc){
          return;
        }
      }
    ); 
  }

  setVolume(event){
    if(!this.mbLoaded){
      return;
    }
    var mydata = {"action":"setVolume","volume":this.volume};
    this.wsService.callMB(mydata).subscribe(
      data=>{
        // console.log(data);
        if(!data.isSucc){
          return;
        }
      }
    ); 
  }

  exit(){
    this.wsService.closeWSPlaying();
    this.navCtrl.navigateForward(["/login"],{
      queryParams:{
        from:'exit'
      }
    });
  }
}



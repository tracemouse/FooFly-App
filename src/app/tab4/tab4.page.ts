import { Component } from '@angular/core';
import { ModalController, ActionSheetController, NavController, PopoverController } from '@ionic/angular';
import { TranslateService } from "@ngx-translate/core";

import { AppConfig } from "../app.config";
import { MyDBService } from "../my-db.service";
import { MyHttpService } from "../my-http.service";
// import { WebsocketService} from "../websocket.service"; 

import { SettingPage } from "../model/setting.page";
import { Tab4PopoverPage } from "../model/tab4-popover.page";
// import { ShutdownPage } from "../model/shutdown.page";

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
  albumartFromF2K = false;
  playlists: any = [];
  musicLib = "";


  constructor(private translateService: TranslateService,
    private myDBService: MyDBService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    public popoverController: PopoverController,
    public myHttpService: MyHttpService,
    public navCtrl: NavController) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ionViewWillEnter() {

    this.url = AppConfig.settings.rootUrl;
    this.interval = AppConfig.settings.interval;
    this.language = AppConfig.settings.language;
    this.musicLib = AppConfig.settings.musicLib;
    this.animation = (AppConfig.settings.animation == "true") ? true : false;
    this.showTrackSeq = (AppConfig.settings.showTrackSeq == "true") ? true : false;
    this.albumartFromF2K = (AppConfig.settings.albumartFromF2K == "true") ? true : false;
    // console.log("tab4=" + JSON.stringify(AppConfig.settings));

    this.myHttpService.GetState().then(
      (data: any) => {
        // console.log(data);
        this.volume = data.volume;
        this.mbLoaded = true;
        this.playlists = data.playlists;
        if (AppConfig.settings.musicLib == "") {
          this.musicLib = data.playlists[0].name;
          AppConfig.settings.musicLib = this.musicLib;
          this.myDBService.saveSettingsData();
        }
      }
    );

  }

  ionViewWillLeave() {
    this.myDBService.saveSettingsData();
  }


  async setLanguage(event: any) {
    // console.log(this.language);
    // console.log(event.target.value);
    let language = event.target.value;
    if (language == AppConfig.settings.language) {
      return;
    }
    AppConfig.settings.language = language;
    this.myDBService.saveSettingsData();
    this.translateService.use(language);
  }

  async setMusicLib(event: any) {
    // console.log(this.language);
    // console.log(event.target.value);
    let musicLib = event.target.value;
    if (musicLib == AppConfig.settings.musicLib) {
      return;
    }
    AppConfig.settings.musicLib = musicLib;
    this.myDBService.saveSettingsData();
  }

  async setConnection() {
    this.myDBService.saveSettingsData();
    const modal = await this.modalController.create({
      component: SettingPage,
      enterAnimation: rightEnterAnimation,
      leaveAnimation: rightLeaveAnimation,
      componentProps: {
        'url': this.url,
        'interval': this.interval,

      }
    });
    modal.onDidDismiss().then(res => {
      if (res.data.save) {
        this.url = AppConfig.settings.rootUrl;
        this.interval = AppConfig.settings.interval;
        // AppConfig.settings.rootUrl = this.url;
        // AppConfig.settings.interval = this.interval;
        this.myDBService.saveSettingsData();
      }
    });
    await modal.present();
    return;
  }

  async more(ev: any) {

    const popover = await this.popoverController.create({
      component: Tab4PopoverPage,
      event: ev,
      translucent: false
    });
    return await popover.present();

  }

  setAnimation(event: any) {
    AppConfig.settings.animation = (this.animation) ? "true" : "false";
    this.myDBService.saveSettingsData();
  }

  setShowTrackSeq(event) {
    AppConfig.settings.showTrackSeq = (this.showTrackSeq) ? "true" : "false";
    this.myDBService.saveSettingsData();
  }

  setAlbumartFromF2K(event) {
    AppConfig.settings.albumartFromF2K = (this.albumartFromF2K) ? "true" : "false";
    this.myDBService.saveSettingsData();
  }

  setMute(event: any) {
    if (!this.mbLoaded) {
      return;
    }
    this.mute = (this.mute) ? false : true;
    this.muteIcon = (!this.mute) ? "volume-high" : "volume-off";

    // if (this.mute) {
    //   this.myHttpService.SetVolume("0");
    // } else {
    //   this.myHttpService.SetVolume(this.volume);
    // }

    this.myHttpService.SetMute();

  }

  setVolume(event) {
    if (!this.mbLoaded) {
      return;
    }

    this.myHttpService.SetVolume(this.volume);

  }

  exit() {

    this.navCtrl.navigateForward(["/login"], {
      queryParams: {
        from: 'exit'
      }
    });
  }
}



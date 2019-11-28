import { Component } from '@angular/core';
import { ModalController,NavController,LoadingController} from '@ionic/angular';
import { TranslateService }from "@ngx-translate/core";

import { AppConfig } from '../app.config';
import { MyHttpService} from "../my-http.service";
// import { WebsocketService} from "../websocket.service"; 
import { TracklistPage } from "../model/tracklist.page";

import { rightEnterAnimation } from "../modal-transitions";
import { rightLeaveAnimation } from "../modal-transitions";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  i18n:any;
  // loadingDuration = 3 * 1000;
  loadingDuration = AppConfig.settings.timeout * 60 * 1000;
  loading:any;

  public playlists = [];

  constructor(
              public myHttpService: MyHttpService,
              public translateService:TranslateService,
              public modalController: ModalController,
              public navCtrl: NavController,
              public loadingController: LoadingController) {

  }


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.myHttpService.GetState().then(
      data=>{
        // console.log(data);
        this.pushData(data);
      }
    );
  }

  pushData(data:any){
    this.playlists = data.playlists;
  }

  ionViewWillEnter(){
  }

  ionViewWillLeave(){
    if(this.loading != null)
      this.loading.dismiss();
  }

  ngOnDestroy(){
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.loading != null)
      this.loading.dismiss();
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

  async showTracks(idx:any) {
    // await this.initLoading();
    // await this.loading.present();

    // console.log(item);
    // var mydata = {"action":"playlistTracklist","playlistUrl":item.playlistUrl};
    // this.wsService.callMB(mydata).subscribe(
    //   data=>{
    //     this.loading.dismiss();
    //     // console.log(data);
    //     if(!data.isSucc){
    //       return;
    //     }
    //     this.showTracksPage(data,item);
    //   }
    // );

    this.myHttpService.SwithPlaylist(idx).then(
      (data:any) => {
        this.playlists[idx]['albumArt'] = data.albumArt;
        let len = data.playlist.length;
        for(let i=0; i<len;i++){
          data.playlist[i]['idx'] = i;
        }
        let totalTracks = data.playlists[idx].count;
        let totalPages = Math.ceil(totalTracks / parseInt(data.playlistItemsPerPage));
        this.showTracksPage(data.playlist,this.playlists[idx],idx,totalTracks,totalPages);
      }
    );
  }

  async showTracksPage(tracks: any, item:any, idx:any,totalTracks:any,totalPages:any) {
    this.translateService.get("tab3").subscribe(res=>{
      this.i18n = res;
    });
    let headerTitle = this.i18n['header'];
    var input = {
      'from' : 'tab3',
      'title': item.name,
      'headerTitle':headerTitle,
      'fileUrl': item.albumArt,
      'tracks': tracks,
      'playlistIdx': idx,
      'totalTracks': totalTracks,
      'totalPages': totalPages,
      'type': 'playlist'
    };

    const modal = await this.modalController.create({
      component: TracklistPage,
      enterAnimation: rightEnterAnimation,
      leaveAnimation: rightLeaveAnimation,
      componentProps: {
        'input': input
      }
    });

    modal.onDidDismiss().then(res=>{
      if(res.data.hasError){
        this.navCtrl.navigateBack("/login");
      }
     });

    return await modal.present();
  }

  async doRefresh(event:any){
    // setTimeout(() => {
    //   // console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
    await this.initLoading();
    await this.loading.present();

    this.myHttpService.GetState().then(
      data=>{
        // console.log(data);
        this.pushData(data);
        event.target.complete();
        this.loading.dismiss();
      }
    );
  }

  handleSbInput(event:any) {
    const query = event.target.value.toLowerCase();
    requestAnimationFrame(() => {
      var items:any;
      items = Array.from(document.querySelector('#il-playlist').children);
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  refresh(){
    this.myHttpService.GetState().then(
      data=>{
        // console.log(data);
        this.pushData(data);
      }
    );
  }

  async sbKeyup(event:any){
    if(event.key != "Enter"){
      return;
    }

    event.target.blur();
  }
}

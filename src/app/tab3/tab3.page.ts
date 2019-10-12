import { Component } from '@angular/core';
import { ModalController,NavController,LoadingController} from '@ionic/angular';

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

  // loadingDuration = 3 * 1000;
  loadingDuration = AppConfig.settings.timeout * 60 * 1000;
  loading:any;

  public playlists = [];

  constructor(
              public myHttpService: MyHttpService,
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

  async showTracks(item:any) {
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

    this.myHttpService.SwithPlaylist(item).then(
      (data:any) => {
        this.playlists[item]['albumArt'] = data.albumArt;
        this.showTracksPage(data.playlist,this.playlists[item]);
      }
    );
  }

  async showTracksPage(tracks: any, item:any) {
    const modal = await this.modalController.create({
      component: TracklistPage,
      enterAnimation: rightEnterAnimation,
      leaveAnimation: rightLeaveAnimation,
      componentProps: {
        'title':item.name,
        'fileUrl': item.albumArt,
        'tracks': tracks
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

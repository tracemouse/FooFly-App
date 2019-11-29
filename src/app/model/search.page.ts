import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { MyDBService}  from "../my-db.service";
import { MyHttpService} from "../my-http.service";
import { AppConfig } from '../app.config';

import { TrackActionPage } from "./track-action.page";

import { playlistEnterAnimation } from "../modal-transitions";
import { playlistLeaveAnimation } from "../modal-transitions";

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  
  @Input() input:any;
  
  playlistIdx: any;
  allTracks:any = [];
  tracks: any = [];
  title: string = "";
  coverImg = "assets/img/cover.jpg";

  searchInput = "";
  playFileUrl = "";

  showTrackSeq = false;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public myHttpService: MyHttpService,
              public myDBService: MyDBService) 
  { 
    navParams.get('input'); 
  }

  ngOnInit() {
    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;
    this.allTracks = this.input.tracks;
    this.playlistIdx = this.input.playlistIdx;

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    AppConfig.global.scrollHeight = document.body.scrollHeight;
    // console.log(AppConfig.global.scrollHeight);

    //监听软键盘弹出

    window.addEventListener('native.keyboardshow', function (e:any) {
 
      // alert("keyboard show");

      if(!AppConfig.global.isAndroid){
        return;
      }

      let ionModal = document.getElementsByTagName("ion-modal")[0];
      // let offset = e.keyboardHeight;
      let offset = 0;
      ionModal.style.top = "-" + offset + "px";
    });

    //监听软键盘关闭

    window.addEventListener('native.keyboardhide', function (e) {
 
      if(!AppConfig.global.isAndroid){
        return;
      }
  
      let ionModal = document.getElementsByTagName("ion-modal")[0];
      let offset = 0;
      ionModal.style.top = offset + "px";

    });

  }

  async search(event:any){
    if(event.key != "Enter"){
      return;
    }

    event.target.blur();

    const query = event.target.value.toLowerCase().trim();
    // const searchCard = document.getElementById('search-card');
    this.title= query;
    this.tracks = [];
    if(query.length == ""){
      // searchCard.style.visibility = "hidden";
      return;
    }else{
      // searchCard.style.visibility = "visible";
    }

    this.allTracks.forEach( (track:any) =>{
      if (
          (track.track.indexOf(query) > -1) ||
          (track.artist.indexOf(query) > -1 )  ||
          (track.album.indexOf(query) > -1)
        ) 
      {
        let fileUrl = track.fileUrl;
        let index = fileUrl.lastIndexOf(".");
        track['audioType'] = fileUrl.substr(index + 1).toUpperCase();
        track['isPlaying'] = false;
        this.tracks.push(track);
      }
    });
  }

  cancel(error:any) {
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  playTrack(track:any, idx:any) {
    this.tracks[idx].isPlaying = true;
    this.myHttpService.fooflyPlayTrack(track);
  }

  playTracks(){
    this.myHttpService.fooflyPlayTracks(this.tracks);
    this.cancel(false);
  }

  async trackAction(track:any, idx:any){
    event.preventDefault(); 
    event.stopPropagation();
    
    let input = {
      'track':track
    };
    const modal = await this.modalController.create({
      component: TrackActionPage,
      backdropDismiss: true,
      enterAnimation: playlistEnterAnimation,
      leaveAnimation: playlistLeaveAnimation,
      componentProps: {
        'input':input
      }
    });

    return await modal.present();
  }
}

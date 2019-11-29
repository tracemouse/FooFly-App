import { Component, OnInit, Input,ViewChild,ElementRef, ComponentFactoryResolver  } from '@angular/core';
import { ModalController, NavParams,IonInfiniteScroll  } from '@ionic/angular';

import { AppConfig} from "../app.config";
import { MyHttpService} from "../my-http.service";
import { TrackActionPage } from "./track-action.page";

import { playlistEnterAnimation } from "../modal-transitions";
import { playlistLeaveAnimation } from "../modal-transitions";

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.page.html',
  styleUrls: ['./tracklist.page.scss'],
})
export class TracklistPage implements OnInit {
  @ViewChild('IonInfiniteScroll',{read: ElementRef, static:false}) infiniteScroll: ElementRef;

  @Input() input:any;
  tracks: any = [];
  title: string;
  fileUrl: string;
  playlistIdx: any;
  showTracks: any = [];
  defaultImg = "assets/img/cover.jpg";
  folderImg = "assets/img/folder.jpg";
  albumImg = "assets/img/album.jpg";
  artistImg = "assets/img/artist.jpg";
  playlistImg = "assets/img/playlist.jpg";
  coverImg :string;
  playFileUrl = "";
  showTrackSeq = false;
  totalTracks = 0;

  page = 1;
  totalPages = 1;
  headerTitle = "";

  isPlayingIdx = null;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public myHttpService: MyHttpService) 
  { 
    navParams.get('input'); 
  }

  ngOnInit() {

    this.playlistIdx = this.input.playlistIdx;
    this.fileUrl = this.input.fileUrl;
    this.tracks = this.input.tracks;
    this.title = this.input.title;
    this.totalTracks = this.input.totalTracks;
    this.totalPages = this.input.totalPages;
    this.headerTitle = this.input.headerTitle;

    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;

    this.showTracks = [...this.tracks];
    // console.log(this.tracks);

    let len = this.tracks.length;
    for(let i=0; i<len; i++){
      let fileUrl = this.tracks[i].fileUrl;
      let index = fileUrl.lastIndexOf(".");
      this.tracks[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
    }
    
    this.coverImg = this.defaultImg;

    switch(this.input.type){
      // case 'folder':
      //     this.coverImg = this.folderImg;
      //     break;
      // case 'album':
      //     this.coverImg = this.albumImg;
      //     break;
      // case 'artist':
      //     this.coverImg = this.artistImg;
      //     break;
      case 'playlist':
          this.coverImg = this.playlistImg;
          break;
      default:
          let imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
          imgUrl += "?fileUrl=" + encodeURIComponent(this.fileUrl);
          this.coverImg = imgUrl;
          break;
    }
  }

  pushImg(img:any){
    if(img != "data:image/jpeg;base64,")
      this.coverImg = img;
  }

  cancel(error:any) {
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  async playTrack(track:any,i:any) {
    if(this.isPlayingIdx != i) {
      if(this.isPlayingIdx != null){
        this.tracks[this.isPlayingIdx]["isPlaying"] = false;
      }
      this.tracks[i]["isPlaying"] = true;
      this.isPlayingIdx = i;
    }

    let idx = track.idx;
    if(this.input.type == "playlist"){
      this.playPlaylist(idx);
    }else{
      this.myHttpService.fooflyPlayTrack(track);
    }
  }

  async playPlaylist(idx:any){
    this.myHttpService.SwithPlaylist(this.playlistIdx).then(
      data =>{
        this.myHttpService.PlayTrack(idx);
        // this.cancel(false);
      }
    );
  }

  playTracks() {
    if(this.input.type == "playlist"){
      this.playPlaylist(0);
    }else{
      this.myHttpService.fooflyPlayTracks(this.tracks);
    }
    this.cancel(false);
  }

  handleSbInput(event:any) {
    // console.log(event);
    console.log("search input=" + event.target.value);
    const query = event.target.value.toLowerCase();
    requestAnimationFrame(() => {
      var items:any;
      items = Array.from(document.querySelector('#il-track-12345').children);
      console.log(items);
      console.log("len=" + items.length);
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        console.log(item.textContent);
        console.log(shouldShow);
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }

  handleSbInput1(event:any) {

    const query = event.target.value.toLowerCase();
    if(query.length == 0){
      this.infiniteScroll.nativeElement.disabled = false;
      this.showTracks = [...this.tracks];
      return;
    }
    
    this.infiniteScroll.nativeElement.disabled = true;
 
    this.showTracks = this.tracks.filter((item,index)=>{
      var str =  item.track + " " + item.audioType + " " + item.artist + " " + item.album;
      // console.log(str);
      if(str.toLowerCase().indexOf(query) > -1){
        return item;
      }
    });

  }

  async sbKeyup(event:any){
    if(event.key != "Enter"){
      return;
    }

    event.target.blur();
  }

  async loadMore(event:any){
    // if(this.input.from == "tab2"){
    if(this.page >= this.totalPages){
      event.target.complete();
      this.infiniteScroll.nativeElement.disabled = true;
      return;
    }

    this.page = this.page + 1;
    this.myHttpService.GoPage(this.page).then(
      (data:any)=>{
        let len = data.playlist.length;
        for(let i=0; i<len;i++){
          let fileUrl = data.playlist[i].fileUrl;
          let index = fileUrl.lastIndexOf(".");
          data.playlist[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
          data.playlist[i]['idx'] = i + (this.page - 1) * parseInt(data.playlistItemsPerPage);
        }
        this.tracks = this.tracks.concat(data.playlist);
        this.showTracks = [...this.tracks];
        event.target.complete();
      }
    )

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
      cssClass: "halfModal",
      componentProps: {
        'input':input
      }
    });

    return await modal.present();
  }
}

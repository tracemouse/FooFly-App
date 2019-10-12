import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { AppConfig} from "../app.config";
import { MyHttpService} from "../my-http.service";
// import { WebsocketService} from "../websocket.service"; 

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.page.html',
  styleUrls: ['./tracklist.page.scss'],
})
export class TracklistPage implements OnInit {
  
  @Input() tracks: any = [];
  @Input() title: string;
  @Input() fileUrl: string;

  showTracks: any = [];

  defaultImg = "assets/img/cover.jpg";
  coverImg :string;

  playFileUrl = "";

  showTrackSeq = false;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public myHttpService: MyHttpService) 
  { 
    navParams.get('title');
    navParams.get('fileUrl');
    navParams.get('tracks');

  }

  ngOnInit() {

    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;

    this.showTracks = [...this.tracks];
    // console.log(this.tracks);

    let len = this.tracks.length;
    for(let i=0; i<len; i++){
      let fileUrl = this.tracks[i].fileUrl;
      let index = fileUrl.lastIndexOf(".");
      this.tracks[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
    }
    
    // console.log(this.tracks);
    this.coverImg = this.defaultImg;

    this.coverImg = this.fileUrl;

    // var mydata = {"action":"getLibArtwork", "fileUrl":this.fileUrl,"pushData":""};
    // this.wsService.callMB(mydata,null,true).subscribe(
    //   data=>{
    //       this.pushImg(data.img);
    //   },
    //   err=>{
    //     this.cancel(true);
    //   }
    // );

    // var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
    // imgUrl += "?fileUrl=" + encodeURI(this.fileUrl);
    // this.coverImg = imgUrl;


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

  playTrack(idx:any) {
    this.myHttpService.PlayTrack(idx);
  }

  playTracks() {
    this.myHttpService.PlayTrack(0);
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
      this.showTracks = [...this.tracks];
      return;
    }
    
    this.showTracks = this.tracks.filter((item,index)=>{
      var str = (index + 1) + item.trackTitle + item.audioType + item.artist + item.album + item.sampleRate;
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
}

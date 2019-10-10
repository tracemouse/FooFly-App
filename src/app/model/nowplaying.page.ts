import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

// import { MyHttpService} from "../my-http.service";
import { AppConfig} from "../app.config";
import { WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-nowplaying',
  templateUrl: './nowplaying.page.html',
  styleUrls: ['./nowplaying.page.scss'],
})
export class NowplayingPage {
  
  nowTrack: any = {'trackTitle':'','artist':'','sampleRate':'44.1 KHz','album':'','fileUrl':''};
  nowIdx = -1;
  nowFileUrl:any;
  title: string = "";
  audioType = "";
  playState = "6";
  duration=100;
  audiobar=0;
  rangerEnd = "10:00";
  playPostion = 0;
  shuffle = false;
  repeat = 0;

  coverImg = "assets/img/cover.jpg";

  playFileUrl = "";
  playNextFG = false;
  playPrevFG = false;
  playPauseFG = false;
  playPositionFG = false;
  repeatFG = false;
  shuffleFG = false;

  antimation = "true";

  interval:any;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              // public myHttpService: MyHttpService,
              public wsService: WebsocketService)
              
  { 

  }
 
  ionViewWillEnter(){


    this.getCoverImg();
    
    this.wsService.openWSPlaying();
    this.wsService.obPlaying.subscribe(
      data=>{
        // console.log(data);
        this.pushNowTrack(data);
      }
    );
  
    this.antimation = AppConfig.settings.animation;
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

 
  async getCoverImg(){
    // var mydata = {"action":"getLibArtwork", "fileUrl":this.tracks[0].fileUrl};
    // var mydata = {"action":"getArtwork"}
    // this.wsService.callMB(mydata,null,true).subscribe(
    //   data=>{
    //       // console.log(data);
    //       this.pushImg(data);
    //   },
    //   err=>{
    //     this.cancel(true);
    //   });
      var getTimestamp=new Date().getTime();
      var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork?" + getTimestamp;

      this.coverImg = imgUrl;
  }

  pushImg(img:any){
    this.coverImg = img;
  }

  pushNowTrack(data:any){
    this.playFileUrl = "";

    this.nowTrack = data.track;
    this.title = this.nowTrack.trackTitle;
    var index = this.nowTrack.fileUrl.lastIndexOf(".");
    this.audioType = (this.nowTrack.fileUrl.substr(index+1)).toUpperCase();
    this.playState = data.playState;

    var str = "00000" + this.nowTrack.duration.trim();
    this.rangerEnd = str.substring(str.length - 5);

    this.duration = data.duration;
    this.audiobar = data.playPosition;
    this.repeat = data.repeat;
    this.shuffle = data.shuffle;
    // console.log(this.duration);
    // console.log(this.audiobar);

    if(this.nowFileUrl != this.nowTrack.fileUrl){
      this.nowFileUrl = this.nowTrack.fileUrl;
      this.getCoverImg();
    }

  }

  cancel(error:any) {
    
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  setPlayPosition(event:any){
    this.playPostion = event.target.value;
    var mydata = {"action":"setPosition","position":this.playPostion};
    this.wsService.sendWSPlaying(mydata);

  }

  setShuffle(){
    this.shuffle = (this.shuffle)?false:true;
    var mydata = {"action":"setShuffle","shuffle":this.shuffle};
    this.wsService.sendWSPlaying(mydata);
  }

  setRepeat(){
    if(this.repeat == 0){
      this.repeat = 1;
    }else if(this.repeat == 1){
      this.repeat = 2;
    }else{
      this.repeat = 0;
    }

    var mydata = {"action":"setRepeat","repeat":this.repeat};
    this.wsService.sendWSPlaying(mydata);
  }

  playNext(){
    var mydata = {"action":"playNext"};
    this.wsService.sendWSPlaying(mydata);
  }

  playPrev(){
    var mydata = {"action":"playPrev"};
    this.wsService.sendWSPlaying(mydata);
  }

  playPause(){
    var mydata = {"action":"playPause"};
    this.wsService.sendWSPlaying(mydata);
  }
}

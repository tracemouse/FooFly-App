import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { MyHttpService} from "../my-http.service";
import { AppConfig} from "../app.config";
// import { WebsocketService} from "../websocket.service";

@Component({
  selector: 'app-nowplaying',
  templateUrl: './nowplaying.page.html',
  styleUrls: ['./nowplaying.page.scss'],
})
export class NowplayingPage {
  interval:any;

  nowTrack: any = {'trackTitle':'','artist':'','sampleRate':'44.1 KHz','album':'','fileUrl':''};
  nowIdx = -1;
  nowFileUrl:any;
  title: string = "";
  audioType = "-";
  sampleRate = "-";
  playState = "6";
  duration=100;
  audiobar=0;
  rangerEnd = "10:00";
  playPostion = 0;
  shuffle = false;
  repeat = 0;
  volume = "100";
  isMuted = "0";

  coverImg = "assets/img/cover.jpg";

  playFileUrl = "";
  playNextFG = false;
  playPrevFG = false;
  playPauseFG = false;
  playPositionFG = false;
  repeatFG = false;
  shuffleFG = false;

  antimation = "true";

  PlaybackOrder:any;
 

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public myHttpService: MyHttpService)
              
  { 
    this.PlaybackOrder = AppConfig.PlayBackOrder;
  }
 
  ionViewWillEnter(){
    // console.log("now enter");
    
    this.interval = setInterval(()=>{this.getState();},AppConfig.settings.interval);
  
    this.antimation = AppConfig.settings.animation;
  }

  private getState(){
    this.myHttpService.GetState().then(
      (data:any)=>{
        this.repeat = parseInt(data.playBackOrder);

        // console.log(data);
        if(data.currentTrack != "?"){
          this.nowTrack = data.playing;
          this.isMuted = data.isMuted;
          this.pushNowTrack(data);
        }else{
          this.title = "";
          this.audioType = "";
          this.nowTrack = {};
          this.playState = "0";
        }
      },
      (error)=>{
        clearInterval(this.interval);
      }
    );
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  pushNowTrack(data:any){
    // console.log(data);
    this.playFileUrl = "";

    this.nowTrack = data.playing;
    this.sampleRate = this.myHttpService.formatSampleRate(this.nowTrack.sampleRate);

    if(this.title != this.nowTrack.track){
      this.title = this.nowTrack.track;
      let message = data.playing.artist + "-" + data.playing.album;
      this.myHttpService.presentTrackToast(this.title,message);
    }

    // this.audioType = this.nowTrack.codec;
    let fileUrl = this.nowTrack.fileUrl;
    let index = fileUrl.lastIndexOf(".");
    this.audioType = fileUrl.substr(index+1).toUpperCase();
    this.playState = data.isPlaying;

    var str = "00000" + this.nowTrack.len.trim();
    this.rangerEnd = str.substring(str.length - 5);

    this.duration = data.tracklen;
    this.audiobar = data.trackpos;
    this.volume = data.volume;
    // this.repeat = data.repeat;
    // this.shuffle = data.shuffle;
    // console.log(this.duration);
    // console.log(this.audiobar);

    // this.coverImg = AppConfig.settings.rootUrl + data.albumArt;
    this.coverImg = this.myHttpService.GetArtworkUrl(this.nowTrack);
  }

  cancel(error:any) {
    clearInterval(this.interval);

    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  setPlayPosition(event:any){
    this.playPostion = event.target.value;
    // let perc = this.getPercent(this.playPostion, this.duration);

    // var mydata = {"action":"setPosition","position":this.playPostion};
    // this.myHttpService.SetPostion(perc);
    this.myHttpService.SetPostion(this.playPostion);

  }

  setRepeat(){
    if(this.repeat == 6){
      this.repeat = 0;
    }else{
      this.repeat = this.repeat + 1;
    }

    this.myHttpService.SetRepeat(this.repeat);
 
  }

  playNext(){
    this.myHttpService.PlayNext();
  }

  playPrev(){
    this.myHttpService.PlayPrev();
  }

  playPause(){
    this.myHttpService.PlayPause();
  }

  setVolume(){
    if(this.volume == '0'){
      let volume = localStorage.getItem("volume");
      if(!volume){
        volume = "100";
      }
      this.myHttpService.SetVolume(volume);
    }else{
      localStorage.setItem("volume",this.volume);
      this.myHttpService.SetVolume("0");
    }
  }

  setMute(){
    this.isMuted = (this.isMuted=="1")?"0":"1";
    this.myHttpService.SetMute();
  }

  getPercent(num, total) {
    /// <summary>
    /// 求百分比
    /// </summary>
    /// <param name="num">当前数</param>
    /// <param name="total">总数</param>
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return 0;
    }

    let per =  (total <= 0) ? 0: (Math.round(num / total * 10000) / 100.00);
    return Math.round(per);
    //return per / 100;
  }
}

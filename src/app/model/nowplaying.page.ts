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
  timeout:any;

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
              public myHttpService: MyHttpService)
              
  { 

  }
 
  ionViewWillEnter(){
    console.log("now enter");
    
    this.getState();
  
    this.antimation = AppConfig.settings.animation;
  }

  private getState(){
    this.myHttpService.GetState().then(
      (data:any)=>{
        // console.log(data);
        if(data.currentTrack != "?"){
          this.nowTrack = data.playing;
          this.pushNowTrack(data);
        }

        this.timeout = setTimeout(
          () => {
            this.getState();
          },
          AppConfig.settings.interval
        );
      }
    );
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  pushNowTrack(data:any){
    console.log(data);
    this.playFileUrl = "";

    this.nowTrack = data.playing;
    this.title = this.nowTrack.track;
    // var index = this.nowTrack.fileUrl.lastIndexOf(".");
    // this.audioType = (this.nowTrack.fileUrl.substr(index+1)).toUpperCase();
    this.playState = data.isPlaying;

    var str = "00000" + this.nowTrack.len.trim();
    this.rangerEnd = str.substring(str.length - 5);

    this.duration = data.tracklen;
    this.audiobar = data.trackpos;
    // this.repeat = data.repeat;
    // this.shuffle = data.shuffle;
    // console.log(this.duration);
    // console.log(this.audiobar);

    // if(this.nowFileUrl != this.nowTrack.fileUrl){
    //   this.nowFileUrl = this.nowTrack.fileUrl;
    //   this.getCoverImg();
    // }
    this.coverImg = data.albumArt;
  }

  cancel(error:any) {
    clearTimeout(this.timeout);

    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  setPlayPosition(event:any){
    this.playPostion = event.target.value;
    let perc = this.getPercent(this.playPostion, this.duration);
    console.log(perc);
    // var mydata = {"action":"setPosition","position":this.playPostion};
    this.myHttpService.SetPostion(perc);

  }

  setShuffle(){
    this.shuffle = (this.shuffle)?false:true;
    var mydata = {"action":"setShuffle","shuffle":this.shuffle};
 
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

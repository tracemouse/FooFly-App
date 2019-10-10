import { Component } from '@angular/core';
import { ModalController,NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import * as ProgressBar from "progressbar.js";

// import { AppConfig} from "../app.config";
// import { MyHttpService} from "../my-http.service";
import { NowplayingPage } from "../model/nowplaying.page";
import { WebsocketService} from "../websocket.service";
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
 
  tracks: any = [];
  nowTrack: any = {'trackTitle':'','artist':'','sampleRate':'','album':'','fileUrl':''};
  nowIdx = -1;
  nowFileUrl:any;
  title: string = "";
  audioType = "";
  playState = "6";
  coverImg = "assets/img/cover.jpg";
  playFileUrl = "";
  duration=100;
  audiobar=0;
  nav:any;

  indefinite = "0";

  showTrackSeq = false;

  progressbar:any;

  constructor(
              // public myHttpService: MyHttpService,
              public navCtrl: NavController,
              public modalController: ModalController,
              public wsService: WebsocketService,
              public router: Router,
              public activeRoute: ActivatedRoute) 
  { 

  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
   
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    let progressEles = document.getElementsByClassName("card-progress");

    for (let i = 0; i < progressEles.length; i++) {
      let id = progressEles[i].getAttribute("id");
      let e = document.getElementById(id);
      if (e.innerHTML.trim().length == 0) {
        this.progressbar = new ProgressBar.Line('#' + id, {
          color: '#ffce00',
          trailColor: '#eee',
          easing: 'easeInOut',
          strokeWidth: 1,
          trailWidth: 1
        });
      }
    }

    this.progressbar.set(0);

  }

  ionViewWillLeave(){
  //  console.log("tab1 will leave");
    // clearInterval(this.interval);
  }

  ngOnDestroy(){
  //  console.log("tab1 ngOnDestroy");
    // clearInterval(this.interval);
    // this.wsService.closeWSPlaying();
  }

  ionViewDidLoad(){
  //  console.log("tab1 did load");

  }

  async doRefresh(event){
    this.wsService.closeWSPlaying();
    this.wsService.wsPlaying = null;

    this.ionViewWillEnter();

    event.target.complete();
  }
  
  ionViewWillEnter(){
    // console.log("tab1 view will enter");
    // console.log(this.playingSvgantimate);

    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;

    this.nowFileUrl = "";

    var mydata = {"action":"getNowPlayingList"};
    this.wsService.callMB(mydata).subscribe(
      data=>{
        // console.log(data);
        if(!data.isSucc){
          return;
        }
        this.tracks = data;
        var len = this.tracks.length;
        for(var i=0; i<len; i++){
          var fileUrl = this.tracks[i].fileUrl;
          var index = fileUrl.lastIndexOf(".");
          this.tracks[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
        }
      }
    );

    this.wsService.openWSPlaying();
    this.wsService.obPlaying.subscribe(
      (data)=>{
        // console.log(data);
        this.pushNowTrack(data);
      }
    );
  }
 

  async getCoverImg(){
    // var mydata = {"action":"getLibArtwork", "fileUrl":this.tracks[0].fileUrl};
    // var mydata = {"action":"getArtwork"}

    // this.wsService.callMB(mydata).subscribe(
    //   data=>{
    //       // console.log(data);
    //       this.pushImg(data);
    //   }
    // );
    var getTimestamp=new Date().getTime();
    var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork?" + getTimestamp;
    this.coverImg = imgUrl;

  }

  pushImg(img:any){
    this.coverImg = img;
  }
  
  // async getNowplaying(){
  //   var mydata = {"action":"getNowPlaying"};
  //   var postStr = JSON.stringify(mydata);

  //   this.myHttpService.CallMusicBee(postStr).then(
  //     (data)=>{
  //         // console.log(data);
  //         this.pushNowTrack(data);
  //     }
  //   );
  //  }

  pushNowTrack(data:any){
    if(data.playState == "3"){
      this.playingAnimateStart();
    }else{
      this.playingAnimateStop();
    }

    this.duration = data.duration;
    this.audiobar = data.playPosition;

    let perc = this.getPercent(this.audiobar, this.duration);
    this.progressbar.set(perc);

    this.playFileUrl = "";

    this.nowTrack = data.track;
    this.title = this.nowTrack.trackTitle;
    var index = this.nowTrack.fileUrl.lastIndexOf(".");
    this.audioType = (this.nowTrack.fileUrl.substr(index+1)).toUpperCase();
    this.playState = data.playState;
    // console.log(this.nowTrack);
    var idx = -1;
    var len = this.tracks.length;
    for(var i=0; i < len; i++){
      if(this.tracks[i].fileUrl == this.nowTrack.fileUrl){
        idx = i;
        this.tracks[i]['isPlaying'] = true;
      }else{
        this.tracks[i]['isPlaying'] = false;
      }
    }

    if(idx == -1){
      var mydata = {"action":"getNowPlayingList"};
      this.wsService.callMB(mydata).subscribe(
        data=>{
          // console.log(data);
          this.tracks = data;
          var len = this.tracks.length;
          for(var i=0; i<len; i++){
            var fileUrl = this.tracks[i].fileUrl;
            var index = fileUrl.lastIndexOf(".");
            this.tracks[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
          }
        }
      );
      return;
    }

    if(this.nowFileUrl != this.nowTrack.fileUrl){
      this.nowFileUrl = this.nowTrack.fileUrl;

      this.getCoverImg();
    }

    if(this.nowIdx != idx){
      this.nowIdx = idx;
    }
    
    // console.log(idx);
  }

  async more() {

    // this.wsService.closeWSPlaying();
    // this.navCtrl.navigateForward("/playing");
    // this.router.navigateByUrl("/playing");
    // this.router.navigate(['/playing']);

    const modal = await this.modalController.create({
        component: NowplayingPage,
        componentProps: {
        }
    });

    modal.onDidDismiss().then(res=>{
      if(!res.data.hasError){
        this.wsService.openWSPlaying();
        this.wsService.obPlaying.subscribe(
          (data)=>{
            // console.log(data);
            this.pushNowTrack(data);
          }
        );
      }else{
        this.navCtrl.navigateForward("/login");
      }
    });
    
    await modal.present().then((event)=>{
 
      // console.log("modal on load");
      // var obj = document.getElementById("nowplaying-coverImg");
      // console.log(obj.offsetWidth);
      // obj.style.height = obj.offsetWidth + "px";
      // console.log(obj);
    });
    
    return;
  }

  playTrack(track:any) {
    this.playFileUrl = track.fileUrl;
    var mydata = {"action":"playNow","fileUrl":this.playFileUrl};
    this.wsService.sendWSPlaying(mydata);
  }

  playNext(event){
    event.preventDefault(); 
    event.stopPropagation();
    var mydata = {"action":"playNext"};
    this.wsService.sendWSPlaying(mydata);
  }

  playPrev(event){
    event.preventDefault(); 
    event.stopPropagation();
    var mydata = {"action":"playPrev"};
    this.wsService.sendWSPlaying(mydata);
  }

  playPause(event){
    event.preventDefault(); 
    event.stopPropagation();
    var mydata = {"action":"playPause"};
    this.wsService.sendWSPlaying(mydata);
  }

  playingAnimateStop(){
    var objs = document.getElementById("header-playing-button").getElementsByTagName("svg")[0].getElementsByTagName("animate");
    var repeatCount = objs[0].getAttribute("repeatCount");
    if(repeatCount == "1") return;

    var len = objs.length;
    for(var i=0; i<len; i++){
        objs[i].setAttribute("repeatCount","1");
    }
  }

  playingAnimateStart(){
 
    var objs = document.getElementById("header-playing-button").getElementsByTagName("svg")[0].getElementsByTagName("animate");
    var repeatCount = objs[0].getAttribute("repeatCount");
    if(repeatCount == "indefinite") return;

    var len = objs.length;
    for(var i=0; i<len; i++){
      objs[i].setAttribute("repeatCount","indefinite");
      }
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
    return per / 100;
  }

}

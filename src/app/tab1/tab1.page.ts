import { Component } from '@angular/core';
import { ModalController,NavController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

import * as ProgressBar from "progressbar.js";

// import { AppConfig} from "../app.config";
// import { MyHttpService} from "../my-http.service";
import { NowplayingPage } from "../model/nowplaying.page";
import { MyHttpService} from "../my-http.service"; 
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  timeout:any;
 
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
              public myHttpService: MyHttpService,
              public navCtrl: NavController,
              public modalController: ModalController,
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
    clearInterval(this.timeout);
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

    this.ionViewWillEnter();

    event.target.complete();
  }
  
  ionViewWillEnter(){
    // console.log("tab1 view will enter");
    // console.log(this.playingSvgantimate);

    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;

    this.nowFileUrl = "";

    this.myHttpService.FocusOnPlaying();
    this.getState();
    // this.myHttpService.GetState().then(
    //   (data:any)=>{
    //     // console.log(data);
    //     this.tracks = data.playlist;
    //     if(data.currentTrack != "?"){
    //       this.nowTrack = data.playing;
    //     }

    //     this.playState = data.isPlaying;
    //     this.coverImg = data.albumArt;
    //     // var len = this.tracks.length;
    //     // for(var i=0; i<len; i++){
    //     //   var fileUrl = this.tracks[i].fileUrl;
    //     //   var index = fileUrl.lastIndexOf(".");
    //     //   this.tracks[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
    //     // }
    //     setTimeout(
    //       () => {
    //         this.getState();
    //       },
    //       AppConfig.settings.interval
    //     );
    // });

  }
 
  private getState(){
    this.myHttpService.GetState().then(
      (data:any)=>{
        // console.log(data);
        this.pushTrack(data);

        this.timeout = setTimeout(
          () => {
            this.getState();
          },
          AppConfig.settings.interval
        );
      }
    );
  }

  private pushTrack(data:any){
    this.tracks = data.playlist;
    if(data.currentTrack != "?"){
      this.nowTrack = data.playing;
      this.title = data.playing.track;
    }

    this.playState = data.isPlaying;
    this.coverImg = data.albumArt;
    this.audiobar = data.trackpos;
    this.duration = data.tracklen;
    let perc = this.getPercent(this.audiobar, this.duration);
    this.progressbar.set(perc);

    if(data.isPlaying == "1"){
      this.playingAnimateStart();
    }else{
      this.playingAnimateStop();
    }
    var len = this.tracks.length;
    for(var i=0; i<len; i++){
      if(this.tracks[i].track == this.title){
        this.tracks[i]['isPlaying'] = true;
      }else{
        this.tracks[i]['isPlaying'] = false;
      }

      let fileUrl = this.tracks[i].fileUrl;
      let index = fileUrl.lastIndexOf(".");
      this.tracks[i]['audioType'] = fileUrl.substr(index+1).toUpperCase();
    }
  }

  async more() {

    // this.wsService.closeWSPlaying();
    // this.navCtrl.navigateForward("/playing");
    // this.router.navigateByUrl("/playing");
    // this.router.navigate(['/playing']);
    clearTimeout(this.timeout);

    const modal = await this.modalController.create({
        component: NowplayingPage,
        componentProps: {
        }
    });

    modal.onDidDismiss().then(res=>{
      if(!res.data.hasError){
        this.getState();
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

  playTrack(idx:any) {
    // this.playFileUrl = track.fileUrl;
    this.myHttpService.PlayTrack(idx);
  }

  playNext(event){
    event.preventDefault(); 
    event.stopPropagation();

    this.myHttpService.PlayNext();
  }

  playPrev(event){
    event.preventDefault(); 
    event.stopPropagation();
    this.myHttpService.PlayPrev();
  }

  playPause(event){
    event.preventDefault(); 
    event.stopPropagation();
    this.myHttpService.PlayPause();
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

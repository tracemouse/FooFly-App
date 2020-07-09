import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { NavController,ToastController } from '@ionic/angular';
import { AppConfig } from './app.config';
import { timeout, sample } from 'rxjs/operators';
import { TranslateService }from "@ngx-translate/core";
import { ThrowStmt } from '@angular/compiler';


@Injectable({
  providedIn: 'root'
})
export class MyHttpService {

  // private url = "http://192.168.1.102:9999/jsonrpc";
  private url = "";

  constructor(public http:HttpClient,
              public toastController: ToastController,
              public translateService: TranslateService,
              public navCtrl: NavController) {

   }

  public GetArtworkUrl(track:any){
    let url = "/getArtwork?fileUrl=" + encodeURIComponent(track.fileUrl);
    if(AppConfig.settings.albumartFromF2K == "true"){
      url = "/api?cmd=albumart&param1="+track.playlistIdx+"&param2="+track.trackIdx;
    }
    url = AppConfig.settings.rootUrl + url;
    return url;
   }
  
  public CallFoo(url:string){
    // if (r)	requestStr += '&cmd='+r;
    // if (p)	requestStr += '&param1='+p;
    // if (p2)	requestStr += '&param2='+p2;
    // if (p3)	requestStr += '&param3='+p3;
    let platform = AppConfig.settings.platform;
    if(!url.startsWith("http")){
      url = AppConfig.fooflyRoot + "?" + url;
      url = (AppConfig.env == "dev")?url: (AppConfig.settings.rootUrl + url);
      // if(platform == "cordova"){
      //   url = AppConfig.settings.rootUrl + url;
      // }
      let randrom = "random=" + Math.random();
      url = (url.endsWith("?"))?(url + randrom):(url + "&" + randrom);
    }else{
      url = url + AppConfig.fooflyRoot;
    }
    // console.log(url);
    // return this.http.get(url,{'responseType': 'text'}).pipe(timeout(AppConfig.settings.timeout * 60 * 1000));

    return new Promise((resolve, reject) => {
      this.http.get(url,{'responseType': 'text'}).pipe(timeout(AppConfig.settings.timeout * 60 * 1000))
      .subscribe(
        res => {
          // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
          // res = res.replace(/\'0\'/g,'"0"');
          if(res == null || res.length == 1)  {
            resolve({});
            return;
          }

          try{
            let json = JSON.parse(res);
            resolve(json);
          }catch(e){
            console.log("failed to convert json, str=" + res);
            reject(e);
          }
        }
        ,error => {
          console.log('%c 请求处理失败 %c', 'color:red', 'url', this.url, 'err', error);
          reject(error);
          // this.presentError(error);
          // this.exit();
        }
        )
      });
  }

  public GetState(){
    return this.CallFoo("cmd=status");
  }

  public Play(){
    let url = "cmd=playControl&param1=play";
    return this.CallFoo(url);
  }

  public Pause(){
    let url = "cmd=playControl&param1=pause";
    return this.CallFoo(url);
  }

  public PlayNext(){
    let url = "cmd=playControl&param1=next";
    return this.CallFoo(url);
  }

  public PlayPrev(){
    let url = "cmd=playControl&param1=prev";
    return this.CallFoo(url);
  }

  public PlayPause(){
    let url = "cmd=playControl&param1=playpause";
    return this.CallFoo(url);
  }

  public FocusOnPlaying(){
    let url = "cmd=playControl&param1=FocusOnPlaying";
    return this.CallFoo(url);
  }

  public SetPostion(postion:any){
    let url = "cmd=playControl&param1=seek&param2=" + postion;
    return this.CallFoo(url);
  }

  public PlayTrack(playlistIdx:any, trackIdx:any){
    let url = "cmd=playlistPlay&param1=" + playlistIdx + "&param2=" + trackIdx;
    return this.CallFoo(url);
  }

  public SetVolume(volume:any){
    let url = "cmd=playControl&param1=volume&param2=" + volume;
    return this.CallFoo(url);
  }

  public SetMute(){
    let url = "cmd=playControl&param1=mute";
    return this.CallFoo(url);
  }

  public SetRepeat(idx:any){
    let url = "cmd=playControl&param1=playbackOrder&param2=" + idx;
    return this.CallFoo(url);
  }

  public SwithPlaylist(plyalistIdx:any){
    let url = "cmd=playlistSwitch&param1=" + plyalistIdx;
    return this.CallFoo(url);
  }

  public GoPage(playlistIdx:any,page:any){
    let url = "cmd=playlistGet&param1=" + playlistIdx + "&param2=" + page;
    return this.CallFoo(url);
  }

  public GetAllTracks(playlistIdx:any){
    let url = "cmd=playlistGet&param1=" + playlistIdx + "&param2=all";
    return this.CallFoo(url);
  }

  public CloseScreen(){
    let url = "cmd=closeScreen";
    return this.CallFoo(url);
  }

  public shudown(minutes:any){
    let url = "cmd=shutdown&param1="+minutes;
    return this.CallFoo(url);
  }

  public async clearPlaylist(playlistIdx:any){
    let url = "cmd=playlistClear&param1=" + playlistIdx;
    return this.CallFoo(url);
    // await this.SwithPlaylist(playlistIdx).then(
    //   async (data) =>{
    //     let url = "cmd=EmptyPlaylist&param3=NoResponse";
    //     await this.CallFoo(url).then(
    //       (data)=>{
    //         // console.log("deleted");
    //       }
    //     );
    //   });
  }

  public createPlaylist(playlist:any){
    playlist = encodeURIComponent(playlist);
    // let url = "cmd=CreatePlaylist&param1=" + playlist + "&param3=NoResponse";
    let url = "cmd=playlistAdd&param1=" + playlist;
    return this.CallFoo(url);
  }

  public removePlaylist(idx:any){
    let url = "cmd=playlistRemove&param1=" + idx + "&param3=NoResponse";
    return this.CallFoo(url);
  }

  public addTrackToPlaylist(playlistIdx:any, track:any){
    let strTrack = encodeURIComponent(JSON.stringify(track));
    // let url = "cmd=Browse&param1=" + fileUrl + "&param3=js/browser.json";
    let url = "cmd=playlistAddItem&param1=" + playlistIdx + "&param2=" + strTrack;
    return this.CallFoo(url);
  }

  public addFileToPlaylist(playlistIdx:any, file:any){
    let fileUrl = encodeURIComponent(file);
    // let url = "cmd=Browse&param1=" + fileUrl + "&param3=js/browser.json";
    let url = "cmd=playlistAddFile&param1=" + playlistIdx + "&param2=" + fileUrl;
    return this.CallFoo(url);
  }


  public async addAndPlay(playlistIdx:any,track:any){
       
    this.SwithPlaylist(playlistIdx).then(
      (data:any) =>{
        let trackIdx = 0;
        try{
          trackIdx = parseInt(data.playlists[playlistIdx].count);
        }catch(ex){

        }
        this.addTrackToPlaylist(playlistIdx, track).then(
          (data:any)=>{
            this.sleep(500);
            this.PlayTrack(playlistIdx,trackIdx);
          }
        );
      }
    );
  }

  public async fooflyPlayTrack(track:any){
    if(track==null){
      return;
    }
    this.PlayTrack(track.playlistIdx,track.trackIdx);

    // this.GetState().then(
    //   (data:any) =>{
    //     let len = data.playlists.length;
    //     var findFG = false;
    //     for(let i=0; i<len; i++){
    //       if(AppConfig.settings.wkPlaylist == data.playlists[i].name){
    //         findFG = true;
    //         this.addAndPlay(i,track);
    //         break;
    //       }
    //     }
    //     if(!findFG){
    //       this.createPlaylist(AppConfig.settings.wkPlaylist).then(
    //         (data:any) =>{
    //           let len = data.playlists.length;
    //           var findFG = false;
    //           for(let i=0; i<len; i++){
    //             if(AppConfig.settings.wkPlaylist == data.playlists[i].name){
    //               findFG = true;
    //               this.addAndPlay(i,track);
    //               break;
    //             }
    //           }
    //         }
    //       );
    //     }
    //   });
  }

  public async fooflyPlayTracks(tracks:any){
    if(tracks==null || tracks.length <= 0){
      return;
    }
    this.GetState().then(
      async (data:any) =>{
        let len = data.playlists.length;
        var findFG = false;
        for(let i=0; i<len; i++){
          if(AppConfig.settings.wkPlaylist == data.playlists[i].name){
            let playlistIdx = i;
            findFG = true;
            await this.clearPlaylist(i);
            // this.sleep(500);
            for(let i=0;i<tracks.length;i++){
              await this.addTrackToPlaylist(playlistIdx, tracks[i]);
              if(i==0) {this.PlayTrack(playlistIdx,0);}
              this.sleep(100);
            }
            break;
          }
        }
        if(!findFG){
          this.createPlaylist(AppConfig.settings.wkPlaylist).then(
            async (data:any) =>{
              let len = data.playlists.length;
              var findFG = false;
              for(let i=0; i<len; i++){
                if(AppConfig.settings.wkPlaylist == data.playlists[i].name){
                  let playlistIdx = i;
                  findFG = true;
                  await this.clearPlaylist(i);
                  for(let i=0;i<tracks.length;i++){
                    await this.addTrackToPlaylist(playlistIdx,tracks[i]);
                    if(i==0) {this.PlayTrack(playlistIdx,0);}
                    this.sleep(50);
                  }
                  break;
                }
              }
            }
          );
        }
      });
  }

  async presentError(event:any){

    var message;
    await this.translateService.get("message").subscribe(res=>{
      message = res;
    })

    const toast = await this.toastController.create({
      header: message['err-conn-fail'],
      message: message['err-conn-fail-msg1'],
      duration: 1000,
      position: 'bottom',
      color: 'warning',
      keyboardClose: true,
      mode:'ios',
      buttons: [
        {
          side: 'start',
          icon: 'alert',
          text: '',
          handler: () => {
          }
        },
        {
          side: 'end',
          icon: 'close',
          text: '',
          handler: () => {
            toast.dismiss();
            // this.navCtrl.navigateBack("/login");
            // this.exit();
          }
        }
      ]
    });
    toast.onDidDismiss().then(
      data=>{
        // this.exit();
      }
    );

    toast.present();
  }

  exit(){

    this.navCtrl.navigateForward(["/login"], {
      queryParams: {
        from: 'exit'
      }
    });
  }

  public async presentTrackToast(header,message) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 3000,
      position: 'top',
      color: "danger",
      keyboardClose: true,
      mode:'ios',
      buttons: [
        {
          side: 'end',
          icon: 'musical-note',
          text: '',
          handler: () => {
            this.navCtrl.navigateForward('/tabs/tab1');
          }
        }
      ]
    });
    toast.present();
  }

  async presentToast(header,message) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 2000,
      position: 'bottom',
      color: "primary",
      keyboardClose: true,
      mode:'ios',
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-circle-outline',
          text: '',
          handler: () => {
          }
        }
      ]
    });
    toast.present();
  }

  public sleep(delay) {
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
      continue;
    }
  }

  public formatSampleRate(sampleRate:string){
    if(sampleRate.length < 3) return sampleRate;
    let str1 = this.left(sampleRate, sampleRate.length - 2);
    let str2 = this.right(sampleRate,2);
    if(str1.length < 4) return sampleRate;
    if(str1.length < 7) {
      try{
        let int1 = parseInt(str1);
        let float2 = int1 / 1000;
        return float2.toFixed(1) + "K" + str2;
      }catch(ex){
        return sampleRate;
      }
    }else{
      try{
        let int1 = parseInt(str1);
        let float2 = int1 / 1000 / 1000;
        if(str1.length < 8){
          return float2.toFixed(2) + "M" + str2;
        }else{
          return float2.toFixed(1) + "M" + str2;
        }
      }catch(ex){
        return sampleRate;
      }
    }
  }

  public left(mainStr,lngLen){
    if(lngLen>0){
      return mainStr.substring(0,lngLen);
    }
    else{
      return null;
    }
  }
    
  public right(mainStr,lngLen){
    if(mainStr.length - lngLen >=0 && mainStr.length >=0 && mainStr.length-lngLen <= mainStr.length){
    return  mainStr.substring(mainStr.length-lngLen,mainStr.length)
    }else{
      return null;
    }
  }

  public mid(mainStr,starnum,endnum){
    if(mainStr.length >= 0){
      return mainStr.substr(starnum,endnum)
    }else{
      return null;
    }
  }
}


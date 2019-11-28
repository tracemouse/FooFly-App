import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { NavController,ToastController } from '@ionic/angular';
import { AppConfig } from './app.config';
import { timeout } from 'rxjs/operators';
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
          this.exit();
        }
        )
      });
  }

  public GetState(){
    return this.CallFoo("");
  }

  public PlayNext(){
    let url = "cmd=StartNext";
    return this.CallFoo(url);
  }

  public PlayPrev(){
    let url = "cmd=StartPrevious";
    return this.CallFoo(url);
  }

  public PlayPause(){
    let url = "cmd=PlayOrPause";
    return this.CallFoo(url);
  }

  public SetPostion(postion:any){
    let url = "cmd=Seek&param1=" + postion;
    return this.CallFoo(url);
  }

  public PlayTrack(idx:any){
    let url = "cmd=Start&param1=" + idx;
    return this.CallFoo(url);
  }

  public SetVolume(volume:any){
    let url = "cmd=Volume&param1=" + volume;
    return this.CallFoo(url);
  }

  public SetRepeat(idx:any){
    let url = "cmd=PlaybackOrder&param1=" + idx;
    return this.CallFoo(url);
  }

  public SwithPlaylist(idx:any){
    let url = "cmd=SwitchPlaylist&param1=" + idx;
    return this.CallFoo(url);
  }

  public FocusOnPlaying(){
    // let url = "cmd=FocusOnPlaying&param3=NoResponse";
    let url = "cmd=FocusOnPlaying";
    return this.CallFoo(url);
  }

  public GoPage(idx:any){
    let url = "cmd=P&param1=" + idx;
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

  public async clearPlaylist(palylistIdx:any){
    await this.SwithPlaylist(palylistIdx).then(
      async (data) =>{
        let url = "cmd=EmptyPlaylist&param3=NoResponse";
        await this.CallFoo(url).then(
          (data)=>{
            // console.log("deleted");
          }
        );
      });
  }

  public createPlaylist(playlist:any){
    playlist = encodeURI(playlist);
    // let url = "cmd=CreatePlaylist&param1=" + playlist + "&param3=NoResponse";
    let url = "cmd=CreatePlaylist&param1=" + playlist;
    return this.CallFoo(url);
  }

  public removePlaylist(idx:any){
    let url = "cmd=RemovePlaylist&param1=" + idx + "&param3=NoResponse";
    return this.CallFoo(url);
  }

  public addTracksToPlaylist(file:any){
    let fileUrl = encodeURI(file);
    // let url = "cmd=Browse&param1=" + fileUrl + "&param3=js/browser.json";
    let url = "cmd=Browse&param1=" + fileUrl;
    return this.CallFoo(url);
  }

  public async addAndPlay(playlistIdx:any,track:any){
    this.SwithPlaylist(playlistIdx).then(
      (data:any) =>{
        let idx = 0;
        try{
          idx = parseInt(data.playlists[playlistIdx].count);
        }catch(ex){

        }
        this.addTracksToPlaylist(track.fileUrl).then(
          (data:any)=>{
            this.sleep(500);
            this.PlayTrack(idx);
          }
        );
      }
    );
  }

  public async fooflyPlayTrack(track:any){
    if(track==null){
      return;
    }
    this.GetState().then(
      (data:any) =>{
        let len = data.playlists.length;
        var findFG = false;
        for(let i=0; i<len; i++){
          if(AppConfig.settings.wkPlaylist == data.playlists[i].name){
            findFG = true;
            this.addAndPlay(i,track);
            break;
          }
        }
        if(!findFG){
          this.createPlaylist(AppConfig.settings.wkPlaylist).then(
            (data:any) =>{
              let len = data.playlists.length;
              var findFG = false;
              for(let i=0; i<len; i++){
                if(AppConfig.settings.wkPlaylist == data.playlists[i].name){
                  findFG = true;
                  this.addAndPlay(i,track);
                  break;
                }
              }
            }
          );
        }
      });
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
            findFG = true;
            await this.clearPlaylist(i);
            // this.sleep(500);
            for(let i=0;i<tracks.length;i++){
              await this.addTracksToPlaylist(tracks[i].fileUrl);
              this.sleep(100);
            }
            this.PlayTrack(0);
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
                  findFG = true;
                  await this.clearPlaylist(i);
                  for(let i=0;i<tracks.length;i++){
                    await this.addTracksToPlaylist(tracks[i].fileUrl);
                    this.sleep(50);
                  }
                  this.PlayTrack(0);
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
            this.exit();
          }
        }
      ]
    });
    toast.onDidDismiss().then(
      data=>{
        this.exit();
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
}


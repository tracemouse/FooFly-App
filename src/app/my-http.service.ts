import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { AppConfig } from './app.config';
import { timeout } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class MyHttpService {

  // private url = "http://192.168.1.102:9999/jsonrpc";
  private url = "";

  constructor(private http:HttpClient,
              public navCtrl: NavController) {

   }


//   public CallMusicBeeWithErr(postdata:any){
//     if(AppConfig.settings.rootUrl.endsWith("/")){
//       this.url = AppConfig.settings.rootUrl + AppConfig.settings.jsonrpc;
//     }else{
//       this.url = AppConfig.settings.rootUrl + "/" + AppConfig.settings.jsonrpc;
//     }
     
//    return new Promise((resolve, reject) => {
//     this.http.post(this.url, postdata).pipe(timeout(AppConfig.settings.timeout * 60 * 1000))
//     .subscribe(
//       res => {
//         // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
//         resolve(res);
//       }
//       ,error => {
//         console.log('%c 请求处理失败 %c', 'color:red', 'url', this.url, 'err', error);
//         reject(error);
//       }
//       )
//     });
//   }
  
  public CallFoo(url:string){
    // if (r)	requestStr += '&cmd='+r;
    // if (p)	requestStr += '&param1='+p;
    // if (p2)	requestStr += '&param2='+p2;
    // if (p3)	requestStr += '&param3='+p3;

    if(!url.startsWith("http")){
      url = "?" + url;
      url = (AppConfig.env == "dev")?(AppConfig.urlRoot + url):("/" + url);
      let randrom = "random=" + Math.random();
      url = (url.endsWith("?"))?(url + randrom):(url + "&" + randrom);
    }else{
      url = url + AppConfig.urlRoot;
    }
    // console.log(url);
    // return this.http.get(url,{'responseType': 'text'}).pipe(timeout(AppConfig.settings.timeout * 60 * 1000));

    return new Promise((resolve, reject) => {
      this.http.get(url,{'responseType': 'text'}).pipe(timeout(AppConfig.settings.timeout * 60 * 1000))
      .subscribe(
        res => {
          // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
          // res = res.replace(/\'0\'/g,'"0"');
          let json = JSON.parse(res);
          resolve(json);
        }
        ,error => {
          console.log('%c 请求处理失败 %c', 'color:red', 'url', this.url, 'err', error);
          reject(error);
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
    let url = "cmd=FocusOnPlaying&param3=NoResponse";
    return this.CallFoo(url);
  }

  public GoPage(idx:any){
    let url = "cmd=P&param1=" + idx;
    return this.CallFoo(url);
  }
}


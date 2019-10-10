import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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


  public CallMusicBee(postdata:any){
    if(AppConfig.settings.rootUrl.endsWith("/")){
      this.url = AppConfig.settings.rootUrl + AppConfig.settings.jsonrpc;
    }else{
      this.url = AppConfig.settings.rootUrl + "/" + AppConfig.settings.jsonrpc;
    }
     
   return new Promise((resolve, reject) => {
    this.http.post(this.url, postdata).pipe(timeout(AppConfig.settings.timeout * 60 * 1000))
    .subscribe(
      res => {
        // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
        resolve(res);
      }
      ,error => {
        console.log('%c 请求处理失败 %c', 'color:red', 'url', this.url, 'err', error);
        console.log("call mb failed. " + postdata);
//         reject(error);
        // this.navCtrl.navigateForward("/login");
        this.navCtrl.navigateBack("/login");
      }
      )
    });
  }

  public CallMusicBeeWithErr(postdata:any){
    if(AppConfig.settings.rootUrl.endsWith("/")){
      this.url = AppConfig.settings.rootUrl + AppConfig.settings.jsonrpc;
    }else{
      this.url = AppConfig.settings.rootUrl + "/" + AppConfig.settings.jsonrpc;
    }
     
   return new Promise((resolve, reject) => {
    this.http.post(this.url, postdata).pipe(timeout(AppConfig.settings.timeout * 60 * 1000))
    .subscribe(
      res => {
        // console.log('%c 请求处理成功 %c', 'color:red', 'url', this.url, 'res', res);
        resolve(res);
      }
      ,error => {
        console.log('%c 请求处理失败 %c', 'color:red', 'url', this.url, 'err', error);
        reject(error);
      }
      )
    });
  }

  public CallMusicBeHttp(postdata:any){
    if(AppConfig.settings.rootUrl.endsWith("/")){
      this.url = AppConfig.settings.rootUrl + AppConfig.settings.jsonrpc;
    }else{
      this.url = AppConfig.settings.rootUrl + "/" + AppConfig.settings.jsonrpc;
    }
     
   return this.http.post(this.url, postdata).pipe(timeout(AppConfig.settings.timeout * 60 * 1000));
  }
}


import { Injectable } from '@angular/core';
import { Observable,  of} from 'rxjs';
import { NavController,ToastController  } from '@ionic/angular';
import { TranslateService }from "@ngx-translate/core";

import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  wsPlaying:WebSocket;
  wsJsonrpc:WebSocket;
  obPlaying:any;
  obJsonrpc:any;
  fileUrl:string = "";


  constructor(public navCtrl: NavController,
              public translateService: TranslateService,
              public toastController: ToastController) {

   }

  openWSPlaying():Observable<any>{

    try{
      if((this.wsPlaying) && (this.obPlaying)){
        return;
      }
      
      var wsurl = AppConfig.global.ws_schema + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/wsplaying?password=" + AppConfig.settings.password; 

      this.wsPlaying = new WebSocket(wsurl);
      this.wsPlaying.onopen = (event) =>{
        var mydata = {"action":"start","interval":AppConfig.settings.interval};
        let postStr:string = JSON.stringify(mydata);
        // console.log("send:" + postStr);
        this.wsPlaying.send(postStr);
      };
      this.obPlaying = new Observable<any>(
        observable =>{
          // this.ws.onopen = (event) => observable.next(event);
          this.wsPlaying.onmessage = (event)=> {
            var data = JSON.parse(event.data);
            // console.log(data);
            if(data['error']){
              console.log(data);
              this.wsPasswordError(event);
              data['isSucc']=false;
            }else{
              data['isSucc']=true;
              observable.next(data);
            }
            if(data.isSucc){
              if(this.fileUrl != data.track.fileUrl){
                var header = data.track.trackTitle;
                var message = data.track.artist + "-" + data.track.album;
                this.presentTrackToast(header,message);
                this.fileUrl = data.track.fileUrl;
              }
            }
          }
          // this.wsPlaying.onerror = (event)=>observable.error(event);
          this.wsPlaying.onerror = (event) => this.wsError(event);
          this.wsPlaying.onclose = (event)=>observable.complete();
        }
      )
      return this.obPlaying;
    }catch(e){
      this.wsError(e);
      this.obPlaying = null;
      return null;
    }
  }

  sendWSPlaying(post:any){
    // console.log(this.wsPlaying.readyState);
    if (this.wsPlaying.readyState != 1){
      this.wsError("Websocket closed, status=" + this.wsPlaying.readyState);
    }
    try{
      var postStr = JSON.stringify(post);
      this.wsPlaying.send(postStr);
    }catch(e){
      this.wsError(e);
    }
  }

  closeWSPlaying(){
    try{
      if(this.wsPlaying != null)
        this.wsPlaying.close();
      this.wsPlaying = null;
    }catch(e){

    }
  }

  callMB(post:any, url:string=null, getErr:boolean=false){
    try{
      var postStr = JSON.stringify(post);
      var wsurl = AppConfig.global.ws_schema + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/wsjsonrpc?password=" + AppConfig.settings.password; 
      wsurl = (url==null)?wsurl:url;
      var wsJsonrpc = new WebSocket(wsurl);
      wsJsonrpc.onopen = (event) =>{
        wsJsonrpc.send(postStr);
      };
      var observe = new Observable<any>(
        observable =>{
          // this.ws.onopen = (event) => observable.next(event);
          wsJsonrpc.onmessage = (event)=> {
            var data = JSON.parse(event.data);
            if(data['error']){
              console.log(data);
              this.wsPasswordError(event);
              data['isSucc']=false;
            }else{
              data['isSucc']=true;
            }
            observable.next(data); 
            wsJsonrpc.close(); 
            wsJsonrpc=null;
          };
          // wsJsonrpc.onerror = (event)=>observable.error(event);
          wsJsonrpc.onerror = (event) => {if(getErr){observable.error(event);}else{this.wsError(event)}};
          wsJsonrpc.onclose = (event) => observable.complete();
        }
      );
      return observe;
    }catch(e){
      if(getErr){
        var observe = new Observable<any>(
          observable =>{
            observable.error(e);
          });
          return observe;
      }else{
        this.wsError(e);
      }
    }
  }


  openWSJsonrpc(url:string=null, getErr:boolean=false){
    try{
      if((this.wsJsonrpc) && (this.obJsonrpc)){
        return;
      }
      var wsurl = AppConfig.global.ws_schema + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/wsjsonrpc?password=" + AppConfig.settings.password; 
      wsurl = (url==null)?wsurl:url;
      this.wsJsonrpc = new WebSocket(wsurl);
      this.wsJsonrpc.onopen = (event) =>{
      };
      this.obJsonrpc = new Observable<any>(
        observable =>{
          // this.ws.onopen = (event) => observable.next(event);
          this.wsJsonrpc.onmessage = (event)=> {
            var data = JSON.parse(event.data);
            if(data['error']){
              console.log(data);
              this.wsPasswordError(event);
              data['isSucc']=false;
            }else{
              data['isSucc']=true;
            }
            observable.next(data); 
          };
          // wsJsonrpc.onerror = (event)=>observable.error(event);
          this.wsJsonrpc.onerror = (event) => {if(getErr){observable.error(event);}else{this.wsError(event)}};
          this.wsJsonrpc.onclose = (event) => observable.complete();
        }
      );
      return this.obJsonrpc;
    }catch(e){
      if(getErr){
        var observe = new Observable<any>(
          observable =>{
            observable.error(e);
          });
          return observe;
      }else{
        this.wsError(e);
      }
    }
  }

  closeWSJsonrpc(){
    try{
      if(this.wsJsonrpc!= null)
        this.wsJsonrpc.close();
      this.wsJsonrpc = null;
    }catch(e){

    }
  }

  sendJsonrpc(post:any){
    if (this.wsJsonrpc.readyState != 1){
      this.wsError("Websocket closed, status=" + this.wsJsonrpc.readyState);
    }
    try{
      var postStr = JSON.stringify(post);
      this.wsJsonrpc.send(postStr);
    }catch(e){
      this.wsError(e);
    }
  }

  async wsError(event:any){
    console.log(event);
    this.closeWSJsonrpc();
    this.closeWSPlaying();

    var message;
    await this.translateService.get("message").subscribe(res=>{
      message = res;
    })

    const toast = await this.toastController.create({
      header: message['err-conn-fail'],
      message: message['err-conn-fail-msg1'],
      //duration: 5000,
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
            this.navCtrl.navigateForward(["/login"],{
              queryParams:{
                from:'exit'
              }
            });
          }
        }
      ]
    });
    toast.present();
  }

  async wsPasswordError(event:any){
    console.log(event);
    this.closeWSJsonrpc();
    this.closeWSPlaying();

    var message;
    await this.translateService.get("message").subscribe(res=>{
      message = res;
    })

    const toast = await this.toastController.create({
      header: message['err-conn-fail'],
      message: message['err-conn-inv-password'],
      //duration: 5000,
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
            this.navCtrl.navigateForward(["/login"],{
              queryParams:{
                from:'exit'
              }
            });
          }
        }
      ]
    });
    toast.present();
  }

  async presentTrackToast(header,message) {
    const toast = await this.toastController.create({
      header: header,
      message: message,
      duration: 3000,
      position: 'bottom',
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


}

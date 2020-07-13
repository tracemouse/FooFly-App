import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';
import { ModalController, NavParams,AlertController  } from '@ionic/angular';
import { TranslateService }from "@ngx-translate/core";


import { MyHttpService} from "../my-http.service";
// import { WebsocketService} from "../websocket.service"; 
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-shutdown',
  templateUrl: './shutdown.page.html',
  styleUrls: ['./shutdown.page.scss'],
})
export class ShutdownPage implements OnInit {

  @ViewChild('inputEle',{read: ElementRef, static:false}) inputEle: ElementRef;
  

  showMore = false;
  inputMinutes = 90;

  i18n:any;
  i18nMessage:any;

  buttonBoxClass="button-box show";
  moreBoxClass="more-box hide";

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public alertController:AlertController,
              public translateService:TranslateService,
              public elementRef:ElementRef,
              public myHttpService:MyHttpService
              // public wsService: WebsocketService
              ) 
  { 

  }

  ngOnInit() {

    this.initMessage();
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if(AppConfig.settings.platform != "cordova" && AppConfig.global.isAndroid){
      this.inputEle.nativeElement.onfocus = this.inputFocus;
      this.inputEle.nativeElement.onblur = this.inputBlur;
    }
    AppConfig.global.scrollHeight = document.body.scrollHeight;
    // console.log(AppConfig.global.scrollHeight);

    //监听软键盘弹出
 
    window.addEventListener('native.keyboardshow', function (e:any) {
 
      // alert("keyboard show");

      if(!AppConfig.global.isAndroid){
        return;
      }

  
      let ionModal = document.getElementsByTagName("ion-modal")[0];
      let offset = e.keyboardHeight;
      ionModal.style.top = "-" + offset + "px";
    });

    //监听软键盘关闭

    window.addEventListener('native.keyboardhide', function (e) {
 
      if(!AppConfig.global.isAndroid){
        return;
      }
  
      let ionModal = document.getElementsByTagName("ion-modal")[0];
      let offset = 0;
      ionModal.style.top = offset + "px";

    });

  }


  async initMessage(){
    await this.translateService.get("shutdown").subscribe(res=>{
      this.i18n = res;
    });
    await this.translateService.get("message").subscribe(res=>{
      this.i18nMessage = res;
    });
  }

  cancel() {
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
    });
  }

  closeScreen(){
    // var mydata = {"action":"closeScreen"};
    // this.wsService.callMB(mydata).subscribe(
    //   data=>{
    //     // console.log(data);
    //     if(!data.isSucc){
    //       return;
    //     }
    //     this.cancel();
    //   }
    // );
  }
  
  async shutdown(minutes:any){

    var alertMsg = this.i18n['alert-message'].replace("<minute>",minutes);
    const alert = await this.alertController.create({
      header: this.i18n['alert-header'],
      subHeader: this.i18n['alert-subtitle'],
      message: alertMsg,
      buttons: [
        {
          text: this.i18n['alert-cancel'],
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.cancel();
          }
        }, {
          text: this.i18n['alert-ok'],
          handler: () => {
            this.cancel();
            this.shutdownPC(minutes);
          }
        }
      ]
    });

    await alert.present();
    return;
  }

  shutdownPC(minutes:any){
    this.cancel();
    this.myHttpService.shudown(minutes).then(
      data=>{
        this.myHttpService.presentToast(this.i18nMessage['info'],this.i18nMessage['info-command-ok']);
      }
    );
    // var mydata = {"action":"shutdown","minutes":minutes};
    // this.wsService.callMB(mydata).subscribe(
    //   data=>{
    //     // console.log(data);
    //     if(!data.isSucc){
    //       return;
    //     }
    //     this.wsService.presentToast(this.i18nMessage['info'],this.i18nMessage['info-command-ok']);
    //   }
    // );
  }

  async more() {

    this.buttonBoxClass = "button-box hide";
    this.moreBoxClass = "more-box slideUp show";
    this.showMore = true;
  }

  moreCancel(){
    this.buttonBoxClass = "button-box slideDown show";
    this.moreBoxClass = "more-box hide";
    this.showMore = false;
  }

  moreOk(){
    if(!this.inputMinutes){
      return;
    }

    if(this.inputMinutes < 0 || this.inputMinutes > 999){
      return;
    }

    this.shutdown(this.inputMinutes);
  }

  inputFocus(ev:any){

    if(!AppConfig.global.isAndroid){
      return;
    }

    let ionModal = document.getElementsByTagName("ion-modal")[0];
 
    let scrollHeight = document.body.scrollHeight;
    let offset = AppConfig.global.scrollHeight - scrollHeight;
 
    offset = 250;

    ionModal.style.top = "-" + offset + "px";
 
    // ionModal.style.top = "-200px";
  }

  inputBlur(ev:any){
    if(!AppConfig.global.isAndroid){
      return;
    }

    let ionModal = document.getElementsByTagName("ion-modal")[0];
    ionModal.style.top = "0px";

  }
}

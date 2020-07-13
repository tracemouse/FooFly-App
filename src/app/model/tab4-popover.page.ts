import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams,PopoverController } from '@ionic/angular';
import { TranslateService }from "@ngx-translate/core";

import { MyHttpService} from "../my-http.service";
// import { WebsocketService} from "../websocket.service"; 

import { ShutdownPage } from "./shutdown.page";

import { popEnterAnimation } from "../modal-transitions";
import { popLeaveAnimation } from "../modal-transitions";

@Component({
  selector: 'app-tab4-popover',
  templateUrl: './tab4-popover.page.html',
  styleUrls: ['./tab4-popover.page.scss'],
})
export class Tab4PopoverPage implements OnInit {
  
  i18nMessage:any;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public popoverController:PopoverController,
              public translateService:TranslateService,
              public myHttpService:MyHttpService
              // public wsService: WebsocketService
              ) 
  { 

  }

  ngOnInit() {

    this.initMessage();
  }

  async initMessage(){

    await this.translateService.get("message").subscribe(res=>{
      this.i18nMessage = res;
    });
  }

  cancel() {
    this.popoverController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
    });
  }

  closeScreen(){
    this.cancel();
    this.myHttpService.CloseScreen().then(
      data=>{
        this.myHttpService.presentToast(this.i18nMessage['info'],this.i18nMessage['info-command-ok']);
      }
    );
    // var mydata = {"action":"closeScreen"};
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
  
  async shutdown(){
      const modalShutdown = await this.modalController.create({
      component: ShutdownPage,
      backdropDismiss: true,
      cssClass: "halfModal",
      enterAnimation: popEnterAnimation,
      leaveAnimation: popLeaveAnimation
    });

    this.cancel();

    await modalShutdown.present().then(
      data=>{
      }
    );
    return;
  }
}

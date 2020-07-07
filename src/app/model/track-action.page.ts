import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { MyDBService}  from "../my-db.service";
import { MyHttpService} from "../my-http.service";
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-search',
  templateUrl: './track-action.page.html',
  styleUrls: ['./track-action.page.scss'],
})
export class TrackActionPage implements OnInit {
  
  @Input() input:any;

  playlists = [];
  
  track: any = [];
  title: string = "";
  coverImg = "assets/img/cover.jpg";

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public myHttpService: MyHttpService,
              public myDBService: MyDBService) 
  { 
    navParams.get('input'); 
  }

  ngOnInit() {
    this.track = this.input.track;
    let imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
    imgUrl += "?fileUrl=" + encodeURIComponent(this.track.fileUrl);
    this.coverImg = imgUrl;
    // console.log(this.track);
    this.myHttpService.GetState().then(
      (data:any)=>{
        // console.log(data);
        this.playlists = data.playlists;
      }
    );

  }
  
  ionViewWillEnter(){

    //fix border radius bug of safari
    // let obj = document.getElementsByTagName("ion-content")[1];
    let obj = document.getElementById("trackActionIon");
    let shadow = obj.shadowRoot;

    const childNodes = Array.from(shadow.childNodes);

    childNodes.forEach(childNode => {
      if (childNode.nodeName.toLowerCase() === 'main') {
        let obj1 = <HTMLElement>childNode;
        // alert(obj.textContent);
        obj1.style.backgroundColor = "transparent";
      }
    });

  }

  cancel(error:any) {
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  add(item,i){
    this.myHttpService.SwithPlaylist(i).then(
      (data:any)=>{
        this.myHttpService.addTrackToPlaylist(i, this.track);
        this.cancel(false);
      }
    );
  }


}

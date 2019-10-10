import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { MyDBService}  from "../my-db.service";
// import { MyHttpService} from "../my-http.service";
import { WebsocketService} from "../websocket.service"; 
import { AppConfig } from '../app.config';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  
  tracks: any = [];
  title: string = "";
  coverImg = "assets/img/cover.jpg";

  searchInput = "";
  playFileUrl = "";

  showTrackSeq = false;

  constructor(public modalController: ModalController,
              public navParams: NavParams,
              public wsService: WebsocketService,
              // public myHttpService: MyHttpService,
              public myDBService: MyDBService) 
  { 

  }

  ngOnInit() {
    this.showTrackSeq = (AppConfig.settings.showTrackSeq=="true")?true:false;
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    AppConfig.global.scrollHeight = document.body.scrollHeight;
    // console.log(AppConfig.global.scrollHeight);

    //监听软键盘弹出

    window.addEventListener('native.keyboardshow', function (e:any) {
 
      // alert("keyboard show");

      if(!AppConfig.global.isAndroid){
        return;
      }

      let ionModal = document.getElementsByTagName("ion-modal")[0];
      // let offset = e.keyboardHeight;
      let offset = 0;
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

  async search(event:any){
    if(event.key != "Enter"){
      return;
    }

    event.target.blur();

    const query = event.target.value.toLowerCase().trim();
    // const searchCard = document.getElementById('search-card');
    this.title= query;
    this.tracks = [];
    if(query.length == ""){
      // searchCard.style.visibility = "hidden";
      return;
    }else{
      // searchCard.style.visibility = "visible";
    }

    var mydata = {"action":"librarySearch", "query":query};
    this.wsService.callMB(mydata,null,true).subscribe(
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
        },
        err=>{
          this.cancel(true);
        });    
  }

  cancel(error:any) {
    this.modalController.dismiss({
        // result: 'modal_cancel'
        'dismissed': true,
        'hasError': error
    });
  }

  playTrack(track:any) {
    var tracks = ""
    tracks = tracks + track.fileUrl;
    this.playFileUrl = track.fileUrl;
    var mydata = {"action":"playTracks","tracks":tracks};
    this.wsService.callMB(mydata,null,true).subscribe(
      data=>{
        // console.log(data);
        // this.cancel(false);
        if(!data.isSucc){
          return;
        }
      },
      err=>{
        this.cancel(true);
      }
    );
  }

  playTracks() {
    var tracks = ""
    var i = 0;
    for(let track of this.tracks){
      i++;
      if (i == 1) {
        tracks = tracks + track.fileUrl;
      }else{
        tracks = tracks + "*" + track.fileUrl;
      }
    }
    
    // console.log(tracks);
    var mydata = {"action":"playTracks","tracks":tracks};
    this.wsService.callMB(mydata,null,true).subscribe(
      data=>{
        // console.log(data);
        if(!data.isSucc){
          return;
        }
        this.cancel(false);
      },
      err=>{
        this.cancel(true);
      }
    );
  }

  handleSbInput(event:any) {
    const query = event.target.value.toLowerCase();
    requestAnimationFrame(() => {
      var items:any;
      items = Array.from(document.querySelector('#il-track').children);
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }
}

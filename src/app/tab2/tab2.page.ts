import { Component } from '@angular/core';
import { ModalController,LoadingController,NavController } from '@ionic/angular';

import { AppConfig } from '../app.config';
import { MyDBService}  from "../my-db.service";
import { MyHttpService} from "../my-http.service";
// import { WebsocketService} from "../websocket.service"; 
import { TracklistPage } from "../model/tracklist.page";
import { SearchPage } from "../model/search.page";

import { rightEnterAnimation } from "../modal-transitions";
import { rightLeaveAnimation } from "../modal-transitions";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  loading:any;
  // loadingDuration = 3 * 1000;
  loadingDuration = AppConfig.settings.timeout * 60 * 1000;

  tracks = [];
  tracksByfolder = [];
  tracksByAlbum = [];
  tracksByArtist = [];

  sgLibrary:string = "folder";
  folders: any = [];
  albums: any = [];
  artists: any = [];
  refreshEvent:any;
  cover = "assets/img/cover.jpg";

  constructor(public myDBService: MyDBService,
              public myHttpService: MyHttpService,
              // public wsService: WebsocketService,
              public modalController: ModalController,
              public loadingController: LoadingController,
              public navCtrl: NavController) {
    // console.log("tab2");
    // this.initLoading();
  }

 
  handleSbInput(event:any) {
    
    const query = event.target.value.toLowerCase().trim();
    
    requestAnimationFrame(() => {
      var items:any;
      if(this.sgLibrary == "folder"){
        items = Array.from(document.querySelector('#il_folder').children);
      }else if(this.sgLibrary == "album"){
        items = Array.from(document.querySelector('#il_album').children);
      }else if(this.sgLibrary == "artist"){
        items = Array.from(document.querySelector('#il_artist').children);
      }
      items.forEach(item => {
        const shouldShow = item.textContent.toLowerCase().indexOf(query) > -1;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  }
  
  ionViewDidLoad(){
    // console.log("ionViewDidLoad");
    
  }
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // console.log("ngOnInit");
    this.sgLibrary = "";
    this.refreshEvent = null;
    this.getAllTracks();

  }

  ionViewWillEnter(){
  }

  ionViewDidEnter(){
    // console.log("tab2 did enter");
    // this.wsService.openWSJsonrpc();
    // this.wsService.obJsonrpc.subscribe(
    //   data=>{
    //     // console.log(data);
    //     var pushData = JSON.parse(data.pushData);
    //     if(pushData.type == "folder"){
    //       this.pushFolderImg(pushData.idx,data.img);
    //     }
    //     if(pushData.type == "album"){
    //       this.pushAlbumImg(pushData.idx,data.img);
    //     }
    //     if(pushData.type == "artist"){
    //       this.pushArtistImg(pushData.idx,data.img);
    //     }
    //   }
    // );
  }

  ionViewWillLeave(){
    // console.log("tab2 will leave");
    if(this.loading != null)
      this.loading.dismiss();

    // this.wsService.closeWSJsonrpc();
   }
 
   ngOnDestroy(){
     //Called once, before the instance is destroyed.
     //Add 'implements OnDestroy' to the class.
     if(this.loading != null)
      this.loading.dismiss();
   } 

  refresh(){
    this.tracks = [];
    this.tracksByfolder=[];
    this.tracksByAlbum=[];
    this.tracksByArtist=[];
    this.sgLibrary = "";
    this.getAllTracks();
  }

  async initLoading() {
    this.loading = await this.loadingController.create({
      duration: this.loadingDuration,
      message: '',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    // return await this.loading.present();
  }

  async getAllTracks(){
      // console.log(item);
      await this.initLoading();
      await this.loading.present();
      var mydata = {"action":"librarySearch", "query":""};
  
      // this.wsService.callMB(mydata).subscribe(
      this.myHttpService.SwithPlaylist(1).then(
        data=>{
            // console.log(data);
            if(this.refreshEvent != null){
              this.refreshEvent.target.complete();
            }
            this.loading.dismiss();

            this.saveAllTracks(data);
        }
      );
  }

  async saveAllTracks(data:any){
    this.tracks.concat(data.playlist);
    console.log(this.tracks);
    this.folders = [];
    this.albums = [];
    this.artists = [];

    // await this.refreshFolder();
    // this.refreshFolder();
    this.sgLibrary = "folder";
    
    // this.myDBService.insertTracks(tracks).then().finally(
    //   ()=>{
    //     this.refreshEvent.target.complete();
    //   }
    // );
    return;
    // this.refreshEvent.target.complete();
  }

  async refreshFolder(){
    // console.log("folder start");
    this.tracksByfolder = [...this.tracks];
    this.tracksByfolder = this.tracksByfolder.sort(this.sortByFolder);
    this.folders = [];
    // console.log(this.tracks[0]);

    var name = "";
    var count = 0;
    var fileUrl = "";
    var start = 0;
    var sampleRate = "";
    var len = this.tracksByfolder.length;
    for(var i=0; i<len; i++){
      var track = this.tracksByfolder[i];
      if(track.folder != name){
        if(name != ""){
          var folder = {'name':'','fileUrl':'','count':0,start: 0, 'artWork':this.cover,'type':'','sampleRate':''};
          folder.name = name;
          folder.fileUrl = fileUrl;
          folder.count = count;
          folder.start = start;
          var index = fileUrl.lastIndexOf(".");
          folder.type = fileUrl.substr(index+1).toUpperCase();
          folder.sampleRate = sampleRate;

          var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
          imgUrl += "?fileUrl=" + encodeURI(fileUrl);
          folder.artWork = imgUrl;

          this.folders.push(folder);
        }
        name = track.folder;
        count = 0;
        start = i;
        fileUrl = track.fileUrl;
        sampleRate = track.sampleRate;
      }
      count ++;
    }
    if(name != ""){
      var folder = {'name':'','fileUrl':'','count':0,start: 0, 'artWork':this.cover,'type':'','sampleRate':''};
      folder.name = name;
      folder.fileUrl = fileUrl;
      folder.count = count;
      folder.start = start;
      var index = fileUrl.lastIndexOf(".");
      folder.type = fileUrl.substr(index+1).toUpperCase();
      folder.sampleRate = sampleRate;
      var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
      imgUrl += "?fileUrl=" + encodeURI(fileUrl);
      folder.artWork = imgUrl;
      this.folders.push(folder);
    }

    // console.log(this.folders);
    // this.refreshFolderCover();
  }

  async refreshFolderCover(){
    // console.log("refreshFolderCover start");
    // console.log(this.folders);

    //refresh cover image
    var len = this.folders.length;
    for(var i=0;i<len;i++){
      var pushdata = {"idx":i,"type":"folder"};
      var mydata = {"action":"getLibArtwork", "fileUrl":this.folders[i].fileUrl,"pushData":JSON.stringify(pushdata)};
      this.wsService.sendJsonrpc(mydata);
    }
  }

  pushFolderImg(idx:any, img:any){
    // console.log(idx);
    var i;
    try{
      i = parseInt(idx);
    }catch(e){
      console.log(e);
      return;
    }
    if(img != "data:image/jpeg;base64,")
      this.folders[i]['artWork'] = img;
  }


  async refreshAlbum(){
    this.tracksByAlbum = [...this.tracks];
    this.tracksByAlbum = this.tracksByAlbum.sort(this.sortByAlbum);
    this.albums = [];

    var name = "";
    var count = 0;
    var fileUrl = "";
    var start = 0;
    var sampleRate = "";
    var len = this.tracksByAlbum.length;
    for(var i=0; i<len; i++){
      var track = this.tracksByAlbum[i];
      if(track.album != name){
        if(name != ""){
          var album = {'name':'','fileUrl':'','count':0,start: 0, 'artWork':this.cover,'type':'','sampleRate':''};
          album.name = name;
          album.fileUrl = fileUrl;
          album.count = count;
          album.start = start;
          var index = fileUrl.lastIndexOf(".");
          album.type = fileUrl.substr(index+1).toUpperCase();
          album.sampleRate = sampleRate;

          var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
          imgUrl += "?fileUrl=" + encodeURI(fileUrl);
          album.artWork = imgUrl;

          this.albums.push(album);
        }
        name = track.album;
        count = 0;
        start = i;
        sampleRate = track.sampleRate;
        fileUrl = track.fileUrl;
      }
      count ++;
    }
    if(name != ""){
      var album = {'name':'','fileUrl':'','count':0,start: 0, 'artWork':this.cover,'type':'','sampleRate':''};
      album.name = name;
      album.fileUrl = fileUrl;
      album.count = count;
      album.start = start;
      var index = fileUrl.lastIndexOf(".");
      album.type = fileUrl.substr(index+1).toUpperCase();
      album.sampleRate = sampleRate;
      var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
      imgUrl += "?fileUrl=" + encodeURI(fileUrl);
      album.artWork = imgUrl;
      this.albums.push(album);
    }

    // this.refreshAlbumCover();
  }

  async refreshAlbumCover(){
    //refresh cover image
    var len = this.albums.length;
    for(var i=0;i<len;i++){
      var pushdata = {"idx":i,"type":"album"};
      var mydata = {"action":"getLibArtwork", "fileUrl":this.albums[i].fileUrl,"pushData":JSON.stringify(pushdata)};
      this.wsService.sendJsonrpc(mydata);
    }
  }

  pushAlbumImg(idx:any, img:any){
    var i;
    try{
      i = parseInt(idx);
    }catch(e){
      console.log(e);
      return;
    }
    if(img != "data:image/jpeg;base64,")
      this.albums[i].artWork = img;
  }


  async refreshArtist(){
    this.tracksByArtist = [...this.tracks];
    this.tracksByArtist = this.tracksByArtist.sort(this.sortByArtist);
    this.artists = [];

    var name = "";
    var count = 0;
    var fileUrl = "";
    var start = 0;
    var sampleRate = "";
    var len = this.tracksByArtist.length;
    for(var i=0; i<len; i++){
      var track = this.tracksByArtist[i];
      if(track.artist != name){
        if(name != ""){
          var artist = {'name':'','fileUrl':'','count':0,start: 0, 'artWork':this.cover,'type':'','sampleRate':''};
          artist.name = name;
          artist.fileUrl = fileUrl;
          artist.count = count;
          artist.start = start;

          var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
          imgUrl += "?fileUrl=" + encodeURI(fileUrl);
          artist.artWork = imgUrl;

          this.artists.push(artist);
        }
        name = track.artist;
        count = 0;
        start = i;
        fileUrl = track.fileUrl;
      }
      count ++;
    }
    if(name != ""){
      var artist = {'name':'','fileUrl':'','count':0,start: 0, 'artWork':this.cover,'type':'','sampleRate':''};
      artist.name = name;
      artist.fileUrl = fileUrl;
      artist.count = count;
      artist.start = start;
      var imgUrl = "http://" + AppConfig.settings.ip + ":" + AppConfig.settings.port + "/getArtwork";
      imgUrl += "?fileUrl=" + encodeURI(fileUrl);
      artist.artWork = imgUrl;
      this.artists.push(artist);
    }

    // this.refreshArtistCover();
  }

  async refreshArtistCover(){
    //refresh cover image
    var len = this.artists.length;
    for(var i=0;i<len;i++){
      var pushdata = {"idx":i,"type":"artist"};
      var mydata = {"action":"getLibArtwork", "fileUrl":this.artists[i].fileUrl,"pushData":JSON.stringify(pushdata)};
      this.wsService.sendJsonrpc(mydata);
    }
  }

  pushArtistImg(idx:any, img:any){
    if(img != "data:image/jpeg;base64,")
      this.artists[idx].artWork = img;
  }

  doRefresh(event:any){
    // setTimeout(() => {
    //   // console.log('Async operation has ended');
    //   event.target.complete();
    // }, 2000);
    this.tracks = [];
    this.tracksByfolder=[];
    this.tracksByAlbum=[];
    this.tracksByArtist=[];
    this.sgLibrary = "";
    this.refreshEvent = event;
    this.getAllTracks();

  }

  showTracksByFolder(folder:any){
    var tracks = [];
    if(folder!=null){
      var tracks = this.tracksByfolder.slice(folder.start, folder.start + folder.count);
    }
        
    this.showTracksPage(tracks,folder);
  }

  showTracksByAlbum(album:any){
    var tracks = [];
    if(album!=null){
      var tracks = this.tracksByAlbum.slice(album.start, album.start + album.count);
    }
        
    this.showTracksPage(tracks,album);
  }

  showTracksByArtist(artist:any){
    var tracks = [];
    if(artist!=null){
      var tracks = this.tracksByArtist.slice(artist.start, artist.start + artist.count);
    }
        
    this.showTracksPage(tracks,artist);
  }

  async showTracksPage(tracks: any, item:any) {
    const modal = await this.modalController.create({
      component: TracklistPage,
      enterAnimation: rightEnterAnimation,
      leaveAnimation: rightLeaveAnimation,
      componentProps: {
        'title':item.name,
        'fileUrl': item.fileUrl,
        'tracks': tracks
      }
    });

    modal.onDidDismiss().then(res=>{
      if(res.data.hasError){
        this.navCtrl.navigateBack("/login");
      }
     });

    return await modal.present();
  }

  segmentChanged(event:any){
    if(this.sgLibrary == "folder"){
      if(this.tracksByfolder.length > 0){
        return;
      }
      this.refreshFolder();
    }else if(this.sgLibrary == "album"){
      if(this.tracksByAlbum.length > 0){
        return;
      }
      this.refreshAlbum();
    }else if(this.sgLibrary == "artist"){
      if(this.tracksByArtist.length > 0){
        return;
      }
      this.refreshArtist();
    }
  }

  
  async search() {
    const modal = await this.modalController.create({
      component: SearchPage,
      enterAnimation: rightEnterAnimation,
      leaveAnimation: rightLeaveAnimation,
      componentProps: {
       
      }
    });

    modal.onDidDismiss().then(res=>{
      if(res.data.hasError){
        this.navCtrl.navigateBack("/login");
      }
     });

    return await modal.present();
  }

  sortByFolder(x,y){
    if (x.folder == y.folder){
      return 0;
    }else if(x.folder < y.folder){
      return -1;
    }else if(x.folder > y.folder){
      return 1;
    }
  }

  sortByArtist(x,y){
    if (x.artist == y.artist){
      return 0;
    }else if(x.artist < y.artist){
      return -1;
    }else if(x.artist > y.artist){
      return 1;
    }
  }

  sortByAlbum(x,y){
    if (x.album == y.album){
      return 0;
    }else if(x.album < y.album){
      return -1;
    }else if(x.album > y.album){
      return 1;
    }
  }

  async sbKeyup(event:any){
    if(event.key != "Enter"){
      return;
    }

    event.target.blur();
  }
}


export class AppConfig {

  public static version = "1.0.0";
  public static env = "dev";
  // public static env = "prd";
  public static fooflyRoot = "/api";
  public static fooflyOffical = "http://foofly.tracemouse.top/";
  public static fooflyVersion = "https://raw.githubusercontent.com/tracemouse/FooFly/master/version.json";

  public static settings = {
    "versionPlugin":"",
    "versionMB":"",
    "platform":"",
    "rootUrl":"",
    "ip" : "",
    "password": "",
    "port": "",
    "protocol":"http:",
    "jsonrpc" : "jsonrpc",
    "language" : "en",
    "interval": 1000,
    "animation": "true",
    "timeout": 0.2,
    "showTrackSeq": "true",
    "musicLib":"0",
    "wkPlaylist":"Foofly Playing"
  };

 
  public static global = {
    "ws_schema":"ws://",
    "http_schema": "http://",
    "scrollHeight": 0,
    "isTablet" : false, 
    "isMobile" : false, 
    "isIOS": false, 
    "isPC" : false,
    "isAndroid": false
  }
  
  public static languages = [
    {'dis':'English','language':'en'},
    {'dis':'简体中文','language':'zh'}
  ];

  public static PlayBackOrder = {
    'default':0,
    'repeatPlalist':1,
    'repeatTrack':2,
    'shuffle':3,
    'shuffleTrack':4,
    'shufflePlaylist':5,
    'shuffleFolder':6
  };
  
  // public static languages = {
  //   'en':'English',
  //   'zh':'简体中文'
  // };

  constructor(){
    this.initSettings();
  }

  initSettings(){

  }

}

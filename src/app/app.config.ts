
export class AppConfig {

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
    "showTrackSeq": "true"
  };

  public static version = "1.0.0";
  public static env = "dev";
  // public static env = "prd";
  public static urlRoot = "/foofly/";
 
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

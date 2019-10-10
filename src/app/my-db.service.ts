import { Injectable } from '@angular/core';
import { SQLite,SQLiteObject  } from '@ionic-native/sqlite/ngx';
import { TranslateService }from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app.config';

@Injectable({
  providedIn: 'root'
})
export class MyDBService {

  
  constructor(private sqlite: SQLite,
              private httpClient:HttpClient,
              private translate: TranslateService) {
    // console.log("db class initialize");
    // this.createDb();
    this.translate.setDefaultLang('en');            
  }

  /**
   * 创建数据库
   */
  async createDb() {
    this.initSettings();
  }

   
  saveSettingsData(){
    for(var key in AppConfig.settings){
      // this.setCookie(key, AppConfig.settings[key]);
      localStorage.setItem(key,AppConfig.settings[key]);
    }

  }

  /**
    * 是否真机环境
    * @return {boolean}
    */
  isMobile(): boolean {
      // return this.platform.is('mobile') && !this.platform.is('mobileweb');
      return false;
  }

  initSettings(){
    // var url = window.location.protocol + "//" + window.location.host;
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var url = window.location.href;
    console.log("init url=" + url);
    console.log("init hostname=" + hostname);
    console.log("init port=" + port);
    // if (url.startsWith("http")){
    //   AppConfig.settings.rootUrl = url;
    // }else{
    //   AppConfig.settings.rootUrl = "http://musicbeeurl:port/";
    // }

    AppConfig.settings.ip = hostname;
    AppConfig.settings.port = port;
    AppConfig.settings.protocol = "http:";
    AppConfig.settings.rootUrl =  AppConfig.settings.protocol + "//" + AppConfig.settings.ip + ":" + AppConfig.settings.port;

    this.initLanguage();

  }

  // setCookie(name,value){
  //   var Days = 30;
  //   var exp = new Date();
  //   exp.setTime(exp.getTime() + Days*360*60*60*1000);
  //   document.cookie = name + "="+ escape (value) + ";expires=" + exp.toUTCString();
  // }

  // getCookie(name){
  //   var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  //   if(arr=document.cookie.match(reg))
  //     return unescape(arr[2]);
  //   else
  //     return null;
  // }

  // delCookie(name){
  //   var exp = new Date();
  //   exp.setTime(exp.getTime() - 1);
  //   var cval=this.getCookie(name);
  //   if(cval!=null)
  //     document.cookie= name + "="+cval+";expires="+exp.toUTCString();
  // }

  getBrowserLang() {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
        return undefined;
    }
    /** @type {?} */
    let browserLang = window.navigator.languages ? window.navigator.languages[0] : null;
    browserLang = browserLang || window.navigator.language;
    // if (browserLang.indexOf('-') !== -1) {
    //     browserLang = browserLang.split('-')[0];
    // }
    // if (browserLang.indexOf('_') !== -1) {
    //     browserLang = browserLang.split('_')[0];
    // }
    browserLang = browserLang.replace("_","-");
    return browserLang.toLowerCase();
  }

  initLanguage(){
    var url = "assets/i18n/languages.json";
    this.httpClient.get(url).subscribe(
      (data:any) =>{
        var languages = data.languages;
        this.setLanuage(languages);
      },
      error=>{
        console.log("failed to get the languages json file from " + url)
        this.setLanuage(null);
      }
    );
  }

  setLanuage(languages:any){
    if(languages){
      AppConfig.languages = languages;
    }

    console.log("supported lanuages:");
    console.log(AppConfig.languages);

    var language = "en";
    this.translate.setDefaultLang(language);

    // var bLanguage = this.translate.getBrowserLang();
    var bLanguage = this.getBrowserLang();
    if(bLanguage.startsWith("zh-c")){
      bLanguage = "zh";
    }else if(bLanguage.startsWith("zh")){
      bLanguage = "zh-TW";
    }else if(bLanguage == "en-US"){
      bLanguage = bLanguage;
    }else if(bLanguage.startsWith("en")){
      bLanguage = "en";
    }else{   
        if (bLanguage.indexOf('-') !== -1) {
          bLanguage = bLanguage.split('-')[0];
        }
    }
    if (bLanguage !==undefined){
      console.log("browser language=" + bLanguage);
      var len = AppConfig.languages.length;
      for(var i=0; i<len;i++){
        if(AppConfig.languages[i].language == bLanguage){
          language = bLanguage;
          break;
        }
      }
    }
    console.log("init language=" + language);
    AppConfig.settings.language = language;
    // this.translate.use(language);

    //check cookie
    for(var key in AppConfig.settings){
      // var cValue = this.getCookie(key);
      var cValue = localStorage.getItem(key);
      if(cValue == null){
        // this.setCookie(key, AppConfig.settings[key]);
        localStorage.setItem(key,AppConfig.settings[key]);
      }else{
        AppConfig.settings[key] = cValue;
      }
    }

    console.log("final language=" + AppConfig.settings.language);

    console.log("final settings:");
    console.log(AppConfig.settings);

    this.translate.use(AppConfig.settings.language);
  }

}
import { Injectable } from '@angular/core';
import { SQLite,SQLiteObject  } from '@ionic-native/sqlite/ngx';
import { AppConfig } from './app.config';
import { TranslateService }from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class MyDBService {

  dbname = "MusicBee.db";

  database: SQLiteObject;
  win_db: any;//H5数据库对象
  win: any = window;//window对象
  constructor(private sqlite: SQLite,
              private translate: TranslateService) {
    // console.log("db class initialize");
    // this.createDb();
    this.translate.setDefaultLang('en');            
  }

  /**
   * 创建数据库
   */
  async createDb() {
      if (this.isMobile()) {
          // this.sqlite.create({
          //     name: this.dbname,
          //     location: 'default'
          // })
          //     .then((db: SQLiteObject) => {
          //         this.database = db;
          //         //创建表如果已存在就创建
                
          //         if (this.storage.read('db:create') != "Yes") {
          //           //创建表
          //           this.createTable();
          //         } else {
          //           this.events.publish('db:create');
          //         }
                  
          //     })
          //     .catch(e => {
          //         console.log(e);
          //         this.events.publish('db:create');
          //     });
        } else {
          //H5数据库存储
          this.win_db = this.win.openDatabase(this.dbname, '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
          
          await this.initTable();
        }
  }

  /**
   * 创建表
   */
  async initTable() {
      // this.querySql('', []);
      //可能存在多个执行创建表语句，只需最后一个使用await 

    // this.executeSql('drop table settings;', []);
    var sql = "PRAGMA synchronous = OFF;";
    this.executeSql(sql,[]);

      //init settings table
      var sql = "SELECT count(*) count from sqlite_master where type='table' and name='settings';";
      this.executeSql(sql,[]).then(res=>{
        var count = res.rows[0].count;
        // console.log("count=" + res.rows[0].count);
        if(count == 0){
          console.log("settings table does not exist");
          this.initSettings();
          this.translate.use(AppConfig.settings.language);
          this.createSettingsTable();
        }else{
          console.log("settings table does exist");
          this.getSettings();
        }
      });

      //init lib table
      var sql = "SELECT count(*) count from sqlite_master where type='table' and name='lib';";
      await this.executeSql(sql,[]).then(res=>{
        var count = res.rows[0].count;
        // console.log("count=" + res.rows[0].count);
        if(count == 0){
          console.log("lib table does not exist");
          this.createLibTable();
        }
      });
      // this.executeSql('CREATE TABLE settings(setting_key TEXT PRIMARY KEY, setting_value TEXT)', []);
      // await this.executeSql('INSERT INTO settings(setting_key, setting_value) VALUES("URL","123");', []);
      // this.events.publish('db:create');
      // this.storage.write('db:create', "Yes");
  }

  createSettingsTable(){
    var sql = 'CREATE TABLE settings(key TEXT PRIMARY KEY, value TEXT)';
    this.executeSql(sql,[]).then(res=>{
      console.log("settings table create successfully");
      this.initSettingsData();
    }
    );
  }

  createLibTable(){
    var sql = "CREATE TABLE lib(" +
                                "album TEXT, " + 
                                "albumArtist TEXT," +
                                "artist TEXT," + 
                                "bitRate TEXT," +
                                "channels TEXT," +
                                "duration TEXT," +
                                "encoder TEXT," +
                                "fileUrl TEXT," +
                                "folder TEXT," +
                                "format TEXT," +
                                "hasLyrics TEXT," +
                                "lyricist TEXT," +
                                "lyrics TEXT," +
                                "nowPlayingListIndex TEXT," +
                                "playCount TEXT," +
                                "sampleRate TEXT," +
                                "size TEXT," +
                                "trackTitle TEXT" +
                                ")";
    this.executeSql(sql,[]).then(res=>{
      console.log("lib table create successfully");
    }
    );
  }

  clearLibTable(){
    var sql = "DELETE FROM lib";
    // this.executeSql(sql,[]).then(res=>{
    //     // console.log("lib table delete successfully");
    //   }
    // );
    return this.executeSql(sql,[]);
  }

  async insertTrack(track:any){
 
    var sql = "INSERT INTO lib( " +
                                "album , " + 
                                "albumArtist," +
                                "artist," + 
                                "bitRate," +
                                "channels," +
                                "duration," +
                                "encoder," +
                                "fileUrl," +
                                "folder," +
                                "format," +
                                "hasLyrics," +
                                "lyricist," +
                                "lyrics," +
                                "nowPlayingListIndex," +
                                "playCount," +
                                "sampleRate," +
                                "size," +
                                "trackTitle" +
                ") VALUES(" + 
                                this.escapteSQL(track.album) + "," +
                                this.escapteSQL(track.albumArtist) + "," +
                                this.escapteSQL(track.artist) + "," +
                                this.escapteSQL(track.bitRate) + "," +
                                this.escapteSQL(track.channels) + "," +
                                this.escapteSQL(track.duration) + "," +
                                this.escapteSQL(track.encoder) + "," +
                                this.escapteSQL(track.fileUrl) + "," +
                                this.escapteSQL(track.folder) + "," +
                                this.escapteSQL(track.format) + "," +
                                this.escapteSQL(track.hasLyrics) + "," +
                                this.escapteSQL(track.lyricist) + "," +
                                this.escapteSQL(track.lyrics) + "," +
                                this.escapteSQL(track.nowPlayingListIndex) + "," +
                                this.escapteSQL(track.playCount) + "," +
                                this.escapteSQL(track.sampleRate) + "," +
                                this.escapteSQL(track.size) + "," +
                                this.escapteSQL(track.trackTitle) + ");"
    ;
    // console.log(sql);
    // this.executeSql(sql,[]).then(res=>{
    //     // console.log("lib table delete successfully");
    //   }
    // );
    return this.executeSql(sql,[]);
  }

  async insertTracks(tracks:any){
 
    var sql = "INSERT INTO lib( " +
                                "album , " + 
                                "albumArtist," +
                                "artist," + 
                                "bitRate," +
                                "channels," +
                                "duration," +
                                "encoder," +
                                "fileUrl," +
                                "folder," +
                                "format," +
                                "hasLyrics," +
                                "lyricist," +
                                "lyrics," +
                                "nowPlayingListIndex," +
                                "playCount," +
                                "sampleRate," +
                                "size," +
                                "trackTitle" +
                ") ";
     
     var sqls =  [];
     var len = tracks.length;
     for(var i=0; i<len; i++){      
      var track = tracks[i];     
      sql += "SELECT " +
                this.escapteSQL(track.album) + "," +
                this.escapteSQL(track.albumArtist) + "," +
                this.escapteSQL(track.artist) + "," +
                this.escapteSQL(track.bitRate) + "," +
                this.escapteSQL(track.channels) + "," +
                this.escapteSQL(track.duration) + "," +
                this.escapteSQL(track.encoder) + "," +
                this.escapteSQL(track.fileUrl) + "," +
                this.escapteSQL(track.folder) + "," +
                this.escapteSQL(track.format) + "," +
                this.escapteSQL(track.hasLyrics) + "," +
                this.escapteSQL(track.lyricist) + "," +
                this.escapteSQL(track.lyrics) + "," +
                this.escapteSQL(track.nowPlayingListIndex) + "," +
                this.escapteSQL(track.playCount) + "," +
                this.escapteSQL(track.sampleRate) + "," +
                this.escapteSQL(track.size) + "," +
                this.escapteSQL(track.trackTitle)
          ;
      sqls[i] = sql;
     }
    // console.log(sql);
    // this.executeSql(sql,[]).then(res=>{
    //     // console.log("lib table delete successfully");
    //   }
    // );
    return await this.executeSql(sqls,[]);
  }


  getFolders(){
      var sql = "select folder, fileUrl, min(rowid),count(*) as count from lib group by folder;";
      return this.executeSql(sql,[]);
  }

  getAlbums(){
    var sql = "select Album, fileUrl, min(rowid),count(*) as count from lib group by Album;";
    return this.executeSql(sql,[]);
  }

  getArtists(){
    var sql = "select Artist,count(*) as count from lib group by Artist;";
    return this.executeSql(sql,[]);
  }

  getTracksByFolder(folder:string){
    var sql = "select * from lib where folder=" + this.escapteSQL(folder);
    return this.executeSql(sql,[]);
  }

  getTracksByAlbum(album:string){
    var sql = "select * from lib where album=" + this.escapteSQL(album);
    return this.executeSql(sql,[]);
  }

  getTracksByArtist(artist:string){
    var sql = "select * from lib where artist=" + this.escapteSQL(artist);
    return this.executeSql(sql,[]);
  }

  searchTracks(str:string){
    str = "%" + str + "%";
    var sql = "select * from lib where trackTitle like " + this.escapteSQL(str);
    sql += " or album like " + this.escapteSQL(str);
    sql += " or folder like " + this.escapteSQL(str);
    sql += " or artist like " + this.escapteSQL(str);
    // console.log(sql);
    return this.executeSql(sql,[]);
  }

  initSettingsData(){
    for(var key in AppConfig.settings){
      var sql = 'INSERT INTO settings(key, value) VALUES("' + key + '","'+  AppConfig.settings[key] + '");';
      // console.log(sql);
      this.executeSql(sql,[]);
    }

  }

  saveSettingsData(){
    for(var key in AppConfig.settings){
      var sql = 'UPDATE settings set value = "'+  AppConfig.settings[key] + '" WHERE key = "' + key + '";';
      // console.log(sql);
      this.executeSql(sql,[]);
    }

  }

  getSettings(){
    var sql = 'SELECT * FROM settings';
    this.executeSql(sql,[]).then(res=>{
      console.log("settings table read successfully");
      var rows = res.rows;
      // console.log(rows);
      for(var i=0; i<rows.length; i++){
        // console.log(rows[i]);
        AppConfig.settings[rows[i].key] = rows[i].value;
      }
      console.log(AppConfig.settings);
      this.translate.use(AppConfig.settings.language);
    });
  }


  /**
   * 执行语句
   */
  executeSql(sql: any, array: Array<string>): Promise<any> {
      return new Promise((resolve, reject) => {
          if (this.isMobile()) {
              if (!!!!this.database) {
                  this.database.executeSql(sql, array).then((data) => {
                      resolve(data);
                  }, (err) => {
                      reject(err);
                      console.log('Unable to execute sql: ' + err);
                  });

              } else {
                  return new Promise((resolve) => {
                      resolve([]);
                  });
              }
          } else {
              if (this.win_db) {
                  return this.execWebSql(sql, array).then(data => {
                      resolve(data);
                  }).catch(err => {
                      console.log(err);
                  });
              }
          }
      });
  }
  /**
   * 查询H5数据库
   */
  execWebSql(sql: any, params: Array<string>): Promise<any> {
    
      return new Promise((resolve, reject) => {
          try {
              this.win_db.transaction((tx) => {
                if(typeof sql == "string"){
                  tx.executeSql(sql, params,
                    (tx, res) => resolve(res),
                    (tx, err) => reject(err));
                }else{
                  var len = sql.length;
                  for(var i=0; i < len; i++){
                    var str = sql[i];
                    console.log(str);
                    if(i == len-1){
                      tx.executeSql(sql, params);
                    }else{
                      tx.executeSql(sql, params,
                        (tx, res) => resolve(res),
                        (tx, err) => reject(err));
                    }
                  }
                }
              },
                  (err) => reject(err));
          } catch (err) {
              reject(err);
          }
      });
  }

  /**
    * 是否真机环境
    * @return {boolean}
    */
  isMobile(): boolean {
      // return this.platform.is('mobile') && !this.platform.is('mobileweb');
      return false;
  }

  public escapteSQL(str:string){
    return "'" + str.replace(/'/g,"''") + "'";
  }

  initSettings(){
    var url = window.location.protocol + "//" + window.location.host;
    console.log("init url=" + url);
    if (url.startsWith("http")){
      AppConfig.settings.rootUrl = url;
    }else{
      AppConfig.settings.rootUrl = "http://musicbeeurl:port/";
    }

    // console.log("translate=" + this.translate.getBrowserLang());
  
    if (this.translate.getBrowserLang() !==undefined){
      AppConfig.settings.language = this.translate.getBrowserLang();
      this.translate.use(this.translate.getBrowserLang());
    }else {
      AppConfig.settings.language = "en";
      this.translate.use('en');
    }
  }


}
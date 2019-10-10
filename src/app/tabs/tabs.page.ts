import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  flag = 'tab1';

  constructor() {}
  
  change(event:any){
    this.flag=event.detail.tab;
  }
}


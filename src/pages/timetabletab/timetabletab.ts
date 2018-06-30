import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-timetabletab',
  templateUrl: 'timetabletab.html',
})
export class TimetabletabPage {
  dayOftimetable: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dayOftimetable = navParams.data.displayTitle;
  }

}

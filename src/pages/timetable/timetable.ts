import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimetabletabPage } from '../timetabletab/timetabletab';

/**
 * Generated class for the TimetablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {
  timeTableDays = [
    { title: 'วันจันทร์', page: TimetabletabPage },
    { title: 'พุธ', page: TimetabletabPage },
    { title: 'ศุกร์', page: TimetabletabPage },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  }

}

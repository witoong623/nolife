import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject, Period } from '../../models/models';

@IonicPage()
@Component({
  selector: 'page-timetabletab',
  templateUrl: 'timetabletab.html',
})
export class TimetabletabPage {
  dayOftimetable: string;
  displayTitle: string;
  subjects: Subject[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.dayOftimetable = navParams.data.dayOftimetable;
    this.displayTitle = navParams.data.displayTitle;
    let tempSubjects: Subject[] = navParams.data.data.slice();

    // filter subjects that don't have lecture today
    tempSubjects = tempSubjects.filter(subject => {
      for (let period of subject.periods) {
        if (period.day === this.dayOftimetable) {
          return true;
        }
      }
      return false;
    });

    this.subjects = tempSubjects;
  }

}

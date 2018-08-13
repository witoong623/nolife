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

    // sort to show period that comes first show first
    // TODO: take care the case when a subject has 2 periods in same day
    tempSubjects.sort((a, b) => {
      let aPeriod: Period;
      let bPeriod: Period;
  
      for (let period of a.periods) {
        if (period.day === this.dayOftimetable) {
          aPeriod = period;
          break;
        }
      }
  
      for (let period of b.periods) {
        if (period.day === this.dayOftimetable) {
          bPeriod = period;
          break;
        }
      }
  
      if (aPeriod.startMoment.isBefore(bPeriod.startMoment, 'minute')) {
        return -1;
      } else if (aPeriod.startMoment.isAfter(bPeriod.startMoment, 'minute')) {
        return 1;
      } else {
        return 0;
      }
    });

    this.subjects = tempSubjects;
  }

  private comparePeriodSubject(a: Subject, b: Subject): number {
    let aPeriod: Period;
    let bPeriod: Period;

    for (let period of a.periods) {
      if (period.day === this.dayOftimetable) {
        aPeriod = period;
        break;
      }
    }

    for (let period of b.periods) {
      if (period.day === this.dayOftimetable) {
        bPeriod = period;
        break;
      }
    }

    if (aPeriod.startMoment.isBefore(bPeriod.startMoment, 'minute')) {
      return -1;
    } else if (aPeriod.startMoment.isAfter(bPeriod.startMoment, 'minute')) {
      return 1;
    } else {
      return 0;
    }
  }

}

import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { TimetabletabPage } from '../timetabletab/timetabletab';
import { AddtimetablePage } from '../addtimetable/addtimetable';
import { Subject } from '../../models/models';
import { getCurrentSemester, getDisplayTitle } from '../../utilities/datetimeutility';
import { AppDbProvider } from '../../providers/app-db/app-db';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  timeTableDays: any[] = [];
  selectedTabIndex: number;
  dayOrderRef = {
    mon: 0,
    tue: 1,
    wed: 2,
    thu: 3,
    fri: 4,
    sat: 5,
    sun: 6
  };

  reverseDayRef = {
    0: 'mon',
    1: 'tue',
    2: 'wed',
    3: 'thu',
    4: 'fri',
    5: 'sat',
    6: 'sun'
  };

  constructor(public navCtrl: NavController,public plt: Platform, private appDb: AppDbProvider) {
  }

  openAddTimetable(): void {
    this.navCtrl.push(AddtimetablePage);
  }

  private createTabTimetable(): void {
    this.timeTableDays.length = 0;
    let subjects: Subject[];
    let curSemester = getCurrentSemester()
    this.appDb.getAllSubjects(curSemester)
      .then(results => {
        // results is only subjects but not include periods
        subjects = results;

        // fetch periods for each subject
        let periodsLoadPremises = subjects.map(subject => {
          return this.appDb.getPeriods(subject.subId, curSemester)
            .then(periods => {
              subject.periods = periods;
              // return empty so that i get Promise<void>
              return;
            });
        });

        // wait for all periods fetching async to complete
        return Promise.all(periodsLoadPremises);
      })
      .then(() => {
        // classify subject into day of week, at this point every periods has been fetched
        let dayofweekDic = {}
        for (let i = 0; i < subjects.length; i++) {
          for (let j = 0; j < subjects[i].periods.length; j++) {
            if (!dayofweekDic[subjects[i].periods[j].day]) {
              dayofweekDic[subjects[i].periods[j].day] = []
            }

            dayofweekDic[subjects[i].periods[j].day].push(subjects[i])
          }
        }
        
        // availableDay is for fiding index of selected tab
        let availableDay: string[] = [];

        // build array of timetable
        for (let key in dayofweekDic) {
          if (dayofweekDic.hasOwnProperty(key)) {
            let vm: any = {};
            vm.day = key;
            vm.displayTitle = getDisplayTitle(key);
            vm.page = TimetabletabPage;
            vm.data = dayofweekDic[key];

            this.timeTableDays.push(vm);
            availableDay.push(key);
          }
        }
        
        this.selectedTabIndex = this.selectTabIndex(availableDay);
        this.timeTableDays.sort((a, b) => this.dayOrderRef[a.day] - this.dayOrderRef[b.day]);
      })
      .catch(e => console.log(e));
  }

  private selectTabIndex(availableDay: string[]): number {
    if (availableDay.length === 0) {
      return -1;
    }

    let now = new Date();
    let todayOfWeek = (now.getDay() + 6) % 7
    let todayName = this.reverseDayRef[todayOfWeek];

    let dayIndex = availableDay.indexOf(todayName);

    if (dayIndex >= 0) {
      return dayIndex;
    } else {
      // today is not in available day, find next day
      let loopCount = 1;
      for (let nextDay = (todayOfWeek + 1) % 7; loopCount < 7; nextDay += (nextDay + 1) % 7) {
        dayIndex = availableDay.indexOf(this.reverseDayRef[nextDay])
        if (dayIndex >= 0) {
          return dayIndex;
        } else {
          loopCount++;
        }
      }
    }

    // code shouldn't reach here, just return -1
    return 0;
  }

  ionViewDidLoad() {
    this.createTabTimetable()
  }

}

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController, private appDb: AppDbProvider) {
    this.selectedTabIndex = this.selectTabIndex();
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
        
        // build array of timetable
        for (let key in dayofweekDic) {
          if (dayofweekDic.hasOwnProperty(key)) {
            let vm: any = {};
            vm.day = key;
            vm.displayTitle = getDisplayTitle(key);
            vm.page = TimetabletabPage;
            vm.data = dayofweekDic[key];

            this.timeTableDays.push(vm);
          }
        }

        this.timeTableDays.sort((a, b) => this.dayOrderRef[a.day] - this.dayOrderRef[b.day]);
      })
      .catch(e => console.log(e));
  }

  private selectTabIndex(): number {
    let now = new Date();
    return now.getDay() - 1;
  }

  ionViewDidEnter() {
    this.createTabTimetable();
  }

}

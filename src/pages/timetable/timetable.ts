import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimetabletabPage } from '../timetabletab/timetabletab';
import { AddtimetablePage } from '../addtimetable/addtimetable';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { Subject, Semester, DayOfWeek } from '../../models/models';

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {
  timeTableDays: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public appDb: AppDbProvider) {
  }

  openAddTimetable(): void {
    this.navCtrl.push(AddtimetablePage);
  }

  private createTabTimetable(): void {
    this.timeTableDays.length = 0;
    let subjects: Subject[];
    this.appDb.getAllSubjects(new Semester(1, 2561))
      .then(results => {
        // results is only subjects but not include periods
        subjects = results;

        // fetch periods for each subject
        let periodsLoadPremises = subjects.map(subject => {
          return this.appDb.getPeriods(subject.subId)
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
            vm.displayTitle = this.getDisplayTitle(key);
            vm.page = TimetabletabPage;
            vm.data = dayofweekDic[key];

            this.timeTableDays.push(vm);
          }
        }

        console.log(`there are ${this.timeTableDays.length} items in timeTableDays`);
      })
      .catch(e => console.log(e));
  }

  private getDisplayTitle(key: string) {
    switch (key) {
      case DayOfWeek.Monday:
        return 'จันทร์';
      case DayOfWeek.Tuesday:
        return 'อังคาร';
      case DayOfWeek.Wednesday:
        return 'พุธ';
      case DayOfWeek.Thursday:
        return 'พฤหัส';
      case DayOfWeek.Friday:
        return 'ศุกร์';
      case DayOfWeek.Saturday:
        return 'เสาร์';
      case DayOfWeek.Sunday:
        return 'อาทิตย์';
    }
  }

  ionViewDidEnter() {
    this.createTabTimetable();
  }
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Semester, Subject, Period, DayOfWeek, PeriodNotification } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester, getJSDay } from '../../utilities/datetimeutility';
import { Storage } from '@ionic/storage';
import * as settings from '../setting/setting';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-addtimetable',
  templateUrl: 'addtimetable.html',
})
export class AddtimetablePage {
  form: FormGroup;
  availableSemesters: Semester[];
  private notibeforePeriod: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private appDb: AppDbProvider, private storage: Storage) {
    const currentSemester = getCurrentSemester();

    // TODO: do i have to specify default value of semester?
    this.form = this.formBuilder.group({
      subId: ['', Validators.required],
      subName: ['', Validators.required],
      lecturer: ['', Validators.required],
      semester: `${currentSemester.semester} ${currentSemester.year}`,
      periods: this.formBuilder.array([this.initStudyTimeField()])
    });
  }

  initStudyTimeField(): FormGroup {
    return this.formBuilder.group({
      day: ['', Validators.required],
      startTime: ['08:00', Validators.required],
      endTime: ['11:30', Validators.required],
      room: ''
    });
  }

  addNewInputField(): void {
    const control = <FormArray>this.form.controls.periods;
    control.push(this.initStudyTimeField());
  }

  removeInputField(i: number): void {
    const control = <FormArray>this.form.controls.periods;
    control.removeAt(i);
  }

  async onSubmit(val: any): Promise<void> {
    let splitedSemester: string[] = val.semester.split(' ');
    let semester = new Semester(parseInt(splitedSemester[0]), parseInt(splitedSemester[1]));
    let s = new Subject(val.subId, val.subName, val.lecturer, semester);
    let periods: Period[] = [];

    val.periods.forEach(period => {
      let np = new Period(<DayOfWeek>period.day, period.startTime, period.endTime, period.room, val.subId, semester);
      periods.push(np);
    });
    s.periods = periods;
    
    await this.appDb.saveTimetable(s);
    await this.setupNotification(s.subId, semester);
    this.navCtrl.pop();
  }

  async setupNotification(subId: string, semester: Semester): Promise<void> {
    let subject = await this.appDb.getSubject(subId, semester);
    subject.periods = await this.appDb.getPeriods(subId, semester);

    let notifications: PeriodNotification[] = [];

    for (let period of subject.periods) {
      let notification = new PeriodNotification(subject.subId,
                                                subject.name,
                                                subject.semester,
                                                period.id,
                                                period.startTime,
                                                this.notibeforePeriod,
                                                period.day, period.room);
      notifications.push(notification);
    }
    
    for (let notification of notifications) {
      let notiId = await this.appDb.savePeriodNotification(notification);
      let scheduleOption = {
        id: notiId,
        title: `วิชาต่อไป ${notification.subName}`,
        text: `วิชา ${notification.subName}\nเวลา ${notification.startTime} ห้อง ${notification.room}`,
        trigger: { every : { weekday: getJSDay(notification.weekday), hour: notification.hour, minute: notification.minute, count: 1 } }
      };

      cordova.plugins.notification.local.schedule(scheduleOption);
    }
  }

  async loadData(): Promise<void> {
    this.availableSemesters = await this.appDb.getAllSemesters();
    this.notibeforePeriod = await settings.getSettingValue(settings.NOTIFYBEFOREPERIOD, settings.NOTIFYBEFOREPERIOD_DEFAULT, this.storage);
  }

  ionViewDidLoad() {
    this.loadData();
  }
}

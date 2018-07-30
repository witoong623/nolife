import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { Semester, Subject, Period, DayOfWeek } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';

@IonicPage()
@Component({
  selector: 'page-addtimetable',
  templateUrl: 'addtimetable.html',
})
export class AddtimetablePage {
  form: FormGroup;
  availableSemesters: Semester[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private appDb: AppDbProvider) {
    const currentYear = (new Date()).getFullYear();
    const currentSemester = this.getCurrentSemester();

    // TODO: do i have to specify default value of semester
    this.form = this.formBuilder.group({
      subId: ['', Validators.required],
      subName: ['', Validators.required],
      lecturer: ['', Validators.required],
      semester: `${currentSemester} ${currentYear}`,
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

  onSubmit(val: any): void {
    console.log(val);
    let splitedSemester: string[] = val.semester.split(' ');
    let semester = new Semester(parseInt(splitedSemester[0]), parseInt(splitedSemester[1]));
    let s = new Subject(val.subId, val.subName, val.lecturer, semester);
    let periods: Period[] = [];

    val.periods.forEach(period => {
      let np = new Period(<DayOfWeek>period.day, period.startTime, period.endTime, period.room, val.subId);
      periods.push(np);
    });
    s.periods = periods;
    
    this.appDb.saveTimetable(s)
        .then(() => this.navCtrl.pop())
        .catch(e => console.log(e));
  }

  ionViewDidLoad() {
    this.appDb.getAllSemesters()
        .then(semesters => this.availableSemesters = semesters)
        .catch(e => console.log('AddtimetablePage', e));
  }

  // TODO: this method depends on fixed pattern of semester in Thailand
  private getCurrentSemester(): number {
    const currentMonth = (new Date()).getMonth();

    if (currentMonth >= 9) {
      return 2;
    } else if (currentMonth >= 5) {
      return 1;
    } else {
      return 3
    }
  }
}

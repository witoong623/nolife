import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester } from '../../utilities/datetimeutility';
import { AddtimetablePage } from '../addtimetable/addtimetable';

@IonicPage()
@Component({
  selector: 'page-subject',
  templateUrl: 'subject.html',
})
export class SubjectPage {
  subjects: Subject[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private appDb: AppDbProvider) {

  }

  subjectSelected(subject: Subject): void {

  }

  openAddTimetable(): void {
    this.navCtrl.push(AddtimetablePage);
  }

  private loadSubjects(): void {
    this.appDb.getAllSubjects(getCurrentSemester())
      .then(results => this.subjects = results);
  }

  ionViewDidEnter() {
    this.loadSubjects();
  }

}

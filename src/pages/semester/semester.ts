import { AddSemesterPage } from './../add-semester/add-semester';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Semester } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';

@IonicPage()
@Component({
  selector: 'page-semester',
  templateUrl: 'semester.html',
})
export class SemesterPage {
  semesters: Semester[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public appDb: AppDbProvider) {
  }

  ionViewDidEnter() {
    this.appDb.getAllSemesters()
        .then(results => this.semesters = results)
        .catch(e => console.log('SemesterPage', e));
  }

  semesterSelected(semester: Semester) {

  }

  openAddSemester() {
    this.navCtrl.push(AddSemesterPage)
  }

}

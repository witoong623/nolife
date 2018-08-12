import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Homework } from '../../models/models';
import { AddHomeworkPage } from '../add-homework/add-homework';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester } from '../../utilities/datetimeutility';

@IonicPage()
@Component({
  selector: 'page-homework',
  templateUrl: 'homework.html',
})
export class HomeworkPage {
  public homeworks: Homework[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private appDb: AppDbProvider) {
  }

  homeworkSelected(homework: Homework): void {

  }

  openAddHomework(): void {
    this.navCtrl.push(AddHomeworkPage);
  }

  ionViewDidEnter(): void {
    this.appDb.getAllHomeworks(getCurrentSemester())
      .then(homeworks => this.homeworks = homeworks);
  }
}

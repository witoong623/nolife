import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Homework } from '../../models/models';
import { AddHomeworkPage } from '../add-homework/add-homework';

@IonicPage()
@Component({
  selector: 'page-homework',
  templateUrl: 'homework.html',
})
export class HomeworkPage {
  public homeworks: Homework[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  homeworkSelected(homework: Homework): void {

  }

  openAddHomework(): void {
    this.navCtrl.push(AddHomeworkPage);
  }

}

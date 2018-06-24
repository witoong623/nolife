import { AddSemesterPage } from './../add-semester/add-semester';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SemesterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-semester',
  templateUrl: 'semester.html',
})
export class SemesterPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SemesterPage');
  }

  openAddSemester() {
    this.navCtrl.push(AddSemesterPage)
  }

}

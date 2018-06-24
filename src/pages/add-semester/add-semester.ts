import { AppDbProvider } from './../../providers/app-db/app-db';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-semester',
  templateUrl: 'add-semester.html',
})
export class AddSemesterPage {
  semester: number;
  year: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public appDb: AppDbProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddSemesterPage');
  }

  ngOnInit() {}

}

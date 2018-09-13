import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester } from '../../utilities/datetimeutility';

@IonicPage()
@Component({
  selector: 'page-subject-detail',
  templateUrl: 'subject-detail.html',
})
export class SubjectDetailPage {
  public subject: Subject

  constructor(public navCtrl: NavController, public navParams: NavParams, private appDb: AppDbProvider) {
    this.subject = this.navParams.get('subject');
  }

  ionViewDidLoad() {
    this.appDb.getPeriods(this.subject.subId, getCurrentSemester())
      .then(periods => this.subject.periods = periods);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Subject, Period } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester } from '../../utilities/datetimeutility';

@IonicPage()
@Component({
  selector: 'page-subject-detail',
  templateUrl: 'subject-detail.html',
})
export class SubjectDetailPage {
  public subject: Subject

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appDb: AppDbProvider,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {
    this.subject = this.navParams.get('subject');
  }

  ionViewDidLoad() {
    this.appDb.getPeriods(this.subject.subId, getCurrentSemester())
      .then(periods => this.subject.periods = periods);
  }

  onPress(period: Period): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'ต้องการ',
      buttons: [
        {
          text: 'ลบ',
          role: 'destructive',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: `ลบ ${period.dayOfWeekThai}?`,
              message: `ต้องการจะลบ ${period.dayOfWeekThai} เวลา ${period.startTime} ใช่หรือไม่`,
              buttons: [
                {
                  text: 'ยกเลิก',
                  role: 'cancel'
                },
                {
                  text: 'ตกลง',
                  handler: () => {
                    this.appDb.deletePeriod(period.id).then(() => {
                      let index = this.subject.periods.indexOf(period);
                      this.subject.periods.splice(index, 1);
                    });
                  }
                }
              ]
            });
            alert.present();
          },
          icon: 'trash'
        }
      ]
    });
    actionSheet.present();
  }

}

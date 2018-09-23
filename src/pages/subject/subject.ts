import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Subject } from '../../models/models';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester } from '../../utilities/datetimeutility';
import { AddtimetablePage } from '../addtimetable/addtimetable';
import { SubjectDetailPage } from '../subject-detail/subject-detail';

@IonicPage()
@Component({
  selector: 'page-subject',
  templateUrl: 'subject.html',
})
export class SubjectPage {
  subjects: Subject[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appDb: AppDbProvider,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {

  }

  onPress(subject: Subject): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'ต้องการ',
      buttons: [
        {
          text: 'ลบ',
          role: 'destructive',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: `ลบ ${subject.name}?`,
              message: `ต้องการจะลบ ${subject.name} ใช่หรือไม่`,
              buttons: [
                {
                  text: 'ยกเลิก',
                  role: 'cancel'
                },
                {
                  text: 'ตกลง',
                  handler: () => {
                    this.appDb.deleteSubject(subject.subId, subject.semester).then(() => this.loadSubjects());
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

  subjectSelected(subject: Subject): void {
    this.navCtrl.push(SubjectDetailPage, {subject: subject});
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

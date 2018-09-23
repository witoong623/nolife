import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appDb: AppDbProvider,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController) {
  }

  onPress(homework: Homework): void {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'ต้องการ',
      buttons: [
        {
          text: 'ลบ',
          role: 'destructive',
          handler: () => {
            let alert = this.alertCtrl.create({
              title: `ลบ ${homework.topic}?`,
              message: `ต้องการจะลบ ${homework.topic} ใช่หรือไม่`,
              buttons: [
                {
                  text: 'ยกเลิก',
                  role: 'cancel'
                },
                {
                  text: 'ตกลง',
                  handler: () => {
                    this.appDb.deleteHomework(homework).then(() => this.loadData());
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

  openAddHomework(): void {
    this.navCtrl.push(AddHomeworkPage);
  }

  ionViewDidEnter(): void {
    this.loadData();
  }

  private loadData() {
    this.appDb.getAllHomeworks(getCurrentSemester())
      .then(homeworks => this.homeworks = homeworks);
  }
}

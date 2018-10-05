import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { Homework, HomeworkStatus } from '../../models/models';
import { AddHomeworkPage } from '../add-homework/add-homework';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { getCurrentSemester } from '../../utilities/datetimeutility';
import { AppNotificationProvider } from '../../providers/AppNotificationProvider';

@IonicPage()
@Component({
  selector: 'page-homework',
  templateUrl: 'homework.html',
})
export class HomeworkPage {
  status: string = HomeworkStatus.Undone;
  undoneHomeworks: Homework[];
  doneHomeworks: Homework[];
  overdueHomeworks: Homework[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private appDb: AppDbProvider,
              private actionSheetCtrl: ActionSheetController,
              private alertCtrl: AlertController,
              private appNoti: AppNotificationProvider) {
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
        },
        {
          text: 'ทำเสร็จแล้ว',
          handler: () => {
            this.appDb.updateHomework(homework.id, HomeworkStatus.Done).then(() => this.appNoti.deleteHomeworkNotification(homework)).then(() => this.loadData());
          },
          icon: 'checkmark-circle'
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

  private async loadData() {
    let homeworks = await this.appDb.getAllHomeworks(getCurrentSemester());
    this.undoneHomeworks = homeworks.filter(homework => homework.status == HomeworkStatus.Undone);
    this.doneHomeworks = homeworks.filter(homeworks => homeworks.status == HomeworkStatus.Done);
    this.overdueHomeworks = homeworks.filter(homeworks => homeworks.isOverdue);

    let overdueUpdatePromises = this.overdueHomeworks.filter(homework => homework.status == HomeworkStatus.Undone)
      .map(homework => this.appDb.updateHomework(homework.id, HomeworkStatus.Overdue));

    await Promise.all(overdueUpdatePromises);
  }
}

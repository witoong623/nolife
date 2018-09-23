import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  notiBeforePeriod: number;
  notiBeforeHomework: number;
  oldNotiBeforePeriod: number;
  oldNotiBeforeHomework: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.loadSettings();
  }

  ionViewWillUnload() {
    if (this.notiBeforePeriod !== this.oldNotiBeforePeriod) {
      this.storage.set(NOTIFYBEFOREPERIOD, this.notiBeforePeriod);
    }

    if (this.notiBeforeHomework !== this.oldNotiBeforeHomework) {
      this.storage.set(NOTIFYBEFOREHOMEWORK, this.notiBeforeHomework);
    }
  }

  private async loadSettings(): Promise<void> {
    this.notiBeforePeriod = await getSettingValue(NOTIFYBEFOREPERIOD, NOTIFYBEFOREPERIOD_DEFAULT, this.storage);
    this.notiBeforeHomework = await getSettingValue(NOTIFYBEFOREHOMEWORK, NOTIFYBEFOREHOMEWORK_DEFAULT, this.storage);
    this.oldNotiBeforePeriod = this.notiBeforePeriod;
    this.oldNotiBeforeHomework = this.oldNotiBeforeHomework;
  }

  notiBeforeHomeworkSet() {
    let alert = this.alertCtrl.create({
      title: 'เตือนก่อนการบ้านส่งเป็นเวลากี่วัน',
      inputs: [
        {
          name: 'notiBeforeHomework',
          placeholder: 'จำนวนวัน',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
        },
        {
          text: 'ตกลง',
          handler: data => {
            this.notiBeforeHomework = data.notiBeforeHomework;
          }
        }
      ]
    });
    alert.present();
  }

  notiBeforePeriodSet() {
    let alert = this.alertCtrl.create({
      title: 'เตือนก่อนคาบต่อไปเป็นเวลากี่นาที',
      inputs: [
        {
          name: 'notiBeforePeriod',
          placeholder: 'นาที',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          role: 'cancel',
        },
        {
          text: 'ตกลง',
          handler: data => {
            this.notiBeforePeriod = data.notiBeforePeriod;
          }
        }
      ]
    });
    alert.present();
  }

}

export const NOTIFYBEFOREPERIOD = 'notifyBeforePeriod';
export const NOTIFYBEFOREHOMEWORK = 'notiBeforeHomework';
export const NOTIFYBEFOREPERIOD_DEFAULT = 10;
export const NOTIFYBEFOREHOMEWORK_DEFAULT = 2;

export async function getSettingValue<T>(key: string, defaultValue: T, storage: Storage): Promise<T> {
  let value = await storage.get(key);
  if (value === null) {
    return defaultValue;
  }
  
  return value as T;
}

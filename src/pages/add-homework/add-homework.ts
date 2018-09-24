import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { Subject, Semester, Homework, HomeworkNotification } from '../../models/models';
import { getCurrentSemester } from '../../utilities/datetimeutility';
import { ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { Storage } from '@ionic/storage';
import * as settings from '../setting/setting';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-add-homework',
  templateUrl: 'add-homework.html',
})
export class AddHomeworkPage {
  availableSubjects: Subject[];
  form: FormGroup;
  private notiBeforeHomework: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appDb: AppDbProvider,
    private formBuilder: FormBuilder,
    private storage: Storage) {

      this.form = this.formBuilder.group({
        topic: ['', Validators.required],
        description: '',
        subject: null,
        submitDate: ['', Validators.required],
        submitTime: ['', Validators.required]
      });
  }

  ionViewWillEnter() {
    this.loadSubjects();
  }

  private async loadSubjects(): Promise<void> {
    this.availableSubjects = await this.appDb.getAllSubjects(getCurrentSemester());
    this.notiBeforeHomework = await settings.getSettingValue(settings.NOTIFYBEFOREHOMEWORK, settings.NOTIFYBEFOREHOMEWORK_DEFAULT, this.storage);
  }

  async onSubmit(val: any): Promise<void> {
    let homework = new Homework(val.subject, val.topic, val.description, `${val.submitDate} ${val.submitTime}`);
    let hwId = await this.appDb.saveHomework(homework);
    homework.id = hwId;
    await this.setupNotification(homework.subject, homework, homework.subject.semester)

    this.navCtrl.pop();
  }

  async setupNotification(subject: Subject, homework: Homework, semester: Semester): Promise<void> {
    let notification = new HomeworkNotification(
      subject.subId,
      subject.name,
      subject.semester,
      homework.topic,
      homework.id,
      homework.submitAt,
      this.notiBeforeHomework
    )
    
    let notiId = await this.appDb.saveHomeworkNotification(notification);
    
    let scheduleOption = {
      id: notiId,
      title: `คุณมีการบ้าน ${homework.topic} ต้องส่งในอีก ${this.notiBeforeHomework} วัน`,
      text: `การบ้าน ${homework.topic} วิชา ${notification.subName}\nส่งวันที่ ${homework.submitAt.format('D MMMM YYYY เวลา H:m')}`,
      trigger: { at: homework.submitAt.toDate() }
    };

    cordova.plugins.notification.local.schedule(scheduleOption);
  }
}

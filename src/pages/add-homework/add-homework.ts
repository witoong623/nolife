import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppDbProvider } from '../../providers/app-db/app-db';
import { Subject, Semester, Homework } from '../../models/models';
import { getCurrentSemester } from '../../utilities/datetimeutility';
import { ModalController } from 'ionic-angular';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-add-homework',
  templateUrl: 'add-homework.html',
})
export class AddHomeworkPage {
  availableSubjects: Subject[];
  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public appDb: AppDbProvider,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder) {

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

  private loadSubjects() {
    this.appDb.getAllSubjects(getCurrentSemester())
      .then(subjects => this.availableSubjects = subjects);
  }

  onSubmit(val: any): void {
    let submitAt = moment(`${val.submitDate} ${val.submitTime}`);
    let homework = new Homework(val.subject, val.topic, val.description, submitAt);
    
  }
}

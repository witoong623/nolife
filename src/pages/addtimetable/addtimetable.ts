import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AddtimetablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addtimetable',
  templateUrl: 'addtimetable.html',
})
export class AddtimetablePage {
  form: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      subId: ['', Validators.required],
      subName: ['', Validators.required],
      periods: this.formBuilder.array([this.initStudyTimeField()])
    });
  }

  initStudyTimeField(): FormGroup {
    return this.formBuilder.group({
      day: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
  }

  addNewInputField(): void {
    const control = <FormArray>this.form.controls.periods;
    control.push(this.initStudyTimeField());
  }

  removeInputField(i: number): void {
    const control = <FormArray>this.form.controls.periods;
    control.removeAt(i);
  }

  onSubmit(val: any): void {
    console.log(val);
  }
}

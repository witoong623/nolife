import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSemesterPage } from './add-semester';

@NgModule({
  declarations: [
    AddSemesterPage,
  ],
  imports: [
    IonicPageModule.forChild(AddSemesterPage),
  ],
})
export class AddSemesterPageModule {}

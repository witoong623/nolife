import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SemesterPage } from './semester';

@NgModule({
  declarations: [
    SemesterPage,
  ],
  imports: [
    IonicPageModule.forChild(SemesterPage),
  ],
})
export class SemesterPageModule {}

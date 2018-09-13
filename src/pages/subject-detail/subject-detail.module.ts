import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubjectDetailPage } from './subject-detail';

@NgModule({
  declarations: [
    SubjectDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(SubjectDetailPage),
  ],
})
export class SubjectDetailPageModule {}

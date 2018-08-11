import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddHomeworkPage } from './add-homework';

@NgModule({
  declarations: [
    AddHomeworkPage,
  ],
  imports: [
    IonicPageModule.forChild(AddHomeworkPage),
  ],
})
export class AddHomeworkPageModule {}

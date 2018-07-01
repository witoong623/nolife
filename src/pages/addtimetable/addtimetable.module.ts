import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddtimetablePage } from './addtimetable';

@NgModule({
  declarations: [
    AddtimetablePage,
  ],
  imports: [
    IonicPageModule.forChild(AddtimetablePage),
  ],
})
export class AddtimetablePageModule {}

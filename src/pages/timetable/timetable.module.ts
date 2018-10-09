import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimetablePage } from './timetable';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    TimetablePage,
  ],
  imports: [
    IonicPageModule.forChild(TimetablePage),
    SuperTabsModule
  ],
})
export class TimetablePageModule {}

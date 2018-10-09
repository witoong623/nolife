import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeworkPage } from './homework';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [
    HomeworkPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeworkPage),
    MomentModule
  ],
})
export class HomeworkPageModule {}

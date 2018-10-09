import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MomentModule } from 'ngx-moment';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { AppDbProvider } from '../providers/app-db/app-db';
import { AppNotificationProvider } from '../providers/AppNotificationProvider';
import { AddHomeworkPageModule } from '../pages/add-homework/add-homework.module';
import { AddSemesterPageModule } from '../pages/add-semester/add-semester.module';
import { TimetabletabPageModule } from '../pages/timetabletab/timetabletab.module';
import { AddtimetablePageModule } from '../pages/addtimetable/addtimetable.module';
import { HomeworkPageModule } from '../pages/homework/homework.module';
import { SubjectPageModule } from '../pages/subject/subject.module';
import { SubjectDetailPageModule } from '../pages/subject-detail/subject-detail.module';
import { SettingPageModule } from '../pages/setting/setting.module';
import { TimetablePageModule } from '../pages/timetable/timetable.module';
import { SemesterPageModule } from '../pages/semester/semester.module';
import { HomePageModule } from '../pages/home/home.module';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    MomentModule,
    IonicStorageModule.forRoot({
      name: 'settings'
    }),
    AddHomeworkPageModule,
    AddSemesterPageModule,
    TimetabletabPageModule,
    AddtimetablePageModule,
    HomeworkPageModule,
    SubjectPageModule,
    SubjectDetailPageModule,
    SettingPageModule,
    TimetablePageModule,
    SemesterPageModule,
    HomePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    AppDbProvider,
    AppNotificationProvider
  ]
})
export class AppModule {}

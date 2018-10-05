import { AddSemesterPage } from './../pages/add-semester/add-semester';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MomentModule } from 'ngx-moment';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { TimetablePage } from '../pages/timetable/timetable';
import { SemesterPage } from '../pages/semester/semester';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { SuperTabsModule } from 'ionic2-super-tabs';

import { AppDbProvider } from '../providers/app-db/app-db';
import { TimetabletabPage } from '../pages/timetabletab/timetabletab';
import { AddtimetablePage } from '../pages/addtimetable/addtimetable';
import { HomeworkPage } from '../pages/homework/homework';
import { AddHomeworkPage } from '../pages/add-homework/add-homework';
import { SubjectPage } from '../pages/subject/subject';
import { SubjectDetailPage } from '../pages/subject-detail/subject-detail';
import { SettingPage } from '../pages/setting/setting';
import { AppNotificationProvider } from '../providers/AppNotificationProvider';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TimetablePage,
    SemesterPage,
    AddSemesterPage,
    TimetabletabPage,
    AddtimetablePage,
    HomeworkPage,
    AddHomeworkPage,
    SubjectPage,
    SubjectDetailPage,
    SettingPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot(),
    MomentModule,
    IonicStorageModule.forRoot({
      name: 'settings'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TimetablePage,
    SemesterPage,
    AddSemesterPage,
    TimetabletabPage,
    AddtimetablePage,
    HomeworkPage,
    AddHomeworkPage,
    SubjectPage,
    SubjectDetailPage,
    SettingPage
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

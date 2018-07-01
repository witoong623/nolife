import { AddSemesterPage } from './../pages/add-semester/add-semester';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

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

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TimetablePage,
    SemesterPage,
    AddSemesterPage,
    TimetabletabPage,
    AddtimetablePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SuperTabsModule.forRoot()
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
    AddtimetablePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    AppDbProvider
  ]
})
export class AppModule {}

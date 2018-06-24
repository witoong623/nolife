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
import { SQLiteMock} from '../mocks/sqlite';

import { AppDbProvider } from '../providers/app-db/app-db';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    TimetablePage,
    SemesterPage,
    AddSemesterPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    TimetablePage,
    SemesterPage,
    AddSemesterPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: SQLite, useClass: SQLiteMock },
    AppDbProvider
  ]
})
export class AppModule {}

// TODO: delete this line when done testing
export declare var SQL;

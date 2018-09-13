import { Semester, Period, Subject, Homework } from '../../models/models';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class AppDbProvider {
  private databaseName = 'experimentdb.db';

  options: any = {
    name: this.databaseName,
    location: 'default',
    createFromLocation: 1
  }

  private dbObjectPromise: Promise<SQLiteObject>;

  constructor(private sqlite: SQLite, private plt: Platform) {
    this.dbObjectPromise = this.connectToDb();
  }

  getAllSemesters(): Promise<Semester[]> {
    let sql = 'select * from semesters';
    return this.dbObjectPromise
      .then(db => db.executeSql(sql, []))
      .then(results => {
        let resultsList: Semester[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          let item = results.rows.item(i);
          resultsList.push(new Semester(item.semester, item.year));
        }
        return resultsList;
      });
  }

  getAllSubjects(curSemester: Semester): Promise<Subject[]> {
    let selectSub = 'select * from subjects where semester = ? and year = ?';
    return this.dbObjectPromise
      .then(db => db.executeSql(selectSub, [curSemester.semester, curSemester.year]))
      .then(results => {
        let subjectList: Subject[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          let row = results.rows.item(i);
          subjectList.push(new Subject(row.subId, row.name, row.lecturer, curSemester))
        }

        return subjectList;
      });
  }

  async getSubject(subId: string, semester: Semester): Promise<Subject> {
    let sql = 'select * from subjects where subId = ? and semester = ? and year = ?';
    
    let db = await this.dbObjectPromise;
    let result = await db.executeSql(sql, [subId, semester.semester, semester.year]);
    let row = result.rows.item(0);

    return new Subject(row.subId, row.name, row.lecturer, semester);
  }

  async getAllHomeworks(curSemester: Semester): Promise<Homework[]> {
    let sql = 'select * from homeworks where semester = ? and year = ?';
    let db = await this.dbObjectPromise;
    let results = await db.executeSql(sql, [curSemester.semester, curSemester.year]);
    let homeworksList: Homework[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      let row = results.rows.item(i);
      let subject = await this.getSubject(row.subId, curSemester);

      homeworksList.push(new Homework(subject, row.topic, row.description, row.submitat, row.id));
    }

    return homeworksList;
  }

  getPeriods(subId: string, curSemester: Semester): Promise<Period[]> {
    let sql = 'select * from periods where subId = ? and semester = ? and year = ?';
    return this.dbObjectPromise
      .then(db => db.executeSql(sql, [subId, curSemester.semester, curSemester.year]))
      .then(results => {
        let periodsList: Period[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          let row = results.rows.item(i);
          periodsList.push(new Period(row.day, row.startTime, row.endTime, row.room, subId, curSemester, row.id));
        }

        return periodsList;
      });
  }

  getAllPeriods(): Promise<Period[]> {
    let sql = 'select * from periods';
    return this.dbObjectPromise
      .then(db => db.executeSql(sql, []))
      .then(results => {
        let periodsList: Period[] = [];
        let curSemester: Semester = null;

        for (let i = 0; i < results.rows.length; i++) {
          let row = results.rows.item(i);
          curSemester = curSemester || new Semester(row.semester, row.year);
          periodsList.push(new Period(row.day, row.startTime, row.endTime, row.room, row.subId, curSemester, row.id));
        }

        return periodsList;
      });
  }

  saveSemester(semester: Semester): Promise<void> {
    let sql = 'insert into semesters(semester, year) values(?, ?)';
    return this.dbObjectPromise.then(db => db.executeSql(sql, [semester.semester, semester.year]));
  }

  saveTimetable(sub: Subject): Promise<void> {
    let insertSubject = 'insert into subjects(subId, name, lecturer, semester, year) values(?,?,?,?,?)';
    let insertPeriods = 'insert into periods(day, startTime, endTime, room, subId, semester, year) values(?,?,?,?,?,?,?)';
    const periods = sub.periods;
    return this.dbObjectPromise
      .then(db => {
        db.transaction(tx => {
          tx.executeSql(insertSubject, [sub.subId, sub.name, sub.lecturer, sub.semester.semester, sub.semester.year])
          periods.forEach(period => {
            tx.executeSql(insertPeriods, [period.day, period.startTime, period.endTime, period.room, period.subId, sub.semester.semester, sub.semester.year]);
          });
        });
      });
  }

  saveHomework(homework: Homework): Promise<void> {
    let sql = 'insert into homeworks(topic,description,submitat,subId,semester,year) values(?,?,?,?,?,?)';
    let args = [
      homework.topic,
      homework.description,
      homework.submitAtStr,
      homework.subject.subId,
      homework.subject.semester.semester,
      homework.subject.semester.year
    ]
    return this.dbObjectPromise.then(db => db.executeSql(sql, args));
  }

  private async connectToDb(): Promise<SQLiteObject> {
    await this.plt.ready();
    let db = await this.sqlite.create(this.options);

    let semestersSql = 'create table if not exists semesters (semester integer, year integer, primary key (semester, year))';
    let subjectSql = 'create table if not exists subjects (subId text, name text, ' +
        'lecturer text, semester integer, year integer, primary key(subId, semester, year), ' +
        'foreign key(semester, year) references semesters(semester, year))';
    let periodSql = 'create table if not exists periods (id integer primary key, day text, startTime text, endTime text, room text, ' +
        'subId text, semester integer, year integer, foreign key(subId, semester, year) references subjects(subId, semester, year))';
    let homeworkSql = 'create table if not exists homeworks (id integer primary key, topic	text, description text,' +
                      'submitat text, subId text, semester integer, year integer,' +
                      'foreign key(subId,semester,year) references subjects(subId,semester,year))';

    let semesterPromise = db.executeSql(semestersSql, []);
    let subjectPromise = db.executeSql(subjectSql, []);
    let periodsPromise = db.executeSql(periodSql, []);
    let homeworksPromise = db.executeSql(homeworkSql, []);

    await Promise.all([semesterPromise, subjectPromise, periodsPromise, homeworksPromise]);

    return db;
  }
}

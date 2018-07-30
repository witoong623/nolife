import { Semester, Period, Subject } from '../../models/models';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class AppDbProvider {
  options: any = {
    name: 'data.db',
    location: 'default',
    createFromLocation: 1
  }

  private dbObjectPromise: Promise<SQLiteObject>;

  constructor(private sqlite: SQLite) {
    this.dbObjectPromise = this.connectToDb();
  }

  getAllSemesters(): Promise<Semester[]> {
    let sql = 'select * from semesters';
    return this.dbObjectPromise
      .then(db => db.executeSql(sql, {}))
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
          let s = new Semester(row.semester, row.year);
          subjectList.push(new Subject(row.subId, row.name, row.lecturer, s))
        }

        return subjectList;
      });
  }

  getPeriods(subId: string): Promise<Period[]> {
    let sql = 'select * from periods where subId = ?';
    return this.dbObjectPromise
      .then(db => db.executeSql(sql, [subId]))
      .then(results => {
        let periodsList: Period[] = [];
        for (let i = 0; i < results.rows.length; i++) {
          let row = results.rows.item(i);
          periodsList.push(new Period(row.day, row.startTime, row.endTime, row.room, subId));
        }

        return periodsList;
      });
  }

  saveSemester(semester: Semester): Promise<void> {
    let sql = 'insert into semesters(semester, year) values(?, ?)';
    return this.dbObjectPromise.then(db => db.executeSql(sql, [semester.semester, semester.year]))
  }

  saveTimetable(sub: Subject): Promise<void> {
    let insertSubject = 'insert into subjects(subId, name, lecturer, semester, year) values(?,?,?,?,?)';
    let insertPeriods = 'insert into periods(day, startTime, endTime, room, subId) values(?,?,?,?,?)';
    const periods = sub.periods;
    return this.dbObjectPromise
      .then(db => {
        db.transaction(tx => {
          tx.executeSql(insertSubject, [sub.subId, sub.name, sub.lecturer, sub.semester.semester, sub.semester.year])
          periods.forEach(period => {
            tx.executeSql(insertPeriods, [period.day, period.startTime, period.endTime, period.room, period.subId]);
          });
        });
      });
  }

  private connectToDb(): Promise<SQLiteObject> {
    return new Promise<SQLiteObject>((resolve, reject) => {
      this.sqlite.create(this.options)
        .then((db: SQLiteObject) => {
          let semestersSql = 'create table if not exists semesters (semester integer, year integer, primary key (semester, year))';
          let subjectSql = 'create table if not exists subjects (subId text primary key, name text, ' +
              'lecturer text, semester integer, year integer, ' + 
              'foreign key(semester) references semesters(semester), foreign key(year) references semesters(year))';
          let periodSql = 'create table if not exists periods (id integer primary key, day text, startTime text, endTime text, room text, ' +
              'subId text, foreign key(subId) references subjects(subId))';
          let semesterPromise = db.executeSql(semestersSql, {});
          let subjectPromise = db.executeSql(subjectSql, {});
          let periodsPromise = db.executeSql(periodSql, {});
          Promise.all([semesterPromise, subjectPromise, periodsPromise])
            .then(() => {
              console.log('created all tables');
              resolve(db);
            });
        })
        .catch(e => reject(e));
    });
  }
}

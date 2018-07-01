import { Semester } from './../../models/semester';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

//import { SQLiteObject } from '../../mocks/sqlite/sqlitemock';

export class ValueAlreadyExistError extends Error {
  constructor(public name: string) {
    super()
  }
}

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
    return new Promise((resolve, reject) => {
      this.dbObjectPromise.then(db => {
        db.executeSql(sql, {}).then(results => {
          let resultsList: Semester[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            let item = results.rows.item(i);
            resultsList.push(new Semester(item.semester, item.year));
          }
          resolve(resultsList);
        });
      });
    });
  }

  saveSemester(semester: Semester): Promise<any> {
    let sql = 'insert into semesters(semester, year) values(?, ?)';
    return new Promise((resolve, reject) => {
      this.dbObjectPromise.then(db => {
        db.executeSql(sql, [semester.semester, semester.year])
          .then(() => resolve(), (e) => reject(e));
      });
    });
  }

  private connectToDb(): Promise<SQLiteObject> {
    return new Promise<SQLiteObject>((resolve, reject) => {
      this.sqlite.create(this.options)
        .then((db: SQLiteObject) => {
          let semestersSql = 'create table if not exists semesters (semester integer, year integer, primary key (semester, year))';
          let subjectSql = 'create table if not exists subjects (subId text primary key, name text)';
          let periodSql = 'create table if not exists periods (id integer primary key, day text, startTime text, endTime text)';
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

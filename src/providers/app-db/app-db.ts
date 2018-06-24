import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { Semester } from '../../models/semester';

import { SQLiteObject } from '../../mocks/sqlite/index';

@Injectable()
export class AppDbProvider {

  constructor(private sqlite: SQLite) {
    // create semester table sql
    const createSemester = 'create table if not exists semesters(id integer primary key autoincrement, semester integer, year integer)';
    this.getDb().then(db => {
      db.executeSql(createSemester, {});
    });
  }

  saveSemester(semester: Semester) {
    const sql = 'insert into semester(semester, year) values(?,?)';
    this.getDb().then(db => {
      db.executeSql(sql, [semester.semester, semester.year]);
    });
  }

  private getDb(): Promise<SQLiteObject> {
    return this.sqlite.create({
      name: 'data.db',
      location: 'default'
    });
  }
}

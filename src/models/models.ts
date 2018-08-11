import moment from 'moment';

export enum DayOfWeek {
  Monday = 'mon',
  Tuesday = 'tue',
  Wednesday = 'wed',
  Thursday = 'thu',
  Friday = 'fri',
  Saturday = 'sat',
  Sunday = 'sun'
}

export class Semester {
  constructor(public semester: number, public year: number) { }
}

export class Subject {
  constructor(public subId: string, public name: string, public lecturer: string,
    public semester: Semester, public periods?: Period[]) {}
}

export class Period {
  private _length: string = null;

  constructor(public day: DayOfWeek, public startTime: string, public endTime: string, 
    public room: string, public subId: string, public semester: Semester, public id?: number) {}

    get length(): string {
      if (this._length !== null) {
        return this._length;
      }

      let date = '1-1-1970';
      let start = moment(`${date} ${this.startTime}`, 'DD-MM-YYYY HH:mm');
      let end = moment(`${date} ${this.endTime}`, 'DD-MM-YYYY HH:mm');
      let duration = moment.duration(end.diff(start));

      this._length = `${duration.hours()} ชั่วโมง`;
      
      if (duration.minutes() !== 0) {
        this._length += ` ${duration.minutes()} นาที`;
      }

      return this._length;
    }
}

export class Homework {
  private _deadline: moment.Moment;

  constructor(public id: number, public topic: string, public description: string) {}

  get deadline(): string {
    return this._deadline.toLocaleString();
  }

  set deadline(strDeadline: string) {
    this._deadline = moment(strDeadline);
  }
}
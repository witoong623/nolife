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

export enum HomeworkStatus {
  Undone = 'yet',
  Done = 'done',
  Overdue = 'overdue'
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
  private _startMoment: moment.Moment;

  constructor(public day: DayOfWeek, public startTime: string, public endTime: string, 
    public room: string, public subId: string, public semester: Semester, public id?: number) {
      this._startMoment = moment(`1-1-1970 ${this.startTime}`, 'DD-MM-YYYY HH:mm');
    }

    get length(): string {
      if (this._length !== null) {
        return this._length;
      }

      let date = '1-1-1970';
      let end = moment(`${date} ${this.endTime}`, 'DD-MM-YYYY HH:mm');
      let duration = moment.duration(end.diff(this._startMoment));

      this._length = `${duration.hours()} ชั่วโมง`;
      
      if (duration.minutes() !== 0) {
        this._length += ` ${duration.minutes()} นาที`;
      }

      return this._length;
    }

    get dayOfWeekThai(): string {
      switch (this.day) {
        case DayOfWeek.Monday:
          return 'จันทร์';
        case DayOfWeek.Tuesday:
          return 'อังคาร';
        case DayOfWeek.Wednesday:
          return 'พุธ';
        case DayOfWeek.Thursday:
          return 'พฤหัส';
        case DayOfWeek.Friday:
          return 'ศุกร์';
        case DayOfWeek.Saturday:
          return 'เสาร์';
        case DayOfWeek.Sunday:
          return 'อาทิตย์';
      }
    }

    get startMoment(): moment.Moment {
      return this._startMoment;
    }
}

export class Homework {
  private _submitAt: moment.Moment;

  constructor(public subject: Subject, public topic: string, public description: string, submitAtStr: string, public status: HomeworkStatus, public id?: number) {
    this._submitAt = moment(submitAtStr);
  }

  get submitAt(): moment.Moment {
    return this._submitAt;
  }

  get isOverdue(): boolean {
    let now = moment();

    if (now.isBefore(this._submitAt)) {
      return false;
    } else {
      return true;
    }
  }
}

export class PeriodNotification {
  private _startMoment: moment.Moment;

  constructor(public subId: string,
              public subName: string,
              public semester: Semester,
              public periodId: number,
              public startTime: string,
              public beforeMin: number,
              public weekday: string,
              public room: string,
              public id?: number) {
                this._startMoment = moment(`1-1-1970 ${this.startTime}`, 'DD-MM-YYYY HH:mm').subtract(beforeMin, 'm');
              }

  get hour(): number {
    return this._startMoment.hour();
  }

  get minute(): number {
    return this._startMoment.minute();
  }
}

export class HomeworkNotification {
  constructor(public subId: string,
              public subName: string,
              public semester: Semester,
              public hwTopic: string,
              public hwId: number,
              public submitAt: moment.Moment,
              public beforeDay: number,
              public id?: number) {
                this.submitAt = this.submitAt.subtract(beforeDay, 'd');
              }
}

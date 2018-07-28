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
  constructor(public day: DayOfWeek, public startTime: string, public endTime: string, 
    public room: string, public subId: string, public id?: number) {}
}
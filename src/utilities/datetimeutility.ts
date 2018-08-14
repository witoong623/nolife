import { Semester, DayOfWeek } from "../models/models";

// TODO: this function is apply only to Thailand
export function getCurrentSemester(): Semester {
    const currentYear = (new Date()).getFullYear();
    let currentSemester: number;

    const currentMonth = (new Date()).getMonth();

    if (currentMonth >= 9) {
      currentSemester = 2;
    } else if (currentMonth >= 5) {
      currentSemester = 1;
    } else {
      currentSemester = 3
    }

    return new Semester(currentSemester, currentYear);
}

export function getDisplayTitle(key: string) {
  switch (key) {
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
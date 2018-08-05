import { Semester } from "../models/models";

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
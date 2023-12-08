import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }

  transformDateDDMMYYYY(inputDate: string): string {
    const date = new Date(inputDate);
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );
    const day = localDate.getUTCDate().toString().padStart(2, '0');
    const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getUTCFullYear();

    return `${day}-${month}-${year}`;
  }

  transformDateYYYYMMDD(inputDate: string): string {
    const date = new Date(inputDate);
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );
    const day = localDate.getUTCDate().toString().padStart(2, '0');
    const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = localDate.getUTCFullYear();

    return `${year}-${month}-${day}`;
  }

  calculateOneYearAfter(dateRelease: Date): Date {
    const oneYearAfter = new Date(dateRelease);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
    oneYearAfter.setDate(oneYearAfter.getDate() + 1);
    return oneYearAfter;
  }
}

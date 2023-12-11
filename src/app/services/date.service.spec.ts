import { TestBed } from '@angular/core/testing';
import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService],
    });
    service = TestBed.inject(DateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return current date in YYYY-MM-DD format', () => {
    const currentDate = service.getCurrentDate();
    const regexPattern = /^\d{4}-\d{2}-\d{2}$/;
    expect(currentDate).toMatch(regexPattern);
  });

  it('should transform date to DD-MM-YYYY format', () => {
    const inputDate = '2023-12-31';
    const transformedDate = service.transformDateDDMMYYYY(inputDate);
    expect(transformedDate).toBe('31-12-2023');
  });

  it('should transform date to YYYY-MM-DD format', () => {
    const inputDate = '2023-12-31';
    const transformedDate = service.transformDateYYYYMMDD(inputDate);
    expect(transformedDate).toBe('2023-12-31');
  });

  it('should calculate one year after given date', () => {
    const dateRelease = new Date('2022-01-01');
    const oneYearAfter = service.calculateOneYearAfter(dateRelease);
    const expectedDate = new Date('2023-01-02');
    expect(oneYearAfter.getTime()).toEqual(expectedDate.getTime());
  });
});

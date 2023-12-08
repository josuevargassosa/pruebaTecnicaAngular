import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProductComponent } from './edit-product.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DateService } from 'src/app/services/date.service';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;

  beforeEach(async () => {
    const activatedRouteStub = {
      params: of({ id: 'some_id' }),
      snapshot: {
        paramMap: {
          get: (param: string) => 'some_id',
        },
      },
    };

    await TestBed.configureTestingModule({
      declarations: [EditProductComponent],
      providers: [
        DateService,
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      imports: [HttpClientModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the EditProductComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should display an alert with the given message', () => {
    const message = 'Test message';
    const alertSpy = spyOn(window, 'alert');

    component.mensageAlert(message);

    expect(alertSpy).toHaveBeenCalledWith(message);
  });

  it('should get current date using DateService', () => {
    const currentDate = '2023-12-08';
    const dateServiceSpy = spyOn(
      TestBed.inject(DateService),
      'getCurrentDate'
    ).and.returnValue(currentDate);

    const result = component.getCurrentDate();

    expect(result).toBe(currentDate);
    expect(dateServiceSpy).toHaveBeenCalled();
  });
});

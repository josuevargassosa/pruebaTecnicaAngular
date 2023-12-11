import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProductComponent } from './edit-product.component';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DateService } from 'src/app/services/date.service';
import { ProductForm } from 'src/app/models/product-form';
import { ActivatedRoute } from '@angular/router';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;
  let dateService: DateService;

  const mockProduct: ProductForm = {
    id: '123',
    name: 'Product 1',
    description: 'Description of product 1',
    logo: 'logo-url',
    date_release: new Date('2023-01-01'),
    date_revision: new Date('2024-01-01'),
  };

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
    dateService = TestBed.inject(DateService);
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

  it('should initialize the form with correct values', () => {
    component.productData = mockProduct;
    component.initializeForm();

    expect(component.productForm.get('id')?.value).toEqual(mockProduct.id);
    expect(component.productForm.get('name')?.value).toEqual(mockProduct.name);
    expect(component.productForm.get('description')?.value).toEqual(
      mockProduct.description
    );
    expect(component.productForm.get('logo')?.value).toEqual(mockProduct.logo);
  });

  it('should return current date', () => {
    const currentDate = '2023-12-08';
    spyOn(dateService, 'getCurrentDate').and.returnValue(currentDate);

    const result = component.getCurrentDate();

    expect(result).toBe(currentDate);
    expect(dateService.getCurrentDate).toHaveBeenCalled();
  });

  it('should return false when control does not have errors or is not dirty', () => {
    component.productData = mockProduct;
    component.initializeForm();
    const hasError = component.hasError('name');

    expect(hasError).toBeFalsy();
  });

  it('should return form controls', () => {
    component.productData = mockProduct;
    component.initializeForm();

    expect(component.productForm).toBeTruthy();

    expect(component.productForm.controls['id'].value).toBe(mockProduct.id);
    expect(component.productForm.controls['name'].value).toBe(mockProduct.name);
    expect(component.productForm.controls['description'].value).toBe(
      mockProduct.description
    );
  });

  it('should reset the form', () => {
    component.productData = mockProduct;
    component.initializeForm();
    component.productForm.markAsTouched();
    component.productForm.controls['name'].setValue('New Product Name');

    expect(component.productForm.controls['name'].value).toBe(
      'New Product Name'
    );
    component.resetForm();

    expect(component.productForm.controls['name'].value).toBe(null);
    expect(component.productForm.controls['name'].touched).toBe(false);
  });

  it('should set productData when productId matches', () => {
    component.productData = mockProduct;
    component.checkProductId();

    expect(component.productData).toBeTruthy();
  });

  it('should calculate one year after the given date', () => {
    const dateRelease = new Date('2023-01-01');

    const expectedDate = new Date('2024-01-02');

    const result = component.calculateOneYearAfter(dateRelease);

    expect(result).toEqual(expectedDate);
  });

  it('should return error messages for form controls', () => {
    component.productData = {
      id: '',
      name: 'Josu',
      description: 'Tarj',
      logo: 'logo-url',
      date_release: new Date(),
      date_revision: new Date(),
    };

    component.initializeForm();

    let errorMessage = component.getErrorMessage('id');
    expect(errorMessage).toContain('El campo id es obligatorio.');

    errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toContain('El name debe tener al menos 5 caracteres.');

    errorMessage = component.getErrorMessage('description');
    expect(errorMessage).toContain(
      'El description debe tener al menos 10 caracteres.'
    );

    errorMessage = component.getErrorMessage('logo');
    expect(errorMessage).toContain(' ');
  });

  it('should open and close modal with proper message and buttons', () => {
    const message = 'Test message';
    const haveButtons = false;

    expect(component.isModalVisible).toBeFalsy();

    component.openModal(message, haveButtons);

    expect(component.isModalVisible).toBeTruthy();

    expect(component.message).toBe(message);
    expect(component.showModalButtons).toBe(haveButtons);

    component.closeModal();

    expect(component.isModalVisible).toBeFalsy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProductForm } from 'src/app/models/product-form';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productService: ProductService;

  const mockProduct: ProductForm = {
    id: '123',
    name: 'Product 1',
    description: 'Description of product 1',
    logo: 'logo-url',
    date_release: new Date('2023-01-01'),
    date_revision: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateProductComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [FormBuilder, ProductService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    component.initializeForm();
    expect(component.productForm).toBeDefined();
  });

  it('should return correct error messages for required fields', () => {
    component.initializeForm();

    let errorMessage = component.getErrorMessage('id');
    expect(errorMessage).toContain('El campo id es obligatorio.');

    errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toContain('El campo name es obligatorio.');

    errorMessage = component.getErrorMessage('description');
    expect(errorMessage).toContain('El campo description es obligatorio.');

    errorMessage = component.getErrorMessage('date_release');
    expect(errorMessage).toContain('El campo date_release es obligatorio.');

    errorMessage = component.getErrorMessage('date_revision');
    expect(errorMessage).toContain('El campo date_revision es obligatorio.');
  });

  it('should call productService when checking product existence', () => {
    const productServiceSpy = spyOn(
      productService,
      'existFinancialProduct'
    ).and.returnValue(of(true));

    component.initializeForm();
    component.formControls['id'].setValue('testId');
    component.checkProductExistence('testId');

    expect(productServiceSpy).toHaveBeenCalledWith('testId');
  });

  it('should update form value based on date input', () => {
    const testDate = '2023-12-08';
    component.initializeForm();
    component.onDateReleaseChange({ target: { value: testDate } });

    expect(component.formControls['date_revision'].value).toBe('2024-12-08');
  });

  it('should set isModalVisible to false when closeModal is called', () => {
    component.isModalVisible = true;

    component.closeModal();

    expect(component.isModalVisible).toBe(false);
  });

  it('should call checkProductExistence with the value of id input', () => {
    component.initializeForm();

    const productServiceSpy = spyOn(
      component,
      'checkProductExistence'
    ).and.returnValue();

    component.onIdInputChange();

    expect(productServiceSpy).toHaveBeenCalledWith('');
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});

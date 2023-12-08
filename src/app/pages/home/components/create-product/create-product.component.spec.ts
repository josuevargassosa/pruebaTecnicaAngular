import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateProductComponent } from './create-product.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;
  let productService: ProductService;

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

    // Check for the 'id' field
    let errorMessage = component.getErrorMessage('id');
    expect(errorMessage).toContain('El campo id es obligatorio.');

    // Check for the 'name' field
    errorMessage = component.getErrorMessage('name');
    expect(errorMessage).toContain('El campo name es obligatorio.');

    // Check for the 'description' field
    errorMessage = component.getErrorMessage('description');
    expect(errorMessage).toContain('El campo description es obligatorio.');

    // Check for the 'date_release' field
    errorMessage = component.getErrorMessage('date_release');
    expect(errorMessage).toContain('El campo date_release es obligatorio.');

    // Check for the 'date_revision' field
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

  afterEach(() => {
    TestBed.resetTestingModule();
  });
});

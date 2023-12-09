import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProductComponent } from './edit-product.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { DateService } from 'src/app/services/date.service';
import { ProductForm } from 'src/app/models/product-form';

describe('EditProductComponent', () => {
  let component: EditProductComponent;
  let fixture: ComponentFixture<EditProductComponent>;

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
    // Asigna el producto simulado al componente y llama a initializeForm()
    component.productData = mockProduct;
    component.initializeForm();

    // Comprueba si los valores del formulario coinciden con los valores del producto simulado
    expect(component.productForm.get('id')?.value).toEqual(mockProduct.id);
    expect(component.productForm.get('name')?.value).toEqual(mockProduct.name);
    expect(component.productForm.get('description')?.value).toEqual(
      mockProduct.description
    );
    expect(component.productForm.get('logo')?.value).toEqual(mockProduct.logo);
    expect(component.productForm.get('date_release')?.value).toEqual(
      mockProduct.date_release
    );
    expect(component.productForm.get('date_revision')?.value).toEqual(
      mockProduct.date_revision
    );
  });

  // it('should get form controls', () => {
  //   const formControls = component.formControls;

  //   expect(formControls).toBeTruthy();
  // });

  it('should update the revision date when the release date changes', () => {
    const releaseDate = new Date('2023-01-01');
    const revisedDate = new Date('2024-01-01');

    // Establece la fecha de lanzamiento en el formulario
    component.productForm.get('date_release')?.setValue(releaseDate);

    // Llama a la función que actualiza la fecha de revisión
    component.onDateReleaseChange();

    // Obtiene el valor actual de la fecha de revisión del formulario
    const updatedRevisionDate =
      component.productForm.get('date_revision')?.value;

    // Verifica si la fecha de revisión se actualizó correctamente
    expect(updatedRevisionDate).toEqual(revisedDate);
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

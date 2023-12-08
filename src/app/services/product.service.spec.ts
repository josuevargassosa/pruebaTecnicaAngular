import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from 'src/environments/environment.prod';
import { ProductForm } from '../models/product-form';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: ProductForm = {
    id: '1',
    name: 'Product Name',
    description: 'Product Description',
    logo: 'path/to/logo.png',
    date_release: new Date('2023-12-31'),
    date_revision: new Date('2024-01-15'),
  };

  const mockProductList: ProductForm[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description for Product 1',
      logo: 'path/to/logo1.png',
      date_release: new Date('2022-05-20'),
      date_revision: new Date('2022-06-10'),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description for Product 2',
      logo: 'path/to/logo2.png',
      date_release: new Date('2022-07-15'),
      date_revision: new Date('2022-08-05'),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve financial products', () => {
    service.getFinancialProducts().subscribe((products) => {
      expect(products).toEqual(mockProductList);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProductList);
  });

  it('should handle error when creating financial product', () => {
    const errorResponse = {
      name: 'es un campo obligatorio',
      description: 'es un campo obligatorio',
    };

    spyOn(service, 'createFinancialProduct').and.returnValue(
      throwError({ status: 206, error: errorResponse })
    );

    service.createFinancialProduct(mockProduct).subscribe(
      () => {},
      (error) => {
        expect(error.error).toEqual(errorResponse);
        expect(error.error.name).toEqual('es un campo obligatorio');
        expect(error.error.description).toEqual('es un campo obligatorio');
      }
    );

    expect(service.createFinancialProduct).toHaveBeenCalledWith(mockProduct);
  });

  it('should update financial product', () => {
    const updatedProduct: ProductForm = {
      ...mockProduct,
      name: 'Updated Name',
    };

    service.updateFinancialProduct(updatedProduct).subscribe((product) => {
      expect(product).toEqual(updatedProduct);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/bp/products`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedProduct);
  });

  it('should delete financial product by id', () => {
    const idToDelete = '1';

    service.deleteFinancialProduct(idToDelete).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiURL}/bp/products?id=${idToDelete}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should validate existence of financial product by id', () => {
    const idToVerify = '1';

    service.existFinancialProduct(idToVerify).subscribe((exists) => {
      expect(exists).toBeTrue();
    });

    const req = httpMock.expectOne(
      `${environment.apiURL}/bp/products/verification?id=${idToVerify}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});

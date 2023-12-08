import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';
import { ProductForm } from 'src/app/models/product-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  const products: ProductForm[] = [
    {
      id: '1',
      name: 'Producto 1',
      description: 'Descripción del Producto 1',
      logo: 'logo1.png',
      date_release: new Date('2023-12-01'),
      date_revision: new Date('2023-12-10'),
    },
    {
      id: '2',
      name: 'Producto 2',
      description: 'Descripción del Producto 2',
      logo: 'logo2.png',
      date_release: new Date('2023-11-15'),
      date_revision: new Date('2023-11-25'),
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [ProductService],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products correctly on initialization', () => {
    spyOn(productService, 'getFinancialProducts').and.returnValue(of(products));
    component.ngOnInit();

    expect(productService.getFinancialProducts).toHaveBeenCalled();

    expect(component.isLoading).toBeFalse();
    expect(component.allProducts).toBe(products);
    expect(component.totalRecords).toEqual(products.length);
  });

  it('should filter products correctly based on search text', () => {
    component.allProducts = products;

    component.searchText = 'Producto 1';

    component.onSearch();

    expect(component.displayedProducts.length).toBe(1);
    expect(component.displayedProducts[0].name).toBe('Producto 1');
  });
});

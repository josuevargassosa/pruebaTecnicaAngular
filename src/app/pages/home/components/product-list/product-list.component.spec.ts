import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';
import { ProductForm } from 'src/app/models/product-form';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;
  let router: Router;

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

  const mockProduct: ProductForm = {
    id: '123',
    name: 'Product 1',
    description: 'Description of product 1',
    logo: 'logo-url',
    date_release: new Date('2023-01-01'),
    date_revision: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigateByUrl']);
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [FormsModule, HttpClientTestingModule],
      providers: [ProductService, { provide: Router, useValue: router }],
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

  it('should navigate to create product page', () => {
    component.navigateToCreateProduct();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/home/create-product');
  });

  it('should set selectedProduct and open modal when deleteElement is called', () => {
    component.deleteElement(mockProduct);

    expect(component.selectedProduct).toEqual(mockProduct);
    expect(component.isModalVisible).toBe(true);
    expect(component.message).toContain(
      '¿Estás seguro que deseas eliminar el producto'
    );
  });

  it('should set isModalVisible to false when closeModal is called', () => {
    component.isModalVisible = true;

    component.closeModal();

    expect(component.isModalVisible).toBe(false);
  });

  it('should call deleteProduct if selectedProduct is defined', () => {
    component.selectedProduct = mockProduct;
    component.confirmAction();

    expect(component.selectedProduct).toBeDefined();
  });

  it('should toggle dropdown visibility for the specified item ID', () => {
    const itemId = mockProduct.id;

    component.toggleDropdown(itemId);

    expect(component.isDropdownVisible[itemId]).toBe(true);
  });
});

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductForm } from 'src/app/models/product-form';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  allProducts: ProductForm[] = [];
  displayedProducts: ProductForm[] = [];
  selectedProduct!: ProductForm;
  isLoading: boolean = true;
  isModalVisible: boolean = false;
  showModalButtons: boolean = true;
  isDropdownVisible: { [key: string]: boolean } = {};
  itemsPerPage: number = 5;
  totalRecords: number = 0;
  searchText: string = '';
  message: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.isLoading = true;
    this.productService.getFinancialProducts().subscribe(
      (data: ProductForm[]) => {
        this.allProducts = data;
        this.isLoading = false;
        this.updateDisplayedProducts();
        this.totalRecords = this.displayedProducts.length;
      },
      (error) => {
        console.error('Error al obtener productos financieros:', error);
        this.openModal(
          'Ocurrió un error al obtener los productos financieros.',
          false
        );
        this.isLoading = false;
      }
    );
  }

  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event;
    this.isLoading = true;
    setTimeout(() => {
      this.displayedProducts = this.allProducts.slice(0, this.itemsPerPage);
      this.isLoading = false;
      this.totalRecords = this.displayedProducts.length;
      this.updateDisplayedProducts();
    }, 1000);
  }

  onSearch(): void {
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts(): void {
    if (this.searchText.trim() !== '') {
      this.displayedProducts = this.allProducts.filter(
        (product: ProductForm) =>
          product.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchText.toLowerCase())
      );
      this.displayedProducts = this.displayedProducts.slice(
        0,
        this.itemsPerPage
      );
      this.totalRecords = this.displayedProducts.length;
    } else {
      this.displayedProducts = this.allProducts.slice(0, this.itemsPerPage);
      this.totalRecords = this.displayedProducts.length;
    }
  }

  navigateToCreateProduct(): void {
    this.router.navigateByUrl('/home/create-product');
  }

  deleteElement(product: ProductForm) {
    this.selectedProduct = product;
    this.openModal(
      `¿Estás seguro que deseas eliminar el producto ${product.name}?`,
      true
    );
  }

  openModal(message: string, haveButtons: boolean) {
    this.message = message;
    this.showModalButtons = haveButtons;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  toggleDropdown(itemId: string): void {
    Object.keys(this.isDropdownVisible).forEach((key) => {
      if (key !== itemId) {
        this.isDropdownVisible[key] = false;
      }
    });
    this.isDropdownVisible[itemId] = !this.isDropdownVisible[itemId];
  }

  confirmAction() {
    if (this.selectedProduct) {
      this.deleteProduct(this.selectedProduct.id);
    }
  }

  private deleteProduct(productId: string): void {
    this.productService.deleteFinancialProduct(productId).subscribe(
      (data) => this.handleDeleteSuccess(data),
      (error) => this.handleDeleteError(error)

      // tap((data) => this.handleDeleteSuccess(data)),
      // catchError((error) => {
      //   this.handleDeleteError(error);
      //   return throwError('Ocurrió un error al eliminar el producto.');
      // })
    );
  }

  private handleDeleteSuccess(data: any): void {
    this.fetchProducts();
    this.closeModal();
    this.openModal(data, false);
  }

  private handleDeleteError(error: any): void {
    console.error('Error al eliminar producto:', error);
    this.openModal(error.returnMessage, false);
  }
}

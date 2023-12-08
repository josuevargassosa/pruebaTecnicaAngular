import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductForm } from 'src/app/models/product-form';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent {
  allProducts: ProductForm[] = [];
  productForm!: FormGroup;
  productData!: ProductForm;
  isModalVisible: boolean = false;
  showModalButtons: boolean = true;
  productId: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.getAllProducts();
  }

  mensageAlert(message: string): void {
    alert(message);
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      id: [
        this.productData?.id,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        this.productData?.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        this.productData?.description,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: [this.productData?.logo, Validators.required],
      date_release: [
        this.transformDate(this.productData.date_release.toString()),
        Validators.required,
      ],
      date_revision: [
        this.transformDate(this.productData.date_revision.toString()),
        Validators.required,
      ],
    });
  }

  get formControls() {
    return this.productForm.controls;
  }

  getAllProducts(): void {
    this.productService.getFinancialProducts().subscribe(
      (data: ProductForm[]) => {
        console.log('Productos financieros:', data);
        this.allProducts = data;
        this.checkProductId();
      },
      (error) => {
        console.error('Error al obtener productos financieros:', error);
      }
    );
  }

  checkProductId() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.productId = params['id'];
        const foundProduct = this.allProducts.find(
          (product) => product.id === this.productId
        );

        if (foundProduct) {
          this.productData = foundProduct;
          console.log('Producto encontrado:', this.productData);
          this.initForm();
        } else {
          this.mensageAlert('El producto no existe.');
        }
      }
    });
  }

  transformDate(inputDate: string): string {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }

  resetForm(): void {
    this.productForm.reset();
  }

  onDateReleaseChange(event: Event): void {
    console.log(
      'Fecha de lanzamiento:',
      this.formControls['date_release']!.value
    );
    const oneYearAfter = this.calculateOneYearAfter(
      new Date(this.formControls['date_release']!.value)
    );
    const formattedDate = formatDate(oneYearAfter, 'yyyy-MM-dd', 'en-US');

    this.productForm.setValue({
      ...this.productForm.value,
      date_revision: formattedDate,
    });
  }

  calculateOneYearAfter(dateRelease: Date): Date {
    const oneYearAfter = new Date(dateRelease);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
    oneYearAfter.setDate(oneYearAfter.getDate() + 1);
    return oneYearAfter;
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.submitFormData();
    } else {
      this.handleInvalidForm();
    }
  }

  private submitFormData(): void {
    const formData: ProductForm = this.productForm.value;
    console.log(formData);
    this.productService.updateFinancialProduct(formData).subscribe(
      (data) => {
        console.log('Producto financiero editado exitosamente:', data);
        this.openModal('Producto financiero editado exitosamente.', false);
        this.resetForm();
      },
      (error) => {
        this.openModal('Error al editar producto financiero.', false);
        console.error('Error al crear producto financiero:', error);
      }
    );
  }

  private handleInvalidForm(): void {
    Object.values(this.productForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  // Función para obtener mensajes de error dinámicos
  getErrorMessage(controlName: string) {
    const control = this.productForm.get(controlName);

    if (control?.errors) {
      if (control.errors['required']) {
        return `El campo ${controlName} es obligatorio.`;
      } else if (control.errors['minlength']) {
        return `El ${controlName} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
      } else if (control.errors['maxlength']) {
        return `El ${controlName} no debe exceder los ${control.errors['maxlength'].requiredLength} caracteres.`;
      }
    }

    return '';
  }

  openModal(message: string, haveButtons: boolean) {
    this.message = message;
    this.showModalButtons = haveButtons;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductForm } from 'src/app/models/product-form';
import { formatDate } from '@angular/common';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent {
  productForm!: FormGroup;
  isModalVisible: boolean = false;
  showModalButtons: boolean = true;

  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required],
    });
  }

  get formControls() {
    return this.productForm.controls;
  }

  getErrorMessage(controlName: string) {
    const control = this.productForm.get(controlName);

    if (control?.errors) {
      if (control.errors['required']) {
        return `El campo ${controlName} es obligatorio.`;
      } else if (control.errors['minlength']) {
        return `El ${controlName} debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
      } else if (control.errors['maxlength']) {
        return `El ${controlName} no debe exceder los ${control.errors['maxlength'].requiredLength} caracteres.`;
      } else if (control.errors['exists']) {
        return `El ${controlName} ya existe`;
      }
    }

    return '';
  }

  onIdInputChange(): void {
    console.log('EVENT', this.formControls['id']!.value);
    this.checkProductExistence(this.formControls['id']!.value);
  }

  checkProductExistence(id: string): void {
    this.productService.existFinancialProduct(id).subscribe(
      (exists: boolean) => {
        const idControl = this.formControls['id'];
        const errors = idControl.errors;

        if (exists) {
          this.openModal('El producto existe.', false);
          idControl.setErrors({ ...errors, exists: true });
        } else {
          if (errors && errors['exists']) {
            delete errors['exists'];
            idControl.setErrors({ ...errors });
          }
        }
      },
      (error) => {
        console.error('Error al verificar el producto:', error);
        alert('Error al verificar el producto.');
      }
    );
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }

  resetForm(): void {
    this.productForm.reset();
  }

  onDateReleaseChange(event: any): void {
    const oneYearAfter = this.calculateOneYearAfter(
      new Date(event.target.value)
    );
    const formattedDate = this.formatDateOneYearAfter(oneYearAfter);
    this.updateFormValue('date_revision', formattedDate);
  }

  formatDateOneYearAfter(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }
  updateFormValue(fieldName: string, value: any): void {
    const updatedValue = { [fieldName]: value };
    this.productForm.patchValue(updatedValue);
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

  openModal(message: string, haveButtons: boolean) {
    this.message = message;
    this.showModalButtons = haveButtons;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  private submitFormData(): void {
    const formData: ProductForm = this.productForm.value;
    console.log(formData);
    console.log('Formulario válido:', this.formControls['id'].errors);
    this.productService.createFinancialProduct(formData).subscribe(
      (data) => {
        console.log('Producto financiero creado exitosamente:', data);
        this.openModal('Producto financiero creado exitosamente.', false);
        this.resetForm();
      },
      (error) => {
        this.openModal(
          error.error.returnMessage || 'Error al crear producto financiero.',
          false
        );
        console.error('Error al crear producto financiero:', error);
      }
    );
  }

  private handleInvalidForm(): void {
    Object.values(this.productForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}

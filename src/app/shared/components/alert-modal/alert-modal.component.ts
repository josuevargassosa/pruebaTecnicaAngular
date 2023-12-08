import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductForm } from 'src/app/models/product-form';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss'],
})
export class AlertModalComponent {
  @Input() message!: string;
  @Input() showButtons: boolean = false;
  @Input() isModalVisible: boolean = false;

  @Output() cancelClicked = new EventEmitter<void>();
  @Output() confirmClicked = new EventEmitter<string>();

  showAlert: boolean = false;

  constructor() {}
  ngOnInit(): void {
    if (this.isModalVisible) {
      this.showAlertModalChange();
    } else {
      this.closeAlertModalChange();
    }
  }

  showAlertModalChange(): void {
    this.showAlert = true;
  }

  closeAlertModalChange() {
    this.showAlert = false;
    return;
  }

  onClose(): void {
    this.cancelClicked.emit();
  }

  onConfirm(): void {
    this.confirmClicked.emit();
  }
}

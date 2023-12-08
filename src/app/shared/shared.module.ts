import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';

@NgModule({
  declarations: [AlertModalComponent],
  exports: [AlertModalComponent],
  imports: [CommonModule],
})
export class SharedModule {}

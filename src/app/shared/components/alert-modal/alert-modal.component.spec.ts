import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertModalComponent } from './alert-modal.component';

describe('AlertModalComponent', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize showAlert as false by default', () => {
    expect(component.showAlert).toBeFalse();
  });

  it('should initialize showAlert as true when isModalVisible is true', () => {
    component.isModalVisible = true;
    component.ngOnInit();
    expect(component.showAlert).toBeTrue();
  });

  it('should initialize showAlert as false when isModalVisible is false', () => {
    component.isModalVisible = false;
    component.ngOnInit();
    expect(component.showAlert).toBeFalse();
  });

  it('should emit cancelClicked event when onClose() is called', () => {
    spyOn(component.cancelClicked, 'emit');
    component.onClose();
    expect(component.cancelClicked.emit).toHaveBeenCalled();
  });

  it('should emit confirmClicked event when onConfirm() is called', () => {
    spyOn(component.confirmClicked, 'emit');
    component.onConfirm();
    expect(component.confirmClicked.emit).toHaveBeenCalled();
  });
});

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/service/api/api.service';
import { NotificationService } from 'src/app/service/notify/notification.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent {
  selectedMethod: string | null = null;
  isProcessing = false;
  showConfirmation = false;

  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  grandTotal: number = 0; // Example total amount

  upiIds: string[] = ['aditya121@upi', 'aditya521@upi']; // Existing UPI IDs
  selectedUpiId: string = ''; // Selected UPI ID
  upiId: string = ''; // New UPI ID input field
  addingNewUpi: boolean = false; // Flag to show/hide new UPI ID input
  cartAllData: any;

  constructor(public dialogRef: MatDialogRef<PaymentComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private _api: ApiService, private _notify: NotificationService, private _productService: ProductService, config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.cartAllData = data.productHistory;
    this.grandTotal = data.productHistory.amount_paid;
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
    this.isProcessing = false;
  }

  // Function to process card payment
  processCardPayment() {
    if (this.validateCardDetails()) {
      this.showConfirmation = true; // Show confirmation before processing
    } else {
      this._notify.showError('Please fill in all card details correctly');
    }
  }

  // Function to process UPI payment
  processUpiPayment() {
    const upiToUse = this.selectedUpiId || this.upiId;
    if (upiToUse) {
      this.showConfirmation = true; // Show confirmation before processing
    } else {
      this._notify.showError('Please select or enter a valid UPI ID');
    }
  }

  close() {
    this.dialogRef.close();
  }
  // Confirm payment and simulate processing
  confirmPayment() {
    this.isProcessing = true;
    this.showConfirmation = false;


    const data = this.cartAllData;
    data.paymentMethod = this.selectedMethod;
    data.upi_Id = this.selectedUpiId;
    data.card_details = [{ cardNumber: this.cardNumber, cvv: this.cvv, expiryDate: this.expiryDate }];
    data.purchaseDate = new Date();


    this._api.addPayment(data).subscribe((res: any) => {
      setTimeout(() => {
        this.selectedMethod === 'card'
          ? this._notify.showSuccess('Payment Successful via Credit Card!')
          : this._notify.showSuccess('Payment Successful via UPI!');
        this.resetForm();
        this.close();
        this._productService.removeAllProducts(data.email, data.password);
      }, 1000);
    }, (error) => {
      console.log("Error => ", error);
    })
  }




  // Card validation checks
  validateCardDetails(): boolean {
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    const cvvRegex = /^[0-9]{3,4}$/;

    return cardNumberRegex.test(this.cardNumber) &&
      expiryDateRegex.test(this.expiryDate) &&
      cvvRegex.test(this.cvv);
  }

  // Add a new UPI ID to the list
  addNewUpiId() {
    if (this.upiId) {
      this.upiIds.push(this.upiId);
      this.selectedUpiId = this.upiId;
      this.upiId = '';
      this.addingNewUpi = false;
    }
  }

  // Remove a UPI ID from the list
  removeUpiId(index: number) {
    if (this.selectedUpiId === this.upiIds[index]) {
      this.selectedUpiId = ''; // Reset selection if removed ID was selected
    }
    this.upiIds.splice(index, 1);
  }

  resetForm() {
    this.cardNumber = '';
    this.expiryDate = '';
    this.cvv = '';
    this.upiId = '';
    this.selectedUpiId = '';
    this.selectedMethod = null;
    this.isProcessing = false;
  }

  open(content: any) {
    this.modalService.open(content);
  }
}

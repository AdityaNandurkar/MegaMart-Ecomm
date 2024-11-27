import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFormatInput]'
})
export class FormatInputDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits

    if (input.name === 'cardNumber') {
      // Format card number as "1234 5678 9012 3456"
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else if (input.name === 'expiryDate') {
      // Format expiry date as "MM/YY"
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
    }

    input.value = value;
  }
}

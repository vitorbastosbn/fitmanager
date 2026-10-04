import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mascararCpf',
  standalone: true
})
export class MascararCpfPipe implements PipeTransform {
  transform(value?: string | null): string {
    if (!value) return '';
    // Remove non-numeric characters
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) {
      return value;
    }
    // Format: 123.***.***-00 (LGPD privacy masking standard)
    return `${digits.slice(0, 3)}.***.***-${digits.slice(9, 11)}`;
  }
}

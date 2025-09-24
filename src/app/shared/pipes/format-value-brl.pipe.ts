import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValueBrl',
})
export class FormatValueBrlPipe implements PipeTransform {
  transform(value: number | null | undefined | 'custom'): string {
    if (value === 'custom') return 'Outros valores';
    if (value === null || value === undefined || isNaN(value)) return '';

    let formattedValue = value.toFixed(2);

    formattedValue = formattedValue.replace('.', ',');

    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `R$ ${formattedValue}`;
  }
}

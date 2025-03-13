import { Component, effect, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { controlToSignal } from '../../core/utils/helpers';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
interface SearchParams {
  query: string;
  language: string;
  minStars: number | null;
}
@Component({
  selector: 'app-filter',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  searchQuery = new FormControl<string>('');
  language = new FormControl<string>('');
  minStars = new FormControl<number | null>(null);

  private searchQuerySignal = controlToSignal(this.searchQuery, '');
  private languageSignal = controlToSignal(this.language, '');
  private minStarsSignal = controlToSignal(this.minStars, null);

  searchParams = output<SearchParams>();

  constructor() {
    effect(() => {
      this.emitSearchParams();
    });
  }

  private emitSearchParams() {
    const params: SearchParams = {
      query: this.searchQuerySignal()!,
      language: this.languageSignal()!,
      minStars: this.minStarsSignal(),
    };
    this.searchParams.emit(params);
  }
}

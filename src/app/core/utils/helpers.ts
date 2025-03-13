import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, startWith, tap } from 'rxjs';
import { Signal } from '@angular/core';

export function controlToSignal<T>(
  control: FormControl<T>,
  initialValue: T,
  debounceMs: number = 300
): Signal<T> {
  const source$ = control.valueChanges.pipe(
    debounceTime(debounceMs),
    distinctUntilChanged(),
  );
  const signalResult = toSignal(source$, { initialValue });
  return signalResult;
}
export function isNonEmpty(value: string): boolean {
    return value?.trim() !== '' && value !== undefined;
  }
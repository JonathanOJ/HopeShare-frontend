import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupportDialogService {
  private visibleSubject = new BehaviorSubject<boolean>(false);
  public visible$ = this.visibleSubject.asObservable();

  open(): void {
    console.log('SupportDialogService.open() called'); // Debug log
    this.visibleSubject.next(true);
    console.log('BehaviorSubject value after next():', this.visibleSubject.value); // Debug log
  }

  close(): void {
    console.log('SupportDialogService.close() called'); // Debug log
    this.visibleSubject.next(false);
  }
}


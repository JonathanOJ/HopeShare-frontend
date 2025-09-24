import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LoadingService {
  private subjectEnable = new Subject<boolean>();


  getEnableObservable(): Observable<boolean> {
    return this.subjectEnable;
  }

  start(): void {
    this.subjectEnable.next(true);
  }

  done(): void {
    this.subjectEnable.next(false);
  }
}

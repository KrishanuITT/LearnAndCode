// @ts-nocheck
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  log(message: any, ...optionalParams: any[]) {
    console.log('[LOG]', message, ...optionalParams);
  }
}

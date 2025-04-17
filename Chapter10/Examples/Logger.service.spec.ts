// @ts-nocheck
import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service'; // fixed name case

describe('LoggerService', () => {
  let service: LoggerService;

  it('should log messages using console.log', () => {
    // Arrange
    const spy = spyOn(console, 'log');
    const message = 'Test log';

    // Act
    service.log(message);

    // Assert
    expect(spy).toHaveBeenCalledWith('[LOG]', message);
  });
  
});

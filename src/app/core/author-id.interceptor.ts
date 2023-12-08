import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable()
export class AuthorIdInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let clonedRequest = request.clone({
      headers: request.headers.set('authorId', environment.authorId),
    });

    // Response
    return next.handle(clonedRequest).pipe(
      // Response
      catchError((error: HttpErrorResponse) => {
        console.log('error', error);
        let errorMessage = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          if (error.status === 200) {
            errorMessage =
              error.error?.returnMessage || 'Error inesperado en la respuesta.';
          } else if (error.status === 400) {
            errorMessage = 'Header ‘authorId’ is missing';
          } else if (error.status === 206) {
            errorMessage = 'name y description no deben ser nulo';
          } else if (
            error.status === 404 &&
            request.url.includes('/bp/products')
          ) {
            errorMessage = 'Not product found with that id';
          } else {
            errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }
        console.error('Error en el interceptor:', errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}

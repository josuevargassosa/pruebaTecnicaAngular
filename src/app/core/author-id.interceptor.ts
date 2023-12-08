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
        return throwError(error);
      })
    );
  }
}

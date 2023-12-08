import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { AuthorIdInterceptor } from './author-id.interceptor';
import { environment } from 'src/environments/environment';

describe('AuthorIdInterceptor', () => {
  let interceptor: AuthorIdInterceptor;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthorIdInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthorIdInterceptor,
          multi: true,
        },
      ],
    });

    interceptor = TestBed.inject(AuthorIdInterceptor);
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add authorId header to the request', () => {
    const testUrl = 'https://api.example.com/data';
    const testData = { test: 'data' };

    http.get(testUrl).subscribe();

    const httpRequest = httpMock.expectOne(testUrl);
    expect(httpRequest.request.headers.has('authorId')).toBe(true);
    expect(httpRequest.request.headers.get('authorId')).toEqual(
      environment.authorId
    );

    httpRequest.flush(testData);
  });
});

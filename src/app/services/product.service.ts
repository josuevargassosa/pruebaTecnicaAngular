import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';

import { environment } from 'src/environments/environment.prod';
import { ProductForm } from '../models/product-form';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiURL = environment.apiURL;

  constructor(private http: HttpClient) {}

  //OBTENER PRODUCTOS FINANCIEROS
  getFinancialProducts(): Observable<ProductForm[]> {
    return this.http.get<ProductForm[]>(`${this.apiURL}/bp/products`);
  }

  //CREAR PRODUCTO FINANCIERO
  createFinancialProduct(newProduct: ProductForm): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/bp/products`, newProduct).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('error', error);
        if (error.status === 206) {
          return throwError('Mensaje de error código 206');
        } else {
          return throwError(error);
        }
      })
    );
  }

  //PUT PRODUCTO FINANCIERO
  updateFinancialProduct(product: ProductForm): Observable<ProductForm> {
    return this.http.put<ProductForm>(`${this.apiURL}/bp/products`, product);
  }

  //ELIMINAR PRODUCTO FINANCIERO
  deleteFinancialProduct(id: string) {
    return this.http
      .delete(`${this.apiURL}/bp/products`, {
        params: {
          id: id,
        },
        responseType: 'text',
      })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar producto:', error);
          return throwError(error);
        })
      );
  }

  //VALIDAR SI EXISTE EL PRODUCTO FINANCIERO POR ID
  existFinancialProduct(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiURL}/bp/products/verification`, {
      params: {
        id: id,
      },
    });
  }
}

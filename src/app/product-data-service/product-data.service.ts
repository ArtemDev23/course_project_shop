import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductDataService {

  private apiUrlAllProducts = 'https://fakestoreapi.com/products';
  private apiUrlCategory = 'https://fakestoreapi.com/products/categories';
  private apiUrlCarts = 'https://fakestoreapi.com/carts';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get(this.apiUrlAllProducts);

  }

  getCategories() {
    return this.http.get(this.apiUrlCategory);
  }

  getProductById(productId: number) {
    return this.http.get(`${this.apiUrlAllProducts}/${productId}`);
  }

  getAllCarts() {
    return this.http.get<any[]>(this.apiUrlCarts);
  }

  getCartsDetails(basketId: number) {
    return this.http.get<any>(`${this.apiUrlCarts}/${basketId}`)
  }

  filterCartsByDate(fromDate: string, toDate: string) {
    return this.http.get<any[]>(`${this.apiUrlCarts}/date?start=${fromDate}&end=${toDate}`);
    }

  getPlaceOrder() {
      return this.http.post(this.apiUrlCarts, {});
  }
  
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private products: any[] = [];
  private itemCountSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(product: any) {
    this.products.push(product);
    this.itemCountSubject.next(this.products.length);
  }

  getCartItems() {
    return this.products;
  }

  getTotalPrice() {
    return this.products.reduce((total, product) => total + product.price, 0);
  }

  getCartItemCount() {
    return this.itemCountSubject.asObservable();
  }

  removeFromCart(product: any) {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.itemCountSubject.next(this.products.length);
    }
  }

  clearCart() {
    this.products = [];
    this.itemCountSubject.next(0);
  }
}
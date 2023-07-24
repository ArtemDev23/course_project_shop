import { Component, OnInit } from '@angular/core';
import { ProductDataService } from '../product-data-service/product-data.service';
import { map, switchMap  } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  baskets: any[] = [];
  selectedBasket: any = null;
  fromDate: string = '';
  toDate: string = '';
  totalAmount: number = 0;
  sortByDateAsc: boolean = true;

  constructor(private productService: ProductDataService) {}

  ngOnInit() {
    this.getAllCarts();
  }

  getAllCarts() {
    this.productService.getAllCarts().subscribe(
      (response: any) => {
        this.baskets = response;
        console.log(this.baskets);
        this.calculateTotalAmount();

      }
    );
  }

  getProductPrice(productId: number) {
    return this.productService.getProductById(productId).pipe(
      map((response: any) => response.price)
    );
  }

  calculateTotalAmount() {
    let totalBasketAmounts: number[] = [];
    this.baskets.forEach((basket) => {
      let basketTotal = 0;
      const productObservables = basket.products.map((product: any) =>
        this.getProductPrice(product.productId)
      );
    
      forkJoin(productObservables).subscribe((prices: any) => {
        for (let i = 0; i < prices.length; i++) {
          basketTotal += prices[i] * basket.products[i].quantity;
        }
        basket.totalAmount = Number(basketTotal.toFixed(2));
        totalBasketAmounts.push(basketTotal);
    
        if (totalBasketAmounts.length === this.baskets.length) {
          this.totalAmount = totalBasketAmounts.reduce((total, amount) => total + amount, 0);
          this.totalAmount = Number(this.totalAmount.toFixed(2));
        }
      });
    });
  }

  getCartsDetails(basketId: number) {
    this.productService.getCartsDetails(basketId).pipe(
      switchMap((response) => {
        this.selectedBasket = response;
        if (this.selectedBasket) {
          const productObservables = this.selectedBasket.products.map((product: any) =>
            this.productService.getProductById(product.productId).pipe(
              map((productResponse: any) => {
                product.imageUrl = productResponse.image;
                product.title = productResponse.title;
                product.price = productResponse.price;
                product.totalPrice = Number((productResponse.price * product.quantity).toFixed(2));
                return product;
              })
            )
          );
          return forkJoin(productObservables);
        } else {
          return [];
        }
      })
    ).subscribe((products: any) => {
      this.selectedBasket.products = products;
      let basketTotal = 0;
      products.forEach((product: any) => {
        basketTotal += product.totalPrice;
      });
      this.selectedBasket.totalAmount = Number(basketTotal.toFixed(2));
    });
  }
  

  filterCartsByDate() {
    if (this.fromDate && this.toDate) {
      this.productService.getAllCarts().subscribe(
        (response: any[]) => {
          const startDate = new Date(this.fromDate);
          const endDate = new Date(this.toDate);
          // Filter the carts created within the specified date range
          this.baskets = response.filter((cart) => {
            const createdAt = new Date(cart.date)
            return createdAt >= startDate && createdAt <= endDate;
          });
          this.calculateTotalAmount();
          // this.baskets = [];
          this.totalAmount = 0;
        }
 
      );
    } else {
      this.getAllCarts();
    }
  }
}


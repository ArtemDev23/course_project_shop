import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductDataService } from '../product-data-service/product-data.service';
import { CartService } from '../cart-service/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  count: number = 0;
  productId: number = 0;
  product: any = {};

  constructor(
    private route: ActivatedRoute,
    private productService: ProductDataService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      this.loadProductDetails();
    });
  }

  loadProductDetails() {
    this.productService.getProductById(this.productId).subscribe(
      (response: any) => {
        this.product = response;
        if (this.product.rating) {
          this.product.rating.rate = this.product.rating.rate || 0;
          this.product.rating.count = this.product.rating.count || 0;
        } else {
          this.product.rating = {
            rate: 0,
            count: 0
          };
        }
      }
    );
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
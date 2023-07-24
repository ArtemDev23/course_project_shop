import { Component, OnInit } from '@angular/core';
import { ProductDataService } from '../product-data-service/product-data.service';
import { Router } from '@angular/router';
import { CartService } from '../cart-service/cart.service';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  sortDirection: string = 'asc';
  currentPage: number = 1;
  pageSize: number = 6;
  totalItems: number = 0;

  constructor(private productService: ProductDataService, private router: Router, private cartService: CartService) { }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (response: any) => {
        // Filter products by category if a category is selected
        if (this.selectedCategory) {
          this.products = response.filter((product: any) => product.category === this.selectedCategory);
        } else {
          this.products = response;
          console.log(this.products)
        }

        // Sort products based on sortDirection (asc or desc)
      this.products.sort((a: any, b: any) => {
        if (this.sortDirection === 'asc') {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });

        this.totalItems = this.products.length;
        this.paginateProducts();
      }
    );
  }
  
  loadCategories() {
    this.productService.getCategories().subscribe(
      (response: any) => {
        this.categories = response;
        console.log(this.categories);
      }
    );
  }

  filterByCategory() {
    this.currentPage = 1;
    this.loadProducts();
  }
  

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.loadProducts();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
  

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  paginateProducts() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = this.products.slice(startIndex, endIndex);
  }

  viewProductDetails(product: any) {
    this.router.navigate(['/product-details', product.id]);
  }
    
     
}
  

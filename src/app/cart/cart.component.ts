import { Component, OnInit, ViewChild  } from '@angular/core';
import { CartService } from '../cart-service/cart.service';
import { ProductDataService } from '../product-data-service/product-data.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  itemCount: number = 0;

  @ViewChild('orderConfirmation', { static: false }) orderConfirmation: any;

  constructor(private cartService: CartService, private productService: ProductDataService, private modalService: NgbModal) { }

  ngOnInit() {
    this.loadCartItems();
    this.subscribeToItemCount();
  }

  loadCartItems() {
    this.cartItems = this.cartService.getCartItems();
    this.cartItems.forEach(item => {
      if (!item.quantity) {
        item.quantity = 1; // Set the initial quantity to 1 if not already set
      }
    });
    this.calculateTotalPrice();
    this.updateItemCount();
  }

  removeFromCart(product: any) {
    this.cartService.removeFromCart(product);
    this.loadCartItems();
  }

  clearCart() {
    this.cartService.clearCart();
    this.loadCartItems();
  }

  private subscribeToItemCount() {
    this.cartService.getCartItemCount().subscribe(itemCount => {
      this.itemCount = itemCount;
    });
  }

  // Функція для відкриття модального вікна підтвердження замовлення
  openOrderConfirmationModal() {
    this.modalService.open(this.orderConfirmation).result.then((result) => {
      if (result === 'confirm') {
        // Викликати метод підтвердження замовлення тут, якщо потрібно
        this.placeOrder();
      }
    }, (reason) => {
      // Обробка закриття модального вікна без підтвердження
      console.log('Закрито без підтвердження замовлення.');
    });
  }

  placeOrder() {
    const orderData = {
      items: this.cartItems,
      total: this.totalPrice
    };
    this.productService.getPlaceOrder().subscribe(
      (response) => {
        this.openOrderConfirmationModal()
        console.log('Order placed successfully:', response, orderData);
        this.cartService.clearCart(); 
        this.loadCartItems();
        // alert(`Покупка оформлена!`);
      }
    );
  }

  // Функція для збільшення кількості товару
  increaseQuantity(item: any) {
    item.quantity = item.quantity ? item.quantity + 1 : 1;
    this.calculateTotalPrice();
    this.updateItemCount();
  }

  // Функція для зменшення кількості товару
  decreaseQuantity(item: any) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
      this.calculateTotalPrice();
      this.updateItemCount();
    }
  }

  // Функція для перерахунку загальної вартості
  calculateTotalPrice() {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      if (item.quantity && item.price) {
        return total + item.price * item.quantity;
      } else {
        return total;
      }
    }, 0);
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }

  // Функція для оновлення кількості товарів у кошику
  updateItemCount() {
    this.itemCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }
  
}

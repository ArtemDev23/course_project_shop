
import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart-service/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuActive: boolean = false;
  itemCount: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.getCartItemCount().subscribe(itemCount => {
      this.itemCount = itemCount;
    });
  }

  closeMenu() {
    this.menuActive = false;
  }
}

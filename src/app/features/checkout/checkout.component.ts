import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CheckoutService } from '../../core/services/checkout.service';
import { PricingService } from '../../core/services/pricing.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  checkoutService = inject(CheckoutService);
  pricingService = inject(PricingService);

  items = this.checkoutService.items;
  total = this.checkoutService.total;
  availableItems = this.pricingService.getAllItems();

  scanItem(itemName: string): void {
    this.checkoutService.scan(itemName);
  }

  removeItem(itemName: string): void {
    this.checkoutService.removeItem(itemName);
  }

  clearCart(): void {
    this.checkoutService.clear();
  }

  getOffer(itemName: string): string | null {
    const offer = this.pricingService.getOffer(itemName);
    return offer ? `${offer.quantity} for ${offer.specialPrice} Coins` : null;
  }
}

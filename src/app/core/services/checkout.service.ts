import { Injectable, computed, inject, signal } from '@angular/core';
import { PricingService } from './pricing.service';

export interface ScannedItem {
  name: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private pricingService = inject(PricingService);
  private scannedItems = signal<Map<string, number>>(new Map());

  items = computed<ScannedItem[]>(() => {
    return Array.from(this.scannedItems().entries()).map(([name, quantity]) => ({
      name,
      quantity,
    }));
  });

  total = computed<number>(() => {
    let totalPrice = 0;
    this.scannedItems().forEach((quantity, itemName) => {
      totalPrice += this.pricingService.calculatePrice(itemName, quantity);
    });
    return totalPrice;
  });

  scan(itemName: string): void {
    const item = this.pricingService.getItem(itemName);
    if (!item) {
      console.warn(`Item "${itemName}" not found in pricing`);
      return;
    }

    const currentItems = new Map(this.scannedItems());
    const currentQuantity = currentItems.get(itemName) || 0;
    currentItems.set(itemName, currentQuantity + 1);
    this.scannedItems.set(currentItems);
  }

  removeItem(itemName: string): void {
    const currentItems = new Map(this.scannedItems());
    const currentQuantity = currentItems.get(itemName) || 0;

    if (currentQuantity > 1) {
      currentItems.set(itemName, currentQuantity - 1);
    } else {
      currentItems.delete(itemName);
    }

    this.scannedItems.set(currentItems);
  }

  clear(): void {
    this.scannedItems.set(new Map());
  }

  getItemQuantity(itemName: string): number {
    return this.scannedItems().get(itemName) || 0;
  }
}

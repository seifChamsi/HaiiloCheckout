import { Injectable, signal } from '@angular/core';
import { Item } from '../models/item';
import { Offer } from '../models/offer';

@Injectable({
  providedIn: 'root',
})
export class PricingService {
  private items = signal<Map<string, Item>>(new Map());
  private offers = signal<Map<string, Offer>>(new Map());

  constructor() {
    this.initializePricing();
  }

  private initializePricing(): void {
    // Init items
    const itemsData: Item[] = [
      { name: 'Apple', price: 30 },
      { name: 'Banana', price: 50 },
      { name: 'Peach', price: 60 },
      { name: 'Kiwi', price: 20 },
    ];

    // Init offers
    const offersData: Offer[] = [
      { itemName: 'Apple', quantity: 2, specialPrice: 45 },
      { itemName: 'Banana', quantity: 3, specialPrice: 130 },
    ];

    const itemsMap = new Map<string, Item>();
    itemsData.forEach((item) => itemsMap.set(item.name, item));
    this.items.set(itemsMap);

    const offersMap = new Map<string, Offer>();
    offersData.forEach((offer) => offersMap.set(offer.itemName, offer));
    this.offers.set(offersMap);
  }

  getItem(name: string) {
    return this.items().get(name);
  }

  getOffer(itemName: string) {
    return this.offers().get(itemName);
  }

  getAllItems(): Item[] {
    return Array.from(this.items().values());
  }

  calculatePrice(itemName: string, quantity: number): number {
    const item = this.getItem(itemName);

    if (!item) {
      return 0;
    }

    const offer = this.getOffer(itemName);
    if (!offer) {
      return item.price * quantity;
    }

    const offerSets = Math.floor(quantity / offer.quantity);
    const remainder = quantity % offer.quantity;

    return offerSets * offer.specialPrice + remainder * item.price;
  }

  updateItemPrice(itemName: string, newPrice: number): void {
    const item = this.getItem(itemName);
    if (item) {
      const updatedItems = new Map(this.items());
      updatedItems.set(itemName, { ...item, price: newPrice });
      this.items.set(updatedItems);
    }
  }

  addOffer(offer: Offer): void {
    const updatedOffers = new Map(this.offers());
    updatedOffers.set(offer.itemName, offer);
    this.offers.set(updatedOffers);
  }

  removeOffer(itemName: string): void {
    const updatedOffers = new Map(this.offers());
    updatedOffers.delete(itemName);
    this.offers.set(updatedOffers);
  }
}

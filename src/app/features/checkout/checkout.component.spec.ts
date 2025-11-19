import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have available items', () => {
    expect(component.availableItems.length).toBeGreaterThan(0);
  });

  it('should have empty cart initially', () => {
    expect(component.items().length).toBe(0);
  });

  it('should have zero total initially', () => {
    expect(component.total()).toBe(0);
  });

  it('should scan an item and add it to cart', () => {
    component.scanItem('Banana');
    expect(component.items().length).toBe(1);
    expect(component.items()[0].name).toBe('Banana');
    expect(component.items()[0].quantity).toBe(1);
  });

  it('should increase quantity when scanning same item multiple times', () => {
    component.scanItem('Apple');
    component.scanItem('Apple');
    expect(component.items().length).toBe(1);
    expect(component.items()[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    component.scanItem('Apple');
    component.scanItem('Banana');
    component.scanItem('Kiwi');
    component.scanItem('Banana');
    expect(component.total()).toBe(150);
  });

  it('should remove item from cart', () => {
    component.scanItem('Apple');
    component.scanItem('Apple');
    component.removeItem('Apple');
    expect(component.items()[0].quantity).toBe(1);
  });

  it('should remove item completely when quantity reaches zero', () => {
    component.scanItem('Apple');
    component.removeItem('Apple');
    expect(component.items().length).toBe(0);
  });

  it('should clear all items from cart', () => {
    component.scanItem('Apple');
    component.scanItem('Banana');
    component.clearCart();
    expect(component.items().length).toBe(0);
    expect(component.total()).toBe(0);
  });

  it('should apply discount for multiple items', () => {
    component.scanItem('Apple');
    component.scanItem('Apple');
    expect(component.total()).toBe(45); // 2 for 45 offer
  });

  it('should return offer text for items with offers', () => {
    const offer = component.getOffer('Apple');
    expect(offer).toBe('2 for 45 Coins');
  });

  it('should return null for items without offers', () => {
    const offer = component.getOffer('Peach');
    expect(offer).toBeNull();
  });

  it('should handle complex mixed basket with multiple offers and non-offer items', () => {
    // Scan: 3 Apples, 4 Bananas, 2 Peaches, 1 Kiwi
    component.scanItem('Apple');
    component.scanItem('Banana');
    component.scanItem('Apple');
    component.scanItem('Peach');
    component.scanItem('Banana');
    component.scanItem('Apple');
    component.scanItem('Banana');
    component.scanItem('Kiwi');
    component.scanItem('Banana');
    component.scanItem('Peach');

    expect(component.items().length).toBe(4);

    const apples = component.items().find((item) => item.name === 'Apple');
    const bananas = component.items().find((item) => item.name === 'Banana');
    const peaches = component.items().find((item) => item.name === 'Peach');
    const kiwis = component.items().find((item) => item.name === 'Kiwi');

    expect(apples?.quantity).toBe(3);
    expect(bananas?.quantity).toBe(4);
    expect(peaches?.quantity).toBe(2);
    expect(kiwis?.quantity).toBe(1);

    // Calculate expected total:
    // 3 Apples: 2 for 45 Coins + 1 for 30 Coins = 75 Coins
    // 4 Bananas: 3 for 130 Coins + 1 for 50 Coins = 180 Coins
    // 2 Peaches: 2 × 60 Coins = 120 Coins
    // 1 Kiwi: 1 × 20 Coins = 20 Coins
    // Total: 395 Coins
    expect(component.total()).toBe(395);
  });
});

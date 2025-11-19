import { Item } from './item';
import { Offer } from './offer';

export interface PricingRule {
  item: Item;
  offer?: Offer;
}

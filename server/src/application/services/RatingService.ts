// src/application/services/RatingService.ts

import { DeliveryBoy } from '../../domain/entities/DeliveryBoy';
import { IRatingService } from '../../domain/interface/services/IRatingService';


export class RatingService implements IRatingService {
  calculateAverageRating(deliveryBoy: DeliveryBoy): number {
    if (!deliveryBoy.reviews || deliveryBoy.reviews.length === 0) {
      return 0;
    }

    const sum = deliveryBoy.reviews.reduce(
      (total, review) => total + review.rating,
      0
    );
    const average = sum / deliveryBoy.reviews.length;
    
    // Round to 1 decimal place
    return Math.round(average * 10) / 10;
  }
}
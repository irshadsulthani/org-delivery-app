import { DeliveryBoy } from './../../entities/DeliveryBoy';


export interface IRatingService {
    calculateAverageRating(DeliveryBoy: DeliveryBoy): number;
}
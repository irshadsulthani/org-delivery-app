

export interface IUpdateDeliveryBoyVerificationStatus {
  execute(
    deliveryBoyId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<void>;
}

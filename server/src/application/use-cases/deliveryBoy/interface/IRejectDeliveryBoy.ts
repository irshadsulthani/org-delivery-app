

export interface IRejectDeliveryBoy {
  execute(id: string): Promise<void>;
}

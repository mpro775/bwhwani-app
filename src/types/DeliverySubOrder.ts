export interface DeliverySubOrder {
  _id: string;
  storeId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  deliveryDriverId?: string;
  deliveryStatus?: "pending" | "on_the_way" | "delivered";
}

export interface DeliveryOrder {
  _id: string;
  subOrders: DeliverySubOrder[];
}

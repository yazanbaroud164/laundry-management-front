import { Service } from './service.model';

export interface OrderItem {
  id?: number;
  orderId?: number;
  serviceId: number;
  service?: Service;
  quantity: number;
  price: number;
}

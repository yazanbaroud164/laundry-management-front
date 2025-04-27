import { Customer } from './customer.model';
import { OrderItem } from './order-item.model';

export interface Order {
  id?: number;
  customerId: number;
  customer?: Customer;
  orderDate: Date | string;
  status: string;
  totalAmount: number;
  orderItems: OrderItem[];
}


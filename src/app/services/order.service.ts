import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderItem } from '../models/order-item.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  // private orderUrl = 'api/Order';
  private orderUrl = 'https://laundryback.onrender.com/api/Order/';
  private orderItemUrl = 'api/OrderItem';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.orderUrl+ 'GetAllOrders');
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.orderUrl + 'GetOrderById'}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.orderUrl + 'CreateOrder', order);
  }

  updateOrder(id: number | undefined, order: Order): Observable<any> {
    return this.http.put(`${this.orderUrl + 'UpdateOrder'}/${id}`, order);
  }

  deleteOrder(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.orderUrl + 'DeleteOrder'}/${id}`);
  }

  // Order Item methods
  getOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.orderItemUrl);
  }

  getOrderItem(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.orderItemUrl}/${id}`);
  }

  createOrderItem(item: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.orderItemUrl, item);
  }

  updateOrderItem(id: number, item: OrderItem): Observable<any> {
    return this.http.put(`${this.orderItemUrl}/${id}`, item);
  }

  deleteOrderItem(id: number): Observable<any> {
    return this.http.delete(`${this.orderItemUrl}/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { HttpClient, HttpClientModule  } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'https://laundryback.onrender.com/api/Customer/';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl + 'GetAllUsers');
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl + 'GetById'}/${id}`);
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl + 'CreateUser', customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl+ 'UpdateUser'}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl + 'DeleteUser'}/${id}`);
  }
}

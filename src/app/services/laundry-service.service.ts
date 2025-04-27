import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Service } from '../models/service.model';

@Injectable({
  providedIn: 'root',
})
export class LaundryServiceService {
  private apiUrl = 'http://10.0.0.6:5213/api/Service/';

  constructor(private http: HttpClient) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.apiUrl + 'GetAllServices');
  }

  getService(id: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl + 'GetServiceById'}/${id}`);
  }

  createService(service: Service): Observable<Service> {
    return this.http.post<Service>(this.apiUrl + 'CreateService', service);
  }

  updateService(id: number, service: Service): Observable<any> {
    return this.http.put(`${this.apiUrl + 'UpdateService'}/${id}`, service);
  }

  deleteService(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl + 'DeleteService'}/${id}`);
  }
}

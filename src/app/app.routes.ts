import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CustomerDetailComponent } from './components/customers/customer-detail/customer-detail.component';
import { CustomerListComponent } from './components/customers/customer-list/customer-list.component';
import { OrderDetailComponent } from './components/orders/order-detail/order-detail.component';
import { OrderListComponent } from './components/orders/order-list/order-list.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ServiceDetailComponent } from './components/services/service-detail/service-detail.component';
import { ServiceListComponent } from './components/services/service-list/service-list.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'customers', component: CustomerListComponent },
    { path: 'customers/:id', component: CustomerDetailComponent },
    { path: 'services', component: ServiceListComponent },
    { path: 'services/:id', component: ServiceDetailComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'orders', component: OrderListComponent },
    { path: 'orders/:id', component: OrderDetailComponent }
  ];

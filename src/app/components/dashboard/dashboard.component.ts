import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import { LaundryServiceService } from '../../services/laundry-service.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, DatePipe, NgIf, NgFor, NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';

// Register Hebrew locale
registerLocaleData(localeHe, 'he');

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatTableModule, 
    NgIf, 
    NgFor,
    NgStyle,
    RouterModule, 
    DatePipe, 
    CurrencyPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalCustomers = 0;
  totalOrders = 0;
  totalServices = 0;
  totalProducts = 0;
  recentOrders: any[] = [];
  loading = true;
  isMobile = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private customerService: CustomerService,
    private orderService: OrderService,
    private serviceService: LaundryServiceService,
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Monitor screen size changes
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isMobile = result.matches;
      });
      
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      customers: this.customerService.getCustomers(),
      orders: this.orderService.getOrders(),
      services: this.serviceService.getServices(),
      products: this.productService.getProducts(),
    }).subscribe({
      next: (result) => {
        this.totalCustomers = result.customers.length;
        this.totalOrders = result.orders.length;
        this.totalServices = result.services.length;
        this.totalProducts = result.products.length;

        // Get recent orders (last 5)
        this.recentOrders = result.orders
          .sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
          .slice(0, 5);

        this.loading = false;
      },
      error: (error) => {
        console.error('שגיאה בטעינת נתוני לוח הבקרה', error);
        this.loading = false;
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'grey';
      case 'New':
        return 'blue';
      case 'Processing':
        return 'orange';
      case 'Ready':
        return 'green';
      case 'Completed':
        return 'purple';
      case 'Cancelled':
        return 'red';
      default:
        return 'grey';
    }
  }

  // New method to translate status to Hebrew
  getStatusHebrew(status: string): string {
    switch (status) {
      case 'Pending':
        return 'ממתין';
      case 'New':
        return 'חדש';
      case 'Processing':
        return 'בטיפול';
      case 'Ready':
        return 'מוכן';
      case 'Completed':
        return 'הושלם';
      case 'Cancelled':
        return 'בוטל';
      default:
        return status;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
// import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
// import { Order } from '../../../models/order.model';
// import { OrderService } from '../../../services/order.service';
// import { MatIconModule } from '@angular/material/icon';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatTableModule } from '@angular/material/table';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

// @Component({
//   selector: 'app-order-list',
//   standalone: true,
//   imports: [CommonModule, MatButtonModule, MatInputModule, MatPaginatorModule, MatCardModule, MatFormFieldModule, MatIconModule, MatChipsModule, MatMenuModule, MatTableModule, DatePipe, CurrencyPipe],
//   templateUrl: './order-list.component.html',
//   styleUrl: './order-list.component.scss',
// })
// export class OrderListComponent implements OnInit {
//   displayedColumns: string[] = [
//     'id',
//     'customer',
//     'date',
//     'status',
//     'amount',
//     'actions',
//   ];
//   dataSource = new MatTableDataSource<Order>([]);
//   filteredData: Order[] = []; // For mobile view
//   statusOptions = ['New', 'Processing', 'Ready', 'Completed', 'Cancelled'];
//   isMobile = false;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   constructor(
//     private orderService: OrderService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private router: Router
//   ) {
//     this.checkScreenSize();
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize() {
//     this.checkScreenSize();
//   }

//   checkScreenSize() {
//     this.isMobile = window.innerWidth < 768;
//   }

//   ngOnInit(): void {
//     this.loadOrders();
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;

//     // Update filtered data when datasource changes
//     this.dataSource.connect().subscribe(data => {
//       this.filteredData = data;
//     });
//   }

//   loadOrders(): void {
//     this.orderService.getOrders().subscribe({
//       next: (orders) => {
//         this.dataSource.data = orders;
//         this.filteredData = orders;
//       },
//       error: (error) => {
//         console.error('Error loading orders', error);
//         this.snackBar.open('Error loading orders', 'Close', { duration: 3000 });
//       },
//     });
//   }

//   applyFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }

//     // Update filtered data for mobile view
//     this.filteredData = this.dataSource.filteredData;
//   }

//   addOrder(): void {
//     this.router.navigate(['/orders', 'new']);
//   }

//   viewOrder(order: Order): void {
//     this.router.navigate(['/orders', order.id]);
//   }

//   updateStatus(order: Order, newStatus: string): void {
//     const updatedOrder = { ...order, status: newStatus };
//     this.orderService.updateOrder(order.id, updatedOrder).subscribe({
//       next: () => {
//         this.loadOrders();
//         this.snackBar.open(`Order status updated to ${newStatus}`, 'Close', {
//           duration: 3000,
//         });
//       },
//       error: (error) => {
//         console.error('Error updating order status', error);
//         this.snackBar.open('Error updating order status', 'Close', {
//           duration: 3000,
//         });
//       },
//     });
//   }

//   deleteOrder(id: number | undefined): void {
//     if (confirm('Are you sure you want to delete this order?')) {
//       this.orderService.deleteOrder(id).subscribe({
//         next: () => {
//           this.loadOrders();
//           this.snackBar.open('Order deleted successfully', 'Close', {
//             duration: 3000,
//           });
//         },
//         error: (error) => {
//           console.error('Error deleting order', error);
//           this.snackBar.open('Error deleting order', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     }
//   }

//   getStatusColor(status: string): string {
//     switch (status) {
//       case 'New':
//         return 'blue';
//       case 'Processing':
//         return 'orange';
//       case 'Ready':
//         return 'green';
//       case 'Completed':
//         return 'purple';
//       case 'Cancelled':
//         return 'red';
//       default:
//         return 'grey';
//     }
//   }
// }

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatTableModule,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'customer',
    'date',
    'status',
    'amount',
    'actions',
  ];
  dataSource = new MatTableDataSource<Order>([]);
  filteredData: Order[] = []; // For mobile view
  statusOptions = ['ממתין', 'חדש', 'בתהליך', 'מוכן', 'הושלם', 'בוטל'];
  statusMap = {
    ממתין: 'Pending',
    חדש: 'New',
    בתהליך: 'Processing',
    מוכן: 'Ready',
    הושלם: 'Completed',
    בוטל: 'Cancelled',
  };
  // Reverse map for displaying translated status from English data
  englishToHebrewStatus = {
    Pending: 'ממתין',
    New: 'חדש',
    Processing: 'בתהליך',
    Ready: 'מוכן',
    Completed: 'הושלם',
    Cancelled: 'בוטל',
  };
  isMobile = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Update filtered data when datasource changes
    this.dataSource.connect().subscribe((data) => {
      this.filteredData = data;
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {

        this.filteredData = orders.map((order) => ({
          ...order,
          orderDate: new Date(new Date(order.orderDate).getTime() + (new Date(order.orderDate).getTimezoneOffset() * -60000))
        }));

        this.dataSource.data = this.filteredData;
      },
      error: (error) => {
        console.error('שגיאה בטעינת הזמנות', error);
        this.snackBar.open('שגיאה בטעינת הזמנות', 'סגור', { duration: 3000 });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Update filtered data for mobile view
    this.filteredData = this.dataSource.filteredData;
  }

  addOrder(): void {
    this.router.navigate(['/orders', 'new']);
  }

  viewOrder(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  updateStatus(order: Order, newHebrewStatus: string): void {
    // Convert Hebrew status to English for backend
    const status =
      this.statusMap[newHebrewStatus as keyof typeof this.statusMap];
    // const updatedOrder = { ...order, status: newStatus };

    this.orderService.updateStatusOrder(order.id, status).subscribe({
      next: () => {
        this.loadOrders();
        this.snackBar.open(`סטטוס ההזמנה עודכן ל${newHebrewStatus}`, 'סגור', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('שגיאה בעדכון סטטוס ההזמנה', error);
        this.snackBar.open('שגיאה בעדכון סטטוס ההזמנה', 'סגור', {
          duration: 3000,
        });
      },
    });
  }

  deleteOrder(id: number | undefined): void {
    if (confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          this.loadOrders();
          this.snackBar.open('ההזמנה נמחקה בהצלחה', 'סגור', {
            duration: 3000,
          });
        },
        error: (error) => {
          console.error('שגיאה במחיקת ההזמנה', error);
          this.snackBar.open('שגיאה במחיקת ההזמנה', 'סגור', {
            duration: 3000,
          });
        },
      });
    }
  }

  getStatusColor(status: string): string {
    console.log(status);

    switch (status) {
      case 'Pending':
      case 'ממתין':
        return 'grey';
      case 'New':
      case 'חדש':
        return 'blue';
      case 'Processing':
      case 'בתהליך':
        return 'orange';
      case 'Ready':
      case 'מוכן':
        return 'green';
      case 'Completed':
      case 'הושלם':
        return 'purple';
      case 'Cancelled':
      case 'בוטל':
        return 'red';
      default:
        return 'grey';
    }
  }

  // Helper method to get Hebrew status
  getHebrewStatus(status: string): string {
    return (
      this.englishToHebrewStatus[
        status as keyof typeof this.englishToHebrewStatus
      ] || status
    );
  }
}

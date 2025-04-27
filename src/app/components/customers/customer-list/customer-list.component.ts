// import { Component, ViewChild, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Customer } from '../../../models/customer.model';
// import { CustomerService } from '../../../services/customer.service';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { MatSort } from '@angular/material/sort';
// import { MatDialog } from '@angular/material/dialog';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatInputModule } from '@angular/material/input';
// import { CommonModule } from '@angular/common';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// @Component({
//   selector: 'app-customer-list',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatCardModule, 
//     MatButtonModule, 
//     MatFormFieldModule, 
//     MatIconModule, 
//     MatTableModule, 
//     MatPaginatorModule, 
//     MatInputModule
//   ],
//   templateUrl: './customer-list.component.html',
//   styleUrl: './customer-list.component.scss'
// })
// export class CustomerListComponent implements OnInit {
//   displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address', 'actions'];
//   dataSource = new MatTableDataSource<Customer>([]);
//   isMobile = false;
//   filteredData: Customer[] = [];

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   constructor(
//     private customerService: CustomerService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private router: Router,
//     private breakpointObserver: BreakpointObserver
//   ) { }

//   ngOnInit(): void {
//     this.loadCustomers();
    
//     // Monitor screen size changes
//     this.breakpointObserver.observe([Breakpoints.HandsetPortrait])
//       .subscribe(result => {
//         this.isMobile = result.matches;
//       });
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   loadCustomers(): void {
//     this.customerService.getCustomers().subscribe({
//       next: (customers) => {
//         this.dataSource.data = customers;
//         this.filteredData = customers; // Initialize filteredData
//       },
//       error: (error) => {
//         console.error('Error loading customers', error);
//         this.snackBar.open('Error loading customers', 'Close', { duration: 3000 });
//       }
//     });
//   }

//   applyFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
    
//     // Update filtered data for mobile view
//     this.filteredData = this.dataSource.filteredData;

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   addCustomer(): void {
//     this.router.navigate(['/customers', 'new']);
//   }

//   editCustomer(customer: Customer): void {
//     this.router.navigate(['/customers', customer.id]);
//   }

//   deleteCustomer(id: number): void {
//     if (confirm('Are you sure you want to delete this customer?')) {
//       this.customerService.deleteCustomer(id).subscribe({
//         next: () => {
//           this.loadCustomers();
//           this.snackBar.open('Customer deleted successfully', 'Close', { duration: 3000 });
//         },
//         error: (error) => {
//           console.error('Error deleting customer', error);
//           this.snackBar.open('Error deleting customer', 'Close', { duration: 3000 });
//         }
//       });
//     }
//   }
// }


import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatInputModule
  ],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address', 'actions'];
  dataSource = new MatTableDataSource<Customer>([]);
  isMobile = false;
  filteredData: Customer[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    // Set document direction for RTL
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he';
    
    this.loadCustomers();
    
    // Monitor screen size changes
    this.breakpointObserver.observe([Breakpoints.HandsetPortrait])
      .subscribe(result => {
        this.isMobile = result.matches;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Customize paginator labels
    if (this.paginator) {
      this.paginator._intl.itemsPerPageLabel = 'פריטים לעמוד:';
      this.paginator._intl.nextPageLabel = 'העמוד הבא';
      this.paginator._intl.previousPageLabel = 'העמוד הקודם';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 מתוך ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} מתוך ${length}`;
      };
    }
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.dataSource.data = customers;
        this.filteredData = customers; // Initialize filteredData
      },
      error: (error) => {
        console.error('Error loading customers', error);
        this.snackBar.open('שגיאה בטעינת רשימת הלקוחות', 'סגור', { 
          duration: 3000,
          direction: 'rtl'
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // Update filtered data for mobile view
    this.filteredData = this.dataSource.filteredData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addCustomer(): void {
    this.router.navigate(['/customers', 'new']);
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id]);
  }

  deleteCustomer(id: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק לקוח זה?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
          this.snackBar.open('הלקוח נמחק בהצלחה', 'סגור', { 
            duration: 3000,
            direction: 'rtl'
          });
        },
        error: (error) => {
          console.error('Error deleting customer', error);
          this.snackBar.open('שגיאה במחיקת הלקוח', 'סגור', { 
            duration: 3000,
            direction: 'rtl'
          });
        }
      });
    }
  }
}
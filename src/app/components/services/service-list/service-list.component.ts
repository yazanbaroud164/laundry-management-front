// import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { Router } from '@angular/router';
// import { Service } from '../../../models/service.model';
// import { LaundryServiceService } from '../../../services/laundry-service.service';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatCardModule } from '@angular/material/card';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableModule } from '@angular/material/table';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { CurrencyPipe, NgIf, NgFor } from '@angular/common';

// @Component({
//   selector: 'app-service-list',
//   standalone: true,
//   imports: [
//     MatCardModule,
//     MatButtonModule, 
//     MatFormFieldModule, 
//     MatIconModule, 
//     MatPaginatorModule, 
//     MatTableModule, 
//     CurrencyPipe, 
//     MatInputModule,
//     NgIf,
//     NgFor
//   ],
//   templateUrl: './service-list.component.html',
//   styleUrl: './service-list.component.scss',
// })
// export class ServiceListComponent implements OnInit {
//   displayedColumns: string[] = [
//     'id',
//     'name',
//     'description',
//     'price',
//     'actions',
//   ];
//   dataSource = new MatTableDataSource<Service>([]);
//   filteredData: Service[] = [];
//   isMobile = false;
  
//   // Screen width breakpoint for mobile view
//   readonly MOBILE_BREAKPOINT = 768;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   constructor(
//     private serviceService: LaundryServiceService,
//     private dialog: MatDialog,
//     private snackBar: MatSnackBar,
//     private router: Router
//   ) {
//     // Initialize responsive view
//     this.checkScreenSize();
//   }

//   @HostListener('window:resize', ['$event'])
//   onResize() {
//     this.checkScreenSize();
//   }

//   checkScreenSize(): void {
//     this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
    
//     // Update filtered data for mobile view
//     if (this.isMobile && this.dataSource) {
//       this.updateFilteredData();
//     }
//   }

//   ngOnInit(): void {
//     this.loadServices();
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
    
//     // Subscribe to pagination and sorting events
//     if (this.paginator) {
//       this.paginator.page.subscribe(() => this.updateFilteredData());
//     }
    
//     if (this.sort) {
//       this.sort.sortChange.subscribe(() => this.updateFilteredData());
//     }
//   }

//   loadServices(): void {
//     this.serviceService.getServices().subscribe({
//       next: (services) => {
//         this.dataSource.data = services;
//         this.updateFilteredData();
//       },
//       error: (error) => {
//         console.error('Error loading services', error);
//         this.snackBar.open('Error loading services', 'Close', {
//           duration: 3000,
//         });
//       },
//     });
//   }

//   applyFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
    
//     this.updateFilteredData();
//   }

//   updateFilteredData(): void {
//     // Get the current page of data for mobile view
//     const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
//     const endIndex = startIndex + (this.paginator ? this.paginator.pageSize : 5);
    
//     // Apply filtering, sorting, and pagination manually for mobile view
//     this.filteredData = this.dataSource.filteredData.slice(startIndex, endIndex);
//   }

//   addService(): void {
//     this.router.navigate(['/services', 'new']);
//   }

//   editService(service: Service): void {
//     this.router.navigate(['/services', service.id]);
//   }

//   deleteService(id: number): void {
//     if (confirm('Are you sure you want to delete this service?')) {
//       this.serviceService.deleteService(id).subscribe({
//         next: () => {
//           this.loadServices();
//           this.snackBar.open('Service deleted successfully', 'Close', {
//             duration: 3000,
//           });
//         },
//         error: (error) => {
//           console.error('Error deleting service', error);
//           this.snackBar.open('Error deleting service', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     }
//   }
// }

import { Component, OnInit, ViewChild, HostListener, LOCALE_ID, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Service } from '../../../models/service.model';
import { LaundryServiceService } from '../../../services/laundry-service.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgIf, NgFor } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';

// Register the Hebrew locale
registerLocaleData(localeHe, 'he');

// Hebrew paginator labels
export class HebrewPaginatorIntl extends MatPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = 'פריטים בעמוד:';
    this.nextPageLabel = 'העמוד הבא';
    this.previousPageLabel = 'העמוד הקודם';
    this.firstPageLabel = 'העמוד הראשון';
    this.lastPageLabel = 'העמוד האחרון';
  }

  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 מתוך ${length}`;
    }
    
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    
    return `${startIndex + 1} - ${endIndex} מתוך ${length}`;
  };
}

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule, 
    MatFormFieldModule, 
    MatIconModule, 
    MatPaginatorModule, 
    MatTableModule, 
    CurrencyPipe, 
    MatInputModule,
    NgIf,
    NgFor
  ],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss',
  providers: [
    { provide: LOCALE_ID, useValue: 'he' },
    { provide: MatPaginatorIntl, useClass: HebrewPaginatorIntl }
  ]
})
export class ServiceListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'actions',
  ];
  dataSource = new MatTableDataSource<Service>([]);
  filteredData: Service[] = [];
  isMobile = false;
  
  // Screen width breakpoint for mobile view
  readonly MOBILE_BREAKPOINT = 768;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private serviceService: LaundryServiceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string
  ) {
    // Initialize responsive view
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;
    
    // Update filtered data for mobile view
    if (this.isMobile && this.dataSource) {
      this.updateFilteredData();
    }
  }

  ngOnInit(): void {
    // Set document direction for RTL
    document.documentElement.dir = 'rtl';
    document.body.dir = 'rtl';
    
    this.loadServices();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Subscribe to pagination and sorting events
    if (this.paginator) {
      this.paginator.page.subscribe(() => this.updateFilteredData());
    }
    
    if (this.sort) {
      this.sort.sortChange.subscribe(() => this.updateFilteredData());
    }
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (services) => {
        this.dataSource.data = services;
        this.updateFilteredData();
      },
      error: (error) => {
        console.error('Error loading services', error);
        this.snackBar.open('שגיאה בטעינת השירותים', 'סגור', {
          duration: 3000,
          direction: 'rtl'
        });
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
    this.updateFilteredData();
  }

  updateFilteredData(): void {
    // Get the current page of data for mobile view
    const startIndex = this.paginator ? this.paginator.pageIndex * this.paginator.pageSize : 0;
    const endIndex = startIndex + (this.paginator ? this.paginator.pageSize : 5);
    
    // Apply filtering, sorting, and pagination manually for mobile view
    this.filteredData = this.dataSource.filteredData.slice(startIndex, endIndex);
  }

  addService(): void {
    this.router.navigate(['/services', 'new']);
  }

  editService(service: Service): void {
    this.router.navigate(['/services', service.id]);
  }

  deleteService(id: number): void {
    if (confirm('האם אתה בטוח שברצונך למחוק את השירות הזה?')) {
      this.serviceService.deleteService(id).subscribe({
        next: () => {
          this.loadServices();
          this.snackBar.open('השירות נמחק בהצלחה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
        },
        error: (error) => {
          console.error('Error deleting service', error);
          this.snackBar.open('שגיאה במחיקת השירות', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
        },
      });
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { LaundryServiceService } from '../../../services/laundry-service.service';
import { Service } from '../../../models/service.model';
import { Order } from '../../../models/order.model';
import { OrderItem } from '../../../models/order-item.model';
import { OrderService } from '../../../services/order.service';
import { OrderImage } from '../../../models/order-image.model';
import { MatDialog } from '@angular/material/dialog';
import { CustomerCreateDialogComponent } from '../../customers/customer-create-dialog/customer-create-dialog.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatOptionModule,
    MatIconModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    public customerService: CustomerService,
    public laundryService: LaundryServiceService,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {}
  orderForm!: FormGroup;
  isEditMode = false;
  orderId!: number;
  serviceFiltersMap = new Map<number, Observable<Service[]>>();
  deletedImageIds: Set<number> = new Set<number>();


  // Lists and autocomplete
  customers: Customer[] = [];
  services: Service[] = [];
  filteredCustomers: Observable<Customer[]> | undefined;
  filteredServices: Observable<Service[]> | undefined;
  statusOptions = ['Pending', 'Processing', 'Completed', 'Cancelled'];
  // Array to store the selected image files
  selectedFiles: OrderImage[] = [];
  
  // Hebrew translations for status options
  statusTranslations = {
    'Pending': 'ממתין',
    'Processing': 'בטיפול',
    'Completed': 'הושלם',
    'Cancelled': 'בוטל'
  };

  ngOnInit(): void {
    // Set document direction for RTL
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'he';
    
    this.createForm();
    this.loadCustomers();
    this.loadServices();

    // Check if we're in edit mode
    this.route.params.subscribe((params) => {
      if (!isNaN(params['id'])) {
        this.isEditMode = true;
        this.orderId = +params['id'];
        this.loadOrder(this.orderId);
      }
    });

    // Setup customer autocomplete filter
    this.filteredCustomers = this.orderForm?.get('customerSearch')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterCustomers(name) : this.customers.slice()
        )
      );

    // Initialize the first order item's service autocomplete
    this.updateServiceFilters();
  }

  // loadImages(orderId: number): void {
  //   this.orderService.getOrderImages(orderId).subscribe({
  //     next: data => {
  //       this.selectedFiles = data.map(img => {
  //         const selectedFile: OrderImage = {
  //           fileName: img.fileName,
  //           data: img.base64,
  //           contentType: img.contentType
  //         }

  //         return selectedFile
  //       });
  //     },
  //     error: err => {
  //       console.error('Failed to load images', err);
  //     }
  //   });
  // }

  createForm(): void {
    this.orderForm = this.fb.group({
      id: [null],
      customerId: [null, Validators.required],
      customerSearch: [''],
      orderDate: [new Date(), Validators.required],
      status: ['Pending', Validators.required],
      totalAmount: [0],
      orderItems: this.fb.array([])
    });

    // Add initial empty order item
    this.addOrderItem();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = data;
    });
  }

  loadServices(): void {
    this.laundryService.getServices().subscribe(data => {
      this.services = data;
    });
  }

  loadOrder(id: number): void {
    this.orderService.getOrder(id).subscribe(order => {

      const utcDate = new Date(order.orderDate);
      const localDate = new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * -60000));
      // Populate form with order data
      this.orderForm?.patchValue({
        id: order.id,
        customerId: order.customerId,
        customerSearch: order.customer,
        orderDate: localDate,
        status: order.status,
        totalAmount: order.totalAmount
      });

      if(order.orderImages){
        this.selectedFiles = order.orderImages.map(o => {
          return {
            ...o,
            data: 'data:' + o.contentType + ';base64,' + o.data
          }
        })
        console.log(this.selectedFiles);
        
      }

      // Clear default order items and add the existing ones
      this.orderItemsArray.clear();
      order.orderItems.forEach(item => {
        console.log(item);
        
        this.orderItemsArray.push(this.createOrderItemGroup(item));
      });
      
      this.updateServiceFilters();
      this.calculateTotal();
    });
  }

  // Getters for form access
  get orderItemsArray(): FormArray {
    return this.orderForm.get('orderItems') as FormArray;
  }

  // Create form group for order item
  createOrderItemGroup(item?: OrderItem): FormGroup {
    return this.fb.group({
      id: [item?.id || null],
      serviceId: [item?.serviceId || null, Validators.required],
      serviceSearch: [item?.service || ''],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      price: [item?.price || 0]
    });
  }

  // Add new order item
  addOrderItem(): void {
    this.orderItemsArray.push(this.createOrderItemGroup());
    this.updateServiceFilters();
  }

  // Remove order item
  removeOrderItem(index: number): void {
    this.orderItemsArray.removeAt(index);
    this.calculateTotal();
  }

  // Handle file selection for images
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    
    if (files) {
      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        // Check if it's an image
        if (file.type.match(/image\/*/) !== null) {
          // Read and create a preview
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.selectedFiles.push({
              file: file,
              fileName: file.name,
              data: e.target.result,
            });
            console.log(this.selectedFiles);
            
          };
          reader.readAsDataURL(file);
        }
      }
    }
    
    // Reset file input
    event.target.value = '';
  }

  // Remove image from selected files
  removeImage( orderImage: OrderImage ,index: number): void {
    if(orderImage.id){
      this.deletedImageIds.add(orderImage?.id)
    }
    this.selectedFiles.splice(index, 1);
  }

  // Update service autocomplete filters for all order items
  updateServiceFilters(): void {
    for (let i = 0; i < this.orderItemsArray.length; i++) {
      const itemGroup = this.orderItemsArray.at(i);
      const control = itemGroup.get('serviceSearch');
      if (control) {
        const filtered: Observable<Service[]> = control.valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value?.name || ''),
          map(name => name ? this._filterServices(name) : this.services.slice())
        );
        this.serviceFiltersMap.set(i, filtered);
      }
    }
  }
  
  // Get Hebrew translation for status
  getStatusTranslation(status: string): string {
    return this.statusTranslations[status as keyof typeof this.statusTranslations] || status;
  }

  // Filter functions for autocomplete
  private _filterCustomers(value: string): Customer[] {
    const filterValue = value.toLowerCase();
    return this.customers.filter(customer => 
      customer.name.toLowerCase().includes(filterValue) || 
      customer.phone.toLowerCase().includes(filterValue) ||
      customer?.email?.toLowerCase()?.includes(filterValue)
    );
  }

  private _filterServices(value: string): Service[] {
    const filterValue = value.toLowerCase();
    return this.services.filter(service => 
      service.name.toLowerCase().includes(filterValue) || 
      service.description.toLowerCase().includes(filterValue)
    );
  }

  // Display functions for autocomplete
  displayCustomer(customer: Customer): string {
    return customer && customer.name ? customer.name : '';
  }

  displayService(service: Service): string {
    return service && service.name ? service.name : '';
  }

  // Select customer from autocomplete
  selectCustomer(event: any): void {
    const customer = event.option.value;
    this.orderForm?.patchValue({
      customerId: customer.id
    });
  }

  // Select service from autocomplete
  selectService(event: any, index: number): void {
    const service = event.option.value;
    const itemGroup = this.orderItemsArray.at(index);
    
    itemGroup.patchValue({
      serviceId: service.id,
      price: service.price
    });
    
    this.calculateTotal();
  }

  // Calculate total order amount
  calculateTotal(): void {
    const total = this.orderItemsArray.controls.reduce((sum, item) => {
      // const quantity = item?.get('quantity')?.value || 0;
      const price = item?.get('price')?.value || 0;
      // return sum + (quantity * price);
      return sum + price;
    }, 0);
    
    this.orderForm?.patchValue({
      totalAmount: total
    });
  }

  // Handle quantity changes
  onQuantityChange(): void {
    this.calculateTotal();
  }


  onSubmit(): void {
    if (this.orderForm.invalid) {
      const controls = this.orderForm.controls;
    
      // אם שדה customerId הוא הבעיה היחידה
      const isOnlyCustomerMissing = !controls['customerId']?.value &&
        Object.entries(controls).every(([key, control]) => {
          return key === 'customerId' || control.valid;
        });
    
      if (isOnlyCustomerMissing) {
        this.dialog.open(CustomerCreateDialogComponent).afterClosed().subscribe((result: Customer | undefined) => {
          if (result) {
            this.customerService.createCustomer(result).subscribe({
              next: (newCustomer) => {
                this.orderForm.patchValue({ customerId: newCustomer.id });
                // בדיקה מחודשת - עכשיו כל השדות כולל customerId מלאים
                if (this.orderForm.valid) {
                  this.continueSubmit();
                }
              },
              error: () => {
                this.snackBar.open('שגיאה ביצירת לקוח חדש', 'סגור', {
                  duration: 3000,
                  direction: 'rtl'
                });
              }
            });
          }
        });
        return; // מחכים לתוצאה של הדיאלוג
      }
    
      // אחרת - הטופס לא תקין באופן כללי
      this.snackBar.open('אנא מלא את כל השדות הנדרשים', 'סגור', {
        duration: 3000,
        direction: 'rtl'
      });
      return;
    }
    
    // כל השדות תקינים, כולל לקוח קיים
    this.continueSubmit();
    
  }

  continueSubmit(): void {
    const orderData = this.prepareOrderData();
  
    if (this.isEditMode) {
      this.orderService.updateOrder(this.orderId, this.removeIdKey(orderData)).subscribe(
        () => {
          this.uploadImages(this.orderId);
  
          this.deletedImageIds.forEach(imageId => {
            this.orderService.deleteImage(imageId).subscribe();
          });
  
          this.snackBar.open('ההזמנה עודכנה בהצלחה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
          this.router.navigate(['/orders']);
        },
        error => {
          this.snackBar.open('שגיאה בעדכון ההזמנה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
          console.error(error);
        }
      );
    } else {
      this.orderService.createOrder(this.removeIdKey(orderData)).subscribe(
        (order: Order) => {
          this.uploadImages(order?.id);
          this.snackBar.open('ההזמנה נוצרה בהצלחה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
          this.router.navigate(['/orders']);
        },
        error => {
          this.snackBar.open('שגיאה ביצירת ההזמנה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
          console.error(error);
        }
      );
    }
  }
  
  

  // Submit form
  // onSubmit(): void {
  //   if (this.orderForm?.invalid) {
  //     this.snackBar.open('אנא מלא את כל השדות הנדרשים', 'סגור', {
  //       duration: 3000,
  //       direction: 'rtl'
  //     });
  //     return;
  //   }

  //   const orderData = this.prepareOrderData();
    
  //   if (this.isEditMode) {
  //     this.orderService.updateOrder(this.orderId, this.removeIdKey(orderData)).subscribe(
  //       () => {
  //         this.uploadImages(this.orderId);

  //         this.deletedImageIds.forEach(imageId => {
  //           this.orderService.deleteImage(imageId).subscribe();
  //         });

  //         this.snackBar.open('ההזמנה עודכנה בהצלחה', 'סגור', {
  //           duration: 3000,
  //           direction: 'rtl'
  //         });
  //         this.router.navigate(['/orders']);
  //       },
  //       error => {
  //         this.snackBar.open('שגיאה בעדכון ההזמנה', 'סגור', {
  //           duration: 3000,
  //           direction: 'rtl'
  //         });
  //         console.error(error);
  //       }
  //     );
  //   } else {      
  //     this.orderService.createOrder(this.removeIdKey(orderData)).subscribe(
  //       (order: Order) => {
  //         this.uploadImages(order?.id);
  //         this.snackBar.open('ההזמנה נוצרה בהצלחה', 'סגור', {
  //           duration: 3000,
  //           direction: 'rtl'
  //         });
  //         this.router.navigate(['/orders']);
  //       },
  //       error => {
  //         this.snackBar.open('שגיאה ביצירת ההזמנה', 'סגור', {
  //           duration: 3000,
  //           direction: 'rtl'
  //         });
  //         console.error(error);
  //       }
  //     );
  //   }
  // }

  uploadImages(orderId?: number): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      return; // No files to upload
    }
  
    const formData = new FormData();
    this.selectedFiles.forEach(fileObj => {
      if(fileObj.file){
        formData.append('files', fileObj.file, fileObj.fileName);
      }
    });
  
    this.orderService.uploadImages(orderId, formData).subscribe({
      next: () => {
        console.log('Images uploaded successfully');
        this.selectedFiles = []; // Optionally reset the file array
      },
      error: err => {
        console.error('Image upload failed:', err);
      }
    });
  }
  

  removeIdKey(data: any) {
    // Check if the data is an object and has an 'id' property
    if (data && typeof data === 'object' && data.hasOwnProperty('id') && (data.id === null || data.id === undefined)) {
      delete data.id; // Remove the 'id' property
    }
  
    // If 'orderItems' is an array, iterate through each item and remove 'id' from them as well
    if (data.orderItems && Array.isArray(data.orderItems)) {
      data.orderItems.forEach((item: any) => {
        if (item && typeof item === 'object' && item.hasOwnProperty('id')) {
          delete item.id;
        }
      });
    }
  
    return data;
  }

  getFilteredServices(index: number): Observable<Service[]> | null {
    return this.serviceFiltersMap.get(index) ?? null;
  }

  // Prepare order data for API
  prepareOrderData(): Order {
    const formValue = this.orderForm?.value;
    
    // Format the date properly
    const orderDate = formValue.orderDate instanceof Date ? 
      formValue.orderDate.toISOString() : formValue.orderDate;
    
    // Prepare order items
    const orderItems = this.orderItemsArray.controls.map(item => {
      return {
        id: item.get('id')?.value,
        serviceId: item.get('serviceId')?.value,
        quantity: item.get('quantity')?.value,
        price: item.get('price')?.value
      };
    });
    
    return {
      id: formValue.id,
      customerId: formValue.customerId,
      orderDate: orderDate,
      status: formValue.status,
      totalAmount: formValue.totalAmount,
      orderItems: orderItems
    };
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
}
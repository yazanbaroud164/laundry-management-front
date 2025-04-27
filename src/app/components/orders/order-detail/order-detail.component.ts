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
    private orderService: OrderService
  ) {}
  orderForm!: FormGroup;
  isEditMode = false;
  orderId!: number;
  serviceFiltersMap = new Map<number, Observable<Service[]>>();


  // Lists and autocomplete
  customers: Customer[] = [];
  services: Service[] = [];
  filteredCustomers: Observable<Customer[]> | undefined;
  filteredServices: Observable<Service[]> | undefined;
  statusOptions = ['Pending', 'Processing', 'Completed', 'Cancelled'];
  
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
      // Populate form with order data
      this.orderForm?.patchValue({
        id: order.id,
        customerId: order.customerId,
        customerSearch: order.customer,
        orderDate: new Date(order.orderDate),
        status: order.status,
        totalAmount: order.totalAmount
      });

      // Clear default order items and add the existing ones
      this.orderItemsArray.clear();
      order.orderItems.forEach(item => {
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
      customer.email.toLowerCase().includes(filterValue)
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
      const quantity = item?.get('quantity')?.value || 0;
      const price = item?.get('price')?.value || 0;
      return sum + (quantity * price);
    }, 0);
    
    this.orderForm?.patchValue({
      totalAmount: total
    });
  }

  // Handle quantity changes
  onQuantityChange(): void {
    this.calculateTotal();
  }

  // Submit form
  onSubmit(): void {
    if (this.orderForm?.invalid) {
      this.snackBar.open('אנא מלא את כל השדות הנדרשים', 'סגור', {
        duration: 3000,
        direction: 'rtl'
      });
      return;
    }

    const orderData = this.prepareOrderData();
    
    if (this.isEditMode) {
      this.orderService.updateOrder(this.orderId, orderData).subscribe(
        () => {
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
        (result: Order) => {
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

  removeIdKey(data: any) {
    // Check if the data is an object and has an 'id' property
    if (data && typeof data === 'object' && data.hasOwnProperty('id')) {
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
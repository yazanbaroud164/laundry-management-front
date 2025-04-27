// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Customer } from '../../../models/customer.model';
// import { CustomerService } from '../../../services/customer.service';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-customer-detail',
//   standalone: true,
//   imports: [CommonModule,MatFormFieldModule, MatCardModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
//   templateUrl: './customer-detail.component.html',
//   styleUrl: './customer-detail.component.scss',
// })
// export class CustomerDetailComponent implements OnInit {
//   customerId: number | null = null;
//   isNewCustomer: boolean = true;
//   customerForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private customerService: CustomerService,
//     private snackBar: MatSnackBar
//   ) {
//     this.customerForm = this.fb.group({
//       id: [0],
//       name: ['', [Validators.required, Validators.maxLength(100)]],
//       email: ['', [Validators.required, Validators.email]],
//       phone: ['', [Validators.required]],
//       address: ['', [Validators.required]],
//     });
//   }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');

//     if (id && id !== 'new') {
//       this.customerId = +id;
//       this.isNewCustomer = false;
//       this.loadCustomer(this.customerId);
//     }
//   }

//   loadCustomer(id: number): void {
//     this.customerService.getCustomer(id).subscribe({
//       next: (customer) => {
//         this.customerForm.patchValue(customer);
//       },
//       error: (error) => {
//         console.error('Error loading customer', error);
//         this.snackBar.open('Error loading customer details', 'Close', {
//           duration: 3000,
//         });
//       },
//     });
//   }

//   saveCustomer(): void {
//     if (this.customerForm.invalid) {
//       return;
//     }

//     const customer: Customer = this.customerForm.value;

//     if (this.isNewCustomer) {
//       this.customerService.createCustomer(customer).subscribe({
//         next: () => {
//           this.snackBar.open('Customer created successfully', 'Close', {
//             duration: 3000,
//           });
//           this.router.navigate(['/customers']);
//         },
//         error: (error) => {
//           console.error('Error creating customer', error);
//           this.snackBar.open('Error creating customer', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     } else {
//       this.customerService.updateCustomer(customer.id, customer).subscribe({
//         next: () => {
//           this.snackBar.open('Customer updated successfully', 'Close', {
//             duration: 3000,
//           });
//           this.router.navigate(['/customers']);
//         },
//         error: (error) => {
//           console.error('Error updating customer', error);
//           this.snackBar.open('Error updating customer', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     }
//   }

//   cancel(): void {
//     this.router.navigate(['/customers']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatCardModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss',
})
export class CustomerDetailComponent implements OnInit {
  customerId: number | null = null;
  isNewCustomer: boolean = true;
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private snackBar: MatSnackBar
  ) {
    // Set document direction for the entire application to support RTL
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl');
    
    this.customerForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.customerId = +id;
      this.isNewCustomer = false;
      this.loadCustomer(this.customerId);
    }
  }

  loadCustomer(id: number): void {
    this.customerService.getCustomer(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue(customer);
      },
      error: (error) => {
        console.error('Error loading customer', error);
        this.snackBar.open('שגיאה בטעינת פרטי לקוח', 'סגור', {
          duration: 3000,
          direction: 'rtl'
        });
      },
    });
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.customerForm.controls).forEach(key => {
        const control = this.customerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const customer: Customer = this.customerForm.value;

    if (this.isNewCustomer) {
      this.customerService.createCustomer(customer).subscribe({
        next: () => {
          this.snackBar.open('הלקוח נוצר בהצלחה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error creating customer', error);
          this.snackBar.open('שגיאה ביצירת לקוח', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
        },
      });
    } else {
      this.customerService.updateCustomer(customer.id, customer).subscribe({
        next: () => {
          this.snackBar.open('הלקוח עודכן בהצלחה', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error updating customer', error);
          this.snackBar.open('שגיאה בעדכון הלקוח', 'סגור', {
            duration: 3000,
            direction: 'rtl'
          });
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }
}
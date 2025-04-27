// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { Service } from '../../../models/service.model';
// import { LaundryServiceService } from '../../../services/laundry-service.service';

// @Component({
//   selector: 'app-service-detail',
//   standalone: true,
//   imports: [CommonModule,MatFormFieldModule, MatCardModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
//   templateUrl: './service-detail.component.html',
//   styleUrl: './service-detail.component.scss',
// })
// export class ServiceDetailComponent implements OnInit {
//   serviceId: number | null = null;
//   isNewService: boolean = true;
//   serviceForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private router: Router,
//     private laundryServiceService: LaundryServiceService,
//     private snackBar: MatSnackBar
//   ) {
//     this.serviceForm = this.fb.group({
//       id: [0],
//       name: ['', [Validators.required, Validators.maxLength(100)]],
//       description: ['', [Validators.required]],
//       price: [null, [Validators.required]],
//     });
//   }

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');

//     if (id && id !== 'new') {
//       this.serviceId = +id;
//       this.isNewService = false;
//       this.loadService(this.serviceId);
//     }
//   }

//   loadService(id: number): void {
//     this.laundryServiceService.getService(id).subscribe({
//       next: (service) => {
//         this.serviceForm.patchValue(service);
//       },
//       error: (error) => {
//         console.error('Error loading service', error);
//         this.snackBar.open('Error loading service details', 'Close', {
//           duration: 3000,
//         });
//       },
//     });
//   }

//   saveLaundryService(): void {
//     if (this.serviceForm.invalid) {
//       return;
//     }

//     const service: Service = this.serviceForm.value;

//     if (this.isNewService) {
//       this.laundryServiceService.createService(service).subscribe({
//         next: () => {
//           this.snackBar.open('laundry Service created successfully', 'Close', {
//             duration: 3000,
//           });
//           this.router.navigate(['/services']);
//         },
//         error: (error) => {
//           console.error('Error creating laundry Service', error);
//           this.snackBar.open('Error creating laundry Service', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     } else {
//       this.laundryServiceService.updateService(service.id, service).subscribe({
//         next: () => {
//           this.snackBar.open('laundry Service updated successfully', 'Close', {
//             duration: 3000,
//           });
//           this.router.navigate(['/services']);
//         },
//         error: (error) => {
//           console.error('Error updating laundry Service', error);
//           this.snackBar.open('Error updating laundry Service', 'Close', {
//             duration: 3000,
//           });
//         },
//       });
//     }
//   }

//   cancel(): void {
//     this.router.navigate(['/services']);
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Service } from '../../../models/service.model';
import { LaundryServiceService } from '../../../services/laundry-service.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './service-detail.component.html',
  styleUrl: './service-detail.component.scss',
})
export class ServiceDetailComponent implements OnInit {
  serviceId: number | null = null;
  isNewService: boolean = true;
  serviceForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private laundryServiceService: LaundryServiceService,
    private snackBar: MatSnackBar
  ) {
    this.serviceForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required]],
      price: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id && id !== 'new') {
      this.serviceId = +id;
      this.isNewService = false;
      this.loadService(this.serviceId);
    }
  }

  loadService(id: number): void {
    this.laundryServiceService.getService(id).subscribe({
      next: (service) => {
        this.serviceForm.patchValue(service);
      },
      error: (error) => {
        console.error('Error loading service', error);
        this.snackBar.open('שגיאה בטעינת פרטי השירות', 'סגור', {
          duration: 3000,
        });
      },
    });
  }

  saveLaundryService(): void {
    if (this.serviceForm.invalid) {
      return;
    }

    const service: Service = this.serviceForm.value;

    if (this.isNewService) {
      this.laundryServiceService.createService(service).subscribe({
        next: () => {
          this.snackBar.open('השירות נוסף בהצלחה', 'סגור', {
            duration: 3000,
          });
          this.router.navigate(['/services']);
        },
        error: (error) => {
          console.error('Error creating laundry service', error);
          this.snackBar.open('שגיאה ביצירת השירות', 'סגור', {
            duration: 3000,
          });
        },
      });
    } else {
      this.laundryServiceService.updateService(service.id, service).subscribe({
        next: () => {
          this.snackBar.open('השירות עודכן בהצלחה', 'סגור', {
            duration: 3000,
          });
          this.router.navigate(['/services']);
        },
        error: (error) => {
          console.error('Error updating laundry service', error);
          this.snackBar.open('שגיאה בעדכון השירות', 'סגור', {
            duration: 3000,
          });
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/services']);
  }
}

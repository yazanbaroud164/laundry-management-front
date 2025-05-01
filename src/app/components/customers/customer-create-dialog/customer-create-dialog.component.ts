// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDialogRef } from '@angular/material/dialog';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

// @Component({
//   selector: 'app-customer-create-dialog',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//   ],
//   templateUrl: './customer-create-dialog.component.html',
//   styleUrl: './customer-create-dialog.component.scss',
// })
// export class CustomerCreateDialogComponent {
//   customerForm = new FormGroup({
//     name: new FormControl('', Validators.required),
//     phone: new FormControl('', [
//       Validators.required,
//       Validators.pattern(/^\d{9,10}$/),
//     ]),
//   });

//   constructor(public dialogRef: MatDialogRef<CustomerCreateDialogComponent>) {}

//   onSubmit(): void {
//     if (this.customerForm.valid) {
//       this.dialogRef.close(this.customerForm.value);
//     }
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-customer-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './customer-create-dialog.component.html',
  styleUrls: ['./customer-create-dialog.component.scss']
})
export class CustomerCreateDialogComponent implements OnInit {
  customerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{9,10}$/),
    ]),
  });

  constructor(public dialogRef: MatDialogRef<CustomerCreateDialogComponent>) {}

  ngOnInit(): void {
    // Set the dialog width dynamically based on screen size
    this.setDialogSize();
    window.addEventListener('resize', this.setDialogSize.bind(this));
  }

  setDialogSize(): void {
    const width = window.innerWidth;
    if (width < 600) {
      this.dialogRef.updateSize('95%', '');
    } else {
      this.dialogRef.updateSize('450px', '');
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      this.dialogRef.close(this.customerForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
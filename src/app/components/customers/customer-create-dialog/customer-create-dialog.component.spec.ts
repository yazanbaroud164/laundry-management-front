import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerCreateDialogComponent } from './customer-create-dialog.component';

describe('CustomerCreateDialogComponent', () => {
  let component: CustomerCreateDialogComponent;
  let fixture: ComponentFixture<CustomerCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerCreateDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

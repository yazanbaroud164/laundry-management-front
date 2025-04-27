// nav-bar.component.ts
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, RouterModule, MatButtonModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  title = 'מערכת ניהול כביסה';
  isHandset = false;
  private destroy$ = new Subject<void>();

  // Navigation items with Hebrew translations
  navItems = [
    { route: '/dashboard', icon: 'dashboard', label: 'לוח בקרה' },
    { route: '/customers', icon: 'people', label: 'לקוחות' },
    { route: '/services', icon: 'local_laundry_service', label: 'שירותים' },
    { route: '/products', icon: 'inventory', label: 'מוצרים' },
    { route: '/orders', icon: 'receipt', label: 'הזמנות' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isHandset = result.matches;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
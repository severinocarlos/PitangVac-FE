import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-badge-button',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './badge-button.component.html',
  styleUrl: './badge-button.component.scss'
})
export class BadgeButtonComponent {
  @Input() text = '';
  @Input() quantityObserver$!: Observable<number>;
}

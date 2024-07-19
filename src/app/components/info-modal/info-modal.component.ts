import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss'
})
export class InfoModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: InfoModalData) {}
}

interface InfoModalData {
  title?: string,
  message?: string,
  icon: Icon
}

interface Icon {
  name: string,
  color: string,
}
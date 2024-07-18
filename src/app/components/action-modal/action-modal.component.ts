import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-action-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './action-modal.component.html',
  styleUrl: './action-modal.component.scss'
})
export class ActionModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ActionModalData) {}
}

interface ActionModalData {
  title?: string,
  message?: string,
}

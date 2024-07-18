import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private readonly _snackBar = inject(MatSnackBar);


  openSnackBar(message: string, action?: string, snackType: SnackTypes = 'default') {
    console.log(snackType)

    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'bottom',
      horizontalPosition: 'end',
      panelClass: [snackType]
    });
  }

}


type SnackTypes = 'snackbar-success' | 'snackbar-info' | 'snackbar-fail' | 'default';